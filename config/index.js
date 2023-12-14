const dotenv = require("dotenv");
dotenv.config();

const APP_PORT = process.env.APP_PORT;
const APP_HTTPS_PORT = process.env.APP_HTTPS_PORT;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

module.exports = {
  APP_PORT,
  APP_HTTPS_PORT,
  MONGO_URI,
  JWT_SECRET,
  EMAIL,
  PASSWORD,
};
