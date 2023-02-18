const { check } = require("express-validator");
const slugify = require("slugify");
const {
  validationMiddleware,
} = require("../../middleware/validator.middleware");
// check :  body +param
exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("id not valid !"),
  validationMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subcategory name is required !")
    .isLength({ min: 3 })
    .withMessage("category name min length 3 character ")
    .isLength({ max: 100 })
    .withMessage("category name max length 100 character ")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("category name is required !")
    .isMongoId()
    .withMessage("not invalid category id format"),
  validationMiddleware,
];

exports.updateSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category name is required !")
    .isLength({ min: 3 })
    .withMessage("category name min length 3 character ")
    .isLength({ max: 100 })
    .withMessage("category name max length 100 character ")
    .custom((val, { req }) => {
      // slug
      req.body.slug = slugify(val);
      console.log(req.body.slug);
      return true;
    }),

  check("category")
    .notEmpty()
    .withMessage("category name is required !")
    .isMongoId()
    .withMessage("not invalid category id format"),
  validationMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("id not valid format!"),
  validationMiddleware,
];
