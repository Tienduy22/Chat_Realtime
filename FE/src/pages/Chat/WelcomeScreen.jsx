// components/WelcomeScreen.tsx
import React from "react";

const activities = [
    {
        type: "mention",
        userAvatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuA91jsoXPs4Pynd5taKbR8lcmeWXAjtfWFEGlccM83OnqqSJu9HQexiUBOMVKQfeE2Rm5BEzXDDcoXHzPIj4m1K0PLBNmRTQ5oE4dt7hd5NP-O9kZCp_edaAEaqYfElH9myuWV889VqRWs5FSJxREUaaXZ0BHJ3N8hf3gazfUfdN4YwedbRakzR0UZWpKwcrWrZA3iDP6kmmhXbuA58VGAwMzxDY23Nk_Q_EkZ92q5b0vKhc0eXYmwiP9D3QJweis6gd6gJNWBDa84",
        userName: "Alice",
        channel: "#design-systems",
        quote: "Hey Alex, can you take a look at the new color palette?",
        time: "10m ago",
    },
    {
        type: "upload",
        files: ["Q3_Report.pdf", "banner_v2.png"],
        channel: "Marketing Team",
        time: "2h ago",
    },
    {
        type: "missedCall",
        userAvatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBbpRhXfODfcMGaY7gYAM2NneRUt8tGMTsE-ac5aYSaZvgH8dfhVHAXQEAvyvk1TaE02KwcUOVjTphsESHvxoonAEKOIPdO-AZsCZ0g-Z20JJj50Fj374u2QGK_WKjRLJEjzUCPTwJijY8WmGJ3RYHu-0XlrlVG0emDo3wVrDQtRAKuerkZIPRwtgkGNbNwfmy9dSFPUPHyqqWzkjcoCv8IEjzlUThkRqy44n0uiZ_YaQR-PJKy6DOzefBXdXeLqaPPbFXwLOO5-v4",
        userName: "John Doe",
        time: "Yesterday",
    },
];

const WelcomeScreen = () => {
    return (
        <main className="flex-1 flex flex-col relative bg-background-light dark:bg-background-dark overflow-y-auto">
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>

            <div className="flex-1 max-w-5xl mx-auto w-full p-8 md:p-12 z-10 flex flex-col justify-center">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        You're logged in
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                        Welcome back,{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                            Alex!
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl">
                        Ready to connect? Catch up on your recent conversations
                        or start something new with your team.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {[
                        {
                            icon: "add_comment",
                            color: "blue",
                            title: "New Chat",
                            desc: "Start a new conversation...",
                        },
                        {
                            icon: "group_add",
                            color: "purple",
                            title: "Create Group",
                            desc: "Gather your team...",
                        },
                        {
                            icon: "explore",
                            color: "pink",
                            title: "Explore Channels",
                            desc: "Discover public channels...",
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className={`group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-${item.color}-500/50 dark:hover:border-${item.color}-500/50 transition-all cursor-pointer`}
                        >
                            <div
                                className={`h-12 w-12 rounded-xl bg-${item.color}-50 dark:bg-${item.color}-900/20 text-${item.color}-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                            >
                                <span className="material-icons text-2xl">
                                    {item.icon}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                {item.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Recent Activity
                        </h3>
                        <a
                            className="text-sm text-primary hover:text-blue-400 font-medium"
                            href="#"
                        >
                            View all
                        </a>
                    </div>

                    <div className="space-y-4">
                        {activities.map((act, idx) => (
                            <div
                                key={idx}
                                className="flex items-start gap-4 pb-4 border-b border-gray-100 dark:border-gray-700/50 last:border-0 last:pb-0"
                            >
                                {act.type === "mention" ||
                                act.type === "missedCall" ? (
                                    <img
                                        alt={act.userName}
                                        className={`w-10 h-10 rounded-full object-cover ${act.type === "missedCall" ? "grayscale opacity-80" : ""}`}
                                        src={act.userAvatar}
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                                        <span className="material-icons text-lg">
                                            file_upload
                                        </span>
                                    </div>
                                )}

                                <div className="flex-1">
                                    {act.type === "mention" && (
                                        <>
                                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {act.userName}
                                                </span>{" "}
                                                mentioned you in
                                                <span className="font-medium text-primary cursor-pointer hover:underline">
                                                    {" "}
                                                    {act.channel}
                                                </span>
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                "{act.quote}"
                                            </p>
                                        </>
                                    )}

                                    {act.type === "upload" && (
                                        <>
                                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                                You uploaded {act.files.length}{" "}
                                                files to
                                                <span className="font-medium text-primary cursor-pointer hover:underline">
                                                    {" "}
                                                    {act.channel}
                                                </span>
                                            </p>
                                            <div className="flex gap-2 mt-2">
                                                {act.files.map((file) => (
                                                    <div
                                                        key={file}
                                                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1"
                                                    >
                                                        <span className="material-icons text-xs">
                                                            {file.endsWith(
                                                                ".pdf"
                                                            )
                                                                ? "description"
                                                                : "image"}
                                                        </span>
                                                        {file}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {act.type === "missedCall" && (
                                        <>
                                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {act.userName}
                                                </span>{" "}
                                                missed a call from you.
                                            </p>
                                            <button className="mt-2 text-xs font-medium text-primary border border-primary/30 hover:bg-primary/5 rounded-full px-3 py-1 transition-colors">
                                                Call back
                                            </button>
                                        </>
                                    )}
                                </div>

                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                    {act.time}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default WelcomeScreen;
