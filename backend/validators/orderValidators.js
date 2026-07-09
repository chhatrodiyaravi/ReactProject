import { body, param } from "express-validator";

export const orderIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid order id"),
];

export const createOrderValidator = [
  body("orderItems")
    .isArray({ min: 1 })
    .withMessage("Order items are required"),
  body("deliveryAddress")
    .notEmpty()
    .withMessage("Delivery address is required"),
  body("paymentMethod")
    .trim()
    .notEmpty()
    .withMessage("Payment method is required"),
  body("totalPrice").optional().isFloat({ min: 0 }),
];

export const updateOrderStatusValidator = [
  body("orderStatus").trim().notEmpty().withMessage("Order status is required"),
];
