const conversationService = require("../services/conversation.service")

const createNewGroupConversation = async (req, res, next) => {
    try {
        const result = await conversationService.createNewGroupConversation(req.body, req.uploadedImageUrls);

        return res.status(201).json({
            success: true,
            message: "Tạo nhóm chat thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createNewGroupConversation
}