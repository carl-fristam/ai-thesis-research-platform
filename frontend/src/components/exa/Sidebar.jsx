import React from "react";

export default function Sidebar({
    isOpen,
    setIsOpen,
    chats,
    currentChatId,
    selectChat,
    deleteChat,
    createNewChat
}) {
    return (
        <>
            <aside className={`fixed left-0 top-20 bottom-0 w-64 bg-surface border-r border-border/50 flex flex-col pt-8 pl-4 pr-2 transition-transform duration-500 ease-in-out z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="mb-6 space-y-3">
                    <button
                        onClick={createNewChat}
                        className="w-full py-4 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary-dark transition-all flex items-center justify-center gap-3 rounded-2xl shadow-lg shadow-primary/20 active:scale-[0.98]"
                    >
                        <span>+</span> New Research Session
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full py-2 bg-surface-light hover:bg-surface text-slate-400 hover:text-slate-200 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                        title="Collapse sidebar"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                        Collapse
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pb-8">
                    <h3 className="text-[10px] font-bold uppercase text-primary-light/60 tracking-widest px-3">History</h3>
                    {chats.length === 0 && <p className="text-[10px] text-slate-400 px-3 italic">No history yet.</p>}
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => selectChat(chat)}
                            className={`group relative p-5 rounded-2xl text-[13px] cursor-pointer transition-all border ${currentChatId === chat.id ? "bg-surface-light border-primary/30 shadow-xl shadow-primary/10 translate-x-1" : "border-transparent hover:bg-surface-light/50 hover:border-border"}`}>
                            <div className={`font-bold truncate pr-6 ${currentChatId === chat.id ? "text-primary-light" : "text-slate-300"}`}>{chat.title || "Untitled Search"}</div>
                            <div className="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-widest">{new Date(chat.created_at).toLocaleDateString() || "Just now"}</div>

                            <button
                                onClick={(e) => deleteChat(e, chat.id)}
                                className="absolute right-2 top-3 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </aside>

            {/* SIDEBAR TOGGLE BUTTON (when collapsed) */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed left-4 top-28 z-50 w-12 h-12 bg-surface border border-border shadow-xl rounded-full flex items-center justify-center text-slate-300 hover:text-primary-light hover:border-primary-light transition-all hover:scale-110"
                    title="Open sidebar"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                </button>
            )}
        </>
    );
}
