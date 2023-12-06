const Form = require("../../models/Form");
const Question = require("../../models/Question");
const AuthToken = require("../../models/AuthToken");
const User = require("../../models/User");



const createDraft = async (req, res) => {

  const form_id = req.params.form_id;

  const auth_token = req.headers.auth_token;

  const { answers } = req.body;


  try {

    let user = await AuthToken.findOne({ token: auth_token }).populate('user');
    user = user.user;

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Unauthorized access" });
    }

    console.log(user);

    const form = await Form.findById(form_id)
      .populate('questions')
      .populate({
        path: 'subForms',
        populate: {
          path: 'questions',
        }
      })
      .populate('history');



    if (!form) {
      return res
        .status(404)
        .json({ status: "error", message: "Form not found" });
    }

    const questionsArray = form.questions.concat(form.subForms.map(subForm => subForm.questions).flat());

    for (let i = 0; i < questionsArray.length; i++) {
      const question = questionsArray[i];
      const newAnswer = answers.find((ans) => ans.question_id == question._id);
      question.ans = newAnswer.answer;
      question.isAnswered = true;
      await question.save();

      const newHistory = {
        editedBy: user._id,
        editedAt: Date.now(),
        changes: [
          {
            questionID: question._id,
            oldValue: question.ans,
            newValue: newAnswer.answer,
          },
        ],
      };

      form.history.unshift(newHistory);

      form.updatedAt = Date.now();
      await form.save();
    }
    return res.json({ status: "success", message: "Draft saved successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", message: err.message });
  }
};

const submitForm = async (req, res) => {
  const form_id = req.params.form_id;

  const auth_token = req.headers.auth_token;

  const { answers } = req.body;


  try {

    let user = await AuthToken.findOne({ token: auth_token }).populate('user');
    user = user.user;

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Unauthorized access" });
    }

    console.log(user);

    const form = await Form.findById(form_id)
      .populate('questions')
      .populate({
        path: 'subForms',
        populate: {
          path: 'questions',
        }
      })


    if (!form) {
      return res
        .status(404)
        .json({ status: "error", message: "Form not found" });
    }

    const questionsArray = form.questions.concat(form.subForms.map(subForm => subForm.questions).flat());

    for (let i = 0; i < questionsArray.length; i++) {
      const question = questionsArray[i];
      const newAnswer = answers.find((ans) => ans.question_id == question._id);
      question.ans = newAnswer.answer;
      question.isAnswered = true;
      await question.save();

      const newHistory = {
        editedBy: user._id,
        editedAt: Date.now(),
        changes: [
          {
            questionID: question._id,
            oldValue: question.ans,
            newValue: newAnswer.answer,
          },
        ],
      };

      form.history.unshift(newHistory);
      form.submittedCount += 1;
      if (form.submittedCount == 3) {
        form.isSubmitted = true;
      }
      form.updatedAt = Date.now();
      await form.save();
    }
    return res.json({ status: "success", message: "Form submitted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", message: err.message });
  }
};

module.exports = { createDraft, submitForm };
