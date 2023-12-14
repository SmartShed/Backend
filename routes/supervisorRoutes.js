const express = require("express");
const router = express.Router();

const {
    getAllUnSignedForms,
    getAllSignedForms,
    getSignedFormsOfSuperVisor
} = require("../controllers/supervisorControllers/supervisorAccessController");

const {
    signFormBySupervisor
} = require("../controllers/supervisorControllers/supervisorAnsweringController");



// Supervisor Access Routes
router.get("/forms/unsigned", getAllUnSignedForms);
router.get("/forms/signed", getAllSignedForms);
router.get("/forms/signed/:supervisorID", getSignedFormsOfSuperVisor);


// Supervisor Answer Routes
router.post("/forms/sign", signFormBySupervisor);

module.exports = router;