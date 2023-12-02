const Form = require("../../models/Form");
const FormData = require("../../models/FormData");
const AuthToken = require("../../models/AuthToken");
const Question = require("../../models/Question");
const QuestionData = require("../../models/QuestionData");
const User = require("../../models/User");
const SubFormData = require("../../models/SubFormData");
const SubForm = require("../../models/SubForm");



const createForm = async (req, res) => {
  const form_id = req.params.form_id;
  const auth_token = req.headers.auth_token;

  const { loconame, loconumber } = req.body;


  try {
    // find user using auth_token

    let user = await AuthToken.findOne({ token: auth_token }, { user: 1 }).populate("user");
    user = user.user;



    if (!user) {
      res.status(400).json({ message: "User does not exist" });
      return;
    }

    const formdata = await FormData.findById(form_id).populate("questions").populate("subForms").populate("subForms.questions");

    const questions = formdata.questions;
    const subforms = formdata.subForms;



    // creating questions for subforms
    let subformsData = [];
    let subformsIDs = [];

    for (let i = 0; i < subforms.length; i++) {
      let subformQuestions = [];
      const subform = await SubFormData.findById(subforms[i]._id).populate("questions");

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

      await newSubform.save();

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
    }

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
      locoName: loconame,
      locoNumber: loconumber,
      formID: formdata._id,
      title: formdata.title,
      description: formdata.description,
      questions: questionIDs,
      subForms: subformsIDs,
      history: [],
      lockStatus: false,
      createdBy: user._id,
      updatedBy: user._id,
      access: [user._id]
    });

    await newForm.save();

    const resForm = {
      formID: formdata._id,
      _id: newForm._id,
      name: formdata.title,
      description: formdata.description,
      status: false,
      created_at: newForm.createdAt,
      updatedAt: newForm.updatedAt,
      questions: questionsData,
      subForms: subformsData,
    };

    res.status(201).json({ message: "Form created successfully", form: resForm });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getForm = async (req, res) => {
  try {
    const form_id = req.params.form_id;

    console.log("form_id", form_id);

    const form = await Form
      .findById(form_id)
      .populate("questions")
      .populate({
        path: "subForms",
        populate: {
          path: "questions",
          model: "Question", // Replace with the actual model name for questions
        },
      });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    return res.status(200).json({ form: form });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
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
    const form = await Form.findById(form_id).populate("questions").populate("subForms");
    if (!form) {
      res.status(400).json({ message: "Form does not exist" });
      return;
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
  getForm, getAnswer, getAnswerOfForm
};
