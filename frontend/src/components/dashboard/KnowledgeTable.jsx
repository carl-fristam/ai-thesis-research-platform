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
    tagInput,
    setTagInput
}) {
    const [tagMenuOpen, setTagMenuOpen] = React.useState(false);
    const [activeTagPopup, setActiveTagPopup] = React.useState(null);

    const tableContainerRef = React.useRef(null);

    const openTagPopup = (source, e) => {
        e.stopPropagation();
        if (activeTagPopup?.id === source.id) {
            setActiveTagPopup(null);
            setTagInput("");
            return;
        }
        const rect = e.target.getBoundingClientRect();

        // Check if there is space below (approx 250px needed)
        const spaceBelow = window.innerHeight - rect.bottom;
        const showAbove = spaceBelow < 260;

        setActiveTagPopup({
            id: source.id,
            tags: source.tags || [],
            x: rect.left,
            y: showAbove ? rect.top - 8 : rect.bottom + 8,
            align: showAbove ? 'bottom' : 'top' // logic to align bottom of popup to y if showAbove
        });
        setTagInput("");
    };

    // Close popup on click outside OR scroll
    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (activeTagPopup && !e.target.closest(".tag-popup-fixed") && !e.target.closest(".tag-trigger")) {
                setActiveTagPopup(null);
            }
        };

        const handleScroll = () => {
            if (activeTagPopup) setActiveTagPopup(null);
        };

        document.addEventListener("mousedown", handleClickOutside);

        const scrollContainer = tableContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", handleScroll);
            }
        };
    }, [activeTagPopup]);

    // Derived filtering logic inside component to keep container clean
    const filteredSources = sources.filter(s => {
        // 1. Text Search (Multi-keyword, Case-Insensitive)
        const searchLower = filter.toLowerCase();
        const keywords = searchLower.split(" ").filter(k => k.trim());
        const matchesSearch = keywords.length === 0 || keywords.every(k =>
            s.title?.toLowerCase().includes(k) ||
            s.url?.toLowerCase().includes(k) ||
            s.tags?.some(t => t.toLowerCase().includes(k))
        );

        // 2. Tag Filter (AND logic)
        const matchesTags = selectedTags.length === 0 || selectedTags.every(t => s.tags?.includes(t));

        // 3. Favorites Filter
        const matchesFav = !showFavorites || s.is_favorite;

        return matchesSearch && matchesTags && matchesFav;
    });

    return (
        <div className="w-[60%] h-full flex flex-col pt-10 pb-8 pr-8 relative">
            {/* FIXED TAG POPUP */}
            {activeTagPopup && (
                <div
                    className="tag-popup-fixed fixed z-[100] bg-surface border border-border shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-3 rounded-xl flex flex-col gap-3 min-w-[220px] animate-in fade-in zoom-in-95 duration-200"
                    style={{
                        top: activeTagPopup.y,
                        left: activeTagPopup.x,
                        transform: activeTagPopup.align === 'bottom' ? 'translateY(-100%)' : 'none'
                    }}
                >
                    <div className="flex gap-2">
                        <input
                            className="flex-1 px-3 py-2 text-sm border border-border bg-surface-light text-slate-100 outline-none focus:border-primary rounded-lg placeholder:text-slate-500 transition-all font-medium"
                            placeholder="Add tag..."
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            autoFocus
                            onKeyDown={e => e.key === 'Enter' && addTag(activeTagPopup.id, activeTagPopup.tags)}
                        />
                        <button
                            onClick={() => addTag(activeTagPopup.id, activeTagPopup.tags)}
                            className="px-3 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                        >
                            OK
                        </button>
                    </div>

                    {/* Recent / Suggested Tags */}
                    {allTags.filter(t => t.toLowerCase().includes(tagInput.toLowerCase()) && !activeTagPopup.tags.includes(t)).length > 0 && (
                        <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto custom-scrollbar border-t border-border/50 pt-2">
                            <span className="text-[10px] uppercase font-black text-slate-500 px-1 tracking-widest mb-1">Suggestions</span>
                            {allTags.filter(t => t.toLowerCase().includes(tagInput.toLowerCase()) && !activeTagPopup.tags.includes(t)).slice(0, 10).map(t => (
                                <button
                                    key={t}
                                    onClick={() => addTag(activeTagPopup.id, activeTagPopup.tags, t)}
                                    className="text-left text-sm px-3 py-1.5 hover:bg-surface-light text-slate-300 hover:text-white rounded-lg font-medium truncate transition-colors flex items-center justify-between group"
                                >
                                    <span>{t}</span>
                                    <span className="opacity-0 group-hover:opacity-100 text-[10px] text-primary uppercase font-bold">+ Add</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
            {/* UNDO BUTTON */}
            {undoState && (
                <button
                    onClick={undoDelete}
                    className="absolute -right-4 top-12 z-50 bg-surface text-primary-light w-10 h-10 rounded-lg shadow-xl shadow-primary/20 border border-primary flex items-center justify-center hover:scale-110 transition-transform animate-pop-in cursor-pointer"
                    title="Undo Delete"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                </button>
            )}

            <div className="bg-surface border border-border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-xl w-full flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="p-4 shrink-0 bg-surface z-30 relative">
                    <h1 className="text-3xl font-bold text-primary-light">Saved sources</h1>
                    <p className="text-slate-400 mt-2">Overview of your saved research papers.</p>
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                        {/* LEFT: TAG FILTERS */}
                        {/* LEFT: TAG FILTERS */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Filter Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setTagMenuOpen(!tagMenuOpen)}
                                    className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 border transition-all ${tagMenuOpen
                                        ? "bg-surface-light text-primary-light border-primary-light"
                                        : "bg-surface-light text-slate-400 border-border hover:text-primary-light hover:border-primary-light"
                                        }`}
                                >
                                    <span>Filter Tags</span>
                                    <svg className={`w-3 h-3 transition-transform ${tagMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>

                                {tagMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setTagMenuOpen(false)}></div>
                                        <div className="absolute top-full left-0 mt-2 w-64 bg-surface border border-border shadow-2xl rounded-xl p-2 z-50 max-h-[300px] overflow-y-auto grid gap-1 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="px-2 py-1.5 text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-border/50 mb-1">Available Tags</div>
                                            {allTags.length === 0 ? (
                                                <div className="p-3 text-center text-xs text-slate-500 italic">No tags found.</div>
                                            ) : (
                                                allTags.map(tag => (
                                                    <button
                                                        key={tag}
                                                        onClick={() => toggleTagSelect(tag)}
                                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between group ${selectedTags.includes(tag)
                                                            ? "bg-primary/10 text-primary-light"
                                                            : "text-slate-400 hover:bg-surface-light hover:text-slate-200"
                                                            }`}
                                                    >
                                                        <span className="truncate">{tag}</span>
                                                        {selectedTags.includes(tag) && (
                                                            <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                        )}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Divider if we have selected tags */}
                            {selectedTags.length > 0 && <div className="w-px h-6 bg-border mx-1"></div>}

                            {/* Selected Tags Chips */}
                            {selectedTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTagSelect(tag)}
                                    className="group px-3 py-1 bg-primary text-white border border-primary rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 hover:bg-red-500 hover:border-red-500 transition-colors shadow-sm shadow-primary/20"
                                    title="Click to remove"
                                >
                                    {tag}
                                    <svg className="w-3 h-3 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            ))}

                            {selectedTags.length > 0 && (
                                <button
                                    onClick={() => setSelectedTags([])}
                                    className="text-[10px] font-bold uppercase text-slate-400 hover:text-red-400 ml-1 transition-colors"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        {/* RIGHT: FAVORITES & SEARCH */}
                        <div className="flex items-center gap-4 ml-auto">
                            <button
                                onClick={() => setShowFavorites(!showFavorites)}
                                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-full border transition-all ${showFavorites
                                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                    : "bg-surface-light text-slate-300 border-border hover:border-primary-light hover:text-primary-light"
                                    }`}
                            >
                                ★ Favorites Only
                            </button>
                            <div className="relative">
                                <input
                                    className="pl-10 pr-4 py-2 border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-xs w-48 bg-surface-light rounded-full transition-all focus:shadow-sm placeholder:text-slate-500 text-slate-100"
                                    placeholder="Search keywords..."
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                />
                                <svg className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div ref={tableContainerRef} className="flex-1 overflow-y-auto min-h-0">
                    <table className="w-full text-left border-separate border-spacing-0">
                        {/* THEAD and TBODY content from previous state, assuming tools merge correctly or I just wrap structure */}
                        <thead>
                            <tr className="bg-primary border-b border-primary-dark shadow-sm">
                                <th className="sticky top-0 z-20 bg-primary px-6 py-4 text-xs font-bold uppercase tracking-widest text-white w-12 text-center">Fav</th>
                                <th className="sticky top-0 z-20 bg-primary px-6 py-4 text-xs font-bold uppercase tracking-widest text-white min-w-[300px] whitespace-normal">Source Title / URL</th>
                                <th className="sticky top-0 z-20 bg-primary px-6 py-4 text-xs font-bold uppercase tracking-widest text-white w-1/5">Tags</th>
                                <th className="sticky top-0 z-20 bg-primary px-6 py-4 text-xs font-bold uppercase tracking-widest text-white w-1/5">Notes</th>
                                <th className="sticky top-0 z-20 bg-primary px-6 py-4 text-xs font-bold uppercase tracking-widest text-white text-right w-24">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {filteredSources.map((s) => (
                                <tr
                                    key={s.id}
                                    className={`hover:bg-surface-light transition-all duration-300 group ${deletingId === s.id ? "opacity-0 scale-95" : "opacity-100"}`}
                                >
                                    <td className="px-6 py-4 text-center cursor-pointer" onClick={() => toggleFavorite(s)}>
                                        <span className={`text-xl ${s.is_favorite ? "text-amber-400" : "text-slate-700 group-hover:text-slate-500"}`}>★</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <a
                                            href={s.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-bold text-slate-100 text-sm mb-1 break-words whitespace-normal hover:underline hover:text-primary-light block"
                                        >
                                            {s.title || "Untitled Document"}
                                        </a>
                                        <div className="text-xs text-slate-400 font-mono truncate max-w-[200px]">{s.url}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {s.tags?.map(t => (
                                                <span key={t} className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-surface-light text-slate-300 border border-border">
                                                    {t}
                                                    <button onClick={() => removeTag(s, t)} className="ml-1 hover:text-red-400">×</button>
                                                </span>
                                            ))}
                                            <button
                                                onClick={(e) => openTagPopup(s, e)}
                                                className={`tag-trigger px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${activeTagPopup?.id === s.id
                                                    ? "bg-primary text-white border border-primary"
                                                    : "bg-background border border-border text-slate-500 hover:border-primary-light hover:text-primary-light"
                                                    }`}
                                            >
                                                {activeTagPopup?.id === s.id ? "Close" : "+ Tag"}
                                            </button>
                                        </div>
                                        {/* Popup moved to root level */}
                                    </td>
                                    <td className="px-6 py-4 relative">
                                        {/* NOTES COLUMN */}
                                        {s.note ? (
                                            <div onClick={(e) => openNote(s, e)} className="cursor-pointer group/note">
                                                <p className="text-xs text-slate-400 line-clamp-2 hover:text-slate-200 transition-colors">{s.note}</p>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={(e) => openNote(s, e)}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-light text-slate-300 opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-all font-bold text-lg"
                                            >
                                                +
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={(e) => removeSource(s.id, e)} className="text-slate-600 hover:text-red-400 p-2 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredSources.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-16 text-center text-slate-400 text-sm">
                                        {filter ? "No matches found." : "Repository is empty. Start researching!"}
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
