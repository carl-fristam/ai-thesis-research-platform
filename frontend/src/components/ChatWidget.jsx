import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as chatService from '../api/chat';

export default function ChatWidget({
    username, token, isOpen, toggleChat, width, setWidth, isResizing, setIsResizing, isEmbedded = false,
    activeChat, onNewChat, onChatUpdated, onToggleHistory
}) {
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('kb_chat_messages');
        return saved ? JSON.parse(saved) : [{ role: 'ai', text: 'Ask me anything about your saved sources.' }];
    });
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState(() => {
        return localStorage.getItem('kb_chat_session_id');
    });
    const [expandedMessages, setExpandedMessages] = useState(new Set());
    const scrollRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (activeChat) {
            setSessionId(activeChat.id);
            const normalizedMessages = (activeChat.messages || []).map(m => ({
                ...m,
                role: m.role === 'assistant' ? 'ai' : m.role,
                text: m.text || m.content || ''
            }));
            setMessages(normalizedMessages);
        } else {
            const savedMsgs = localStorage.getItem('kb_chat_messages');
            setMessages(savedMsgs ? JSON.parse(savedMsgs) : [{ role: 'ai', text: 'Ask me anything about your saved sources.' }]);
            const savedSession = localStorage.getItem('kb_chat_session_id');
            setSessionId(savedSession);
        }
    }, [activeChat]);

    useEffect(() => {
        if (!activeChat) {
            localStorage.setItem('kb_chat_messages', JSON.stringify(messages));
        }
    }, [messages, activeChat]);

    useEffect(() => {
        if (!activeChat && sessionId) {
            localStorage.setItem('kb_chat_session_id', sessionId);
        }
    }, [sessionId, activeChat]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen, isEmbedded]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            const maxHeight = 200;
            textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
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

        let currentSessionId = sessionId;

        try {
            if (!sessionId) {
                try {
                    const sessionData = await chatService.createChat(currentInput.substring(0, 50), 'knowledge_base');
                    currentSessionId = sessionData.id;
                    setSessionId(currentSessionId);
                } catch (err) {
                    console.error('Failed to create session:', err);
                }
            }

            const aiMessageId = Date.now();
            setMessages(prev => [...prev, { role: 'ai', text: '', id: aiMessageId, sources: [], showSources: false }]);

            const data = await chatService.sendQuery(currentInput, currentSessionId);

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

            if (onChatUpdated) {
                onChatUpdated();
            }

        } catch (err) {
            console.error(err);
            setMessages(prev => {
                // Find the placeholder AI message we added if any
                // If it exists, update it. If not (unlikely), add one.
                // We don't have easy access to aiMessageId here unless we move it up in scope or iterate.
                // Simplest is just append error if we crashed before `setMessages` call
                // But we probably crashed in `chatService` call.
                // Let's just append an error message if the last message is user or empty AI.
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

    const handleNewChat = () => {
        if (onNewChat) {
            onNewChat();
        }
        const initialMessage = [{ role: 'ai', text: 'Ask me anything about your saved sources.' }];
        setMessages(initialMessage);
        setInput('');
        setSessionId(null);
        localStorage.removeItem('kb_chat_messages');
        localStorage.removeItem('kb_chat_session_id');
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    // ... (Remainder of render is identical mostly, just ensuring no hardcoded fetches)
    // Minimizing render code duplication in this tool call by keeping it same structure as original
    // but without the fetch logic blocks.

    // I will include the FULL render return to ensure it writes correctly and doesn't break.
    return (
        <>
            {!isEmbedded && (
                <button
                    onClick={toggleChat}
                    className={`fixed top-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-full flex items-center justify-center text-slate-900 overflow-hidden hover:scale-110 active:scale-95 z-[101] group ${isOpen ? '' : '-translate-x-6'} ${isResizing ? '' : 'transition-all duration-500'}`}
                    style={{ left: isOpen ? `${width - 24}px` : '0px' }}
                >
                    {!isOpen && (
                        <span className="absolute inset-0 flex items-center justify-center bg-slate-900 group-hover:bg-black transition-colors">
                            <svg className={`w-6 h-6 text-white transition-transform duration-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </span>
                    )}
                    {isOpen && (
                        <svg className={`w-6 h-6 text-slate-900 transition-transform duration-500 rotate-180`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
                        </svg>
                    )}
                </button>
            )}

            <div
                className={`${isEmbedded ? 'relative h-full rounded-[40px] bg-background' : 'fixed top-[12vh] left-0 h-[76vh] rounded-r-[40px] shadow-[30px_0_100px_rgba(0,0,0,0.3)] z-[80] bg-surface border-r border-border'} flex flex-col ${isResizing ? '' : 'transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)'} ${isOpen || isEmbedded ? 'translate-x-0' : '-translate-x-full opacity-0 pointer-events-none'}`}
                style={{ width: isEmbedded ? '100%' : `${width}px` }}
            >
                <div
                    onMouseDown={(e) => {
                        e.preventDefault();
                        setIsResizing(true);
                        document.body.style.cursor = 'ew-resize';
                    }}
                    className="absolute right-0 top-0 bottom-0 w-6 cursor-ew-resize group z-[90] flex items-center justify-center"
                >
                    <div className="w-1.5 h-16 bg-slate-100 group-hover:bg-slate-300 rounded-full transition-all group-hover:scale-y-125 opacity-0 group-hover:opacity-100"></div>
                </div>

                <div className={`p-8 pb-4 flex justify-between items-center rounded-tr-[40px] ${isEmbedded ? '' : 'bg-surface/50 backdrop-blur-sm'}`}>
                    <div>
                        <h3 className="text-xl text-primary-light font-bold tracking-tight">{activeChat?.title || "Chat about sources"}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Connected to Vector DB</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onToggleHistory}
                            className="w-8 h-8 flex items-center justify-center bg-surface-light border border-border hover:border-border-light text-slate-500 hover:text-slate-200 rounded-full transition-all text-xs"
                            title="History"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </button>
                        <button
                            onClick={handleNewChat}
                            className="px-8 py-2 bg-surface-light hover:bg-primary text-slate-300 hover:text-white text-[11px] font-bold uppercase tracking-widest rounded-full transition-all shadow-sm hover:shadow-md min-w-[140px]"
                        >
                            New Chat
                        </button>
                    </div>
                </div>

                <div className="relative flex-1 overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-12 bg-gradient-to-b ${isEmbedded ? 'from-background' : 'from-surface'} to-transparent z-10 pointer-events-none`}></div>

                    <div
                        className="h-full overflow-y-auto p-8 pt-12 space-y-10 scroll-smooth"
                        ref={scrollRef}
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <style>{`
                            div::-webkit-scrollbar { display: none; }
                        `}</style>
                        {messages.map((m, i) => (
                            <div key={i} className={`flex flex-col gap-2 animate-fade-in-up ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`flex items-center gap-3 w-full ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                                        {m.role === 'user' ? username : 'Claude'}
                                    </span>
                                    {m.role === 'ai' && m.text && (
                                        <button
                                            onClick={() => copyToClipboard(m.text)}
                                            className="ml-auto p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                                            title="Copy to clipboard"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                <div className={`text-[15px] leading-relaxed w-fit max-w-[90%] ${m.role === 'ai' ? 'prose prose-slate prose-sm max-w-none prose-headings:font-bold prose-headings:text-slate-100 prose-p:text-slate-200 prose-strong:font-bold prose-strong:text-slate-100 prose-ul:list-disc prose-ul:text-slate-200 prose-ol:list-decimal prose-ol:text-slate-200 prose-li:my-1 prose-a:text-blue-400 prose-code:text-slate-200 prose-blockquote:text-slate-300' : 'text-slate-200'}`}>
                                    {m.role === 'ai' ? (
                                        <div className="bg-surface p-6 rounded-[28px] rounded-tl-sm border border-border shadow-sm shadow-black/20">
                                            <div className="markdown-content">
                                                {m.text ? (
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {m.text}
                                                    </ReactMarkdown>
                                                ) : (
                                                    <div className="flex gap-1.5 h-6 items-center">
                                                        <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                        <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                        <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-surface-light/80 p-5 rounded-[24px] rounded-tr-sm border border-border backdrop-blur-sm text-slate-100 font-medium">
                                            {m.text}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t ${isEmbedded ? 'from-background' : 'from-surface'} to-transparent z-10 pointer-events-none`}></div>
                </div>

                <div className="p-6 pt-4">
                    <div className="relative group flex items-end">
                        <textarea
                            ref={textareaRef}
                            autoFocus
                            rows="1"
                            className="w-full pl-6 pr-14 py-4 bg-surface-light border border-border rounded-[20px] outline-primary outline-offset-0 transition-all text-[14px] resize-none shadow-xl shadow-black/20 placeholder:text-slate-500 text-slate-100 overflow-y-auto"
                            style={{ minHeight: '55px', maxHeight: '200px' }}
                            placeholder="Ask a question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className="absolute right-2 bottom-1.5 p-3 bg-primary text-white rounded-[15px] shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}