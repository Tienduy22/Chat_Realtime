import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const getNotifications = async (page = 1, limit = 20) => {
    try {
        const response = await axios.get(
            `${API_URL}/notifications`,
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error('Get notifications error:', error)
        throw error
    }
}

export const getUnreadCount = async () => {
    try {
        const response = await axios.get(`${API_URL}/notifications/unread/count`, {
            withCredentials: true,
        })
        return response.data
    } catch (error) {
        console.error('Get unread count error:', error)
        throw error
    }
}

export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await axios.post(
            `${API_URL}/notifications/${notificationId}/read`,
            {},
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error('Mark notification as read error:', error)
        throw error
    }
}

export const markAllNotificationsAsRead = async () => {
    try {
        const response = await axios.post(
            `${API_URL}/notifications/read-all`,
            {},
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error('Mark all notifications as read error:', error)
        throw error
    }
}

export const deleteNotification = async (notificationId) => {
    try {
        const response = await axios.delete(
            `${API_URL}/notifications/${notificationId}`,
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error('Delete notification error:', error)
        throw error
    }
}

export const deleteAllNotifications = async () => {
    try {
        const response = await axios.delete(
            `${API_URL}/notifications/all`,
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error('Delete all notifications error:', error)
        throw error
    }
}

// Handle socket events for notifications
export const handleFriendRequest = (notification) => {
    return {
        type: 'friend_request',
        title: 'Lời mời kết bạn',
        user: notification.from_user,
        actionUrl: '/contact',
    }
}

export const handleFriendAccepted = (notification) => {
    return {
        type: 'friend_accepted',
        title: 'Đã chấp nhận lời mời kết bạn',
        user: notification.from_user,
        actionUrl: '/contact',
    }
}

export const handleFriendRejected = (notification) => {
    return {
        type: 'friend_rejected',
        title: 'Từ chối lời mời kết bạn',
        user: notification.from_user,
        actionUrl: '/contact',
    }
}

export const handleMessageNotification = (notification) => {
    return {
        type: 'message',
        title: 'Tin nhắn mới',
        content: notification.content,
        from_user: notification.from_user,
        conversationId: notification.conversation_id,
        actionUrl: `/chat/${notification.conversation_id}`,
    }
}

export const handleReactionNotification = (notification) => {
    return {
        type: 'reaction',
        title: 'Phản ứng tin nhắn',
        content: notification.content,
        from_user: notification.from_user,
        reaction: notification.reaction,
        conversationId: notification.conversation_id,
        actionUrl: `/chat/${notification.conversation_id}`,
    }
}

export const handleMentionNotification = (notification) => {
    return {
        type: 'mention',
        title: 'Nhắc đến bạn',
        content: notification.content,
        from_user: notification.from_user,
        conversationId: notification.conversation_id,
        actionUrl: `/chat/${notification.conversation_id}`,
    }
}

export const handleGroupInvite = (notification) => {
    return {
        type: 'group_invite',
        title: 'Thêm vào nhóm',
        groupName: notification.group_name,
        from_user: notification.from_user,
        conversationId: notification.conversation_id,
        actionUrl: `/chat/${notification.conversation_id}`,
    }
}

export const handleGroupDelete = (notification) => {
    return {
        type: 'group_delete',
        title: 'Nhóm đã bị xóa',
        groupName: notification.group_name,
        message: `Nhóm "${notification.group_name}" đã bị xóa`,
    }
}

export const handleSystemNotification = (notification) => {
    return {
        type: 'system',
        title: 'Thông báo hệ thống',
        content: notification.content,
    }
}
