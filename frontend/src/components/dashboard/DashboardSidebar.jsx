import React from "react";
import ChatWidget from "../ChatWidget";

export default function DashboardSidebar({
    isHistoryOpen,
    setIsHistoryOpen,
    chats,
    activeChat,
    setActiveChat,
    deleteChat,
    token,
    username,
    isChatOpen,
    setIsChatOpen,
    chatWidth,
    setChatWidth,
    isResizing,
    setIsResizing,
    loadChats
}) {
    return (
        <div className="w-[40%] h-full flex flex-col pt-10 pb-8 pl-8 relative">
            {/* HISTORY OVERLAY BACKDROP */}
            {isHistoryOpen && (
                <div
                    className="fixed inset-0 z-[90] bg-black/30 transition-opacity duration-300 pointer-events-auto"
                    onClick={() => setIsHistoryOpen(false)}
                ></div>
            )}

            <aside
                className={`fixed left-0 top-[20vh] bottom-[20vh] w-80 bg-surface/95 backdrop-blur-md z-[100] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col shadow-[10px_0_40px_-20px_rgba(0,0,0,0.5)] rounded-tr-[32px] rounded-br-[32px] border-r border-border ${isHistoryOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="px-8 py-8 border-b border-border">
                    <h3 className="text-[11px] font-black uppercase text-primary-light tracking-[0.25em]">Research History</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 relative scrollbar-hide">
                    <style>{`
                        .scrollbar-hide::-webkit-scrollbar { display: none; }
                        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                    `}</style>
                    {chats.length === 0 && <p className="text-[11px] text-slate-400 px-4 py-6 italic font-medium">No history yet.</p>}
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => {
                                setActiveChat(chat);
                            }}
                            className={`group relative p-5 rounded-[22px] text-sm cursor-pointer transition-all border ${activeChat?.id === chat.id ? "bg-surface-light border-primary shadow-lg shadow-primary/20 scale-[1.02] z-10" : "border-transparent hover:bg-surface-light/60 hover:border-border hover:shadow-sm"}`}>
                            <div className={`font-bold truncate pr-6 ${activeChat?.id === chat.id ? "text-primary-light" : "text-slate-300 group-hover:text-primary-light"}`}>{chat.title || "Untitled Chat"}</div>
                            <div className="text-[10px] text-slate-500 mt-1.5 font-bold tracking-tight uppercase flex justify-between items-center">
                                <span>{new Date(chat.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">View Details →</span>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteChat(e, chat.id);
                                }}
                                className="absolute right-3 top-4 w-7 h-7 flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-950/30 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                title="Delete chat"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    ))}
                    {/* Sticky Gradient Fade at Bottom */}
                    <div className="sticky bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent pointer-events-none z-20"></div>
                </div>
            </aside>

            <ChatWidget
                token={token}
                username={username}
                isOpen={isChatOpen}
                toggleChat={() => setIsChatOpen(!isChatOpen)}
                width={chatWidth}
                setWidth={setChatWidth}
                setIsResizing={setIsResizing}
                isResizing={isResizing}
                isEmbedded={true}
                activeChat={activeChat}
                onNewChat={() => setActiveChat(null)}
                onChatUpdated={loadChats} // callback to refresh list when chat updates title/etc
                onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
            />
        </div>
    );
}
