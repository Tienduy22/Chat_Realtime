import { Outlet } from "react-router-dom";
import { Header } from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

const MainLayout = () => {
    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <Header />

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
