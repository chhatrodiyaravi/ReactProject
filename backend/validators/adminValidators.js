import { body, param } from "express-validator";

export const adminIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid id"),
];

export const createAdminUserValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("A valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["user", "admin", "owner"])
    .withMessage("Invalid role"),
];

export const adminRestaurantStatusValidator = [
  body("status").optional().trim(),
  body("reason").optional().trim(),
];
