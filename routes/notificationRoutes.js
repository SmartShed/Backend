const express = require("express");
const router = express.Router();

const {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationController");

router.get("/getnotifications", getNotifications);
router.put("/marknotificationasread/:id", markNotificationAsRead);
router.delete("/deletenotification/:id", deleteNotification);
router.delete("/deleteallnotifications", deleteAllNotifications);

module.exports = router;
