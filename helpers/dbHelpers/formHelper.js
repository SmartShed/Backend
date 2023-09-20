const { log } = require('console');
const fs = require('fs');
const path = require('path');


const formHelpers = {
    formsPath: path.join(__dirname, '../../db/forms.json'),
    formsDataPath: path.join(__dirname, '../../db/formsData.json'),
    questionsPath: path.join(__dirname, '../../db/questions.json'),

    getQuestionWithFormId: async (formId) => {
        try {
            console.log("inside get question with form id");
            const formsData = await fs.readFileSync(formHelpers.formsDataPath, 'utf8');
            const forms = JSON.parse(formsData);
            const form = forms.filter(form => form.formId == formId);

            let questionsData = await fs.readFileSync(formHelpers.questionsPath, 'utf8');
            questionsData = JSON.parse(questionsData);

            let questions = [];

            for (let i = 0; i < form.questions.length; i++) {
                if (form.questions[i].questionId == questionsData[i].questionId) {
                    questions.push(questionsData[i]);
                }
            }

            console.log("helper questions", questions);

            return questions;

        }
        catch (err) {
            console.log(err);
        }
    },


    getFormsByFormId: async (formId) => {
        console.log("helper formId", formId);
        formId = Number(formId);
        try {
            const data = await fs.readFileSync(formHelpers.formsPath, 'utf8');
            let forms = JSON.parse(data);
            console.log("helper forms", forms);

            forms = forms.filter(form => form.formId == formId);
            console.log("helper forms", forms);
            return forms;
        }
        catch (err) {
            console.log(err);
        }

    },
    getForms: async () => {
        try {
            const data = fs.readFileSync(formHelpers.formsPath, 'utf8');
            const forms = JSON.parse(data);
            return forms;
        }
        catch (err) {
            console.log(err);
        }
    }
    ,
    getUserForms: (userId) => {
        try {
            userId = Number(userId);

            const data = fs.readFileSync(formHelpers.formsPath, 'utf8');
            const forms = JSON.parse(data);


            const userForms = forms.filter((form) => {
                return form.access.includes(userId);
            })

            return userForms;
        }
        catch (err) {
            console.log(err);
        }
    },
    createFormByFormId: (userId, formId) => {
        formId = Number(formId);
        userId = Number(userId);

        const formsData = fs.readFileSync(formHelpers.formsDataPath, 'utf8');

        let formData = JSON.parse(formsData);
        formData = formData.filter(form => form.formId == formId)[0];

        console.log("formData", formData);
        const form = {
            "formId": formData.formId,
            "formName": formData.formName,
            "_id": "1234567890",
            "answers": [],
            "access": [userId],
            "createdBy": userId,
            "submittedBy": []
        }

        try {
            const data = fs.readFileSync(formHelpers.formsPath, 'utf8');
            const forms = JSON.parse(data);
            forms.push(form);
            fs.writeFileSync(formHelpers.formsPath, JSON.stringify(forms));



            let questionsData = fs.readFileSync(formHelpers.questionsPath, 'utf8');


            questionsData = JSON.parse(questionsData);


            let questions = [];

            for (let i = 0; i < formData.questions.length; i++) {
                if (formData.questions[i].questionId == questionsData[i].questionId) {
                    questions.push(questionsData[i]);
                }
            }



            return questions;
        }
        catch (err) {
            console.log(err);
        }




    }
}


module.exports = formHelpers;