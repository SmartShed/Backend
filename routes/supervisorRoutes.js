const express = require("express");
const router = express.Router();
const { authorization } = require("../middlewares")

const {
    getAllUnSignedForms,
    getAllSignedForms,
    getSignedFormsOfSuperVisor
} = require("../controllers/supervisorControllers/supervisorAccessController");

const {
    signFormBySupervisor
} = require("../controllers/supervisorControllers/supervisorAnsweringController");



// Supervisor Access Routes
router.get("/forms/unsigned", authorization("supervisor"), getAllUnSignedForms);
router.get("/forms/signed", authorization("supervisor"), getAllSignedForms);
router.get("/forms/signed/:supervisorID", authorization("supervisor"), getSignedFormsOfSuperVisor);


// Supervisor Answer Routes
router.post("/forms/sign", authorization("supervisor"), signFormBySupervisor);

module.exports = router;