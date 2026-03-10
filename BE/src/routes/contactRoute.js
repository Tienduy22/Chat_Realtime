const express = require("express");
const contactController = require('../controllers/contact.controller')
const { validate, contactInvitationsSchema } = require("../validations/contact.validation");

const router = express.Router();

router.post('/send', contactController.sendInvitations)

router.post('/accept', contactController.acceptInvitations)

router.post('/reject', contactController.rejectInvitations)

router.get('/find_contact', contactController.findContactByPhone)

router.get('/send_invitations', contactController.findSendInvitations)

router.get('/invitations', contactController.findInvitations)

router.get('/friends', contactController.listFriends)

router.post('/block', contactController.blockFriend)

router.post('/unblock', contactController.unBlockFriend)

router.get('/list_blocked', contactController.listBlocked)

router.delete('/invitations', contactController.removeInvitations)

module.exports = router;
