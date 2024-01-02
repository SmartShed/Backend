const Form = require("../../models/Form");

const getAllUnSignedForms = async (req, res) => {
  try {
    const forms = await Form.find({
      "signedBySupervisor.isSigned": true,
      "signedByAuthority.isSigned": false,
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

const getAllSignedForms = async (req, res) => {
  try {
    const forms = await Form.find({
      "signedBySupervisor.isSigned": true,
      "signedByAuthority.isSigned": true,
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

const getSignedFormsOfAuthority = async (req, res) => {
  try {
    const authorityID = req.params.authorityID;
    const forms = await Form.find({
      "signedBySupervisor.isSigned": true,
      "signedByAuthority.isSigned": true,
      "signedByAuthority.signedBy": authorityID,
    })
      .populate({
        path: "signedBySupervisor",
        populate: {
          path: "supervisor",
          model: "User",
          select: "_id name section position email",
        },
      })
      .populate({
        path: "signedByAuthority",
        populate: {
          path: "authority",
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

module.exports = {
  getAllUnSignedForms,
  getAllSignedForms,
  getSignedFormsOfAuthority,
};
