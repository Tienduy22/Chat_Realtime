import axios from "axios";

export const listConversation = async () => {
    try {

        const response = await axios.get(
            "http://localhost:5000/api/conversation/list_conversation",
            {
                withCredentials: true
            }
        );

        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi register:", error);
        throw error;
    }
};

export const conversationFindById = async (conversation_id) => {
    try {

        const response = await axios.get(
            `http://localhost:5000/api/conversation/detail/${conversation_id}`,
            {
                withCredentials: true
            }
        );

        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi register:", error);
        throw error;
    }
};
