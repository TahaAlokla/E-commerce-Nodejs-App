const mongoose = require("mongoose");
//   trim:true:  remove spaces
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "sub category name is Required"],
      unique: [true, "sub category name is unique"],
      minlength: [1, "sub category name minimum length 1 characters"],
      maxlength: [100, "sub category name maximum length 100 characters"],
    },
    slug: {
      type: String,
      // Always convert `test` to lowercase
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "sub category must be belong to parent category "],
    },
  },
  { timestamps: true }
);

const SubCategoryModal = mongoose.model("SubCategory", subCategorySchema);
module.exports = SubCategoryModal;
