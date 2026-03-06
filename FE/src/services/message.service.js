import axios from "axios";

export const fullMessage = async ({
    conversation_id,
    limit = 20,
    offset = 0,
}) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/api/conversation/${conversation_id}`,
            {
                params: { limit, offset }, 
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy tin nhắn:", error);
        throw error;
    }
};

export const createMessage = async (formData) => {
    try {
        const response = await axios.post(
            "http://localhost:5000/api/message/",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            }
        );
        return response.data; 
    } catch (error) {
        console.error("Lỗi gửi tin nhắn:", error);
        throw error;
    }
};

export const markAsRead = async (conversationId, lastUnreadId, currentUserId) => {
    try {
        const response = await axios.post(
            "http://localhost:5000/api/message/seem_message",
            { conversation_id: conversationId, message_ids: lastUnreadId, user_id: currentUserId }
        );
        return response.data; 
    } catch (error) {
        console.error("Lỗi server:", error);
        throw error;
    }
}


export const reactionMessage = async (conversation_id, user_id, message_id, emoji) => {
    try {
        const response = await axios.post(
            "http://localhost:5000/api/message/reaction_message",
            { conversation_id, message_id, user_id, emoji }
        );
        return response.data; 
    } catch (error) {
        console.error("Lỗi server:", error);
        throw error;
    }
}

export const editMessage = async (conversation_id, user_id, message_id, content) => {
    try {
        const response = await axios.post(
            "http://localhost:5000/api/message/edit_message",
            { conversation_id, message_id, user_id, content }
        );
        return response.data; 
    } catch (error) {
        console.error("Lỗi server:", error);
        throw error;
    }
}