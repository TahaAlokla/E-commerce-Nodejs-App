const mongoose = require("mongoose");
// connection with db atlas
exports.dbConfig = () => {
  mongoose
    .connect(process.env.db_url)
    .then((con) => {
      console.log("success connection with db", con.connection.host);
    })
    .catch((err) => {
      console.log("something error connection with db", err);
      // * Stopped node App if existed error
      process.exit(1);
    });
};
