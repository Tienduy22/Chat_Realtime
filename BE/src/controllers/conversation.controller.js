const conversationService = require("../services/conversation.service");

const createNewGroupConversation = async (req, res, next) => {
    try {
        const result = await conversationService.createNewGroupConversation(
            req.body,
            req.uploadedImageUrls
        );

        return res.status(201).json({
            success: true,
            message: "Tạo nhóm chat thành công",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const createNewConversation = async (req, res, next) => {
    try {
        const result = await conversationService.createNewConversation(
            req.body,
        );

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

const changeRoleAdmin = async (req, res, next) => {
    try {
        const result = await conversationService.changeRoleAdmin(req.body);

        return res.status(201).json({
            success: true,
            message: "Thay đổi admin mới thành công",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const changeName = async (req, res, next) => {
    try {
        const result = await conversationService.changeName(req.body);

        return res.status(201).json({
            success: true,
            message: "Thay đổi tên nhóm thành công",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const changeAvatar = async (req, res, next) => {
    try {
        const result = await conversationService.changeAvatar(
            req.body,
            req.uploadedImageUrls
        );

        return res.status(201).json({
            success: true,
            message: "Thay đổi ảnh nhóm thành công",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const changeNotification = async (req, res, next) => {
    try {
        const result = await conversationService.changeNotification(req.body);

        return res.status(201).json({
            success: true,
            message: "Thay đổi trạng thái thông báo thành công",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const AllMessageOfConversation = async (req, res, next) => {
    try {
        const result = await conversationService.AllMessageOfConversation(
            req.params.conversation_id,
            req.user.user_id,
            Number(req.query.limit),
            Number(req.query.offset)
        );

        return res.status(201).json({
            success: true,
            message: "Lấy tin nhắn thành công",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const listConversation = async (req, res, next) => {
    try {
        const result = await conversationService.listConversation(
            req.user.user_id
        );

        return res.status(201).json({
            success: true,
            message: "Lấy data thành công",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const findById = async (req, res, next) => {
    try {
        const result = await conversationService.findById(
            req.params.conversation_id
        );

        return res.status(201).json({
            success: true,
            message: "Lấy data thành công",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const updateConversation = async (req, res, next) => {
    try {
        const result = await conversationService.updateConversation(
            req.query.conversation_id,
            req.query.user_id,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Cập nhật thông tin nhóm thành công",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createNewGroupConversation,
    createNewConversation,
    addMember,
    deleteMember,
    memberLeave,
    adminLeave,
    changeRoleAdmin,
    changeName,
    changeAvatar,
    changeNotification,
    AllMessageOfConversation,
    listConversation,
    findById,
    updateConversation
};
