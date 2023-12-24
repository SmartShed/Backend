const Form = require("../../models/Form");
const Question = require("../../models/Question");
const AuthToken = require("../../models/AuthToken");
const User = require("../../models/User");

const { createNotifications } = require("../../helpers/notificationHelper");
const { getAllSupervisorIds } = require("../../helpers/userHelper");

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

    // Push form id to user's forms array if not already present
    if (!user.forms.includes(form_id)) {
      user.forms.push(form_id);
      await user.save();
    }

    // Check if user has access to this form
    if (!form.access.includes(user._id)) {
      form.access.push(user._id);
      await form.save();
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

    const newHistory = {
      editedBy: user._id,
      editedAt: Date.now(),
      changes: [],
    };

    bulkUpdateOperations.forEach((operation) => {
      const questionID = operation.updateOne.filter._id;
      const oldValue = questionsArray.find(
        (question) => question._id == questionID
      ).ans;
      const newValue = answers.find(
        (ans) => ans.question_id == questionID
      ).answer;

      if (oldValue !== newValue) {
        newHistory.changes.push({
          questionID,
          oldValue,
          newValue,
        });
      }
    });

    if (newHistory.changes.length > 0) {
      form.history.unshift(newHistory);
      form.updatedAt = Date.now();
      await form.save();
    }

    return res.json({ status: "success", message: "Draft saved successfully" });
  } catch (err) {
    console.log(err);
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
      })
      .populate("history");

    if (!form) {
      return res
        .status(404)
        .json({ status: "error", message: "Form not found" });
    }

    if (form.lockStatus) {
      return res
        .status(400)
        .json({ status: "error", message: "Form is locked" });
    }

    const workerIds = form.access;

    workerIds.forEach(async (workerId) => {
      let worker = await User.findById(workerId);
      worker.forms = worker.forms.filter((formId) => formId != form_id);
      await worker.save();
    });

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
      changes: [],
    };

    bulkUpdateOperations.forEach((operation) => {
      const questionID = operation.updateOne.filter._id;
      const oldValue = questionsArray.find(
        (question) => question._id == questionID
      ).ans;
      const newValue = answers.find(
        (ans) => ans.question_id == questionID
      ).answer;

      if (oldValue !== newValue) {
        newHistory.changes.push({
          questionID,
          oldValue,
          newValue,
        });
      }
    });

    if (newHistory.changes.length > 0) {
      form.history.unshift(newHistory);
    }

    form.submittedCount += 1;
    if (form.submittedCount == 3) {
      form.lockStatus = true;
    }
    form.updatedAt = Date.now();
    await form.save();

    await createNotifications(
      workerIds,
      `Form ${form.title} for loco ${form.locoNumber} loconame ${form.locoName} submitted by ${user.name}`,
      `लोको ${form.locoNumber} लोको नाम ${form.locoName} द्वारा ${user.name} द्वारा जमा किया गया फॉर्म ${form.title}`,
      form._id,
      null
    );

    const supervisorIDs = await getAllSupervisorIds();

    await createNotifications(
      supervisorIDs,
      `Form ${form.title} for loco ${form.locoNumber} loconame ${form.locoName} submitted by ${user.name}`,
      `लोको ${form.locoNumber} लोको नाम ${form.locoName} द्वारा ${user.name} द्वारा जमा किया गया फॉर्म ${form.title}`,
      form._id,
      null
    );

    return res.json({
      status: "success",
      message: "Form submitted successfully",
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

module.exports = { createDraft, submitForm };
