const authService = require("../services/auth.server")

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

module.exports = {
    register,
    login
}