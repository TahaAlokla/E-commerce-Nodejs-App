const router = require("express").Router({ mergeParams: true });
// mergeParams allows you to  access the parameters from the other router
// so we need this that to access categoryId parameter from category router
const {
  createSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  getSubCategoryById,
  setCategoryToBody,
  filterObject,
} = require("../controller/subcategory.controller");

const {
  createSubCategoryValidator,
  deleteSubCategoryValidator,
  updateSubCategoryValidator,
  getSubCategoryValidator,
} = require("../utils/validators/subCategory.validator");

router
  .route("/")
  .post(setCategoryToBody, createSubCategoryValidator, createSubCategory)
  .get(filterObject, getSubCategories);
router
  .route("/:id")
  .put(updateSubCategoryValidator, updateSubCategory)
  .get(getSubCategoryValidator, getSubCategoryById)
  .delete(deleteSubCategoryValidator, deleteSubCategory);
module.exports = router;
