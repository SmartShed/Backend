const express = require('express');
const router = express.Router();


const { getRecentForms, getRecentFormsBySection, getOpenedFormsBySection } = require('../controllers/workerControllers/workerAccessController');

const { createForm, getForm, getAnswer, getAnswerOfForm } = require('../controllers/workerControllers/workerOpeningController');


const { createDraft, submitForm } = require('../controllers/workerControllers/workerAnsweringController');

// Form Access APIs
router.get('/forms', getRecentForms);

router.get('/sections/:section_id/forms', getRecentFormsBySection);

router.get("sections/:section_id/opened-forms", getOpenedFormsBySection);


// Worker Opening APIs
router.post("/forms/new/:form_id", createForm);

router.get("/forms/:form_id", getForm);

router.get("/forms/:form_id/questions/:question_id", getAnswer);

router.get("/forms/:form_id/answers", getAnswerOfForm);


// Worker Answering APIs
router.post("/forms/:form_id/draft", createDraft);

router.post("forms/:form_id/submit", submitForm)


module.exports = router;
