const express = require("express");
const conversationController = require("../controllers/conversation.controller");
const { upload, uploadCloudinary } = require("../middlewares/uploadCloudinary");
const {
    validate,
    groupConversationSchema,
    memberSchema,
    memberLeaveSchema,
} = require("../validations/conversation.validation");

const router = express.Router();

router.post(
    "/new_group",
    upload.array("images", 10),
    uploadCloudinary,
    validate(groupConversationSchema),
    conversationController.createNewGroupConversation
);

router.post(
    "/member",
    validate(memberSchema),
    conversationController.addMember
);

router.delete(
    "/member",
    validate(memberSchema),
    conversationController.deleteMember
);

router.post(
    "/member_leave",
    validate(memberLeaveSchema),
    conversationController.memberLeave
);

router.post(
    "/admin_leave",
    validate(memberSchema),
    conversationController.adminLeave
);

module.exports = router;
