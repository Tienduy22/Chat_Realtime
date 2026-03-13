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

export const dataOfConversation = async (conversation_id) => {
    try {

        const response = await axios.get(
            "http://localhost:5000/api/conversation/data",
            {
                params: {conversation_id},
                withCredentials: true
            }
        );

        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
        throw error;
    }
};

// ✅ Get conversation with block status
export const getConversationWithBlockStatus = async (conversation_id) => {
    try {
        const response = await axios.get(
            "http://localhost:5000/api/conversation/block-status",
            {
                params: { conversation_id },
                withCredentials: true
            }
        );

        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
        throw error;
    }
};

export const conversationStorage = async (conversation_id) => {
    try {

        const response = await axios.get(
            "http://localhost:5000/api/conversation/storage",
            {
                params: {conversation_id},
                withCredentials: true
            }
        );

        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
        throw error;
    }
};

export const memberOfConversation = async (conversation_id) => {
    try {

        const response = await axios.get(
            "http://localhost:5000/api/conversation/member",
            {
                params: {conversation_id},
                withCredentials: true
            }
        );

        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
        throw error;
    }
};

export const addMember = async (data) => {
    try {

        const response = await axios.post(
            "http://localhost:5000/api/conversation/member",
            {
                conversation_id: data.conversation_id,
                admin_id: data.admin_id,
                member_id: data.member_id,
            },
        );

        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
        throw error;
    }
};

export const deleteMember = async (data) => {
    try {

        const response = await axios.delete(
            "http://localhost:5000/api/conversation/member",
            {
                data: {
                    conversation_id: data.conversation_id,
                    admin_id: data.admin_id,
                    member_id: data.member_id,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
        throw error;
    }
};

export const changeRoleAdmin = async (data) => {
    try {

        const response = await axios.post(
            "http://localhost:5000/api/conversation/change_role_admin",
            {
                conversation_id: data.conversation_id,
                admin_id: data.admin_id,
                member_id: data.member_id,
            },
        );

        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
        throw error;
    }
};

export const adminInfo = async (conversation_id) => {
    try {

        const response = await axios.get(
            "http://localhost:5000/api/conversation/admin",
            {
                params: {conversation_id},
                withCredentials: true
            },
        );

        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
        throw error;
    }
};

export const deleteHistoryOfConversation = async (conversation_id) => {
    try {

        const response = await axios.delete(
            "http://localhost:5000/api/conversation/history",
            {
                data: {conversation_id},
            },
        );

        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
        throw error;
    }
};

export const searchMessage = async (data) => {
    try {
        const response = await axios.get(
            "http://localhost:5000/api/message/search",
            {
                params: data,
            },
        );

        return response.data;
    } catch (error) {
        console.error("Lỗi khi tìm tin nhắn:", error);
        throw error;
    }
};

export const deleteGroup = async (conversation_id) => {
    try {

        const response = await axios.delete(
            "http://localhost:5000/api/conversation/group",
            {
                data: {conversation_id},
            },
        );

        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
        throw error;
    }
};

export const memberLeave = async (data) => {
    try {

        const response = await axios.post(
            "http://localhost:5000/api/conversation/member_leave",
            {
                conversation_id: data.conversation_id,
                member_id: data.member_id,
            },
        );

        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
        throw error;
    }
};