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
    const imageUrl = `${process.env.base_url}/categories/${document.image}`;
    document.image = imageUrl;
  }
};
// mongoose middleware for changes image values to send response
// returns response image path with baseurl
// findOne , findAll,update working "init" event
categorySchema.post("init", (document) => {
  setImageUrl(document);
});
// working with caret document
categorySchema.post("save", (document) => {
  setImageUrl(document);
});
// create model
const categoryModal = mongoose.model("Category", categorySchema);
module.exports = categoryModal;
// module.exports
