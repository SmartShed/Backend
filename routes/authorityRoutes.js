const express = require("express");
const router = express.Router();
const { authorization } = require("../middlewares");

const {
  getAllUnSignedForms,
  getAllSignedForms,
  getSignedFormsOfAuthority,
} = require("../controllers/authorityControllers/authorityAccessController");

const {
  approveFormByAuthority,
  rejectFormByAuthority,
} = require("../controllers/authorityControllers/authorityAnsweringControllers");

router.get(
  "/forms/unapproved",
  authorization("authority"),
  getAllUnSignedForms
);
router.get("/forms/approved", authorization("authority"), getAllSignedForms);
router.get(
  "/forms/signed/:authorityID",
  authorization("authority"),
  getSignedFormsOfAuthority
);

router.post(
  "/forms/approve",
  authorization("authority"),
  approveFormByAuthority
);
router.post("/forms/reject", authorization("authority"), rejectFormByAuthority);

module.exports = router;
