const Form = require("../../models/Form");
const FormData = require("../../models/FormData");
const AuthToken = require("../../models/AuthToken");
const Question = require("../../models/Question");
const QuestionData = require("../../models/QuestionData");
const User = require("../../models/User");



// const createForm = async (req, res) => {
//   const form_id = req.params.form_id;
//   const auth_token = req.headers.auth_token;

//   console.log("form_id", form_id);
//   console.log("auth_token", auth_token);

//   try {
//     // find user using auth_token

//     const user = await AuthToken.findOne({ token: auth_token }, { user: 1 }).populate("user");

//     console.log("user", user);

//     if (!user) {
//       res.status(400).json({ message: "User does not exist" });
//       return;
//     }

//     const formdata = await FormData.findById(form_id).populate("questions").populate("subForms");

//     const questions = formdata.questions;
//     const subforms = formdata.subForms;


//     let newQuestions = [];
//     for (let i = 0; i < questions.length; i++) {
//       const question = questions[i];

//       const newQuestion = await Question.create({
//         questionID: question._id,
//         textEnglish: question.textEnglish,
//         textHindi: question.textHindi,
//         ansType: question.ansType,
//         isAnswered: false,
//         ans: null,
//       });

//       await newQuestion.save();

//       newQuestions.push({
//         "_id": newQuestion._id,
//         "textEnglish": newQuestion.textEnglish,
//         "textHindi": newQuestion.textHindi,
//         "ansType": newQuestion.ansType,
//       });
//     }

//     let newSubForms = [];
//     for (let i = 0; i < subforms.length; i++) {
//       const subform = subforms[i];

//       for(let i=0; i<subform.questions.length; i++) {
//         const question_id = subform.questions[i];

//         const question = await QuestionData.findById(question_id);

//         const newQuestion = await Question.create({
//           questionID: question._id,
//           textEnglish: question.textEnglish,
//           textHindi: question.textHindi,
//           ansType: question.ansType,
//           isAnswered: false,
//           ans: null,
//         });

//         await newQuestion.save();








//     if (!formdata) {
//       res.status(400).json({ message: "Form does not exist" });
//       return;
//     }

//     const form = await Form.create({
//       formID: formdata._id,
//       title: formdata.title,
//       description: formdata.descriptionEnglish,
//       questions: formdata.questions,
//       subForms: formdata.subForms,
//       sectionID: formdata.sectionID,
//       createdBy: user.user._id,
//     });


//   }

//   catch (err) {
//     res.status(500).json({ message: "Form creation failed" });
//   }
// };


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

module.exports = { getForm, getAnswer, getAnswerOfForm };
