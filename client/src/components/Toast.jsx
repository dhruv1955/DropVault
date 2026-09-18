import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
    if (!toast) return null;

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
        error: <XCircle className="w-5 h-5 text-red-500 shrink-0" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
        info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
    };

    const borders = {
        success: 'border-l-4 border-l-emerald-500 bg-white text-gray-900 border border-gray-200 shadow-xl',
        error: 'border-l-4 border-l-red-500 bg-white text-gray-900 border border-gray-200 shadow-xl',
        warning: 'border-l-4 border-l-amber-400 bg-white text-gray-900 border border-gray-200 shadow-xl',
        info: 'border-l-4 border-l-blue-500 bg-white text-gray-900 border border-gray-200 shadow-xl'
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${borders[toast.type || 'info']} min-w-[280px] max-w-md`}>
                {icons[toast.type || 'info']}
                <p className="text-sm font-medium flex-1 text-gray-800">{toast.message}</p>
                {onClose && (
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Toast;
