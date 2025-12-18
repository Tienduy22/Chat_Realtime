const jwt = require('../utils/jwt')

const messageHandlers = (io, socket) => {
    console.log('✅ User connected:', socket.id);

    // 1. AUTHENTICATE SOCKET
    const token = socket.request.cookies.access_token
    let user_id     

    try {
        const decode = jwt.verifyAccessToken(token)
        user_id = decode.user_id
        socket.user_id = user_id
    } catch (error) {
        console.error('Socket authentication failed:', error.message);
        socket.disconnect();
        return;
    }

    // 2. JOIN USER ROOM
    socket.join(`user:${user_id}`)

    // 3. JOIN CONVERSATION ROOM
    socket.on('join_conversation', (conversation_id) => {
        socket.join(`conversation:${conversation_id}`)
        console.log(`User ${user_id} joined conversation:${conversation_id}`);
        socket.to(`conversation:${conversation_id}`).emit('user_joined', {
            conversation_id: conversation_id,
            user_id: user_id
        })
    })
    
    // 4. LEAVE CONVERSATION ROOM
    socket.on('leave_conversation', (conversation_id) => {
        socket.leave(`conversation:${conversation_id}`)
        socket.to(`conversation:${conversation_id}`).emit('user_leaved', {
            conversation_id: conversation_id,
            user_id: user_id
        })
    })

    // 5. TYPING INDICATOR
    socket.on('typing_start', (conversation_id) => {
        socket.to(`conversation:${conversation_id}`).emit('user_typing', {
            conversation_id: conversation_id,
            user_id: user_id,
            is_typing: true
        })
    })

    socket.on('typing_stop', (conversation_id) => {
        socket.to(`conversation:${conversation_id}`).emit('user_typing', {
            conversation_id: conversation_id,
            user_id: user_id,
            is_typing: false
        })
    })

    // 8. DISCONNECT
    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
    });
}

module.exports = messageHandlers;

