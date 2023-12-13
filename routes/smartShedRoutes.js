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

const {
  addEmployees,
  getEmployees,
} = require("../controllers/smartShedControllers/employeesController");

router.post("/section", addSection);

router.post("/form", addForm);
router.post("/forms", addForms);

router.post("/sub-form", addSubForm);
router.post("/sub-forms", addSubForms);

router.post("/question", addQuestion);
router.post("/questions", addQuestions);

router.post("/employees", addEmployees);
router.get("/employees", getEmployees);

module.exports = router;
