import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { removeUser } from "../../../Redux/reducers/userReducer";
import { listConversation } from "../../../services/conversation.service";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleProfileClick = () => {
        navigate("/profile");
    };

    const handleContactClick = () => {
        navigate("/contact");
    };

    const handleMessageClick = async () => {
        try {
            const response = await listConversation();

            if (response.success && response.data.length > 0) {
                const latestId =
                    response.data[0].conversation.conversation_id;

                navigate(`/chat/${latestId}`);
            } else {
                navigate("/chat");
            }
        } catch (err) {
            console.error(err);
            navigate("/chat");
        }
    };

    const handleLogout = () => {
        if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            dispatch(removeUser());
        }
    };

    // xác định icon nào đang active
    const isChatActive = location.pathname.startsWith("/chat");
    const isContactActive = location.pathname.startsWith("/contact");

    return (
        <nav className="w-16 md:w-20 bg-white dark:bg-sidebar-dark border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-6 gap-8 z-20 flex-shrink-0">
            {/* Logo */}
            <div className="h-10 w-10 md:h-12 md:w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-2 cursor-pointer hover:scale-105 transition-transform">
                <span className="material-icons text-white text-2xl md:text-3xl">
                    bolt
                </span>
            </div>

            {/* Menu */}
            <div className="flex flex-col gap-6 w-full items-center flex-1">

                {/* CHAT */}
                <button
                    onClick={handleMessageClick}
                    className={`relative group p-3 rounded-xl transition-all
                        ${
                            isChatActive
                                ? "bg-blue-50 dark:bg-blue-900/20 text-primary"
                                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }
                    `}
                >
                    <span className="material-icons">chat_bubble</span>

                    <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-sidebar-dark"></span>

                    <div className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        Messages
                    </div>
                </button>

                {/* CONTACT */}
                <button
                    onClick={handleContactClick}
                    className={`relative group p-3 rounded-xl transition-all
                        ${
                            isContactActive
                                ? "bg-blue-50 dark:bg-blue-900/20 text-primary"
                                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }
                    `}
                >
                    <span className="material-icons">people</span>

                    <div className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        Peoples
                    </div>
                </button>
            </div>

            {/* Bottom */}
            <div className="flex flex-col gap-5 items-center">

                {/* Avatar */}
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

                {/* Logout */}
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