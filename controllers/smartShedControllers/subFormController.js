const SubFormData = require("../../models/SubFormData");
const FormData = require("../../models/FormData");

const addSubForm = async (req, res) => {
  try {
    let { titleHindi, titleEnglish, note, formID } = req.body;

    if (titleHindi) titleHindi = titleHindi.trim();
    if (titleEnglish) titleEnglish = titleEnglish.trim();
    if (note) note = note.trim();
    if (formID) formID = formID.trim();

    if (!title || !formID) {
      throw new Error("SubForm title or form ID not found");
    }

    // Check if form exists
    const form = await FormData.findById(formID);

    if (!form) {
      throw new Error("Form not found");
    }

    const subForm = new SubFormData({
      titleHindi: titleHindi,
      titleEnglish: titleEnglish,
      note: note,
      questions: [],
      formID: formID,
    });

    await subForm.save();

    form.subForms.push(subForm._id);

    await form.save();

    res.status(200).json({
      message: "SubForm added successfully",
      subForm: subForm,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const addSubForms = async (req, res) => {
  try {
    // Take formID and array of [title, note] as input
    let { formID, subForms } = req.body;

    if (formID) formID = formID.trim();

    if (!formID || !subForms) {
      throw new Error("Form ID or subForms not found");
    }

    // Check if form exists
    const form = await FormData.findById(formID);

    if (!form) {
      throw new Error("Form not found");
    }

    // Validate subForms
    subForms.forEach((subForm) => {
      if (!subForm.titleHindi || !subForm.titleEnglish) {
        throw new Error("SubForm title not found");
      }
    });

    // Create subForms
    const newSubForms = await SubFormData.insertMany(subForms);

    // Add subForm IDs to form
    newSubForms.forEach((subForm) => {
      form.subForms.push(subForm._id);
    });

    await form.save();

    res.status(200).json({
      message: "SubForms added successfully",
      subForms: newSubForms,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  addSubForm,
  addSubForms,
};
