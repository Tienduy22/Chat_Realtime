import React, { useState, useEffect, useRef } from "react";
import Avatar from "../common/Avatar/Avatar";
import { useSocket } from "../../context/SocketContext";
import {
    reactionMessage,
    editMessage,
} from "../../services/message.service";

const QUICK_EMOJIS = ["❤️", "😂", "😮", "👍", "😢", "👎"];

const MessageItem = ({
    msg,
    messages,
    setMessages,
    currentUserId,
    isMe,
    showAvatar,
    formatMessageTime,
}) => {
    const { socket } = useSocket();

    const [isHovered, setIsHovered] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });
    const [localReactions, setLocalReactions] = useState(msg.reactions || []);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(msg.content || "");
    const textareaRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const emojiButtonRef = useRef(null);

    const canEdit =
        isMe &&
        !msg.isPending &&
        Date.now() - new Date(msg.created_at).getTime() < 15 * 60 * 1000;

    useEffect(() => {
        setLocalReactions(msg.reactions || []);
    }, [msg.reactions]);

    useEffect(() => {
        setEditContent(msg.content || "");
    }, [msg.content]);

    // Đóng emoji picker khi click ra ngoài
    useEffect(() => {
        if (!showEmojiPicker) return;
        const handler = (e) => {
            const pickerEl = document.querySelector("[data-emoji-picker]");
            if (
                pickerEl &&
                !pickerEl.contains(e.target) &&
                emojiButtonRef.current &&
                !emojiButtonRef.current.contains(e.target)
            ) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [showEmojiPicker]);

    const hasText = msg.content && msg.content.trim() !== "";
    const hasAttachment = msg.attachments && msg.attachments.length > 0;

    const handleAddReaction = async (emoji) => {
        if (!socket || !msg.message_id) return;

        setLocalReactions((prev) => {
            const alreadyReacted = prev.some(
                (r) => r.user_id === currentUserId && r.emoji === emoji,
            );
            if (alreadyReacted) {
                return prev.filter(
                    (r) => !(r.user_id === currentUserId && r.emoji === emoji),
                );
            }
            return [
                ...prev,
                {
                    reaction_id: `temp-${Date.now()}`,
                    user_id: currentUserId,
                    emoji,
                },
            ];
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

        setShowEmojiPicker(false);
    };

    const handleSaveEdit = async () => {
        if (!editContent.trim() || editContent === msg.content) {
            setIsEditing(false);
            return;
        }

        const originalContent = msg.content;
        const originalEditState = isEditing;

        // Tạm thời cập nhật UI ngay lập tức (optimistic update)
        setMessages((prev) =>
            prev.map((m) =>
                m.message_id === msg.message_id
                    ? { ...m, content: editContent.trim(), is_edited: true }
                    : m,
            ),
        );

        try {
            const response = await editMessage(
                msg.conversation_id,
                currentUserId,
                msg.message_id,
                editContent.trim(),
            );

            if (response.success) {
                // Server đã xử lý thành công → không cần set lại state nữa
                // (vì optimistic đã cập nhật, và server sẽ broadcast cho mọi người)
                setIsEditing(false);
            } else {
                // Rollback nếu server từ chối
                setMessages((prev) =>
                    prev.map((m) =>
                        m.message_id === msg.message_id
                            ? { ...m, content: originalContent }
                            : m,
                    ),
                );
                alert("Không thể chỉnh sửa tin nhắn");
            }
        } catch (error) {
            console.error("Lỗi chỉnh sửa tin nhắn:", error);
            // Rollback
            setMessages((prev) =>
                prev.map((m) =>
                    m.message_id === msg.message_id
                        ? { ...m, content: originalContent }
                        : m,
                ),
            );
            alert("Đã có lỗi xảy ra khi chỉnh sửa");
        } finally {
            setIsEditing(false);
        }
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
                        onClick={() => handleAddReaction(emoji)}
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

    // ── Icon bar xuất hiện khi hover ──────────────────────────────────────────
    // Luôn render sẵn nhưng ẩn, hiện khi isHovered để tránh layout shift
    const renderHoverActions = () => {
        if (msg.isPending) return null;

        return (
            <div
                className={`
                    flex items-center gap-1 self-center
                    transition-all duration-150
                    ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}
                `}
            >
                {/* Nút emoji */}
                <div className="relative" ref={emojiPickerRef}>
                    <button
                        ref={emojiButtonRef}
                        onClick={() => {
                            if (!showEmojiPicker && emojiButtonRef.current) {
                                const rect =
                                    emojiButtonRef.current.getBoundingClientRect();
                                setPickerPos({
                                    top: rect.top - 8,
                                    left: rect.left,
                                });
                            }
                            setShowEmojiPicker((v) => !v);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-full
                                   text-gray-400 hover:text-yellow-500 hover:bg-gray-100
                                   transition-colors duration-150"
                        title="Thả cảm xúc"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            sentiment_satisfied
                        </span>
                    </button>

                    {/* Emoji picker popup — dùng fixed để không bị clip bởi overflow */}
                    {showEmojiPicker && (
                        <div
                            data-emoji-picker
                            className="fixed flex items-center gap-1.5 bg-white rounded-full
                                shadow-xl px-3 py-2 border border-gray-200 z-50
                                animate-fade-in whitespace-nowrap"
                            style={{
                                top: pickerPos.top,
                                left: pickerPos.left,
                                transform: "translateY(-100%)",
                            }}
                        >
                            {QUICK_EMOJIS.map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => handleAddReaction(emoji)}
                                    className="text-2xl hover:scale-125 transition-transform duration-150 p-0.5"
                                    title="React"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Nút chỉnh sửa — chỉ hiện nếu là tin nhắn của mình và còn trong 15 phút */}
                {isMe && canEdit && (
                    <button
                        onClick={() => {
                            setIsEditing(true);
                            setEditContent(msg.content || "");
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-full
                                   text-gray-400 hover:text-blue-600 hover:bg-gray-100
                                   transition-colors duration-150"
                        title="Chỉnh sửa tin nhắn"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            edit
                        </span>
                    </button>
                )}
            </div>
        );
    };

    return (
        <div
            className={`flex gap-4 ${isMe ? "max-w-full self-end flex-row-reverse" : "max-w-[80%"}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                // Không đóng emoji picker khi rời chuột — đóng bằng click-outside
            }}
        >
            {showAvatar ? (
                <Avatar src={msg.sender?.avatar_url} size="sm" />
            ) : (
                <div className="w-10 shrink-0" />
            )}

            <div className={`flex flex-col gap-1 ${isMe ? "items-end" : ""}`}>
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

                {/* Row: tin nhắn của mình → [icons][bubble], của người khác → [bubble][icons] */}
                <div className="flex items-center gap-1">
                    {/* Icon bên TRÁI — chỉ khi là tin nhắn của mình */}
                    {isMe && renderHoverActions()}

                    {/* Bubble + attachments + reactions */}
                    <div className="flex flex-col gap-2 relative">
                        {isEditing ? (
                            <div
                                className="p-3 rounded-2xl text-sm leading-relaxed shadow-sm max-w-md
                                           bg-white border-2 border-blue-400 focus-within:border-blue-600"
                            >
                                <textarea
                                    ref={textareaRef}
                                    value={editContent}
                                    onChange={(e) =>
                                        setEditContent(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSaveEdit();
                                        }
                                        if (e.key === "Escape")
                                            setIsEditing(false);
                                    }}
                                    className="w-full bg-transparent outline-none resize-none min-h-[40px] text-slate-800"
                                    autoFocus
                                    rows={Math.max(
                                        2,
                                        Math.ceil(editContent.length / 50),
                                    )}
                                />
                                <div className="flex justify-end gap-3 mt-2 text-sm">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-3 py-1 text-gray-600 hover:text-gray-800"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        disabled={!editContent.trim()}
                                    >
                                        Lưu
                                    </button>
                                </div>
                            </div>
                        ) : (
                            hasText && (
                                <div
                                    className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm max-w-md ${
                                        isMe
                                            ? "bg-[#135bec] text-white rounded-tr-none shadow-[#135bec]/20"
                                            : "bg-white border border-gray-200 text-slate-800 rounded-tl-none"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            )
                        )}

                        {hasAttachment &&
                            msg.attachments.map((att, i) => (
                                <div key={i} className="max-w-sm mt-1.5">
                                    {renderAttachment(att)}
                                </div>
                            ))}

                        {renderReactions()}

                        {msg.is_edited && (
                            <div className="text-xs text-gray-400 mt-0.5 italic ml-1">
                                Đã chỉnh sửa
                            </div>
                        )}

                        {msg.isPending && (
                            <div
                                className={`absolute -bottom-5 ${isMe ? "right-0" : "left-0"} flex items-center gap-1.5 text-xs text-gray-500`}
                            >
                                <div className="w-3 h-3 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin" />
                                <span>Đang gửi...</span>
                            </div>
                        )}
                    </div>

                    {/* Icon bên PHẢI — chỉ khi là tin nhắn của người khác */}
                    {!isMe && renderHoverActions()}
                </div>
            </div>
        </div>
    );
};

export default MessageItem;
