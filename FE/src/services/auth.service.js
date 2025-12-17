import axios from "axios";

export const login = async (data) => {
    try {
        const response = await axios.post(
            "http://localhost:5000/api/auth/login",
            data,
            {
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi login:", error);
        throw error;
    }
};

export const register = async (data) => {
    try {
        const response = await axios.post(
            "http://localhost:5000/api/auth/register",
            data,
            {
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi register:", error);
        throw error;
    }
};

