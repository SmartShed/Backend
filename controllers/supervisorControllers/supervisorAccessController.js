const AuthToken = require("../../models/AuthToken");
const Form = require("../../models/Form");
const User = require("../../models/User");


const getAllUnSignedForms = async (req, res) => {
    try {

        let forms = await Form.find({
            "signedBySupervisor.isSigned": false
        });

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
                createdBy: form.createdBy,
                submittedBy: form.submittedBy,
                createdAt: form.createdAt,
                updatedAt: form.updatedAt,
            }
        })

        console.log(forms);
        res.status(200).json(forms);
    }
    catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
}


const getAllSignedForms = async (req, res) => {
    try {

        let forms = await Form.find({
            "signedBySupervisor.isSigned": true
        }).polulate("signedBySupervisor.supervisor")

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
                createdBy: form.createdBy,
                submittedBy: form.submittedBy,
                createdAt: form.createdAt,
                updatedAt: form.updatedAt,
            }
        })

        console.log(forms);
        res.status(200).json(forms);
    }
    catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
}


const getSignedFormsOfSuperVisor = async (req, res) => {
    try {
        const { supervisorID } = req.params;

        if (!supervisorID) {
            throw new Error("supervisorID is required");
        }

        let forms = await Form.find({
            "signedBySupervisor.supervisor": supervisorID
        }).populate("signedBySupervisor.supervisor")

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
                createdBy: form.createdBy,
                submittedBy: form.submittedBy,
                createdAt: form.createdAt,
                updatedAt: form.updatedAt,
            }
        })

        console.log(forms);
        res.status(200).json(forms);
    }
    catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
}






module.exports = { getAllUnSignedForms, getAllSignedForms, getSignedFormsOfSuperVisor };