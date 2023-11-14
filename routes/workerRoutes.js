const express = require('express');
const router = express.Router();


const { getRecentForms } = require('../controllers/workerController');

router.get('/forms', getRecentForms);