import axios from "axios";


// token
export const refreshAccessToken = async () => {
    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/refresh`,
        {},
        { withCredentials: true }
    );

    return response.data.access_token;
};
