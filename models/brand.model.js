const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is Required"],
      unique: [true, "Brand name is unique"],
      minlength: [3, "Brand name minimum length 3 characters"],
      maxlength: [100, "Brand name maximum length 100 characters"],
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

module.exports = mongoose.model("Brand", BrandSchema);
