// src/pages/chat/ConversationDetail.jsx
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { format, isToday, isYesterday } from "date-fns";
import Avatar from "../../components/common/Avatar/Avatar";
import ConversationInfo from "./ConversationInfo";
import { fullMessage } from "../../services/message.service";
import { listConversation } from "../../services/conversation.service";
import { useSelector } from "react-redux";
import MessageInput from "../../components/chat/MessageInput/MessageInput";
import MessageItem from "../../components/chat/MessageItem/MessageItem";
import { useSocket } from "../../context/SocketContext";
import { useParams } from "react-router-dom";

export default function ConversationDetail() {
    const { conversationId: convIdParam } = useParams();
    const conversationId = Number(convIdParam);

    const { socket, isConnected } = useSocket();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messageInput, setMessageInput] = useState("");

    const [typingUsers, setTypingUsers] = useState(new Set());

    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const messagesContainerRef = useRef(null);
    const isFirstLoadRef = useRef(true);
    const previousScrollHeightRef = useRef(0);

    const user = useSelector((state) => state.user);
    const currentUserId = user?.user_id;

    const LIMIT = 20;

    const scrollToBottom = (immediate = false) => {
        if (messagesContainerRef.current) {
            if (immediate) {
                messagesContainerRef.current.scrollTop =
                    messagesContainerRef.current.scrollHeight;
            } else {
                messagesContainerRef.current.scrollTo({
                    top: messagesContainerRef.current.scrollHeight,
                    behavior: "smooth",
                });
            }
        }
    };

    const maintainScrollPosition = () => {
        if (messagesContainerRef.current) {
            const newScrollHeight = messagesContainerRef.current.scrollHeight;
            const scrollDiff =
                newScrollHeight - previousScrollHeightRef.current;
            messagesContainerRef.current.scrollTop += scrollDiff;
        }
    };

    useEffect(() => {
        isFirstLoadRef.current = true;
        setMessages([]);
        setLoading(true);
        setOffset(0);
        setHasMore(true);
        setLoadingMore(false);
        setTypingUsers(new Set());
    }, [convIdParam]);

    useEffect(() => {
        if (!socket || isNaN(conversationId)) return;

        socket.emit("join_conversation", conversationId);

        return () => {
            socket.emit("leave_conversation", conversationId);
        };
    }, [socket, conversationId]);

    // Realtime new message - Thay thế tin nhắn tạm (pending)
    useEffect(() => {
        if (!socket || isNaN(conversationId)) return;

        const handleNewMessage = (data) => {
            console.log("📨 Nhận tin nhắn mới qua socket:", data);

            try {
                if (
                    !data ||
                    !data.conversation_id ||
                    !data.messages ||
                    !Array.isArray(data.messages)
                ) {
                    console.error("❌ Invalid payload structure:", data);
                    return;
                }

                if (Number(data.conversation_id) !== conversationId) return;
                if (data.messages.length === 0) return;

                const senderInfo =
                    data.sender && data.sender.user_id
                        ? {
                              user_id: data.sender.user_id,
                              full_name: data.sender.full_name || "",
                              avatar_url: data.sender.avatar_url || "",
                          }
                        : null;

                const realMessages = data.messages
                    .filter((msg) => msg && msg.message_id)
                    .map((msg) => ({
                        ...msg,
                        sender: senderInfo || { user_id: msg.sender_id },
                        isPending: false,
                    }));

                setMessages((prev) => {
                    // Tìm các tin nhắn pending ở cuối danh sách
                    const pendingIndices = [];
                    for (let i = prev.length - 1; i >= 0; i--) {
                        if (prev[i].isPending) {
                            pendingIndices.unshift(i);
                        } else {
                            break;
                        }
                    }

                    if (
                        pendingIndices.length === realMessages.length &&
                        pendingIndices.length > 0
                    ) {
                        const updated = [...prev];
                        pendingIndices.forEach((idx, i) => {
                            updated[idx] = realMessages[i];
                        });

                        console.log(
                            "✅ Đã thay thế tin nhắn tạm bằng tin nhắn thật"
                        );
                        setTimeout(() => scrollToBottom(true), 100);
                        return updated;
                    } else {
                        const existingIds = new Set(
                            prev.map((m) => m.message_id)
                        );
                        const newMessages = realMessages.filter(
                            (msg) => !existingIds.has(msg.message_id)
                        );

                        if (newMessages.length === 0) return prev;

                        console.log(
                            `✅ Thêm ${newMessages.length} tin nhắn mới`
                        );
                        const updated = [...prev, ...newMessages];
                        setTimeout(() => scrollToBottom(true), 100);
                        return updated;
                    }
                });
            } catch (error) {
                console.error("❌ Lỗi xử lý new_message:", error);
            }
        };

        socket.on("new_message", handleNewMessage);
        return () => socket.off("new_message", handleNewMessage);
    }, [socket, conversationId]);

    // Typing indicator
    useEffect(() => {
        if (!socket || isNaN(conversationId)) return;

        const handleUserTyping = (data) => {
            console.log("📝 Nhận user_typing:", data);

            if (Number(data.conversation_id) !== conversationId) return;
            if (data.user_id === currentUserId) return;

            setTypingUsers((prev) => {
                const newSet = new Set(prev);
                if (data.is_typing) newSet.add(data.user_id);
                else newSet.delete(data.user_id);
                return newSet;
            });

            if (data.is_typing) {
                setTimeout(() => scrollToBottom(true), 100);
            }
        };

        socket.on("user_typing", handleUserTyping);
        return () => socket.off("user_typing", handleUserTyping);
    }, [socket, conversationId, currentUserId]);

    // Tự động scroll khi có tin nhắn mới hoặc ảnh load
    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom(true);
            const timer = setTimeout(() => scrollToBottom(true), 500);
            return () => clearTimeout(timer);
        }
    }, [messages]);

    // Lấy thông tin conversation
    useEffect(() => {
        const fetchConversationInfo = async () => {
            if (!conversationId) return;

            try {
                const response = await listConversation();
                if (response.success) {
                    const found = response.data.find(
                        (item) =>
                            item.conversation.conversation_id === conversationId
                    );

                    if (found) {
                        const conv = found.conversation;
                        let name, avatar;

                        if (conv.conversation_type === "group") {
                            name = conv.name || "Nhóm chat";
                            avatar = conv.avatar_url;
                        } else {
                            const otherParticipant =
                                conv.participants.find(
                                    (p) => p.user.user_id !== currentUserId
                                ) || conv.participants[0];
                            name =
                                otherParticipant?.user.full_name ||
                                "Người dùng ẩn danh";
                            avatar = otherParticipant?.user.avatar_url;
                        }

                        setCurrentConversation({
                            name,
                            avatar,
                            type: conv.conversation_type,
                            isOnline: true,
                        });
                    }
                }
            } catch (err) {
                console.error("Lỗi lấy thông tin conversation:", err);
            }
        };

        fetchConversationInfo();
    }, [conversationId, currentUserId]);

    // Load tin nhắn lần đầu
    useEffect(() => {
        const fetchMessages = async () => {
            if (!conversationId) return;

            try {
                setLoading(true);
                const response = await fullMessage({
                    conversation_id: conversationId,
                    limit: LIMIT,
                    offset: 0,
                });

                if (response.success) {
                    const newMessages = response.data.reverse();
                    setMessages(newMessages);
                    setHasMore(newMessages.length === LIMIT);
                } else {
                    setError("Không thể tải tin nhắn");
                }
            } catch (err) {
                setError("Lỗi kết nối server");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [conversationId]);

    const loadMoreMessages = async () => {
        if (loadingMore || !hasMore || loading) return;

        try {
            setLoadingMore(true);
            previousScrollHeightRef.current =
                messagesContainerRef.current?.scrollHeight || 0;

            const newOffset = offset + LIMIT;
            const response = await fullMessage({
                conversation_id: conversationId,
                limit: LIMIT,
                offset: newOffset,
            });

            if (response.success) {
                const olderMessages = response.data.reverse();
                if (olderMessages.length > 0) {
                    setMessages((prev) => [...olderMessages, ...prev]);
                    setOffset(newOffset);
                    setHasMore(olderMessages.length === LIMIT);
                    setTimeout(maintainScrollPosition, 50);
                } else {
                    setHasMore(false);
                }
            }
        } catch (err) {
            console.error("Lỗi load more:", err);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleScroll = () => {
        if (!messagesContainerRef.current) return;
        const { scrollTop } = messagesContainerRef.current;
        if (scrollTop < 100 && hasMore && !loadingMore) {
            loadMoreMessages();
        }
    };

    const formatMessageTime = (dateString) => {
        const date = new Date(dateString);
        if (isToday(date)) return format(date, "HH:mm");
        if (isYesterday(date)) return "Hôm qua";
        return format(date, "dd/MM/yyyy");
    };

    const renderReactions = (reactions) => {
        if (!reactions || reactions.length === 0) return null;

        const grouped = reactions.reduce((acc, r) => {
            acc[r.emoji] = (acc[r.emoji] || 0) + 1;
            return acc;
        }, {});

        return (
            <div className="flex gap-1 mt-1">
                {Object.entries(grouped).map(([emoji, count]) => (
                    <div
                        key={emoji}
                        className="bg-white border border-gray-300 px-2 py-0.5 rounded-full text-xs flex items-center gap-1 shadow-sm"
                    >
                        <span>{emoji}</span>
                        {count > 1 && (
                            <span className="text-gray-600">{count}</span>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const handleReaction = (messageId, emoji) => {
        setMessages((prev) =>
            prev.map((msg) =>
                msg.message_id === messageId
                    ? {
                          ...msg,
                          reactions: [
                              ...(msg.reactions || []),
                              {
                                  reaction_id: Date.now(),
                                  user_id: currentUserId,
                                  emoji,
                              },
                          ],
                      }
                    : msg
            )
        );
        setTimeout(() => scrollToBottom(true), 100);
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-500">
                Đang tải...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <main className="flex-1 flex flex-col bg-white h-full relative min-w-0">
            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="h-[72px] shrink-0 border-b border-gray-200 flex items-center justify-between px-6 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
                        <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
                            <Avatar
                                src={currentConversation?.avatar}
                                size="md"
                                status={
                                    currentConversation?.isOnline
                                        ? "online"
                                        : "offline"
                                }
                            />
                            <div>
                                <h3 className="text-slate-800 text-base font-bold leading-tight">
                                    {currentConversation?.name || "Đang tải..."}
                                </h3>
                                <p className="text-slate-500 text-xs font-medium">
                                    {currentConversation?.isOnline
                                        ? "Đang hoạt động"
                                        : "Offline"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {["search", "call", "videocam"].map((icon) => (
                                <button
                                    key={icon}
                                    className="size-10 rounded-lg hover:bg-gray-100 hover:text-[#135bec] transition-all flex items-center justify-center"
                                >
                                    <span className="material-symbols-outlined text-3xl text-slate-500">
                                        {icon}
                                    </span>
                                </button>
                            ))}
                            <div className="w-px h-6 bg-gray-200 mx-2" />
                            <button className="size-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl">
                                    dock_to_left
                                </span>
                            </button>
                        </div>
                    </header>

                    <div
                        ref={messagesContainerRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-slate-50/30"
                    >
                        {loadingMore && (
                            <div className="flex justify-center py-4">
                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                    <span>Đang tải thêm tin nhắn...</span>
                                </div>
                            </div>
                        )}

                        {!hasMore && messages.length > LIMIT && (
                            <div className="flex justify-center py-4">
                                <span className="text-gray-400 text-sm">
                                    Đây là tin nhắn đầu tiên
                                </span>
                            </div>
                        )}

                        {messages.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò
                                chuyện!
                            </div>
                        ) : (
                            messages.map((msg, index) => {
                                const isMe = msg.sender_id === currentUserId;
                                const showAvatar =
                                    index === messages.length - 1 ||
                                    messages[index + 1]?.sender_id !==
                                        msg.sender_id;

                                return (
                                    <MessageItem
                                        key={
                                            msg.message_id || `pending-${index}`
                                        }
                                        msg={msg}
                                        index={index}
                                        messages={messages}
                                        currentUserId={currentUserId}
                                        isMe={isMe}
                                        showAvatar={showAvatar}
                                        formatMessageTime={formatMessageTime}
                                        renderReactions={renderReactions}
                                        handleReaction={handleReaction}
                                    />
                                );
                            })
                        )}

                        {typingUsers.size > 0 && (
                            <div className="flex items-center gap-3 py-2 px-4 animate-fade-in">
                                <Avatar
                                    src={currentConversation?.avatar}
                                    size="sm"
                                />
                                <div className="bg-gray-200 rounded-3xl px-4 py-3 flex items-center gap-1">
                                    <span
                                        className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                                        style={{ animationDelay: "0ms" }}
                                    ></span>
                                    <span
                                        className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                                        style={{ animationDelay: "150ms" }}
                                    ></span>
                                    <span
                                        className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                                        style={{ animationDelay: "300ms" }}
                                    ></span>
                                </div>
                                <p className="text-sm text-gray-500 italic">
                                    {typingUsers.size === 1
                                        ? "Đang gõ..."
                                        : "Có người đang gõ..."}
                                </p>
                            </div>
                        )}
                    </div>

                    <MessageInput
                        currentUserId={currentUserId}
                        conversationId={conversationId}
                        messageInput={messageInput}
                        setMessageInput={setMessageInput}
                        onSendMessage={(optimisticMsgs) => {
                            setMessages((prev) => [...prev, ...optimisticMsgs]);
                            setTimeout(() => scrollToBottom(true), 100);
                        }}
                        socket={socket}
                    />
                </div>

                <div className="hidden xl:flex w-[300px] min-w-[300px] border-l border-gray-200 bg-white flex-col">
                    <ConversationInfo />
                </div>
            </div>
        </main>
    );
}
