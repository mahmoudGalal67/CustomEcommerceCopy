"use client";


function ChatInput({
    value,
    onChange,
    onSend,
    dict
}: {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    dict: any;
}) {
    return (
        <div className="border-t bg-white dark:bg-gray-600 p-3 flex items-center gap-2 ">
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={dict.input}
                className="flex-1 rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black text-sm"
            />
            <button
                onClick={onSend}
                className="rounded-2xl bg-black px-4 py-3 text-white text-sm font-medium hover:opacity-90 transition cursor-pointer hover:scale-103"
            >
                {dict.button}
            </button>
        </div>
    );
}

export default ChatInput