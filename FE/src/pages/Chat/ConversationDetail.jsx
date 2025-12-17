import { useState } from "react";
import Avatar from "../../components/common/Avatar/Avatar";
import ConversationInfo from "./ConversationInfo";

export default function ConversationDetail() {
    const [message, setMessage] = useState("");

    return (
        <main className="flex-1 flex flex-col bg-white h-full relative min-w-0">
            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 flex flex-col min-w-0">
                    {/* HEADER */}
                    <header className="h-[72px] shrink-0 border-b border-gray-200 flex items-center justify-between px-6 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
                        <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
                            <Avatar
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCFQN2zaHoIRrGLyGCFOXC90lWAhCVL1tSNvUrecT_4KppT_8TDzExVzEP7tEgKFwwKCmPurtDEbGyHEgSTMFPEYQdgo9PTaTwrEPHCd20iBDD9Pua_H7FPRdHSzpgnHsRWcMRoePlow8TgB4WuuFNTVUiog_1Bc6Q0A_ORlKIR1v40SsXE1SCUAkQxt-4HCImVII72fWb6wH993aS4c6fIOJ43KuI8PV1R190i_AcbC6aiZVWjuYl43YoafneOoknYxHHgEpin84"
                                size="md"
                                status="online"
                            />
                            <div>
                                <h3 className="text-slate-800 text-base font-bold leading-tight">
                                    Design Team
                                </h3>
                                <p className="text-slate-500 text-xs font-medium">
                                    3 members • Active now
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {["search", "call", "videocam"].map((icon) => (
                                <button
                                    key={icon}
                                    className="size-10 rounded-lg hover:bg-gray-100 hover:text-[#135bec] transition-all flex items-center justify-center"
                                >
                                    <span className="material-symbols-outlined text-3xl text-slate-500">
                                        {icon}
                                    </span>
                                </button>
                            ))}
                            <div className="w-px h-6 bg-gray-200 mx-2" />
                            <button className="size-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl">
                                    dock_to_left
                                </span>
                            </button>
                        </div>
                    </header>

                    {/* Khu vực tin nhắn */}
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-slate-50/30">
                        <div className="flex justify-center">
                            <div className="bg-gray-200/60 text-slate-500 text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-sm">
                                Yesterday
                            </div>
                        </div>

                        <div className="flex gap-4 max-w-[80%]">
                            <Avatar
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXqhOMeUMX-5BSxKIKzVxZ8-mUSs9kO4MnJ6j62YUBL2_q3-RMs_zH-I7YwrXj9b64SaXW4JHxXF80rvM7DS2_9YbxDrXNPeUex9a1fXEAM35_LWGe3PDHZbO60gG9ajTsumX7WA2Lxm7hA9T5SLBJ3g-txaBRLDMoIECCAPobPhM3D-B86EtIrPLPKa4ld_4N4V6LsPjGFonRaMfcO8l3ndXfwjfTz_XVdx_T8CWhZEEj5xokB1gj2nWBcRL_gSv6gNojcVK5X6A"
                                size="sm"
                            />
                            <div className="flex flex-col gap-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-slate-800 text-sm font-bold">
                                        Mark Johnson
                                    </span>
                                    <span className="text-slate-500 text-[10px]">
                                        10:30 AM
                                    </span>
                                </div>
                                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none text-slate-800 text-sm leading-relaxed shadow-sm">
                                    Hey team! Just wanted to share the latest
                                    moodboard for the client project. Let me
                                    know what you think.
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 max-w-[80%] self-end flex-row-reverse">
                            <Avatar
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYFRGdE1Pxr62J8PKvzeP1eYG-0QC8aTiV3UknJQ8XvVE6eL-MHjtlBsmMX1YU-Gm_QcpXa_e6qzh21lUWIYv_hn9FZZP9Kdn-sqVnNM2nrpfAUUWWxswPL8HVGrYw1FP3QmrekcQiwr78ac9928pjBEe0_tOr_O5iXibD5HJGywN_AOC-9t56KcogMHnFipNhW7gL0-NAw9brvg4RHWUJaWi2vWSIBhdOLM8IdJkLQLSmwbXtWfo8Y-SvsBy_E7g97SQ5HnXtp1g"
                                size="sm"
                            />
                            <div className="flex flex-col gap-1 items-end">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-slate-500 text-[10px]">
                                        10:40 AM
                                    </span>
                                    <span className="text-slate-800 text-sm font-bold">
                                        You
                                    </span>
                                </div>
                                <div className="bg-[#135bec] p-3 rounded-2xl rounded-tr-none text-white text-sm leading-relaxed shadow-md shadow-[#135bec]/20">
                                    I'll have the wireframes ready by EOD. Do we
                                    need a separate mobile view for the
                                    dashboard?
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Input */}
                    <div className="p-6 pt-2 shrink-0 bg-white border-t border-gray-200">
                        <div className="bg-white rounded-2xl p-2 flex flex-col gap-2 shadow-lg">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full bg-transparent border-none focus:outline-none text-slate-800 placeholder:text-slate-500/60 resize-none h-12 py-3 px-4"
                            />
                            <div className="flex items-center justify-between px-2 pb-1">
                                <div className="flex items-center gap-1">
                                    {[
                                        "add_circle",
                                        "sentiment_satisfied",
                                        "gif_box",
                                    ].map((icon) => (
                                        <button
                                            key={icon}
                                            className="size-9 rounded-lg hover:bg-gray-100 hover:text-[#135bec] transition-all flex items-center justify-center"
                                        >
                                            <span className="material-symbols-outlined text-xl text-slate-500">
                                                {icon}
                                            </span>
                                        </button>
                                    ))}
                                    <div className="w-px h-5 bg-gray-200 mx-1" />
                                    <button className="size-9 rounded-lg hover:bg-gray-100 hover:text-[#135bec] transition-all flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xl text-slate-500">
                                            format_bold
                                        </span>
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="size-9 rounded-lg hover:bg-gray-100 hover:text-[#135bec] transition-all flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xl text-slate-500">
                                            mic
                                        </span>
                                    </button>
                                    <button className="px-4 h-9 rounded-lg bg-[#135bec] text-white font-medium flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-[#135bec]/20">
                                        <span>Send</span>
                                        <span className="material-symbols-outlined text-lg">
                                            send
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className="text-center mt-2 text-slate-500 text-[10px]">
                            Press Enter to send, Shift + Enter for new line
                        </p>
                    </div>
                </div>

                {/* ConversationInfo */}
                <div className="hidden xl:flex w-[300px] min-w-[300px] border-l border-gray-200 bg-white flex-col">
                    <ConversationInfo />
                </div>
            </div>
        </main>
    );
}
