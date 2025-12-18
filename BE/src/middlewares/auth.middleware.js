const userRepository = require("../repositories/user.reponsitory");
const { verifyAccessToken } = require("../utils/jwt");

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token không được cung cấp",
            });
        }

        let decoded;
        try {
            decoded = verifyAccessToken(token);
        } catch (error) {
            if (error.name === "JsonWebTokenError") {
                throw { statusCode: 401, message: "Token không hợp lệ" };
            } else if (error.name === "TokenExpiredError") {
                throw { statusCode: 401, message: "Token đã hết hạn" };
            }
            throw error;
        }

        const user = await userRepository.findById(decoded.user_id);

        if (!user || !user.is_active) {
            throw {
                statusCode: 401,
                message: "Tài khoản không tồn tại hoặc đã bị khóa",
            };
        }

        req.user = {
            user_id: user.user_id,
            email: user.email,
            username: user.username,
        };
        req.token = token;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    authenticate,
};
