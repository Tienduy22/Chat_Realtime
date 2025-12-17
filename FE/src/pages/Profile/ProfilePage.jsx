import React, { useState } from "react";

const ProfilePage = () => {
    const [allowDM, setAllowDM] = useState(true);
    const [twoFA, setTwoFA] = useState(false);
    const [desktopNotif, setDesktopNotif] = useState(true);
    const [theme, setTheme] = useState("light"); // light, dark, system

    const user = {
        name: "Alex Morgan",
        username: "@alex_designer",
        avatarUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAqteunEA2n9J1BAuwXzXB5UWLwCEUeDLfQ9anxRJnWDMsNq6_j_PJkgPpdx4mX2r_QAmMC2KODy-5UbWSroGZ-EuR3I8IhBKl0DW7DeV-TvbMilw3wjeHFs7p3hnbv62Jzd4cXm3HlQu4LetKfd8qA1KhpupGfOWX_2C5NEJMJh33d4s9fFOEon2em8B_tzxgzuR4Dd8y58g6e2zIX0xxX2CUuPZdpC1PnA7aAJGORLj55ujMiXJ59Z2juQJJi7QPnWvYUFnhB0UA",
    };

    return (
        <main className="flex-1 flex flex-col bg-background-light h-full relative min-w-0">
            <header className="h-[72px] shrink-0 border-b border-border-light flex items-center justify-between px-8 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
                <h3 className="text-text-main text-lg font-bold">My Account</h3>
                <button className="size-8 flex items-center justify-center rounded-full text-text-secondary hover:bg-gray-100 hover:text-text-main transition-all">
                    <span className="material-symbols-outlined text-[24px]">
                        close
                    </span>
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full">
                {/* Profile Banner & Avatar */}
                <div className="rounded-2xl bg-white mb-8 overflow-hidden shadow-lg border border-border-light">
                    <div className="h-32 w-full bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 relative">
                        <button className="absolute top-4 right-4 bg-white/80 hover:bg-white backdrop-blur-md text-text-main shadow-sm px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all border border-transparent hover:border-gray-200">
                            <span className="material-symbols-outlined text-[16px]">
                                edit
                            </span>
                            Edit Banner
                        </button>
                    </div>
                    <div className="px-6 pb-6 relative">
                        <div className="flex justify-between items-end -mt-10 mb-4">
                            <div className="relative">
                                <div
                                    className="size-24 rounded-full border-4 border-white bg-cover bg-center shadow-md"
                                    style={{
                                        backgroundImage: `url("${user.avatarUrl}")`,
                                    }}
                                />
                                <button className="absolute bottom-0 right-0 size-8 bg-white hover:bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-text-main transition-colors shadow-lg">
                                    <span className="material-symbols-outlined text-[14px]">
                                        photo_camera
                                    </span>
                                </button>
                            </div>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 bg-primary hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-primary/20">
                                    Edit User Profile
                                </button>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-text-main">
                                {user.name}
                            </h2>
                            <p className="text-text-secondary text-sm font-mono mt-1">
                                {user.username}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form chỉnh sửa */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase mb-2">
                                Display Name
                            </label>
                            <input
                                className="w-full bg-white border border-border-light focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-text-main text-sm transition-all shadow-sm"
                                type="text"
                                defaultValue="Alex Morgan"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase mb-2">
                                Email Address
                            </label>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 bg-gray-50 border border-border-light rounded-xl px-4 py-3 text-text-secondary text-sm cursor-not-allowed"
                                    disabled
                                    type="email"
                                    value="alex***@zapchat.com"
                                />
                                <button className="px-4 py-2 bg-white border border-border-light hover:bg-gray-50 text-text-main text-sm font-medium rounded-xl transition-colors shadow-sm">
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase mb-2">
                                Phone Number
                            </label>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 bg-gray-50 border border-border-light rounded-xl px-4 py-3 text-text-secondary text-sm cursor-not-allowed"
                                    disabled
                                    type="text"
                                    value="********89"
                                />
                                <button className="px-4 py-2 bg-white border border-border-light hover:bg-gray-50 text-text-main text-sm font-medium rounded-xl transition-colors shadow-sm">
                                    Edit
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase mb-2">
                                Password
                            </label>
                            <button className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 border border-border-light rounded-xl text-primary text-sm font-medium transition-all shadow-sm">
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>

                <hr className="border-border-light mb-10" />

                {/* Appearance */}
                <div className="mb-10">
                    <h3 className="text-text-main text-lg font-bold mb-4">
                        Appearance
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Light */}
                        <div
                            className="group cursor-pointer"
                            onClick={() => setTheme("light")}
                        >
                            <div
                                className={`h-24 rounded-xl bg-white border-2 ${theme === "light" ? "border-primary" : "border-transparent"} relative overflow-hidden mb-2 shadow-lg ${theme === "light" ? "shadow-primary/5" : ""}`}
                            >
                                {theme === "light" && (
                                    <div className="absolute top-0 right-0 p-1 bg-primary rounded-bl-lg">
                                        <span className="material-symbols-outlined text-white text-[14px]">
                                            check
                                        </span>
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 right-8 h-2 bg-gray-100 rounded-md border border-gray-100"></div>
                                <div className="absolute top-6 left-2 right-2 bottom-2 bg-white rounded-md border border-gray-200 shadow-sm"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className={`size-4 rounded-full ${theme === "light" ? "border-[5px] border-primary bg-white" : "border border-gray-400"}`}
                                ></div>
                                <span
                                    className={`text-sm font-medium ${theme === "light" ? "text-text-main" : "text-text-secondary"}`}
                                >
                                    Light
                                </span>
                            </div>
                        </div>

                        {/* Dark */}
                        <div
                            className="group cursor-pointer"
                            onClick={() => setTheme("dark")}
                        >
                            <div
                                className={`h-24 rounded-xl bg-gray-900 border-2 ${theme === "dark" ? "border-gray-300" : "border-transparent"} group-hover:border-gray-300 transition-all relative overflow-hidden mb-2 shadow-sm`}
                            >
                                <div className="absolute top-2 left-2 right-8 h-2 bg-gray-800 rounded-md"></div>
                                <div className="absolute top-6 left-2 right-2 bottom-2 bg-gray-800 rounded-md border border-gray-700"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-4 rounded-full border border-gray-400"></div>
                                <span className="text-text-secondary text-sm font-medium">
                                    Dark
                                </span>
                            </div>
                        </div>

                        {/* System */}
                        <div
                            className="group cursor-pointer"
                            onClick={() => setTheme("system")}
                        >
                            <div className="h-24 rounded-xl bg-gradient-to-br from-white to-gray-200 border-2 border-transparent group-hover:border-gray-300 transition-all relative overflow-hidden mb-2 opacity-80 border border-gray-100">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-text-secondary text-3xl">
                                        desktop_windows
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-4 rounded-full border border-gray-400"></div>
                                <span className="text-text-secondary text-sm font-medium">
                                    Sync with System
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-border-light mb-10" />

                {/* Privacy & Defaults */}
                <div className="mb-12">
                    <h3 className="text-text-main text-lg font-bold mb-6">
                        Privacy &amp; Defaults
                    </h3>
                    <div className="space-y-6">
                        {/* Toggle Allow DM */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-main text-sm font-medium">
                                    Allow direct messages from server members
                                </p>
                                <p className="text-text-secondary text-xs mt-0.5">
                                    This setting is applied when you join a new
                                    server.
                                </p>
                            </div>
                            <button
                                onClick={() => setAllowDM(!allowDM)}
                                className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${allowDM ? "bg-primary" : "bg-gray-200"}`}
                            >
                                <div
                                    className={`size-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${allowDM ? "right-1" : "left-1"}`}
                                ></div>
                            </button>
                        </div>

                        {/* Toggle 2FA */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-main text-sm font-medium">
                                    Enable Two-Factor Authentication
                                </p>
                                <p className="text-text-secondary text-xs mt-0.5">
                                    Protect your account with an extra layer of
                                    security.
                                </p>
                            </div>
                            <button
                                onClick={() => setTwoFA(!twoFA)}
                                className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer hover:bg-gray-300 ${twoFA ? "bg-primary" : "bg-gray-200"}`}
                            >
                                <div
                                    className={`size-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${twoFA ? "right-1" : "left-1"}`}
                                ></div>
                            </button>
                        </div>

                        {/* Toggle Desktop Notifications */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-main text-sm font-medium">
                                    Desktop Notifications
                                </p>
                                <p className="text-text-secondary text-xs mt-0.5">
                                    Show pop-up notifications on your desktop.
                                </p>
                            </div>
                            <button
                                onClick={() => setDesktopNotif(!desktopNotif)}
                                className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${desktopNotif ? "bg-primary" : "bg-gray-200"}`}
                            >
                                <div
                                    className={`size-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${desktopNotif ? "right-1" : "left-1"}`}
                                ></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProfilePage;
