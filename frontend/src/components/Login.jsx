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
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md mx-4 animate-fade-in-up">
                {/* Card */}
                <div className="bg-surface border border-border rounded-3xl p-10 shadow-elevated">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mb-6 shadow-glow-primary">
                            <svg className="w-8 h-8 text-background" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h1 className="font-display text-display-md text-text-primary mb-2">
                            {isRegistering ? "Create Account" : "Research Archive"}
                        </h1>
                        <p className="text-sm text-text-muted">
                            {isRegistering ? "Join the research platform" : "Sign in to continue"}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-accent-coral/10 border border-accent-coral/20 rounded-xl animate-fade-in">
                                <p className="text-sm text-accent-coral text-center font-medium">{error}</p>
                            </div>
                        )}
                        {successMsg && (
                            <div className="p-4 bg-accent-sage/10 border border-accent-sage/20 rounded-xl animate-fade-in">
                                <p className="text-sm text-accent-sage text-center font-medium">{successMsg}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">
                                Username
                            </label>
                            <input
                                type="text"
                                autoComplete="username"
                                className="w-full px-4 py-3.5 bg-surface-light border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">
                                Password
                            </label>
                            <input
                                type="password"
                                autoComplete="current-password"
                                className="w-full px-4 py-3.5 bg-surface-light border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-primary hover:bg-primary-dark text-background font-bold text-sm uppercase tracking-wider rounded-xl transition-all hover:shadow-glow-primary hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {isRegistering ? "Create Account" : "Sign In"}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-8 border-t border-border/50 text-center">
                        <button
                            type="button"
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="text-sm text-text-muted hover:text-primary transition-colors"
                        >
                            {isRegistering
                                ? "Already have an account? Sign in"
                                : "Need an account? Create one"}
                        </button>
                    </div>
                </div>

                {/* Bottom text */}
                <p className="text-center mt-6 text-xs text-text-muted">
                    AML Research Platform
                </p>
            </div>
        </div>
    );
};

export default Login;
