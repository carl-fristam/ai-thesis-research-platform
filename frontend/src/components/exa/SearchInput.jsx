import React from "react";

export default function SearchInput({
    query,
    setQuery,
    onSearch,
    loading,
    currentChatId
}) {
    return (
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50">
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="text-center">
                    {currentChatId && query && (
                        <p className="text-sm text-slate-400 mb-2 font-medium">Active Session</p>
                    )}
                    <h1 className="text-2xl font-bold text-primary-light mb-4">
                        {currentChatId && query ? query : "New Research Session"}
                    </h1>
                    <form onSubmit={onSearch} className="max-w-2xl mx-auto flex gap-2">
                        <input
                            autoFocus
                            className="flex-1 bg-surface border-2 border-border text-slate-100 px-8 py-5 rounded-[28px] outline-none text-[15px] font-medium transition-all focus:border-primary focus:shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] placeholder:text-slate-500 placeholder:font-normal"
                            placeholder="Describe what you want to find..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading || !query.trim()}
                            className="px-10 py-5 bg-primary text-white font-black uppercase tracking-[0.25em] text-[11px] rounded-[28px] hover:bg-primary-dark hover:shadow-2xl hover:shadow-primary/30 active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                        >
                            {loading ? "..." : "Search"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
