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