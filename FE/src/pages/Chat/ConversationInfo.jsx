import Avatar from "../../components/common/Avatar/Avatar";
import { X } from "lucide-react";

export default function ConversationInfo({ onClose }) {
    return (
        <div className="w-full h-full bg-white flex flex-col">
            {/* Header với nút đóng */}
            <div className="h-[72px] shrink-0 border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-10 shadow-sm">
                <h3 className="text-slate-800 text-base font-bold">
                    Thông tin hội thoại
                </h3>

                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors xl:hidden"
                    title="Đóng"
                >
                    <X size={20} className="text-gray-600" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center">
                {/* Nội dung còn lại của ConversationInfo giữ nguyên */}
                <div className="flex flex-col items-center gap-3 mb-6 w-full">
                    <div className="relative">
                        <Avatar
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCFQN2zaHoIRrGLyGCFOXC90lWAhCVL1tSNvUrecT_4KppT_8TDzExVzEP7tEgKFwwKCmPurtDEbGyHEgSTMFPEYQdgo9PTaTwrEPHCd20iBDD9Pua_H7FPRdHSzpgnHsRWcMRoePlow8TgB4WuuFNTVUiog_1Bc6Q0A_ORlKIR1v40SsXE1SCUAkQxt-4HCImVII72fWb6wH993aS4c6fIOJ43KuI8PV1R190i_AcbC6aiZVWjuYl43YoafneOoknYxHHgEpin84"
                            size="xl"
                        />
                        <div className="absolute bottom-1 right-1 size-6 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center">
                            <button className="size-5 bg-gray-100 hover:bg-[#135bec] rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-xs">
                                    edit
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="text-center">
                        <h4 className="text-slate-800 text-lg font-bold">
                            Design Team
                        </h4>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            {["notifications_off", "push_pin", "group_add"].map(
                                (icon) => (
                                    <button
                                        key={icon}
                                        className="size-9 rounded-full bg-gray-100 hover:bg-[#135bec]/10 hover:text-[#135bec] transition-all border border-gray-200 flex items-center justify-center"
                                    >
                                        <span className="material-symbols-outlined text-xl text-slate-500">
                                            {icon}
                                        </span>
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Phần còn lại giữ nguyên như code cũ của bạn */}
                <div className="w-full h-px bg-gray-200 mb-6" />

                <div className="w-full mb-6">
                    <div className="flex items-center justify-between mb-3 cursor-pointer group">
                        <h5 className="text-slate-800 text-sm font-semibold">
                            Media & Files
                        </h5>
                        <span className="material-symbols-outlined text-slate-500 group-hover:text-slate-800 text-xl transition-colors">
                            expand_more
                        </span>
                    </div>

                    {/* ... phần tab Media/Files/Links và grid ảnh ... */}
                </div>

                {/* Các nút khác: Search, Notification, Privacy */}
                <div className="w-full flex flex-col gap-1">
                    {[
                        { icon: "search", label: "Search in conversation" },
                        { icon: "notifications", label: "Notification settings" },
                        { icon: "lock", label: "Privacy & Security" },
                    ].map((item) => (
                        <button
                            key={item.icon}
                            className="flex items-center justify-between w-full p-2.5 rounded-lg hover:bg-gray-50 group transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center text-slate-500 group-hover:text-[#135bec] group-hover:bg-[#135bec]/10 transition-colors border border-gray-100">
                                    <span className="material-symbols-outlined text-lg">
                                        {item.icon}
                                    </span>
                                </div>
                                <span className="text-slate-500 group-hover:text-slate-800 text-sm font-medium">
                                    {item.label}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}