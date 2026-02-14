import React from "react";
import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Header({ username, handleLogout }) {
    return (
        <nav className="fixed top-0 w-full z-50 glass">
            <div className="w-full max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

                {/* LEFT: LOGO */}
                <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <svg className="w-4 h-4 text-background" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <span className="text-sm font-semibold text-text-primary tracking-tight hidden sm:block">
                        Research Tool
                    </span>
                </Link>

                {/* CENTER: NAV */}
                <div className="flex items-center gap-1">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `px-4 py-1.5 text-[13px] font-medium rounded-lg transition-colors ${isActive
                                ? "text-primary bg-primary/8"
                                : "text-text-muted hover:text-text-primary"
                            }`
                        }
                    >
                        Knowledge Base
                    </NavLink>
                    <NavLink
                        to="/exa-showcase"
                        className={({ isActive }) =>
                            `px-4 py-1.5 text-[13px] font-medium rounded-lg transition-colors ${isActive
                                ? "text-primary bg-primary/8"
                                : "text-text-muted hover:text-text-primary"
                            }`
                        }
                    >
                        Research
                    </NavLink>
                </div>

                {/* RIGHT: CONTROLS */}
                <div className="flex items-center gap-3 shrink-0">
                    <ThemeToggle />
                    <div className="w-7 h-7 rounded-full bg-surface-light border border-border flex items-center justify-center">
                        <span className="text-[11px] font-semibold text-text-secondary uppercase">
                            {username?.charAt(0) || 'U'}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-[11px] font-medium text-text-muted hover:text-accent-coral uppercase tracking-wider transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </nav>
    );
}
