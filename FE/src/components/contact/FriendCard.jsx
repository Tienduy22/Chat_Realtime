import { MoreHorizontal } from "lucide-react";

export default function FriendCard({friend}) {

    return (
        <div className="group flex items-center justify-between rounded-2xl bg-gradient-to-r from-white to-gray-50 p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <img
                        src={friend.contactUser.avatar_url}
                        alt={friend.contactUser.full_name}
                        className="h-14 w-14 rounded-full object-cover ring-2 ring-white"
                    />
                </div>
                <span className="font-semibold text-gray-800">
                    {friend.contactUser.full_name}
                </span>
            </div>
            <button className="rounded-full p-2 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-100">
                <MoreHorizontal size={20} />
            </button>
        </div>
    );
}
