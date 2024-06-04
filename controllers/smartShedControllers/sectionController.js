const SectionData = require("../../models/SectionData");
const { createNotifications } = require("../../helpers/notificationHelper");
const {
  getAllAuthorityIds,
  getAllSupervisorIds,
} = require("../../helpers/userHelper");

const addSection = async (req, res) => {
  try {
    let name = req.body.name;

    if (name) name = name.trim();

    if (!name) {
      throw new Error("Section name not found");
    }

    let section = await SectionData.findOne({ name: name });

    if (section) {
      throw new Error("Section already exists");
    }

    section = new SectionData({ name: name, forms: [] });
    await section.save();

    const authorityIDs = await getAllAuthorityIds();
    const supervisorIDs = await getAllSupervisorIds();

    await createNotifications(
      authorityIDs,
      `New section added ${name}`,
      `नया अनुभाग जोड़ा गया ${name}`,
      null,
      null
    );

    await createNotifications(
      supervisorIDs,
      `New section added ${name}`,
      `नया अनुभाग जोड़ा गया ${name}`,
      null,
      null
    );

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
