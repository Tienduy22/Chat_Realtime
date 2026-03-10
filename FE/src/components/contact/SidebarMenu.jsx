import {
    User,
    Users as GroupIcon,
    UserPlus,
    MessageCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
    {
        icon: User,
        label: "Danh sách bạn bè",
        path: "/contact",
    },
    {
        icon: GroupIcon,
        label: "Danh sách nhóm và cộng đồng",
        path: "/contact/groups",
    },
    {
        icon: UserPlus,
        label: "Lời mời kết bạn",
        path: "/contact/invitation",
    },
    {
        icon: MessageCircle,
        label: "Lời mời vào nhóm và cộng đồng",
        path: "/contact/group-invites",
    },
];

export default function SidebarMenu() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="mt-2 px-3">
            {menuItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-left transition-all duration-200 ${
                            isActive
                                ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-semibold shadow-sm"
                                : "text-gray-700 hover:bg-gray-100/80"
                        }`}
                    >
                        <item.icon
                            size={22}
                            className={isActive ? "text-blue-600" : ""}
                        />
                        <span className="text-[15px]">{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}