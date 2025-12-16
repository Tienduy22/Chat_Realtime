const express = require("express");
const conversationController = require("../controllers/conversation.controller");
const { upload, uploadCloudinary } = require("../middlewares/uploadCloudinary");
const {
    validate,
    groupConversationSchema,
    memberSchema,
    memberLeaveSchema,
    changeNameSchema,
    changeAvatarSchema,
} = require("../validations/conversation.validation");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/:conversationId", authenticate, conversationController.AllMessageOfConversation)

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

router.post(
    "/change_role_admin",
    validate(memberSchema),
    conversationController.changeRoleAdmin
);

router.post(
    "/change_name",
    validate(changeNameSchema),
    conversationController.changeName
);

router.post(
    "/change_avatar",
    upload.array("images", 10),
    uploadCloudinary,
    validate(changeAvatarSchema),
    conversationController.changeAvatar
);

router.post(
    "/change_notification",
    validate(memberLeaveSchema),
    conversationController.changeNotification
);

module.exports = router;
