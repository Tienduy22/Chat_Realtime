import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import ConversationList from "../ConversationList/ConversationList";

const MainLayout = () => {
    return (
        <div className="h-screen flex flex-col">
            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <Sidebar />
                <ConversationList/>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
