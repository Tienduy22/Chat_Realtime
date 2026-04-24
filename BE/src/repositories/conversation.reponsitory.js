const {
    User,
    Conversation,
    ConversationParticipant,
    sequelize,
    Message,
    MessageAttachment,
    Contact,
} = require("../models");
const { Op, Sequelize } = require("sequelize");

const createNewConversation = async (userId, friendId) => {
    const transaction = await sequelize.transaction();
    try {
        const conversation = await Conversation.create(
            {
                conversation_type: "private",
                created_by: userId,
            },
            { transaction },
        );

        const participants = await ConversationParticipant.bulkCreate(
            [
                {
                    conversation_id: conversation.conversation_id,
                    user_id: userId,
                    role: "member",
                    joined_at: new Date(),
                },
                {
                    conversation_id: conversation.conversation_id,
                    user_id: friendId,
                    role: "member",
                    joined_at: new Date(),
                },
            ],
            { transaction },
        );

        await transaction.commit();

        return {
            conversation,
            participants,
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const createNewGroupConversation = async (
    admin_id,
    member_ids,
    name,
    avatar_url,
) => {
    const transaction = await sequelize.transaction();
    try {
        const conversation = await Conversation.create(
            {
                conversation_type: "group",
                name: name,
                avatar_url: avatar_url,
                created_by: admin_id,
            },
            { transaction },
        );
        const participantAdmin = await ConversationParticipant.create(
            {
                conversation_id: conversation.conversation_id,
                user_id: admin_id,
                role: "admin",
                joined_at: new Date(),
            },
            {
                transaction,
            },
        );
        const participantMembers = [];

        for (const member_id of member_ids) {
            const participantMember = await ConversationParticipant.create(
                {
                    conversation_id: conversation.conversation_id,
                    user_id: member_id,
                    role: "member",
                    joined_at: new Date(),
                },

                { transaction },
            );

            participantMembers.push(participantMember);
        }

        await transaction.commit();

        return {
            conversation,
            participantAdmin,
            participantMembers,
        };
    } catch (error) {
        throw error;
    }
};

const addMember = async (conversation_id, member_id) => {
    try {
        const member = await ConversationParticipant.create({
            conversation_id: conversation_id,
            user_id: member_id,
            role: "member",
        });

        return member;
    } catch (error) {
        throw error;
    }
};

const findById = async (conversation_id) => {
    try {
        const conversation = await Conversation.findByPk(conversation_id);

        return conversation;
    } catch (error) {
        throw error;
    }
};

const findMemberOfGroup = async (conversation_id, member_id) => {
    try {
        const memberOfGroup = await ConversationParticipant.findOne({
            where: {
                conversation_id: conversation_id,
                user_id: member_id,
            },
        });

        return memberOfGroup;
    } catch (error) {
        throw error;
    }
};

const findAllMemberOfGroup = async (conversation_id) => {
    try {
        const memberOfGroup = await ConversationParticipant.findAll({
            where: {
                conversation_id: conversation_id,
                is_active: true, // 👈 Chỉ lấy active members
            },
        });

        return memberOfGroup;
    } catch (error) {
        throw error;
    }
};

const deleteMember = async (conversation_id, member_id) => {
    try {
        return await ConversationParticipant.destroy({
            where: {
                conversation_id: conversation_id,
                user_id: member_id,
            },
        });
    } catch (error) {
        throw error;
    }
};

const updateRoleParticipant = async (role, participant_id) => {
    const [affectedRows] = await ConversationParticipant.update(
        { role: role },
        {
            where: {
                participant_id: participant_id,
            },
        },
    );

    if (affectedRows === 0) {
        throw new Error("Participant không tồn tại hoặc không có thay đổi");
    }

    return { success: true };
};

const changeName = async (conversation_id, name) => {
    try {
        return await Conversation.update(
            {
                name: name,
            },
            {
                where: {
                    conversation_id: conversation_id,
                },
            },
        );
    } catch (error) {
        throw error;
    }
};

const changeAvatar = async (conversation_id, avatar_url) => {
    try {
        return await Conversation.update(
            {
                avatar_url: avatar_url,
            },
            {
                where: {
                    conversation_id: conversation_id,
                },
            },
        );
    } catch (error) {
        throw error;
    }
};

const changeNotification = async (conversation_id, member_id, is_muted) => {
    try {
        return await ConversationParticipant.update(
            {
                is_muted: is_muted,
            },
            {
                where: {
                    conversation_id: conversation_id,
                    user_id: member_id,
                },
            },
        );
    } catch (error) {
        throw error;
    }
};

const listConversation = async (user_id) => {
    try {
        const listConversation = await ConversationParticipant.findAll({
            where: {
                user_id: user_id,
            },
            attributes: [
                "participant_id",
                "last_read_message_id",
                "unread_count",
            ],
            include: [
                {
                    model: Conversation,
                    as: "conversation",
                    attributes: [
                        "conversation_id",
                        "conversation_type",
                        "name",
                        "avatar_url",
                    ],
                    include: [
                        {
                            model: ConversationParticipant,
                            as: "participants",
                            where: {
                                is_active: true,
                                user_id: { [Op.ne]: user_id },
                            },
                            required: false,
                            attributes: ["participant_id"],
                            include: [
                                {
                                    model: User,
                                    as: "user",
                                    attributes: [
                                        "user_id",
                                        "full_name",
                                        "avatar_url",
                                        "last_seen",
                                    ],
                                },
                            ],
                        },
                        {
                            model: Message,
                            as: "messages",
                            limit: 1,
                            order: [["created_at", "DESC"]],
                            attributes: [
                                "message_id",
                                "content",
                                "message_type",
                                "created_at",
                                "sender_id",
                            ],
                            include: [
                                {
                                    model: User,
                                    as: "sender",
                                    attributes: [
                                        "user_id",
                                        "full_name",
                                        "avatar_url",
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            order: [["updated_at", "DESC"]],
        });

        return listConversation;
    } catch (error) {
        throw error;
    }
};

const updateConversation = async (conversation_id, user_id, data) => {
    try {
        return await ConversationParticipant.update(data, {
            where: {
                conversation_id: conversation_id,
                user_id: user_id,
            },
        });
    } catch (error) {
        throw error;
    }
};

const dataOfConversation = async (conversation_id) => {
    try {
        const data = await Conversation.findByPk(conversation_id, {
            attributes: [
                "conversation_id",
                "conversation_type",
                "name",
                "avatar_url",
                "created_by",
            ],
            include: [
                {
                    model: Message,
                    as: "messages",
                    attributes: ["message_id", "message_type"],
                    include: [
                        {
                            model: MessageAttachment,
                            as: "attachments",
                            attributes: ["attachment_id", "file_url"],
                            where: {
                                file_name: {
                                    [Op.in]: ["image", "video"],
                                },
                            },
                        },
                    ],
                    limit: 6,
                    order: [["created_at", "DESC"]],
                },
                {
                    model: ConversationParticipant,
                    as: "participants",
                    where: {
                        is_active: true,
                    },
                    attributes: ["participant_id"],
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["user_id", "full_name", "avatar_url"],
                        },
                    ],
                },
            ],
        });

        return data;
    } catch (error) {
        throw error;
    }
};

const conversationStorage = async (conversation_id) => {
    try {
        const data = await Conversation.findByPk(conversation_id, {
            attributes: ["conversation_id"],
            include: [
                {
                    model: Message,
                    as: "messages",
                    attributes: ["message_id"],
                    include: [
                        {
                            model: MessageAttachment,
                            as: "attachments",
                            attributes: [
                                "attachment_id",
                                "file_url",
                                "created_at",
                                "file_name",
                            ],
                            where: {
                                file_name: {
                                    [Op.in]: ["image", "video", "document"],
                                },
                            },
                        },
                    ],
                    order: [["created_at", "DESC"]],
                },
            ],
        });

        return data;
    } catch (error) {
        throw error;
    }
};

const memberOfConversation = async (conversation_id) => {
    try {
        const data = await ConversationParticipant.findAll({
            attributes: [
                "conversation_id",
                "participant_id",
                "user_id",
                "role",
            ],
            where: {
                conversation_id: conversation_id,
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["user_id", "full_name", "avatar_url"],
                },
            ],
        });

        return data;
    } catch (error) {
        throw error;
    }
};

const AdminInfo = async (conversation_id) => {
    try {
        const data = await ConversationParticipant.findOne({
            attributes: ["participant_id", "user_id", "role"],
            where: {
                conversation_id: conversation_id,
                role: "admin",
            },
        });

        return data;
    } catch (error) {
        throw error;
    }
};

const deleteHistoryOfConversation = async (conversation_id) => {
    try {
        return await Message.destroy({
            where: {
                conversation_id: conversation_id,
            },
        });
    } catch (error) {
        throw error;
    }
};

const searchMessage = async (conversation_id, keyword) => {
    try {
        const messages = await Message.findAll({
            where: {
                conversation_id: conversation_id,
                content: {
                    [Op.like]: `%${keyword}%`,
                },
            },
            order: [["created_at", "DESC"]],
            limit: 20,
        });

        return messages;
    } catch (error) {
        throw error;
    }
};

const deleteGroup = async (conversation_id, keyword) => {
    try {
        await Message.destroy({
            where: {
                conversation_id: conversation_id,
            },
        });

        await ConversationParticipant.destroy({
            where: {
                conversation_id: conversation_id,
            },
        });

        await Conversation.destroy({
            where: {
                conversation_id: conversation_id,
            },
        });

        return { success: true };
    } catch (error) {
        throw error;
    }
};

// ✅ Get conversation with block status (for private conversations)
const getConversationWithBlockStatus = async (conversation_id, user_id) => {
    try {
        const conversation = await Conversation.findByPk(conversation_id, {
            attributes: [
                "conversation_id",
                "conversation_type",
                "name",
                "avatar_url",
                "created_by",
            ],
            include: [
                {
                    model: ConversationParticipant,
                    as: "participants",
                    attributes: ["participant_id", "user_id"],
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["user_id", "full_name", "avatar_url"],
                        },
                    ],
                },
                {
                    model: Message,
                    as: "messages",
                    attributes: ["message_id", "message_type"],
                    include: [
                        {
                            model: MessageAttachment,
                            as: "attachments",
                            attributes: ["attachment_id", "file_url"],
                            where: {
                                file_name: {
                                    [Op.in]: ["image", "video"],
                                },
                            },
                        },
                    ],
                    limit: 6,
                    order: [["created_at", "DESC"]],
                },
            ],
        });

        if (!conversation) return null;

        // Check block status only for private conversations
        let isBlocking = false;
        let isBlocked = false;

        if (conversation.conversation_type === "private") {
            const BlockedUser = require("../models").BlockedUser;

            // Get the other participant
            const otherParticipant = conversation.participants.find(
                (p) => p.user_id !== user_id,
            );

            if (otherParticipant) {
                const friendId = otherParticipant.user_id;

                // Check if current user is blocking the friend
                const block1 = await BlockedUser.findOne({
                    where: {
                        blocker_user_id: user_id,
                        blocked_user_id: friendId,
                    },
                });
                isBlocking = !!block1;

                // Check if current user is blocked by the friend
                const block2 = await BlockedUser.findOne({
                    where: {
                        blocker_user_id: friendId,
                        blocked_user_id: user_id,
                    },
                });
                isBlocked = !!block2;
            }
        }

        return {
            ...conversation.toJSON(),
            isBlocking,
            isBlocked,
        };
    } catch (error) {
        throw error;
    }
};

const findPrivateConversation = async (user_id1, user_id2) => {
    // Lấy tất cả conversation_id mà user_id1 tham gia
    const user1Participants = await ConversationParticipant.findAll({
        where: { user_id: user_id1, is_active: true },
        attributes: ["conversation_id"],
        raw: true,
    });

    const conversationIds = user1Participants.map((p) => p.conversation_id);

    // Tìm conversation mà user_id2 cũng có mặt, trong danh sách trên
    const participant = await ConversationParticipant.findOne({
        where: {
            user_id: user_id2,
            is_active: true,
            conversation_id: { [Op.in]: conversationIds },
        },
        include: [
            {
                model: Conversation,
                as: "conversation",
                where: { conversation_type: "private" },
                required: true,
            },
        ],
    });

    return participant?.conversation ?? null;
};
module.exports = {
    createNewConversation,
    createNewGroupConversation,
    addMember,
    findById,
    findAllMemberOfGroup,
    findMemberOfGroup,
    deleteMember,
    updateRoleParticipant,
    changeName,
    changeAvatar,
    changeNotification,
    listConversation,
    updateConversation,
    dataOfConversation,
    conversationStorage,
    memberOfConversation,
    AdminInfo,
    deleteHistoryOfConversation,
    searchMessage,
    deleteGroup,
    getConversationWithBlockStatus,
    findPrivateConversation,
};
