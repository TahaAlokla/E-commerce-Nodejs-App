const asyncHandler = require("express-async-handler");

// const ApiError = require("../utils/apiError");
// const ApiFeatures = require("../utils/apiFeatures");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const factoryHandler = require("../services/handlersFactory");
const brandModel = require("../models/brand.model");
const {
  uploadSingleImageInMemory,
} = require("../middleware/uploadImage.middleware");

exports.uploadBrandImage = uploadSingleImageInMemory("image");
// resize the image
exports.resizeImage = asyncHandler(async (req, res, next) => {
  // here not need catch extension filename , ealready we know that jpeg
  const file_name = `brand-${uuidv4()}.${"jpeg"}`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${file_name}`);
  // .toFile(path.join("uploads", "brands", `${file_name}`).toString());
  // Save image into our db
  req.body.image = file_name;

  next();
});
// @desc   get list of brands
// @route  GET /api/v1/brands
// @access Public
// exports.getBrands = asyncHandler(async (req, res) => {
//   const documentsCount = await brandModal.countDocuments();
//   const ApiFeaturesBrands = new ApiFeatures(brandModal.find(), req.query)
//     .sort()
//     .filter()
//     .paginate(documentsCount)
//     .search()
//     .limitFields();

//   // Executed query
//   const { mongooseQuery, paginationResult } = ApiFeaturesBrands;
//   const brands = await mongooseQuery;
//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 3;
//   // const skip = (page - 1) * limit;
//   // const brands = await brandModal.find({}).skip(skip).limit(limit);
//   res.status(201).json({
//     paginationResult: paginationResult,
//     result: brands.length,
//     msg: "brands list",
//     data: brands,
//   });
// });
exports.getBrands = factoryHandler.getAllDocs(brandModel);
// @desc   get specific brand
// @route  GET /api/v1/brands/:id
// @access Public
// exports.getBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const brand = await brandModal.findById(id);
//   if (!brand) {
//     return next(new ApiError(`not found brand !`, 404));
//   }
//   res.status(200).json({
//     msg: "brand",
//     data: brand,
//   });
// });
exports.getBrand = factoryHandler.getOne(brandModel);
// @desc   create brand
// @route  POST /api/v1/brand
// @access Private
// exports.createBrand = asyncHandler(async (req, res) => {
//   const BrandOb = {
//     name: req.body.name,
//     slug: slugify(req.body.name),
//   };
//   const Brand = await brandModal.create(BrandOb);
//   res.status(201).json({
//     msg: "save Brand",
//     data: Brand,
//   });
// });
exports.createBrand = factoryHandler.createOne(brandModel);
// @desc   update Brand
// @route  PUT /api/v1/brands/:id
// @access Private
// exports.updateBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   // const { name } = req.body;

//   const brand = await brandModal.findByIdAndUpdate(id, req.body, { new: true });

//   if (!brand) {
//     // console.log("not found category !");
//     return next(new ApiError(`not found brand !`, 404));
//   }
//   res.status(201).json({
//     msg: "brand success update ",
//     data: brand,
//   });
// });
exports.updateBrand = factoryHandler.updateOne(brandModel);
// @desc   DELETE brand
// @route  DELETE /api/v1/brands/:id
// @access Private
exports.deleteBrand = factoryHandler.deleteOne(brandModel);
