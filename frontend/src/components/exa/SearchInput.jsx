import React from "react";

export default function SearchInput({
    query,
    setQuery,
    onSearch,
    loading,
    currentSearchId
}) {
    return (
        <div className="sticky top-0 z-30 glass">
            <div className="max-w-3xl mx-auto px-6 py-6">
                <div className="text-center mb-5">
                    {currentSearchId && query ? (
                        <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1.5">Active Session</p>
                    ) : null}
                    <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
                        {currentSearchId && query ? query : "Research Papers"}
                    </h1>
                    {!currentSearchId && (
                        <p className="text-xs text-text-muted mt-1.5">Search academic papers with AI-powered discovery</p>
                    )}
                </div>

                <form onSubmit={onSearch} className="flex gap-2">
                    <div className="flex-1 relative">
                        <input
                            autoFocus
                            className="w-full bg-surface border border-border text-text-primary px-4 py-3 pr-10 rounded-xl text-sm placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-card"
                            placeholder="Describe what you're researching..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <svg className="w-4 h-4 text-text-muted absolute right-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !query.trim()}
                        className="px-6 py-3 bg-primary text-background font-semibold text-xs uppercase tracking-wider rounded-xl hover:bg-primary-dark transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                        ) : (
                            "Search"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
