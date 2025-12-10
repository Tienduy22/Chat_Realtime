const conversationReponsitory = require("../repositories/conversation.reponsitory");

const createNewGroupConversation = async (data, images) => {
    try {
        const { admin_id, member_ids, name } = data;
        const avatar_url = images[0];

        const groupConversation =
            await conversationReponsitory.createNewGroupConversation(
                admin_id,
                member_ids,
                name,
                avatar_url
            );

        return groupConversation;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createNewGroupConversation,
};
