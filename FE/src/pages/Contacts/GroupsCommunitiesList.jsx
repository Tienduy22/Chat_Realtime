import { Search, Users, UserPlus, X, User, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import {
    listGroup,
    newGroup,
    listFriends,
} from "../../services/contact.service";

export default function GroupsCommunitiesList() {
    const user = useSelector((state) => state.user);

    const [groups, setGroups] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [friends, setFriends] = useState([]);
    const [friendSearch, setFriendSearch] = useState("");

    const [selectedMembers, setSelectedMembers] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const avatarInputRef = useRef(null);

    /* ====================== LOAD GROUP ====================== */

    const fetchGroups = async () => {
        try {
            const res = await listGroup(user.user_id);
            setGroups(res?.data || []);
        } catch (err) {
            console.error("Lỗi lấy groups:", err);
        }
    };

    useEffect(() => {
        if (user?.user_id) fetchGroups();
    }, [user.user_id]);

    /* ====================== OPEN MODAL ====================== */

    const openModal = async () => {
        setIsModalOpen(true);
        setSelectedMembers([]);
        setGroupName("");
        setAvatarFile(null);

        try {
            const res = await listFriends(user.user_id);
            setFriends(res?.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    /* ====================== SEARCH GROUP ====================== */

    const filteredGroups = groups.filter((g) =>
        g.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    /* ====================== SEARCH FRIEND ====================== */

    const filteredFriends = friends.filter((f) =>
        f.contactUser?.full_name
            ?.toLowerCase()
            .includes(friendSearch.toLowerCase()),
    );

    /* ====================== SELECT MEMBER ====================== */

    const toggleMember = (id) => {
        setSelectedMembers((prev) =>
            prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
        );
    };

    /* ====================== CREATE GROUP ====================== */

    const handleCreateGroup = async () => {
        if (!groupName.trim()) return alert("Nhập tên nhóm");

        if (selectedMembers.length === 0)
            return alert("Chọn ít nhất 1 thành viên");

        try {
            setLoading(true);

            const data = {
                group_name: groupName,
                avatar_url: avatarFile,
                user_id: user.user_id,
                member_ids: selectedMembers,
            };

            await newGroup(data);

            setIsModalOpen(false);
            fetchGroups();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /* ====================== UI ====================== */

    return (
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
            {/* HEADER SEARCH + CREATE */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Tìm kiếm nhóm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3.5 pl-12 text-base shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>

                <button
                    onClick={openModal}
                    className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-3 text-white shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all"
                >
                    <UserPlus size={18} />
                    Tạo nhóm
                </button>
            </div>

            {/* GROUP LIST */}
            <div className="rounded-3xl bg-white p-6 shadow-lg">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Nhóm của bạn {filteredGroups.length}
                    </h2>
                </div>

                {filteredGroups.length === 0 && searchTerm ? (
                    <div className="py-10 text-center text-gray-500">
                        Không tìm thấy nhóm "{searchTerm}"
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredGroups.map((group) => (
                            <div
                                key={group.conversation_id}
                                className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 hover:bg-gray-50 cursor-pointer"
                            >
                                <div className="h-12 w-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                                    <img
                                        src={group.avatar_url}
                                        alt={group.conversation_id}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-900 truncate">
                                        {group.name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ====================== MODAL CREATE GROUP ====================== */}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute right-3 top-3 text-gray-500 hover:text-gray-800"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-5">
                            <h3 className="mb-4 text-center text-xl font-bold text-gray-800">
                                Tạo nhóm mới
                            </h3>

                            {/* GROUP NAME */}

                            <input
                                type="text"
                                placeholder="Tên nhóm..."
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2"
                            />

                            {/* AVATAR */}

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ảnh đại diện nhóm
                                </label>

                                <div className="flex items-center gap-4">
                                    {/* Preview Circle */}
                                    <div className="relative h-20 w-20 rounded-full overflow-hidden bg-blue-50 border-2 border-blue-200 shadow-sm flex items-center justify-center group">
                                        {avatarFile ? (
                                            <img
                                                src={URL.createObjectURL(
                                                    avatarFile,
                                                )}
                                                alt="Group avatar preview"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <User
                                                    size={32}
                                                    className="text-blue-400 mx-auto"
                                                />
                                                <span className="text-xs text-blue-500 mt-1 block">
                                                    Avatar
                                                </span>
                                            </div>
                                        )}

                                        {/* Overlay khi hover */}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <label
                                                htmlFor="avatar-upload"
                                                className="cursor-pointer text-white text-sm font-medium px-3 py-1 bg-blue-600 rounded-full hover:bg-blue-700"
                                            >
                                                Chọn ảnh
                                            </label>
                                        </div>
                                    </div>

                                    {/* Hidden input + button fallback */}
                                    <div className="flex-1">
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            ref={avatarInputRef}
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) {
                                                    setAvatarFile(
                                                        e.target.files[0],
                                                    );
                                                }
                                            }}
                                            className="hidden"
                                        />

                                        {!avatarFile && (
                                            <label
                                                htmlFor="avatar-upload"
                                                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-sm font-medium"
                                            >
                                                <UserPlus size={16} />
                                                Chọn ảnh đại diện
                                            </label>
                                        )}

                                        {avatarFile && (
                                            <div className="text-sm text-gray-600">
                                                Đã chọn:{" "}
                                                <span className="font-medium">
                                                    {avatarFile.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setAvatarFile(null)
                                                    }
                                                    className="ml-2 text-red-500 hover:text-red-700 text-xs underline"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <p className="mt-1 text-xs text-gray-500">
                                    Kích thước khuyến nghị: 200x200px. Định
                                    dạng: JPG, PNG.
                                </p>
                            </div>

                            {/* SEARCH FRIEND */}

                            <div className="relative mb-3">
                                <input
                                    type="text"
                                    placeholder="Tìm bạn..."
                                    value={friendSearch}
                                    onChange={(e) =>
                                        setFriendSearch(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 pl-9"
                                />

                                <Search className="absolute left-2 top-2.5 text-gray-400" />
                            </div>

                            {/* FRIEND LIST */}

                            <div className="max-h-60 overflow-y-auto rounded-lg border">
                                {filteredFriends.map((f) => {
                                    const u = f.contactUser;

                                    return (
                                        <div
                                            key={u.user_id}
                                            onClick={() =>
                                                toggleMember(u.user_id)
                                            }
                                            className={`flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-gray-100 ${
                                                selectedMembers.includes(
                                                    u.user_id,
                                                )
                                                    ? "bg-blue-50"
                                                    : ""
                                            }`}
                                        >
                                            <div className="h-12 w-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                                                <img
                                                    src={u.avatar_url || "/default-avatar.png"}
                                                    alt={u.user_id}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>

                                            <p className="text-sm font-medium">
                                                {u.full_name}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* CREATE BUTTON */}

                            <button
                                onClick={handleCreateGroup}
                                disabled={loading}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-white hover:bg-green-700 disabled:opacity-50"
                            >
                                <Send size={16} />
                                {loading ? "Đang tạo..." : "Tạo nhóm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
