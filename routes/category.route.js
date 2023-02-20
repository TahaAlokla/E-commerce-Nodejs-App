const router = require("express").Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../controller/category.controller");

const {
  getCategoryValidator,
  createCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
} = require("../utils/validators/category.validator");
const {
  protectAuthRequest,
  allowedTo,
} = require("../controller/auth.controller");
// const upload = multer({ dest: "uploads/" });
const SubCategoryRouter = require("./subCategory.route");
// nested router
router.use("/:categoryId/subcategory", SubCategoryRouter);
router
  .route("/")
  .post(
    protectAuthRequest,
    allowedTo("admin", "manager", "user"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  )
  .get(getCategories);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
