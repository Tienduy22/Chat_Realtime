const {
    User,
    Conversation,
    ConversationParticipant,
    sequelize,
} = require("../models");

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

module.exports = {
    createNewConversation,
    createNewGroupConversation,
};
