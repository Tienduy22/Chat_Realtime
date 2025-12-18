const { where } = require("sequelize");
const {
    User,
    Conversation,
    ConversationParticipant,
    sequelize,
    Message,
} = require("../models");
const { Op } = require("sequelize");

const createNewConversation = async (userId, friendId) => {
    const transaction = await sequelize.transaction();
    try {
        const conversation = await Conversation.create(
            {
                conversation_type: "private",
            },
            { transaction }
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
            { transaction }
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
    avatar_url
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
            { transaction }
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
            }
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

                { transaction }
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
        }
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
            }
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
            }
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
            }
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
};
