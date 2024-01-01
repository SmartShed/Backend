const Form = require("../../models/Form");
const AuthToken = require("../../models/AuthToken");
const { getAllSupervisorIds } = require("../../helpers/userHelper");
const {
  createNotifications,
  createNotification,
} = require("../../helpers/notificationHelper");

const approveFormByAuthority = async (req, res) => {
  try {
    const auth_token = req.headers.auth_token;
    const { formID } = req.body;

    if (!auth_token) {
      throw new Error("Authentication failed!");
    }

    if (!formID) {
      throw new Error("formID is required");
    }

    let authorityData = await AuthToken.findOne({ token: auth_token }).populate(
      "user"
    );
    authorityData = authorityData.user;

    const form = await Form.findById(formID);

    if (!form) {
      throw new Error("Form not found!");
    }

    if (form.signedByAuthority.isSigned) {
      return res.status(400).json({ message: "Form already signed!" });
    }

    const signedByAuthority = {
      isSigned: true,
      authority: authorityData._id,
      signedAt: Date.now(),
    };

    form.signedByAuthority = signedByAuthority;

    await form.save();

    const supervisorIDs = await getAllSupervisorIds();

    await createNotifications(
      supervisorIDs,
      `Form approved by authority ${authorityData.name} for the loco ${form.locoName} ${form.locoNumber}`,
      `प्राधिकरण ${authorityData.name} द्वारा लोको ${form.locoName} ${form.locoNumber} के लिए फॉर्म स्वीकृत किया गया`,
      form._id,
      authorityData._id
    );

    res.status(200).json({ message: "Form signed successfully!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const rejectFormByAuthority = async (req, res) => {
  try {
    const auth_token = req.headers.auth_token;
    const { formID } = req.body;

    if (!auth_token) {
      throw new Error("Authentication failed!");
    }

    if (!formID) {
      throw new Error("formID is required");
    }

    let authorityData = await AuthToken.findOne({ token: auth_token }).populate(
      "user"
    );
    authorityData = authorityData.user;

    const form = await Form.findById(formID);

    if (!form) {
      throw new Error("Form not found!");
    }

    const signedByAuthority = {
      isSigned: false,
      authority: authorityData._id,
      signedAt: Date.now(),
    };

    form.signedByAuthority = signedByAuthority;

    await form.save();

    const supervisorID = form.signedBySupervisor.supervisor;

    await createNotification(
      supervisorID,
      `Form rejected by authority ${authorityData.name} for the loco ${form.locoName} ${form.locoNumber}`,
      `प्राधिकरण ${authorityData.name} द्वारा लोको ${form.locoName} ${form.locoNumber} के लिए फॉर्म अस्वीकृत किया गया`,
      form._id,
      authorityData._id
    );

    res.status(200).json({ message: "Form rejected successfully!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  approveFormByAuthority,
  rejectFormByAuthority,
};
