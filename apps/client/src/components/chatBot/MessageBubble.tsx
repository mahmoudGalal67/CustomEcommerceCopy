function MessageBubble({
    message,
    isUser,
}: {
    message: string;
    isUser: boolean;
}) {
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${isUser
                    ? "bg-black text-white rounded-br-md"
                    : "bg-white dark:bg-gray-300  text-black border rounded-bl-md"
                    }`}
            >
                {message}
            </div>
        </div>
    );
}

export default MessageBubble
