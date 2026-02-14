import ChatWidget from "../ChatWidget";

export default function DashboardSidebar({
    isHistoryOpen,
    setIsHistoryOpen,
    conversations,
    activeConversation,
    setActiveConversation,
    deleteConversation,
    username,
    isChatOpen,
    setIsChatOpen,
    chatWidth,
    setChatWidth,
    isResizing,
    setIsResizing,
    loadConversations
}) {
    const handleNewConversation = () => {
        setActiveConversation(null);
        setIsHistoryOpen(false);
    };

    return (
        <div
            className="h-full flex flex-col py-4 pl-4 relative"
            style={{ width: chatWidth, minWidth: 450, maxWidth: 900, flexShrink: 0 }}
        >
            {/* Overlay backdrop */}
            {isHistoryOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30"
                    onClick={() => setIsHistoryOpen(false)}
                />
            )}

            {/* History sidebar */}
            <aside className={`fixed left-0 top-14 bottom-0 w-60 bg-surface border-r border-border flex flex-col z-40 transition-transform duration-300 ${isHistoryOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* New + Close */}
                <div className="p-3 border-b border-border flex gap-2">
                    <button
                        onClick={handleNewConversation}
                        className="flex-1 py-2 bg-primary text-background text-xs font-medium rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        + New Chat
                    </button>
                    <button
                        onClick={() => setIsHistoryOpen(false)}
                        className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-light transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
                    {conversations.length === 0 && (
                        <p className="text-xs text-text-muted text-center py-8">No conversations yet</p>
                    )}

                    {conversations.map(conversation => (
                        <div
                            key={conversation.id}
                            onClick={() => setActiveConversation(conversation)}
                            className={`group relative mx-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${activeConversation?.id === conversation.id
                                ? "bg-surface-light text-primary"
                                : "text-text-primary hover:bg-surface-light"
                                }`}
                        >
                            <div className="text-sm truncate pr-5">
                                {conversation.title || "Untitled Chat"}
                            </div>
                            <div className="text-[11px] text-text-muted mt-0.5">
                                {new Date(conversation.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>

                            <button
                                onClick={(e) => deleteConversation(e, conversation.id)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-text-muted hover:text-accent-coral rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Embedded ChatWidget */}
            <ChatWidget
                username={username}
                isOpen={isChatOpen}
                toggleChat={() => setIsChatOpen(!isChatOpen)}
                width={chatWidth}
                setWidth={setChatWidth}
                setIsResizing={setIsResizing}
                isResizing={isResizing}
                isEmbedded={true}
                activeConversation={activeConversation}
                onNewConversation={() => setActiveConversation(null)}
                onConversationUpdated={loadConversations}
                onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
            />
        </div>
    );
}
