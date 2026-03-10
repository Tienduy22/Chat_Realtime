import {
    acceptInvitations,
    rejectInvitations,
} from "../../services/contact.service";
import { format, differenceInDays, parseISO } from "date-fns";
import { Check, X } from "lucide-react";

export default function ReceivedRequestCard({ request, onActionSuccess }) {
    const handleAccept = async () => {
        try {
            await acceptInvitations(request.contact_user_id, request.user_id);
            onActionSuccess();
        } catch (err) {
            console.error("Lỗi chấp nhận:", err);
        }
    };

    const handleReject = async () => {
        try {
            await rejectInvitations(request.contact_id);
            onActionSuccess();
        } catch (err) {
            console.error("Lỗi từ chối:", err);
        }
    };

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

    return (
        <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
                <img
                    src={request.owner?.avatar_url || "/default-avatar.png"}
                    alt={request.owner?.full_name}
                    className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                    <h4 className="font-semibold text-gray-800">
                        {request.owner?.full_name}
                    </h4>
                    <p className="text-sm text-gray-500">{getRequestTime()}</p>
                </div>
            </div>

            <div className="mt-4 flex gap-3">
                <button
                    onClick={handleAccept}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 font-medium text-white shadow-md transition-all duration-200 hover:bg-sky-600"
                >
                    <Check size={18} />
                </button>

                <button
                    onClick={handleReject}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 active:scale-95"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
}
