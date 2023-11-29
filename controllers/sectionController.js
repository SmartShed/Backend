const SectionData = require("../models/SectionData");
const FormData = require("../models/FormData");

const getAllSections = async (req, res) => {

    try {
        const sections = await SectionData.find({});
        const data = {
            "message": "Sections fetched successfully",
            "sections": sections
        }
        res.status(200).json(data);

    } catch (err) {

        res.status(400).json({ message: err.message });
    }
};



const getFormsBySectionId = async (req, res) => {
    try {
        const sectionID = req.params.section_id;

        const section = await SectionData.findById(sectionID).populate('forms');

        if (!section) {
            return res.status(404).json({
                "message": "No Forms found"
            });
        }

        const forms = section.forms.map(form => ({
            id: form._id,
            title: form.title,
            descriptionHindi: form.descriptionHindi,
            descriptionEnglish: form.descriptionEnglish,
        }));



        res.status(200).json({
            "message": "Forms fetched successfully",
            "forms": forms
        });
    } catch (err) {
        res.status(400).json({
            "message": "Forms fetching failed",
        });
    }
}

module.exports = { getAllSections, getFormsBySectionId };
