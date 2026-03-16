import { useEffect, useState } from "react";
import SentRequestCard from "../../components/contact/SentRequestCard";
import { useSelector } from "react-redux";
import {
    findInvitations,
    findSendInvitations,
} from "../../services/contact.service";
import ReceivedRequestCard from "../../components/contact/ReceivedRequestCard";
import { useSocket } from "../../context/SocketContext";
import { useFriendRequestRealtime } from "../../hooks/useContactSocket";

export default function FriendRequestsReceived() {
    const [sentRequests, setSentRequests] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const socket = useSocket();

    const user = useSelector((state) => state.user);

    useEffect(() => {
        const fetchSendInvitations = async () => {
            try {
                const response = await findSendInvitations(user.user_id);
                setSentRequests(response?.data || []);
            } catch (error) {
                console.error("Lỗi lấy lời mời đã gửi:", error);
            }
        };

        if (user?.user_id) {
            fetchSendInvitations();
        }
    }, [user.user_id, refresh]);

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const response = await findInvitations(user.user_id);
                setInvitations(response?.data || []);
            } catch (error) {
                console.error("Lỗi lấy lời mời kết bạn:", error);
            }
        };
        if (user?.user_id) {
            fetchInvitations();
        }
    }, [user.user_id, refresh]);

    const handleRefreshAfterRemove = () => {
        setRefresh((prev) => !prev);
    };

    useFriendRequestRealtime({
        socket,
        user_id: user.user_id,
        onReceive: (data) => {
            setInvitations((prev) => [
                {
                    contact_id: data.contact_id,
                    owner: {
                        user_id: data.from_user.user_id,
                        username: data.from_user.username,
                        full_name: data.from_user.full_name,
                        avatar_url: data.from_user.avatar_url,
                    },
                    user_id: data.reference_id,
                    status: "pending",
                    created_at: data.created_at,
                },
                ...prev,
            ]);
        },
    });

    return (
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
            <div className="rounded-3xl bg-white p-6 shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-gray-800">
                    Lời mời kết bạn
                </h2>

                {/* Phần lời mời NHẬN ĐƯỢC */}
                <div className="mb-12">
                    <h3 className="mb-5 text-xl font-semibold text-gray-800">
                        Lời mời nhận được {invitations.length}
                    </h3>

                    {invitations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-blue-50/50 to-transparent p-12 text-center">
                            <div className="mb-6 rounded-full bg-blue-100 p-6">
                                <svg
                                    className="h-12 w-12 text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <p className="text-xl font-medium text-gray-700">
                                Bạn không có lời mời nào
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {invitations.map((inv) => (
                                <ReceivedRequestCard
                                    key={inv.contact_id}
                                    request={inv}
                                    onActionSuccess={handleRefreshAfterRemove}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Lời mời đã gửi */}
                <div>
                    <h3 className="mb-5 text-xl font-semibold text-gray-800">
                        Lời mời đã gửi {sentRequests.length}
                    </h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {sentRequests.map((req) => (
                            <SentRequestCard
                                key={req.contact_id}
                                request={req}
                                onRemoveSuccess={handleRefreshAfterRemove}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
