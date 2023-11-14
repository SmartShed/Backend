const Section = require('../models/SectionData');
const Form = require('../models/Form');


const getAllSections = async (req, res) => {

    try {
        const sections = await Section.find({});
        const res = {
            "status": "success",
            "message": "Sections fetched successfully",
            "sections": sections
        }
        res.status(200).json(res);

    } catch (err) {

        res.status(400).json({ message: err.message });
    }
};

// GET a section by ID
// Path: controllers/sectionController.js

const getFormsBySectionId = async (req, res) => {
    try {
        const sectionId = req.params.id;
        const section = await Section.find({ sectionID: sectionId });

        const forms = [];
        for (let i = 0; i < section.forms.length; i++) {
            let form = await Form.find({ formID: section.forms[i] });
            let formObg = {
                id: form[0].formID,
                title: form[0].title,
                description: form[0].description,
            }
            forms.push(formObg);
        }

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



module.exports = { getAllSections, getFormsBySectionId }