const dotenv = require("dotenv");
dotenv.config();

const APP_PORT = process.env.APP_PORT;
const MONGO_URI = process.env.MONGO_URI;

module.exports = {
	APP_PORT,
	MONGO_URI,
};
