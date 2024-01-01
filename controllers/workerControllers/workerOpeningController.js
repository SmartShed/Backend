const Form = require("../../models/Form");
const FormData = require("../../models/FormData");
const AuthToken = require("../../models/AuthToken");
const Question = require("../../models/Question");
const User = require("../../models/User");
const SubFormData = require("../../models/SubFormData");
const SubForm = require("../../models/SubForm");

const { createNotifications } = require("../../helpers/notificationHelper");
const { getAllWorkerIds } = require("../../helpers/userHelper");

const createForm = async (req, res) => {
  const auth_token = req.headers.auth_token;

  const { form_id, loco_name, loco_number } = req.body;

  try {
    let user = await AuthToken.findOne(
      { token: auth_token },
      { user: 1 }
    ).populate("user");
    user = user.user;

    if (!user) {
      res.status(400).json({ message: "User does not exist" });
      return;
    }

    const formdata = await FormData.findById(form_id)
      .populate("questions")
      .populate("subForms")
      .populate({
        path: "subForms",
        populate: {
          path: "questions",
        },
      });

    const questions = formdata.questions;
    const subforms = formdata.subForms;

    let subformsData = [];
    let subformsIDs = [];

    const bulkOperations = [];

    for (let i = 0; i < subforms.length; i++) {
      const subform = subforms[i];
      let subformQuestions = [];

      let questionIDs = [];
      for (let j = 0; j < subform.questions.length; j++) {
        const question = subform.questions[j];

        subformQuestions.push({
          questionID: question._id,
          textEnglish: question.textEnglish,
          textHindi: question.textHindi,
          ansType: question.ansType,
          isAnswered: false,
          ans: null,
        });
      }

      subformQuestions = await Question.insertMany(subformQuestions);

      for (let j = 0; j < subformQuestions.length; j++) {
        questionIDs.push(subformQuestions[j]._id);
      }

      const newSubform = new SubForm({
        subFormID: subform._id,
        titleHindi: subform.titleHindi,
        titleEnglish: subform.titleEnglish,
        note: subform.note,
        questions: questionIDs,
        formID: formdata._id,
      });

      subformsIDs.push(newSubform._id);

      subformsData.push({
        subFormID: subform._id,
        _id: newSubform._id,
        titleHindi: subform.titleHindi,
        titleEnglish: subform.titleEnglish,
        note: subform.note,
        questions: subformQuestions,
        formID: subform.formID,
      });

      bulkOperations.push({
        insertOne: {
          document: newSubform,
        },
      });
    }

    await SubForm.bulkWrite(bulkOperations);

    // creating questions for form
    let questionsData = [];
    let questionIDs = [];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      questionsData.push({
        questionID: question._id,
        textEnglish: question.textEnglish,
        textHindi: question.textHindi,
        ansType: question.ansType,
        isAnswered: false,
        ans: null,
      });
    }

    questionsData = await Question.insertMany(questionsData);

    for (let i = 0; i < questionsData.length; i++) {
      questionIDs.push(questionsData[i]._id);
    }

    // creating questions for form
    const newForm = new Form({
      locoName: loco_name,
      locoNumber: loco_number,
      formID: formdata._id,
      title: formdata.title,
      descriptionEnglish: formdata.descriptionEnglish,
      descriptionHindi: formdata.descriptionHindi,
      questions: questionIDs,
      subForms: subformsIDs,
      history: [],
      lockStatus: false,
      createdBy: user._id,
      updatedBy: user._id,
      access: [user._id],
    });

    await newForm.save();

    user.forms.push(newForm._id);

    await user.save();

    const resForm = {
      id: newForm._id,
      title: newForm.title,
      descriptionEnglish: newForm.descriptionEnglish,
      descriptionHindi: newForm.descriptionHindi,
      locoName: newForm.locoName,
      locoNumber: newForm.locoNumber,
      createdAt: newForm.createdAt,
      updatedAt: newForm.updatedAt,
      createdBy: {
        id: user._id,
        name: user.name,
        section: user.section,
        position: user.position,
        email: user.email,
      },
      lockStatus: newForm.lockStatus,
    };

    const workerIds = await getAllWorkerIds();

    await createNotifications(
      workerIds,
      `New form opened ${newForm.title} for ${newForm.locoName} ${newForm.locoNumber} by ${user.name}`,
      `नया फॉर्म खोला गया ${newForm.title} ${newForm.locoName} ${newForm.locoNumber} द्वारा ${user.name}`,
      newForm._id,
      user._id
    );

    res.status(201).json({
      message: "Form created successfully",
      form: resForm,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOpeningForms = async (req, res) => {
  const { form_id } = req.params;

  try {
    const form = await FormData.findById(form_id)
      .populate("questions")
      .populate({
        path: "subForms",
        populate: {
          path: "questions",
          model: "QuestionData",
        },
      });

    if (!form) {
      return res.status(400).json({ message: "Form does not exist" });
    }

    return res.status(200).json({
      message: "Form retrieved successfully",
      form: form,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getForm = async (req, res) => {
  try {
    const form_id = req.params.form_id;

    const form = await Form.findById(form_id)
      .populate("questions")
      .populate({
        path: "subForms",
        populate: {
          path: "questions",
          model: "Question",
        },
      })
      .populate("createdBy", "_id name section position email")
      .populate({
        path: "history.editedBy",
        model: "User",
        select: "_id name section position email",
      })
      .populate({
        path: "signedBySupervisor",
        populate: {
          path: "supervisor",
          model: "User",
          select: "_id name section position email",
        },
        match: { "signedBySupervisor.isSigned": true },
      })
      .populate({
        path: "signedByAuthority",
        populate: {
          path: "authority",
          model: "User",
          select: "_id name section position email",
        },
        match: { "signedByAuthority.isSigned": true },
      });

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const history = form.history.map((h) => ({
      editedBy: h.editedBy,
      editedAt: h.editedAt,
      changes: h.changes,
    }));

    return res.status(200).json({
      message: "Form retrieved successfully",
      form: {
        ...form._doc,
        history,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAnswer = async (req, res) => {
  const form_id = req.params.form_id;
  const question_id = req.params.question_id;

  try {
    const form = await Form.findById(form_id);

    if (!form) {
      res.status(400).json({ message: "Form does not exist" });
      return;
    }

    let question = await Question.findById(question_id);
    if (!question) {
      return res.status(400).json({
        message: "Question does not exist",
      });
    }

    let questionHistory = null;
    for (let i = 0; i < form.history.length; i++) {
      if (form.history[i].changes.questionID == question._id) {
        questionHistory = form.history[i];
      }
    }

    if (!questionHistory) {
      return res.status(200).json({
        message: "Answer retrieved successfully",
        answer: {
          question_id: question._id,
          answer: question.ans,
          answer_by: {
            name: "Not available",
            edited_at: "Not available",
          },
        },
      });
    }

    const user = await User.findById(questionHistory.editedBy);

    return res.status(200).json({
      message: "Answer retrieved successfully",
      answer: {
        question_id: question._id,
        answer: question.ans,
        answer_by: {
          name: user.name,
          section: user.section,
          edited_at: questionHistory.editedAt,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAnswerOfForm = async (req, res) => {
  const form_id = req.params.form_id;
  console.log("form_id", form_id);

  try {
    const form = await Form.findById(form_id)
      .populate("questions")
      .populate("subForms");
    if (!form) {
      return res.status(400).json({ message: "Form does not exist" });
    }

    res.status(201).json({
      message: "Answers retrieved successfully",
      answers: form,
    });
  } catch (err) {
    res.status(500).json({ message: "Answers retrieval failed" });
  }
};

module.exports = {
  createForm,
  getOpeningForms,
  getForm,
  getAnswer,
  getAnswerOfForm,
};
