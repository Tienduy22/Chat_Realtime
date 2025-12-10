const express = require("express");
const conversationController = require("../controllers/conversation.controller");
const { upload, uploadCloudinary } = require("../middlewares/uploadCloudinary");

const router = express.Router();

router.post('/new_group', upload.array('images', 10), uploadCloudinary, conversationController.createNewGroupConversation)

module.exports = router;
