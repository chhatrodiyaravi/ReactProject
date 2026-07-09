import { body, param } from "express-validator";

export const userIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid user id"),
];

export const updateProfileValidator = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("A valid email is required"),
  body("phone").optional().trim().isString(),
  body("address")
    .optional()
    .isObject()
    .withMessage("Address must be an object"),
  body("avatar").optional(),
];

export const changePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];
