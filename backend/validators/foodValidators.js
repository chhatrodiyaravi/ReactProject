import { body, param } from "express-validator";

export const foodIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid food id"),
];

export const createFoodValidator = [
  body("restaurant").isMongoId().withMessage("Restaurant id is required"),
  body("name").trim().notEmpty().withMessage("Food name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a number"),
  body("category").trim().notEmpty().withMessage("Category is required"),
];

export const updateFoodValidator = [
  body("restaurant").optional().isMongoId(),
  body("name").optional().trim().notEmpty(),
  body("description").optional().trim().notEmpty(),
  body("price").optional().isFloat({ min: 0 }),
  body("category").optional().trim().notEmpty(),
];
