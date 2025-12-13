const messageReponsitory = require("../repositories/message.reponsitory");
const conversationReponsitory = require("../repositories/conversation.reponsitory");
const userReponsitory = require("../repositories/user.reponsitory")

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

        const message = await messageReponsitory.createMessage({
            conversation_id: conversation_id,
            sender_id: sender_id,
            message_type: message_type,
            content: content,
            parent_message_id: parent_message_id,
        });

        let attachments = [];

        if (hasImages) {
            for (const url of req.uploadedImageUrls) {
                attachments.push({
                    message_id: message.message_id,
                    file_name: "image",
                    file_url: url,
                });
            }
        }
        if (hasDocuments) {
            for (const url of req.uploadedDocumentUrls) {
                attachments.push({
                    message_id: message.message_id,
                    file_name: "documents",
                    file_url: url,
                });
            }
        }
        if (hasVideos) {
            for (const url of req.uploadedVideoUrls) {
                attachments.push({
                    message_id: message.message_id,
                    file_name: "video",
                    file_url: url,
                });
            }
        }
        if (attachments.length > 0) {
            await messageReponsitory.createMessageAttachment(attachments);
        }

        let fullMessage = await messageReponsitory.fullMessage(
            message.message_id
        );
        fullMessage.setDataValue('sender', sender);

        // Socket
        const io = global.io
        if(io) {
            const participants = await conversationReponsitory.findAllMemberOfGroup(conversation_id)
            participants.forEach((member) => {
                if(member.user_id != sender_id) {
                    io.to(`user:${member.user_id}`).emit('new_message', fullMessage);
                    console.log(`✅ Sent message to user:${member.user_id}`);
                }
            })

            io.to(`conversation:${conversation_id}`).emit('new_message', fullMessage)
        }
        
        return fullMessage
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createMessage,
};
