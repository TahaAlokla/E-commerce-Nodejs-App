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
    image: {
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
const setImageUrl = (document) => {
  if (document.image) {
    const imageUrl = `${process.env.base_url}/categories/${doc.image}`;
    document.image = imageUrl;
  }
};
// mongoose middleware for changes image values to send response
// returns response image path with baseurl
// findOne , findAll,update working "init" event
BrandSchema.post("init", (document) => {
  setImageUrl(document);
});
// working with caret document
BrandSchema.post("save", (document) => {
  setImageUrl(document);
});

module.exports = mongoose.model("Brand", BrandSchema);
