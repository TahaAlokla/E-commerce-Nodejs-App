const crypto = require("node:crypto");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
// function for creating token
const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.jwt_secret_key, {
    expiresIn: process.env.jwt_expires,
  });

// @desc   signup user
// @route  POST /api/v1/auth/signup
// @access public
exports.signupUser = asyncHandler(async (req, res, next) => {
  // create a new user
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: "user",
  });
  // generate token

  // payload token user._id
  const token = createToken(user._id);

  res.status(201).json({
    massage: "success signup",
    token: token,
    data: user,
  });
});

// login user with password and email
exports.login = asyncHandler(async (req, res, next) => {
  // check if email is existing database
  // check if password is correct
  // generations token
  // send response to client
  const user = await UserModel.findOne({ email: req.body.email });
  // await (bcrypt.compare(req.body.password,user.password) this returns boolean value
  // 401 status code unauthenticated  request
  // console.log(await bcrypt.compare(req.body.password, user.password));
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    // 401 status code unauthenticated  request
    return next(new ApiError("incorrect password or email", 401));
  }
  // generate token
  const token = createToken(user._id);

  res.status(200).json({
    massage: "login successful",
    token: token,
    data: user,
  });
});

// check if user is authenticated or not
exports.protectAuthRequest = asyncHandler(async (req, res, next) => {
  // check if existing token in header request
  let token1;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token1 = req.headers.authorization.split(" ")[1];
  }
  if (!token1) {
    return next(new ApiError("you are not authenticated login please", 401));
  }
  // check verify of token (no change happens  , expired)
  const decodedToken = jwt.verify(token1, process.env.jwt_secret_key);

  // check if user already exists
  const currentUser = await UserModel.findById(decodedToken.userId);
  if (!currentUser) {
    return next(new ApiError("user longer than not exist", 401));
  }
  // check if password changed after sending token to client
  if (currentUser.passwordChangeAt) {
    // convert to seconds integer =parseInt(value,base number converted to seconds)
    const passwordChangeAtTimestamp = parseInt(
      currentUser.passwordChangeAt.getTime() / 100,
      10
    );

    if (passwordChangeAtTimestamp > decodedToken.iat) {
      return next(
        new ApiError("user change password , token not valid yet ", 401)
      );
    }
  }
  req.user = currentUser;
  next();
});

// permissions check for users logged system
// we have 3 roles here admins and managers and users
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // access permissions roles
    // access restricted user (req.user.role)
    if (!roles.includes(req.user.role)) {
      // 403 permissions status code is forbidden
      return next(
        new ApiError("yor are not allowed to  access this route", 403)
      );
    }
    next();
  });

// handler forget password
// @desc   forget password
// @route  POST /api/v1/auth/forgetPassword
// @access public
// step 1 cycle "reset password"
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // get user by email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`not found email ${req.body.email}  for this user `, 404)
    );
  }
  // if email exists generated code random 6 digits and save code db
  const ResetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashResetCode = crypto
    .createHash("sha256")
    .update(ResetCode)
    .digest("hex");
  // save hash code into db
  user.passwordResetCode = hashResetCode;
  // expire time code after 20 mints
  user.passwordResetCodeExpiresAt = Date.now() + 20 * 60 * 1000;
  user.passwordResetCodeVerify = false;
  // save user after update attributes
  await user.save();
  //  massage content email sending
  const content = `taha App \n hi ${user.name} \n reset password code \n code : ${ResetCode}`;
  // send the reset code via email
  // handling email send errors
  try {
    await sendEmail({
      email: user.email,
      subject: "reset your password code valid 20 minutes ",
      content,
    });
  } catch (error) {
    // reset attributes values in database
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpiresAt = undefined;
    user.passwordResetCodeVerify = undefined;
    // save user after update attributes
    await user.save();
    console.log("error sending email ", error);
    return next(new ApiError("error in sending email", 500));
  }

  res.status(200).json({
    status: "success",
    massage: `sending reset code to your email address ${user.email} `,
  });

  // console.log(Math.floor(100000 + Math.random() * 900000));
});
// @desc   verify password reset code
// @route  POST /api/v1/auth/verifyResetCode
// @access public
// step 2 cycle "reset password"
// send req.body.restCode
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  // step 1 : get user based on reset code from  database
  // so we need hashing restCode (req.body.restCode)
  const hashResetCode = crypto
    .createHash("sha256")
    .update(req.body.restCode)
    .digest("hex");
  // get user by reset code and expiration date grater than date of now
  const user = await UserModel.findOne({
    passwordResetCode: hashResetCode,
    passwordResetCodeExpiresAt: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Invalid reset code or expired date !", 400));
  }
  // step 2 :rest code valid and delete reset code from database ,for not using it anymore
  user.passwordResetCodeVerify = true;
  user.passwordResetCode = undefined;
  user.passwordResetCodeExpiresAt = undefined;
  // save user after successful reset code update [passwordResetCodeVerify:true]
  await user.save();
  res.status(200).json({
    status: "success",
    massage: "success restCode requisite",
  });
});

// @desc   reset new password
// @route  PUT /api/v1/auth/resetPassword
// @access public
// step 3 cycle "reset password"
// from client :  req.body.email and req.body.newPassword
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // step 1 : get user based on email from  database

  // get user by reset code and expiration date grater than date of now
  const user = await UserModel.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(
      new ApiError(`user not found for this email ${req.body.email}`, 404)
    );
  }
  // check if success sending current restCode
  if (!user.passwordResetCodeVerify) {
    return next(new ApiError(`rest code not Verified`, 400));
  }
  user.password = req.body.newPassword;
  // step 2 :rest code valid and delete reset code from database ,for not using it anymore
  user.passwordResetCodeVerify = undefined;
  user.passwordResetCodeExpiresAt = undefined;
  user.passwordResetCode = undefined;
  // save user after successful reset code update [passwordResetCodeVerify:true]
  await user.save();

  // generate new token
  const newToken = createToken(user._id);
  res.status(200).json({
    status: "success",
    token: newToken,
    massage: `success rest password  new password now ${req.body.newPassword}`,
  });
});
