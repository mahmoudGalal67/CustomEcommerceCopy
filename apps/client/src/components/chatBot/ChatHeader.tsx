"use client";

function ChatHeader({ onClose, dict }: { onClose: () => void; dict: any }) {
    return (
        <div className="bg-black text-white px-5 py-4 flex items-center justify-between">
            <div>
                <h3 className="font-semibold text-lg">{dict.support}</h3>

                <div className="mt-1 flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
                    </span>
                    <span className="text-xs text-gray-300">{dict.active}</span>
                </div >

            </div >
            <button
                onClick={onClose}
                className="text-sm opacity-80 hover:opacity-100 transition cursor-pointer"
            >
                ✕
            </button>
        </div >
    );
}

export default ChatHeader