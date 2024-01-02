const Form = require("../../models/Form");

const getAllUnSignedForms = async (req, res) => {
  try {
    const forms = await Form.find(
      {
        "signedBySupervisor.isSigned": true,
        "signedByAuthority.isSigned": false,
        submittedCount: { $gt: 0 },
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
    ).populate("createdBy", "-password -isDeleted -isGoogle -forms -__v");

    res.status(200).json({ message: "Forms fetched successfully", forms });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllSignedForms = async (req, res) => {
  try {
    const forms = await Form.find(
      {
        "signedBySupervisor.isSigned": true,
        "signedByAuthority.isSigned": true,
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
    ).populate("createdBy", "-password -isDeleted -isGoogle -forms -__v");

    res.status(200).json({ message: "Forms fetched successfully", forms });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getSignedFormsOfAuthority = async (req, res) => {
  try {
    const authorityID = req.params.authorityID;
    const forms = await Form.find(
      {
        "signedBySupervisor.isSigned": true,
        "signedByAuthority.isSigned": true,
        "signedByAuthority.signedBy": authorityID,
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
    ).populate("createdBy", "-password -isDeleted -isGoogle -forms -__v");

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
