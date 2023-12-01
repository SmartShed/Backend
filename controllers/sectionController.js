const SectionData = require("../models/SectionData");
const FormData = require("../models/FormData");

const getAllSections = async (req, res) => {
  try {
    const sections = await SectionData.find({});

    if (!sections) {
      return res.status(404).json({
        message: "No Sections found",
      });
    }

    // retrive only title of the sections
    // const sections = sections.map(section => ({
    //     id: section._id,
    //     title: section.title,
    //

    const data = {
      message: "Sections fetched successfully",
      sections: sections.map((section) => ({
        id: section._id,
        title: section.name,
      })),
    };
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getFormsBySectionId = async (req, res) => {
  try {
    const sectionID = req.params.section_param;

    const section = await SectionData.findById(sectionID).populate("forms");

    if (!section) {
      return res.status(404).json({
        message: "No Forms found",
      });
    }

    const forms = section.forms.map((form) => ({
      id: form._id,
      title: form.title,
      descriptionHindi: form.descriptionHindi,
      descriptionEnglish: form.descriptionEnglish,
    }));

    res.status(200).json({
      message: "Forms fetched successfully",
      forms: forms,
    });
  } catch (err) {
    res.status(400).json({
      message: "Forms fetching failed",
    });
  }
};

const getFormsBySectionName = async (req, res) => {
  try {
    const sectionName = req.params.section_param;

    const section = await SectionData.findOne({ name: sectionName }).populate(
      "forms"
    );

    if (!section) {
      return res.status(404).json({
        message: "No Forms found",
      });
    }

    const forms = section.forms.map((form) => ({
      id: form._id,
      title: form.title,
      descriptionHindi: form.descriptionHindi,
      descriptionEnglish: form.descriptionEnglish,
    }));

    res.status(200).json({
      message: "Forms fetched successfully",
      forms: forms,
    });
  } catch (err) {
    res.status(400).json({
      message: "Forms fetching failed",
    });
  }
};

module.exports = { getAllSections, getFormsBySectionId, getFormsBySectionName };
