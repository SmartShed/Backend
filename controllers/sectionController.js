const SectionData = require("../models/SectionData");
const FormData = require("../models/FormData");

const getAllSections = async (req, res) => {
    try {
        const sections = await SectionData.find({});
        const data = {
            status: "success",
            message: "Sections fetched successfully",
            sections: sections,
        };
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getFormsBySectionId = async (req, res) => {
    try {
        const sectionID = req.params.section_id;
        const section = await SectionData.findOne({ sectionID: sectionID });

        if (!section) {
            res.status(400).json({
                status: "error",
                message: "Section not found",
            });
            return;
        }

        const forms = [];

        for (let i = 0; i < section.forms.length; i++) {
            let form = await FormData.findOne({ formID: section.forms[i] });
            let formObj = {
                id: form.formID,
                title: form.title,
                description: form.description,
            };
            forms.push(formObj);
        }

        res.status(200).json({
            status: "success",
            message: "Forms fetched successfully",
            forms: forms,
        });
    } catch (err) {
        res.status(400).json({
            status: "error",
            message: err.message,
        });
    }
};

module.exports = { getAllSections, getFormsBySectionId };
