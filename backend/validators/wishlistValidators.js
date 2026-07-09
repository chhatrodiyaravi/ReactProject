import { body, param } from "express-validator";

export const wishlistIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid wishlist item id"),
];

export const addWishlistValidator = [
  body("foodId").isMongoId().withMessage("Food id is required"),
];
