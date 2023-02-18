const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const productModal = require("../models/product.model");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factoryHandler = require("../services/handlersFactory");
const productModel = require("../models/product.model");
// @desc   get list of products
// @route  GET /api/v1/products
// @access Public
exports.getProducts = asyncHandler(async (req, res) => {
  // filter products roles
  // const queryStringObject = { ...req.query };
  // const excludesFields = ["limit", "skip", "page", "sort", "fields"];
  // excludesFields.forEach((field) => delete queryStringObject[field]);
  //   Apply filter products
  //   greater than or equal gte, greater than gt
  //   less than or equal lte, less than lt
  // let queryWithOperation = JSON.stringify(queryStringObject);
  // const regex = /\b(gt|gte|lt|lte|in)\b/g;
  // queryWithOperation = queryWithOperation.replace(
  //   regex,
  //   (match) => `$${match}`
  // );

  // pagination products list
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 3;
  // const skip = (page - 1) * limit;
  // ratingsAverage: req.body.ratingsAverage,
  //  price: req.body.price
  // .find(req.query) you can search by any attribute
  /*
  queryStringObject excludesFields 
    ['limit', 'skip', 'page','sort','fields']
  */

  // build the query mongoose
  // eslint-disable-next-line prefer-const
  // let mongooseQuery = productModal
  //   .find(JSON.parse(queryWithOperation))
  //   .skip(skip)
  //   .limit(limit)
  //   .populate({ path: "category", select: "name -_id" });
  // sorting products
  // sort by price ascending or descending  or any attribute having numeric
  // Examples  ?sort=price ascending || sort=-price descending
  // if (req.query.sort) {
  //   // sorting by multiple attributes
  //   // Example ?sort=price , -sold =  becomes price -sold
  //   // remove dashes from attributes
  //   const sortBy = req.query.sort.split(",").join(" ");
  //   mongooseQuery = mongooseQuery.sort(sortBy);
  // } else {
  //   // if not having any sort query, so  sorting by createdAt From newest to oldest
  //   mongooseQuery = mongooseQuery.sort("-createdAt");
  // }

  // limiting products details attributes
  // Example ?fields= titles, description
  // Example excludesFields ?fields=-title, -description , so return all attributes without titles, description
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(",").join(" ");
  //   mongooseQuery = mongooseQuery.select(fields);
  // } else {
  //   mongooseQuery = mongooseQuery.select("-__v");
  // }
  // // searching for any word from title or description
  // if (req.query.search) {
  //   const query = {};
  //   query.$or = [
  //     { title: { $regex: req.query.search, $options: "i" } },
  //     { description: { $regex: req.query.search, $options: "i" } },
  //   ];

  //   mongooseQuery = mongooseQuery.find(query);
  // }

  // build the query
  // countDocuments returns documents count for all documents products
  const documentsCount = await productModal.countDocuments();
  const ApiFeaturesProduct = new ApiFeatures(productModal.find(), req.query)
    .sort()
    .filter()
    .paginate(documentsCount)
    .search("Products")
    .limitFields();

  // Executed query
  const { mongooseQuery, paginationResult } = ApiFeaturesProduct;
  const products = await mongooseQuery;
  res.status(201).json({
    result: products.length,
    msg: "products list",
    data: products,
    paginationResult: paginationResult,
  });
});

// @desc   get specific product
// @route  GET /api/v1/products/:id
// @access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModal
    .findById(id)
    .populate({ path: "category", select: "name -_id" });
  if (!product) {
    return next(new ApiError(`not found product !`, 404));
  }
  res.status(200).json({
    msg: "category",
    data: product,
  });
});

// @desc   create product
// @route  POST /api/v1/products
// @access Private
// exports.createProduct = asyncHandler(async (req, res) => {
//   req.body.slug = slugify(req.body.title);
//   const product = await productModal.create(req.body);
//   res.status(201).json({
//     msg: "save product",
//     data: product,
//   });
// });
exports.createProduct = factoryHandler.createOne(productModel);
// @desc   update product
// @route  PUT /api/v1/products/:id
// @access Private
// exports.updateProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   if (req.body.title) {
//     req.body.slug = slugify(req.body.title);
//   }

//   const product = await productModal.findOneAndUpdate({ _id: id }, req.body, {
//     new: true,
//   });
//   if (!product) {
//     return next(new ApiError(`not found product !`, 404));
//   }
//   res.status(201).json({
//     msg: "product success update ",
//     data: product,
//   });
// });
exports.updateProduct = factoryHandler.updateOne(productModel);

// @desc   DELETE product
// @route  DELETE /api/v1/products/:id
// @access Private
// exports.deleteProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const product = await productModal.findByIdAndDelete(id);
//   if (!product) {
//     return next(new ApiError(`not found this product for this id ${id}`, 404));
//   }
//   // status code 204 : not return content
//   res.status(204).json({});
// });
exports.deleteProduct = factoryHandler.deleteOne(productModel);
