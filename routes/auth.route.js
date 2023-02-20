const router = require("express").Router();
const ApiError = require("../utils/apiError");

const {
  signupUser,
  login,
  forgetPassword,
  verifyResetCode,
  resetPassword,
} = require("../controller/auth.controller");

const {
  signupValidator,
  loginValidator,
  forgetPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
} = require("../utils/validators/auth.validator");

router.route("/signup").post(signupValidator, signupUser);
router.route("/login").post(loginValidator, login);
router
  .route("/verifyResetCode")
  .post(verifyResetCodeValidator, verifyResetCode);
router.route("/forgetPassword").post(forgetPasswordValidator, forgetPassword);
router.route("/resetPassword").put(resetPasswordValidator, resetPassword);
//   .post(uploadUserProfile, resizeImage, createUserValidator, createUser)
//   .get(getAllUsers);

// router
//   .route("/:id")
//   .get(getUserValidator, getUser)
//   .put(uploadUserProfile, resizeImage, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);
// router.put("/changePassword/:id", changePasswordValidator, changePassword);
router.all("*", (req, res, next) => {
  // const err = new Error(`can not find routing ${req.originalUrl}`);
  next(new ApiError(`can not find routing ${req.originalUrl}`, 400));
});
module.exports = router;
