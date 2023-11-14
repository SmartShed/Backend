const AuthToken = require('../models/AuthToken');
const Form = require('../models/Form');
const User = require('../models/User');

const getRecentForms = async (req, res) => {
    try {
        const auth_token = req.headers.auth_token;

        if (!auth_token) {
            throw new Error("Auth token not found");
        }

        const user = await AuthToken.findOne({ token: auth_token }).populate('user');
        if (!user) {
            throw new Error("Invalid auth token");
        }

        const formIds = user.forms;
        let forms = await Form.find({ _id: { $in: formIds } }).sort({ createdAt: -1 }).limit(5);

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
        res.status(400).json({ message: err.message });
    }
}