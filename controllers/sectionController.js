const SectionData = require("../models/SectionData");
const Form = require("../models/Form");

const getAllSections = async (req, res) => {
  try {
    const sections = await SectionData.find({});

    if (!sections) {
      return res.status(404).json({
        message: "No Sections found",
      });
    }

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

const getOpenedFormsBySectionId = async (req, res) => {
  const sectionID = req.params.section_param;

  try {
    const Section = await SectionData.findById(sectionID);

    if (!Section) {
      throw new Error("Section not found");
    }

    const formIds = Section.forms;

    let forms = await Form.find({ formID: { $in: formIds } }).populate(
      "createdBy"
    );

    if (!forms.length) {
      return res.status(200).json({
        status: "success",
        message: "No forms found",
        forms: [],
      });
    }

    forms = forms.map((form) => {
      return {
        id: form._id,
        locoName: form.locoName,
        locoNumber: form.locoNumber,
        title: form.title,
        descriptionHindi: form.descriptionHindi,
        descriptionEnglish: form.descriptionEnglish,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
        createdBy: {
          id: form.createdBy._id,
          name: form.createdBy.name,
          section: form.createdBy.section,
        },
      };
    });

    res.status(200).json({
      status: "success",
      message: "Forms fetched successfully",
      forms: forms,
    });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

const getOpenedFormsBySectionName = async (req, res) => {
  const sectionName = req.params.section_param;

  try {
    const section = await SectionData.findOne({ name: sectionName });

    if (!section) {
      throw new Error("Section not found");
    }

    const formIds = section.forms;

    let forms = await Form.find({ formID: { $in: formIds } }).populate(
      "createdBy"
    );

    if (!forms.length) {
      return res.status(200).json({
        status: "success",
        message: "No forms found",
        forms: [],
      });
    }

    forms = forms.map((form) => {
      return {
        id: form._id,
        locoName: form.locoName,
        locoNumber: form.locoNumber,
        title: form.title,
        descriptionHindi: form.descriptionHindi,
        descriptionEnglish: form.descriptionEnglish,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
        createdBy: {
          id: form.createdBy._id,
          name: form.createdBy.name,
          section: form.createdBy.section,
        }
      };
    });

    res.status(200).json({
      status: "success",
      message: "Forms fetched successfully",
      forms: forms,
    });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

module.exports = {
  getAllSections,
  getFormsBySectionId,
  getFormsBySectionName,
  getOpenedFormsBySectionId,
  getOpenedFormsBySectionName,
};
