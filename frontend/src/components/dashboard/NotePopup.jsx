import React from "react";

export default function NotePopup({ activeNote, saveNote, noteInput, setNoteInput }) {
    if (!activeNote) return null;

    return (
        <>
            <div className="fixed inset-0 z-[60]" onClick={() => saveNote()}></div>
            <div
                className="fixed z-[70] bg-surface w-64 p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-border animate-pop-in"
                style={{ top: activeNote.y, left: activeNote.x }}
            >
                <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Edit Note</h4>
                <textarea
                    className="w-full text-sm text-slate-200 bg-surface-light border-none rounded-lg p-2 resize-none outline-none focus:ring-1 focus:ring-border h-24 mb-2 placeholder:text-slate-500"
                    placeholder="Add a note..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    autoFocus
                />
                <div className="flex justify-end">
                    <button
                        onClick={saveNote}
                        className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg hover:scale-105 transition-transform shadow-md shadow-primary/30"
                    >
                        Save
                    </button>
                </div>
            </div>
        </>
    );
}
