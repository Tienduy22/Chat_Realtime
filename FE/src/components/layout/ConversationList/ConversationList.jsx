// components/ConversationList.tsx
import React from "react";

const conversations = [
    {
        name: "Design Team",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCN_0CHHhQxTeLnb4wqtIds3L44P0z3ebotZvCbFtcP3APeYv_Z9ETH7wWO7O1UzoAz3KE2-klhi-jmwvmMheOxciK1QFRaqOGNzM6Krb7gPrE9sC54Am-e3X-H4PP9_d9ZlVzJ8c0IjgH0WIP93DISS-9MpW5040xqOanbXjC_zlEKNnKir4Ve_8hQxJSVuR--Q0mhl8NULcFMN1GPfRoksD3V2y76jWRKm_oDcUCUSN5dy218j-UZ5uE6970qAZ0CSJ55LiV-60o",
        message: "Alice: Can we review the new mock...",
        time: "10:42 AM",
        online: true,
        highlighted: true,
    },
    {
        name: "John Doe",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVKDqU3sg3MelyGfDYF_1ZZ61bbF1Ma8zNooQGwqk7IhfncUG726gV7_S0QayrM6xyGuOmnNZr0PATG0LcO-SkSirsQoIHLKzPSvzcTkWrtZFyhoXJdsoLb1XOJrjhZ-TbZYjAJ2F8KkJdGsjJ60kFPiudcVhS51QuEHG6fanaDarTUZMg_rLe0Ud1Oj2IVn21JfBAHJ8BJI2UhwdiNTmnIBVzXxENduQDh_1z_PTlEEkWlp_TnTBlQ_BM8vKQqELfO5gP-aQGwX8",
        message: "Hey, are you free for a call?",
        time: "Yesterday",
        online: false,
        away: true,
    },
    {
        name: "Product Updates",
        initials: "PU",
        message: "New version released! Check th...",
        time: "2m ago",
        unread: 2,
    },
    {
        name: "Sarah Connor",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnk0YPLCR4KchzvPBxg_8qZ8xv2QDdQQiFCkqZYYh_ALqSqu1VvrueoCmlHBwLJ7qm9b6Xg6i2KFjKFIbDLPT_p6Dftcc06c3QsCPqwSkWHX7_C5OeM88UjZtMazQr68QRFVnenqN284HR5kq3fdVUFgVZ5gZ_9oQPiK8GVSyztFwclnRSb-_p_VTQb8acDYK4dZpVBsRUDqzK0KjVOXZKLN2w7qdl77AevpvleQbTkZVrhxT6KdHv-EgmHAdiziq44BrvKiiJ0gg",
        message: "The files have been uploaded.",
        time: "Mon",
    },
    {
        name: "Team Alpha",
        group: true,
        message: "Meeting rescheduled to Friday.",
        time: "Last week",
    },
];

const ConversationList = () => {
    return (
        <aside className="w-80 bg-gray-50 dark:bg-sidebar-panel-dark border-r border-gray-200 dark:border-gray-800 flex flex-col hidden lg:flex flex-shrink-0">
            <div className="p-6 pb-2">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Messages
                    </h2>
                    <button className="text-gray-400 hover:text-primary transition-colors">
                        <span className="material-icons text-xl">
                            edit_square
                        </span>
                    </button>
                </div>

                <div className="relative mb-6">
                    <span className="material-icons absolute left-3 top-2.5 text-gray-400 text-lg">
                        search
                    </span>
                    <input
                        className="w-full bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:text-gray-200 placeholder-gray-400 transition-all"
                        placeholder="Search conversations..."
                        type="text"
                    />
                </div>

                <div className="flex gap-2 mb-4">
                    <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-xs font-medium rounded-lg transition-colors">
                        All
                    </button>
                    <button className="px-3 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white text-xs font-medium rounded-lg transition-colors">
                        Unread
                    </button>
                    <button className="px-3 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white text-xs font-medium rounded-lg transition-colors">
                        Groups
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                {conversations.map((conv, idx) => (
                    <div
                        key={idx}
                        className={`group p-3 rounded-xl ${
                            conv.highlighted
                                ? "bg-white dark:bg-gray-800/60 shadow-sm border border-gray-100 dark:border-gray-700/50"
                                : "hover:bg-white dark:hover:bg-gray-800/40 border border-transparent hover:border-gray-100 dark:hover:border-gray-700/30"
                        } cursor-pointer transition-all`}
                    >
                        <div className="flex gap-3">
                            <div className="relative">
                                {conv.avatar ? (
                                    <img
                                        alt={conv.name}
                                        className={`w-10 h-10 rounded-full object-cover ${conv.away ? "grayscale opacity-80" : ""}`}
                                        src={conv.avatar}
                                    />
                                ) : conv.group ? (
                                    <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                                        <span className="material-icons text-base">
                                            groups
                                        </span>
                                    </div>
                                ) : (
                                    <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-indigo-900 text-white font-bold text-xs">
                                        {conv.initials}
                                    </div>
                                )}
                                {conv.online && (
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                                )}
                                {conv.away && (
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-yellow-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                                )}
                                {!conv.online && !conv.away && !conv.group && (
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gray-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3
                                        className={`text-sm font-${conv.unread ? "semibold" : "medium"} text-gray-${conv.unread ? "900 dark:white" : "700 dark:gray-200"} truncate`}
                                    >
                                        {conv.name}
                                    </h3>
                                    <span
                                        className={`text-xs ${conv.time === "2m ago" ? "text-blue-500 font-medium" : "text-gray-400"}`}
                                    >
                                        {conv.time}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p
                                        className={`text-xs ${conv.unread ? "text-gray-900 dark:text-white font-medium" : "text-gray-500 dark:text-gray-500"} truncate`}
                                    >
                                        {conv.message}
                                    </p>
                                    {conv.unread && (
                                        <span className="bg-primary text-white text-[10px] h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center">
                                            {conv.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default ConversationList;
