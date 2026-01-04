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
        <div className="space-y-4 pb-20">
            {results.results.slice(0, showAllResults ? results.results.length : 10).map((item, idx) => {
                const savedItem = savedItems.find(s => s.url === item.url);
                const isSaved = !!savedItem;
                const isFav = savedItem?.is_favorite;

                return (
                    <div
                        key={idx}
                        onClick={(e) => openPreview(e, item.url, item.text)}
                        className={`bg-surface p-4 border shadow-sm transition-all group rounded-xl cursor-pointer ${previewUrl === item.url ? "border-primary ring-1 ring-primary" : "border-border hover:border-border-light"}`}
                    >
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <h2 className="text-base font-bold text-slate-100 leading-tight group-hover:text-primary-light transition-colors">
                                <span className="hover:underline">
                                    {item.title || "Untitled Result"}
                                </span>
                            </h2>
                            <div className="flex items-center gap-2">
                                {/* STAR BUTTON */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStarClick(item, savedItem);
                                    }}
                                    className={`text-xl transition-colors ${isFav ? "text-amber-400 hover:text-amber-500" : "text-slate-700 hover:text-amber-400"}`}
                                    title={isFav ? "Remove from favorites" : "Add to favorites"}
                                >
                                    ★
                                </button>

                                {/* SAVE BUTTON */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSave(item, savedItem);
                                    }}
                                    className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest transition-colors rounded-full ${isSaved
                                        ? "bg-emerald-900/40 text-emerald-300 hover:bg-emerald-900/60"
                                        : "bg-surface-light hover:bg-primary hover:text-white text-slate-400"
                                        }`}
                                >
                                    {isSaved ? "SAVED" : "Save"}
                                </button>
                            </div>
                        </div>

                        <p className="text-slate-500 text-[10px] font-mono mb-2 truncate">{item.url}</p>

                        <div className="text-slate-300 text-xs leading-relaxed mb-1 line-clamp-4">
                            {item.text || <span className="italic opacity-50">No preview available.</span>}
                        </div>
                    </div>
                );
            })}

            {/* SHOW MORE BUTTON */}
            {results.results.length > 10 && !showAllResults && (
                <div className="flex justify-center pt-8">
                    <button
                        onClick={() => setShowAllResults(true)}
                        className="px-8 py-4 bg-surface border border-border hover:border-primary hover:bg-surface-light text-slate-300 hover:text-primary-light font-bold text-sm uppercase tracking-widest rounded-2xl transition-all shadow-lg hover:shadow-primary/20"
                    >
                        Show More Results ({results.results.length - 10} remaining)
                    </button>
                </div>
            )}

            {showAllResults && results.results.length > 10 && (
                <div className="flex justify-center pt-8">
                    <button
                        onClick={() => setShowAllResults(false)}
                        className="px-8 py-4 bg-surface-light border border-border hover:border-primary text-slate-400 hover:text-primary-light font-bold text-xs uppercase tracking-widest rounded-2xl transition-all"
                    >
                        Show Less
                    </button>
                </div>
            )}
        </div>
    );
}
