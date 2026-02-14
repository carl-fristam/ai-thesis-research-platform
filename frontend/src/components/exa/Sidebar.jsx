import React from "react";

export default function Sidebar({
    isOpen,
    setIsOpen,
    searches,
    currentSearchId,
    selectSearch,
    deleteSearch,
    createNewSearch
}) {
    return (
        <>
            <aside className={`fixed left-0 top-14 bottom-0 w-60 bg-surface border-r border-border flex flex-col z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* New + Close */}
                <div className="p-3 border-b border-border flex gap-2">
                    <button
                        onClick={createNewSearch}
                        className="flex-1 py-2 bg-primary text-background text-xs font-medium rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        + New Search
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-light transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
                    {searches.length === 0 && (
                        <p className="text-xs text-text-muted text-center py-8">No searches yet</p>
                    )}

                    {searches.map(search => (
                        <div
                            key={search.id}
                            onClick={() => selectSearch(search)}
                            className={`group relative mx-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${currentSearchId === search.id
                                ? "bg-surface-light text-primary"
                                : "text-text-primary hover:bg-surface-light"
                                }`}
                        >
                            <div className="text-sm truncate pr-5">
                                {search.title || "Untitled Search"}
                            </div>
                            <div className="text-[11px] text-text-muted mt-0.5">
                                {new Date(search.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>

                            <button
                                onClick={(e) => deleteSearch(e, search.id)}
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

            {/* Toggle when collapsed */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed left-3 top-[4.5rem] z-50 w-8 h-8 bg-surface border border-border rounded-lg flex items-center justify-center text-text-muted hover:text-primary transition-colors"
                    title="Open sidebar"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}
        </>
    );
}
