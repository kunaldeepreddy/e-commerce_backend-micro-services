const Constants = require("../constants");
const mongoose = require("mongoose");
const Path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: Path.join(__dirname, "../.env") });
mongoose
  .connect(process.env.MONGODB_URL, Constants.MONGOOSE_OPTIONS)
  .then()
  .catch((e) => console.log(e));
