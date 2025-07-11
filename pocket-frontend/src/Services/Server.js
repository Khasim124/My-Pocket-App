import axios from "axios";

const BASE_URL = "http://localhost:3000/userdetails";

export async function PostPageList(form) {
    try {
        const response = await axios.post(`${BASE_URL}/register`, form);
        return response.data;
    } catch (error) {
        return {
            error:
                error.response?.data?.errors?.[0]?.msg ||
                error.response?.data?.error ||
                error.message,
        };
    }
}

export async function LoginPageList(form) {
    try {
        const response = await axios.post(`${BASE_URL}/login`, form);
        return response.data;
    } catch (error) {
        return {
            error:
                error.response?.data?.message ||
                error.message,
        };
    }
}

export async function CheckEmailExists(email) {
    try {
        const response = await axios.post(`${BASE_URL}/check-email`, { user_email: email });
        return response.data;
    } catch (error) {
        return {
            error:
                error.response?.data?.message || error.message,
        };
    }
}

export async function ResetPassword(email, newPassword) {
    try {
        const response = await axios.post(`${BASE_URL}/reset-password`, {
            email,
            newPassword,
        });
        return response.data;
    } catch (error) {
        return {
            error:
                error.response?.data?.message || error.message,
        };
    }
}

export async function GetUserProfile(token) {
    try {
        const response = await axios.get(`${BASE_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return {
            error: error.response?.data?.message || error.message,
        };
    }
}
