import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, ExternalLink, QrCode } from 'lucide-react';

export const QRCodeModal = ({ url, title, onClose, onCopy }) => {
    const [copied, setCopied] = useState(false);

    if (!url) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        if (onCopy) onCopy();
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm p-6 rounded-3xl bg-white border border-gray-200 shadow-2xl text-center">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F57C00]">
                    <QrCode className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">Mobile QR Share</h3>
                <p className="text-xs text-gray-500 mb-6 truncate px-2">{title || 'Scan to download file'}</p>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl inline-block shadow-inner mb-6">
                    <QRCodeSVG value={url} size={180} level="M" />
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleCopy}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#F57C00] hover:bg-[#bd5e00] text-white text-sm font-semibold transition-all shadow-sm shadow-orange-500/20"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 text-white" />
                                <span>Link Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                <span>Copy Share Link</span>
                            </>
                        )}
                    </button>

                    <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors border border-gray-200"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Direct Link</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default QRCodeModal;
