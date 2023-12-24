const Notification = require("../models/Notification");

const createNotification = async (
  user,
  contentEnglish,
  contentHindi,
  formId,
  userId
) => {
  try {
    const notification = await Notification.create({
      user: user,
      contentEnglish: contentEnglish,
      contentHindi: contentHindi,
      formId: formId,
      userId: userId,
    });

    notification.save();
    return notification;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create notification");
  }
};

const createNotifications = async (
  users,
  contentEnglish,
  contentHindi,
  formId,
  userId
) => {
  try {
    const allNotifications = users.map((user) => {
      return {
        user: user,
        contentEnglish: contentEnglish,
        contentHindi: contentHindi,
        formId: formId,
        userId: userId,
      };
    });
    const notifications = await Notification.insertMany(allNotifications);
    return notifications;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create notification");
  }
};

module.exports = { createNotification, createNotifications };
