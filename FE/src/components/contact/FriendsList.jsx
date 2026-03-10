import {
    ArrowDownUp,
    Filter,
    Search,
    UserPlus,
    X,
    User,
    Phone,
    Send,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    listFriends,
    findContactByPhone,
    sendInvitations,
} from "../../services/contact.service";
import FriendCard from "./FriendCard";

export default function FriendsList() {
    const [friends, setFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [phoneInput, setPhoneInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const user = useSelector((state) => state.user);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await listFriends(user.user_id);
                setFriends(response?.data || []);
            } catch (error) {
                console.error("Lỗi lấy bạn bè:", error);
            }
        };
        if (user?.user_id) fetchFriends();
    }, [user.user_id]);

    const filteredFriends = friends.filter((friend) => {
        const searchLower = searchTerm.toLowerCase().trim();
        if (!searchLower) return true;
        const name = (friend.contactUser?.full_name || "").toLowerCase();
        return name.includes(searchLower);
    });

    const openAddModal = () => {
        setIsAddModalOpen(true);
        setPhoneInput("");
        setSearchResults([]);
        setSelectedUser(null);
        setErrorMsg("");
        setSuccessMsg("");
    };

    const handleSearchPhone = async () => {
        if (!phoneInput.trim() || phoneInput.length < 9) {
            setErrorMsg("SĐT không hợp lệ (ít nhất 9 số)");
            return;
        }

        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");
        setSearchResults([]);
        setSelectedUser(null);

        try {
            const response = await findContactByPhone(phoneInput.trim());

            if (response?.success && Array.isArray(response?.data)) {
                const users = response.data;
                if (users.length === 0) {
                    setErrorMsg("Không tìm thấy người dùng");
                } else if (users.length === 1) {
                    setSelectedUser(users[0]);
                } else {
                    setSearchResults(users);
                }
            } else {
                setErrorMsg("Dữ liệu không hợp lệ");
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Lỗi tìm kiếm");
        } finally {
            setLoading(false);
        }
    };

    const handleSendInvite = async () => {
        if (!selectedUser) return;

        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const payload = { user_id: user.user_id, contact_user_id: selectedUser.user_id };
            const res = await sendInvitations(payload);

            if (
                res?.success ||
                res?.message?.toLowerCase().includes("thành công")
            ) {
                setSuccessMsg("Đã gửi lời mời!");
                setTimeout(() => {
                    setIsAddModalOpen(false);
                    setPhoneInput("");
                    setSearchResults([]);
                    setSelectedUser(null);
                }, 1600);
            } else {
                setErrorMsg(res?.message || "Gửi thất bại");
            }
        } catch (err) {
            setErrorMsg(
                err.response?.data?.message ||
                    "Không thể gửi (có thể đã gửi trước đó)",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
            {/* Phần header search + add giữ nguyên */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Tìm kiếm bạn bè..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3.5 pl-12 text-base shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>

                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-3 text-white shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all"
                >
                    <UserPlus size={18} />
                    Thêm bạn bè
                </button>
            </div>

            {/* Danh sách bạn bè giữ nguyên */}
            <div className="rounded-3xl bg-white p-6 shadow-lg">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Bạn bè {filteredFriends.length}
                    </h2>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <ArrowDownUp size={16} />
                            Tên (A-Z)
                        </button>
                        <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Filter size={16} />
                            Tất cả
                        </button>
                    </div>
                </div>

                {filteredFriends.length === 0 && searchTerm ? (
                    <div className="py-10 text-center text-gray-500">
                        Không tìm thấy bạn bè nào với từ khóa "{searchTerm}"
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredFriends.map((friend) => (
                            <FriendCard
                                key={friend.id || friend.contactUser?.user_id}
                                friend={friend}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ====================== MODAL NHỎ GỌN HƠN ====================== */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="relative w-full max-w-sm max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        {/* Nút đóng nhỏ hơn */}
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute right-3 top-3 text-gray-500 hover:text-gray-800"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-5">
                            <h3 className="mb-4 text-center text-xl font-bold text-gray-800">
                                Thêm bạn mới
                            </h3>

                            {/* Input + nút tìm */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="tel"
                                        placeholder="Số điện thoại..."
                                        value={phoneInput}
                                        onChange={(e) =>
                                            setPhoneInput(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" &&
                                            handleSearchPhone()
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-10 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
                                    />
                                </div>

                                <button
                                    onClick={handleSearchPhone}
                                    disabled={loading || !phoneInput.trim()}
                                    className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition"
                                >
                                    {loading ? "Đang tìm..." : "Tìm kiếm"}
                                </button>

                                {errorMsg && (
                                    <p className="rounded bg-red-50 px-3 py-2 text-center text-xs text-red-600">
                                        {errorMsg}
                                    </p>
                                )}
                                {successMsg && (
                                    <p className="rounded bg-green-50 px-3 py-2 text-center text-xs text-green-600">
                                        {successMsg}
                                    </p>
                                )}

                                {/* Danh sách kết quả - nhỏ gọn, scrollable */}
                                {searchResults.length > 1 && (
                                    <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50">
                                        <div className="divide-y divide-gray-200">
                                            {searchResults.map((u) => (
                                                <div
                                                    key={u.user_id}
                                                    onClick={() =>
                                                        setSelectedUser(u)
                                                    }
                                                    className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-gray-100 ${
                                                        selectedUser?.user_id ===
                                                        u.user_id
                                                            ? "bg-blue-50"
                                                            : ""
                                                    }`}
                                                >
                                                    <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-blue-100">
                                                        {u.avatar_url ? (
                                                            <img
                                                                src={
                                                                    u.avatar_url
                                                                }
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-blue-600">
                                                                <User
                                                                    size={18}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {u.full_name ||
                                                                u.username}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            @{u.username}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* User đã chọn - nhỏ gọn hơn */}
                                {selectedUser && (
                                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-blue-100">
                                                {selectedUser.avatar_url ? (
                                                    <img
                                                        src={
                                                            selectedUser.avatar_url
                                                        }
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-blue-600">
                                                        <User size={24} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-base font-semibold text-gray-900 truncate">
                                                    {selectedUser.full_name ||
                                                        selectedUser.username}
                                                </p>
                                                <p className="text-xs text-gray-600 truncate">
                                                    @{selectedUser.username} •{" "}
                                                    {selectedUser.phone}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleSendInvite}
                                            disabled={loading}
                                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 py-2.5 text-sm font-medium text-white hover:from-green-600 hover:to-emerald-700 disabled:opacity-50"
                                        >
                                            <Send size={16} />
                                            {loading
                                                ? "Đang gửi..."
                                                : "Gửi lời mời"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
