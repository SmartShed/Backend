const AuthToken = require("../../models/AuthToken");
const Form = require("../../models/Form");

const { createNotifications, createNotification } = require("../../helpers/notificationHelper");
const { getAllAuthorityIds, getAllSupervisorIds, getAllWorkerIds } = require("../../helpers/userHelper");

const signFormBySupervisor = async (req, res) => {
    try {
        const auth_token = req.headers.auth_token;
        const { formID } = req.body;

        if (!auth_token) {
            throw new Error("Authentication failed!");
        }

        if (!formID) {
            throw new Error("formID is required");
        }

        let supervisor = await AuthToken.findOne({ token: auth_token }).populate("user");
        supervisor = supervisor.user;

        const form = await Form.findById(formID);

        if (!form) {
            throw new Error("Form not found!");
        }

        form.signedBySupervisor = {
            supervisor: supervisor._id,
            isSigned: true,
            signedAt: Date.now()
        }

        form.lockStatus = true;

        await form.save();


        const workerIDs = getAllWorkerIds();
        const supervisorIDs = getAllSupervisorIds();
        const authorityIDs = getAllAuthorityIds();

        const notification = createNotifications(workerIDs, `Form ${form.formName} has been signed by supervisor ${supervisor.name}`)
        const notification2 = createNotifications(supervisorIDs, `Form ${form.formName} has been signed by supervisor ${supervisor.name}`)
        const notifications3 = createNotifications(authorityIDs, `Form ${form.formName} has been signed by supervisor ${supervisor.name}`)

        res.status(200).json({ status: "success", message: "Form signed successfully!" });

    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
}




module.exports = {
    signFormBySupervisor
}