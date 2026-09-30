export const getGuestToken = () => {
  let token = localStorage.getItem("guest_chat_token");

  if (!token) {
    token =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random()
            .toString(36)
            .slice(2)}`;

    localStorage.setItem("guest_chat_token", token);
  }

  return token;
};
