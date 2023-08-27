const mongoose = require("mongoose");
const {MONGO_URI} = require("./index");

const connectDB = async () => {
	mongoose.connect(MONGO_URI)
		.then(() => {
			console.log("Connected to the DB");
		})
		.catch((err) => {
			console.log("MongoDB connection error", err);
		});
};

module.exports = connectDB;
