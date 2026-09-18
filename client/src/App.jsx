import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { UploadZone } from './components/UploadZone';
import { Dashboard } from './components/Dashboard';
import { AuthModal } from './components/AuthModal';
import { QRCodeModal } from './components/QRCodeModal';
import { Toast } from './components/Toast';

function AppContent() {
    const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'dashboard'
    const [toast, setToast] = useState(null);
    const [qrModalData, setQrModalData] = useState(null); // { url, title }

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const openQRModal = (url, title) => {
        setQrModalData({ url, title });
    };

    const closeQRModal = () => {
        setQrModalData(null);
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-gray-900 flex flex-col selection:bg-orange-500/20 selection:text-orange-900">
            {/* Global Navbar */}
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Application Area */}
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
                {activeTab === 'upload' ? (
                    <UploadZone 
                        showToast={showToast} 
                        openQRModal={openQRModal}
                        onUploadSuccess={() => {}}
                    />
                ) : (
                    <Dashboard 
                        showToast={showToast} 
                        openQRModal={openQRModal} 
                    />
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-500">
                <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p>© {new Date().getFullYear()} <span className="font-semibold text-gray-700">DropVault</span>. Secure Zero-Exposure File Sharing.</p>
                    <p className="flex items-center gap-2 text-gray-400">
                        <span>Protected Storage</span>
                        <span>•</span>
                        <span>SHA-256 Hashing</span>
                        <span>•</span>
                        <span>Self-Destruct Triggers</span>
                    </p>
                </div>
            </footer>

            {/* Global Modals & Notifications */}
            <AuthModal showToast={showToast} />
            
            {qrModalData && (
                <QRCodeModal
                    url={qrModalData.url}
                    title={qrModalData.title}
                    onClose={closeQRModal}
                    onCopy={() => showToast('Share link copied!', 'success')}
                />
            )}

            <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
