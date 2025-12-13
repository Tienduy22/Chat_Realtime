const express = require("express");
const messageController = require("../controllers/message.controller")
const { upload, uploadCloudinary } = require("../middlewares/uploadCloudinary");

const router = express.Router();

router.post("/", upload.array('files'), uploadCloudinary, messageController.createMessage)

module.exports = router;
