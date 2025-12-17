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
    const dispatch = useDispatch()

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
            dispatch(updateUser({ ...response.data.user }))

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
        <>
            <div className="relative flex min-h-screen w-full flex-row font-display antialiased text-primary bg-background-light">
                {/* Left Side: Registration Form */}
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

                        {/* Header */}
                        <div>
                            <h2 className="text-3xl font-bold leading-9 tracking-tight text-primary">
                                Create your account
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-neutral-500">
                                Join the conversation instantly.{" "}
                                <a
                                    className="font-semibold text-primary hover:underline"
                                    href="#"
                                >
                                    Start your 14-day free trial
                                </a>
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-6 p-4 rounded-lg bg-red-50 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <div className="mt-10">
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                {/* Full Name */}
                                <div>
                                    <label
                                        className="block text-sm font-medium leading-6 text-primary mb-2"
                                        htmlFor="fullname"
                                    >
                                        Full Name
                                    </label>
                                    <div className="relative rounded-lg shadow-sm">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className="material-symbols-outlined text-neutral-400 text-[20px]">
                                                person
                                            </span>
                                        </div>
                                        <input
                                            className="block w-full rounded-lg border-0 py-3 pl-10 text-primary shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                            id="fullname"
                                            placeholder="John Doe"
                                            type="text"
                                            value={fullname}
                                            onChange={(e) =>
                                                setFullname(e.target.value)
                                            }
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Username */}
                                <div>
                                    <label
                                        className="block text-sm font-medium leading-6 text-primary mb-2"
                                        htmlFor="username"
                                    >
                                        Username
                                    </label>
                                    <div className="relative rounded-lg shadow-sm">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className="material-symbols-outlined text-neutral-400 text-[20px]">
                                                alternate_email
                                            </span>
                                        </div>
                                        <input
                                            className="block w-full rounded-lg border-0 py-3 pl-10 text-primary shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                            id="username"
                                            placeholder="johndoe"
                                            type="text"
                                            value={username}
                                            onChange={(e) =>
                                                setUsername(e.target.value)
                                            }
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label
                                        className="block text-sm font-medium leading-6 text-primary mb-2"
                                        htmlFor="phone"
                                    >
                                        Phone Number
                                    </label>
                                    <div className="relative rounded-lg shadow-sm">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className="material-symbols-outlined text-neutral-400 text-[20px]">
                                                phone
                                            </span>
                                        </div>
                                        <input
                                            className="block w-full rounded-lg border-0 py-3 pl-10 text-primary shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                            id="phone"
                                            placeholder="+84 123 456 789"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(e.target.value)
                                            }
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        className="block text-sm font-medium leading-6 text-primary mb-2"
                                        htmlFor="email"
                                    >
                                        Email address
                                    </label>
                                    <div className="relative rounded-lg shadow-sm">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className="material-symbols-outlined text-neutral-400 text-[20px]">
                                                mail
                                            </span>
                                        </div>
                                        <input
                                            className="block w-full rounded-lg border-0 py-3 pl-10 text-primary shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                            id="email"
                                            placeholder="name@example.com"
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label
                                        className="block text-sm font-medium leading-6 text-primary mb-2"
                                        htmlFor="password"
                                    >
                                        Password
                                    </label>
                                    <div className="relative rounded-lg shadow-sm">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className="material-symbols-outlined text-neutral-400 text-[20px]">
                                                lock
                                            </span>
                                        </div>
                                        <input
                                            className="block w-full rounded-lg border-0 py-3 pl-10 text-primary shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                            id="password"
                                            placeholder="••••••••"
                                            type="password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label
                                        className="block text-sm font-medium leading-6 text-primary mb-2"
                                        htmlFor="confirm-password"
                                    >
                                        Confirm Password
                                    </label>
                                    <div className="relative rounded-lg shadow-sm">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className="material-symbols-outlined text-neutral-400 text-[20px]">
                                                verified_user
                                            </span>
                                        </div>
                                        <input
                                            className="block w-full rounded-lg border-0 py-3 pl-10 text-primary shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                            id="confirm-password"
                                            placeholder="••••••••"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full justify-center rounded-lg bg-black px-3 py-3 text-sm font-bold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Registering..." : "Register"}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative mt-8">
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 flex items-center"
                                >
                                    <div className="w-full border-t border-neutral-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm font-medium leading-6">
                                    <span className="bg-background-light px-6 text-neutral-500">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            {/* Social Login */}
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-primary shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50"
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="h-5 w-5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M12.0003 20.45C16.667 20.45 20.5847 16.5323 20.5847 11.8656C20.5847 11.1685 20.4851 10.5054 20.2974 9.87781H12.0003V13.2505H16.8974C16.6366 14.5054 15.5487 15.5678 14.1723 16.0356V18.3184H17.0673C18.7844 16.7461 19.8256 14.3916 19.8256 11.6626C19.8256 11.4585 19.8051 11.2585 19.7663 11.0626H7.83466V13.2505H10.7297C11.0003 14.5054 12.0882 15.5678 13.4646 16.0356V18.3184H12.0003ZM6.44237 14.1686C5.93608 12.8727 5.93608 11.4285 6.44237 10.1326L3.58284 7.91528C1.86561 11.3326 1.86561 15.3678 3.58284 18.7852L6.44237 16.5678C6.18374 15.8227 6.04237 15.0166 6.04237 14.1686ZM12.0003 4.25055C14.1205 4.25055 16.0526 4.96695 17.5847 6.17315L20.0638 3.69405C17.8974 1.66265 15.0505 0.500549 12.0003 0.500549C7.62561 0.500549 3.73719 3.03365 1.83466 6.84815L4.69419 9.06555C5.55054 6.27315 8.52974 4.25055 12.0003 4.25055Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span className="text-sm font-semibold leading-6">
                                        Google
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-primary shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50"
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="h-5 w-5 text-primary"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            clipRule="evenodd"
                                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                            fillRule="evenodd"
                                        />
                                    </svg>
                                    <span className="text-sm font-semibold leading-6">
                                        GitHub
                                    </span>
                                </button>
                            </div>

                            <p className="mt-10 text-center text-sm text-neutral-500">
                                Already have an account?{" "}
                                <a
                                    className="font-semibold leading-6 text-primary hover:underline"
                                    href="/login"
                                >
                                    Log in here
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Visual - giữ nguyên */}
                <div className="relative hidden w-0 flex-1 lg:block">
                    <div
                        className="absolute inset-0 h-full w-full bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA_ufXqLi6Up5iPvGeDEYLhGhmU-Y75qVcEuIHv_Nr4whAs3-9cAJiDP2IJLQHXhcVO2tfC7NLN9rcDNZ76e8cxsuOKmop5vW8buiXi7ZHnLqfWIQjdLmXyRipOx0--nWMjujlSFxRAD41XMReR0B4Vgfz7GbodH8I9H8-HOTLfGNA8W7ZyJj2upuCMPcrNYpzPDUPM2Axl38HDffbRez3JuEsVMcC7jmhfBOXLRAfjHCxHdZIHReimYsmrHP--uo7vqBABt56ajXE')`,
                        }}
                    >
                        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-end p-20 z-10 bg-gradient-to-t from-primary/90 to-transparent">
                        <blockquote className="space-y-2">
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <span
                                        key={i}
                                        className="material-symbols-outlined text-2xl text-yellow-400"
                                        style={{
                                            fontVariationSettings: "'FILL' 1",
                                        }}
                                    >
                                        star
                                    </span>
                                ))}
                            </div>

                            <p className="text-lg font-medium text-white">
                                “zapChat has completely transformed how our team
                                communicates. The real-time messaging is truly
                                instantaneous, and the interface is beautiful.”
                            </p>
                            <footer className="mt-4">
                                <p className="text-base font-semibold text-white">
                                    Sarah Jenkins
                                </p>
                                <p className="text-sm text-neutral-300">
                                    Product Designer at TechFlow
                                </p>
                            </footer>
                        </blockquote>

                        <div className="mt-10 flex gap-4">
                            <div className="h-1 w-12 rounded-full bg-white"></div>
                            <div className="h-1 w-12 rounded-full bg-white/30"></div>
                            <div className="h-1 w-12 rounded-full bg-white/30"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
