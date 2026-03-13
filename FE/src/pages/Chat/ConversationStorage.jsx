import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { conversationStorage } from "../../services/conversation.service";

export default function ConversationStorage({ conversation_id, onBack }) {
    const [tab, setTab] = useState("media");
    const [media, setMedia] = useState([]);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchStorageData = async () => {
            try {
                const response = await conversationStorage(conversation_id);

                const messages = response.data.messages || [];

                const attachments = messages.flatMap(
                    (msg) => msg.attachments || []
                );

                const mediaData = attachments.filter(
                    (item) =>
                        item.file_name === "image" || item.file_name === "video"
                );

                const fileData = attachments.filter(
                    (item) => item.file_name === "document"
                );

                setMedia(mediaData);
                setFiles(fileData);
            } catch (error) {
                console.error(
                    "Đã xảy ra lỗi khi lấy dữ liệu kho lưu trữ:",
                    error
                );
            }
        };

        fetchStorageData();
    }, [conversation_id]);

    return (
        <div className="w-full h-full bg-white flex flex-col">
            {/* Header */}
            <div className="h-[72px] border-b flex items-center px-4">
                <button
                    onClick={onBack}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <ArrowLeft size={22} />
                </button>

                <h3 className="flex-1 text-center font-semibold text-lg">
                    Kho lưu trữ
                </h3>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
                {[
                    { key: "media", label: "Ảnh/Video" },
                    { key: "files", label: "Files" },
                ].map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setTab(item.key)}
                        className={`flex-1 py-3 text-sm font-medium ${
                            tab === item.key
                                ? "text-[#135bec] border-b-2 border-[#135bec]"
                                : "text-gray-500"
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* MEDIA */}
                {tab === "media" && (
                    <div className="grid grid-cols-3 gap-2">
                        {media.map((item) => (
                            <div
                                key={item.attachment_id}
                                className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                            >
                                {item.file_url.includes("video") ? (
                                    <video
                                        src={item.file_url}
                                        className="w-full h-full object-cover"
                                        controls
                                    />
                                ) : (
                                    <img
                                        src={item.file_url}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* FILES */}
                {tab === "files" && (
                    <div className="flex flex-col gap-3">
                        {files.map((file) => (
                            <a
                                key={file.attachment_id}
                                href={file.file_url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-3 border rounded-lg hover:bg-gray-50 flex items-center justify-between"
                            >
                                <span className="text-sm text-gray-700">
                                    File #{file.attachment_id}
                                </span>

                                <span className="text-[#135bec] text-sm">
                                    Tải xuống
                                </span>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}