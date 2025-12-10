const authService = require("../services/auth.service")

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);

        return res.status(201).json({
            success: true,
            message: "Đăng ký tài khoản thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);

        return res.status(200).json({
            success: true,
            message: "Đăng nhập tài khoản thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const result = await authService.refreshToken(req.body.refresh_token);

        return res.status(200).json({
            success: true,
            message: "Tạo tokens mới thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
}

const profile = async (req, res, next) => {
    try {
        const result = await authService.profile(req.query.user_id);

        return res.status(200).json({
            success: true,
            message: "Lấy profile mới thành công",
            data: result, 
        });
    } catch (error) {
        next(error);
    }
}

const logout = async (req, res, next) => {
    try {
        const result = await authService.logout(req.query.user_id);

        return res.status(200).json({
            success: true,
            message: "Đăng xuất thành công",
            data: result, 
        });
    } catch (error) {
        next(error)
    }
}

module.exports = {
    register,
    login,
    refreshToken,
    profile,
    logout
}