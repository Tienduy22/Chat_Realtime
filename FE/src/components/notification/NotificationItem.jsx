import React from 'react'

const NotificationItem = ({ notification, onClick, onDelete }) => {
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'friend_request':
            case 'friend_accepted':
            case 'friend_rejected':
                return 'person_add'
            case 'message':
                return 'mail'
            case 'mention':
                return 'tag'
            case 'reaction':
                return 'sentiment_satisfied'
            case 'group_invite':
                return 'group_add'
            case 'group_delete':
                return 'group_remove'
            default:
                return 'notification_add'
        }
    }

    const getNotificationColor = (type) => {
        switch (type) {
            case 'friend_request':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            case 'message':
            case 'mention':
                return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
            case 'reaction':
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
            case 'group_invite':
                return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
            case 'group_delete':
                return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            case 'friend_accepted':
            case 'friend_rejected':
                return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
        }
    }

    const getTypeLabel = (type) => {
        switch (type) {
            case 'friend_request':
                return 'Lời mời kết bạn'
            case 'friend_accepted':
                return 'Chấp nhận kết bạn'
            case 'friend_rejected':
                return 'Từ chối kết bạn'
            case 'message':
                return 'Tin nhắn'
            case 'mention':
                return 'Nhắc đến bạn'
            case 'reaction':
                return 'Phản ứng'
            case 'group_invite':
                return 'Thêm vào nhóm'
            case 'group_delete':
                return 'Nhóm xóa'
            default:
                return 'Thông báo'
        }
    }

    const formatTime = (createdAt) => {
        const date = new Date(createdAt)
        const now = new Date()
        const diffMinutes = Math.floor((now - date) / 60000)

        if (diffMinutes < 1) return 'Vừa xong'
        if (diffMinutes < 60) return `${diffMinutes}m trước`

        const diffHours = Math.floor(diffMinutes / 60)
        if (diffHours < 24) return `${diffHours}h trước`

        const diffDays = Math.floor(diffHours / 24)
        if (diffDays <= 7) return `${diffDays}d trước`

        return date.toLocaleDateString('vi-VN')
    }

    return (
        <div
            onClick={onClick}
            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition flex gap-3 ${
                !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
            }`}
        >
            {/* Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                <span className="material-icons text-lg">{getNotificationIcon(notification.type)}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-700 dark:text-white truncate">
                                {notification.title}
                            </p>
                            {!notification.is_read && (
                                <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full"></span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {notification.type}
                        </p>
                    </div>
                    <button
                        onClick={onDelete}
                        className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition opacity-0 group-hover:opacity-100"
                        title="Xóa thông báo"
                    >
                        <span className="material-icons text-lg text-gray-500 dark:text-gray-400">
                            close
                        </span>
                    </button>
                </div>

                {/* Message content */}
                {notification.content && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                        {notification.content}
                    </p>
                )}

                {/* Time */}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {formatTime(notification.created_at)}
                </p>
            </div>
        </div>
    )
}

export default NotificationItem
