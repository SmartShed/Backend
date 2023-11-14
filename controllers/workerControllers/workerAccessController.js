const AuthToken = require('../../models/AuthToken');
const Form = require('../../models/Form');
const User = require('../../models/User');
const SectionData = require('../../models/SectionData');

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

        const user = await User.findOne({ _id: user_id });

        const formIds = user.forms;
        let forms = await Form.findMany({ _id: { $in: formIds } }).sort({ createdAt: -1 }).limit(5);


        forms = forms.map(form => {
            return {
                id: form._id,
                title: form.title,
                description: form.description,
                createdAt: form.createdAt,
                updatedAt: form.updatedAt,
                lockStatus: form.lockStatus
            }
        });


        const res = {
            "status": "success",
            "message": "Forms fetched successfully",
            "forms": forms
        }
        res.status(200).json(res);
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
}

const getRecentFormsBySection = async (req, res) => {
    const section_id = req.params.section_id;

    const auth_token = req.headers.auth_token;

    try {
        const user_id = await AuthToken.findOne({ token: auth_token }, { user: 1 });

        const user = await User.findOne({ _id: user_id });

        const formIds = user.forms;

        forms = await Form.findMany({ _id: { $in: formIds }, sectionID: section_id }).sort({ createdAt: -1 }).limit(5);

        forms = forms.map(form => {
            return {
                id: form._id,
                title: form.title,
                description: form.description,
                createdAt: form.createdAt,
                updatedAt: form.updatedAt,
                lockStatus: form.lockStatus
            }
        });

        res.status(200).json({ status: "success", message: "Forms fetched successfully", forms: forms });

    }
    catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
}

const getOpenedFormsBySection = async (req, res) => {
    const section_id = req.params.section_id;

    const auth_token = req.headers.auth_token;

    try {
        const Section = await SectionData.findOne({ sectionID: section_id });

        const formIds = Section.forms;

        forms = await Form.findMany({ _id: { $in: formIds }, lockStatus: false }).sort({ createdAt: -1 }).limit(5);

        forms = forms.map(form => {
            return {
                id: form._id,
                title: form.title,
                description: form.description,
                createdAt: form.createdAt,
                updatedAt: form.updatedAt,
                lockStatus: form.lockStatus,
                createdBy: form.createdBy,
                createdAt: form.created_at
            }
        });

        res.status(200).json({ status: "success", message: "Forms fetched successfully", forms: forms });
    }
    catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }

}

module.exports = {
    getRecentForms, getRecentFormsBySection, getOpenedFormsBySection
}