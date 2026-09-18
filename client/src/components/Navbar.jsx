import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, UploadCloud, LayoutDashboard, LogIn, LogOut } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
    const { user, isAuthenticated, logout, openLogin, openRegister } = useAuth();

    return (
        <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Brand Logo */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('upload')}>
                    <div className="w-10 h-10 rounded-xl bg-[#F57C00] flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-lg text-gray-900 tracking-tight">Drop<span className="text-[#F57C00]">Vault</span></span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-50 text-[#F57C00] border border-orange-200">v2.0</span>
                        </div>
                        <p className="text-[11px] text-gray-500 -mt-0.5 hidden sm:block">Secure & Zero-Exposure File Vault</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <nav className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            activeTab === 'upload'
                                ? 'bg-[#F57C00] text-white shadow-sm shadow-orange-500/20'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                        }`}
                    >
                        <UploadCloud className="w-4 h-4" />
                        <span>Upload</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            activeTab === 'dashboard'
                                ? 'bg-[#F57C00] text-white shadow-sm shadow-orange-500/20'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                        }`}
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                    </button>
                </nav>

                {/* User Auth Section */}
                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200">
                                <div className="w-6 h-6 rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center text-[#F57C00] text-xs font-bold">
                                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                                </div>
                                <span className="text-xs font-medium text-gray-800 max-w-[120px] truncate">{user?.name}</span>
                            </div>
                            <button
                                onClick={logout}
                                title="Sign out"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={openLogin}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            >
                                <LogIn className="w-4 h-4 text-gray-500" />
                                <span>Sign In</span>
                            </button>
                            <button
                                onClick={openRegister}
                                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#F57C00] hover:bg-[#bd5e00] text-white shadow-sm shadow-orange-500/20 transition-all"
                            >
                                <span>Get Started</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
