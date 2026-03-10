import { format, differenceInDays, parseISO } from "date-fns";
import { removeInvitations } from "../../services/contact.service";
import { useState } from "react";

export default function SentRequestCard({ request, onRemoveSuccess }) {
    const [isLoading, setIsLoading] = useState(false);

    const getRequestTime = () => {
        if (!request?.created_at) {
            return "Bạn đã gửi lời mời";
        }

        try {
            const createdDate = parseISO(request.created_at);
            const now = new Date();

            const daysDiff = differenceInDays(now, createdDate);

            if (daysDiff <= 7 && daysDiff >= 0) {
                if (daysDiff === 0) return "Hôm nay";
                return `${daysDiff} ngày trước`;
            } else {
                return format(createdDate, "dd/MM/yyyy");
            }
        } catch (error) {
            console.error("Lỗi parse ngày:", error);
            return "Bạn đã gửi lời mời";
        }
    };

    const handleRemoveInvitation = async () => {
        setIsLoading(true);
        try {
            await removeInvitations(request.contact_id);

            if (onRemoveSuccess) {
                onRemoveSuccess();
            }
        } catch (error) {
            console.error("Lỗi thu hồi lời mời:", error);
            alert("Thu hồi thất bại, vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <img
                        src={request.contactUser.avatar}
                        alt={request.contactUser.full_name}
                        className="h-16 w-16 rounded-full object-cover ring-2 ring-white"
                    />
                    {request.sentByMe && (
                        <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white bg-yellow-400"></span>
                    )}
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                        {request.contactUser.full_name}
                    </p>
                    <p className="text-sm text-gray-500">{getRequestTime()}</p>
                </div>
            </div>
            <button
                className={`mt-4 w-full rounded-xl py-2.5 text-sm font-medium transition ${
                    isLoading
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}
                onClick={handleRemoveInvitation}
                disabled={isLoading}
            >
                {isLoading ? "Đang thu hồi..." : "Thu hồi lời mời"}
            </button>
        </div>
    );
}
