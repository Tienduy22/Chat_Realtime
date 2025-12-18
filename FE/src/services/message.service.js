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
                params: { limit, offset }, // gửi query params
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
