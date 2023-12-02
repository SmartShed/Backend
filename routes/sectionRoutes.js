const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const {
  getAllSections,
  getFormsBySectionId,
  getFormsBySectionName,
} = require("../controllers/sectionController");

// GET all sections
router.get("/", getAllSections);

// GET a section by ID or name
router.get("/:section_param/forms", (req, res) => {
  const sectionParam = req.params.section_param;

  // Check if section_param is a mongoDB ID
  if (mongoose.Types.ObjectId.isValid(sectionParam)) {
    getFormsBySectionId(req, res);
  } else {
    getFormsBySectionName(req, res);
  }
});

module.exports = router;
