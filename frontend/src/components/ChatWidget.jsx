import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as chatApi from '../api/chat';

export default function ChatWidget({
    username,
    isOpen,
    toggleChat,
    width,
    setWidth,
    isResizing,
    setIsResizing,
    isEmbedded = false,
    activeConversation,
    onNewConversation,
    onConversationUpdated,
    onToggleHistory
}) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [mode, setMode] = useState('thesis');
    const [showModeModal, setShowModeModal] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const scrollRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (activeConversation) {
            setCurrentSessionId(activeConversation.id);
            setMessages((activeConversation.messages || []).map(m => ({
                ...m,
                role: m.role === 'assistant' ? 'ai' : m.role,
                text: m.text || m.content || ''
            })));
            setMode(activeConversation.mode || 'thesis');
        } else {
            setCurrentSessionId(null);
            setMessages([]);
        }
    }, [activeConversation]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen, isEmbedded]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = Math.min(scrollHeight, 200) + 'px';
        }
    }, [input]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            const newWidth = e.clientX;
            if (newWidth >= 450 && newWidth <= 900) {
                setWidth(newWidth);
            }
        };
        const handleMouseUp = () => {
            setIsResizing(false);
            document.body.style.cursor = 'default';
        };
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, setWidth, setIsResizing]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', text: input };
        const currentInput = input;
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        let sessionId = currentSessionId;

        try {
            if (!sessionId) {
                const sessionData = await chatApi.createSession(
                    currentInput.substring(0, 50),
                    'conversation',
                    mode
                );
                sessionId = sessionData.id;
                setCurrentSessionId(sessionId);
            }

            const aiMessageId = Date.now();
            setMessages(prev => [...prev, { role: 'ai', text: '', id: aiMessageId, sources: [], showSources: false }]);

            const data = await chatApi.sendQuery(currentInput, sessionId, mode);

            setMessages(prev => prev.map(msg =>
                msg.id === aiMessageId
                    ? {
                        ...msg,
                        text: data.response.replace('[SHOW_SOURCES]', '').trim(),
                        sources: data.sources_used || [],
                        showSources: data.response.includes('[SHOW_SOURCES]')
                    }
                    : msg
            ));

            if (onConversationUpdated) onConversationUpdated();
        } catch (err) {
            console.error(err);
            setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last.role === 'ai' && !last.text) {
                    return prev.map((m, i) => i === prev.length - 1 ? { ...m, text: `Error: ${err.message}` } : m);
                }
                return [...prev, { role: 'ai', text: `Error: ${err.message}` }];
            });
        } finally {
            setLoading(false);
        }
    };

    const handleNewConversation = () => setShowModeModal(true);

    const confirmNewConversation = (selectedMode) => {
        setMode(selectedMode);
        setShowModeModal(false);
        setMessages([]);
        setCurrentSessionId(null);
        setInput('');
        if (onNewConversation) onNewConversation();
    };

    const copyToClipboard = async (text) => {
        try { await navigator.clipboard.writeText(text); } catch (err) { console.error('Failed to copy:', err); }
    };

    return (
        <>
            {/* Toggle button for non-embedded mode */}
            {!isEmbedded && (
                <button
                    onClick={toggleChat}
                    className={`fixed top-1/2 -translate-y-1/2 w-8 h-8 bg-surface border border-border shadow-elevated rounded-lg flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/50 z-[101] ${isOpen ? '' : '-translate-x-4'} ${isResizing ? '' : 'transition-all duration-500'}`}
                    style={{ left: isOpen ? `${width - 16}px` : '0px' }}
                >
                    <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* Main chat panel */}
            <div
                className={`${isEmbedded ? 'relative h-full rounded-xl bg-surface border border-border' : 'fixed top-14 left-0 bottom-4 rounded-r-xl shadow-elevated z-[80] bg-surface border-r border-y border-border'} flex flex-col ${isResizing ? '' : 'transition-all duration-500'} ${isOpen || isEmbedded ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}
                style={{ width: isEmbedded ? '100%' : `${width}px` }}
            >
                {/* Resize handle */}
                {!isEmbedded && (
                    <div
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setIsResizing(true);
                            document.body.style.cursor = 'ew-resize';
                        }}
                        className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize group z-[90] flex items-center justify-center"
                    >
                        <div className="w-0.5 h-10 bg-border group-hover:bg-primary/50 rounded-full transition-all opacity-0 group-hover:opacity-100" />
                    </div>
                )}

                {/* Header */}
                <div className="px-5 py-4 flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary">
                            {activeConversation?.title || "Research Assistant"}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="status-dot online" />
                            <span className="text-[11px] text-text-muted">Connected</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {onToggleHistory && (
                            <button
                                onClick={onToggleHistory}
                                className="w-8 h-8 flex items-center justify-center bg-surface-light border border-border hover:border-border-light text-text-muted hover:text-text-primary rounded-lg transition-all"
                                title="History"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        )}
                        <button
                            onClick={handleNewConversation}
                            className="px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-background text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-all"
                        >
                            New Chat
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="relative flex-1 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-surface to-transparent z-10 pointer-events-none" />
                    <div
                        className="h-full overflow-y-auto px-5 py-4 space-y-5 scrollbar-hide"
                        ref={scrollRef}
                    >
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`flex flex-col gap-1.5 animate-fade-in-up ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                                style={{ animationDelay: `${i * 40}ms` }}
                            >
                                <div className={`flex items-center gap-1.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-[11px] font-medium text-text-muted">
                                        {m.role === 'user' ? username : 'Claude'}
                                    </span>
                                    {m.role === 'ai' && m.text && (
                                        <button
                                            onClick={() => copyToClipboard(m.text)}
                                            className="p-0.5 text-text-muted hover:text-text-primary transition-colors"
                                            title="Copy"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                <div className={`max-w-[85%] ${m.role === 'ai' ? 'w-full' : ''}`}>
                                    {m.role === 'ai' ? (
                                        <div className="bg-surface-light border border-border rounded-xl rounded-tl-sm p-4">
                                            {m.text ? (
                                                <div className="prose prose-sm max-w-none prose-headings:text-text-primary prose-p:text-text-secondary prose-strong:text-text-primary prose-a:text-primary prose-code:text-text-primary prose-code:bg-surface prose-code:px-1 prose-code:rounded">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {m.text}
                                                    </ReactMarkdown>
                                                </div>
                                            ) : (
                                                <div className="flex gap-1 h-5 items-center">
                                                    <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                    <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                    <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-primary/8 border border-primary/15 rounded-xl rounded-tr-sm px-4 py-3">
                                            <p className="text-sm text-text-primary">{m.text}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-surface to-transparent z-10 pointer-events-none" />
                </div>

                {/* Input area */}
                <div className="relative p-3">
                    <div className={`relative bg-surface rounded-xl border overflow-hidden transition-colors ${isFocused ? 'border-primary shadow-[0_0_0_1px_var(--primary)]' : 'border-border'}`}>
                        <div className="bg-surface-light px-4 py-3">
                            <textarea
                                ref={textareaRef}
                                autoFocus
                                rows="1"
                                className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted resize-none outline-none focus:outline-none focus:ring-0 border-0"
                                style={{ minHeight: '40px', maxHeight: '200px' }}
                                placeholder="Ask about your research..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                            />
                        </div>

                        <div className="border-t border-border bg-surface px-4 py-2 flex items-center justify-between">
                            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium ${mode === 'thesis'
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'bg-surface-light text-text-muted border border-border'
                                }`}>
                                <div className={`w-1 h-1 rounded-full ${mode === 'thesis' ? 'bg-primary' : 'bg-text-muted'}`} />
                                {mode === 'thesis' ? 'AML Thesis' : 'General'}
                            </div>

                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="w-8 h-8 flex items-center justify-center bg-primary hover:bg-primary-dark text-background rounded-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>

                        {/* Mode Selection Modal */}
                        {showModeModal && (
                            <div
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center"
                                onClick={() => setShowModeModal(false)}
                            >
                                <div
                                    className="bg-surface border border-border rounded-xl p-5 max-w-sm w-full mx-4 shadow-elevated"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <h3 className="text-base font-semibold text-text-primary mb-3">
                                        Choose Mode
                                    </h3>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => confirmNewConversation('thesis')}
                                            className="w-full p-3.5 bg-primary/10 hover:bg-primary text-primary hover:text-background border border-primary/20 rounded-lg transition-all text-left"
                                        >
                                            <div className="text-sm font-semibold">AML Thesis</div>
                                            <div className="text-xs opacity-70 mt-0.5">Research assistant with your saved papers</div>
                                        </button>
                                        <button
                                            onClick={() => confirmNewConversation('general')}
                                            className="w-full p-3.5 bg-surface-light hover:bg-surface-hover border border-border hover:border-border-light rounded-lg transition-all text-left text-text-primary"
                                        >
                                            <div className="text-sm font-semibold">General</div>
                                            <div className="text-xs text-text-muted mt-0.5">General purpose assistant</div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
