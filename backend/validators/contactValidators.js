import { body, param } from "express-validator";

export const contactIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid contact id"),
];

export const createContactValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("A valid email is required"),
  body("subject").trim().notEmpty().withMessage("Subject is required"),
  body("message")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Message must be at least 10 characters long"),
];

export const replyContactValidator = [
  body("reply").trim().notEmpty().withMessage("Reply message is required"),
];

export const contactStatusValidator = [
  body("status")
    .trim()
    .isIn(["new", "replied", "resolved"])
    .withMessage("Invalid contact status"),
];
