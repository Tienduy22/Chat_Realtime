const messageService = require("../services/message.service");

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

const markAsRead = async (req, res, next) => {
    try {
        const result = await messageService.markAsRead(req.body);

        return res.status(201).json({
            success: true,
            message: "Đánh dấu đã đọc thành công",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const deleteMessage = async (req, res, next) => {
    try {
        const result = await messageService.deleteMessage(req.body);

        return res.status(201).json({
            success: true,
            message: "Xóa tin nhắn thành công",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const editMessage = async (req, res, next) => {
    try {
        const result = await messageService.editMessage(req.body);

        return res.status(201).json({
            success: true,
            message: "Sửa tin nhắn thành công",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const reactionMessage = async (req, res, next) => {
    try {
        const result = await messageService.reactionMessage(req.body);

        return res.status(201).json({
            success: true,
            message: "Reaction tin nhắn thành công",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createMessage,
    markAsRead,
    deleteMessage,
    editMessage,
    reactionMessage,
};
