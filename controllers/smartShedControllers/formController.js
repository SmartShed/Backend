const SectionData = require("../../models/SectionData");
const FormData = require("../../models/FormData");

const addForm = async (req, res) => {
  try {
    let { title, descriptionHindi, descriptionEnglish, sectionID } = req.body;

    if (title) title = title.trim();
    if (descriptionHindi) descriptionHindi = descriptionHindi.trim();
    if (descriptionEnglish) descriptionEnglish = descriptionEnglish.trim();
    if (sectionID) sectionID = sectionID.trim();

    if (!title || !sectionID) {
      throw new Error("Form title or section ID not found");
    }

    // Check if section exists
    const section = await SectionData.findById(sectionID);

    if (!section) {
      throw new Error("Section not found");
    }

    const form = new FormData({
      title: title,
      description: description,
      subForms: [],
      questions: [],
      sectionID: sectionID,
    });

    await form.save();

    section.forms.push(form._id);
    await section.save();

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
    let { sectionID, forms } = req.body;

    if (sectionID) sectionID = sectionID.trim();

    if (!sectionID || !forms) {
      throw new Error("Section ID or forms not found");
    }

    // Check if section exists
    const section = await SectionData.findById(sectionID);

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
        sectionID: sectionID,
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
