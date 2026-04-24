import React, { useState } from "react";
import { register } from "../../services/auth.service";
import { useDispatch } from "react-redux";
import { updateUser } from "../../Redux/reducers/userReducer";

export default function Register() {
    const [username, setUsername] = useState("");
    const [fullname, setFullname] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            setLoading(false);
            return;
        }

        const registerData = {
            username,
            full_name: fullname,
            phone,
            email,
            password,
            confirm_password: confirmPassword,
        };

        try {
            const response = await register(registerData);
            dispatch(updateUser({ ...response.data.user }));

            setSuccess(response.message || "Đăng ký tài khoản thành công!");

            setUsername("");
            setFullname("");
            setPhone("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                window.location.href = "/chat";
            }, 2000);
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                "Đăng ký thất bại. Vui lòng thử lại.";

            setError(msg);
            console.error("Register error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-row font-display antialiased text-black bg-background-light">
            
            {/* Bên trái */}
            <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-8 lg:px-20 xl:px-32 w-full lg:w-1/2">
                <div className="mx-auto w-full max-w-sm lg:w-96">

                    {/* Logo */}
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

                    {/* Tiêu đề */}
                    <div>
                        <h2 className="text-3xl font-bold leading-9 tracking-tight text-black">
                            Tạo tài khoản
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-neutral-500">
                            Tham gia cuộc trò chuyện ngay lập tức.
                        </p>
                    </div>

                    {/* Hiển thị lỗi */}
                    {error && (
                        <div className="mt-6 p-4 rounded-lg bg-red-50 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <div className="mt-10">
                        <form className="space-y-5" onSubmit={handleSubmit}>

                            {/* Họ và tên */}
                            <div>
                                <label className="block text-sm font-medium leading-6 text-black mb-2">
                                    Họ và tên
                                </label>

                                <input
                                    className="block w-full rounded-lg border-0 py-3 px-4 text-black shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-black sm:text-sm"
                                    placeholder="Nguyễn Văn A"
                                    value={fullname}
                                    onChange={(e) =>
                                        setFullname(e.target.value)
                                    }
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium leading-6 text-black mb-2">
                                    Tên đăng nhập
                                </label>

                                <input
                                    className="block w-full rounded-lg border-0 py-3 px-4 text-black shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-black sm:text-sm"
                                    placeholder="nguyenvana"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Số điện thoại */}
                            <div>
                                <label className="block text-sm font-medium leading-6 text-black mb-2">
                                    Số điện thoại
                                </label>

                                <input
                                    className="block w-full rounded-lg border-0 py-3 px-4 text-black shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-black sm:text-sm"
                                    placeholder="0987 654 321"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium leading-6 text-black mb-2">
                                    Địa chỉ email
                                </label>

                                <input
                                    className="block w-full rounded-lg border-0 py-3 px-4 text-black shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-black sm:text-sm"
                                    placeholder="email@example.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Mật khẩu */}
                            <div>
                                <label className="block text-sm font-medium leading-6 text-black mb-2">
                                    Mật khẩu
                                </label>

                                <input
                                    className="block w-full rounded-lg border-0 py-3 px-4 text-black shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-black sm:text-sm"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Xác nhận mật khẩu */}
                            <div>
                                <label className="block text-sm font-medium leading-6 text-black mb-2">
                                    Xác nhận mật khẩu
                                </label>

                                <input
                                    className="block w-full rounded-lg border-0 py-3 px-4 text-black shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-black sm:text-sm"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-lg bg-black px-3 py-3 text-sm font-bold text-white shadow-sm disabled:opacity-70"
                            >
                                {loading ? "Đang đăng ký..." : "Đăng ký"}
                            </button>
                        </form>

                        {/* Link login */}
                        <p className="mt-10 text-center text-sm text-neutral-500">
                            Bạn đã có tài khoản?{" "}
                            <a
                                href="/login"
                                className="font-semibold text-black hover:underline"
                            >
                                Đăng nhập
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Bên phải hình ảnh */}
            <div className="relative hidden w-0 flex-1 lg:block">
                <div
                    className="absolute inset-0 h-full w-full bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA_ufXqLi6Up5iPvGeDEYLhGhmU-Y75qVcEuIHv_Nr4whAs3-9cAJiDP2IJLQHXhcVO2tfC7NLN9rcDNZ76e8cxsuOKmop5vW8buiXi7ZHnLqfWIQjdLmXyRipOx0--nWMjujlSFxRAD41XMReR0B4Vgfz7GbodH8I9H8-HOTLfGNA8W7ZyJj2upuCMPcrNYpzPDUPM2Axl38HDffbRez3JuEsVMcC7jmhfBOXLRAfjHCxHdZIHReimYsmrHP--uo7vqBABt56ajXE')",
                    }}
                ></div>
            </div>
        </div>
    );
}