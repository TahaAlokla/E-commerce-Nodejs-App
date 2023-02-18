const fs = require("fs");
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const colors = require("colors");
const dotenv = require("dotenv");
const Product = require("../../models/product.model");
const { dbConfig } = require("../../config/db.config");

dotenv.config({ path: "../../config.env" });

// connect to DB
dbConfig();

// Read data
const products = JSON.parse(fs.readFileSync("./products.json"));

// Insert data into DB
const insertData = async () => {
  //   console.log("products", products);
  try {
    await Product.create(products);

    console.log("Data Inserted".green.inverse);
    process.exit();
  } catch (error) {
    console.log("error insert", error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data Destroyed".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -d
if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  destroyData();
}