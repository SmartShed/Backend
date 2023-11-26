const SectionData = require("../../models/SectionData");

const addSection = async (req, res) => {
  try {
    const name = req.body.name;

    if (!name) {
      throw new Error("Section name not found");
    }

    let section = await SectionData.findOne({ name: name });

    if (section) {
      throw new Error("Section already exists");
    }

    section = new SectionData({ name: name, forms: [] });
    await section.save();
    res.status(200).json({
      message: "Section added successfully",
      section: section,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  addSection,
};
