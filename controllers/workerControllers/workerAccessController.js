const AuthToken = require("../../models/AuthToken");
const Form = require("../../models/Form");
const User = require("../../models/User");
const SectionData = require("../../models/SectionData");

const getRecentForms = async (req, res) => {
  try {
    const auth_token = req.headers.auth_token;

    if (!auth_token) {
      throw new Error("Auth token not found");
    }

    const user_id = await AuthToken.findOne({ token: auth_token }, { user: 1 });

    if (!user_id) {
      throw new Error("Invalid auth token");
    }

    const user = await User.findOne({ _id: user_id.user });

    if (!user) {
      throw new Error("User not foundd");
    }

    if (!user.forms.length) {
      return res.status(200).json({
        message: "No forms found",
        forms: [],
      });
    }

    const formIds = user.forms;

    const forms = await Form.find(
      { _id: { $in: formIds } },
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

    const response = {
      message: "Forms fetched successfully",
      forms: forms,
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getRecentFormsBySectionId = async (req, res) => {
  const section_id = req.params.section_param;

  const auth_token = req.headers.auth_token;

  try {
    const section = await SectionData.findById(section_id);

    if (!section) {
      throw new Error("Section not found");
    }

    let user = await AuthToken.findOne(
      { token: auth_token },
      { user: 1 }
    ).populate("user");
    user = user.user;

    if (!user) {
      throw new Error("User not found");
    }

    const formIds = section.forms;

    const forms = await Form.find(
      {
        formID: { $in: formIds },
        access: user._id,
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
      .populate("createdBy", "-password -isDeleted -isGoogle -forms -__v")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      message: "Forms fetched successfully",
      forms,
    });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

const getRecentFormsBySectionName = async (req, res) => {
  const section_name = req.params.section_param;

  const auth_token = req.headers.auth_token;

  try {
    const section = await SectionData.findOne({ name: section_name });

    if (!section) {
      throw new Error("Section not found");
    }

    let user = await AuthToken.findOne(
      { token: auth_token },
      { user: 1 }
    ).populate("user");
    user = user.user;

    if (!user) {
      throw new Error("User not found");
    }

    const formIds = section.forms;

    const forms = await Form.find(
      {
        formID: { $in: formIds },
        access: user._id,
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
      .populate("createdBy", "-password -isDeleted -isGoogle -forms -__v")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      message: "Forms fetched successfully",
      forms,
    });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

const getSubmittedFormsOfWorker = async (req, res) => {
  try {
    const auth_token = req.headers.auth_token;

    if (!auth_token) {
      throw new Error("Auth token not found");
    }

    let worker = await AuthToken.findOne({ token: auth_token }).populate(
      "user"
    );

    if (!worker) {
      throw new Error("Invalid auth token");
    }

    const workerId = worker.user._id;

    const submittedForms = await Form.find({ submittedBy: workerId });

    const formsWithAccess = await Form.find({
      access: { $in: [workerId] },
      submittedBy: { $ne: workerId },
    });

    res.status(200).json({
      message: "Forms fetched successfully",
      forms: [...submittedForms, ...formsWithAccess],
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getRecentForms,
  getRecentFormsBySectionId,
  getRecentFormsBySectionName,
  getSubmittedFormsOfWorker,
};
