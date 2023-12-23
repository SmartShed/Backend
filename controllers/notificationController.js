const Notification = require('../models/Notification');
const AuthToken = require('../models/AuthToken');

const getNotifications = async (req, res) => {
    const auth_token = req.headers.auth_token;

    try {
        let user = await AuthToken.findOne({ token: auth_token }).populate('user');

        user = user.user;

        const userId = user._id;

        const notifications = await Notification.findById(userId).sort({ createdAt: -1 });

        return res.status(200).json({ message: 'Notifications fetched successfully', notifications });
    } catch (error) {

        return res.status(500).json({ error: error.message });
    }
};


const markNotificationAsRead = async (req, res) => {
    const auth_token = req.headers.auth_token;
    const notificationId = req.params.id;

    try {
        let user = await AuthToken.findOne({ token: auth_token }).populate('user');
        user = user.user;

        const userId = user._id;

        const notification = await Notification.findById(notificationId);

        if (notification.user.toString() !== userId.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        notification.read = true;

        await notification.save();

        return res.status(200).json({ message: 'Notification marked as read' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteNotification = async (req, res) => {
    const auth_token = req.headers.auth_token;
    const notificationId = req.params.id;

    try {
        const notification = await Notification.findById(notificationId);

        if (notification.user.toString() !== userId.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const response = await Notification.findByIdAndDelete(notificationId);

        if (!response) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        return res.status(200).json({ message: 'Notification deleted successfully' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const deleteAllNotifications = async (req, res) => {
    const auth_token = req.headers.auth_token;

    try {
        let user = await AuthToken.findOne({ token: auth_token }).populate('user');

        user = user.user;

        const userId = user._id;

        const response = await Notification.deleteMany({ user: userId });

        if (!response) {
            return res.status(404).json({ message: 'Notifications not found' });
        }

        return res.status(200).json({ message: 'Notifications deleted successfully' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}








module.exports = { getNotifications, markNotificationAsRead, deleteNotification, deleteAllNotifications };