const express = require("express");
const contactController = require('../controllers/contact.controller')
const { validate, contactInvitationsSchema } = require("../validations/contact.validation");

const router = express.Router();

router.post('/send', validate(contactInvitationsSchema), contactController.sendInvitations)

router.post('/accept', validate(contactInvitationsSchema), contactController.acceptInvitations)

router.post('/reject', validate(contactInvitationsSchema), contactController.rejectInvitations)

router.get('/friends', contactController.listFriends)

router.post('/block', contactController.blockFriend)

router.post('/unblock', contactController.unBlockFriend)

router.get('/list_blocked', contactController.listBlocked)

module.exports = router;
