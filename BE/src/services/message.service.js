const messageReponsitory = require("../repositories/message.reponsitory");
const conversationReponsitory = require("../repositories/conversation.reponsitory");
const userReponsitory = require("../repositories/user.reponsitory");

const createMessage = async (req) => {
    try {
        const { conversation_id, sender_id } = req.body;
        const conversation = await conversationReponsitory.findById(
            conversation_id
        );
        if (!conversation) {
            throw {
                statusCode: 404,
                message: "Cuộc trò chuyện không tồn tại",
            };
        }

        const sender = await userReponsitory.findById(sender_id);
        if (!sender) {
            throw {
                statusCode: 404,
                message: "Người gửi không tồn tại",
            };
        }

        let content = "";
        if (req.body.content) {
            content = req.body.content;
        }

        let parent_message_id = null;
        if (req.body.parent_message_id) {
            parent_message_id = req.body.parent_message_id;
        }

        const hasText = content && content.trim().length > 0;
        const hasImages = req.uploadedImageUrls?.length > 0;
        const hasVideos = req.uploadedVideoUrls?.length > 0;
        const hasDocuments = req.uploadedDocumentUrls?.length > 0;

        const hasMedia = hasImages || hasVideos || hasDocuments;

        let message_type = "text";
        if (!hasText && hasMedia) {
            if (hasImages && !hasVideos && !hasDocuments)
                message_type = "image";
            else if (hasVideos && !hasImages && !hasDocuments)
                message_type = "video";
            else if (hasDocuments && !hasImages && !hasVideos)
                message_type = "file";
            else message_type = "text";
        }

        let messages = [];

        if (hasText) {
            const message = await messageReponsitory.createMessage({
                conversation_id: conversation_id,
                sender_id: sender_id,
                message_type: message_type,
                content: content,
                parent_message_id: parent_message_id,
            });

            if (req.body.mention_ids) {
                req.body.mention_ids.forEach(async (mention_id) => {
                    await messageReponsitory.mention(
                        message.message_id,
                        mention_id
                    );
                });
            }

            messages.push(message);
        }

        if (hasImages) {
            for (const url of req.uploadedImageUrls) {
                const messageAttachment =
                    await messageReponsitory.createMessage({
                        conversation_id: conversation_id,
                        sender_id: sender_id,
                        message_type: "image",
                        content: "",
                        parent_message_id: parent_message_id,
                    });
                messages.push(messageAttachment);
                const attachment =
                    await messageReponsitory.createMessageAttachment({
                        message_id: messageAttachment.message_id,
                        file_name: "image",
                        file_url: url,
                    });
            }
        }
        if (hasDocuments) {
            for (const url of req.uploadedDocumentUrls) {
                const messageAttachment =
                    await messageReponsitory.createMessage({
                        conversation_id: conversation_id,
                        sender_id: sender_id,
                        message_type: "image",
                        content: "",
                        parent_message_id: parent_message_id,
                    });
                messages.push(messageAttachment);
                const attachment =
                    await messageReponsitory.createMessageAttachment({
                        message_id: messageAttachment.message_id,
                        file_name: "document",
                        file_url: url,
                    });
            }
        }
        if (hasVideos) {
            for (const url of req.uploadedVideoUrls) {
                const messageAttachment =
                    await messageReponsitory.createMessage({
                        conversation_id: conversation_id,
                        sender_id: sender_id,
                        message_type: "video",
                        content: "",
                        parent_message_id: parent_message_id,
                    });
                messages.push(messageAttachment);
                const attachment =
                    await messageReponsitory.createMessageAttachment({
                        message_id: messageAttachment.message_id,
                        file_name: "image",
                        file_url: url,
                    });
            }
        }

        let result = [];

        for (const message of messages) {
            const fullMessage = await messageReponsitory.fullMessage(
                message.message_id
            );
            result.push(fullMessage);
        }

        await messageReponsitory.incrementUnreadCount(
            conversation_id,
            sender_id
        );

        // Socket
        const io = global.io;
        if (io) {
            const participants =
                await conversationReponsitory.findAllMemberOfGroup(
                    conversation_id
                );

            const payload = {
                conversation_id: conversation_id,
                messages: result, 
                sender: {
                    user_id: sender.user_id,
                    full_name: sender.full_name,
                    avatar_url: sender.avatar_url,
                },
            };

            participants.forEach((member) => {
                io.to(`user:${member.user_id}`).emit("new_message", payload);
                console.log(
                    `✅ Sent ${result.length} messages to user:${member.user_id}`
                );
            });

            io.to(`conversation:${conversation_id}`).emit(
                "new_message",
                payload
            );
        }

        return result;
    } catch (error) {
        throw error;
    }
};

const markAsRead = async ({ conversation_id, message_id, user_id }) => {
    const conversation = await conversationReponsitory.findById(
        conversation_id
    );
    if (!conversation) {
        throw {
            statusCode: 404,
            message: "Cuộc trò chuyện không tồn tại",
        };
    }

    const user = await userReponsitory.findById(user_id);
    if (!user) {
        throw {
            statusCode: 404,
            message: "User không tồn tại",
        };
    }

    const message = await messageReponsitory.findById(message_id);
    if (!message) {
        throw {
            statusCode: 404,
            message: "Message không tồn tại",
        };
    }

    const participant = await conversationReponsitory.findMemberOfGroup(
        conversation_id,
        user_id
    );
    if (!participant) {
        throw {
            statusCode: 404,
            message: "Tài khoản này chưa tham gia cuộc trò chuyện",
        };
    }

    await messageReponsitory.updateUnreadCount(
        participant.participant_id,
        message_id
    );

    await messageReponsitory.markAsRead(message_id, user_id);

    const io = global.io;
    if (io) {
        io.to(`conversation: ${conversation_id}`).emit("seem_message", {
            conversation_id: conversation_id,
            user_id: user_id,
            last_message_id: message_id,
        });
    }

    return {
        message: "Đã đánh dấu đã đọc",
    };
};

const deleteMessage = async (data) => {
    try {
        const { user_id, message_id, conversation_id } = data;
        const message = await messageReponsitory.findById(message_id);
        if (!message) {
            throw {
                statusCode: 404,
                message: "Tin nhắn không tồn tại",
            };
        }
        if (message.sender_id != user_id) {
            throw {
                statusCode: 409,
                message: "Bạn không có quyền xóa",
            };
        }
        await messageReponsitory.deleteMessage(message_id);
        const attachment = await messageReponsitory.findByIdAttachment(
            message_id
        );
        if (!attachment) {
            throw {
                statusCode: 404,
                message: "File không tồn tại",
            };
        }
        await messageReponsitory.deleteMessageAttachment(
            attachment.attachment_id
        );
        await messageReponsitory.deleteMessage(message_id);

        const io = global.io;
        if (io) {
            io.to(`conversation: ${conversation_id}`).emit("delete_message", {
                conversation_id: conversation_id,
                user_id: user_id,
                delete_message: message_id,
            });
        }

        return {
            message: "Xóa tin nhắn thành công",
        };
    } catch (error) {
        throw error;
    }
};

const editMessage = async ({
    conversation_id,
    message_id,
    content,
    user_id,
}) => {
    try {
        const message = await messageReponsitory.findById(message_id);
        if (!message) {
            throw {
                statusCode: 404,
                message: "Tin nhắn không tồn tại",
            };
        }
        if (message.sender_id != user_id) {
            throw {
                statusCode: 409,
                message: "Bạn không có quyền sửa",
            };
        }
        if (message.message_type != "text") {
            throw {
                statusCode: 409,
                message: "Chỉ có thể sửa tin nhắn dạng text",
            };
        }

        await messageReponsitory.editMessage(content, message_id);

        const io = global.io;
        if (io) {
            io.to(`conversation: ${conversation_id}`).emit("edit_message", {
                conversation_id: conversation_id,
                user_id: user_id,
                message_edit: message_id,
                content: content,
            });
        }

        return {
            message: "Sửa tin nhắn thành công",
        };
    } catch (error) {
        throw error;
    }
};

const reactionMessage = async ({
    conversation_id,
    emoji,
    message_id,
    user_id,
}) => {
    try {
        const message = await messageReponsitory.findById(message_id);
        if (!message) {
            throw {
                statusCode: 404,
                message: "Tin nhắn không tồn tại",
            };
        }

        const reaction = await messageReponsitory.reactionMessage(
            emoji,
            message_id,
            user_id
        );

        const io = global.io;
        if (io) {
            io.to(`conversation: ${conversation_id}`).emit("reaction_message", {
                conversation_id: conversation_id,
                user_id: user_id,
                message_reaction: message_id,
                reaction_id: reaction.reaction_id,
                emoji: emoji,
            });
        }

        return reaction;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createMessage,
    markAsRead,
    deleteMessage,
    editMessage,
    reactionMessage,
};
