const { Op } = require("sequelize");
const {
    User,
    Message,
    MessageAttachment,
    MessageReaction,
    MessageMention,
    MessageReadReceipt,
    ConversationParticipant,
} = require("../models");

const createMessage = async (messageData) => {
    try {
        const message = await Message.create(messageData);
        return message;
    } catch (error) {
        throw error;
    }
};

const createMessageAttachment = async (messageAttachmentData) => {
    try {
        const messageAttachment = await MessageAttachment.create(
            messageAttachmentData
        );
        return messageAttachment;
    } catch (error) {
        throw error;
    }
};

const fullMessage = async (message_id) => {
    try {
        const fullMessage = await Message.findOne({
            where: {
                message_id: message_id,
            },
            include: [
                {
                    model: MessageAttachment,
                    as: "attachments",
                    attributes: ["attachment_id", "file_url"],
                },
            ],
        });

        return fullMessage;
    } catch (error) {
        throw error;
    }
};

const incrementUnreadCount = async (conversation_id, user_id) => {
    try {
        return await ConversationParticipant.increment("unread_count", {
            by: 1,
            where: {
                conversation_id: conversation_id,
                user_id: { [Op.ne]: user_id },
            },
        });
    } catch (error) {
        throw error;
    }
};

const updateUnreadCount = async (participant_id, last_read_message_id) => {
    try {
        return await ConversationParticipant.update(
            {
                unread_count: 0,
                last_read_message_id: last_read_message_id,
            },
            {
                where: {
                    participant_id: participant_id,
                },
            }
        );
    } catch (error) {
        throw error;
    }
};

const findById = async (message_id) => {
    try {
        const message = await Message.findByPk(message_id);
        return message;
    } catch (error) {
        throw error;
    }
};

const findByIdAttachment = async (message_id) => {
    try {
        const attachment = await MessageAttachment.findOne({
            where: {
                message_id: message_id,
            },
        });
        return attachment;
    } catch (error) {
        throw error;
    }
};

const deleteMessage = async (message_id) => {
    try {
        return await Message.update(
            {
                is_deleted: true,
                deleted_at: new Date(),
            },
            {
                where: {
                    message_id: message_id,
                },
            }
        );
    } catch (error) {
        throw error;
    }
};

const deleteMessageAttachment = async (attachment_id) => {
    try {
        return await MessageAttachment.destroy({
            where: {
                attachment_id: attachment_id,
            },
        });
    } catch (error) {
        throw error;
    }
};

const editMessage = async (content, message_id) => {
    try {
        return await Message.update(
            {
                content: content,
                is_edited: true,
                updated_at: new Date(),
            },
            {
                where: {
                    message_id: message_id,
                },
            }
        );
    } catch (error) {
        throw error;
    }
};

const reactionMessage = async (emoji, message_id, user_id) => {
    try {
        const reaction = await MessageReaction.create({
            message_id: message_id,
            user_id: user_id,
            emoji: emoji,
        });

        return reaction;
    } catch (error) {
        throw error;
    }
};

const AllMessageOfConversation = async (conversation_id, limit, offset) => {
    try {
        const messages = await Message.findAll({
            where: {
                conversation_id: conversation_id,
            },
            attributes: [
                "message_id",
                "content",
                "sender_id",
                "message_type",
                "parent_message_id",
                "created_at",
                "updated_at",
            ],
            include: [
                {
                    model: User,
                    as: "sender",
                    attributes: [
                        "user_id",
                        "username",
                        "full_name",
                        "avatar_url",
                    ],
                    required: true, 
                },
                {
                    model: MessageAttachment,
                    as: "attachments",
                    attributes: [
                        "attachment_id",
                        "file_name",
                        "file_url",
                        "created_at",
                    ],
                    required: false,
                    separate: true, 
                },
                {
                    model: MessageReaction,
                    as: "reactions",
                    attributes: ["reaction_id", "user_id", "emoji"],
                    required: false,
                    separate: true,
                },
            ],
            limit,
            offset,
            order: [["created_at", "DESC"]],
            subQuery: false, 
            raw: false,
        });

        return messages;
    } catch (error) {
        throw error;
    }
};

const markAsRead = async (message_id, user_id) => {
    try {
        return await MessageReadReceipt.create({
            message_id: message_id,
            user_id: user_id,
        });
    } catch (error) {
        throw error;
    }
};

const mention = async (message_id, user_id) => {
    try {
        return await MessageMention.create({
            message_id: message_id,
            user_id: user_id
        })
    } catch (error) {
        throw error
    }
}

module.exports = {
    createMessage,
    createMessageAttachment,
    fullMessage,
    incrementUnreadCount,
    updateUnreadCount,
    findById,
    deleteMessage,
    deleteMessageAttachment,
    findByIdAttachment,
    editMessage,
    reactionMessage,
    AllMessageOfConversation,
    markAsRead,
    mention
};
