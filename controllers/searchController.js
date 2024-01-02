const Form = require("../models/Form");

const searchForms = async (req, res) => {
  try {
    const searchParam = req.params.search_param;

    const forms = await Form.find(
      {
        $or: [
          { title: { $regex: searchParam, $options: "i" } },
          { locoName: { $regex: searchParam, $options: "i" } },
          { locoNumber: { $regex: searchParam, $options: "i" } },
        ],
      },
      {
        title: 1,
        descriptionEnglish: 1,
        descriptionHindi: 1,
        locoName: 1,
        locoNumber: 1,
        createdAt: 1,
        updatedAt: 1,
        lockStatus: 1,
        createdBy: 1,
      }
    )
      .sort({ updatedAt: -1 })
      .populate("createdBy", "-password -isDeleted -isGoogle -forms -__v");

    if (!forms) {
      return res.status(404).json({
        message: "No Forms found",
      });
    }

    res.status(200).json({ message: "Forms fetched successfully", forms });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { searchForms };
