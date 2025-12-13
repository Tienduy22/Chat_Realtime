const messageService = require("../services/message.service")

const createMessage = async (req, res, next) => {
    try {
        const result = await messageService.createMessage(req);

        return res.status(201).json({
            success: true,
            message: "Gửi tin nhắn thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createMessage
}