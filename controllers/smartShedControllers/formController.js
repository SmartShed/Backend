const SectionData = require("../../models/SectionData");
const FormData = require("../../models/FormData");

const { createNotifications } = require("../../helpers/notificationHelper");

const {
  getAllAuthorityIds,
  getAllSupervisorIds,
} = require("../../helpers/userHelper");

const addForm = async (req, res) => {
  try {
    let { title, descriptionHindi, descriptionEnglish, sectionName } = req.body;

    if (title) title = title.trim();
    if (descriptionHindi) descriptionHindi = descriptionHindi.trim();
    if (descriptionEnglish) descriptionEnglish = descriptionEnglish.trim();
    if (sectionName) sectionName = sectionName.trim();

    if (!title || !sectionName) {
      throw new Error("Form title or section name not found");
    }

    // Check if section exists
    const section = await SectionData.findOne({ name: sectionName });

    if (!section) {
      throw new Error("Section not found");
    }

    const form = new FormData({
      title: title,
      descriptionEnglish: descriptionEnglish,
      descriptionHindi: descriptionHindi,
      subForms: [],
      questions: [],
      sectionID: section._id,
    });

    await form.save();

    section.forms.push(form._id);
    await section.save();

    const authorityIDs = await getAllAuthorityIds();
    const supervisorIDs = await getAllSupervisorIds();

    await createNotifications(
      authorityIDs,
      `New form added ${title} in section ${section.name}`,
      `नया फॉर्म जोड़ा गया ${title} अनुभाग में ${section.name}`,
      form._id,
      null
    );

    await createNotifications(
      supervisorIDs,
      `New form added ${title} in section ${section.name}`,
      `नया फॉर्म जोड़ा गया ${title} अनुभाग में ${section.name}`,
      form._id,
      null
    );

    res.status(200).json({
      message: "Form added successfully",
      form: form,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const addForms = async (req, res) => {
  try {
    // Take sectionID and array of [title, description] as input
    let { sectionName, forms } = req.body;

    if (sectionName) sectionName = sectionName.trim();

    if (!sectionName || !forms) {
      throw new Error("Section name or forms not found");
    }

    // Check if section exists
    const section = await SectionData.findOne({ name: sectionName });

    if (!section) {
      throw new Error("Section not found");
    }

    // Create forms
    const formsDB = forms.map((form) => {
      return new FormData({
        title: form.title.trim(),
        descriptionEnglish: form.descriptionEnglish.trim(),
        descriptionHindi: form.descriptionHindi.trim(),
        subForms: [],
        questions: [],
        sectionID: section._id,
      });
    });

    // Save forms
    await FormData.insertMany(formsDB);

    // Add forms to section
    formsDB.forEach((form) => {
      section.forms.push(form._id);
    });

    await section.save();

    res.status(200).json({
      message: "Forms added successfully",
      forms: formsDB,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  addForm,
  addForms,
};
