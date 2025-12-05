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

module.exports = {
    create,
    findByEmail,
    findByName,
    update,
    updateLastSeen
}