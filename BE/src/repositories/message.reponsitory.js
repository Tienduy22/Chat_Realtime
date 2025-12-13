const { Message, MessageAttachment } = require("../models");

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
        const messageAttachment = await MessageAttachment.bulkCreate(messageAttachmentData)
        return messageAttachment
    } catch (error) {
        throw error
    }
}

const fullMessage = async (message_id) => {
    try {
        const fullMessage = await Message.findOne({
            where: {
                message_id: message_id
            },
            include: [{
                model: MessageAttachment,
                as: "attachments",
                attributes: ["attachment_id", "file_url"]
            }]
        })

        return fullMessage
    } catch (error) {
        throw error
    }
}

module.exports = {
    createMessage,
    createMessageAttachment,
    fullMessage
};
