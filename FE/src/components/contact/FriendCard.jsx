import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { removeFriend } from "../../services/contact.service";

export default function FriendCard({ friend, onFriendRemoved }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector((state) => state.user);

    const handleRemoveFriend = async () => {
        if (!window.confirm(`Bạn có chắc chắn muốn hủy kết bạn với ${friend.contactUser.full_name}?`)) {
            return;
        }

        setIsLoading(true);
        try {
            await removeFriend(user.user_id, friend.contact_user_id);
            setIsMenuOpen(false);
            if (onFriendRemoved) {
                onFriendRemoved(friend.contact_user_id);
            }
        } catch (error) {
            console.error("Lỗi khi hủy kết bạn:", error);
            alert("Không thể hủy kết bạn. Vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="group relative flex items-center justify-between rounded-2xl bg-gradient-to-r from-white to-gray-50 p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <img
                        src={friend.contactUser.avatar_url}
                        alt={friend.contactUser.full_name}
                        className="h-14 w-14 rounded-full object-cover ring-2 ring-white"
                    />
                </div>
                <span className="font-semibold text-gray-800">
                    {friend.contactUser.full_name}
                </span>
            </div>

            {/* Menu button */}
            <div className="relative">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="rounded-full p-2 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-100"
                    disabled={isLoading}
                >
                    <MoreHorizontal size={20} />
                </button>

                {/* Dropdown menu */}
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
                        <button
                            onClick={handleRemoveFriend}
                            disabled={isLoading}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Trash2 size={16} />
                            {isLoading ? "Đang hủy..." : "Hủy kết bạn"}
                        </button>
                    </div>
                )}
            </div>

            {/* Close menu when clicking outside */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </div>
    );
}
