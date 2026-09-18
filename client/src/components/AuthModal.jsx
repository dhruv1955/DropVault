import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const AuthModal = ({ showToast }) => {
    const { isAuthModalOpen, authModalMode, setAuthModalMode, closeAuthModal, login, register } = useAuth();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isAuthModalOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (authModalMode === 'login') {
                await login(email, password);
                if (showToast) showToast('Welcome back! Successfully logged in.', 'success');
            } else {
                if (!name.trim()) {
                    setError('Please enter your full name');
                    setIsLoading(false);
                    return;
                }
                await register(name, email, password);
                if (showToast) showToast('Account created! Welcome to DropVault.', 'success');
            }
            setName('');
            setEmail('');
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.msg || 'Authentication failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md p-8 rounded-3xl bg-white border border-gray-200 shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={closeAuthModal}
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header Icon */}
                <div className="w-12 h-12 mb-6 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F57C00] shadow-sm">
                    <ShieldCheck className="w-6 h-6" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                    {authModalMode === 'login' ? 'Welcome Back' : 'Create an Account'}
                </h2>
                <p className="text-sm text-gray-500 mt-1 mb-6">
                    {authModalMode === 'login' 
                        ? 'Sign in to access your file vault and analytics.' 
                        : 'Unlock persistent vault storage, link revocation & stats.'}
                </p>

                {/* Mode Switcher Tabs */}
                <div className="flex p-1 bg-gray-100 rounded-xl border border-gray-200 mb-6">
                    <button
                        type="button"
                        onClick={() => { setAuthModalMode('login'); setError(''); }}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                            authModalMode === 'login'
                                ? 'bg-[#F57C00] text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => { setAuthModalMode('register'); setError(''); }}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                            authModalMode === 'register'
                                ? 'bg-[#F57C00] text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Create Account
                    </button>
                </div>

                {error && (
                    <div className="p-3.5 mb-5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium leading-relaxed">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {authModalMode === 'register' && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Jane Doe"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F57C00] focus:border-[#F57C00] transition-colors"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@domain.com"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F57C00] focus:border-[#F57C00] transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F57C00] focus:border-[#F57C00] transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 py-3 px-4 rounded-xl bg-[#F57C00] hover:bg-[#bd5e00] text-white font-semibold text-sm shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>{authModalMode === 'login' ? 'Sign In to DropVault' : 'Complete Registration'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Free perks hint */}
                <div className="mt-6 pt-4 border-t border-gray-200 flex items-center gap-2 text-xs text-gray-500">
                    <Sparkles className="w-4 h-4 text-[#F57C00] shrink-0" />
                    <span>Free account includes link revocation, download limits & analytics</span>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
