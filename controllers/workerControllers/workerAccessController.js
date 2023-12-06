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
        createdBy: form.createdBy.name,
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

const getRecentFormsBySection = async (req, res) => {
  const section_id = req.params.section_id;

  const auth_token = req.headers.auth_token;



  try {
    const Section = await SectionData.findById(section_id);

    if (!Section) {
      throw new Error("Section not found");
    }

    let user = await AuthToken.findOne({ token: auth_token }, { user: 1 }).populate('user');
    user = user.user;

    if (!user) {
      throw new Error("User not found");
    }

    const formIds = Section.forms;

    let forms = await Form.find({ formID: { $in: formIds } }).populate('createdBy');


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
        description: newForm.description,
        createdAt: newForm.createdAt,
        updatedAt: newForm.updatedAt,
        lockStatus: newForm.lockStatus,
        createdBy: {
          id: newForm.createdBy._id,
          name: newForm.createdBy.name,
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

const getOpenedFormsBySection = async (req, res) => {
  const section_id = req.params.section_id;

  const auth_token = req.headers.auth_token;

  try {
    const Section = await SectionData.findById(section_id);

    if (!Section) {
      throw new Error("Section not found");
    }

    const formIds = Section.forms;

    let forms = await Form.find({ formID: { $in: formIds } }).populate('createdBy');

    if (!forms.length) {
      return res.status(200).json({
        status: "success",
        message: "No forms found",
        forms: [],
      });
    }

    forms = forms.map((form) => {
      return {
        id: form._id,
        locoName: form.locoName,
        locoNumber: form.locoNumber,
        title: form.title,
        descriptionHindi: form.descriptionHindi,
        descriptionEnglish: form.descriptionEnglish,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
        createdBy: {
          id: form.createdBy._id,
          name: form.createdBy.name,
        },
      };
    }
    );

    res.status(200).json({
      status: "success",
      message: "Forms fetched successfully",
      forms: forms,
    });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

module.exports = {
  getRecentForms,
  getRecentFormsBySection,
  getOpenedFormsBySection,
};
