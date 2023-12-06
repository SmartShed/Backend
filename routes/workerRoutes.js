const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const {
  getRecentForms,
  getRecentFormsBySectionId,
  getRecentFormsBySectionName,
} = require("../controllers/workerControllers/workerAccessController");

const {
  createForm,
  getForm,
  getAnswer,
  getAnswerOfForm,
} = require("../controllers/workerControllers/workerOpeningController");

const {
  createDraft,
  submitForm,
} = require("../controllers/workerControllers/workerAnsweringController");

// Form Access APIs
router.get("/forms", getRecentForms);

router.get("/section/:section_param/forms", (req, res) => {
  const sectionParam = req.params.section_param;

  // Check if section_param is a mongoDB ID
  if (mongoose.Types.ObjectId.isValid(sectionParam)) {
    getRecentFormsBySectionId(req, res);
  } else {
    getRecentFormsBySectionName(req, res);
  }
});

// Worker Opening APIs
router.post("/forms/create", createForm);

router.get("/forms/:form_id", getForm);

router.get("/forms/:form_id/questions/:question_id", getAnswer);

router.get("/forms/:form_id/answers", getAnswerOfForm);

// Worker Answering APIs
router.post("/forms/:form_id/draft", createDraft);

router.post("forms/:form_id/submit", submitForm);

module.exports = router;
