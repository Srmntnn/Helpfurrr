const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
	{
		from: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
		to: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
		type: {
			type: String,
			required: true,
			enum: ["approved", "rejected"],
		},
		read: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;