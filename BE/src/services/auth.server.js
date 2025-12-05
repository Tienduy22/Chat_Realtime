const userRepository = require("../repositories/user.reponsitory");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const { sequelize } = require("../models");

const register = async (registerData) => {
    const transaction = await sequelize.transaction();
    try {
        const existingEmail = await userRepository.findByEmail(
            registerData.email
        );
        if (existingEmail) {
            throw {
                statusCode: 409,
                message: "Email đã được sử dụng",
            };
        }

        const existingUsername = await userRepository.findByName(
            registerData.username
        );
        if (existingUsername) {
            throw {
                statusCode: 409,
                message: "Username đã được sử dụng",
            };
        }

        const passwordHash = await bcrypt.hash(registerData.password, 12);
        const user = await userRepository.create(
            {
                username: registerData.username,
                email: registerData.email,
                password_hash: passwordHash,
                full_name: registerData.full_name,
                phone: registerData.phone,
                status: "offline",
            },
            transaction
        );

        const access_token = generateAccessToken({
            user_id: user.user_id,
            email: user.email,
            full_name: user.full_name,
        });

        const refresh_token = generateRefreshToken({
            user_id: user.user_id,
        });

        await transaction.commit();

        return {
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                avatar_url: user.avatar_url,
                status: user.status,
            },
            tokens: {
                access_token: access_token,
                refresh_token: refresh_token,
            },
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const login = async (loginData) => {
    const { username, password } = loginData;
    const user = await userRepository.findByName(username);
    if (!user) {
        throw {
            statusCode: 401,
            message: "Username không đúng",
        };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        throw {
            statusCode: 401,
            message: "Password không đúng",
        };
    }

    if (!user.is_active) {
        throw { statusCode: 401, message: "Tài khoản đã bị khóa" };
    }

    await userRepository.updateLastSeen(user.user_id);

    const access_token = generateAccessToken({
        user_id: user.user_id,
        email: user.email,
        username: user.username,
    });

    const refresh_token = generateRefreshToken({
        user_id: user.user_id,
    });

    return {
        user: {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            avatar_url: user.avatar_url,
            status: "online",
        },
        tokens: {
            access_token: access_token,
            refresh_token: refresh_token,
        },
    };
};

module.exports = {
    register,
    login,
};
