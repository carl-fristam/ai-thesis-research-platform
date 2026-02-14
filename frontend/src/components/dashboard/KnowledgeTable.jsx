import React from "react";

export default function KnowledgeTable({
    sources,
    filter,
    setFilter,
    selectedTags,
    setSelectedTags,
    showFavorites,
    setShowFavorites,
    allTags,
    toggleTagSelect,
    deletingId,
    undoDelete,
    undoState,
    toggleFavorite,
    removeSource,
    openNote,
    addTag,
    removeTag,
    editingId,
    setEditingId,
    tagInput,
    setTagInput
}) {
    const filteredSources = sources.filter(s => {
        const searchLower = filter.toLowerCase();
        const keywords = searchLower.split(" ").filter(k => k.trim());
        const matchesSearch = keywords.length === 0 || keywords.every(k =>
            s.title?.toLowerCase().includes(k) ||
            s.url?.toLowerCase().includes(k) ||
            s.tags?.some(t => t.toLowerCase().includes(k))
        );
        const matchesTags = selectedTags.length === 0 || selectedTags.every(t => s.tags?.includes(t));
        const matchesFav = !showFavorites || s.is_favorite;
        return matchesSearch && matchesTags && matchesFav;
    });

    return (
        <div className="flex-1 min-w-0 h-full flex flex-col py-4 pr-4">
            {/* UNDO BUTTON */}
            {undoState && (
                <button
                    onClick={undoDelete}
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-surface border border-border rounded-lg shadow-elevated animate-fade-in-up hover:border-primary transition-all"
                >
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    <span className="text-xs font-medium text-text-primary">Undo delete</span>
                </button>
            )}

            <div className="bg-surface border border-border rounded-xl w-full flex flex-col flex-1 min-h-0 overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-border">
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-lg font-semibold text-text-primary tracking-tight">Saved Sources</h1>
                            <p className="text-xs text-text-muted mt-0.5">
                                {sources.length} paper{sources.length !== 1 ? 's' : ''} in your knowledge base
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowFavorites(!showFavorites)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all ${showFavorites
                                    ? "bg-primary text-background"
                                    : "bg-surface-light border border-border text-text-muted hover:text-text-primary"
                                    }`}
                            >
                                <svg className="w-3.5 h-3.5" fill={showFavorites ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                Fav
                            </button>
                            <div className="relative">
                                <input
                                    className="w-48 pl-8 pr-3 py-2 bg-surface-light border border-border rounded-lg text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary/10 outline-none transition-all"
                                    placeholder="Search papers..."
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                />
                                <svg className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Tag filters */}
                    {allTags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-medium text-text-muted mr-0.5 uppercase tracking-wider">Tags:</span>
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTagSelect(tag)}
                                    className={`tag-pill ${selectedTags.includes(tag) ? 'active' : ''}`}
                                >
                                    {tag}
                                </button>
                            ))}
                            {selectedTags.length > 0 && (
                                <button
                                    onClick={() => setSelectedTags([])}
                                    className="text-[10px] text-text-muted hover:text-accent-coral transition-colors ml-1"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr>
                                <th className="sticky top-0 z-20 bg-surface-light px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted w-10 text-center border-b border-border">
                                    Fav
                                </th>
                                <th className="sticky top-0 z-20 bg-surface-light px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted min-w-[280px] border-b border-border">
                                    Source
                                </th>
                                <th className="sticky top-0 z-20 bg-surface-light px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted w-1/5 border-b border-border">
                                    Tags
                                </th>
                                <th className="sticky top-0 z-20 bg-surface-light px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted w-1/5 border-b border-border">
                                    Notes
                                </th>
                                <th className="sticky top-0 z-20 bg-surface-light px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted text-right w-16 border-b border-border">
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSources.map((s, idx) => (
                                <tr
                                    key={s.id}
                                    className={`group hover:bg-surface-light/50 transition-colors duration-150 ${deletingId === s.id ? "opacity-0 scale-95" : "opacity-100"}`}
                                    style={{ animationDelay: `${idx * 30}ms` }}
                                >
                                    {/* Favorite */}
                                    <td className="px-4 py-3 text-center border-b border-border/40">
                                        <button
                                            onClick={() => toggleFavorite(s)}
                                            className={`transition-all ${s.is_favorite
                                                ? "text-primary"
                                                : "text-text-muted opacity-20 group-hover:opacity-60 hover:!opacity-100 hover:text-primary"
                                                }`}
                                        >
                                            <svg className="w-4 h-4" fill={s.is_favorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        </button>
                                    </td>

                                    {/* Title & URL */}
                                    <td className="px-4 py-3 border-b border-border/40">
                                        <a
                                            href={s.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block text-sm font-medium text-text-primary hover:text-primary transition-colors line-clamp-2 leading-snug"
                                        >
                                            {s.title || "Untitled Document"}
                                        </a>
                                        <p className="text-[11px] text-text-muted font-mono mt-0.5 truncate max-w-[250px]">
                                            {s.url}
                                        </p>
                                    </td>

                                    {/* Tags */}
                                    <td className="px-4 py-3 border-b border-border/40 relative">
                                        <div className="flex flex-wrap gap-1 mb-1.5">
                                            {s.tags?.map(t => (
                                                <span key={t} className="tag-pill group/tag">
                                                    {t}
                                                    <button
                                                        onClick={() => removeTag(s, t)}
                                                        className="text-text-muted hover:text-accent-coral transition-colors"
                                                    >
                                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </span>
                                            ))}
                                            <button
                                                onClick={() => setEditingId(editingId === s.id ? null : s.id)}
                                                className="tag-trigger tag-pill hover:border-primary hover:text-primary"
                                            >
                                                + Add
                                            </button>
                                        </div>

                                        {editingId === s.id && (
                                            <div className="tag-popup absolute z-10 bg-surface border border-border shadow-elevated p-2.5 rounded-lg mt-0.5 min-w-[170px] animate-fade-in">
                                                <div className="flex gap-1">
                                                    <input
                                                        className="flex-1 px-2.5 py-1.5 text-xs bg-surface-light border-border rounded-md text-text-primary placeholder:text-text-muted focus:border-primary outline-none"
                                                        placeholder="New tag..."
                                                        value={tagInput}
                                                        onChange={e => setTagInput(e.target.value)}
                                                        autoFocus
                                                        onKeyDown={e => e.key === 'Enter' && addTag(s.id, s.tags || [])}
                                                    />
                                                    <button
                                                        onClick={() => addTag(s.id, s.tags || [])}
                                                        className="px-2.5 py-1.5 bg-primary text-background text-xs font-semibold rounded-md hover:bg-primary-dark transition-colors"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                                {allTags.filter(t => t.toLowerCase().includes(tagInput.toLowerCase()) && !s.tags?.includes(t)).length > 0 && (
                                                    <div className="mt-1.5 pt-1.5 border-t border-border/50 space-y-0.5 max-h-20 overflow-y-auto">
                                                        <span className="text-[9px] uppercase font-semibold text-text-muted px-0.5">Suggestions</span>
                                                        {allTags.filter(t => t.toLowerCase().includes(tagInput.toLowerCase()) && !s.tags?.includes(t)).map(t => (
                                                            <button
                                                                key={t}
                                                                onClick={() => addTag(s.id, s.tags || [], t)}
                                                                className="block w-full text-left text-xs px-2 py-1 hover:bg-surface-light text-text-secondary hover:text-text-primary rounded transition-colors"
                                                            >
                                                                {t}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </td>

                                    {/* Notes */}
                                    <td className="px-4 py-3 border-b border-border/40">
                                        {s.note ? (
                                            <button
                                                onClick={(e) => openNote(s, e)}
                                                className="text-left text-xs text-text-secondary hover:text-text-primary line-clamp-2 transition-colors leading-relaxed"
                                            >
                                                {s.note}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => openNote(s, e)}
                                                className="w-7 h-7 flex items-center justify-center rounded-md bg-surface-light text-text-muted opacity-0 group-hover:opacity-100 hover:bg-primary/10 hover:text-primary transition-all"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        )}
                                    </td>

                                    {/* Delete */}
                                    <td className="px-4 py-3 text-right border-b border-border/40">
                                        <button
                                            onClick={(e) => removeSource(s.id, e)}
                                            className="w-7 h-7 flex items-center justify-center rounded-md text-text-muted hover:text-accent-coral hover:bg-accent-coral/10 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {/* Empty state */}
                            {filteredSources.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-16 text-center">
                                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-surface-light flex items-center justify-center">
                                            <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-text-muted">
                                            {filter ? "No papers match your search" : "No papers saved yet"}
                                        </p>
                                        <p className="text-xs text-text-muted mt-1">
                                            {filter ? "Try different keywords" : "Start researching to build your knowledge base"}
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
