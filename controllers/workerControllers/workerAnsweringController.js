const Form = require("../../models/Form");
const Question = require("../../models/Question");

const createDraft = async (req, res) => {
  const form_id = req.params.form_id;

  const auth_token = req.headers.auth_token;

  const { answers } = req.body;

  try {
    const user_id = await AuthToken.findOne({ token: auth_token }, { user: 1 });

    const form = await Form.findOne({ _id: form_id });

    const questionIDs = form.questions;

    for (let i = 0; i < questionIDs.length; i++) {
      const question = await Question.findOne({ _id: questionIDs[i] });

      const newAnswer = answers.find((ans) => ans.question_id == question._id);

      const newHistory = {
        editedBy: user_id,
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

      question.ans = newAnswer.answer;
      question.isAnswered = true;
      await question.save();
      await form.save();
    }

    return res
      .status(200)
      .json({ status: "success", message: "Draft Saved Successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", message: "Draft saving failed" });
  }
};

const submitForm = async (req, res) => {
  const form_id = req.params.form_id;

  const auth_token = req.headers.auth_token;

  const { answers } = req.body;

  try {
    const user_id = await AuthToken.findOne({ token: auth_token }, { user: 1 });

    const form = await Form.findOne({ _id: form_id });

    const questionIDs = form.questions;

    for (let i = 0; i < questionIDs.length; i++) {
      const question = await Question.findOne({ _id: questionIDs[i] });

      const newAnswer = answers.find((ans) => ans.question_id == question._id);

      const newHistory = {
        editedBy: user_id,
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
      form.submittedBy = user_id;
      form.updatedAt = Date.now();

      if (form.submittedCount == 3) {
        form.lockStatus = true;
      }

      question.ans = newAnswer.answer;
      question.isAnswered = true;
      await question.save();
      await form.save();
    }

    return res
      .status(200)
      .json({ status: "success", message: "Form submitted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", message: "Form submission failed" });
  }
};

module.exports = { createDraft, submitForm };
