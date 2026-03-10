import React, { useState, useEffect, useRef } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { Info } from "lucide-react";
import Avatar from "../../components/common/Avatar/Avatar";
import ConversationInfo from "./ConversationInfo";
import { fullMessage } from "../../services/message.service";
import { listConversation } from "../../services/conversation.service";
import { useSelector } from "react-redux";
import MessageInput from "../../components/chat/MessageInput";
import MessageItem from "../../components/chat/MessageItem";
import { useSocket } from "../../context/SocketContext";
import { useNavigate, useParams } from "react-router-dom";
import { useMessageSocket } from "../../hooks/useMessageSocket";
import ConversationList from "../../components/layout/ConversationList/ConversationList";

export default function ConversationDetail() {
    const { conversationId: convIdParam } = useParams();
    const conversationId = Number(convIdParam);

    const navigate = useNavigate();
    const { socket } = useSocket();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messageInput, setMessageInput] = useState("");

    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const messagesContainerRef = useRef(null);
    const previousScrollHeightRef = useRef(0);
    const previousMessagesLengthRef = useRef(0);

    const messageCache = useRef({});

    const user = useSelector((state) => state.user);
    const currentUserId = user?.user_id;

    const LIMIT = 20;

    useMessageSocket(socket, conversationId, currentUserId, setMessages);

    const scrollToBottom = (immediate = false) => {
        if (!messagesContainerRef.current) return;

        if (immediate) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight;
        } else {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    const maintainScrollPosition = () => {
        if (!messagesContainerRef.current) return;

        const newScrollHeight = messagesContainerRef.current.scrollHeight;
        const scrollDiff = newScrollHeight - previousScrollHeightRef.current;

        messagesContainerRef.current.scrollTop += scrollDiff;
    };

    useEffect(() => {
        const redirectToLatestConversation = async () => {
            if (convIdParam) return;

            try {
                const response = await listConversation();

                if (response.success && response.data.length > 0) {
                    const latest =
                        response.data[0].conversation.conversation_id;

                    navigate(`/chat/${latest}`, { replace: true });
                }
            } catch (err) {
                console.error(err);
            }
        };

        redirectToLatestConversation();
    }, [convIdParam, navigate]);

    useEffect(() => {
        if (!socket || isNaN(conversationId)) return;

        socket.emit("join_conversation", conversationId);

        return () => socket.emit("leave_conversation", conversationId);
    }, [socket, conversationId]);

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

                    if (!found) return;

                    const conv = found.conversation;

                    let name, avatar, otherUserId;

                    if (conv.conversation_type === "group") {
                        name = conv.name || "Nhóm chat";
                        avatar = conv.avatar_url;
                    } else {
                        const other =
                            conv.participants.find(
                                (p) => p.user.user_id !== currentUserId
                            ) || conv.participants[0];

                        name = other?.user.full_name || "Người dùng";
                        avatar = other?.user.avatar_url;
                        otherUserId = other?.user.user_id;
                    }

                    setCurrentConversation({
                        name,
                        avatar,
                        otherUserId,
                        type: conv.conversation_type,
                    });
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchConversationInfo();
    }, [conversationId, currentUserId]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!conversationId) return;

            if (messageCache.current[conversationId]) {
                setMessages(messageCache.current[conversationId]);
                return;
            }

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

                    messageCache.current[conversationId] = newMessages;

                    setHasMore(newMessages.length === LIMIT);
                } else {
                    setError("Không thể tải tin nhắn");
                }
            } catch {
                setError("Lỗi kết nối server");
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [conversationId]);

    const loadMoreMessages = async () => {
        if (loadingMore || !hasMore) return;

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
                    setMessages((prev) => {
                        const merged = [...olderMessages, ...prev];
                        messageCache.current[conversationId] = merged;
                        return merged;
                    });

                    setOffset(newOffset);
                    setHasMore(olderMessages.length === LIMIT);

                    setTimeout(maintainScrollPosition, 50);
                } else {
                    setHasMore(false);
                }
            }
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

    useEffect(() => {
        if (messages.length > previousMessagesLengthRef.current) {
            scrollToBottom(true);

            const timer = setTimeout(() => scrollToBottom(true), 400);

            previousMessagesLengthRef.current = messages.length;

            return () => clearTimeout(timer);
        }

        previousMessagesLengthRef.current = messages.length;
    }, [messages]);

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="h-screen flex">
            <ConversationList />

            <div className="flex-1 flex overflow-hidden relative">

                {/* CHAT */}
                <main
                    className={`flex-1 flex flex-col bg-white transition-[margin] duration-300 ${
                        isInfoOpen ? "mr-[300px]" : ""
                    }`}
                >

                    {/* HEADER */}
                    <header className="h-[72px] border-b flex items-center justify-between px-6">
                        <div className="flex items-center gap-4">
                            <Avatar src={currentConversation?.avatar} />
                            <h3 className="font-bold">
                                {currentConversation?.name || "Đang tải..."}
                            </h3>
                        </div>

                        <button
                            onClick={() => setIsInfoOpen(!isInfoOpen)}
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <Info size={20} />
                        </button>
                    </header>

                    {/* MESSAGES */}
                    <div
                        ref={messagesContainerRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-gray-50"
                    >
                        {loading && messages.length === 0 && (
                            <div className="text-center text-gray-500">
                                Đang tải tin nhắn...
                            </div>
                        )}

                        {messages.map((msg, index) => {
                            const isMe = msg.sender_id === currentUserId;

                            const showAvatar =
                                index === messages.length - 1 ||
                                messages[index + 1]?.sender_id !== msg.sender_id;

                            return (
                                <MessageItem
                                    key={msg.message_id || `pending-${index}`}
                                    msg={msg}
                                    messages={messages}
                                    setMessages={setMessages}
                                    currentUserId={currentUserId}
                                    isMe={isMe}
                                    showAvatar={showAvatar}
                                    formatMessageTime={formatMessageTime}
                                />
                            );
                        })}
                    </div>

                    <MessageInput
                        currentUserId={currentUserId}
                        conversationId={conversationId}
                        messageInput={messageInput}
                        setMessageInput={setMessageInput}
                        socket={socket}
                        onSendMessage={(optimisticMsgs) => {
                            setMessages((prev) => {
                                const updated = [...prev, ...optimisticMsgs];
                                messageCache.current[conversationId] = updated;
                                return updated;
                            });

                            setTimeout(() => scrollToBottom(true), 100);
                        }}
                    />
                </main>

                {/* INFO PANEL */}
                <aside
                    className={`absolute right-0 top-0 h-full w-[300px] border-l bg-white flex flex-col
                    transition-transform duration-300 z-30
                    ${isInfoOpen ? "translate-x-0" : "translate-x-full"}`}
                >
                    <ConversationInfo onClose={() => setIsInfoOpen(false)} />
                </aside>

                {isInfoOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 z-20 xl:hidden"
                        onClick={() => setIsInfoOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}

