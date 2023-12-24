const Form = require("../../models/Form");

const getAllUnSignedForms = async (req, res) => {
  try {
    let forms = await Form.find({
      "signedBySupervisor.isSigned": true,
      "signedByAuthority.isSigned": false,
    })
      .populate("createdBy")
      .populate("signedBySupervisor");

    forms = forms.map((form) => {
      return {
        formID: form.formID,
        _id: form._id,
        locoName: form.locoName,
        locoNumber: form.locoNumber,
        title: form.title,
        descriptionHindi: form.descriptionHindi,
        descriptionEnglish: form.descriptionEnglish,
        submittedCount: form.submittedCount,
        lockStatus: form.lockStatus,
        signedBySupervisor: form.signedBySupervisor,
        createdBy: {
          id: form.createdBy._id,
          name: form.createdBy.name,
          section: form.createdBy.section,
        },
        submittedBy: form.submittedBy,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
      };
    });
    res
      .status(200)
      .json({ message: "Forms fetched successfully", forms: forms });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

const getAllSignedForms = async (req, res) => {
  try {
    let forms = await Form.find({
      "signedBySupervisor.isSigned": true,
      "signedByAuthority.isSigned": true,
    })
      .populate("createdBy")
      .populate("signedBySupervisor");

    forms = forms.map((form) => {
      return {
        formID: form.formID,
        _id: form._id,
        locoName: form.locoName,
        locoNumber: form.locoNumber,
        title: form.title,
        descriptionHindi: form.descriptionHindi,
        descriptionEnglish: form.descriptionEnglish,
        submittedCount: form.submittedCount,
        lockStatus: form.lockStatus,
        signedBySupervisor: form.signedBySupervisor,
        createdBy: {
          id: form.createdBy._id,
          name: form.createdBy.name,
          section: form.createdBy.section,
        },
        submittedBy: form.submittedBy,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
      };
    });

    res
      .status(200)
      .json({ message: "Forms fetched successfully", forms: forms });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

const getSignedFormsOfAuthority = async (req, res) => {
  try {
    const authorityID = req.params.authorityID;
    let forms = await Form.find({
      "signedBySupervisor.isSigned": true,
      "signedByAuthority.isSigned": true,
      "signedByAuthority.signedBy": authorityID,
    })
      .populate("createdBy")
      .populate("signedBySupervisor.supervisor")
      .populate("signedByAuthority.authority");

    forms = forms.map((form) => {
      return {
        formID: form.formID,
        _id: form._id,
        locoName: form.locoName,
        locoNumber: form.locoNumber,
        title: form.title,
        descriptionHindi: form.descriptionHindi,
        descriptionEnglish: form.descriptionEnglish,
        submittedCount: form.submittedCount,
        lockStatus: form.lockStatus,
        signedBySupervisor: form.signedBySupervisor,
        createdBy: {
          id: form.createdBy._id,
          name: form.createdBy.name,
          section: form.createdBy.section,
        },
        submittedBy: form.submittedBy,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
      };
    });

    res.status(200).json({
      message: "Forms fetched successfully",
      forms: forms,
    });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

module.exports = {
  getAllUnSignedForms,
  getAllSignedForms,
  getSignedFormsOfAuthority,
};
