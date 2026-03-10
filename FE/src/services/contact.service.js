import axios from "axios";

export const listFriends = async (user_id) => {
    try {
        const response = await axios.get(
            "http://localhost:5000/api/contact/friends",
            {
                params: { user_id },
                withCredentials: true,
            },
        );
        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
        throw error;
    }
};

export const listGroup = async (user_id) => {
    try {
        const response = await axios.get(
            "http://localhost:5000/api/contact/groups",
            {
                params: { user_id },
                withCredentials: true,
            },
        );
        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
        throw error;
    }
};

export const findContactByPhone = async (phone) => {
    try {
        const response = await axios.get(
            "http://localhost:5000/api/contact/find_contact",
            {
                params: { phone },
                withCredentials: true,
            },
        );
        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
        throw error;
    }
};

export const findSendInvitations = async (user_id) => {
    try {
        const response = await axios.get(
            "http://localhost:5000/api/contact/send_invitations",
            {
                params: { user_id },
                withCredentials: true,
            },
        );
        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
        throw error;
    }
};

export const findInvitations = async (user_id) => {
    try {
        const response = await axios.get(
            "http://localhost:5000/api/contact/invitations",
            {
                params: { user_id },
                withCredentials: true,
            },
        );
        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
        throw error;
    }
};

export const sendInvitations = async (data) => {
    try {
        const response = await axios.post(
            "http://localhost:5000/api/contact/send",
            data,
            {
                withCredentials: true,
            },
        );
        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
        throw error;
    }
};

export const removeInvitations = async (contact_id) => {
    try {
        const response = await axios.delete(
            "http://localhost:5000/api/contact/invitations",
            {
                params: { contact_id },
                withCredentials: true,
            },
        );
        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi xóa dữ liệu:", error);
        throw error;
    }
};

export const acceptInvitations = async (user_id, contact_user_id) => {
    try {
        const response = await axios.post(
            "http://localhost:5000/api/contact/accept",
            {
                user_id,
                contact_user_id,
            },
        );
        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
        throw error;
    }
};

export const rejectInvitations = async (contact_id) => {
    try {
        const response = await axios.post(
            "http://localhost:5000/api/contact/reject",
            {
                contact_id,
            },
        );
        return response.data;
    } catch (error) {
        console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
        throw error;
    }
};

export const newGroup = async (data) => {
    try {
        const formData = new FormData();

        formData.append("name", data.group_name);
        formData.append("admin_id", data.user_id);
        data.member_ids.forEach((id) => {
            formData.append("member_ids", id);
        });
        if (data.avatar_url) {
            formData.append("image", data.avatar_url);
        }

        console.log("Data gửi lên server (FormData):");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        const response = await axios.post(
            "http://localhost:5000/api/conversation/new_group",
            formData,
        );

        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo group:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }
        throw error;
    }
};
