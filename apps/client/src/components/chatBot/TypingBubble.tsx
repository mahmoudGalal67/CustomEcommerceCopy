// components/chat/TypingBubble.tsx

export default function TypingBubble({ dict }: { dict: any } ) {
    return (
        <div className="flex justify-start">
            <div className="bg-white border shadow-sm px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>

                    <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                    ></span>

                    <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                    ></span>
                </div>

                <p className="text-xs text-gray-400 mt-1">
                    {dict.typing}
                </p>
            </div>
        </div>
    );
}