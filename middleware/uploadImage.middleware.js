// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images allowed", 400), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};
// const fileFilterImagesOnly=
exports.uploadSingleImageInMemory = (filed_name) =>
  multerOptions().single(filed_name);
// multi image upload
exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
