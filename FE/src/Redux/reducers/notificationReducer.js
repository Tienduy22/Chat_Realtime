import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
}

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        // Thêm thông báo mới
        addNotification: (state, action) => {
            const newNotification = {
                ...action.payload,
                is_read: false,
            }
            state.notifications.unshift(newNotification)
            if (!newNotification.is_read) {
                state.unreadCount += 1
            }
        },
        
        // Thêm nhiều thông báo
        setNotifications: (state, action) => {
            state.notifications = action.payload || []
            state.unreadCount = state.notifications.filter(n => !n.is_read).length
        },

        // Đánh dấu thông báo đã đọc
        markAsRead: (state, action) => {
            const notificationId = action.payload
            const notification = state.notifications.find(n => n.notification_id === notificationId)
            if (notification && !notification.is_read) {
                notification.is_read = true
                state.unreadCount = Math.max(0, state.unreadCount - 1)
            }
        },

        // Đánh dấu tất cả thông báo đã đọc
        markAllAsRead: (state) => {
            state.notifications.forEach(n => {
                n.is_read = true
            })
            state.unreadCount = 0
        },

        // Xóa thông báo
        deleteNotification: (state, action) => {
            const notificationId = action.payload
            const notification = state.notifications.find(n => n.notification_id === notificationId)
            if (notification && !notification.is_read) {
                state.unreadCount = Math.max(0, state.unreadCount - 1)
            }
            state.notifications = state.notifications.filter(n => n.notification_id !== notificationId)
        },

        // Xóa tất cả thông báo
        clearAllNotifications: (state) => {
            state.notifications = []
            state.unreadCount = 0
        },

        // Set loading state
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },

        // Set error
        setError: (state, action) => {
            state.error = action.payload
        },
    },
})

export const {
    addNotification,
    setNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    setLoading,
    setError,
} = notificationSlice.actions

export default notificationSlice.reducer
