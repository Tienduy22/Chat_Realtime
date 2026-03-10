import { useEffect } from "react";

export function useFriendRequestRealtime({ socket, user_id, onReceive }) {
    useEffect(() => {
        if (!socket || !user_id) return;

        const handleFriendRequest = (data) => {
            if (onReceive) {
                onReceive(data);
            }
        };

        socket.on("friend_request_received", handleFriendRequest);

        return () => {
            socket.off("friend_request_received", handleFriendRequest);
        };
    }, [socket, user_id, onReceive]);
}