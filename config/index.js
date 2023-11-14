const dotenv = require("dotenv");
dotenv.config();


const APP_PORT = process.env.APP_PORT;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {

	APP_PORT,
	MONGO_URI,
	JWT_SECRET
};
