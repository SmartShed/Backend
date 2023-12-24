const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const {
  getRecentForms,
  getRecentFormsBySectionId,
  getRecentFormsBySectionName,
  getSubmittedFormsOfWorker,
} = require("../controllers/workerControllers/workerAccessController");

const {
  createForm,
  getOpeningForms,
  getForm,
  getAnswer,
  getAnswerOfForm,
} = require("../controllers/workerControllers/workerOpeningController");

const {
  createDraft,
  submitForm,
} = require("../controllers/workerControllers/workerAnsweringController");

router.get("/section/:section_param/forms", (req, res) => {
  const sectionParam = req.params.section_param;

  // Check if section_param is a mongoDB ID
  if (mongoose.Types.ObjectId.isValid(sectionParam)) {
    getRecentFormsBySectionId(req, res);
  } else {
    getRecentFormsBySectionName(req, res);
  }
});

// Form Access APIs
router.get("/forms", getRecentForms);
router.get("/forms/submitted", getSubmittedFormsOfWorker);

// Worker Opening APIs
router.post("/forms/create", createForm);
router.get("/forms/opening/:form_id", getOpeningForms);
router.get("/forms/:form_id", getForm);
router.get("/forms/:form_id/questions/:question_id", getAnswer);
router.get("/forms/:form_id/answers", getAnswerOfForm);

// Worker Answering APIs
router.post("/forms/:form_id/draft", createDraft);
router.post("/forms/:form_id/submit", submitForm);

module.exports = router;
