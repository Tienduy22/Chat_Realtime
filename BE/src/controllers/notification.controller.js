const notificationService = require('../services/notification.service')

const getNotifications = async (req, res, next) => {
    try {
        const user_id = req.user?.user_id

        const result = await notificationService.getNotifications(user_id)

        return res.status(200).json({
            success: true,
            message: 'Lấy thông báo thành công',
            data: result.notifications,
        })
    } catch (error) {
        next(error)
    }
}

const getUnreadCount = async (req, res, next) => {
    try {
        const user_id = req.user?.user_id

        const count = await notificationService.getUnreadCount(user_id)

        return res.status(200).json({
            success: true,
            data: {
                unread_count: count,
            },
        })
    } catch (error) {
        next(error)
    }
}

const markAsRead = async (req, res, next) => {
    try {
        const { notification_id } = req.params
        const user_id = req.user?.user_id

        const result = await notificationService.markAsRead(user_id, notification_id)

        return res.status(200).json({
            success: true,
            message: 'Đánh dấu đã đọc thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const markAllAsRead = async (req, res, next) => {
    try {
        const user_id = req.user?.user_id

        const result = await notificationService.markAllAsRead(user_id)

        return res.status(200).json({
            success: true,
            message: 'Đánh dấu tất cả đã đọc',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const deleteNotification = async (req, res, next) => {
    try {
        const { notification_id } = req.params
        const user_id = req.user?.user_id

        const result = await notificationService.deleteNotification(user_id, notification_id)

        return res.status(200).json({
            success: true,
            message: 'Xóa thông báo thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const deleteAllNotifications = async (req, res, next) => {
    try {
        const user_id = req.user?.user_id

        const result = await notificationService.deleteAllNotifications(user_id)

        return res.status(200).json({
            success: true,
            message: 'Xóa tất cả thông báo',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
}
