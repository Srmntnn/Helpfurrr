const Notification = require("../models/notification.js");

const getNotifications = async (req, res) => {
	try {
		const { userId } = req.params; // Get userId from request parameters

		const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

		if (notifications.length > 0) {
			res.status(200).json(notifications);
		} else {
			res.status(404).json({ message: 'No notifications found' });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const deleteAllNotifications = async (req, res) => {
	try {
		const userId = req.params._id;

		await Notification.deleteMany({ to: userId });

		res.status(200).json({ message: "Notifications deleted successfully" });
	} catch (error) {
		console.log("Error in deleteNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const deleteNotifications = async (req, res) => {
	try {
	  const notificationId = req.params.id; // ID of the notification to delete
  
	  const deletedNotification = await Notification.findByIdAndDelete(notificationId);
  
	  if (!deletedNotification) {
		return res.status(404).json({ error: "Notification not found" });
	  }
  
	  res.status(200).json({ message: "Notification deleted successfully" });
	} catch (error) {
	  console.log("Error in deleteNotification function:", error.message);
	  res.status(500).json({ error: "Internal Server Error" });
	}
  };
  

const getNotificationCount = async (req, res) => {
	try {
		// Retrieve userId from request parameters
		const { userId } = req.params;

		// Check if userId is provided
		if (!userId) {
			return res.status(400).json({ message: 'User ID is required' });
		}

		// Count the number of unread notifications for the user
		const count = await Notification.countDocuments({ user: userId, isRead: false });

		// If no notifications found
		if (count === null || count === undefined) {
			return res.status(404).json({ message: 'Error fetching notification count' });
		}

		// Send the count of unread notifications
		res.json({ count });
	} catch (error) {
		console.error(error);  // Log the error for debugging
		res.status(500).json({ message: 'Error fetching notification count' });
	}
};


module.exports = {
	getNotifications,
	deleteNotifications,
	getNotificationCount,
	deleteAllNotifications
}