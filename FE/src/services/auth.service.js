import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL

export const login = async (data) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/auth/login`,
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
            `${API_URL}/api/auth/register`,
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

export const sendOTP = async (data) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/auth/send_otp`,
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

export const confirmOTP = async (data) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/auth/verify_otp`,
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

export const newPassword = async (data) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/auth/new_password`,
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



