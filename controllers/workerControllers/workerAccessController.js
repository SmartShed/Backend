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
        status: "success",
        message: "No forms found",
        forms: [],
      });
    }

    const formIds = user.forms;

    let forms = await Form.find({ _id: { $in: formIds } })
      .sort({
        updatedAt: -1,
      })
      .populate("createdBy");

    forms = forms.map((form) => {
      return {
        id: form._id,
        title: form.title,
        locoName: form.locoName,
        locoNumber: form.locoNumber,
        descriptionEnglish: form.descriptionEnglish,
        descriptionHindi: form.descriptionHindi,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
        createdBy: {
          id: user._id,
          name: user.name,
          section: user.section,
        },
        lockStatus: form.lockStatus,
      };
    });

    const response = {
      status: "success",
      message: "Forms fetched successfully",
      forms: forms,
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
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

    let forms = await Form.find({ formID: { $in: formIds } }).populate(
      "createdBy"
    );

    let newForms = [];

    for (let j = 0; j < forms.length; j++) {
      let access = forms[j].access;

      for (let i = 0; i < access.length; i++) {
        if (access[i].equals(user._id)) {
          newForms.push(forms[j]);
        }
      }
    }

    if (!newForms.length) {
      return res.status(200).json({
        status: "success",
        message: "No forms found",
        forms: [],
      });
    }
    newForms = newForms.map((newForm) => {
      return {
        id: newForm._id,
        title: newForm.title,
        descriptionEnglish: newForm.descriptionEnglish,
        descriptionHindi: newForm.descriptionHindi,
        locoName: newForm.locoName,
        locoNumber: newForm.locoNumber,
        createdAt: newForm.createdAt,
        updatedAt: newForm.updatedAt,
        lockStatus: newForm.lockStatus,
        createdBy: {
          id: user._id,
          name: user.name,
          section: user.section,
        }
      };
    });

    res.status(200).json({
      status: "success",
      message: "Forms fetched successfully",
      forms: newForms,
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

    let forms = await Form.find({ formID: { $in: formIds } }).populate(
      "createdBy"
    );

    let newForms = [];

    for (let j = 0; j < forms.length; j++) {
      let access = forms[j].access;

      for (let i = 0; i < access.length; i++) {
        if (access[i].equals(user._id)) {
          newForms.push(forms[j]);
        }
      }
    }

    if (!newForms.length) {
      return res.status(200).json({
        status: "success",
        message: "No forms found",
        forms: [],
      });
    }
    newForms = newForms.map((newForm) => {
      return {
        id: newForm._id,
        title: newForm.title,
        descriptionEnglish: newForm.descriptionEnglish,
        descriptionHindi: newForm.descriptionHindi,
        locoName: newForm.locoName,
        locoNumber: newForm.locoNumber,
        createdAt: newForm.createdAt,
        updatedAt: newForm.updatedAt,
        lockStatus: newForm.lockStatus,
        createdBy: {
          id: user._id,
          name: user.name,
          section: user.section,
        },
        createdAt: newForm.createdAt,
      };
    });

    res.status(200).json({
      status: "success",
      message: "Forms fetched successfully",
      forms: newForms,
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

    let worker = await AuthToken.findOne({ token: auth_token }).populate("user");

    if (!worker) {
      throw new Error("Invalid auth token");
    }

    workerId = worker.user._id;

    console.log(workerId);

    const submittedForms = await Form.find({ submittedBy: workerId });
    console.log(submittedForms);

    const formsWithAccess = await Form.find({
      access: { $in: [workerId] },
      submittedBy: { $ne: workerId }
    });

    console.log(formsWithAccess);

    res.status(200).json({
      status: "success",
      message: "Forms fetched successfully",
      forms: [...submittedForms, ...formsWithAccess],
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = {
  getRecentForms,
  getRecentFormsBySectionId,
  getRecentFormsBySectionName,
  getSubmittedFormsOfWorker,
};
