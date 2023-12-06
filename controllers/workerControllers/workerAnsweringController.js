const Form = require("../../models/Form");
const Question = require("../../models/Question");
const AuthToken = require("../../models/AuthToken");

const createDraft = async (req, res) => {
  const form_id = req.params.form_id;

  const auth_token = req.headers.auth_token;

  const { answers } = req.body;

  try {
    let user = await AuthToken.findOne({ token: auth_token }).populate("user");
    user = user.user;

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Unauthorized access" });
    }

    const form = await Form.findById(form_id)
      .populate("questions")
      .populate({
        path: "subForms",
        populate: {
          path: "questions",
        },
      })
      .populate("history");

    if (!form) {
      return res
        .status(404)
        .json({ status: "error", message: "Form not found" });
    }

    const questionsArray = await Question.find({
      _id: { $in: answers.map((ans) => ans.question_id) },
    });

    const bulkUpdateOperations = questionsArray.map((question) => ({
      updateOne: {
        filter: { _id: question._id },
        update: {
          ans: answers.find((ans) => ans.question_id == question._id).answer,
          isAnswered: true,
        },
      },
    }));

    await Question.bulkWrite(bulkUpdateOperations);

    const newHistories = bulkUpdateOperations.map((operation) => ({
      editedBy: user._id,
      editedAt: Date.now(),
      changes: [
        {
          questionID: operation.updateOne.filter._id,
          oldValue: operation.updateOne.update.ans,
          newValue: operation.updateOne.update.ans,
        },
      ],
    }));

    form.history.unshift(...newHistories);

    form.updatedAt = Date.now();
    await form.save();

    return res.json({ status: "success", message: "Draft saved successfully" });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

const submitForm = async (req, res) => {
  const form_id = req.params.form_id;

  const auth_token = req.headers.auth_token;

  const { answers } = req.body;

  try {
    let user = await AuthToken.findOne({ token: auth_token }).populate("user");
    user = user.user;

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Unauthorized access" });
    }

    const form = await Form.findById(form_id)
      .populate("questions")
      .populate({
        path: "subForms",
        populate: {
          path: "questions",
        },
      });

    if (!form) {
      return res
        .status(404)
        .json({ status: "error", message: "Form not found" });
    }

    const questionsArray = form.questions.concat(
      form.subForms.map((subForm) => subForm.questions).flat()
    );

    const bulkUpdateOperations = questionsArray.map((question) => ({
      updateOne: {
        filter: { _id: question._id },
        update: {
          ans: answers.find((ans) => ans.question_id == question._id).answer,
          isAnswered: true,
        },
      },
    }));

    await Question.bulkWrite(bulkUpdateOperations);

    const newHistory = {
      editedBy: user._id,
      editedAt: Date.now(),
      changes: bulkUpdateOperations.map((operation) => ({
        questionID: operation.updateOne.filter._id,
        oldValue: operation.updateOne.update.ans,
        newValue: operation.updateOne.update.ans,
      })),
    };

    form.history.unshift(newHistory);
    form.submittedCount += 1;
    if (form.submittedCount == 3) {
      form.isSubmitted = true;
    }
    form.updatedAt = Date.now();
    await form.save();
    return res.json({
      status: "success",
      message: "Form submitted successfully",
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

module.exports = { createDraft, submitForm };
