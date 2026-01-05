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
        <div className="w-[40%] h-full flex flex-col pt-6 pb-6 pl-6 relative">
            {/* HISTORY OVERLAY BACKDROP */}
            {isHistoryOpen && (
                <div
                    className="fixed inset-0 z-[90] bg-background/60 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setIsHistoryOpen(false)}
                />
            )}

            {/* HISTORY SIDEBAR */}
            <aside
                className={`fixed left-0 top-24 bottom-6 w-80 bg-surface/95 backdrop-blur-xl z-[100] transition-transform duration-500 ease-out flex flex-col shadow-elevated rounded-r-2xl border-r border-y border-border ${isHistoryOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary">Chat History</h3>
                        <p className="text-xs text-text-muted mt-0.5">{chats.length} conversations</p>
                    </div>
                    <button
                        onClick={() => setIsHistoryOpen(false)}
                        className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-light rounded-lg transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Chat list */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
                    {chats.length === 0 && (
                        <div className="px-3 py-8 text-center">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-surface-light flex items-center justify-center">
                                <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <p className="text-sm text-text-muted">No conversations yet</p>
                            <p className="text-xs text-text-muted mt-1">Start a new chat to see it here</p>
                        </div>
                    )}
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChat(chat)}
                            className={`group relative p-4 rounded-xl cursor-pointer transition-all border ${
                                activeChat?.id === chat.id
                                    ? "bg-primary/10 border-primary/30"
                                    : "border-transparent hover:bg-surface-light hover:border-border"
                            }`}
                        >
                            <div className={`font-medium text-sm truncate pr-6 ${
                                activeChat?.id === chat.id ? "text-primary" : "text-text-primary"
                            }`}>
                                {chat.title || "Untitled Chat"}
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-xs text-text-muted">
                                    {new Date(chat.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                                {chat.messages?.length > 0 && (
                                    <>
                                        <span className="text-text-muted">·</span>
                                        <span className="text-xs text-text-muted">{chat.messages.length} messages</span>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteChat(e, chat.id);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-text-muted hover:text-accent-coral hover:bg-accent-coral/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                title="Delete chat"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-surface to-transparent pointer-events-none rounded-br-2xl" />
            </aside>

            {/* EMBEDDED CHAT WIDGET */}
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
                onChatUpdated={loadChats}
                onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
            />
        </div>
    );
}
