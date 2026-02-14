import React from "react";

export default function NotePopup({ activeNote, saveNote, noteInput, setNoteInput }) {
    if (!activeNote) return null;

    return (
        <>
            <div className="fixed inset-0 z-[60]" onClick={() => saveNote()}></div>
            <div
                className="fixed z-[70] bg-surface w-60 p-3.5 rounded-xl shadow-elevated border border-border animate-pop-in"
                style={{ top: activeNote.y, left: activeNote.x }}
            >
                <h4 className="text-[10px] font-semibold uppercase text-text-muted mb-2 tracking-wider">Edit Note</h4>
                <textarea
                    className="w-full text-sm text-text-primary bg-surface-light border-none rounded-lg p-2 resize-none outline-none focus:ring-1 focus:ring-border h-20 mb-2 placeholder:text-text-muted"
                    placeholder="Add a note..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    autoFocus
                />
                <div className="flex justify-end">
                    <button
                        onClick={saveNote}
                        className="px-3 py-1 bg-primary text-background text-xs font-semibold rounded-md hover:bg-primary-dark transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </>
    );
}
