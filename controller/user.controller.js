// specie administrator only can have permissions CRUD for user
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
// eslint-disable-next-line import/order

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const ApiError = require("../utils/apiError");
const factoryHandler = require("../services/handlersFactory");
const UserModel = require("../models/user.model");
const {
  uploadSingleImageInMemory,
} = require("../middleware/uploadImage.middleware");

// upload a single image
exports.uploadUserProfile = uploadSingleImageInMemory("profileImg");
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const file_name = `user-${uuidv4()}.${"jpeg"}`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${file_name}`);
    // Save image into our db
    req.body.profileImg = file_name;
  }
  next();
});

// @desc   get list of users
// @route  GET /api/v1/users
// @access Private only administrative can access this
exports.getAllUsers = factoryHandler.getAllDocs(UserModel);
// @desc   get specific user
// @route  GET /api/v1/users/:id
// @access Private only administrative can access this
exports.getUser = factoryHandler.getOne(UserModel);
// @desc   create user
// @route  POST /api/v1/users
// @access Private only administrative can access this
exports.createUser = factoryHandler.createOne(UserModel);
// @desc   update Brand
// @route  PUT /api/v1/users/:id
// @access Private only administrative can access this
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await UserModel.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      profileImg: req.body.profileImg,
    },
    { new: true }
  );

  if (!document) {
    return next(new ApiError(`not found document for this !`, 404));
  }
  res.status(201).json({
    msg: " success update ",
    data: document,
  });
});
// change password update user
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  console.log("req.body.password", req.body);
  const document = await UserModel.findByIdAndUpdate(
    id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      // save time for change password database
      passwordChangeAt: Date.now(),
    },
    { new: true }
  );

  if (!document) {
    return next(new ApiError(`not found document for this !`, 404));
  }
  res.status(201).json({
    msg: " success update ",
    data: document,
  });
});
// @desc   DELETE user
// @route  DELETE /api/v1/users/:id
// @access Private only administrative can access this
exports.deleteUser = factoryHandler.deleteOne(UserModel);
