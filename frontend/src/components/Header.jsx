import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Header({ username, handleLogout }) {
    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl">
            <div className="w-full max-w-7xl mx-auto px-8 h-20 grid grid-cols-3 items-center">

                {/* LEFT: LOGO & TITLE */}
                <div className="flex items-center justify-start">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                            <svg className="w-5 h-5 text-background" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <span className="font-display text-xl text-text-primary group-hover:text-primary-light transition-colors">
                            MSc Research Tool
                        </span>
                    </Link>
                </div>

                {/* CENTER: NAVIGATION */}
                <div className="flex items-center justify-center gap-2">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `relative px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${isActive
                                ? "text-primary bg-primary/10"
                                : "text-text-muted hover:text-text-primary hover:bg-surface-light"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                Knowledge Base
                                {isActive && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                                )}
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to="/exa-showcase"
                        className={({ isActive }) =>
                            `relative px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${isActive
                                ? "text-primary bg-primary/10"
                                : "text-text-muted hover:text-text-primary hover:bg-surface-light"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                Research
                                {isActive && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                                )}
                            </>
                        )}
                    </NavLink>
                </div>

                {/* RIGHT: USER & LOGOUT */}
                <div className="flex items-center justify-end gap-6">
                    <div className="flex items-center gap-3 px-4 py-2 bg-surface rounded-xl border border-border">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-sage/20 to-accent-sage/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-accent-sage uppercase">
                                {username?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <span className="text-sm font-medium text-text-secondary">
                            {username || 'User'}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-xs font-semibold text-text-muted hover:text-accent-coral uppercase tracking-wider transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </nav>
    );
}
