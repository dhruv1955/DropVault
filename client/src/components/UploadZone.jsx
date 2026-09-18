import React, { useState, useRef } from 'react';
import { uploadFile } from '../service/api';
import { useAuth } from '../context/AuthContext';
import { 
    UploadCloud, 
    File, 
    Shield, 
    KeyRound, 
    Flame, 
    Clock, 
    Eye, 
    EyeOff, 
    Copy, 
    Check, 
    QrCode, 
    X, 
    Layers, 
    Lock, 
    Sparkles 
} from 'lucide-react';

export const UploadZone = ({ showToast, onUploadSuccess, openQRModal }) => {
    const { isAuthenticated, openRegister } = useAuth();

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [copiedId, setCopiedId] = useState(null);

    // Advanced Security Settings
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [expiresInDays, setExpiresInDays] = useState('7');
    const [maxDownloads, setMaxDownloads] = useState('');
    const [burnAfterReading, setBurnAfterReading] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const fileInputRef = useRef(null);
    const MAX_SIZE_MB = 25;

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handleFileSelect = (e) => {
        const incoming = Array.from(e.target.files || []);
        processFiles(incoming);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const incoming = Array.from(e.dataTransfer.files || []);
        processFiles(incoming);
    };

    const processFiles = (newFiles) => {
        const validList = [];
        for (const file of newFiles) {
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                showToast(`File "${file.name}" exceeds ${MAX_SIZE_MB}MB limit`, 'error');
                continue;
            }
            validList.push(file);
        }

        if (validList.length + selectedFiles.length > 10) {
            showToast('You can upload a maximum of 10 files at once', 'warning');
            setSelectedFiles((prev) => [...prev, ...validList.slice(0, 10 - prev.length)]);
        } else {
            setSelectedFiles((prev) => [...prev, ...validList]);
        }
    };

    const removeSelectedFile = (index) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        setIsUploading(true);
        setProgress(0);

        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append('file', file);
        });

        if (password) formData.append('password', password);
        if (expiresInDays) formData.append('expiresInDays', expiresInDays);
        if (maxDownloads) formData.append('maxDownloads', maxDownloads);
        if (burnAfterReading) formData.append('burnAfterReading', 'true');

        try {
            const response = await uploadFile(formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
                    setProgress(percentCompleted);
                }
            });

            setUploadedFiles(response.files || []);
            setSelectedFiles([]);
            setPassword('');
            setMaxDownloads('');
            setBurnAfterReading(false);
            showToast(`Successfully uploaded ${response.count} file(s)!`, 'success');

            if (onUploadSuccess) onUploadSuccess();
        } catch (error) {
            showToast(error.response?.data?.msg || 'Failed to upload files. Please try again.', 'error');
        } finally {
            setIsUploading(false);
            setProgress(0);
        }
    };

    const copyToClipboard = (url, id) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        showToast('Download link copied to clipboard!', 'success');
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header Hero Section */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#F57C00] text-xs font-semibold">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Protected with SHA-256 / AES Grade Security</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                    Fast & Encrypted <span className="text-[#F57C00]">File Sharing</span>
                </h1>
                <p className="text-sm text-gray-500">
                    Upload your sensitive files with password protection, self-destruct timers, and single-use download limits.
                </p>
            </div>

            {/* Main Upload Box */}
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
                {/* Drag and drop dropzone */}
                <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative border-2 border-dashed border-gray-300 hover:border-[#F57C00] rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 bg-gray-50/70 hover:bg-orange-50/30"
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        multiple
                        className="hidden"
                    />

                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-50 group-hover:bg-orange-100 border border-orange-200 flex items-center justify-center text-[#F57C00] group-hover:scale-105 transition-all">
                        <UploadCloud className="w-8 h-8" />
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                        Click or drag & drop files here
                    </h3>
                    <p className="text-xs text-gray-500">
                        Supports documents, images, archives & media up to <span className="text-gray-800 font-medium">{MAX_SIZE_MB}MB</span> each
                    </p>
                </div>

                {/* Selected Files Preview List */}
                {selectedFiles.length > 0 && (
                    <div className="mt-6 space-y-2.5">
                        <div className="flex items-center justify-between text-xs text-gray-500 font-medium px-1">
                            <span>Selected Files ({selectedFiles.length})</span>
                            <button
                                onClick={() => setSelectedFiles([])}
                                className="text-red-500 hover:underline"
                            >
                                Clear All
                            </button>
                        </div>
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                            {selectedFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs"
                                >
                                    <div className="flex items-center gap-3 truncate">
                                        <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F57C00] shrink-0">
                                            <File className="w-4 h-4" />
                                        </div>
                                        <div className="truncate">
                                            <p className="text-gray-900 font-medium truncate">{file.name}</p>
                                            <p className="text-gray-500 text-[11px]">{formatFileSize(file.size)}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeSelectedFile(index)}
                                        className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Advanced Security Controls Drawer */}
                <div className="mt-6 pt-5 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center justify-between w-full text-xs font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-[#F57C00]" />
                            <span>Security & Expiration Options</span>
                        </div>
                        <span className="text-[11px] text-[#F57C00] font-medium">
                            {showAdvanced ? 'Hide Options ▲' : 'Configure Security ▼'}
                        </span>
                    </button>

                    {showAdvanced && (
                        <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-4 animate-in fade-in duration-200">
                            {/* Password Protection */}
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                                    <KeyRound className="w-3.5 h-3.5 text-[#F57C00]" />
                                    <span>Password Protection (Optional)</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Set access password for recipient"
                                        className="w-full pl-3 pr-10 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F57C00] focus:border-[#F57C00]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Expiry Time */}
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                                        <Clock className="w-3.5 h-3.5 text-[#F57C00]" />
                                        <span>Expiration Window</span>
                                    </label>
                                    <select
                                        value={expiresInDays}
                                        onChange={(e) => setExpiresInDays(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#F57C00] focus:border-[#F57C00]"
                                    >
                                        <option value="1">1 Day</option>
                                        <option value="3">3 Days</option>
                                        <option value="7">7 Days (Default)</option>
                                        <option value="30">30 Days</option>
                                        <option value="">Never Expire</option>
                                    </select>
                                </div>

                                {/* Download Limit */}
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                                        <Layers className="w-3.5 h-3.5 text-[#F57C00]" />
                                        <span>Max Downloads</span>
                                    </label>
                                    <select
                                        value={maxDownloads}
                                        disabled={burnAfterReading}
                                        onChange={(e) => setMaxDownloads(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#F57C00] focus:border-[#F57C00] disabled:opacity-40"
                                    >
                                        <option value="">Unlimited</option>
                                        <option value="1">1 Download Limit</option>
                                        <option value="5">5 Downloads</option>
                                        <option value="10">10 Downloads</option>
                                        <option value="50">50 Downloads</option>
                                    </select>
                                </div>
                            </div>

                            {/* Burn After Reading Toggle */}
                            <div className="pt-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                                        <Flame className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-800">Self-Destruct (Burn After Reading)</p>
                                        <p className="text-[11px] text-gray-500">File is permanently deleted immediately after first download.</p>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={burnAfterReading}
                                    onChange={(e) => {
                                        setBurnAfterReading(e.target.checked);
                                        if (e.target.checked) setMaxDownloads('1');
                                    }}
                                    className="w-4 h-4 accent-[#F57C00] rounded cursor-pointer"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Upload Action Button */}
                <div className="mt-6">
                    {isUploading ? (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-500 font-medium">
                                <span>Uploading securely...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="bg-[#F57C00] h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={selectedFiles.length === 0}
                            className="w-full py-3 px-4 rounded-xl bg-[#F57C00] hover:bg-[#bd5e00] text-white font-semibold text-sm shadow-md shadow-orange-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <UploadCloud className="w-4 h-4" />
                            <span>Upload {selectedFiles.length > 0 ? `(${selectedFiles.length} files)` : 'Files'}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Uploaded Files Ready Links */}
            {uploadedFiles.length > 0 && (
                <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-white border border-emerald-300 shadow-sm animate-in fade-in duration-300">
                    <div className="flex items-center gap-2.5 mb-4 text-emerald-600">
                        <Check className="w-5 h-5" />
                        <h3 className="font-bold text-sm text-gray-900">Files Ready for Secure Sharing!</h3>
                    </div>

                    <div className="space-y-3">
                        {uploadedFiles.map((file) => (
                            <div
                                key={file.id}
                                className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                                <div className="truncate">
                                    <p className="text-xs font-semibold text-gray-900 truncate">{file.name}</p>
                                    <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                                        <span>{formatFileSize(file.size)}</span>
                                        {file.burnAfterReading && (
                                            <span className="text-red-600 font-medium">🔥 Burn after reading</span>
                                        )}
                                        {file.hasPassword && (
                                            <span className="text-amber-600 font-medium">🔒 Password protected</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => copyToClipboard(file.path, file.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F57C00] hover:bg-[#bd5e00] text-white text-xs font-medium transition-all shadow-sm"
                                    >
                                        {copiedId === file.id ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                                        <span>{copiedId === file.id ? 'Copied' : 'Copy Link'}</span>
                                    </button>

                                    <button
                                        onClick={() => openQRModal(file.path, file.name)}
                                        title="QR Code for mobile"
                                        className="p-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                                    >
                                        <QrCode className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Guest Banner Prompt */}
            {!isAuthenticated && (
                <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-orange-50/70 border border-orange-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-[#F57C00] shrink-0" />
                        <p className="text-xs text-gray-700">
                            Want to <span className="text-gray-900 font-semibold">revoke links</span>, see <span className="text-gray-900 font-semibold">download statistics</span>, and manage your vault?
                        </p>
                    </div>
                    <button
                        onClick={openRegister}
                        className="px-3 py-1.5 rounded-xl bg-[#F57C00] hover:bg-[#bd5e00] text-white text-xs font-semibold shrink-0 transition-colors shadow-sm"
                    >
                        Sign Up Free
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadZone;
