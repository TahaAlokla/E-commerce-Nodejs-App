const { check } = require("express-validator");
const slugify = require("slugify");
const {
  validationMiddleware,
} = require("../../middleware/validator.middleware");
// check :  body +param
exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("id not valid !"),
  validationMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category name is required !")
    .isLength({ min: 3 })
    .withMessage("category name min length 3 character ")
    .isLength({ max: 100 })
    .withMessage("category name max length 100 character ")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validationMiddleware,
];

exports.updateCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category name is required !")
    .isLength({ min: 3 })
    .withMessage("category name min length 3 character ")
    .isLength({ max: 100 })
    .withMessage("category name max length 100 character ")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      console.log(req.body.slug);
      return true;
    }),
  check("id").isMongoId().withMessage("id not valid format!"),
  validationMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("id not valid format!"),
  validationMiddleware,
];
