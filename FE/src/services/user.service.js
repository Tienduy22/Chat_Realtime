import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL

export const updateAvatar = async (user_id, formData) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/user/avatar/${user_id}`,
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

export const updateProfile = async (user_id, data) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/user/profile/${user_id}`,
            data,
            {
                withCredentials: true,
            }
        );
        return response.data; 
    } catch (error) {
        console.error("Lỗi gửi tin nhắn:", error);
        throw error;
    }
};

export const changePassword = async (data) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/user/password`,
            data,
            {
                withCredentials: true,
            }
        );
        return response.data; 
    } catch (error) {
        console.error("Lỗi gửi tin nhắn:", error);
        throw error;
    }
};

export const profile = async (user_id) => {
    try {
        const response = await axios.get(
            `${API_URL}/api/user/profile`,
            {
                params: {
                    user_id: user_id,
                },
            },
            {
                withCredentials: true,
            }
        );
        return response.data; 
    } catch (error) {
        console.error("Lỗi gửi tin nhắn:", error);
        throw error;
    }
};

