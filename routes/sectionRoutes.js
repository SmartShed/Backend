const express = require('express');
const router = express.Router();

const { getAllSections, getFormsBySectionId } = require('../controllers/sectionController');



// GET all sections
router.get('/', getAllSections);

// GET a section by ID
router.get('/:id/forms', getFormsBySectionId);


module.exports = router;