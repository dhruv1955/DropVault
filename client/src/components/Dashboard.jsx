import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserFiles, toggleRevokeFile, deleteUserFile, getUserStats } from '../service/api';
import { 
    Files, 
    Download, 
    ShieldCheck, 
    HardDrive, 
    Search, 
    RefreshCw, 
    Copy, 
    Check, 
    QrCode, 
    Trash2, 
    Lock, 
    Flame, 
    AlertCircle, 
    Ban, 
    CheckCircle2, 
    Clock, 
    Layers 
} from 'lucide-react';

export const Dashboard = ({ showToast, openQRModal }) => {
    const { isAuthenticated, openLogin, openRegister } = useAuth();

    const [files, setFiles] = useState([]);
    const [stats, setStats] = useState({
        totalFiles: 0,
        totalDownloads: 0,
        activeLinks: 0,
        totalStorageBytes: 0,
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'revoked', 'expired'
    const [copiedId, setCopiedId] = useState(null);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const loadDashboardData = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const [filesRes, statsRes] = await Promise.all([
                getUserFiles(),
                getUserStats()
            ]);
            setFiles(filesRes.files || []);
            setStats(statsRes.stats || {
                totalFiles: 0,
                totalDownloads: 0,
                activeLinks: 0,
                totalStorageBytes: 0
            });
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
            showToast('Failed to load dashboard files', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadDashboardData();
        }
    }, [isAuthenticated]);

    const handleToggleRevoke = async (fileId) => {
        setActionLoadingId(fileId);
        try {
            const res = await toggleRevokeFile(fileId);
            showToast(res.msg, 'success');
            await loadDashboardData();
        } catch (err) {
            showToast(err.response?.data?.msg || 'Failed to update link status', 'error');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDelete = async (fileId, fileName) => {
        if (!window.confirm(`Are you sure you want to permanently delete "${fileName}"? This action cannot be undone.`)) {
            return;
        }

        setActionLoadingId(fileId);
        try {
            await deleteUserFile(fileId);
            showToast('File permanently deleted', 'success');
            await loadDashboardData();
        } catch (err) {
            showToast(err.response?.data?.msg || 'Failed to delete file', 'error');
        } finally {
            setActionLoadingId(null);
        }
    };

    const copyToClipboard = (url, id) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        showToast('Download link copied to clipboard!', 'success');
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Filter and search logic
    const filteredFiles = files.filter((f) => {
        const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        if (filterStatus === 'active') return f.status === 'active';
        if (filterStatus === 'revoked') return f.status === 'revoked';
        if (filterStatus === 'expired') return f.status === 'expired' || f.status === 'limit_reached';
        return true;
    });

    // Unauthenticated state
    if (!isAuthenticated) {
        return (
            <div className="max-w-xl mx-auto py-12 px-6 text-center space-y-6 bg-white rounded-3xl border border-gray-200 shadow-sm animate-in fade-in duration-300">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F57C00]">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Access Your File Vault</h2>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                        Sign in to monitor download analytics, revoke links in real-time, enforce self-destruct triggers, and manage active shares.
                    </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                        onClick={openLogin}
                        className="px-5 py-2.5 rounded-xl bg-[#F57C00] hover:bg-[#bd5e00] text-white text-xs font-semibold shadow-sm shadow-orange-500/20 transition-all"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={openRegister}
                        className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-all border border-gray-200"
                    >
                        Create Free Account
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header with user welcome & refresh button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Vault <span className="text-[#F57C00]">Dashboard</span>
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Manage active file shares, revoke permissions, and review download metrics.
                    </p>
                </div>
                <button
                    onClick={loadDashboardData}
                    disabled={loading}
                    className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium transition-all shadow-sm"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#F57C00]' : ''}`} />
                    <span>Refresh Data</span>
                </button>
            </div>

            {/* Metrics Overview Cards with Functional Accents */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Uploads */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500">Total Uploads</span>
                        <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-blue-100 flex items-center justify-center text-[#2563EB]">
                            <Files className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalFiles}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Stored files in vault</p>
                </div>

                {/* Total Downloads */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500">Total Downloads</span>
                        <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] border border-green-100 flex items-center justify-center text-[#16A34A]">
                            <Download className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalDownloads}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Times files were accessed</p>
                </div>

                {/* Active Links */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500">Active Links</span>
                        <div className="w-9 h-9 rounded-xl bg-[#FFF7ED] border border-orange-100 flex items-center justify-center text-[#EA580C]">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeLinks}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Live download endpoints</p>
                </div>

                {/* Storage Used */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500">Storage Used</span>
                        <div className="w-9 h-9 rounded-xl bg-[#FAF5FF] border border-purple-100 flex items-center justify-center text-[#9333EA]">
                            <HardDrive className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formatFileSize(stats.totalStorageBytes)}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Total data footprint</p>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search files by name..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F57C00] focus:border-[#F57C00] transition-colors"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200 w-full sm:w-auto">
                    {['all', 'active', 'revoked', 'expired'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                                filterStatus === status
                                    ? 'bg-[#F57C00] text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Files List / Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-20 text-center space-y-3">
                        <div className="w-8 h-8 mx-auto border-2 border-orange-200 border-t-[#F57C00] rounded-full animate-spin" />
                        <p className="text-xs text-gray-500 font-medium">Fetching vault records...</p>
                    </div>
                ) : filteredFiles.length === 0 ? (
                    <div className="py-16 px-6 text-center space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-gray-800">No files found</h3>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto">
                            {searchQuery || filterStatus !== 'all'
                                ? 'No files match your search criteria or filter status.'
                                : 'You have not uploaded any files yet. Use the Upload tab to get started!'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredFiles.map((file) => {
                            const isActionLoading = actionLoadingId === file.id;

                            // Badges matching Alpha Housing CRM specs
                            let statusBadge = (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700 border border-green-200">
                                    <CheckCircle2 className="w-3 h-3" /> Active
                                </span>
                            );
                            if (file.status === 'revoked') {
                                statusBadge = (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700 border border-red-200">
                                        <Ban className="w-3 h-3" /> Revoked
                                    </span>
                                );
                            } else if (file.status === 'expired') {
                                statusBadge = (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                                        <Clock className="w-3 h-3" /> Expired
                                    </span>
                                );
                            } else if (file.status === 'limit_reached') {
                                statusBadge = (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                                        <Layers className="w-3 h-3" /> Limit Reached
                                    </span>
                                );
                            }

                            return (
                                <div
                                    key={file.id}
                                    className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors"
                                >
                                    {/* File metadata */}
                                    <div className="space-y-1.5 truncate max-w-md">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm text-gray-900 truncate">{file.name}</span>
                                            {statusBadge}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                                            <span>{formatFileSize(file.size)}</span>
                                            <span>Uploaded: {formatDate(file.uploadedAt)}</span>
                                            <span className="flex items-center gap-1">
                                                <Download className="w-3 h-3 text-gray-400" />
                                                {file.downloadCount} {file.maxDownloads ? `/ ${file.maxDownloads}` : ''} downloads
                                            </span>
                                            {file.burnAfterReading && (
                                                <span className="flex items-center gap-1 text-red-600 font-medium">
                                                    <Flame className="w-3 h-3" /> Self-destruct
                                                </span>
                                            )}
                                            {file.hasPassword && (
                                                <span className="flex items-center gap-1 text-amber-600 font-medium">
                                                    <Lock className="w-3 h-3" /> Protected
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {/* Copy Link */}
                                        <button
                                            onClick={() => copyToClipboard(file.downloadUrl, file.id)}
                                            disabled={file.status !== 'active'}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F57C00] hover:bg-[#bd5e00] text-white text-xs font-medium transition-all disabled:opacity-40 shadow-sm shadow-orange-500/10"
                                            title="Copy Share Link"
                                        >
                                            {copiedId === file.id ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                                            <span>{copiedId === file.id ? 'Copied' : 'Copy'}</span>
                                        </button>

                                        {/* QR Code */}
                                        <button
                                            onClick={() => openQRModal(file.downloadUrl, file.name)}
                                            disabled={file.status !== 'active'}
                                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs transition-all disabled:opacity-40"
                                            title="Mobile QR Code"
                                        >
                                            <QrCode className="w-4 h-4" />
                                        </button>

                                        {/* Revoke / Restore Toggle */}
                                        <button
                                            onClick={() => handleToggleRevoke(file.id)}
                                            disabled={isActionLoading}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                                                file.isRevoked
                                                    ? 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                                                    : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                                            }`}
                                        >
                                            {isActionLoading ? '...' : file.isRevoked ? 'Restore Link' : 'Revoke Link'}
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDelete(file.id, file.name)}
                                            disabled={isActionLoading}
                                            className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                            title="Delete permanently"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
