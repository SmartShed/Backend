const AuthToken = require("../../models/AuthToken");
const Form = require("../../models/Form");

const {
  createNotification,
  createNotifications,
} = require("../../helpers/notificationHelper");
const {
  getAllAuthorityIds,
  getAllWorkerIds,
  getSupervisorIdsBySection,
} = require("../../helpers/userHelper");

const approveFormBySupervisor = async (req, res) => {
  try {
    const auth_token = req.headers.auth_token;
    const { formID } = req.body;

    if (!auth_token) {
      throw new Error("Authentication failed!");
    }

    if (!formID) {
      throw new Error("formID is required");
    }

    let supervisorData = await AuthToken.findOne({
      token: auth_token,
    }).populate("user");
    supervisorData = supervisorData.user;

    const form = await Form.findById(formID);

    if (!form) {
      throw new Error("Form not found!");
    }

    form.signedBySupervisor = {
      isSigned: true,
      supervisor: supervisorData._id,
      signedAt: Date.now(),
    };

    form.lockStatus = true;

    await form.save();

    const workerIDs = await getAllWorkerIds();
    const supervisorIDs = await getSupervisorIdsBySection(
      supervisorData.section
    );
    const authorityIDs = await getAllAuthorityIds();

    await createNotifications(
      workerIDs,
      `Form approved by supervisor ${supervisorData.name}`,
      `प्रबंधक द्वारा फॉर्म स्वीकृत किया गया`,
      form._id,
      supervisorData._id
    );

    await createNotifications(
      supervisorIDs,
      `Form approved by supervisor ${supervisorData.name}`,
      `प्रबंधक द्वारा फॉर्म स्वीकृत किया गया`,
      form._id,
      supervisorData._id
    );

    await createNotifications(
      authorityIDs,
      `Form approved by supervisor ${supervisorData.name}`,
      `प्रबंधक द्वारा फॉर्म स्वीकृत किया गया`,
      form._id,
      supervisorData._id
    );

    res.status(200).json({ message: "Form signed successfully!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const rejectFormBySupervisor = async (req, res) => {
  try {
    const auth_token = req.headers.auth_token;
    const { formID } = req.body;

    if (!auth_token) {
      throw new Error("Authentication failed!");
    }

    if (!formID) {
      throw new Error("formID is required");
    }

    let supervisorData = await AuthToken.findOne({
      token: auth_token,
    }).populate("user");
    supervisorData = supervisorData.user;

    const form = await Form.findById(formID).populate("submittedBy");

    if (!form) {
      throw new Error("Form not found!");
    }

    form.signedBySupervisor = {
      isSigned: false,
      supervisor: supervisorData._id,
      signedAt: Date.now(),
    };

    form.lockStatus = false;

    await form.save();

    const workerId = form.submittedBy._id;

    await createNotification(
      workerId,
      `Form rejected by supervisor ${supervisorData.name}`,
      `प्रबंधक द्वारा फॉर्म अस्वीकृत किया गया`,
      form._id,
      supervisorData._id
    );

    res.status(200).json({ message: "Form rejected successfully!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  approveFormBySupervisor,
  rejectFormBySupervisor,
};
