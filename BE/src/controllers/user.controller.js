const userService = require('../services/user.service')

const searchUser = async (req, res, next) => {
    try {
        const result = await userService.searchUser(req.query.keyword);

        return res.status(201).json({
            success: true,
            message: "Tìm kiếm thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const result = await userService.updateProfile(req.params.user_id ,req.body);

        return res.status(201).json({
            success: true,
            message: "Cập nhật tài khoản thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const updateAvatar = async (req, res, next) => {
    try {
        const result = await userService.updateAvatar(req.params.user_id, req.uploadedImageUrls);

        return res.status(201).json({
            success: true,
            message: "Cập nhật avatar thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const findById = async (req, res, next) => {
    try {
        const result = await userService.findById(req.query.user_id);

        return res.status(201).json({
            success: true,
            message: "Tìm kiếm thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const result = await userService.changePassword(req.body);

        return res.status(201).json({
            success: true,
            message: "Cập nhật avatar thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateProfile,
    searchUser,
    updateAvatar,
    findById,
    changePassword
}