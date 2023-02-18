const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category name is Required"],
      unique: [true, "category name is unique"],
      minlength: [3, "category name minimum length 3 characters"],
      maxlength: [100, "category name maximum length 100 characters"],
    },
    imgUrl: {
      type: String,
      // required:true
    },
    slug: {
      type: String,
      lowercase: true, // Always convert `test` to lowercase
      // required:true
    },
  },
  { timestamps: true }
);
// create model
const categoryModal = mongoose.model("Category", categorySchema);
module.exports = categoryModal;
// module.exports
