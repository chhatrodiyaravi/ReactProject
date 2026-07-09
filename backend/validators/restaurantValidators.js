import { body, param } from "express-validator";

export const restaurantIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid restaurant id"),
];

export const createRestaurantValidator = [
  body("name").trim().notEmpty().withMessage("Restaurant name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("phone").trim().notEmpty().withMessage("Phone is required"),
  body("email").trim().isEmail().withMessage("A valid email is required"),
];

export const updateRestaurantValidator = [
  body("name").optional().trim().notEmpty(),
  body("description").optional().trim().notEmpty(),
  body("phone").optional().trim().notEmpty(),
  body("email").optional().trim().isEmail(),
];
