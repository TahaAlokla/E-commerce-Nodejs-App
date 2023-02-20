const router = require("express").Router();
const ApiError = require("../utils/apiError");
const {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  uploadUserProfile,
  resizeImage,
  changePassword,
} = require("../controller/user.controller");

const {
  getUserValidator,
  createUserValidator,
  deleteUserValidator,
  updateUserValidator,
  changePasswordValidator,
} = require("../utils/validators/user.validator");

router
  .route("/")
  .post(uploadUserProfile, resizeImage, createUserValidator, createUser)
  .get(getAllUsers);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserProfile, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);
router.put("/changePassword/:id", changePasswordValidator, changePassword);
router.all("*", (req, res, next) => {
  // const err = new Error(`can not find routing ${req.originalUrl}`);
  next(new ApiError(`can not find routing ${req.originalUrl}`, 400));
});
module.exports = router;
