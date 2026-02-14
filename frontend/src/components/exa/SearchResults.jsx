import React from "react";

export default function SearchResults({
    results,
    showAllResults,
    setShowAllResults,
    savedItems,
    handleStarClick,
    toggleSave,
    openPreview,
    previewUrl
}) {
    if (!results || !results.results) return null;

    return (
        <div className="space-y-3 pb-16 stagger-children">
            {results.results.slice(0, showAllResults ? results.results.length : 10).map((item, idx) => {
                const savedItem = savedItems.find(s => s.url === item.url);
                const isSaved = !!savedItem;
                const isFav = savedItem?.is_favorite;

                return (
                    <div
                        key={idx}
                        onClick={(e) => openPreview(e, item.url, item.text)}
                        className={`bg-surface p-4 border rounded-xl transition-all group cursor-pointer ${
                            previewUrl === item.url
                                ? "border-primary ring-1 ring-primary/30"
                                : "border-border hover:border-border-light"
                        }`}
                    >
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <h2 className="text-sm font-medium text-text-primary leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                {item.title || "Untitled Result"}
                            </h2>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStarClick(item, savedItem);
                                    }}
                                    className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${
                                        isFav
                                            ? "text-primary bg-primary/10"
                                            : "text-text-muted hover:text-primary hover:bg-primary/10"
                                    }`}
                                    title={isFav ? "Remove from favorites" : "Add to favorites"}
                                >
                                    <svg className="w-3.5 h-3.5" fill={isFav ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSave(item, savedItem);
                                    }}
                                    className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md transition-all ${
                                        isSaved
                                            ? "bg-accent-sage/15 text-accent-sage border border-accent-sage/25"
                                            : "bg-surface-light border border-border text-text-muted hover:bg-primary hover:text-background hover:border-primary"
                                    }`}
                                >
                                    {isSaved ? "Saved" : "Save"}
                                </button>
                            </div>
                        </div>

                        <p className="text-[11px] text-text-muted font-mono mb-2 truncate">{item.url}</p>

                        <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                            {item.text || <span className="italic text-text-muted">No preview available.</span>}
                        </p>
                    </div>
                );
            })}

            {results.results.length > 10 && !showAllResults && (
                <div className="flex justify-center pt-6">
                    <button
                        onClick={() => setShowAllResults(true)}
                        className="px-6 py-3 bg-surface border border-border hover:border-primary text-text-secondary hover:text-primary font-medium text-xs rounded-xl transition-all"
                    >
                        Show {results.results.length - 10} more results
                    </button>
                </div>
            )}

            {showAllResults && results.results.length > 10 && (
                <div className="flex justify-center pt-6">
                    <button
                        onClick={() => setShowAllResults(false)}
                        className="px-5 py-2.5 bg-surface-light border border-border hover:border-border-light text-text-muted hover:text-text-primary text-[10px] font-semibold uppercase tracking-wider rounded-lg transition-all"
                    >
                        Show less
                    </button>
                </div>
            )}
        </div>
    );
}
