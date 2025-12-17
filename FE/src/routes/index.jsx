import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "../components/layout/MainLayout/MainLayout";

// Route Guards - chỉ còn ProtectedRoute
import ProtectedRoute from "./ProtectedRoute";

// Contexts
import { SocketProvider } from "../context/SocketContext";

// Pages
import Loading from "../components/common/Loading/Loading";
import NotFound from "../pages/NotFound/NotFound";
import { Suspense } from "react";

import ConversationDetail from "../pages/Chat/ConversationDetail";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import WelcomeScreen from "../pages/Chat/WelcomeScreen";
import ProfilePage from "../pages/Profile/ProfilePage";

export const routeConfig = {
    public: [
        {
            path: "/login",
            element: Login,
            meta: { title: "Đăng nhập", description: "Đăng nhập vào Chat App" },
        },
        {
            path: "/register",
            element: Register,
            meta: { title: "Đăng ký", description: "Tạo tài khoản mới" },
        },
    ],

    protected: [
        { path: "/", redirect: "/chat" },
        {
            path: "/chat",
            element: WelcomeScreen,
            meta: { title: "Chat", icon: "MessageSquare", showInSidebar: true },
        },
        {
            path: "/chat/:conversationId",
            element: ConversationDetail,
            meta: { title: "Chi tiết cuộc trò chuyện", showInSidebar: false },
        },
        {
            path: "/profile",
            element: ProfilePage,
            meta: { title: "Cá nhân", icon: "User", showInSidebar: true },
        },
    ],
};

// Các hàm helper giữ nguyên...
export const getSidebarRoutes = () => {
  return routeConfig.protected.filter(route => route.meta?.showInSidebar);
};

export const getRouteMeta = (path) => {
  const allRoutes = [...routeConfig.public, ...routeConfig.protected];
  return allRoutes.find(route => route.path === path)?.meta;
};

export const getPublicPaths = () => routeConfig.public.map(r => r.path);
export const getProtectedPaths = () => routeConfig.protected.map(r => r.path);

const AppRouter = () => {
    return (
        <Suspense fallback={<Loading fullScreen />}>
            <Routes>
                {/* Public routes - không cần guard nữa, ai cũng vào được */}
                {routeConfig.public.map(({ path, element: Element }) => (
                    <Route key={path} path={path} element={<Element />} />
                ))}

                {/* Protected Routes - cần đăng nhập */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<SocketProvider />}>
                        <Route element={<MainLayout />}>
                            {routeConfig.protected.map(({ path, element: Element, redirect }) => {
                                if (redirect) {
                                    return (
                                        <Route
                                            key={path}
                                            path={path}
                                            element={<Navigate to={redirect} replace />}
                                        />
                                    );
                                }
                                return (
                                    <Route
                                        key={path}
                                        path={path}
                                        element={<Element />}
                                    />
                                );
                            })}
                        </Route>
                    </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AppRouter;