import React, { useState } from "react";
import { login } from "../../services/auth.service";
import { useDispatch } from "react-redux";
import { updateUser } from "../../Redux/reducers/userReducer";
import { sendOTP, confirmOTP, newPassword } from "../../services/auth.service";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const [showForgotModal, setShowForgotModal] = useState(false);
    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPass, setNewPass] = useState("");

    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotError, setForgotError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await login({
                username: username,
                password: password,
            });

            dispatch(updateUser({ ...response.data.user }));

            if (response.success) {
                window.location.href = "/chat";
            }
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                "Đăng nhập thất bại. Vui lòng thử lại.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async () => {
        setForgotError("");
        setForgotLoading(true);

        try {
            await sendOTP({ email });
            setStep(2);
        } catch (err) {
            setForgotError(err.response?.data?.message || "Không thể gửi OTP");
        } finally {
            setForgotLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setForgotError("");
        setForgotLoading(true);

        try {
            await confirmOTP({ email, otp });
            setStep(3);
        } catch (err) {
            setForgotError(err.response?.data?.message || "OTP không hợp lệ");
        } finally {
            setForgotLoading(false);
        }
    };

    const handleNewPassword = async () => {
        setForgotError("");
        setForgotLoading(true);

        try {
            await newPassword({
                email,
                password: newPass,
            });

            setShowForgotModal(false);
            setStep(1);
            setEmail("");
            setOtp("");
            setNewPass("");
        } catch (err) {
            setForgotError(
                err.response?.data?.message || "Không thể đổi mật khẩu"
            );
        } finally {
            setForgotLoading(false);
        }
    };

    return (
        <>
            <div className="flex min-h-screen w-full flex-row overflow-hidden font-display bg-gray-50 text-gray-900">

                {/* FORM ĐĂNG NHẬP */}
                <div className="relative flex w-full flex-col justify-center bg-white p-8 md:w-1/2 lg:w-[500px] xl:w-[600px] shrink-0 border-r border-gray-200">
                    <div className="mx-auto flex w-full max-w-[420px] flex-col gap-6">

                        {/* LOGO */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white overflow-hidden">
                                <img
                                    src="/assets/images/logo.png"
                                    alt="zapChat Logo"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-black">
                                zapChat
                            </span>
                        </div>

                        {/* TIÊU ĐỀ */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-bold leading-tight tracking-tight text-black">
                                Chào mừng trở lại
                            </h1>

                            <p className="text-base font-normal text-gray-500">
                                Vui lòng nhập thông tin để đăng nhập vào zapChat.
                            </p>
                        </div>

                        {/* LỖI */}
                        {error && (
                            <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit}>

                            {/* USERNAME */}
                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Tên đăng nhập
                                </span>

                                <input
                                    className="flex w-full h-12 rounded-lg border border-gray-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                                    placeholder="Nhập tên đăng nhập"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </label>

                            {/* PASSWORD */}
                            <div>
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        Mật khẩu
                                    </span>

                                    <div className="relative">
                                        <input
                                            className="flex w-full h-12 rounded-lg border border-gray-300 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                                            placeholder="Nhập mật khẩu"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        >
                                            👁
                                        </button>
                                    </div>
                                </label>

                                <button
                                    type="button"
                                    onClick={() => setShowForgotModal(true)}
                                    className="text-sm font-medium text-gray-500 hover:text-black"
                                >
                                    Quên mật khẩu?
                                </button>
                            </div>

                            {/* BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 flex w-full h-12 items-center justify-center rounded-lg bg-black text-white hover:bg-gray-800"
                            >
                                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </button>

                            {/* OR */}
                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t"></span>
                                </div>

                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-500">
                                        Hoặc tiếp tục với
                                    </span>
                                </div>
                            </div>

                            {/* GOOGLE */}
                            <button
                                type="button"
                                className="flex w-full h-12 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-black hover:bg-gray-50 gap-2"
                            >
                                Đăng nhập với Google
                            </button>

                            {/* REGISTER */}
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-500">
                                    Bạn chưa có tài khoản?{" "}
                                    <a
                                        href="/register"
                                        className="font-bold text-black hover:underline"
                                    >
                                        Đăng ký
                                    </a>
                                </p>
                            </div>

                        </form>
                    </div>
                </div>

                {/* ẢNH BÊN PHẢI */}
                <div className="relative hidden w-0 flex-1 bg-gray-100 lg:block">

                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDqap-AMDjZge02V0ynRrwyMQxLJd-hw2kq2ws0fPtM4gMKQGQ4eHbvpKlLaXwuJsOFiNQVdTCcwzdBWZx01vjcHSGvGXVa8N2mU4RUqZjevMMk-ZucqX9bEBGP0KG0ZNbM6RrdhFtCyBt41wfpPHmLLEoCX0RuSK7M9-4KWgfl_Cj_qOofbYEEfwc8m3mta7R1wR1NYsd-Hb0IMUl4F-MptW6PpSwtELwFByBTvOyrepXYoGhrMf2RCYVvTrMXQPiTL8bGBhfLDh4")'
                        }}
                    />

                    <div className="absolute bottom-0 left-0 w-full p-12 text-white">

                        <h2 className="mb-4 text-4xl font-bold">
                            Kết nối ngay lập tức với đội nhóm của bạn bằng zapChat
                        </h2>

                        <p className="text-lg text-white/90">
                            Trải nghiệm nhắn tin, chia sẻ tệp và làm việc nhóm trong
                            một nền tảng duy nhất.
                        </p>

                        <div className="mt-8 text-sm font-medium">
                            Người dùng đang hoạt động hôm nay
                        </div>

                    </div>
                </div>
            </div>

            {/* MODAL QUÊN MẬT KHẨU */}
            {showForgotModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white rounded-xl p-6 w-[400px]">

                        <h2 className="text-xl font-bold mb-4">
                            Khôi phục mật khẩu
                        </h2>

                        {forgotError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded mb-3 text-sm">
                                {forgotError}
                            </div>
                        )}

                        {step === 1 && (
                            <>
                                <input
                                    type="email"
                                    placeholder="Nhập email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 mb-4"
                                />

                                <button
                                    onClick={handleSendOTP}
                                    className="w-full bg-black text-white py-2 rounded-lg"
                                >
                                    Gửi mã OTP
                                </button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Nhập mã OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 mb-4"
                                />

                                <button
                                    onClick={handleVerifyOTP}
                                    className="w-full bg-black text-white py-2 rounded-lg"
                                >
                                    Xác nhận OTP
                                </button>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <input
                                    type="password"
                                    placeholder="Nhập mật khẩu mới"
                                    value={newPass}
                                    onChange={(e) => setNewPass(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 mb-4"
                                />

                                <button
                                    onClick={handleNewPassword}
                                    className="w-full bg-black text-white py-2 rounded-lg"
                                >
                                    Đổi mật khẩu
                                </button>
                            </>
                        )}

                        <div className="text-center mt-4">
                            <button
                                onClick={() => setShowForgotModal(false)}
                                className="text-sm text-gray-500"
                            >
                                Đóng
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}