const express = require("express");
const app = express();

const Question = require("./models/Question");


const { APP_PORT } = require("./config");
const connectDB = require("./config/database");

const { formRoutes } = require('./routes')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Database
// username - smartshedteam
// password - smartshedteam
connectDB();

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.use("/api/forms", formRoutes)


app.post("/api/addquestion", (req, res) => {
	const question = req.body;
	console.log(question);

	const isRepeated = Question.findOne({ queId: question.queId });

	if (isRepeated) {
		res.status(400).json({ message: "Question already exists" });
	}

	const newQuestion = new Question(question);

	const savedQuestion = newQuestion.save();

	res.status(200).json({ message: "Question added successfully" })

});

app.listen(APP_PORT, () => {
	console.log(`Server is running on port ${APP_PORT}`);
});
