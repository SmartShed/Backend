const express = require('express');
const router = express.Router();

const { getNotifications, markNotificationAsRead } = require('../controllers/notificationController');

router.get('/getnotifications', getNotifications);

router.put('/marknotificationasread/:id', markNotificationAsRead);

module.exports = router;
