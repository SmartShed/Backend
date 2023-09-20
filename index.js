const express = require("express");
const app = express();


const { APP_PORT } = require("./config");
const connectDB = require("./config/database");

const { formRoutes } = require('./routes')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Database
// username - smartshedteam
// password - smartshedteam
// connectDB();

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.use("/api/forms", formRoutes)

app.listen(APP_PORT, () => {
	console.log(`Server is running on port ${APP_PORT}`);
});
