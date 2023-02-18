const { check } = require("express-validator");
const slugify = require("slugify");
const {
  validationMiddleware,
} = require("../../middleware/validator.middleware");
// check :  body +param
exports.getBrandValidator = [
  check("id").isMongoId().withMessage("id not valid !"),
  validationMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("brand name is required !")
    .isLength({ min: 3 })
    .withMessage("brand name min length 3 character ")
    .isLength({ max: 100 })
    .withMessage("Brand name max length 100 character ")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validationMiddleware,
];

exports.updateBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required !")
    .isLength({ min: 3 })
    .withMessage("Brand name min length 3 character ")
    .isLength({ max: 100 })
    .withMessage("Brand name max length 100 character ")

    .custom((val, { req }) => {
      // slug
      req.body.slug = slugify(val);
      console.log(req.body.slug);
      return true;
    }),

  check("id").isMongoId().withMessage("id not valid format!"),
  validationMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("id not valid format!"),
  validationMiddleware,
];
