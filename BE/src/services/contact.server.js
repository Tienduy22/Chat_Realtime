const contactReponsitory = require("../repositories/contact.reponsitory");
const notificationReponsitory = require("../repositories/notification.reponsitory");
const userRepossitory = require("../repositories/user.reponsitory");
const blockedUserReponsitory = require("../repositories/blockedUser.reponsitory");

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

        const existingContact = await contactReponsitory.findOne({
            user_id,
            contact_user_id,
        });

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

        // 4. Tạo contact (lời mời kết bạn)
        const contact = await contactReponsitory.sendInvitations(
            user_id,
            contact_user_id
        );

        // 5. Lấy thông tin user gửi lời mời
        const user = await userRepossitory.findById(user_id);

        // 6. Tạo notification
        const content = `${user.username} đã gửi lời mời kết bạn`;
        const notification =
            await notificationReponsitory.notificationSendInvite(
                contact_user_id,
                content,
                user_id
            );

        // 7. GỬI REALTIME NOTIFICATION QUA SOCKET.IO
        const io = global.io;
        if (io) {
            // Emit tới user nhận lời mời
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
                reference_id: user_id,
                created_at: notification.created_at,
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

        const contactSend =
            await contactReponsitory.findByUserIdAndContactUserId(
                contactUser.user_id,
                user_id
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

        return contactRespond;
    } catch (error) {
        throw error;
    }
};

const rejectInvitations = async ({ user_id, contact_user_id }) => {
    try {
        const contact = await contactReponsitory.findByUserIdAndContactUserId(
            contact_user_id,
            user_id
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

        const contact2 = await contactReponsitory.findByUserIdAndContactUserId(
            friend_id,
            user_id
        );
        if (!contact2) {
            throw {
                statusCode: 404,
                message: "Không thể block vì chưa là bạn bè",
            };
        }

        await contactReponsitory.updateStatus(contact1.contact_id, "blocked");
        await contactReponsitory.updateStatus(contact2.contact_id, "blocked");
        const blocked = await blockedUserReponsitory.blockFriend(
            user_id,
            friend_id
        );

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
        const contact2 = await contactReponsitory.findByUserIdAndContactUserId(
            friend_id,
            user_id
        );

        await contactReponsitory.updateStatus(contact1.contact_id, "accepted");
        await contactReponsitory.updateStatus(contact2.contact_id, "accepted");

        const block = await blockedUserReponsitory.findBlock(
            user_id,
            friend_id
        );
        await blockedUserReponsitory.unBlockFriend(block.block_id);

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

module.exports = {
    sendInvitations,
    acceptInvitations,
    rejectInvitations,
    listFriends,
    blockFriend,
    unBlockFriend,
    listBlocked,
};
