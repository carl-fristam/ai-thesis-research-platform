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
            className="fixed bottom-6 right-6 top-28 bg-surface border border-border shadow-elevated z-50 flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
            style={{
                width: previewExpanded ? '70vw' : '28vw',
                minWidth: previewExpanded ? '700px' : '350px'
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-surface-light border-b border-border gap-4">
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                    {/* Mode toggle */}
                    <div className="flex rounded-lg bg-surface border border-border overflow-hidden shrink-0">
                        <button
                            onClick={() => setPreviewMode("web")}
                            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                                previewMode === "web"
                                    ? "bg-primary text-background"
                                    : "text-text-muted hover:text-text-primary hover:bg-surface-hover"
                            }`}
                        >
                            Web
                        </button>
                        <button
                            onClick={() => setPreviewMode("text")}
                            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                                previewMode === "text"
                                    ? "bg-primary text-background"
                                    : "text-text-muted hover:text-text-primary hover:bg-surface-hover"
                            }`}
                        >
                            Reader
                        </button>
                    </div>

                    <a
                        href={previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-text-secondary hover:text-primary truncate flex-1 min-w-0 transition-colors"
                    >
                        {previewUrl}
                    </a>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={togglePreviewSize}
                        className="px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-all"
                    >
                        {previewExpanded ? "Minimize" : "Expand"}
                    </button>
                    <button
                        onClick={closePreview}
                        className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-accent-coral hover:bg-accent-coral/10 rounded-lg transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            {previewMode === "web" ? (
                <iframe
                    src={previewUrl}
                    className="w-full flex-1 bg-white"
                    title="Preview"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
            ) : (
                <div className="w-full flex-1 bg-surface overflow-y-auto p-8">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="font-display text-xl text-text-primary mb-6">Reader Mode</h2>
                        <div className="prose prose-sm max-w-none text-text-secondary leading-relaxed whitespace-pre-wrap">
                            {previewText || (
                                <p className="italic text-text-muted">
                                    No text content available for this result. Try opening the website directly.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
