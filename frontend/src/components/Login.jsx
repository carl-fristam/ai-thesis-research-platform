import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const Login = ({ onLoginSuccess }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    useEffect(() => {
        setUsername('');
        setPassword('');
        setError(null);
        setSuccessMsg(null);
    }, [isRegistering]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        try {
            if (isRegistering) {
                await import('../api/auth').then(mod => mod.register(username, password));
                setSuccessMsg("Account created! Please login.");
                setIsRegistering(false);
            } else {
                const data = await import('../api/auth').then(mod => mod.login(username, password));
                localStorage.setItem("token", data.access_token);
                onLoginSuccess();
            }
        } catch (err) {
            console.error("Auth error:", err);
            setError(err.response?.data?.detail || "Authentication failed");
        }
    };

    return (
        <div className="fixed inset-0 min-h-screen w-full bg-background flex items-center justify-center z-[9999]">
            <div className="relative w-full max-w-sm mx-4 animate-fade-in-up">
                <div className="bg-surface border border-border rounded-2xl p-8 shadow-elevated">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-5">
                            <svg className="w-6 h-6 text-background" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-semibold text-text-primary tracking-tight">
                            {isRegistering ? "Create Account" : "Sign In"}
                        </h1>
                        <p className="text-xs text-text-muted mt-1.5">
                            {isRegistering ? "Join the research platform" : "Continue to your research"}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-accent-coral/10 border border-accent-coral/20 rounded-lg animate-fade-in">
                                <p className="text-xs text-accent-coral text-center font-medium">{error}</p>
                            </div>
                        )}
                        {successMsg && (
                            <div className="p-3 bg-accent-sage/10 border border-accent-sage/20 rounded-lg animate-fade-in">
                                <p className="text-xs text-accent-sage text-center font-medium">{successMsg}</p>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-medium text-text-muted uppercase tracking-wider">
                                Username
                            </label>
                            <input
                                type="text"
                                autoComplete="username"
                                className="w-full px-3.5 py-2.5 bg-surface-light border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-medium text-text-muted uppercase tracking-wider">
                                Password
                            </label>
                            <input
                                type="password"
                                autoComplete="current-password"
                                className="w-full px-3.5 py-2.5 bg-surface-light border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2.5 bg-primary hover:bg-primary-dark text-background font-semibold text-sm rounded-lg transition-all active:scale-[0.98]"
                        >
                            {isRegistering ? "Create Account" : "Sign In"}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 pt-5 border-t border-border text-center">
                        <button
                            type="button"
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="text-xs text-text-muted hover:text-primary transition-colors"
                        >
                            {isRegistering
                                ? "Already have an account? Sign in"
                                : "Need an account? Create one"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
