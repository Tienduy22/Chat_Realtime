import { useLocation } from "react-router-dom";
import FriendsList from "../../components/contact/FriendsList";
import GroupsCommunitiesList from "../../components/contact/GroupsCommunitiesList";
import FriendRequestsReceived from "../../components/contact/FriendRequestsReceived";
import GroupCommunityInvites from "../../components/contact/GroupCommunityInvites";
import SidebarMenu from "../../components/contact/SidebarMenu";

export default function ContactsPage() {
    const location = useLocation();

    const renderContent = () => {
        const path = location.pathname;

        if (path === "/contact" || path === "/contact/friends") {
            return <FriendsList />;
        }

        if (path === "/contact/groups") {
            return <GroupsCommunitiesList />;
        }

        if (path === "/contact/invitation") {
            return <FriendRequestsReceived />;
        }

        if (path === "/contact/group-invites") {
            return <GroupCommunityInvites />;
        }

        return <FriendsList />;
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Sidebar */}
            <div className="hidden w-80 flex-shrink-0 border-r border-gray-200/80 bg-white/80 backdrop-blur-md md:block">
                <div className="sticky top-0 z-10 border-b border-gray-200/60 bg-white/90 px-5 py-4 backdrop-blur-sm">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Danh sách bạn bè
                    </h1>
                </div>

                <SidebarMenu />
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-y-auto">{renderContent()}</div>
        </div>
    );
}
