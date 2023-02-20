const router = require("express").Router();
const {
  createBrand,
  getBrand,
  getBrands,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../controller/brand.controller");
const {
  protectAuthRequest,
  allowedTo,
} = require("../controller/auth.controller");
const {
  getBrandValidator,
  createBrandValidator,
  deleteBrandValidator,
  updateBrandValidator,
} = require("../utils/validators/brand.validator");

router
  .route("/")
  .post(
    protectAuthRequest,
    allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  )
  .get(getBrands);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    protectAuthRequest,
    allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
