
import React, { useState, useEffect } from "react";
import Avatar from "../../common/Avatar/Avatar";
import { useSocket } from "../../../context/SocketContext";
import { reactionMessage } from "../../../services/message.service";

const QUICK_EMOJIS = ["❤️", "😂", "😮", "👍", "😢", "👎"];

const MessageItem = ({
    msg,
    index,
    messages,
    currentUserId,
    isMe,
    showAvatar,
    formatMessageTime,
}) => {
    const { socket } = useSocket();

    const [showQuickReaction, setShowQuickReaction] = useState(false);
    const [localReactions, setLocalReactions] = useState(msg.reactions || []);

    // Đồng bộ reactions từ props → state local (khi message thay đổi từ server)
    useEffect(() => {
        setLocalReactions(msg.reactions || []);
    }, [msg.reactions]);

    const hasText = msg.content && msg.content.trim() !== "";
    const hasAttachment = msg.attachments && msg.attachments.length > 0;

    const handleAddReaction = async (emoji) => {
        if (!socket || !msg.message_id) return;

        // Optimistic update ngay lập tức
        setLocalReactions((prev) => {
            // Kiểm tra xem user đã react emoji này chưa
            const alreadyReacted = prev.some(
                (r) => r.user_id === currentUserId && r.emoji === emoji,
            );

            if (alreadyReacted) {
                // Nếu đã react → toggle (bỏ reaction)
                return prev.filter(
                    (r) => !(r.user_id === currentUserId && r.emoji === emoji),
                );
            } else {
                // Thêm reaction mới (optimistic)
                return [
                    ...prev,
                    {
                        reaction_id: `temp-${Date.now()}`,
                        user_id: currentUserId,
                        emoji,
                    },
                ];
            }
        });

        try {
            const response = await reactionMessage(
                msg.conversation_id,
                currentUserId,
                msg.message_id,
                emoji,
            );

            if (response.success && response.data?.reactions) {
                setLocalReactions(response.data.reactions);
            }
        } catch (error) {
            console.error("Lỗi reaction:", error);
            setLocalReactions(msg.reactions || []);
        }

        setShowQuickReaction(false);
    };

    const renderReactions = () => {
        if (!localReactions || localReactions.length === 0) return null;

        const grouped = localReactions.reduce((acc, r) => {
            acc[r.emoji] = (acc[r.emoji] || 0) + 1;
            return acc;
        }, {});

        return (
            <div className="flex gap-1 mt-1 flex-wrap">
                {Object.entries(grouped).map(([emoji, count]) => (
                    <div
                        key={emoji}
                        className="bg-white border border-gray-300 px-2 py-0.5 rounded-full text-xs flex items-center gap-1 shadow-sm hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleAddReaction(emoji)} // cho phép click để toggle
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

    const renderAttachment = (attachment) => {
        const url = attachment.file_url;
        const name = attachment.file_name || "file";
        const isImage =
            /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url) ||
            url.startsWith("blob:");
        const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(url);

        if (isImage) {
            return (
                <img
                    src={url}
                    alt={name}
                    className="max-w-sm w-full rounded-lg shadow-md object-contain"
                    style={{ maxHeight: "500px" }}
                    loading="lazy"
                />
            );
        }
        if (isVideo) {
            return (
                <video
                    controls
                    className="max-w-sm w-full rounded-lg shadow-md bg-black"
                    style={{ maxHeight: "400px" }}
                >
                    <source src={url} type="video/mp4" />
                </video>
            );
        }
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg hover:bg-gray-200"
            >
                <span className="material-symbols-outlined text-5xl text-gray-600">
                    description
                </span>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{name}</p>
                    <p className="text-xs text-gray-500">Nhấn để tải xuống</p>
                </div>
            </a>
        );
    };

    return (
        <div
            className={`flex gap-4 max-w-[80%] ${isMe ? "self-end flex-row-reverse" : ""}`}
            onMouseEnter={() => setShowQuickReaction(true)}
            onMouseLeave={() => setShowQuickReaction(false)}
        >
            {showAvatar ? (
                <Avatar src={msg.sender?.avatar_url} size="sm" />
            ) : (
                <div className="w-10 shrink-0" />
            )}

            <div
                className={`flex flex-col gap-1 ${isMe ? "items-end" : ""} relative`}
            >
                <div
                    className={`flex items-baseline gap-2 ${isMe ? "flex-row-reverse" : ""}`}
                >
                    <span className="text-slate-800 text-sm font-bold">
                        {isMe ? "Bạn" : msg.sender?.full_name || "Người dùng"}
                    </span>
                    <span className="text-slate-500 text-[10px]">
                        {formatMessageTime(msg.created_at)}
                    </span>
                </div>

                <div className="flex flex-col gap-2 relative">
                    {/* Quick reaction bar */}
                    {!msg.isPending && showQuickReaction && (
                        <div
                            className={`absolute ${isMe ? "-top-12 right-0" : "-top-12 left-0"} 
                         flex items-center gap-1.5 bg-white rounded-full shadow-xl px-3 py-2 
                         border border-gray-200 z-20 animate-fade-in`}
                        >
                            {QUICK_EMOJIS.map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => handleAddReaction(emoji)}
                                    className="text-2xl hover:scale-125 transition-transform duration-150 p-1"
                                    title="React"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Nội dung tin nhắn */}
                    {hasText && (
                        <div
                            className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm max-w-md ${
                                isMe
                                    ? "bg-[#135bec] text-white rounded-tr-none shadow-[#135bec]/20"
                                    : "bg-white border border-gray-200 text-slate-800 rounded-tl-none"
                            }`}
                        >
                            {msg.content}
                        </div>
                    )}

                    {/* Attachments */}
                    {hasAttachment &&
                        msg.attachments.map((att, i) => (
                            <div key={i} className="max-w-sm mt-1.5">
                                {renderAttachment(att)}
                            </div>
                        ))}

                    {/* Hiển thị reactions */}
                    {renderReactions()}

                    {/* Pending indicator */}
                    {msg.isPending && (
                        <div
                            className={`absolute -bottom-5 ${isMe ? "right-0" : "left-0"} flex items-center gap-1.5 text-xs text-gray-500`}
                        >
                            <div className="w-3 h-3 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin" />
                            <span>Đang gửi...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageItem;
