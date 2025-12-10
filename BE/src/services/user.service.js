const userRepository = require("../repositories/user.reponsitory");

const searchUser = async (keyword) => {
    try {
        const user = await userRepository.searchUser(keyword)
        if(user.length == 0) {
            throw {
                statusCode: 401,
                message: "User không tồn tại",
            }
        }

        return user
    } catch (error) {
        throw error
    }
}

const updateProfile = async (user_id, updateData, images) => {
    try {
        const user = await userRepository.findById(user_id)
        if(!user) {
            throw {
                statusCode: 401,
                message: "User không tồn tại",
            }
        }

        const updateUser = await userRepository.update(user_id, {
            ...updateData,
            avatar_url: images[0]
        })
        return updateUser
    } catch (error) {
        throw error
    }
}

module.exports = {
    updateProfile,
    searchUser
}