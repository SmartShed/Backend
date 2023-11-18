const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

const QuestionData = require("./models/QuestionData");
const SectionData = require("./models/SectionData");
const FormData = require("./models/FormData");


const { APP_PORT } = require("./config");
const connectDB = require("./config/database");

const { formRoutes, userRoutes, workerRoutes } = require('./routes')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//body parser




// Database
// username - smartshedteam
// password - smartshedteam
connectDB();

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.use("/api/forms", formRoutes)
app.use("/api/auth", userRoutes);
app.use("/api/workers", workerRoutes);

app.post("/api/addquestion", async (req, res) => {
	const question = req.body;


	try {
		const que = await QuestionData.findOne({ questionID: question.questionID });
		console.log(que);
		if (que) {
			res.status(400).send("Question ID already exists");
			return;
		}

		const newQuestion = new QuestionData(question);

		newQuestion.save()
			.then(() => res.status(200).send("Question added"))
			.catch((err) => res.status(400).send(err));
	}
	catch (err) {
		res.status(400).json({ message: err.message });
	}
}
);

app.post("/api/addsection", async (req, res) => {
	const section = req.body;

	try {
		const sec = await SectionData.findOne({ sectionID: section.sectionID });

		if (sec) {
			res.status(400).send("Section ID already exists");
			return;
		}

		const newSection = new SectionData(section);

		newSection.save()
			.then(() => res.status(200).send("Section added"))
			.catch((err) => res.status(400).send(err));
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
}
);

app.post("/api/addform", async (req, res) => {


	const form = req.body;

	console.log("form", form);

	try {
		const tempForm = await FormData.findOne({ formID: form.formID });

		console.log("tempForm", tempForm);

		if (tempForm) {
			res.status(400).send("Form ID already exists");
			return;
		}

		const newForm = new FormData(form);

		console.log("newForm", newForm);
		await newForm.save()

		res.status(200).json({ message: "Form added" });



	}
	catch (err) {
		res.status(400).json({ message: err.message });
	}

});





app.listen(APP_PORT, () => {
	console.log(`Server is running on port ${APP_PORT}`);
});
