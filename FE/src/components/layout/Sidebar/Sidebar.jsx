import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../../../Redux/reducers/userReducer";

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleProfileClick = () => {
        navigate("/profile");
    };

    const handleLogout = () => {

        if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            dispatch(removeUser())
        }
    };

    return (
        <nav className="w-16 md:w-20 bg-white dark:bg-sidebar-dark border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-6 gap-8 z-20 flex-shrink-0">
            {/* Logo */}
            <div className="h-10 w-10 md:h-12 md:w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-2 cursor-pointer hover:scale-105 transition-transform">
                <span className="material-icons text-white text-2xl md:text-3xl">
                    bolt
                </span>
            </div>

            {/* Menu items */}
            <div className="flex flex-col gap-6 w-full items-center flex-1">
                <button className="relative group p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-primary transition-all">
                    <span className="material-icons">chat_bubble</span>
                    <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-sidebar-dark"></span>
                    <div className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        Messages
                    </div>
                </button>

                {["call", "people", "folder"].map((icon) => (
                    <button
                        key={icon}
                        className="relative group p-3 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    >
                        <span className="material-icons">{icon}</span>
                        <div className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                            {icon === "call"
                                ? "Calls"
                                : icon === "people"
                                  ? "Contacts"
                                  : "Files"}
                        </div>
                    </button>
                ))}
            </div>

            {/* Bottom: Avatar + Logout (Logout ở dưới cùng) */}
            <div className="flex flex-col gap-5 items-center">
                {/* Avatar - Click để sang /profile */}
                <div
                    onClick={handleProfileClick}
                    className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-orange-200 overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-all shadow-lg hover:shadow-xl"
                    title="View Profile"
                >
                    <img
                        alt="User Profile"
                        className="h-full w-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr17tSemUyw6elNJg_pIYSJZN8rs5oibcsZWm6QgkKTpZ0bMKcDRSnCHJZxk5OsXUlw8xf_zss4gkoihXbaCvg2zJgdAaiRpDPnr00LqGbyQ025VjuRz22BIKEhvwIFf8isOHuDwnlURsJYFdlgdAS7DXqn15C56eDOe8nw2bJUH0FcyInS3xcm37cKJETXq72zjaL4bGiQbXMFr9x5yJvl0njByjTUXj3ov92v4aea1Io7BdpESEWkYQUp3pm0O3WSNl3co6y0kY"
                    />
                </div>

                {/* Logout Button - Đặt dưới avatar */}
                <button
                    onClick={handleLogout}
                    className="relative group p-3 rounded-xl text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    title="Log Out"
                >
                    <span className="material-icons text-2xl">logout</span>
                    <div className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        Log Out
                    </div>
                </button>
            </div>
        </nav>
    );
};

export default Sidebar;