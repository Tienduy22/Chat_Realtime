const express = require("express");
const userController = require('../controllers/user.controller')
const { upload, uploadCloudinary } = require("../middlewares/uploadCloudinary");

const router = express.Router();

router.get('/', userController.searchUser)

router.get('/profile', userController.findById)

router.post("/password", userController.changePassword);

router.post("/profile/:user_id", userController.updateProfile);

router.post("/avatar/:user_id", upload.array('images', 10), uploadCloudinary, userController.updateAvatar);

module.exports = router;
