const notificationService = require('../services/notification.service')
const userRepository = require('../repositories/user.reponsitory')

/**
 * Emit friend request notification
 */
const emitFriendRequest = async (io, fromUserId, toUserId) => {
    try {
        const fromUser = await userRepository.findById(fromUserId)
        
        await notificationService.createNotification(
            toUserId,
            'friend_request',
            'Lời mời kết bạn',
            `${fromUser?.full_name || fromUser?.username} đã gửi lời mời kết bạn`,
            fromUserId,
            'user'
        )

        io.to(`user:${toUserId}`).emit('friend_request', {
            type: 'friend_request',
            title: 'Lời mời kết bạn',
            content: `${fromUser?.full_name || fromUser?.username} đã gửi lời mời kết bạn`,
            from_user: {
                user_id: fromUser.user_id,
                username: fromUser.username,
                full_name: fromUser.full_name,
                avatar_url: fromUser.avatar_url,
            },
        })
    } catch (error) {
        console.error('Error emitting friend request:', error)
    }
}

/**
 * Emit friend accepted notification
 */
const emitFriendAccepted = async (io, fromUserId, toUserId) => {
    try {
        console.log('dafsdfsdfyla',toUserId)
        const fromUser = await userRepository.findById(fromUserId)

        io.to(`user:${toUserId}`).emit('friend_accepted', {
            type: 'friend_accepted',
            title: 'Đã chấp nhận lời mời kết bạn',
            content: `${fromUser?.full_name || fromUser?.username} đã chấp nhận lời mời kết bạn`,
            from_user: {
                user_id: fromUser.user_id,
                username: fromUser.username,
                full_name: fromUser.full_name,
                avatar_url: fromUser.avatar_url,
            },
        })
    } catch (error) {
        console.error('Error emitting friend accepted:', error)
    }
}

/**
 * Emit friend rejected notification
 */
const emitFriendRejected = async (io, fromUserId, toUserId) => {
    try {
        const fromUser = await userRepository.findById(fromUserId)
        
        await notificationService.createNotification(
            toUserId,
            'friend_rejected',
            'Từ chối lời mời kết bạn',
            `${fromUser?.full_name || fromUser?.username} đã từ chối lời mời kết bạn`,
            fromUserId,
            'user'
        )

        io.to(`user:${toUserId}`).emit('friend_rejected', {
            type: 'friend_rejected',
            title: 'Từ chối lời mời kết bạn',
            content: `${fromUser?.full_name || fromUser?.username} đã từ chối lời mời kết bạn`,
            from_user: {
                user_id: fromUser.user_id,
                username: fromUser.username,
                full_name: fromUser.full_name,
                avatar_url: fromUser.avatar_url,
            },
        })
    } catch (error) {
        console.error('Error emitting friend rejected:', error)
    }
}

/**
 * Emit new message notification
 */
const emitNewMessage = async (io, message, conversationParticipants, conversation, senderId) => {
    try {
        const fromUser = message.User || await userRepository.findById(message.sender_id || senderId)
        
        console.log('🔔 emitNewMessage start:', {
            message_id: message.message_id,
            conversation_type: conversation?.conversation_type,
            participants_count: conversationParticipants.length,
            senderId
        });
        
        // Participants đã được filter trước khi truyền vào, so chỉ cần tạo notification
        for (const participant of conversationParticipants) {
            // Xây dựng tiêu đề và nội dung thông báo tùy theo loại cuộc trò chuyện
            let notificationTitle = 'Tin nhắn mới'
            let notificationContent = message.content || '[File hoặc media]'
            
            if (conversation && conversation.conversation_type === 'group') {
                // Nhóm: hiển thị "Tên người gửi trong nhóm"
                notificationTitle = `${fromUser?.full_name || fromUser?.username} trong "${conversation.name}"`
                console.log('✅ Creating GROUP notification for:', participant.user_id, notificationTitle);
            } else {
                // Tin nhắn 1-1: hiển thị "Tên người gửi"
                notificationTitle = `${fromUser?.full_name || fromUser?.username}`
                console.log('✅ Creating PRIVATE notification for:', participant.user_id, notificationTitle);
            }
            
            const notification = await notificationService.createNotification(
                participant.user_id,
                'message',
                notificationTitle,
                notificationContent,
                message.conversation_id,
                'conversation'
            )
            
            // 📢 Emit socket event để notify user realtime
            io.to(`user:${participant.user_id}`).emit('message_notification', {
                type: 'message',
                title: notificationTitle,
                content: notificationContent,
                from_user: {
                    user_id: fromUser.user_id,
                    username: fromUser.username,
                    full_name: fromUser.full_name,
                    avatar_url: fromUser.avatar_url,
                },
                reference_id: message.conversation_id,
                reference_type: 'conversation',
                conversation_name: conversation?.name,
                is_group: conversation?.conversation_type === 'group',
            })
        }
    } catch (error) {
        console.error('Error emitting new message:', error)
    }
}

/**
 * Emit message reaction notification
 */
const emitMessageReaction = async (io, reaction, message, conversationParticipants) => {
    try {
        const fromUser = await userRepository.findById(reaction.user_id)
        
        // Gửi notification cho owner của message, trừ người thả reaction
        if (message.sender_id !== reaction.user_id) {
            await notificationService.createNotification(
                message.sender_id,
                'reaction',
                `${fromUser?.full_name || fromUser?.username} đã thả reaction tin nhắn của bạn`,
                reaction.emoji || '👍',
                message.message_id,
                'message'
            )

            io.to(`user:${message.sender_id}`).emit('message_reaction', {
                type: 'reaction',
                title: `${fromUser?.full_name || fromUser?.username} đã thả reaction tin nhắn của bạn`,
                content: reaction.emoji || '👍',
                from_user: {
                    user_id: fromUser.user_id,
                    username: fromUser.username,
                    full_name: fromUser.full_name,
                    avatar_url: fromUser.avatar_url,
                },
                message_id: message.message_id,
                conversation_id: message.conversation_id,
            })
        }
    } catch (error) {
        console.error('Error emitting message reaction:', error)
    }
}

/**
 * Emit mention notification
 */
const emitMention = async (io, mentionedUserId, message, fromUser) => {
    try {
        await notificationService.createNotification(
            mentionedUserId,
            'mention',
            'Bạn đã bị nhắc đến',
            message.content || '[Có tin nhắn mới]',
            message.conversation_id,
            'conversation'
        )

        io.to(`user:${mentionedUserId}`).emit('mention', {
            type: 'mention',
            title: 'Bạn đã bị nhắc đến',
            content: message.content || '[Có tin nhắn mới]',
            from_user: {
                user_id: fromUser.user_id,
                username: fromUser.username,
                full_name: fromUser.full_name,
                avatar_url: fromUser.avatar_url,
            },
            conversation_id: message.conversation_id,
            message_id: message.message_id,
        })
    } catch (error) {
        console.error('Error emitting mention:', error)
    }
}

/**
 * Emit group invite notification
 */
const emitGroupInvite = async (io, userId, conversation, fromUser) => {
    try {
        conversation = conversation.conversation.toJSON()
        await notificationService.createNotification(
            userId,
            'group_invite',
            'Thêm vào nhóm',
            `${fromUser?.full_name || fromUser?.username} đã thêm bạn vào nhóm "${conversation?.name}"`,
            conversation.conversation_id,
            'conversation'
        )

        io.to(`user:${userId}`).emit('group_invite', {
            type: 'group_invite',
            title: 'Thêm vào nhóm',
            content: `${fromUser?.full_name || fromUser?.username} đã thêm bạn vào nhóm "${conversation?.name}"`,
            group_name: conversation?.name,
            from_user: {
                user_id: fromUser.user_id,
                username: fromUser.username,
                full_name: fromUser.full_name,
                avatar_url: fromUser.avatar_url,
            },
            conversation_id: conversation.conversation_id,
        })
    } catch (error) {
        console.error('Error emitting group invite:', error)
    }
}


/**
 * Emit system notification
 */
const emitSystemNotification = async (io, userId, title, content) => {
    try {
        await notificationService.createNotification(
            userId,
            'system',
            title,
            content,
            null,
            null
        )

        io.to(`user:${userId}`).emit('system_notification', {
            type: 'system',
            title: title,
            content: content,
        })
    } catch (error) {
        console.error('Error emitting system notification:', error)
    }
}

/**
 * Emit friend removed notification
 */
const emitFriendRemoved = async (io, removerId, removedUserId) => {
    try {
        const removerUser = await userRepository.findById(removerId)
        
        // Notify the person whose friendship was removed
        io.to(`user:${removedUserId}`).emit('friend_removed', {
            type: 'friend_removed',
            title: 'Bạn đã bị hủy kết bạn',
            content: `${removerUser?.full_name || removerUser?.username} đã hủy kết bạn với bạn`,
            from_user: {
                user_id: removerUser.user_id,
                username: removerUser.username,
                full_name: removerUser.full_name,
                avatar_url: removerUser.avatar_url,
            },
        })
        
        // Notify the person who removed the friend
        io.to(`user:${removerId}`).emit('friend_removed', {
            type: 'friend_removed',
            title: 'Hủy kết bạn thành công',
            content: `Đã hủy kết bạn với ${removerUser?.full_name || removerUser?.username}`,
            from_user: {
                user_id: removerId,
                username: removerUser.username,
                full_name: removerUser.full_name,
                avatar_url: removerUser.avatar_url,
            },
        })
    } catch (error) {
        console.error('Error emitting friend removed:', error)
    }
}

module.exports = {
    emitFriendRequest,
    emitFriendAccepted,
    emitFriendRejected,
    emitNewMessage,
    emitMessageReaction,
    emitMention,
    emitGroupInvite,
    emitSystemNotification,
    emitFriendRemoved,
}
