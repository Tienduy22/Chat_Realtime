import React from "react";

const WelcomeScreen = () => {
    return (
        <div className="bg-[#f5f6f7] text-[#2c2f30] min-h-screen flex flex-col overflow-hidden font-['Plus_Jakarta_Sans']">
            {/* MAIN */}
            <main className="flex-grow flex items-center justify-center px-6 relative">
                {/* background blur */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#0058bb]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#6c9fff]/10 rounded-full blur-[100px]" />

                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* IMAGE SIDE */}
                    <div className="lg:col-span-7 relative">
                        <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl aspect-[4/3] group">
                            <img
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrL2esJorHOJoUyeOoR16H7O4RMmbtBau4JDy2LAkq2rDUcRgsKVviFKnaEhouEUHU4DzaRkBUusYlQWZ8ATz9SOGnDg_jv8C0qDqn6RtmnTsyKJNmfpNtEwi3otW2lSsbDO8XLzo1BfKNkY0XSIv5j1GFnjsqBoCi4sbdiRiT-s3yrjJZIM6wjjTnlxZUpZQk68pGbcVk67luZFVMBS8rsYOES1knmqgfUnJ5lCIoVgpsJavBJEDlJwNLVrgIiOIlJ3YcvCm5vS1d"
                                alt=""
                            />

                            {/* floating card */}
                            <div className="absolute bottom-6 left-6 p-4 backdrop-blur-xl bg-white/80 rounded-xl border border-white/20 shadow-xl flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    <img
                                        className="w-10 h-10 rounded-full border-2 border-white"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQeVF1eD1pAHxZoRp89Ff7zXIjd3BC2jU05vqc1LhcBndcqILnGBxBE9IvBaZsLVFelt1yKWiO85TTxtdy4QVe90qX1Tx7p4dxZxoi7YHKzKUa4hrJcQ8hBOnMCx1j_cig_C3I8rKoXxsXrKezW1YAVsQfyKJX1s-WjeVA7bGQHCul2FRGSdDApmRDJgGmqGrNZLyrrfSWSUf5MjE6oUGUQuSkqIBppjNZE7IvTG4xXdgR2VlFyiE7ZPkZ0iCUfu4YbJVLK7eiReBh"
                                        alt=""
                                    />

                                    <img
                                        className="w-10 h-10 rounded-full border-2 border-white"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqkkCldfO_nzRKTqkeQpLrLaNwQ32MVG-IKCnJuufjBFV37cWP-XDQswYeW1FrZ6bDgs2vKQMTGgEjos2vUsn_GN3MXhfiKDv6TSv_SotEjK0-RJU8soQ21L1W4V5UP9MHKPKJTYc54GmBCys4r9xYs6cRC7uziuw7Q6yeQX12ufDHn0ECGCkbm5k7EOl5mIkIKWtdBM8P1-10W6TNnxe0cbpIMs8a2Q4eSeOIDKMoQNjYtTQFBtw9IscUVgvHDTT4g05W9iVoiADs"
                                        alt=""
                                    />

                                    <div className="w-10 h-10 rounded-full bg-[#6c9fff] flex items-center justify-center text-xs font-bold border-2 border-white">
                                        +12
                                    </div>
                                </div>

                                <div className="text-sm">
                                    <p className="font-bold">Đang trực tuyến</p>
                                    <p className="text-[#595c5d] text-xs">
                                        Tham gia cùng bạn bè
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#0058bb]/10 rounded-full blur-2xl" />
                    </div>

                    {/* CONTENT */}
                    <div className="lg:col-span-5 text-center lg:text-left space-y-8">
                        <div className="space-y-4">
                            <span className="px-4 py-1.5 bg-[#d2e6ef] text-[#42545c] rounded-full text-xs font-bold uppercase">
                                Thế hệ kết nối mới
                            </span>

                            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                                Chào mừng bạn đến với
                                <span className="text-[#0058bb]">
                                    {" "}
                                    Zapchat
                                </span>
                            </h1>

                            <p className="text-lg text-[#595c5d] max-w-md mx-auto lg:mx-0">
                                Hãy bắt đầu những cuộc trò chuyện tuyệt vời ngay
                                bây giờ. Kết nối, chia sẻ và lưu giữ những
                                khoảnh khắc quý giá.
                            </p>
                        </div>

                        {/* buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <button
                                className="w-full sm:w-auto px-10 py-5 text-white font-bold rounded-full flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1 transition-all"
                                style={{
                                    background:
                                        "linear-gradient(135deg,#0058bb 0%,#6c9fff 100%)",
                                }}
                            >
                                Vào phòng chat →
                            </button>

                            <button className="w-full sm:w-auto px-8 py-5 bg-[#e0e3e4] text-[#42545c] font-bold rounded-full hover:bg-[#dadddf] transition-colors">
                                Khám phá thêm
                            </button>
                        </div>

                        {/* features */}
                        <div className="pt-6 flex items-center gap-6 justify-center lg:justify-start">
                            <div className="flex items-center gap-2">
                                🔒
                                <span className="text-sm text-[#595c5d]">
                                    Bảo mật 100%
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                ⚡
                                <span className="text-sm text-[#595c5d]">
                                    Tốc độ cao
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WelcomeScreen;
