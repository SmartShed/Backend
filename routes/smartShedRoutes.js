const express = require("express");
const router = express.Router();

const {
  addSection,
} = require("../controllers/smartShedControllers/sectionController");

const {
  addForm,
  addForms,
} = require("../controllers/smartShedControllers/formController");

const {
  addSubForm,
  addSubForms,
} = require("../controllers/smartShedControllers/subFormController");

const {
  addQuestion,
  addQuestions,
} = require("../controllers/smartShedControllers/questionController");

router.post("/section", addSection);

router.post("/form", addForm);
router.post("/forms", addForms);

router.post("/subForm", addSubForm);
router.post("/subForms", addSubForms);

router.post("/question", addQuestion);
router.post("/questions", addQuestions);

module.exports = router;
