const express = require("express");
const { deleteNotifications, getNotifications }  = require("../controllers/notificationController");

const router = express.Router();

router.get("/", getNotifications);
router.delete("/",  deleteNotifications);

module.exports = router; 