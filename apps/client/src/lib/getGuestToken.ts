export const getGuestToken = () => {
    let token = localStorage.getItem("guest_chat_token");

    if (!token) {
        token = crypto.randomUUID();
        localStorage.setItem("guest_chat_token", token);
    }

    return token;
};