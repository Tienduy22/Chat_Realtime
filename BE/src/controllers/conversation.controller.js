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

const addMember = async (req, res, next) => {
    try {
        const result = await conversationService.addMember(req.body);

        return res.status(201).json({
            success: true,
            message: "Thêm thành viên thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const deleteMember = async (req, res, next) => {
    try {
        const result = await conversationService.deleteMember(req.body);

        return res.status(201).json({
            success: true,
            message: "Xóa thành viên thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const memberLeave = async (req, res, next) => {
    try {
        const result = await conversationService.memberLeave(req.body);

        return res.status(201).json({
            success: true,
            message: "Rời nhóm thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const adminLeave = async (req, res, next) => {
    try {
        const result = await conversationService.adminLeave(req.body);

        return res.status(201).json({
            success: true,
            message: "Rời nhóm thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createNewGroupConversation,
    addMember,
    deleteMember,
    memberLeave,
    adminLeave
}