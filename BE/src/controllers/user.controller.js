const userServer = require('../services/user.server')

const searchUser = async (req, res, next) => {
    try {
        const result = await userServer.searchUser(req.query.keyword);

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
        const result = await userServer.updateProfile(req.params.user_id ,req.body, req.uploadedImageUrls);

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