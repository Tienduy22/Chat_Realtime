// components/ConversationList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ← Thêm import này
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { listConversation } from "../../../services/conversation.service";

const ConversationList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Lấy conversation_id hiện tại từ URL để highlight
  const currentConversationId = location.pathname.startsWith("/chat/")
    ? location.pathname.split("/chat/")[1]
    : null;

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

  const formatTime = (dateString) => {
    if (!dateString) return "Chưa có tin nhắn";
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
    if (sender && sender.full_name) {
      senderName = sender.full_name;
    } else if (participants) {
      const found = participants.find(p => p.user.user_id === lastMsg.sender_id);
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
      };
    }

    if (!conv.participants || conv.participants.length === 0) {
      return { name: "Người dùng ẩn danh", avatar: null, isGroup: false };
    }

    const otherUser = conv.participants[0].user;
    return {
      name: otherUser.full_name || "Người dùng ẩn danh",
      avatar: otherUser.avatar_url,
      isGroup: false,
    };
  };

  // Hàm xử lý khi click vào cuộc trò chuyện
  const handleConversationClick = (conversationId) => {
    navigate(`/chat/${conversationId}`);
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

  return (
    <aside className="w-80 bg-gray-50 dark:bg-sidebar-panel-dark border-r border-gray-200 dark:border-gray-800 flex flex-col hidden lg:flex flex-shrink-0">
      <div className="p-6 pb-2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Messages
          </h2>
          <button className="text-gray-400 hover:text-primary transition-colors">
            <span className="material-icons text-xl">edit_square</span>
          </button>
        </div>

        <div className="relative mb-6">
          <span className="material-icons absolute left-3 top-2.5 text-gray-400 text-lg">
            search
          </span>
          <input
            className="w-full bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:text-gray-200 placeholder-gray-400 transition-all"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            type="text"
          />
        </div>

        <div className="flex gap-2 mb-4">
          <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-xs font-medium rounded-lg">
            Tất cả
          </button>
          <button className="px-3 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white text-xs font-medium rounded-lg transition-colors">
            Chưa đọc
          </button>
          <button className="px-3 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white text-xs font-medium rounded-lg transition-colors">
            Nhóm
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {conversations.map((item) => {
          const conv = item.conversation;
          const display = getConversationDisplay(conv);
          const preview = getLastMessagePreview(conv.messages, conv.participants);
          const time =
            conv.messages && conv.messages.length > 0
              ? formatTime(conv.messages[0].created_at)
              : "Chưa có tin nhắn";

          const hasUnread = item.unread_count > 0;
          const isActive = conv.conversation_id.toString() === currentConversationId;

          return (
            <div
              key={item.participant_id}
              onClick={() => handleConversationClick(conv.conversation_id)}
              className={`group p-3 rounded-xl cursor-pointer transition-all
                ${isActive
                  ? "bg-primary/10 border border-primary/30 shadow-sm" // Highlight khi đang chọn
                  : hasUnread
                  ? "bg-white dark:bg-gray-800/60 shadow-sm border border-gray-100 dark:border-gray-700/50"
                  : "hover:bg-white dark:hover:bg-gray-800/40 border border-transparent hover:border-gray-100 dark:hover:border-gray-700/30"
                }`}
            >
              <div className="flex gap-3">
                <div className="relative">
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
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3
                      className={`text-sm font-${hasUnread || isActive ? "semibold" : "medium"} 
                        ${isActive ? "text-primary" : "text-gray-800 dark:text-gray-200"} truncate`}
                    >
                      {display.name}
                    </h3>
                    <span className="text-xs text-gray-400">{time}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <p
                      className={`text-xs truncate ${
                        hasUnread || isActive
                          ? "text-gray-900 dark:text-white font-medium"
                          : "text-gray-500 dark:text-gray-500"
                      }`}
                    >
                      {preview}
                    </p>

                    {hasUnread && (
                      <span className="bg-primary text-white text-[10px] h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center">
                        {item.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default ConversationList;