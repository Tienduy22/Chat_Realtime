const {UserSetting} = require("../models")

const create = async (user_id) => {
    const userSetting = await UserSetting.create({
        user_id: user_id
    })

    return userSetting
}

module.exports = {
    create
}