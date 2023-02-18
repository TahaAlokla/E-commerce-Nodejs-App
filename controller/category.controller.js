// const slugify = require("slugify");
// const asyncHandler = require("express-async-handler");
const categoryModal = require("../models/category.model");
// const ApiError = require("../utils/apiError");
// const ApiFeatures = require("../utils/apiFeatures");
const factoryHandler = require("../services/handlersFactory");
// @desc   get list of categories
// @route  GET /api/v1/categories
// @access Public
// exports.getCategories = asyncHandler(async (req, res) => {
//   const documentsCount = await categoryModal.countDocuments();
//   const ApiFeaturesCategories = new ApiFeatures(categoryModal.find(), req.query)
//     .sort()
//     .filter()
//     .paginate(documentsCount)
//     .search()
//     .limitFields();

//   // Executed query
//   const { mongooseQuery, paginationResult } = ApiFeaturesCategories;
//   const categories = await mongooseQuery;
//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 3;
//   // const skip = (page - 1) * limit;

//   res.status(201).json({
//     paginationResult: paginationResult,
//     result: categories.length,
//     msg: "categories list",
//     data: categories,
//   });
// });
exports.getCategories = factoryHandler.getAllDocs(categoryModal);

// @desc   get specific category
// @route  GET /api/v1/categories/:id
// @access Public
// exports.getCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   // if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//   //   return next(new ApiError(`not valid id ${id}!`, 400));
//   // }
//   const category = await categoryModal.findById(id);
//   if (!category) {
//     // console.log("not found category !");
//     // res.status(404).json({
//     //   msg: "not found this category for this id : " + id,
//     // });
//     return next(new ApiError(`not found category !`, 404));
//   }
//   res.status(200).json({
//     msg: "category",
//     data: category,
//   });
// });
exports.getCategory = factoryHandler.getOne(categoryModal);
// @desc   create Category
// @route  POST /api/v1/categories
// @access Private
// exports.createCategory = asyncHandler(async (req, res) => {
//   const categoryOb = {
//     name: req.body.name,
//     slug: slugify(req.body.name),
//   };
//   const category = await categoryModal.create(categoryOb);
//   res.status(201).json({
//     msg: "save category",
//     data: category,
//   });
// });
exports.createCategory = factoryHandler.createOne(categoryModal);

// @desc   update Category
// @route  PUT /api/v1/categories/:id
// @access Private
// exports.updateCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { name } = req.body;

//   if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//     // res.status(400).json({
//     //   msg: "not valid id  : " + id,
//     // });
//     return next(new ApiError(`not valid id ${id}!`, 400));
//   }
//   const category = await categoryModal.findOneAndUpdate(
//     { _id: id },
//     { name, slug: slugify(name) },
//     { new: true }
//   );
//   if (!category) {
//     // console.log("not found category !");
//     return next(new ApiError(`not found category !`, 404));
//   }
//   res.status(201).json({
//     msg: "category success update ",
//     data: category,
//   });
// });
exports.updateCategory = factoryHandler.updateOne(categoryModal);
// @desc   DELETE Category
// @route  DELETE /api/v1/categories/:id
// @access Private
// exports.deleteCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//     return next(new ApiError(`not found category !`, 404));
//   }
//   const category = await categoryModal.findByIdAndDelete(id);
//   if (!category) {
//     return next(new ApiError(`not found this category for this id ${id}`, 404));
//   }
//   // status code 204 : not return content
//   res.status(204).json({
//     // msg: "category success delete ! ",
//   });
// });
exports.deleteCategory = factoryHandler.deleteOne(categoryModal);
