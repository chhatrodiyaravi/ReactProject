import { body, param } from "express-validator";

export const cartItemParamValidator = [
  param("itemId").isMongoId().withMessage("Invalid cart item id"),
];

export const addToCartValidator = [
  body("foodId").isMongoId().withMessage("Food id is required"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];

export const updateCartItemValidator = [
  body("quantity").isInt().withMessage("Quantity must be a valid number"),
];
