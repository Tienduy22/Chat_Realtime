const jwt = require("../utils/jwt");

// Map toàn cục để lưu timer offline theo user_id
const offlineTimers = new Map();

// Map toàn cục để lưu online users và lastSeen (user_id → timestamp)
const onlineUsers = new Map(); // Ví dụ: user_id → Date.now()

const messageHandlers = (io, socket) => {
    console.log("✅ User connected:", socket.id);

    // 1. AUTHENTICATE SOCKET
    const token = socket.request.cookies.access_token;
    let user_id;

    try {
        const decode = jwt.verifyAccessToken(token);
        user_id = decode.user_id;
        socket.user_id = user_id;

        // Nếu reconnect nhanh, hủy timer offline cũ
        if (offlineTimers.has(user_id)) {
            clearTimeout(offlineTimers.get(user_id));
            offlineTimers.delete(user_id);
            console.log(`✅ Reconnect nhanh - hủy offline cho user ${user_id}`);
        }

        // Cập nhật online và lastSeen
        onlineUsers.set(user_id, Date.now());

        // Emit online và activity cho TẤT CẢ
        io.emit("user_online", { user_id: user_id });
        io.emit("user_activity", { user_id: user_id });
        console.log(`🟢 User online & activity emitted: ${user_id}`);

        // Emit DANH SÁCH ONLINE HIỆN TẠI cho socket MỚI NÀY
        const initialOnlineList = Array.from(onlineUsers.keys()).map((uid) => ({
            user_id: uid,
            last_seen: Date.now(), 
        }));

        socket.emit("initial_online_users", initialOnlineList);
        console.log(
            `Sent initial online users:`,
            initialOnlineList.map((u) => u.user_id)
        );
    } catch (error) {
        console.error("Socket authentication failed:", error.message);
        socket.disconnect();
        return;
    }

    // 2. JOIN USER ROOM
    socket.join(`user:${user_id}`);

    // 3. JOIN CONVERSATION ROOM
    socket.on("join_conversation", (conversation_id) => {
        socket.join(`conversation:${conversation_id}`);
        console.log(`User ${user_id} joined conversation:${conversation_id}`);

        // Cập nhật activity
        onlineUsers.set(user_id, Date.now());
        io.emit("user_activity", { user_id: user_id });

        socket.to(`conversation:${conversation_id}`).emit("user_joined", {
            conversation_id: conversation_id,
            user_id: user_id,
        });
    });

    // 4. LEAVE CONVERSATION ROOM
    socket.on("leave_conversation", (conversation_id) => {
        socket.leave(`conversation:${conversation_id}`);
        socket.to(`conversation:${conversation_id}`).emit("user_leaved", {
            conversation_id: conversation_id,
            user_id: user_id,
        });
    });

    // 5. TYPING INDICATOR
    socket.on("typing_start", (conversation_id) => {
        // Cập nhật activity
        onlineUsers.set(user_id, Date.now());
        io.emit("user_activity", { user_id: user_id });

        socket.to(`conversation:${conversation_id}`).emit("user_typing", {
            conversation_id: conversation_id,
            user_id: user_id,
            is_typing: true,
        });
    });

    socket.on("typing_stop", (conversation_id) => {
        socket.to(`conversation:${conversation_id}`).emit("user_typing", {
            conversation_id: conversation_id,
            user_id: user_id,
            is_typing: false,
        });
    });

    // 6. USER ACTIVITY (heartbeat từ client)
    socket.on("user_activity", () => {
        onlineUsers.set(user_id, Date.now());
        io.emit("user_activity", { user_id: user_id });
    });

    // 7. DISCONNECT - Chờ 8 giây trước khi offline
    socket.on("disconnect", (reason) => {
        console.log(
            `⚠️ Socket disconnected (user ${user_id}) - Reason: ${reason}. Waiting 8s before offline...`
        );

        if (user_id) {
            const timer = setTimeout(() => {
                onlineUsers.delete(user_id);
                io.emit("user_offline", { user_id: user_id });
                console.log(`🔴 User offline emitted sau 8s: ${user_id}`);
                offlineTimers.delete(user_id);
            }, 8000);

            offlineTimers.set(user_id, timer);
        }
    });
};

module.exports = messageHandlers;
