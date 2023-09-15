const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
module.exports = Object.freeze({
  DB_URL: process.env.MONGODB_URL,
  SECRET_KEY: process.env.SECRET_KEY,
  ROLE_ADMIN: "admin",
  ROLE_USER: "user",
  ENV_TYPES: {
    PROD: "PROD",
    DEV: "DEV",
    LOCAL: "LOCAL",
  },
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_S3_IMAGES: process.env.AWS_S3_IMAGES,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
  EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS,
  URL: process.env.URL,
  PRODUCT_PICS_S3_BUCKET_URL: process.env.PRODUCT_PICS_S3_BUCKET_URL
});
