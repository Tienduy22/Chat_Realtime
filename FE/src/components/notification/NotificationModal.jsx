import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '../../context/NotificationContext'
import { markNotificationAsRead, deleteNotification as deleteNotificationAPI, markAllNotificationsAsRead as markAllAsReadAPI } from '../../services/notification.service'
import NotificationItem from './NotificationItem'

const NotificationModal = ({ onClose }) => {
    const navigate = useNavigate()
    const {
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    } = useNotification()
    const [filter, setFilter] = useState('all') // all, unread, friend_request, message, system
    const [isProcessing, setIsProcessing] = useState(false)

    const filteredNotifications = notifications.filter((n) => {
        if (filter === 'all') return true
        if (filter === 'unread') return !n.is_read
        return n.type === filter
    })

    const handleNotificationClick = async (notification) => {
        // Mark as read
        if (!notification.is_read) {
            try {
                await markNotificationAsRead(notification.notification_id)
                markAsRead(notification.notification_id)
            } catch (error) {
                console.error('Error marking notification as read:', error)
            }
        }

        // Navigate based on type
        if (notification.reference_type === 'conversation') {
            navigate(`/chat/${notification.reference_id}`)
            onClose()
        } else if (notification.reference_type === 'user') {
            navigate(`/contact`)
            onClose()
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            setIsProcessing(true)
            await markAllAsReadAPI()
            markAllAsRead()
        } catch (error) {
            console.error('Error marking all as read:', error)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleDeleteNotification = async (e, notificationId) => {
        e.stopPropagation()
        try {
            await deleteNotificationAPI(notificationId)
            deleteNotification(notificationId)
        } catch (error) {
            console.error('Error deleting notification:', error)
        }
    }

    const handleClearAll = () => {
        if (confirm('Bạn có chắc chắn muốn xóa tất cả thông báo?')) {
            // Clear all notifications
            notifications.forEach((n) => {
                deleteNotification(n.notification_id)
            })
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-[100]">
            <div
                className="animate-slide-in bg-white dark:bg-sidebar-dark w-full md:w-96 h-screen md:h-auto md:max-h-[90vh] md:rounded-lg md:m-4 flex flex-col border border-gray-200 dark:border-gray-700 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Thông báo
                        </h2>
                        {unreadCount > 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {unreadCount} chưa đọc
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                        <span className="material-icons text-xl">close</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="flex-shrink-0 flex gap-2 p-3 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                    {[
                        { value: 'all', label: 'Tất cả' },
                        { value: 'unread', label: 'Chưa đọc' },
                        { value: 'friend_request', label: 'Kết bạn' },
                        { value: 'message', label: 'Tin nhắn' },
                    ].map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition ${
                                filter === f.value
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Actions */}
                {notifications.length > 0 && (
                    <div className="flex-shrink-0 flex gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <button
                            onClick={handleMarkAllAsRead}
                            disabled={isProcessing || unreadCount === 0}
                            className={`text-sm font-medium px-3 py-1 rounded transition ${
                                unreadCount === 0
                                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                    : 'text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20'
                            }`}
                        >
                            Đánh dấu đã đọc
                        </button>
                        <button
                            onClick={handleClearAll}
                            className="text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded transition"
                        >
                            Xóa tất cả
                        </button>
                    </div>
                )}

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredNotifications.length > 0 ? (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredNotifications.map((notification) => (
                                <NotificationItem
                                    key={notification.notification_id}
                                    notification={notification}
                                    onClick={() => handleNotificationClick(notification)}
                                    onDelete={(e) =>
                                        handleDeleteNotification(e, notification.notification_id)
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-center py-12">
                            <div>
                                <span className="material-icons text-5xl text-gray-300 dark:text-gray-600 block mb-2">
                                    notifications_none
                                </span>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {filter === 'unread'
                                        ? 'Không có thông báo chưa đọc'
                                        : 'Không có thông báo'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}

export default NotificationModal
