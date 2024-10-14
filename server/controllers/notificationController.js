const Notification = require("../models/notification.js");

const getNotifications = async (req, res) => {
	try {
		const UserId = req.params._id;

		const notifications = await Notification.find({ to: UserId }).populate({
			path: "from",
			select: "username",
		});

		await Notification.updateMany({ to: UserId }, { read: true });

		res.status(200).json(notifications);
	} catch (error) {
		console.log("Error in getNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const deleteNotifications = async (req, res) => {
	try {
		const userId = req.params._id;

		await Notification.deleteMany({ to: userId });

		res.status(200).json({ message: "Notifications deleted successfully" });
	} catch (error) {
		console.log("Error in deleteNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = {
    getNotifications,
    deleteNotifications,
  }