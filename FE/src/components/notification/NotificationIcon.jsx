import React, { useState } from 'react'
import { useNotification } from '../../context/NotificationContext'
import NotificationModal from './NotificationModal'

const NotificationIcon = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { unreadCount } = useNotification()

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`relative group p-3 rounded-xl transition-all
                    ${
                        isOpen
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-primary'
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                `}
                title="Notifications"
            >
                <span className="material-icons">notifications</span>

                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 h-5 w-5 bg-red-500 rounded-full border-2 border-white dark:border-sidebar-dark flex items-center justify-center text-white text-xs font-bold">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}

                <div className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    Thông báo
                </div>
            </button>

            {isOpen && <NotificationModal onClose={() => setIsOpen(false)} />}
        </>
    )
}

export default NotificationIcon
