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
        const result = await userService.updateProfile(req.params.user_id ,req.body, req.uploadedImageUrls);

        return res.status(201).json({
            success: true,
            message: "Cập nhật tài khoản thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateProfile,
    searchUser
}