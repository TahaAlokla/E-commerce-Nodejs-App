const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const subCategoryModal = require("../models/subCategory.model");
const ApiFeatures = require("../utils/apiFeatures");
const factoryHandler = require("../services/handlersFactory");
const SubCategoryModal = require("../models/subCategory.model");
// middleware for set category ro body
exports.setCategoryToBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
    next();
  }
};
// middleware for filter category for get all sub categories for specifications cat
exports.filterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObject = filterObject;
  next();
};
// @desc   create SubCategory
// @route  POST /api/v1/subcategories
// @access Private
// exports.createSubCategory = asyncHandler(async (req, res) => {
//   // nested routes for category

//   const { name, category } = req.body;
//   const subCategory = await subCategoryModal.create({
//     name,
//     slug: slugify(name),
//     category,
//   });
//   res.status(201).json({
//     msg: "save subcategory category",
//     data: subCategory,
//   });
// });
exports.createSubCategory = factoryHandler.createOne(SubCategoryModal);
// @desc   get list  of Subcategories
// @route  GET /api/v1/subcategories
// @access Public
// exports.getSubCategories = asyncHandler(async (req, res) => {
//   // console.log(req.params.categoryId);
//   const documentsCount = await subCategoryModal.countDocuments();
//   const ApiFeaturesSubcategory = new ApiFeatures(
//     subCategoryModal.find(),
//     req.query
//   )
//     .sort()
//     .filter()
//     .paginate(documentsCount)
//     .search()
//     .limitFields();
//   // Executed query
//   const { mongooseQuery, paginationResult } = ApiFeaturesSubcategory;

//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 3;
//   // const skip = (page - 1) * limit;
//   const subcategories = await mongooseQuery.populate({
//     path: "category",
//     select: "name -_id",
//   });
//   // .skip(skip)
//   // .limit(limit);
//   // .populate({ path: "category", select: "name -_id" });
//   res.status(201).json({
//     paginationResult: paginationResult,
//     result: subcategories.length,
//     msg: "categories list",
//     data: subcategories,
//   });
// });
exports.getSubCategories = factoryHandler.getAllDocs(SubCategoryModal);
// @desc   get specific Subcategory
// @route  GET /api/v1/subcategories/:id
// @access Public
exports.getSubCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const Subcategory = await subCategoryModal
    .findById(id)
    .populate({ path: "category", select: "name -_id" });
  if (!Subcategory) {
    return next(new ApiError(`not found category !`, 404));
  }
  res.status(200).json({
    msg: "category",
    data: Subcategory,
  });
});

// @desc   update SubCategory
// @route  PUT /api/v1/subcategories/:id
// @access Private
// exports.updateSubCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { name, category } = req.body;
//   const SubCategory = await subCategoryModal.findOneAndUpdate(
//     { _id: id },
//     { name, slug: slugify(name), category },
//     { new: true }
//   );
//   if (!SubCategory) {
//     return next(new ApiError(`not found Subcategory !`, 404));
//   }
//   res.status(201).json({
//     msg: "subcategory success update ",
//     data: SubCategory,
//   });
// });
exports.updateSubCategory = factoryHandler.updateOne(SubCategoryModal);

// @desc   DELETE SubCategory
// @route  DELETE /api/v1/subcategories/:id
// @access Private
// exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const category = await subCategoryModal.findByIdAndDelete(id);
//   if (!category) {
//     return next(
//       new ApiError(`not found this subcategory for this id ${id}`, 404)
//     );
//   }
//   // status code 204 : not return content
//   res.status(204).json({});
// });
exports.deleteSubCategory = factoryHandler.deleteOne(SubCategoryModal);
