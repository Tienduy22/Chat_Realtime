// src/components/chat/MessageInput/MessageInput.jsx
import React, { useState, useRef, useEffect } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { createMessage } from "../../../services/message.service";
import { useSelector } from "react-redux";

const gf = new GiphyFetch("sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh");

const MessageInput = ({
    messageInput,
    setMessageInput,
    onSendMessage,
    conversationId,
    currentUserId,
    socket,
}) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showGifPicker, setShowGifPicker] = useState(false);
    const [gifSearchQuery, setGifSearchQuery] = useState("");
    const [previewModalUrl, setPreviewModalUrl] = useState(null);

    const fileInputRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const gifPickerRef = useRef(null);
    const gifSearchInputRef = useRef(null);
    const textareaRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const user = useSelector((state) => state.user);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
            if (gifPickerRef.current && !gifPickerRef.current.contains(event.target)) {
                setShowGifPicker(false);
                setGifSearchQuery("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (showGifPicker && gifSearchInputRef.current) {
            gifSearchInputRef.current.focus();
        }
    }, [showGifPicker]);

    const emitTyping = (isTyping) => {
        if (!socket || !conversationId) return;
        socket.emit(isTyping ? "typing_start" : "typing_stop", conversationId);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setMessageInput(value);

        if (value.trim().length > 0) {
            emitTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => emitTyping(false), 1500);
        } else {
            emitTyping(false);
        }
    };

    const handlePaste = (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        let hasImage = false;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                hasImage = true;
                const blob = items[i].getAsFile();
                if (blob) {
                    const preview = {
                        file: blob,
                        url: URL.createObjectURL(blob),
                        name: `Pasted_image_${Date.now()}.png`,
                        type: blob.type || "image/png",
                    };
                    setSelectedFiles((prev) => [...prev, preview]);
                }
            }
        }
        if (hasImage) e.preventDefault();
    };

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.addEventListener("paste", handlePaste);
            return () => textarea.removeEventListener("paste", handlePaste);
        }
    }, []);

    const handleSend = async () => {
        if (!messageInput.trim() && selectedFiles.length === 0) return;

        const tempIdBase = Date.now();
        const optimisticMessages = [];

        // Nếu có file
        if (selectedFiles.length > 0) {
            selectedFiles.forEach((item, idx) => {
                optimisticMessages.push({
                    message_id: tempIdBase + idx,
                    content: messageInput.trim(),
                    message_type: item.type.startsWith("image/") ? "image" : item.type.startsWith("video/") ? "video" : "file",
                    created_at: new Date().toISOString(),
                    sender_id: currentUserId,
                    sender: {
                        user_id: currentUserId,
                        full_name: user?.full_name || "Bạn",
                        avatar_url: user?.avatar_url || "",
                    },
                    attachments: [{ file_url: item.url, file_name: item.name || "file" }],
                    isPending: true,
                });
            });
        }

        // Nếu chỉ có text
        if (messageInput.trim() && selectedFiles.length === 0) {
            optimisticMessages.push({
                message_id: tempIdBase,
                content: messageInput.trim(),
                message_type: "text",
                created_at: new Date().toISOString(),
                sender_id: currentUserId,
                sender: {
                    user_id: currentUserId,
                    full_name: user?.full_name || "Bạn",
                    avatar_url: user?.avatar_url || "",
                },
                isPending: true,
            });
        }

        onSendMessage(optimisticMessages);

        emitTyping(false);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        const formData = new FormData();
        formData.append("conversation_id", conversationId);
        formData.append("sender_id", currentUserId);
        if (messageInput.trim()) formData.append("content", messageInput.trim());
        selectedFiles.forEach((item) => formData.append("files", item.file));

        const tempContent = messageInput;
        setMessageInput("");
        setSelectedFiles([]);

        try {
            await createMessage(formData);
            console.log("Gửi thành công");
        } catch (error) {
            alert("Gửi thất bại, vui lòng thử lại");
            setMessageInput(tempContent);
        }
    };

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, []);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            name: file.name,
            type: file.type || "application/octet-stream",
        }));
        setSelectedFiles((prev) => [...prev, ...previews]);
    };

    const removeFilePreview = (index) => {
        setSelectedFiles((prev) => {
            const newFiles = prev.filter((_, i) => i !== index);
            URL.revokeObjectURL(prev[index].url);
            return newFiles;
        });
    };

    const addEmoji = (emoji) => {
        setMessageInput((prev) => prev + emoji.native);
        setShowEmojiPicker(false);
    };

    const handleGifSelect = (gif, e) => {
        e.preventDefault();
        const gifUrl = gif.images.original.url;
        setMessageInput((prev) => prev + (prev ? " " : "") + gifUrl);
        setShowGifPicker(false);
        setGifSearchQuery("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-6 pt-2 shrink-0 bg-white border-t border-gray-200 relative">
            {selectedFiles.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-3 px-2">
                    {selectedFiles.map((item, index) => (
                        <div
                            key={index}
                            className="relative group bg-gray-100 rounded-xl overflow-hidden shadow-md w-28 h-28 cursor-pointer"
                            onClick={() => item.type.startsWith("image/") && setPreviewModalUrl(item.url)}
                        >
                            {item.type.startsWith("image/") ? (
                                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                            ) : item.type.startsWith("video/") ? (
                                <video src={item.url} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
                                    <span className="material-symbols-outlined text-5xl text-gray-500">description</span>
                                    <p className="text-xs text-gray-600 px-2 text-center truncate mt-1">{item.name}</p>
                                </div>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFilePreview(index);
                                }}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {previewModalUrl && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
                    onClick={() => setPreviewModalUrl(null)}
                >
                    <img
                        src={previewModalUrl}
                        alt="Preview large"
                        className="max-w-full max-h-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        className="absolute top-4 right-4 text-white text-4xl"
                        onClick={() => setPreviewModalUrl(null)}
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="bg-white rounded-2xl p-2 flex flex-col gap-2 shadow-lg border-t border-gray-200">
                <textarea
                    ref={textareaRef}
                    value={messageInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn..."
                    className="w-full bg-transparent border-none focus:outline-none text-slate-800 placeholder:text-slate-500/60 resize-none h-12 py-3 px-4 scrollbar-thin"
                />

                <div className="flex items-center justify-between px-2 pb-1">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="size-9 rounded-lg hover:bg-gray-100 hover:text-[#135bec] transition-all flex items-center justify-center"
                        >
                            <span className="material-symbols-outlined text-xl text-slate-500">
                                add_circle
                            </span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*,video/*,.pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleFileSelect}
                        />

                        <div className="relative" ref={emojiPickerRef}>
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="size-9 rounded-lg hover:bg-gray-100 hover:text-[#135bec] transition-all flex items-center justify-center"
                            >
                                <span className="material-symbols-outlined text-xl text-slate-500">
                                    sentiment_satisfied
                                </span>
                            </button>

                            {showEmojiPicker && (
                                <div className="absolute bottom-12 left-0 z-50">
                                    <Picker
                                        data={data}
                                        onEmojiSelect={addEmoji}
                                        theme="light"
                                        previewPosition="none"
                                        skinTonePosition="none"
                                        emojiSize={24}
                                        perLine={9}
                                        locale="vi"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="relative" ref={gifPickerRef}>
                            <button
                                onClick={() => setShowGifPicker(!showGifPicker)}
                                className="size-9 rounded-lg hover:bg-gray-100 hover:text-[#135bec] transition-all flex items-center justify-center"
                            >
                                <span className="material-symbols-outlined text-xl text-slate-500">
                                    gif_box
                                </span>
                            </button>

                            {showGifPicker && (
                                <div className="absolute bottom-12 left-0 bg-white rounded-2xl shadow-2xl p-4 z-50 w-96 h-96 flex flex-col">
                                    <input
                                        ref={gifSearchInputRef}
                                        type="text"
                                        value={gifSearchQuery}
                                        onChange={(e) => setGifSearchQuery(e.target.value)}
                                        placeholder="Tìm GIF..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#135bec] mb-3"
                                    />

                                    <div className="flex-1 overflow-y-auto">
                                        <Grid
                                            width={352}
                                            columns={3}
                                            gutter={6}
                                            fetchGifs={(offset) =>
                                                gifSearchQuery
                                                    ? gf.search({ q: gifSearchQuery, offset, limit: 21 })
                                                    : gf.trending({ offset, limit: 21 })
                                            }
                                            onGifClick={handleGifSelect}
                                            noLink={true}
                                            hideAttribution={true}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-px h-5 bg-gray-200 mx-1" />

                        <button className="size-9 rounded-lg hover:bg-gray-100 hover:text-[#135bec] transition-all flex items-center justify-center">
                            <span className="material-symbols-outlined text-xl text-slate-500">
                                format_bold
                            </span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="size-9 rounded-lg hover:bg-gray-100 hover:text-[#135bec] transition-all flex items-center justify-center">
                            <span className="material-symbols-outlined text-xl text-slate-500">
                                mic
                            </span>
                        </button>

                        <button
                            onClick={handleSend}
                            disabled={!messageInput.trim() && selectedFiles.length === 0}
                            className="px-4 h-9 rounded-lg bg-[#135bec] disabled:bg-gray-300 text-white font-medium flex items-center gap-2 hover:bg-blue-700 disabled:hover:bg-gray-300 transition-all"
                        >
                            <span>Gửi</span>
                            <span className="material-symbols-outlined text-lg">send</span>
                        </button>
                    </div>
                </div>
            </div>

            <p className="text-center mt-2 text-slate-500 text-[10px]">
                Nhấn Enter để gửi, Shift + Enter để xuống dòng
            </p>
        </div>
    );
};

export default MessageInput;