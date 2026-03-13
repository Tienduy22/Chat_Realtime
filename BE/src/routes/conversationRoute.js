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

router.get("/list_conversation", authenticate, conversationController.listConversation)

router.get("/data", conversationController.dataOfConversation)

router.get("/block-status", authenticate, conversationController.getConversationWithBlockStatus)

router.get("/admin", conversationController.AdminInfo)

router.get("/message", conversationController.searchMessage)

router.get("/storage", conversationController.conversationStorage)

router.get("/member", conversationController.memberOfConversation)

router.get("/:conversation_id", authenticate, conversationController.AllMessageOfConversation)

router.get("/detail/:conversation_id", authenticate, conversationController.findById)

router.post(
    "/new_conversation",
    conversationController.createNewConversation
);

router.post(
    "/new_group",
    upload.array("image", 10),
    uploadCloudinary,
    validate(groupConversationSchema),
    conversationController.createNewGroupConversation
);

router.post(
    "/member",
    validate(memberSchema),
    conversationController.addMember
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

router.patch(
    "/update_conversation",
    conversationController.updateConversation
);

router.delete(
    "/member",
    validate(memberSchema),
    conversationController.deleteMember
);

router.delete(
    "/member",
    validate(memberSchema),
    conversationController.deleteMember
);

router.delete(
    "/history",
    conversationController.deleteHistoryOfConversation
);

router.delete(
    "/group",
    conversationController.deleteGroup
);

module.exports = router;
