const QuestionData = require("../../models/QuestionData");
const SubFormData = require("../../models/SubFormData");
const FormData = require("../../models/FormData");

const addQuestion = async (req, res) => {
  try {
    let { textEnglish, textHindi, ansType, formID, subFormID } = req.body;

    console.log(req.body);

    if (textEnglish) textEnglish = textEnglish.trim();
    if (textHindi) textHindi = textHindi.trim();
    if (ansType) ansType = ansType.trim();
    if (formID) formID = formID.trim();
    if (subFormID) subFormID = subFormID.trim();

    console.log({ textEnglish, textHindi, ansType, formID, subFormID });

    let isSubForm;

    // If formID and subFormID both are present, set isSubForm to true
    if (formID && subFormID) {
      isSubForm = true;
    }

    // If formID is provided but subFormID is not, set isSubForm to false
    else if (formID && !subFormID) {
      isSubForm = false;
    }

    // If subFormID is provided but formID is not, throw error
    else if (!formID && subFormID) {
      isSubForm = true;
    }

    // If neither formID nor subFormID is provided, throw error
    else {
      throw new Error("Form ID or subForm ID not found");
    }

    // If isSubForm is true, check if subForm exists
    if (isSubForm) {
      const subForm = await SubFormData.findById(subFormID);

      if (!subForm) {
        throw new Error("SubForm not found");
      }

      const question = new QuestionData({
        textEnglish: textEnglish,
        textHindi: textHindi,
        ansType: ansType,
        isSubForm: isSubForm,
        subFormID: subFormID,
      });

      await question.save();

      subForm.questions.push(question._id);

      await subForm.save();

      res.status(200).json({
        message: "Question added successfully",
        question: question,
      });
    } else {
      // If isSubForm is false, check if form exists
      const form = await FormData.findById(formID);

      if (!form) {
        throw new Error("Form not found");
      }

      const question = new QuestionData({
        textEnglish: textEnglish,
        textHindi: textHindi,
        ansType: ansType,
        isSubForm: isSubForm,
        formID: formID,
      });

      await question.save();

      form.questions.push(question._id);

      await form.save();

      res.status(200).json({
        message: "Question added successfully",
        question: question,
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const addQuestions = async (req, res) => {
  try {
    // Take formID OR subFormID and array of [englishText, hindiText, ansType] as input
    let { formID, subFormID, questions } = req.body;

    if (formID) formID = formID.trim();
    if (subFormID) subFormID = subFormID.trim();

    let isSubForm;

    if (!questions) {
      throw new Error("Questions not found");
    }

    // If formID and subFormID both are present, set isSubForm to true
    if (formID && subFormID) {
      isSubForm = true;
    }

    // If formID is provided but subFormID is not, set isSubForm to false
    else if (formID && !subFormID) {
      isSubForm = false;
    }

    // If subFormID is provided but formID is not, throw error
    else if (!formID && subFormID) {
      isSubForm = true;
    }

    // If neither formID nor subFormID is provided, throw error
    else {
      throw new Error("Form ID or subForm ID not found");
    }

    // If isSubForm is true, check if subForm exists
    if (isSubForm) {
      const subForm = await SubFormData.findById(subFormID);

      if (!subForm) {
        throw new Error("SubForm not found");
      }

      // Add questions
      const newQuestions = [];

      for (const question of questions) {
        const newQuestion = new QuestionData({
          textEnglish: question.textEnglish.trim(),
          textHindi: question.textHindi.trim(),
          ansType: question.ansType,
          isSubForm: isSubForm,
          subFormID: subFormID,
        });

        await newQuestion.save();

        subForm.questions.push(newQuestion._id);

        newQuestions.push(newQuestion);
      }

      await subForm.save();

      res.status(200).json({
        message: "Questions added successfully",
        questions: newQuestions,
      });
    } else {
      // If isSubForm is false, check if form exists
      const form = await FormData.findById(formID);

      if (!form) {
        throw new Error("Form not found");
      }

      // Validate questions
      questions.forEach((question) => {
        if (!question.textEnglish || !question.textHindi || !question.ansType) {
          throw new Error("Question details not found");
        }
      });

      const newQuestions = [];

      // Add questions
      for (const question of questions) {
        const newQuestion = new QuestionData({
          textEnglish: question.textEnglish.trim(),
          textHindi: question.textHindi.trim(),
          ansType: question.ansType,
          isSubForm: isSubForm,
          formID: formID,
        });

        await newQuestion.save();

        form.questions.push(newQuestion._id);

        newQuestions.push(newQuestion);
      }

      await form.save();

      res.status(200).json({
        message: "Questions added successfully",
        questions: newQuestions,
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  addQuestion,
  addQuestions,
};
