const contactServer = require('../services/contact.server')

const sendInvitations = async (req, res, next) => {
    try {
        const result = await contactServer.sendInvitations(req.body);

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
        const result = await contactServer.acceptInvitations(req.body);

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
        const result = await contactServer.rejectInvitations(req.body);

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
        const result = await contactServer.listFriends(req.body);

        return res.status(201).json({
            success: true,
            message: "Lấy danh sách bạn bè thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const blockFriend = async (req, res, next) => {
    try {
        const result = await contactServer.blockFriend(req.body);

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
        const result = await contactServer.unBlockFriend(req.body);

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
        const result = await contactServer.listBlocked(req.body);

        return res.status(201).json({
            success: true,
            message: "Lấy list blocked thành công",
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
    listBlocked
}