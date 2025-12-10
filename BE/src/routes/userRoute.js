const express = require("express");
const userController = require('../controllers/user.controller')
const { upload, uploadCloudinary } = require("../middlewares/uploadCloudinary");

const router = express.Router();

router.get('/', userController.searchUser)

router.patch("/profile/:user_id", upload.array('images', 10), uploadCloudinary, userController.updateProfile);

module.exports = router;
