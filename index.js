const express = require("express");
const app = express();

const QuestionData = require("./models/QuestionData");
const SectionData = require("./models/SectionData");
const FormData = require("./models/FormData");


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


	const isRepeated = QuestionData.find({ questionID: question.questionID });

	if (isRepeated) {
		res.status(400).send("Question ID already exists");
		return;
	}

	const newQuestion = new QuestionData(question);

	newQuestion.save()
		.then(() => res.status(200).send("Question added"))
		.catch((err) => res.status(400).send(err));
}
);

app.post("/api/addsection", (req, res) => {
	const section = req.body;

	const isRepeated = SectionData.find({ sectionID: section.sectionID });

	if (isRepeated) {
		res.status(400).send("Section ID already exists");
		return;
	}

	const newSection = new SectionData(section);

	newSection.save()
		.then(() => res.status(200).send("Section added"))
		.catch((err) => res.status(400).send(err));
}
);

app.post("/api/addform", (req, res) => {

	const form = req.body;

	const isRepeated = FormData.find({ formID: form.formID });

	if (isRepeated) {
		res.status(400).send("Form ID already exists");
		return;
	}

	const newForm = new FormData(form);

	newForm.save()
		.then(() => res.status(200).send("Form added"))
		.catch((err) => res.status(400).send(err));

});



app.listen(APP_PORT, () => {
	console.log(`Server is running on port ${APP_PORT}`);
});
