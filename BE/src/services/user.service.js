const userRepository = require("../repositories/user.reponsitory");
const bcrypt = require("bcrypt");

const searchUser = async (keyword) => {
    try {
        const user = await userRepository.searchUser(keyword);
        if (user.length == 0) {
            throw {
                statusCode: 401,
                message: "User không tồn tại",
            };
        }

        return user;
    } catch (error) {
        throw error;
    }
};

const updateProfile = async (user_id, updateData) => {
    try {
        const user = await userRepository.findById(user_id);
        if (!user) {
            throw {
                statusCode: 401,
                message: "User không tồn tại",
            };
        }

        const updateUser = await userRepository.update(user_id, {
            ...updateData,
        });
        return updateUser;
    } catch (error) {
        throw error;
    }
};

const updateAvatar = async (user_id, images) => {
    try {
        const user = await userRepository.findById(user_id);
        if (!user) {
            throw {
                statusCode: 401,
                message: "User không tồn tại",
            };
        }
        console.log(images)
        const avatar_url = images[0]

        const updateUser = await userRepository.update(user_id, {
            avatar_url
        });
        return updateUser;
    } catch (error) {
        throw error;
    }
};

const findById = async (user_id) => {
    try {
        const user = await userRepository.findById(user_id);
        if (!user) {
            throw {
                statusCode: 401,
                message: "User không tồn tại",
            };
        }

        return user;
    } catch (error) {
        throw error;
    }
};

const changePassword = async ({user_id, password, newPassword}) => {
    try {
        const user = await userRepository.findById(user_id);
        if (!user) {
            throw {
                statusCode: 401,
                message: "User không tồn tại",
            };
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash,
        );
        if (!isPasswordValid) {
            throw {
                statusCode: 401,
                message: "Password không đúng",
            };
        } else {
            const passwordHash = await bcrypt.hash(newPassword, 12);
            await userRepository.update(user_id, {password_hash: passwordHash})
        }
    } catch (error) {
        throw error;
    }
};

module.exports = {
    updateProfile,
    searchUser,
    updateAvatar,
    findById,
    changePassword
};
