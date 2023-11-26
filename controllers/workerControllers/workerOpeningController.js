const Form = require("../../models/Form");
const FormData = require("../../models/FormData");
const AuthToken = require("../../models/AuthToken");
const Question = require("../../models/Question");
const QuestionData = require("../../models/QuestionData");
const User = require("../../models/User");

const createForm = async (req, res) => {
  form_id = req.params.form_id;

  const auth_token = req.headers.auth_token;

  // posibility of error

  try {
    const user_id = await AuthToken.findOne({ token: auth_token }, { user: 1 });

    if (!user_id) {
      res.status(400).json({ message: "Invalid token" });
      return;
    }

    const user = await User.findOne({ _id: user_id.user });

    if (!user) {
      res.status(400).json({ message: "Invalid token" });
      return;
    }

    const formData = await FormData.findOne({ formID: form_id });
    if (!formData) {
      res.status(400).json({ message: "Form ID does not exist" });
      return;
    }

    const questionIDs = formData.questions;

    let questionsData = [];
    let questionsCompleteData = [];
    for (let i = 0; i < questionIDs.length; i++) {
      const question = await QuestionData.findOne({
        questionID: questionIDs[i],
      });

      const newQuestion = new Question({
        questionID: question.questionID,
        questionText: question.questionText,
        ansType: question.ansType,
        isAnswered: false,
        ans: "",
      });

      let tempQuestion = {
        questionID: newQuestion.questionID,
        questionText: newQuestion.questionText,
        ansType: newQuestion.ansType,
        _id: newQuestion._id,
      };

      questionsCompleteData.push(tempQuestion);
      await newQuestion.save();

      questionsData.push(newQuestion._id);
    }

    const newForm = new Form({
      formID: form_id,
      title: formData.title,
      description: formData.description,
      questions: questionsData,
      sectionID: formData.sectionID,
      createdBy: user._id,
      lockStatus: false,
      access: [user._id],
      createdBy: user._id,
      submittedBy: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      history: [],
    });

    await newForm.save();

    user.forms.push(newForm._id);

    await user.save();

    res.status(201).json({
      message: "Form created successfully",
      form: {
        id: newForm._id,
        name: newForm.title,
        description: newForm.description,
        status: newForm.lockStatus,
        created_at: newForm.createdAt,
      },
      questions: questionsCompleteData,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const getForm = async (req, res) => {
  // form_id is mongo id
  const form_id = req.params.form_id;

  // const auth_token = req.headers.auth_token;

  try {
    const form = await Form.findOne({ _id: form_id });

    let questionsData = [];

    for (let i = 0; i < form.questions.length; i++) {
      const question = await Question.findOne({ _id: form.questions[i] });
      questionsData.push({
        _id: question._id,
        questionID: question.questionID,
        questionText: question.questionText,
        ansType: question.ansType,
        isAnswered: question.isAnswered,
      });
    }

    res.status(200).json({
      message: "Form retrieved successfully",
      form: {
        formID: form.formID,
        _id: form._id,
        name: form.title,
        description: form.description,
        status: form.lockStatus,
        created_at: form.createdAt,
        updatedAt: form.updatedAt,
      },
      questions: questionsData,
    });
  } catch (err) {
    res.status(500).json({ message: "Form retrieval failed" });
  }
};

const getAnswer = async (req, res) => {
  const form_id = req.params.form_id;
  const question_id = req.params.question_id;

  console.log("form_id", form_id);
  console.log("question_id", question_id);

  // const auth_token = req.headers.auth_token;

  try {
    const form = await Form.findOne({ _id: form_id });

    if (!form) {
      res.status(400).json({ message: "Form does not exist" });
      return;
    }

    let question = await Question.findOne({ _id: question_id });

    if (!question) {
      res.status(400).json({
        message: "Question does not exist",
      });
      return;
    }

    for (let i = 0; i < form.history.length; i++) {
      if (form.history[i].changes.questionID == question._id) {
        const questionHistory = form.history[i];

        const user = await User.findOne({ _id: questionHistory.editedBy });

        res.status(201).json({
          message: "Answer retrieved successfully",
          answer: question.ans,
          answer_by: {
            name: user.name,
            edited_at: questionHistory.editedAt,
          },
        });
      }
    }

    res.status(201).json({
      message: "Answer retrieved successfully",
      answer: question.ans,
      answer_by: {
        name: "Not available",
        edited_at: "Not available",
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Answer retrieval failed" });
  }
};

const getAnswerOfForm = async (req, res) => {
  const form_id = req.params.form_id;
  console.log("form_id", form_id);
  // const auth_token = req.headers.auth_token;

  try {
    const form = await Form.findOne({ _id: form_id });

    if (!form) {
      res.status(400).json({ message: "Form does not exist" });
      return;
    }

    let answers = [];
    for (let i = 0; i < form.questions.length; i++) {
      const question = await Question.findOne({ _id: form.questions[i] });

      let questionHistory = null;
      for (let j = 0; j < form.history.length; j++) {
        if (form.history[j].changes.questionID == question._id) {
          questionHistory = form.history[j];
        }
      }

      if (!questionHistory) {
        answers.push({
          question_id: question._id,
          answer: question.ans,
          answer_by: {
            name: "Not available",
            edited_at: "Not available",
          },
        });
        continue;
      }

      const user = await User.findOne({ _id: questionHistory.editedBy });

      answers.push({
        question_id: question._id,
        answer: question.ans,
        answer_by: {
          name: user.name,
          edited_at: questionHistory.editedAt,
        },
      });
    }

    res.status(201).json({
      message: "Answers retrieved successfully",
      answers: answers,
    });
  } catch (err) {
    res.status(500).json({ message: "Answers retrieval failed" });
  }
};

module.exports = { createForm, getForm, getAnswer, getAnswerOfForm };
