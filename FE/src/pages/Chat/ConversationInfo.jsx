import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../../components/common/Avatar/Avatar";
import { X } from "lucide-react";
import {
    adminInfo,
    dataOfConversation,
    deleteHistoryOfConversation,
    deleteGroup,
    memberLeave,
    getConversationWithBlockStatus,
} from "../../services/conversation.service";
import { blockFriend, unBlockFriend } from "../../services/contact.service";
import ConversationStorage from "./ConversationStorage";
import { useSelector } from "react-redux";
import GroupMembersModal from "../../components/chat/GroupMembersModal";

export default function ConversationInfo({
    conversation_id,
    onClose,
    onSearch,
}) {
    const [conversationData, setConversationData] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [displayAvatar, setDisplayAvatar] = useState(null);
    const [displayName, setDisplayName] = useState(null);
    const [openStorage, setOpenStorage] = useState(false);
    const [openMembers, setOpenMembers] = useState(false);

    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const currentUserId = user?.user_id;

    /* ================= FETCH CONVERSATION ================= */

    useEffect(() => {
        const fetchData = async () => {
            try {
                // ✅ Use getConversationWithBlockStatus for all conversations to include block status
                const response = await getConversationWithBlockStatus(conversation_id);
                setConversationData(response.data);
            } catch (error) {
                console.error("Đã xảy ra lỗi khi lấy data hội thoại:", error);
            }
        };

        fetchData();
    }, [conversation_id]);

    /* ================= FETCH ADMIN ================= */

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await adminInfo(conversation_id);
                setAdmin(response.data);
            } catch (error) {
                console.error("Đã xảy ra lỗi khi lấy admin:", error);
            }
        };

        fetchAdmin();
    }, [conversation_id]);

    /* ================= DISPLAY NAME + AVATAR ================= */

    useEffect(() => {
        if (
            conversationData?.conversation_type === "private" &&
            conversationData?.participants
        ) {
            const otherUser =
                conversationData.participants.find(
                    (p) => p.user.user_id !== currentUserId,
                ) || conversationData.participants[0];

            setDisplayAvatar(otherUser?.user?.avatar_url);
            setDisplayName(otherUser?.user?.full_name);
        } else {
            setDisplayAvatar(conversationData?.avatar_url);
            setDisplayName(conversationData?.name);
        }
    }, [conversationData, currentUserId]);

    /* ================= GET FRIEND ID ================= */

    const getFriendId = () => {
        if (!conversationData?.participants) return null;

        const otherUser =
            conversationData.participants.find(
                (p) => p.user.user_id !== currentUserId,
            ) || conversationData.participants[0];

        return otherUser?.user?.user_id;
    };

    /* ================= DELETE HISTORY ================= */

    const handleDeleteHistory = async () => {
        const confirmDelete = window.confirm(
            "Bạn có chắc muốn xóa toàn bộ lịch sử cuộc trò chuyện không?",
        );

        if (!confirmDelete) return;

        try {
            await deleteHistoryOfConversation(conversation_id);

            navigate("/");
        } catch (error) {
            console.error("Lỗi khi xóa lịch sử:", error);
            alert("Xóa lịch sử thất bại");
        }
    };

    /* ================= DELETE GROUP ================= */

    const handleDeleteGroup = async () => {
        const confirmDelete = window.confirm("Bạn có chắc muốn xóa nhóm này?");

        if (!confirmDelete) return;

        try {
            await deleteGroup(conversation_id);

            alert("Nhóm đã được xóa");

            navigate("/");
        } catch (error) {
            console.error("Lỗi khi xóa nhóm:", error);
            alert("Xóa nhóm thất bại");
        }
    };

    /* ================= LEAVE GROUP ================= */

    const handleLeaveGroup = async () => {
        const confirmLeave = window.confirm("Bạn có chắc muốn rời nhóm?");

        if (!confirmLeave) return;

        try {
            await memberLeave({
                conversation_id: conversation_id,
                member_id: currentUserId,
            });

            alert("Bạn đã rời nhóm");

            navigate("/");
        } catch (error) {
            console.error("Lỗi khi rời nhóm:", error);
            alert("Rời nhóm thất bại");
        }
    };

    /* ================= BLOCK USER ================= */

    const handleBlockUser = async () => {
        const confirmBlock = window.confirm(
            "Bạn có chắc muốn chặn người dùng này?",
        );

        if (!confirmBlock) return;

        try {
            const friend_id = getFriendId();

            await blockFriend(currentUserId, friend_id);

            alert("Đã chặn người dùng");

            setConversationData((prev) => ({
                ...prev,
                isBlocking: true,
            }));
        } catch (error) {
            console.error("Lỗi khi block:", error);
            alert("Chặn người dùng thất bại");
        }
    };

    /* ================= UNBLOCK USER ================= */
    const handleUnblockUser = async () => {
        const confirmUnblock = window.confirm(
            "Bạn có chắc muốn bỏ chặn người dùng này?",
        );

        if (!confirmUnblock) return;

        try {
            const friend_id = getFriendId();

            await unBlockFriend(currentUserId, friend_id);

            alert("Đã bỏ chặn người dùng");

            setConversationData((prev) => ({
                ...prev,
                isBlocking: false,
            }));
        } catch (error) {
            console.error("Lỗi khi unblock:", error);
            alert("Bỏ chặn thất bại");
        }
    };

    const mediaMessages = conversationData?.messages;

    if (openStorage) {
        return (
            <ConversationStorage
                conversation_id={conversation_id}
                media={mediaMessages}
                onBack={() => setOpenStorage(false)}
            />
        );
    }

    /* ================= ACTION ICONS ================= */

    const actionIcons =
        conversationData?.conversation_type === "group"
            ? [
                  { icon: "notifications_off", label: "Tắt thông báo" },
                  {
                      icon: "group",
                      label: "Xem thành viên",
                      action: () => setOpenMembers(true),
                  },
                  {
                      icon: "delete",
                      label: "Xóa lịch sử cuộc trò chuyện",
                      action: handleDeleteHistory,
                  },
              ]
            : [
                  { icon: "notifications_off", label: "Tắt thông báo" },
                  {
                      icon: "delete",
                      label: "Xóa lịch sử cuộc trò chuyện",
                      action: handleDeleteHistory,
                  },
              ];

    /* ================= BOTTOM ACTIONS ================= */

    const bottomActions = () => {
        const actions = [
            {
                icon: "search",
                label: "Tìm kiếm tin nhắn",
                action: onSearch,
            },
        ];

        if (conversationData?.conversation_type === "private") {
            const isBlocking = conversationData?.isBlocking;

            actions.push({
                icon: "block",
                label: isBlocking ? "Bỏ chặn người dùng" : "Chặn người dùng",
                action: isBlocking ? handleUnblockUser : handleBlockUser,
            });
        }

        if (conversationData?.conversation_type === "group") {
            const isOwner = admin?.user_id === currentUserId;

            actions.push(
                isOwner
                    ? {
                          icon: "delete",
                          label: "Xóa nhóm",
                          action: handleDeleteGroup,
                      }
                    : {
                          icon: "logout",
                          label: "Rời nhóm",
                          action: handleLeaveGroup,
                      },
            );
        }

        return actions;
    };

    return (
        <>
            <div className="w-full h-full bg-white flex flex-col">
                {/* HEADER */}

                <div className="h-[72px] shrink-0 border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-10 shadow-sm">
                    <h3 className="text-slate-800 text-base font-bold text-center flex-1">
                        Thông tin hội thoại
                    </h3>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors xl:hidden"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* CONTENT */}

                <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center">
                    <div className="flex flex-col items-center gap-3 mb-6 w-full">
                        <Avatar
                            src={displayAvatar}
                            alt={displayName}
                            size="xl"
                        />

                        <div className="text-center">
                            <h4 className="text-slate-800 text-lg font-bold">
                                {displayName}
                            </h4>

                            {/* ✅ Block Status Messages */}
                            {conversationData?.conversation_type === "private" && (
                                <>
                                    {conversationData?.isBlocking && (
                                        <p className="text-sm text-red-500 mt-1 font-medium">
                                            Bạn đang chặn người này
                                        </p>
                                    )}
                                    {conversationData?.isBlocked && (
                                        <p className="text-sm text-orange-500 mt-1 font-medium">
                                            Bạn đang bị chặn - Không thể gửi tin nhắn
                                        </p>
                                    )}
                                </>
                            )}

                            <div className="flex items-center justify-center gap-2 mt-2">
                                {actionIcons.map((item) => (
                                    <button
                                        key={item.icon}
                                        onClick={item.action}
                                        title={item.label}
                                        className="size-9 rounded-full bg-gray-100 hover:bg-[#135bec]/10 hover:text-[#135bec] transition-all border border-gray-200 flex items-center justify-center group"
                                    >
                                        <span className="material-symbols-outlined text-xl text-slate-500 group-hover:text-[#135bec]">
                                            {item.icon}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-gray-200 mb-6" />

                    {/* MEDIA */}

                    <div className="w-full mb-6">
                        <h5 className="text-slate-800 text-sm font-semibold mb-3">
                            Ảnh/Video
                        </h5>

                        {conversationData?.messages?.length > 0 && (
                            <>
                                <div className="grid grid-cols-3 gap-2">
                                    {conversationData.messages
                                        .slice(0, 6)
                                        .map((item) => (
                                            <div
                                                key={item.message_id}
                                                className="w-full aspect-square overflow-hidden rounded-lg bg-gray-100"
                                            >
                                                {item.attachments[0].file_url.includes(
                                                    "video",
                                                ) ? (
                                                    <video
                                                        src={
                                                            item.attachments[0]
                                                                .file_url
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={
                                                            item.attachments[0]
                                                                .file_url
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                </div>

                                <button
                                    onClick={() => setOpenStorage(true)}
                                    className="mt-3 w-full bg-gray-200 hover:bg-gray-300 text-[#0f2d5c] font-medium py-2 rounded-md transition"
                                >
                                    Xem tất cả
                                </button>
                            </>
                        )}
                    </div>

                    {/* BOTTOM ACTION */}

                    <div className="w-full flex flex-col gap-1">
                        {bottomActions().map((item) => (
                            <button
                                key={item.label}
                                onClick={item.action}
                                className="flex items-center justify-between w-full p-2.5 rounded-lg hover:bg-gray-50 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-lg">
                                            {item.icon}
                                        </span>
                                    </div>

                                    <span
                                        className={`text-sm font-medium ${
                                            item.label.includes("Xóa") ||
                                            item.label.includes("Rời")
                                                ? "text-red-500"
                                                : "text-slate-600"
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {openMembers && (
                <GroupMembersModal
                    conversation_id={conversation_id}
                    created_by={admin?.user_id}
                    onClose={() => setOpenMembers(false)}
                />
            )}
        </>
    );
}
