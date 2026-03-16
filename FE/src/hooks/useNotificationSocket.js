import { useEffect } from 'react'
import { useNotification } from '../context/NotificationContext'

export const useNotificationSocket = () => {
    const { fetchNotifications, setupSocketListeners, notifications } = useNotification()

    // Fetch initial notifications
    useEffect(() => {
        fetchNotifications(1, 100)
    }, [fetchNotifications])

    // Setup socket listeners
    useEffect(() => {
        const cleanup = setupSocketListeners()
        return cleanup
    }, [setupSocketListeners])

    return {
        notifications,
    }
}
