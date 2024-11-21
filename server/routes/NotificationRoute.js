const express = require("express");
const { deleteNotifications, getNotifications }  = require("../controllers/notificationController");

const router = express.Router();

router.get("/:userId", getNotifications);
router.delete("/:userId",  deleteNotifications);

module.exports = router; 