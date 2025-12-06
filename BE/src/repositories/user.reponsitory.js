const { Model } = require("sequelize");
const {User, UserSetting} = require("../models")

const create = async (userData, transaction) => {
    try {
        const user = await User.create(userData, {transaction});

        await UserSetting.create(
            {user_id: user.user_id},
            {transaction}
        )

        return user;
    } catch (error) {
        throw error;
    }
}

const findByEmail = async (email) => {
    try {
        const user =  await User.findOne({
            where: {
                email: email
            }
        })

        return user
    } catch (error) {
        throw error
    }
}

const findById = async (user_id) => {
    try {
        const user =  await User.findByPk(user_id)
        return user
    } catch (error) {
        throw error
    }
}

const findByName = async (username) => {
    try {
        const user =  await User.findOne({
            where: {
                username: username
            }
        })

        return user
    } catch (error) {
        throw error
    }
}

const findByIdWithSettings = async (user_id) => {
    try {
        return await User.findByPk(user_id, {
            include: [
                {
                    model: UserSetting,
                    as: "settings"
                }
            ]
        })
    } catch (error) {
        throw error
    }
}

const update = async (user_id, updateData) => {
    try {
        const user = await User.findByPk(user_id)
        if(!user) {
            return null
        }

        return await user.update(updateData)
    } catch (error) {
        throw error
    }
}

const updateLastSeen = async (user_id) => {
    try {
        return await update(user_id, {
            last_seen: new Date(),
            status: "online"
        })
    } catch (error) {
        throw error
    }
}

const updateStatus = async (user_id, status) => {
    try {
        return await update(user_id, {
            status: status
        })
    } catch (error) {
        throw error
    }
}
module.exports = {
    create,
    findByEmail,
    findByName,
    findById,
    findByIdWithSettings,
    update,
    updateLastSeen,
    updateStatus,
}