import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "../components/layout/MainLayout/MainLayout";

// Route Guards
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// Contexts
import { SocketProvider } from "../context/SocketContext";

// Loading
import Loading from "../components/common/Loading/Loading";
import NotFound from "../pages/NotFound/NotFound";
import { Suspense } from "react";


export const routeConfig = {
    // Public routes 
    public: [
        // {
        //     path: "/login",
        //     element: Login,
        //     meta: {
        //         title: "Đăng nhập",
        //         description: "Đăng nhập vào Chat App",
        //     },
        // },
        // {
        //     path: "/register",
        //     element: Register,
        //     meta: {
        //         title: "Đăng ký",
        //         description: "Tạo tài khoản mới",
        //     },
        // },
    ],

    // Protected routes
    protected: [
        // {
        //     path: "/",
        //     redirect: "/chat",
        // },
        // {
        //     path: "/chat",
        //     element: ChatPage,
        //     meta: {
        //         title: "Chat",
        //         icon: "MessageSquare",
        //         showInSidebar: true,
        //     },
        // },
        // {
        //     path: "/chat/:conversationId",
        //     element: ConversationDetail,
        //     meta: {
        //         title: "Chi tiết cuộc trò chuyện",
        //         showInSidebar: false,
        //     },
        // },
        // {
        //     path: "/contacts",
        //     element: ContactsPage,
        //     meta: {
        //         title: "Danh bạ",
        //         icon: "Users",
        //         showInSidebar: true,
        //     },
        // },
        // {
        //     path: "/profile",
        //     element: ProfilePage,
        //     meta: {
        //         title: "Cá nhân",
        //         icon: "User",
        //         showInSidebar: true,
        //     },
        // },
        // {
        //     path: "/profile/edit",
        //     element: EditProfile,
        //     meta: {
        //         title: "Chỉnh sửa thông tin",
        //         showInSidebar: false,
        //     },
        // },
        // {
        //     path: "/settings",
        //     element: SettingsPage,
        //     meta: {
        //         title: "Cài đặt",
        //         icon: "Settings",
        //         showInSidebar: true,
        //     },
        // },
    ],
};

// Lấy routes cho sidebar
export const getSidebarRoutes = () => {
  return routeConfig.protected.filter(route => route.meta?.showInSidebar)
}

// Lấy route meta theo path
export const getRouteMeta = (path) => {
  const allRoutes = [...routeConfig.public, ...routeConfig.protected]
  return allRoutes.find(route => route.path === path)?.meta
}

// Lấy tất cả public paths
export const getPublicPaths = () => {
  return routeConfig.public.map(route => route.path)
}

// Lấy tất cả protected paths
export const getProtectedPaths = () => {
  return routeConfig.protected.map(route => route.path)
}

const AppRouter = () => {
    return (
        <Suspense fallback={<Loading fullScreen />}>
            <Routes>
                {/* Public Routes - Chỉ truy cập khi chưa đăng nhập */}
                <Route element={<PublicRoute />}>
                    {routeConfig.public.map(({ path, element: Element }) => (
                        <Route key={path} path={path} element={<Element />} />
                    ))}
                </Route>

                {/* Protected Routes - Cần đăng nhập */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<SocketProvider />}>
                        <Route element={<MainLayout />}>
                            {routeConfig.protected.map(
                                ({ path, element: Element, redirect }) => {
                                    // Nếu có redirect
                                    if (redirect) {
                                        return (
                                            <Route
                                                key={path}
                                                path={path}
                                                element={
                                                    <Navigate
                                                        to={redirect}
                                                        replace
                                                    />
                                                }
                                            />
                                        );
                                    }
                                    // Route bình thường
                                    return (
                                        <Route
                                            key={path}
                                            path={path}
                                            element={<Element />}
                                        />
                                    );
                                }
                            )}
                        </Route>
                    </Route>
                </Route>

                {/* 404 Not Found */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AppRouter;
