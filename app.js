const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const morgan = require("morgan");
const ApiError = require("./utils/apiError");
const categoryRoute = require("./routes/category.route");
const SubCategoryRoute = require("./routes/subCategory.route");
const BrandsRoute = require("./routes/brand.route");
const ProductRoute = require("./routes/product.route");
const globalError = require("./middleware/error.middleware");
const { dbConfig } = require("./config/db.config");

dbConfig();
const app = express();
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("mode :", process.env.NODE_ENV);
}

app.use("/api/v1/categories", categoryRoute);
// SubCategoryRoute
app.use("/api/v1/subcategories", SubCategoryRoute);
app.use("/api/v1/brands", BrandsRoute);
app.use("/api/v1/products", ProductRoute);
// handling routing not exist
app.all("*", (req, res, next) => {
  // const err = new Error(`can not find routing ${req.originalUrl}`);
  next(new ApiError(`can not find routing ${req.originalUrl}`, 400));
});
// Global error handling middleware special Express Errors only
app.use(globalError);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// any unhandledRejection outside Express handing here
// اي خطأ يحدث خارج الاكسبريس يتم معالجة الخطاء هنا بشكل مركزي
process.on("unhandledRejection", (err) => {
  console.error(`something error ${err.name} - ${err.message}`);
  // Completion of the implementation of the pending request's before shutdown
  server.close(() => {
    // shutdown app.js
    console.info("application shutting down !");
    process.exit(1);
  });
});
