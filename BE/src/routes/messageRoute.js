const express = require("express");
const messageController = require("../controllers/message.controller")
const { upload, uploadCloudinary } = require("../middlewares/uploadCloudinary");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authenticate, upload.array('files'), uploadCloudinary, messageController.createMessage)

router.post("/seem_message", authenticate, messageController.markAsRead)

router.delete("/delete_message", authenticate, messageController.deleteMessage)

router.post("/edit_message", authenticate, messageController.editMessage)

router.post("/reaction_message", authenticate, messageController.reactionMessage)

module.exports = router;
