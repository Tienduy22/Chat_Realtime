const contactService = require('../services/contact.service')

const sendInvitations = async (req, res, next) => {
    try {
        const result = await contactService.sendInvitations(req.body);

        return res.status(201).json({
            success: true,
            message: "Gửi lời mời thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const acceptInvitations = async (req, res, next) => {
    try {
        const result = await contactService.acceptInvitations(req.body);

        return res.status(201).json({
            success: true,
            message: "Chấp nhận lời kết bạn thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const rejectInvitations = async (req, res, next) => {
    try {
        const result = await contactService.rejectInvitations(req.body);

        return res.status(201).json({
            success: true,
            message: "Từ chối lời kết bạn thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const listFriends = async (req, res, next) => {
    try {
        const result = await contactService.listFriends(req.query);

        return res.status(201).json({
            success: true,
            message: "Lấy danh sách bạn bè thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const listGroup = async (req, res, next) => {
    try {
        const result = await contactService.listGroup(req.query);

        return res.status(201).json({
            success: true,
            message: "Lấy danh sách nhóm thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const blockFriend = async (req, res, next) => {
    try {
        const result = await contactService.blockFriend(req.body);

        return res.status(201).json({
            success: true,
            message: "Block thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const unBlockFriend = async (req, res, next) => {
    try {
        const result = await contactService.unBlockFriend(req.body);

        return res.status(201).json({
            success: true,
            message: "Gỡ block thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const listBlocked = async (req, res, next) => {
    try {
        const result = await contactService.listBlocked(req.body);

        return res.status(201).json({
            success: true,
            message: "Lấy list blocked thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const findContactByPhone = async (req, res, next) => {
    try {
        const result = await contactService.findContactByPhone(req.query);

        return res.status(201).json({
            success: true,
            message: "Lấy contact thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const findSendInvitations = async (req, res, next) => {
    try {
        const result = await contactService.findSendInvitations(req.query);

        return res.status(201).json({
            success: true,
            message: "Lấy data thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const findInvitations = async (req, res, next) => {
    try {
        const result = await contactService.findInvitations(req.query);

        return res.status(201).json({
            success: true,
            message: "Lấy data thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const removeInvitations = async (req, res, next) => {
    try {
        const result = await contactService.removeInvitations(req.query);

        return res.status(201).json({
            success: true,
            message: "Xóa lời mời thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const removeFriend = async (req, res, next) => {
    try {
        const result = await contactService.removeFriend(req.body);

        return res.status(201).json({
            success: true,
            message: "Hủy kết bạn thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    sendInvitations,
    acceptInvitations,
    rejectInvitations,
    listFriends,
    blockFriend,
    unBlockFriend,
    listBlocked,
    listGroup,
    findContactByPhone,
    findSendInvitations,
    findInvitations,
    removeInvitations,
    removeFriend
}