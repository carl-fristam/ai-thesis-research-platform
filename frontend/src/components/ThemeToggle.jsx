import { useTheme } from "../ThemeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            className="relative flex items-center h-7 rounded-md bg-surface-light border border-border text-[10px] font-semibold uppercase tracking-widest select-none overflow-hidden"
        >
            <span className={`relative z-10 px-2.5 transition-colors duration-200 ${isDark ? "text-text-primary" : "text-text-muted"}`}>
                Dark
            </span>
            <span className={`relative z-10 px-2.5 transition-colors duration-200 ${!isDark ? "text-text-primary" : "text-text-muted"}`}>
                Light
            </span>
            <span
                className="absolute top-[2px] bottom-[2px] w-[calc(50%-2px)] rounded-[5px] bg-surface-hover transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                style={{ left: isDark ? "2px" : "calc(50%)" }}
            />
        </button>
    );
}
