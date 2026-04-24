const express = require('express')
const router = express.Router()
const notificationController = require('../controllers/notification.controller')
const { authenticate } = require('../middlewares/auth.middleware')

// Apply auth middleware to all routes
router.use(authenticate)

// Get all notifications
router.get('/', notificationController.getNotifications)

// Get unread count
router.get('/unread/count', notificationController.getUnreadCount)

// Mark all notifications as read
router.post('/read-all', notificationController.markAllAsRead)

// Mark notification as read
router.post('/:notification_id/read', notificationController.markAsRead)

// Delete notification
router.delete('/:notification_id', notificationController.deleteNotification)

// Delete all notifications
router.delete('/all', notificationController.deleteAllNotifications)

module.exports = router
