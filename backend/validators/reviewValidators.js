import { body, param } from "express-validator";

export const reviewIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid review id"),
];

export const foodReviewsParamValidator = [
  param("foodId").isMongoId().withMessage("Invalid food id"),
];

export const restaurantReviewsParamValidator = [
  param("restaurantId").isMongoId().withMessage("Invalid restaurant id"),
];

export const createReviewValidator = [
  body("rating")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment").trim().notEmpty().withMessage("Comment is required"),
];

export const updateReviewValidator = [
  body("rating").optional().isFloat({ min: 1, max: 5 }),
  body("comment").optional().trim().notEmpty(),
];
