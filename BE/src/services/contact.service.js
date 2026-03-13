const contactReponsitory = require("../repositories/contact.reponsitory");
const notificationReponsitory = require("../repositories/notification.reponsitory");
const userRepossitory = require("../repositories/user.reponsitory");
const blockedUserReponsitory = require("../repositories/blockedUser.reponsitory");
const conversationReponsitory = require("../repositories/conversation.reponsitory")

const sendInvitations = async ({ user_id, contact_user_id }) => {
    try {
        if (user_id === contact_user_id) {
            throw {
                statusCode: 400,
                message: "Không thể gửi lời mời cho chính mình",
            };
        }

        const contactUser = await userRepossitory.findById(contact_user_id);
        if (!contactUser || !contactUser.is_active) {
            throw { statusCode: 404, message: "User không tồn tại" };
        }

        const existingContact = await contactReponsitory.findByUserIdAndContactUserId(
            user_id,
            contact_user_id,
        );

        if (existingContact) {
            if (existingContact.status === "pending") {
                throw { statusCode: 409, message: "Đã gửi lời mời trước đó" };
            }
            if (existingContact.status === "accepted") {
                throw { statusCode: 409, message: "Đã là bạn bè rồi" };
            }
            if (existingContact.status === "blocked") {
                throw { statusCode: 403, message: "Không thể gửi lời mời" };
            }
        }

        const contact = await contactReponsitory.sendInvitations(
            user_id,
            contact_user_id
        );

        const user = await userRepossitory.findById(user_id);

        const content = `${user.username} đã gửi lời mời kết bạn`;
        const notification =
            await notificationReponsitory.notificationSendInvite(
                contact_user_id,
                content,
                user_id
            );

        const io = global.io;
        if (io) {
            io.to(`user:${contact_user_id}`).emit("friend_request_received", {
                notification_id: notification.notification_id,
                type: "friend_request",
                title: "Lời mời kết bạn",
                content: content,
                from_user: {
                    user_id: user.user_id,
                    username: user.username,
                    full_name: user.full_name,
                    avatar_url: user.avatar_url,
                },
                contact_id: contact.contact_id,
                reference_id: user_id,
                created_at: new Date(),
            });
        }

        return {
            contact: {
                contact_id: contact.contact_id,
                user_id: contact.user_id,
                contact_user_id: contact.contact_user_id,
                status: contact.status,
                created_at: contact.created_at,
            },
            notification: {
                notification_id: notification.notification_id,
                message: "Đã gửi lời mời kết bạn",
            },
        };
    } catch (error) {
        throw error;
    }
};

const acceptInvitations = async ({ user_id, contact_user_id }) => {
    try {
        const contactUser = await userRepossitory.findById(contact_user_id);
        const user = await userRepossitory.findById(user_id);
        if (!contactUser) {
            throw {
                statusCode: 404,
                message: "Không tìm thấy tài khoản người gửi",
            };
        }
        console.log("contactUser:", contact_user_id);
        console.log("user_id:", user_id);
        const contactSend =
            await contactReponsitory.findByUserIdAndContactUserId(
                contact_user_id,
                user_id,
            );
        if (!contactSend) {
            throw {
                statusCode: 404,
                message: "Lời mời không tồn tại",
            };
        }

        await contactReponsitory.updateStatus(
            contactSend.contact_id,
            "accepted"
        );

        const contactRespond = await contactReponsitory.acceptInvitations(
            user_id,
            contactUser.user_id
        );

        const content = `${user.username} đã chấp nhận lời mời kết bạn`;
        const notification =
            await notificationReponsitory.notificationAcceptInvite(
                contactUser.user_id,
                content,
                user.user_id
            );

        const io = global.io;
        if (io) {
            io.to(`user:${contactUser.user_id}`).emit(
                "friend_request_accepted",
                {
                    notification_id: notification.notification_id,
                    type: "friend_request",
                    title: "Lời mời được chấp nhận",
                    content: content,
                    from_user: {
                        user_id: user.user_id,
                        username: user.username,
                        full_name: user.full_name,
                        avatar_url: user.avatar_url,
                    },
                    reference_id: user_id,
                    created_at: notification.created_at,
                }
            );
        }

        await conversationReponsitory.createNewConversation(user_id, contact_user_id)

        return contactRespond;
    } catch (error) {
        throw error;
    }
};

const rejectInvitations = async ({ contact_id }) => {
    try {
        const contact = await contactReponsitory.findById(
            contact_id
        );
        if (!contact) {
            throw { statusCode: 404, message: "Lời mời không tồn tại" };
        }
        await contactReponsitory.rejectInvitations(contact.contact_id);

        return {
            message: "Từ chối lời mời kết bạn",
        };
    } catch (error) {
        throw error;
    }
};

const listFriends = async ({ user_id }) => {
    try {
        const listFriends = await contactReponsitory.ListFriends(user_id);

        return listFriends;
    } catch (error) {
        throw error;
    }
};

const listGroup = async ({ user_id }) => {
    try {
        const listGroup = await contactReponsitory.listGroup(user_id);

        return listGroup;
    } catch (error) {
        throw error;
    }
};

const blockFriend = async ({ user_id, friend_id }) => {
    try {
        const contact1 = await contactReponsitory.findByUserIdAndContactUserId(
            user_id,
            friend_id
        );
        if (!contact1) {
            throw {
                statusCode: 404,
                message: "Không thể block vì chưa là bạn bè",
            };
        }

        await contactReponsitory.updateStatus(contact1.contact_id, "blocked");
        const blocked = await blockedUserReponsitory.blockFriend(
            user_id,
            friend_id
        );

        // ✅ Emit socket event for real-time update
        const io = global.io;
        if (io) {
            io.to(`user:${friend_id}`).emit("user_blocked", {
                blocker_id: user_id,
                blocked_id: friend_id,
            });
            io.to(`user:${user_id}`).emit("user_blocked", {
                blocker_id: user_id,
                blocked_id: friend_id,
            });
        }

        return blocked;
    } catch (error) {
        throw error;
    }
};

const unBlockFriend = async ({ user_id, friend_id }) => {
    try {
        const contact1 = await contactReponsitory.findByUserIdAndContactUserId(
            user_id,
            friend_id
        );

        await contactReponsitory.updateStatus(contact1.contact_id, "accepted");;

        const block = await blockedUserReponsitory.findBlock(
            user_id,
            friend_id
        );
        await blockedUserReponsitory.unBlockFriend(block.block_id);

        // ✅ Emit socket event for real-time update
        const io = global.io;
        if (io) {
            io.to(`user:${friend_id}`).emit("user_unblocked", {
                blocker_id: user_id,
                blocked_id: friend_id,
            });
            io.to(`user:${user_id}`).emit("user_unblocked", {
                blocker_id: user_id,
                blocked_id: friend_id,
            });
        }

        return {
            message: "Gỡ block thành công",
        };
    } catch (error) {
        throw error;
    }
};

const listBlocked = async ({ user_id }) => {
    try {
        const listBlocked = await blockedUserReponsitory.listBlocked(user_id);
        return listBlocked
    } catch (error) {
        throw error;
    }
};

const findContactByPhone = async ({phone}) => { 
    try {
        const contact = await contactReponsitory.findByPhone(phone);
        return contact;
    } catch (error) {
        throw error;
    }
};

const findSendInvitations = async ({user_id}) => { 
    try {
        const result = await contactReponsitory.findSendInvitations(user_id);
        return result;
    } catch (error) {
        throw error;
    }
};

const findInvitations = async ({user_id}) => { 
    try {
        const result = await contactReponsitory.findInvitations(user_id);
        return result;
    } catch (error) {
        throw error;
    }
};

const removeInvitations = async ({contact_id}) => { 
    try {
        return await contactReponsitory.removeInvitations(contact_id);
    } catch (error) {
        throw error;
    }
};


module.exports = {
    sendInvitations,
    acceptInvitations,
    rejectInvitations,
    listFriends,
    blockFriend,
    unBlockFriend,
    listBlocked,
    listGroup,
    findContactByPhone,
    findSendInvitations,
    findInvitations,
    removeInvitations
};
