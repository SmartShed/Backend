const Notification = require('../models/Notification');

const createNotification = async (userId, content) => {
    try {
        const notification = new Notification({ user: userId, content });
        await notification.save();
        return notification;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to create notification');
    }
};

const createNotifications = async (userIds, content) => {
    try {
        const allNotifications = userIds.map((userId) => {
            return {
                user: userId,
                content: content,
                isRead: false,
                createdAt: Date.now()
            }
        })


        const notifications = await Notification.insertMany(allNotifications);
        return notifications;
    }
    catch (error) {
        console.error(error);
        throw new Error('Failed to create notification');
    }
}



module.exports = { createNotification, createNotifications };