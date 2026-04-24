import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { listConversation } from "../../../services/conversation.service";
import { markAsRead } from "../../../services/message.service"; // ← import API mark as read
import { useSocket } from "../../../context/SocketContext";

const ConversationList = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchMode, setSearchMode] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'unread' | 'group'

    const { socket, onlineUsers } = useSocket();
    const currentUserId = useSelector((state) => state.user?.user_id);

    const navigate = useNavigate();
    const location = useLocation();

    const currentConversationId = location.pathname.startsWith("/chat/")
        ? location.pathname.split("/chat/")[1]
        : null;

    // Fetch danh sách ban đầu
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await listConversation();
                if (response.success) {
                    setConversations(response.data);
                } else {
                    setError("Không thể tải danh sách cuộc trò chuyện");
                }
            } catch (err) {
                setError("Lỗi kết nối đến server");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);

    // Realtime: lắng nghe new_message
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (data) => {
            if (!data.conversation_id || !data.messages?.length) return;

            const convId = Number(data.conversation_id);

            setConversations((prev) =>
                prev.map((item) => {
                    if (Number(item.conversation.conversation_id) !== convId) {
                        return item;
                    }

                    const newMessages = data.messages;
                    const lastNewMsg = newMessages[0];

                    const updatedMessages = [
                        {
                            ...lastNewMsg,
                            sender: data.sender || { user_id: lastNewMsg.sender_id },
                            created_at: lastNewMsg.created_at || new Date().toISOString(),
                        },
                        ...item.conversation.messages.filter(
                            (m) => m.message_id !== lastNewMsg.message_id
                        ),
                    ];

                    let newUnread = item.unread_count || 0;
                    const isOwnMessage = lastNewMsg.sender_id === currentUserId;

                    if (
                        convId !== Number(currentConversationId) &&
                        !isOwnMessage
                    ) {
                        newUnread += 1; // hoặc + newMessages.length nếu batch
                    }

                    return {
                        ...item,
                        conversation: {
                            ...item.conversation,
                            messages: updatedMessages,
                        },
                        unread_count: newUnread,
                    };
                })
            );
        };

        const handleSeemMessage = (data) => {
            const convId = Number(data.conversation_id);
            if (convId !== Number(currentConversationId)) return;

            // Nếu chính mình mark read → reset unread local
            if (Number(data.user_id) === currentUserId) {
                setConversations((prev) =>
                    prev.map((item) =>
                        Number(item.conversation.conversation_id) === convId
                            ? { ...item, unread_count: 0 }
                            : item
                    )
                );
            }
        };

        socket.on("new_message", handleNewMessage);
        socket.on("seem_message", handleSeemMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
            socket.off("seem_message", handleSeemMessage);
        };
    }, [socket, currentConversationId, currentUserId]);

    const formatTime = (dateString) => {
        if (!dateString) return "";
        try {
            return formatDistanceToNow(new Date(dateString), {
                addSuffix: true,
                locale: vi,
            });
        } catch {
            return "Vừa xong";
        }
    };

    const getLastMessagePreview = (messages, participants) => {
        if (!messages || messages.length === 0) return "Chưa có tin nhắn";

        const lastMsg = messages[0];
        const sender = lastMsg.sender;

        let senderName = "Ai đó";
        if (sender?.full_name) {
            senderName = sender.full_name;
        } else if (participants) {
            const found = participants.find(
                (p) => p.user.user_id === lastMsg.sender_id
            );
            if (found) senderName = found.user.full_name;
        }

        switch (lastMsg.message_type) {
            case "text":
                return lastMsg.content || "Đã gửi một tin nhắn";
            case "image":
                return `${senderName} đã gửi 1 ảnh`;
            case "video":
                return `${senderName} đã gửi 1 video`;
            case "document":
                return `${senderName} đã gửi 1 tài liệu`;
            default:
                return `${senderName} đã gửi một tệp`;
        }
    };

    const getConversationDisplay = (conv) => {
        if (conv.conversation_type === "group") {
            return {
                name: conv.name || "Nhóm chat",
                avatar: conv.avatar_url,
                isGroup: true,
                otherUserId: null,
            };
        }

        if (!conv.participants || conv.participants.length === 0) {
            return {
                name: "Người dùng ẩn danh",
                avatar: null,
                isGroup: false,
                otherUserId: null,
            };
        }

        const otherUser =
            conv.participants.find(
                (p) => p.user.user_id !== conv.current_user_id
            )?.user || conv.participants[0].user;

        return {
            name: otherUser.full_name || "Người dùng ẩn danh",
            avatar: otherUser.avatar_url,
            isGroup: false,
            otherUserId: otherUser.user_id,
        };
    };

    const handleConversationClick = async (conversationId) => {
        navigate(`/chat/${conversationId}`);
        setSearchMode(false);
        setSearchText("");

        // Reset local ngay lập tức (optimistic UI)
        setConversations((prev) =>
            prev.map((item) =>
                Number(item.conversation.conversation_id) === Number(conversationId)
                    ? { ...item, unread_count: 0 }
                    : item
            )
        );

        try {
            // Tìm conversation để lấy last message id
            const selectedConv = conversations.find(
                (item) => Number(item.conversation.conversation_id) === Number(conversationId)
            );

            if (selectedConv?.conversation?.messages?.length > 0) {
                const lastMessageId = selectedConv.conversation.messages[0].message_id;

                // Gọi API mark as read
                await markAsRead(
                    conversationId,
                    [lastMessageId], // backend dùng message_ids[0]
                    currentUserId
                );

                console.log(`Đã mark as read conversation ${conversationId}`);
            }
        } catch (err) {
            console.error("Mark as read thất bại:", err);
            // Không rollback vì UI đã reset, backend sẽ xử lý khi fetch lại
        }
    };

    const handleCloseSearch = () => {
        setSearchMode(false);
        setSearchText("");
    };

    if (loading) {
        return (
            <aside className="w-80 bg-gray-50 dark:bg-sidebar-panel-dark border-r border-gray-200 dark:border-gray-800 flex flex-col hidden lg:flex">
                <div className="p-6 text-center text-gray-500">Đang tải...</div>
            </aside>
        );
    }

    if (error) {
        return (
            <aside className="w-80 bg-gray-50 dark:bg-sidebar-panel-dark border-r border-gray-200 dark:border-gray-800 flex flex-col hidden lg:flex">
                <div className="p-6 text-center text-red-500">{error}</div>
            </aside>
        );
    }

    // Lọc theo search và filter
    let filteredConversations = conversations;

    if (searchText.trim()) {
        filteredConversations = conversations.filter((item) => {
            const conv = item.conversation;
            const display = getConversationDisplay(conv);
            return display.name.toLowerCase().includes(searchText.toLowerCase());
        });
    }

    if (!searchMode) {
        if (activeFilter === "unread") {
            filteredConversations = filteredConversations.filter(
                (item) => item.unread_count > 0
            );
        } else if (activeFilter === "group") {
            filteredConversations = filteredConversations.filter(
                (item) => item.conversation.conversation_type === "group"
            );
        }
    }

    const displayList = filteredConversations.filter(
        (item) =>
            item.conversation?.messages &&
            item.conversation.messages.length > 0
    );

    return (
        <aside className="w-80 bg-gray-50 dark:bg-sidebar-panel-dark border-r border-gray-200 dark:border-gray-800 flex flex-col hidden lg:flex flex-shrink-0">
            <div className="p-6 pb-2">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Tin nhắn
                    </h2>
                </div>

                <div className="relative mb-6 flex items-center gap-2">
                    <div className="relative flex-1">
                        <span className="material-icons absolute left-3 top-2.5 text-gray-400 text-lg">
                            search
                        </span>
                        <input
                            className="w-full bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:text-gray-200 placeholder-gray-400 transition-all"
                            placeholder="Tìm kiếm cuộc trò chuyện..."
                            type="text"
                            value={searchText}
                            onFocus={() => setSearchMode(true)}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>

                    {searchMode && (
                        <button
                            onClick={handleCloseSearch}
                            className="text-sm text-blue-600 font-medium shrink-0"
                        >
                            Đóng
                        </button>
                    )}
                </div>

                {!searchMode && (
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setActiveFilter("all")}
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                                activeFilter === "all"
                                    ? "bg-primary text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                            }`}
                        >
                            Tất cả
                        </button>
                        <button
                            onClick={() => setActiveFilter("unread")}
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                                activeFilter === "unread"
                                    ? "bg-primary text-white"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white"
                            }`}
                        >
                            Chưa đọc
                        </button>
                        <button
                            onClick={() => setActiveFilter("group")}
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                                activeFilter === "group"
                                    ? "bg-primary text-white"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white"
                            }`}
                        >
                            Nhóm
                        </button>
                    </div>
                )}

                {searchMode && !searchText.trim() && (
                    <p className="text-xs text-gray-400 mb-3">
                        Tất cả cuộc trò chuyện
                    </p>
                )}

                {searchMode && searchText.trim() && (
                    <p className="text-xs text-gray-400 mb-3">
                        {filteredConversations.length} kết quả cho &quot;{searchText}&quot;
                    </p>
                )}
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                {displayList.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm py-8">
                        {searchMode
                            ? "Không tìm thấy cuộc trò chuyện nào"
                            : activeFilter === "unread"
                              ? "Không có tin nhắn chưa đọc"
                              : activeFilter === "group"
                                ? "Bạn chưa tham gia nhóm nào"
                                : "Chưa có cuộc trò chuyện nào"}
                    </div>
                ) : (
                    displayList.map((item) => {
                        const conv = item.conversation;
                        const display = getConversationDisplay(conv);
                        const preview = getLastMessagePreview(
                            conv.messages,
                            conv.participants
                        );
                        const time =
                            conv.messages?.length > 0
                                ? formatTime(conv.messages[0].created_at)
                                : "";

                        const hasUnread = item.unread_count > 0;
                        const isActive =
                            conv.conversation_id.toString() === currentConversationId;
                        const isOnline =
                            !display.isGroup &&
                            onlineUsers.has(display.otherUserId);

                        return (
                            <div
                                key={item.participant_id}
                                onClick={() =>
                                    handleConversationClick(conv.conversation_id)
                                }
                                className={`group p-3 rounded-xl cursor-pointer transition-all relative
                                    ${
                                        isActive
                                            ? "bg-primary/10 border border-primary/30 shadow-sm"
                                            : hasUnread
                                              ? "bg-white dark:bg-gray-800/60 shadow-sm border border-gray-100 dark:border-gray-700/50"
                                              : "hover:bg-white dark:hover:bg-gray-800/40 border border-transparent hover:border-gray-100 dark:hover:border-gray-700/30"
                                    }`}
                            >
                                <div className="flex gap-3">
                                    <div className="relative flex-shrink-0">
                                        {display.avatar ? (
                                            <img
                                                alt={display.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                                src={display.avatar}
                                            />
                                        ) : display.isGroup ? (
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700">
                                                <span className="material-icons text-base text-gray-600 dark:text-gray-300">
                                                    groups
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm">
                                                {display.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}

                                        {!display.isGroup && (
                                            <span
                                                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-900 shadow-sm
                                                    ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
                                            />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <h3
                                                className={`text-sm font-${
                                                    hasUnread || isActive ? "semibold" : "medium"
                                                } 
                                                    ${isActive ? "text-primary" : "text-gray-800 dark:text-gray-200"} truncate`}
                                            >
                                                {display.name}
                                            </h3>

                                            {hasUnread && (
                                                <span className="bg-primary text-white text-[10px] h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center shrink-0">
                                                    {item.unread_count}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-start justify-between gap-2">
                                            <p
                                                className={`text-xs truncate flex-1 ${
                                                    hasUnread || isActive
                                                        ? "text-gray-900 dark:text-white font-medium"
                                                        : "text-gray-500 dark:text-gray-500"
                                                }`}
                                            >
                                                {preview.length > 55
                                                    ? `${preview.substring(0, 52)}…`
                                                    : preview}
                                            </p>

                                            {time && (
                                                <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap pl-1">
                                                    {time}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </aside>
    );
};

export default ConversationList;