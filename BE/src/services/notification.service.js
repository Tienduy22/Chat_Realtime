const { Notification } = require('../models')

const notificationService = {
    // Create notification
    createNotification: async (user_id, type, title, content, reference_id = null, reference_type = null) => {
        try {
            const notification = await Notification.create({
                user_id,
                type,
                title,
                content,
                reference_id,
                reference_type,
                is_read: false,
            })

            return notification
        } catch (error) {
            console.error('Error creating notification:', error)
            throw error
        }
    },

    // Get notifications
    getNotifications: async (user_id) => {
        try {
            const { count, rows } = await Notification.findAndCountAll({
                where: { 
                    user_id,
                    is_read: false
                 },
                order: [['created_at', 'DESC']],
            })

            return {
                notifications: rows,
                total: count,
            }
        } catch (error) {
            console.error('Error getting notifications:', error)
            throw error
        }
    },

    // Get unread count
    getUnreadCount: async (user_id) => {
        try {
            const count = await Notification.count({
                where: {
                    user_id,
                    is_read: false,
                },
            })

            return count
        } catch (error) {
            console.error('Error getting unread count:', error)
            throw error
        }
    },

    // Mark as read
    markAsRead: async (user_id, notification_id) => {
        try {
            const notification = await Notification.findOne({
                where: {
                    notification_id,
                    user_id,
                },
            })

            if (!notification) {
                throw new Error('Thông báo không tìm thấy')
            }

            notification.is_read = true
            await notification.save()

            return notification
        } catch (error) {
            console.error('Error marking notification as read:', error)
            throw error
        }
    },

    // Mark all as read
    markAllAsRead: async (user_id) => {
        try {
            await Notification.update(
                { is_read: true },
                {
                    where: {
                        user_id,
                        is_read: false,
                    },
                }
            )

            return {
                success: true,
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error)
            throw error
        }
    },

    // Delete notification
    deleteNotification: async (user_id, notification_id) => {
        try {
            const notification = await Notification.findOne({
                where: {
                    notification_id,
                    user_id,
                },
            })

            if (!notification) {
                throw new Error('Thông báo không tìm thấy')
            }

            await Notification.destroy({
                where: {
                    notification_id,
                    user_id,
                },
            })

            return {
                success: true,
            }
        } catch (error) {
            console.error('Error deleting notification:', error)
            throw error
        }
    },

    // Delete all notifications
    deleteAllNotifications: async (user_id) => {
        try {
            await Notification.destroy({
                where: {
                    user_id,
                },
            })

            return {
                success: true,
            }
        } catch (error) {
            console.error('Error deleting all notifications:', error)
            throw error
        }
    },
}

module.exports = notificationService
