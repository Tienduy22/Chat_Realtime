// src/components/chat/MessageItem.jsx
import React, { useState } from "react";
import Avatar from "../../common/Avatar/Avatar";

const MessageItem = ({
    msg,
    index,
    messages,
    currentUserId,
    isMe,
    showAvatar,
    formatMessageTime,
    renderReactions,
    handleReaction,
}) => {
    const [showQuickReaction, setShowQuickReaction] = useState(false);

    const hasText = msg.content && msg.content.trim() !== "";
    const hasAttachment = msg.attachments && msg.attachments.length > 0;

    const renderAttachment = (attachment) => {
        const url = attachment.file_url;
        const name = attachment.file_name || "file";

        const isImage =
            url.startsWith("blob:") ||
            url.includes("/image/") ||
            /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(name);

        const isVideo =
            url.includes("/video/") ||
            /\.(mp4|webm|ogg|mov)$/i.test(name);

        if (isImage) {
            return (
                <div className="relative inline-block">
                    <img
                        src={url}
                        alt={name}
                        className="max-w-sm w-full rounded-lg shadow-md object-contain"
                        style={{ maxHeight: "500px" }}
                        loading="lazy"
                    />
                </div>
            );
        }

        if (isVideo) {
            return (
                <div className="relative">
                    <video
                        controls
                        className="max-w-sm w-full rounded-lg shadow-md object-contain bg-black"
                        style={{ maxHeight: "400px" }}
                    >
                        <source src={url} type="video/mp4" />
                        Trình duyệt không hỗ trợ video.
                    </video>
                </div>
            );
        }

        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition shadow-sm"
            >
                <span className="material-symbols-outlined text-5xl text-gray-600">
                    description
                </span>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
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

            <div className={`flex flex-col gap-1 ${isMe ? "items-end" : ""} relative`}>
                <div className={`flex items-baseline gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                    <span className="text-slate-800 text-sm font-bold">
                        {isMe ? "Bạn" : msg.sender?.full_name || "Người dùng"}
                    </span>
                    <span className="text-slate-500 text-[10px]">
                        {formatMessageTime(msg.created_at)}
                    </span>
                </div>

                <div className="flex flex-col gap-2 relative">
                    {!msg.isPending && showQuickReaction && (
                        <div
                            className={`absolute ${isMe ? "-top-12 right-0" : "-top-12 left-0"} flex items-center gap-1 bg-white rounded-full shadow-lg px-3 py-1.5 border border-gray-200 z-10`}
                        >
                            {["❤️", "😂", "😮", "👍", "😢", "👎"].map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => handleReaction(msg.message_id, emoji)}
                                    className="text-2xl hover:scale-125 transition-transform duration-200"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}

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

                    {hasAttachment &&
                        msg.attachments.map((att, i) => (
                            <div key={i} className="max-w-sm">
                                {renderAttachment(att)}
                            </div>
                        ))}

                    {renderReactions(msg.reactions)}

                    {msg.isPending && (
                        <div className={`absolute -bottom-5 ${isMe ? "right-0" : "left-0"} flex items-center gap-1 text-xs text-gray-500`}>
                            <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            <span>Đang gửi...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageItem;