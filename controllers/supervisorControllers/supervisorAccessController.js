const Form = require("../../models/Form");

const getAllUnSignedForms = async (req, res) => {
  try {
    const forms = await Form.find({
      "signedBySupervisor.isSigned": false,
    }).populate("createdBy", "-password -isDeleted -isGoogle -forms -__v");

    res.status(200).json({ message: "Forms fetched successfully", forms });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

const getAllSignedForms = async (req, res) => {
  try {
    const forms = await Form.find({
      "signedBySupervisor.isSigned": true,
    })
      .populate({
        path: "signedBySupervisor",
        populate: {
          path: "supervisor",
          model: "User",
          select: "_id name section position email",
        },
      })
      .populate("createdBy", "-password -isDeleted -isGoogle -forms -__v");

    res.status(200).json({ message: "Forms fetched successfully", forms });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getSignedFormsOfSuperVisor = async (req, res) => {
  try {
    const { supervisorID } = req.params;

    if (!supervisorID) {
      throw new Error("supervisorID is required");
    }

    const forms = await Form.find({
      "signedBySupervisor.supervisor": supervisorID,
    })
      .populate({
        path: "signedBySupervisor",
        populate: {
          path: "supervisor",
          model: "User",
          select: "_id name section position email",
        },
      })
      .populate("createdBy", "-password -isDeleted -isGoogle -forms -__v");

    res.status(200).json({
      message: "Forms fetched successfully",
      forms,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getAllUnSignedForms,
  getAllSignedForms,
  getSignedFormsOfSuperVisor,
};
