import dotenv from "dotenv";
import connectDB from "../config/database.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import Food from "../models/Food.js";
import AdminDashboard from "../models/AdminDashboard.js";
import AdminActivity from "../models/AdminActivity.js";
import OwnerAnalytics from "../models/OwnerAnalytics.js";
import OwnerActivity from "../models/OwnerActivity.js";

dotenv.config({ path: ".env" });

const dryRun = process.argv.includes("--dry-run");

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date) => {
  const d = startOfDay(date);
  d.setDate(d.getDate() + 1);
  return d;
};

const dayKey = (date) => startOfDay(date).toISOString().slice(0, 10);

const toId = (value) => String(value);

const backfillAnalytics = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const firstOrder = await Order.findOne()
      .sort({ createdAt: 1 })
      .select("createdAt")
      .lean();
    if (!firstOrder) {
      console.log("No orders found. Nothing to backfill.");
      process.exit(0);
    }

    const firstDay = startOfDay(firstOrder.createdAt);
    const today = startOfDay(new Date());

    const [adminUser, restaurants, foods, allOrdersForCustomerHistory] =
      await Promise.all([
        User.findOne({ role: "admin" }).select("_id").lean(),
        Restaurant.find()
          .select(
            "_id owner name createdAt approvalStatus isActive isSuspended",
          )
          .lean(),
        Food.find().select("_id name restaurant createdAt isAvailable").lean(),
        Order.find({ "orderItems.restaurant": { $exists: true, $ne: null } })
          .select("user createdAt orderItems.restaurant")
          .sort({ createdAt: 1 })
          .lean(),
      ]);

    const restaurantById = new Map(restaurants.map((r) => [toId(r._id), r]));
    const foodsByRestaurant = new Map();
    const foodById = new Map();

    for (const food of foods) {
      const restaurantId = toId(food.restaurant);
      if (!foodsByRestaurant.has(restaurantId)) {
        foodsByRestaurant.set(restaurantId, []);
      }
      foodsByRestaurant.get(restaurantId).push(food);
      foodById.set(toId(food._id), food);
    }

    const firstOrderDayByRestaurantUser = new Map();
    for (const order of allOrdersForCustomerHistory) {
      const userId = toId(order.user);
      const orderDay = dayKey(order.createdAt);
      const restaurantSet = new Set(
        (order.orderItems || [])
          .map((item) => item.restaurant)
          .filter(Boolean)
          .map((restaurantId) => toId(restaurantId)),
      );

      for (const restaurantId of restaurantSet) {
        const key = `${restaurantId}:${userId}`;
        if (!firstOrderDayByRestaurantUser.has(key)) {
          firstOrderDayByRestaurantUser.set(key, orderDay);
        }
      }
    }

    let processedDays = 0;
    let upsertedAdminDashboards = 0;
    let upsertedOwnerAnalytics = 0;
    let createdAdminActivities = 0;
    let createdOwnerActivities = 0;

    for (
      let date = new Date(firstDay);
      date <= today;
      date.setDate(date.getDate() + 1)
    ) {
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      const currentDayKey = dayKey(dayStart);

      const dayOrders = await Order.find({
        createdAt: { $gte: dayStart, $lt: dayEnd },
      })
        .select(
          "user orderItems totalPrice orderStatus createdAt deliveredAt estimatedDeliveryTime",
        )
        .lean();

      const [
        totalOrders,
        totalRestaurants,
        activeRestaurants,
        suspendedRestaurants,
        totalUsers,
        activeUsers,
        blockedUsers,
        pendingApprovals,
      ] = await Promise.all([
        Order.countDocuments({ createdAt: { $lte: dayEnd } }),
        Restaurant.countDocuments({
          approvalStatus: "approved",
          createdAt: { $lte: dayEnd },
        }),
        Restaurant.countDocuments({
          isActive: true,
          isSuspended: false,
          createdAt: { $lte: dayEnd },
        }),
        Restaurant.countDocuments({
          isSuspended: true,
          createdAt: { $lte: dayEnd },
        }),
        User.countDocuments({ role: "user", createdAt: { $lte: dayEnd } }),
        User.countDocuments({
          role: "user",
          isBlocked: false,
          createdAt: { $lte: dayEnd },
        }),
        User.countDocuments({ isBlocked: true, createdAt: { $lte: dayEnd } }),
        Restaurant.countDocuments({
          approvalStatus: "pending",
          createdAt: { $lte: dayEnd },
        }),
      ]);

      const deliveredDayOrders = dayOrders.filter(
        (order) => order.orderStatus === "Delivered",
      );
      const cancelledDayOrders = dayOrders.filter(
        (order) => order.orderStatus === "Cancelled",
      );

      const deliveredOrdersToday = deliveredDayOrders.length;
      const cancelledOrdersToday = cancelledDayOrders.length;
      const newOrdersToday = dayOrders.length;
      const revenueToday = deliveredDayOrders.reduce(
        (sum, order) => sum + (order.totalPrice || 0),
        0,
      );

      const deliveredRevenueTotal = await Order.aggregate([
        {
          $match: {
            orderStatus: "Delivered",
            createdAt: { $lte: dayEnd },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
      ]);
      const totalRevenue = deliveredRevenueTotal[0]?.totalRevenue || 0;

      const topRestaurantMap = new Map();
      const topFoodMap = new Map();

      for (const order of deliveredDayOrders) {
        for (const item of order.orderItems || []) {
          if (!item.restaurant || !item.food) {
            continue;
          }

          const restaurantId = toId(item.restaurant);
          const foodId = toId(item.food);
          const quantity = item.quantity || 0;
          const itemRevenue = item.itemTotal || (item.price || 0) * quantity;

          if (!topRestaurantMap.has(restaurantId)) {
            topRestaurantMap.set(restaurantId, {
              restaurant: item.restaurant,
              orders: 0,
              revenue: 0,
            });
          }
          const restaurantStats = topRestaurantMap.get(restaurantId);
          restaurantStats.orders += 1;
          restaurantStats.revenue += itemRevenue;

          if (!topFoodMap.has(foodId)) {
            topFoodMap.set(foodId, { food: item.food, orders: 0, revenue: 0 });
          }
          const foodStats = topFoodMap.get(foodId);
          foodStats.orders += quantity;
          foodStats.revenue += itemRevenue;
        }
      }

      const topRestaurants = Array.from(topRestaurantMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
      const topFoods = Array.from(topFoodMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      const dashboardPayload = {
        date: dayStart,
        totalOrders,
        totalRevenue,
        totalRestaurants,
        activeRestaurants,
        suspendedRestaurants,
        totalUsers,
        activeUsers,
        blockedUsers,
        newOrdersToday,
        deliveredOrdersToday,
        cancelledOrdersToday,
        revenueToday,
        topRestaurants,
        topFoods,
        pendingDisputes: 0,
        pendingApprovals,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        orderCompletionRate:
          newOrdersToday > 0
            ? (deliveredOrdersToday / newOrdersToday) * 100
            : 0,
      };

      if (!dryRun) {
        await AdminDashboard.findOneAndUpdate(
          { date: { $gte: dayStart, $lt: dayEnd } },
          { $set: dashboardPayload },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        );
        upsertedAdminDashboards += 1;

        if (adminUser?._id) {
          const existingAdminLog = await AdminActivity.findOne({
            admin: adminUser._id,
            actionType: "generate_report",
            description: `Backfill snapshot generated for ${currentDayKey}`,
          }).lean();

          if (!existingAdminLog) {
            await AdminActivity.create({
              admin: adminUser._id,
              actionType: "generate_report",
              entityType: "system",
              description: `Backfill snapshot generated for ${currentDayKey}`,
              status: "success",
              createdAt: dayStart,
            });
            createdAdminActivities += 1;
          }
        }
      }

      for (const restaurant of restaurants) {
        const restaurantId = toId(restaurant._id);
        const relatedOrders = dayOrders.filter((order) =>
          (order.orderItems || []).some(
            (item) => item.restaurant && toId(item.restaurant) === restaurantId,
          ),
        );

        const totalRestaurantOrders = relatedOrders.length;
        const deliveredRestaurantOrders = relatedOrders.filter(
          (order) => order.orderStatus === "Delivered",
        );
        const rejectedRestaurantOrders = relatedOrders.filter(
          (order) => order.orderStatus === "Cancelled",
        );
        const acceptedRestaurantOrders = relatedOrders.filter(
          (order) =>
            order.orderStatus !== "Pending" &&
            order.orderStatus !== "Cancelled",
        );
        const pendingRestaurantOrders = relatedOrders.filter(
          (order) => order.orderStatus === "Pending",
        );

        const topSellingFoodMap = new Map();
        const peakHourMap = new Map();
        let totalItemsSold = 0;
        let totalRestaurantRevenue = 0;
        let totalDeliveryMinutes = 0;
        let deliveryTimeSamples = 0;

        const userSet = new Set();
        let newCustomers = 0;
        let returningCustomers = 0;

        for (const order of relatedOrders) {
          const userId = toId(order.user);
          if (!userSet.has(userId)) {
            userSet.add(userId);
            const firstDayForUser = firstOrderDayByRestaurantUser.get(
              `${restaurantId}:${userId}`,
            );
            if (firstDayForUser === currentDayKey) {
              newCustomers += 1;
            } else {
              returningCustomers += 1;
            }
          }

          const orderHour = new Date(order.createdAt).getHours();
          peakHourMap.set(orderHour, (peakHourMap.get(orderHour) || 0) + 1);

          for (const item of order.orderItems || []) {
            if (!item.restaurant || toId(item.restaurant) !== restaurantId) {
              continue;
            }

            const quantity = item.quantity || 0;
            const itemRevenue = item.itemTotal || (item.price || 0) * quantity;

            if (order.orderStatus === "Delivered") {
              totalItemsSold += quantity;
              totalRestaurantRevenue += itemRevenue;

              const foodId = item.food ? toId(item.food) : null;
              if (foodId) {
                if (!topSellingFoodMap.has(foodId)) {
                  topSellingFoodMap.set(foodId, {
                    food: item.food,
                    name: item.name || foodById.get(foodId)?.name || "",
                    quantity: 0,
                    revenue: 0,
                  });
                }
                const foodStats = topSellingFoodMap.get(foodId);
                foodStats.quantity += quantity;
                foodStats.revenue += itemRevenue;
              }
            }
          }

          if (order.orderStatus === "Delivered") {
            if (order.deliveredAt && order.createdAt) {
              const minutes =
                (new Date(order.deliveredAt) - new Date(order.createdAt)) /
                (1000 * 60);
              if (minutes > 0) {
                totalDeliveryMinutes += minutes;
                deliveryTimeSamples += 1;
              }
            } else if (typeof order.estimatedDeliveryTime === "number") {
              totalDeliveryMinutes += order.estimatedDeliveryTime;
              deliveryTimeSamples += 1;
            }
          }
        }

        const topSellingFoods = Array.from(topSellingFoodMap.values())
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);

        const peakHours = Array.from(peakHourMap.entries())
          .map(([hour, orders]) => ({ hour, orders }))
          .sort((a, b) => b.orders - a.orders)
          .slice(0, 5);

        const totalMenuItems = (foodsByRestaurant.get(restaurantId) || [])
          .length;
        const activeMenuItems = (
          foodsByRestaurant.get(restaurantId) || []
        ).filter((food) => food.isAvailable).length;

        const ownerPayload = {
          restaurant: restaurant._id,
          owner: restaurant.owner,
          date: dayStart,
          totalOrders: totalRestaurantOrders,
          acceptedOrders: acceptedRestaurantOrders.length,
          rejectedOrders: rejectedRestaurantOrders.length,
          cancelledOrders: rejectedRestaurantOrders.length,
          deliveredOrders: deliveredRestaurantOrders.length,
          totalRevenue: totalRestaurantRevenue,
          totalItemsSold,
          averageOrderValue:
            totalRestaurantOrders > 0
              ? totalRestaurantRevenue / totalRestaurantOrders
              : 0,
          averageRating: 0,
          orderAcceptanceRate:
            totalRestaurantOrders > 0
              ? (acceptedRestaurantOrders.length / totalRestaurantOrders) * 100
              : 0,
          orderCompletionRate:
            totalRestaurantOrders > 0
              ? (deliveredRestaurantOrders.length / totalRestaurantOrders) * 100
              : 0,
          topSellingFoods,
          peakHours,
          newCustomers,
          returningCustomers,
          activeMenuItems,
          totalMenuItems,
          averageDeliveryTime:
            deliveryTimeSamples > 0
              ? totalDeliveryMinutes / deliveryTimeSamples
              : 0,
          pendingOrders: pendingRestaurantOrders.length,
          disputes: 0,
        };

        if (!dryRun) {
          await OwnerAnalytics.findOneAndUpdate(
            {
              restaurant: restaurant._id,
              date: { $gte: dayStart, $lt: dayEnd },
            },
            { $set: ownerPayload },
            { upsert: true, new: true, setDefaultsOnInsert: true },
          );
          upsertedOwnerAnalytics += 1;

          const existingOwnerLog = await OwnerActivity.findOne({
            owner: restaurant.owner,
            restaurant: restaurant._id,
            activityType: "view_analytics",
            description: `Backfill analytics generated for ${currentDayKey}`,
          }).lean();

          if (!existingOwnerLog) {
            await OwnerActivity.create({
              owner: restaurant.owner,
              restaurant: restaurant._id,
              activityType: "view_analytics",
              entityType: "restaurant",
              entityId: restaurant._id,
              entityName: restaurant.name,
              description: `Backfill analytics generated for ${currentDayKey}`,
              status: "success",
              createdAt: dayStart,
            });
            createdOwnerActivities += 1;
          }
        }
      }

      processedDays += 1;
      if (processedDays % 10 === 0) {
        console.log(`Processed ${processedDays} days...`);
      }
    }

    console.log("Backfill completed.");
    console.log(`Days processed: ${processedDays}`);
    console.log(`Admin dashboard upserts: ${upsertedAdminDashboards}`);
    console.log(`Owner analytics upserts: ${upsertedOwnerAnalytics}`);
    console.log(`Admin activities created: ${createdAdminActivities}`);
    console.log(`Owner activities created: ${createdOwnerActivities}`);
    console.log(`Mode: ${dryRun ? "dry-run" : "write"}`);

    process.exit(0);
  } catch (error) {
    console.error("Backfill failed:", error.message);
    process.exit(1);
  }
};

backfillAnalytics();
