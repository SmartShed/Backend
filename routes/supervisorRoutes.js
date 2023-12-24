const express = require("express");
const router = express.Router();
const { authorization } = require("../middlewares");

const {
  getAllUnSignedForms,
  getAllSignedForms,
  getSignedFormsOfSuperVisor,
} = require("../controllers/supervisorControllers/supervisorAccessController");

const {
  approveFormBySupervisor,
  rejectFormBySupervisor,
} = require("../controllers/supervisorControllers/supervisorAnsweringController");

// Supervisor Access Routes
router.get(
  "/forms/unapproved",
  authorization("supervisor"),
  getAllUnSignedForms
);
router.get("/forms/approved", authorization("supervisor"), getAllSignedForms);
router.get(
  "/forms/approved/:supervisorID",
  authorization("supervisor"),
  getSignedFormsOfSuperVisor
);

// Supervisor Answer Routes
router.post(
  "/forms/approve",
  authorization("supervisor"),
  approveFormBySupervisor
);
router.post(
  "/forms/reject",
  authorization("supervisor"),
  rejectFormBySupervisor
);

module.exports = router;
