import React from "react";

export default function PreviewModal({
    previewUrl,
    previewText,
    previewMode,
    setPreviewMode,
    previewExpanded,
    togglePreviewSize,
    closePreview
}) {
    if (!previewUrl) return null;

    return (
        <div
            className="fixed bottom-6 right-6 top-32 bg-surface border border-border shadow-2xl z-50 flex flex-col rounded-2xl overflow-hidden ring-1 ring-primary/20 transition-all duration-300 ease-in-out"
            style={{
                width: previewExpanded ? '70vw' : '25vw'
            }}
        >
            <div className="flex items-center justify-between px-6 py-3 bg-surface-light border-b border-border">
                <div className="flex items-center gap-4 overflow-hidden flex-1">
                    <div className="flex rounded-md bg-surface border border-border overflow-hidden shrink-0">
                        <button
                            onClick={() => setPreviewMode("web")}
                            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${previewMode === "web" ? "bg-primary text-white" : "text-slate-400 hover:bg-surface-light"}`}
                        >
                            Website
                        </button>
                        <button
                            onClick={() => setPreviewMode("text")}
                            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${previewMode === "text" ? "bg-primary text-white" : "text-slate-400 hover:bg-surface-light"}`}
                        >
                            Reader Mode
                        </button>
                    </div>

                    <a href={previewUrl} target="_blank" rel="noreferrer" className="text-xs font-mono text-slate-100 hover:text-primary-light hover:underline truncate flex-1 min-w-0">
                        {previewUrl} <span className="text-[10px] text-slate-500 italic ml-2 opacity-50 font-sans normal-case">(Click to open in new tab if blocked)</span>
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    {/* SIZE TOGGLE BUTTON */}
                    <button
                        onClick={togglePreviewSize}
                        className="text-slate-400 hover:text-slate-100 font-bold p-2 transition-colors"
                        title={previewExpanded ? "Minimize" : "Expand"}
                    >
                        {previewExpanded ? "Minimize" : "Expand"}
                    </button>
                    <button onClick={closePreview} className="text-slate-400 hover:text-red-400 font-bold p-2 transition-colors">
                        ✕ Close
                    </button>
                </div>
            </div>

            {previewMode === "web" ? (
                <iframe
                    src={previewUrl}
                    className="w-full flex-1 bg-white"
                    title="Preview"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
            ) : (
                <div className="w-full flex-1 bg-surface overflow-y-auto p-12 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-slate-100 mb-6">Text Content Preview</h2>
                    <div className="prose prose-slate max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {previewText || <span className="italic text-slate-500">No text content available for this result. Try opening the website directly.</span>}
                    </div>
                </div>
            )}
        </div>
    );
}
