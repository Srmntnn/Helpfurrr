const express = require("express");
const { deleteNotifications, getNotifications, getNotificationCount }  = require("../controllers/notificationController");

const router = express.Router();

router.get("/:userId", getNotifications);
router.get("/count/:userId", getNotificationCount)
router.delete("/:userId",  deleteNotifications);

module.exports = router; 