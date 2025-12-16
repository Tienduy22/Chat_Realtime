const express = require("express");
const messageController = require("../controllers/message.controller")
const { upload, uploadCloudinary } = require("../middlewares/uploadCloudinary");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", upload.array('files'), uploadCloudinary, messageController.createMessage)

router.post("/seem_message", messageController.markAsRead)

router.delete("/delete_message", messageController.deleteMessage)

router.patch("/edit_message", messageController.editMessage)

router.post("/reaction_message", messageController.reactionMessage)

module.exports = router;
