const { formHelpers } = require('../helpers');

const formController = {
    recentFormController: async (req, res) => {
        const { userId } = req.params;

        const forms = formHelpers.getUserForms(userId);

        const data = [];
        for (let i = 0; i < forms.length; i++) {
            const form = {
                formId: forms[i].formId,
                formName: forms[i].formName,
                id: forms[i]._id,
            }
            data.push(form);

        }
        res.json(data);
    }
    ,
    createController: async (req, res) => {
        const { formId } = req.params;

        const forms = await formHelpers.getFormsByFormId(formId);
        const data = [];
        for (let i = 0; i < forms.length; i++) {
            const form = {
                formId: forms[i].formId,
                formName: forms[i].formName,
                id: forms[i]._id,
            }
            data.push(form);

        }
        res.json(data);
    },

    createFormController: async (req, res) => {
        const { formId } = req.params;
        const { userId } = req.body;

        const questions = await formHelpers.createFormByFormId(userId, formId);

        res.json(questions);
    }
}

module.exports = formController;