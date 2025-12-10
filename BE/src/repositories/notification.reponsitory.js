const { Notification } = require("../models");

const notificationSendInvite = async (user_id, content, reference_id) => {
    const notificationSendInvite = await Notification.create({
        user_id: user_id,
        type: 'friend_request',
        title: 'Lời kết bạn',
        content: content,
        reference_id: reference_id,
        reference_type: "user",
        is_read: false
    })

    return notificationSendInvite
}

const notificationAcceptInvite = async (user_id, content, reference_id) => {
    const notificationSendInvite = await Notification.create({
        user_id: user_id,
        type: 'friend_request',
        title: 'Chấp nhận kết bạn',
        content: content,
        reference_id: reference_id,
        reference_type: "user",
        is_read: false
    })

    return notificationSendInvite
}

const updateIdRead = async (notification_id) => {
    return await Notification.update(
        {
            is_read: true
        },
        {
            where: {
                notification_id: notification_id
            }
        }
    )
}

module.exports = {
    notificationSendInvite,
    notificationAcceptInvite,
    updateIdRead
}