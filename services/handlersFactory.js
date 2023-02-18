const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findByIdAndDelete(id);
    if (!document) {
      return next(
        new ApiError(
          `not found this document for this ${model} for this id ${id}`,
          404
        )
      );
    }
    // status code 204 : not return content
    res.status(204).json({});
  });

exports.updateOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findByIdAndUpdate(id, req.body, { new: true });

    if (!document) {
      return next(new ApiError(`not found document for this ${model} !`, 404));
    }
    res.status(201).json({
      msg: " success update ",
      data: document,
    });
  });

exports.createOne = (model) =>
  asyncHandler(async (req, res) => {
    const document = await model.create(req.body);
    res.status(201).json({
      msg: `success create document  document `,
      data: document,
    });
  });

exports.getOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await model.findById(id);
    if (!document) {
      return next(new ApiError(`not found document !`, 404));
    }
    res.status(200).json({
      msg: "get document successfully",
      data: document,
    });
  });

exports.getAllDocs = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });
