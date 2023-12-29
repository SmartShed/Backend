const Faq = require("../../models/Faq");

const faq = async (req, res) => {
  try {
    const {
      questionEnglish,
      questionHindi,
      answerEnglish,
      answerHindi,
      positions,
    } = req.body;

    if (!questionEnglish && !questionHindi) {
      return res.status(400).json({ message: "Question is required!" });
    }

    if (!answerEnglish && !answerHindi) {
      return res.status(400).json({ message: "Answer is required!" });
    }

    if (!positions) {
      return res.status(400).json({ message: "Positions are required!" });
    }

    const lowercasePositions = positions.map((position) =>
      position.toLowerCase()
    );

    const existingInstance = await Faq.findOne({
      questionEnglish,
      questionHindi,
      answerEnglish,
      answerHindi,
      positions: lowercasePositions,
    });

    if (existingInstance) {
      return res.status(400).json({ message: "FAQ already exists!" });
    }

    const newInstance = new Faq({
      questionEnglish,
      questionHindi,
      answerEnglish,
      answerHindi,
      positions: lowercasePositions,
    });

    await newInstance.save();

    res.status(200).json({ message: "FAQ added successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const faqs = async (req, res) => {
  try {
    const { position } = req.params;

    if (!position) {
      return res.status(400).json({ message: "Position is required!" });
    }

    const lowercasePosition = position.toLowerCase();
    const faqs = await Faq.find({ positions: lowercasePosition });
    res.status(200).json({ faqs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { faq, faqs };
