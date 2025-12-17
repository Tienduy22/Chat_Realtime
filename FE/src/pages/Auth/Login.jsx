import React, { useState } from "react";
import { login } from "../../services/auth.service";
import { useDispatch } from "react-redux";
import { updateUser } from "../../Redux/reducers/userReducer";


export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await login({
                username: username, 
                password: password,
            });
            dispatch(updateUser({ ...response.data.user }))

            if (response.success) {
                window.location.href = "/chat";
                alert("Đăng nhập thành công!"); 
            }
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                "Đăng nhập thất bại. Vui lòng thử lại.";
            setError(msg);
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex min-h-screen w-full flex-row overflow-hidden font-display bg-gray-50 text-gray-900">
                {/* Left Side: Login Form */}
                <div className="relative flex w-full flex-col justify-center bg-white p-8 md:w-1/2 lg:w-[500px] xl:w-[600px] shrink-0 border-r border-gray-200">
                    <div className="mx-auto flex w-full max-w-[420px] flex-col gap-6">
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

                        {/* Page Heading */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-bold leading-tight tracking-tight text-black">
                                Welcome back
                            </h1>
                            <p className="text-base font-normal text-gray-500">
                                Please enter your details to sign in to zapChat.
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form
                            className="flex flex-col gap-4 mt-2"
                            onSubmit={handleSubmit}
                        >
                            {/* Email Input */}
                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-medium leading-normal text-gray-700">
                                    Username
                                </span>
                                <input
                                    className="flex w-full h-12 rounded-lg border border-gray-300 bg-white px-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                                    placeholder="peter1996"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </label>

                            {/* Password Input */}
                            <div>
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium leading-normal text-gray-700">
                                        Password
                                    </span>
                                    <div className="relative">
                                        <input
                                            className="flex w-full h-12 rounded-lg border border-gray-300 bg-white px-4 pr-12 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                                            placeholder="Enter your password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors focus:outline-none"
                                            disabled={loading}
                                        >
                                            {showPassword ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </label>

                                <div className="flex justify-end pt-2">
                                    <a
                                        href="#"
                                        className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
                                    >
                                        Forgot Password?
                                    </a>
                                </div>
                            </div>

                            {/* Sign In Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 flex w-full h-12 items-center justify-center rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed gap-2 text-sm font-bold tracking-[0.015em] transition-all"
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </button>

                            {/* Divider & Google Button giữ nguyên */}
                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200"></span>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-500 font-medium">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="flex w-full h-12 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-black hover:bg-gray-50 gap-2 text-sm font-bold tracking-[0.015em] transition-all"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span className="truncate">Google</span>
                            </button>

                            {/* Sign Up Link */}
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-500">
                                    Don't have an account?{" "}
                                    <a
                                        href="/register"
                                        className="font-bold text-black hover:underline"
                                    >
                                        Sign up
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Footer Links */}
                    <div className="absolute bottom-8 left-0 w-full text-center">
                        <div className="flex justify-center gap-6 text-xs text-gray-400">
                            <a href="#" className="hover:text-black">
                                Terms
                            </a>
                            <a href="#" className="hover:text-black">
                                Privacy
                            </a>
                            <a href="#" className="hover:text-black">
                                Help
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Side: Hero Image - giữ nguyên */}
                <div className="relative hidden w-0 flex-1 bg-gray-100 lg:block">
                    <div
                        className="absolute inset-0 h-full w-full bg-cover bg-center"
                        style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDqap-AMDjZge02V0ynRrwyMQxLJd-hw2kq2ws0fPtM4gMKQGQ4eHbvpKlLaXwuJsOFiNQVdTCcwzdBWZx01vjcHSGvGXVa8N2mU4RUqZjevMMk-ZucqX9bEBGP0KG0ZNbM6RrdhFtCyBt41wfpPHmLLEoCX0RuSK7M9-4KWgfl_Cj_qOofbYEEfwc8m3mta7R1wR1NYsd-Hb0IMUl4F-MptW6PpSwtELwFByBTvOyrepXYoGhrMf2RCYVvTrMXQPiTL8bGBhfLDh4")',
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-12 text-white">
                        <div className="max-w-[480px]">
                            <div className="mb-4 inline-flex items-center rounded-full bg-white/20 px-3 py-1 backdrop-blur-md">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-2 h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                                <span className="text-xs font-medium">
                                    Real-time collaboration
                                </span>
                            </div>
                            <h2 className="mb-4 text-4xl font-bold leading-tight">
                                Connect instantly with your team using zapChat.
                            </h2>
                            <p className="text-lg text-white/90">
                                Experience seamless communication, file sharing,
                                and project coordination all in one place. Join
                                thousands of teams moving faster.
                            </p>
                            <div className="mt-8 flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {/* avatars giữ nguyên */}
                                </div>
                                <div className="text-sm font-medium">
                                    Active users today
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
