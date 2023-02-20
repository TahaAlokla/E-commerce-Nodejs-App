const { check, body } = require("express-validator");
const bcrypt = require("bcryptjs");
const slugify = require("slugify");
const userModel = require("../../models/user.model");
const {
  validationMiddleware,
} = require("../../middleware/validator.middleware");
// check :  body +param
exports.getUserValidator = [
  check("id").isMongoId().withMessage("id not valid !"),
  validationMiddleware,
];
exports.changePasswordValidator = [
  check("id").isMongoId().withMessage("id not valid !"),
  body("CurrentPassword")
    .notEmpty()
    .withMessage("CurrentPassword is required !")
    .isLength({ min: 6 })
    .withMessage("CurrentPassword min length password character ")
    .isLength({ max: 100 })
    .withMessage("CurrentPassword max length 100 character "),
  body("password")
    .notEmpty()
    .withMessage("password is required !")
    .isLength({ min: 6 })
    .withMessage("password min length password character ")
    .isLength({ max: 100 })
    .withMessage("password max length 100 character ")
    .custom(async (val, { req }) => {
      // check verify current password
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new Error("User not found");
      }
      // return current compare value :boolean
      const currentCompareValue = await bcrypt.compare(
        req.body.CurrentPassword,
        user.password
      );
      if (!currentCompareValue) {
        throw new Error("current password is incorrect");
      }
      if (val === req.body.password) {
        throw new Error("new password should not equal  current password  ");
      }
      // password not equal to current password
    }),
  validationMiddleware,
];

// check if email is valid and register before sending
exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("username is required !")
    .isLength({ min: 2 })
    .withMessage("username min length 2 character ")
    .isLength({ max: 100 })
    .withMessage("username max length 100 character ")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email is required !")
    .isEmail()
    .withMessage("invalid email address")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(
            new Error(`email ${user.email} is registered before sending`)
          );
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("password is required !")
    .isLength({ min: 6 })
    .withMessage("password min length password character ")
    .isLength({ max: 100 })
    .withMessage("password max length 100 character "),
  validationMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required !")
    .isEmail()
    .withMessage("invalid email address"),
  check("password")
    .notEmpty()
    .withMessage("password is required !")
    .isLength({ min: 6 })
    .withMessage("password min length password character ")
    .isLength({ max: 100 })
    .withMessage("password max length 100 character "),
  validationMiddleware,
];
exports.forgetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required !")
    .isEmail()
    .withMessage("invalid email address"),

  validationMiddleware,
];

exports.verifyResetCodeValidator = [
  body("restCode")
    .notEmpty()
    .withMessage("restCode is required ")
    .isLength({ min: 6, max: 6 })
    .withMessage("restCode max length 6 characters"),
  validationMiddleware,
];
exports.resetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required !")
    .isEmail()
    .withMessage("invalid email address"),
  check("newPassword")
    .notEmpty()
    .withMessage("password is required !")
    .isLength({ min: 6 })
    .withMessage("password min length password character ")
    .isLength({ max: 100 })
    .withMessage("password max length 100 character "),
  validationMiddleware,
];

exports.updateUserValidator = [
  check("name")
    .optional()
    .notEmpty()
    .withMessage("userName is required !")
    .isLength({ min: 2 })
    .withMessage("userName min length 2 character ")
    .isLength({ max: 100 })
    .withMessage("userName max length 100 character ")

    .custom((val, { req }) => {
      // slug
      req.body.slug = slugify(val);
      console.log(req.body.slug);
      return true;
    }),

  check("id").isMongoId().withMessage("id not valid format!"),
  validationMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("id not valid format!"),
  validationMiddleware,
];
