'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { analyzeInvoice } from '@/app/actions/analyzeInvoice';
import type { FinalAnalysis } from '@/lib/schemas/invoice';
import { 
    Upload, FileText, CheckCircle, AlertCircle, Loader2, X, 
    Shield, AlertTriangle, XCircle, Eye, ChevronDown, ChevronUp,
    Receipt, Building2, Calendar, DollarSign, FileWarning
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnomalyDetectorPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [currentFileIndex, setCurrentFileIndex] = useState(0);
    const [results, setResults] = useState<FinalAnalysis[]>([]);
    const [expandedResult, setExpandedResult] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files);
            validateAndSetFiles(newFiles);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            validateAndSetFiles(newFiles);
        }
    };

    const validateAndSetFiles = (selectedFiles: File[]) => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'text/plain'];
        const validFiles = selectedFiles.filter(file => {
            if (!validTypes.includes(file.type)) {
                alert(`Invalid file type: ${file.name}. Please upload PDF or image files.`);
                return false;
            }
            if (file.size > 10 * 1024 * 1024) {
                alert(`File too large: ${file.name}. Maximum size is 10MB.`);
                return false;
            }
            return true;
        });

        setFiles(prev => [...prev, ...validFiles]);
        setResults([]);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (files.length === 0) return;

        setIsAnalyzing(true);
        setResults([]);
        setCurrentFileIndex(0);

        const allResults: FinalAnalysis[] = [];

        for (let i = 0; i < files.length; i++) {
            setCurrentFileIndex(i);
            
            const formData = new FormData();
            formData.append('invoice', files[i]);

            try {
                const result = await analyzeInvoice(formData);
                allResults.push(result);
            } catch (error: any) {
                allResults.push({
                    invoice_id: `ERR-${Date.now()}`,
                    status: 'rejected',
                    validation: {
                        is_valid: false,
                        extracted_fields: {} as any,
                        missing_mandatory_fields: [],
                        validation_errors: [error.message || 'Analysis failed'],
                        confidence_score: 0
                    },
                    policy_compliance: {
                        is_compliant: false,
                        policy_violations: [],
                        risk_score: 100,
                        recommendations: [],
                        relevant_policy_sections: []
                    },
                    overall_risk_score: 100,
                    summary: `Error analyzing ${files[i].name}: ${error.message}`,
                    processed_at: new Date().toISOString()
                });
            }
        }

        setResults(allResults);
        setIsAnalyzing(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'flagged': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'needs_review': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle className="w-5 h-5" />;
            case 'flagged': return <AlertTriangle className="w-5 h-5" />;
            case 'rejected': return <XCircle className="w-5 h-5" />;
            case 'needs_review': return <Eye className="w-5 h-5" />;
            default: return <FileWarning className="w-5 h-5" />;
        }
    };

    const getRiskColor = (score: number) => {
        if (score <= 30) return 'text-green-400';
        if (score <= 60) return 'text-yellow-400';
        if (score <= 80) return 'text-orange-400';
        return 'text-red-400';
    };

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-purple-500/30 overflow-hidden">
            <Navbar />
            
            <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
                
                {/* Background Gradients */}
                <div className="fixed top-0 left-0 right-0 h-[500px] bg-orange-900/10 blur-[120px] -z-10 pointer-events-none" />
                <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-red-900/10 blur-[120px] -z-10 pointer-events-none" />

                <div className="max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-300 text-sm font-medium mb-4">
                            <Shield className="w-4 h-4" />
                            <span>AI-Powered Invoice Analysis</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-linear-to-r from-gray-900 via-orange-600 to-orange-500 dark:from-white dark:via-orange-200 dark:to-orange-400">
                            Anomaly Detector
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-muted-foreground w-full max-w-xl mx-auto">
                            Upload invoices to validate, detect anomalies, and check policy compliance using AI agents.
                        </p>
                    </motion.div>

                    {/* Upload Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden mb-8"
                    >
                        <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-orange-500/50 to-transparent opacity-50" />

                        {files.length === 0 ? (
                            <div 
                                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer
                                    ${isDragging 
                                        ? 'border-orange-500 bg-orange-500/10 scale-[1.02]' 
                                        : 'border-white/10 hover:border-orange-500/30 hover:bg-white/5'
                                    }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="w-20 h-20 rounded-full bg-linear-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-white/10">
                                    <Receipt className="w-10 h-10 text-orange-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Upload Invoices</h3>
                                <p className="text-muted-foreground mb-6">PDF or Image files (Max 10MB each)</p>
                                <button className="px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-medium">
                                    Select Files
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">{files.length} Invoice(s) Selected</h3>
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-sm text-orange-400 hover:text-orange-300"
                                    >
                                        + Add More
                                    </button>
                                </div>
                                
                                {files.map((file, index) => (
                                    <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-linear-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center shrink-0">
                                            <FileText className="w-6 h-6 text-orange-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{file.name}</p>
                                            <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                        <button 
                                            onClick={() => removeFile(index)}
                                            className="p-2 rounded-full hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            className="hidden" 
                            accept=".pdf,.jpg,.jpeg,.png,.webp,.txt"
                            multiple
                        />

                        {/* Action Button */}
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={handleSubmit}
                                disabled={files.length === 0 || isAnalyzing}
                                className={`
                                    relative overflow-hidden group px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 w-full md:w-auto min-w-[250px]
                                    ${files.length === 0 || isAnalyzing ? 'opacity-50 cursor-not-allowed bg-white/5' : 'bg-linear-to-r from-orange-600 to-red-600 hover:shadow-lg hover:shadow-orange-500/25 transform hover:-translate-y-0.5'}
                                `}
                            >
                                <div className="relative z-10 flex items-center justify-center gap-2">
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Analyzing {currentFileIndex + 1}/{files.length}...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-5 h-5" />
                                            <span>Analyze Invoices</span>
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </motion.div>

                    {/* Results Area */}
                    <AnimatePresence>
                        {results.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
                                
                                {/* Summary Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                                        <p className="text-3xl font-bold text-green-400">
                                            {results.filter(r => r.status === 'approved').length}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Approved</p>
                                    </div>
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
                                        <p className="text-3xl font-bold text-yellow-400">
                                            {results.filter(r => r.status === 'flagged').length}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Flagged</p>
                                    </div>
                                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
                                        <p className="text-3xl font-bold text-orange-400">
                                            {results.filter(r => r.status === 'needs_review').length}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Needs Review</p>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                                        <p className="text-3xl font-bold text-red-400">
                                            {results.filter(r => r.status === 'rejected').length}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Rejected</p>
                                    </div>
                                </div>

                                {/* Individual Results */}
                                {results.map((result, index) => (
                                    <motion.div
                                        key={result.invoice_id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
                                    >
                                        {/* Header */}
                                        <div 
                                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                                            onClick={() => setExpandedResult(expandedResult === index ? null : index)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg border ${getStatusColor(result.status)}`}>
                                                    {getStatusIcon(result.status)}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{files[index]?.name || result.invoice_id}</p>
                                                    <p className="text-sm text-muted-foreground">{result.summary}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className={`font-mono font-bold ${getRiskColor(result.overall_risk_score)}`}>
                                                        {result.overall_risk_score}%
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">Risk Score</p>
                                                </div>
                                                {expandedResult === index ? 
                                                    <ChevronUp className="w-5 h-5 text-muted-foreground" /> : 
                                                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                                }
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        <AnimatePresence>
                                            {expandedResult === index && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t border-white/10"
                                                >
                                                    <div className="p-6 space-y-6">
                                                        {/* Extracted Fields */}
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                                                Extracted Information
                                                            </h4>
                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                                {result.validation.extracted_fields.merchant_name && (
                                                                    <div className="flex items-center gap-2">
                                                                        <Building2 className="w-4 h-4 text-muted-foreground" />
                                                                        <span className="text-sm">{result.validation.extracted_fields.merchant_name}</span>
                                                                    </div>
                                                                )}
                                                                {result.validation.extracted_fields.invoice_date && (
                                                                    <div className="flex items-center gap-2">
                                                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                                                        <span className="text-sm">{result.validation.extracted_fields.invoice_date}</span>
                                                                    </div>
                                                                )}
                                                                {result.validation.extracted_fields.amount && (
                                                                    <div className="flex items-center gap-2">
                                                                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                                                                        <span className="text-sm">
                                                                            {result.validation.extracted_fields.currency || '₹'}
                                                                            {result.validation.extracted_fields.amount}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Missing Fields */}
                                                        {result.validation.missing_mandatory_fields.length > 0 && (
                                                            <div>
                                                                <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">
                                                                    Missing Mandatory Fields
                                                                </h4>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {result.validation.missing_mandatory_fields.map((field, i) => (
                                                                        <span key={i} className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                                                                            {field}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Policy Violations */}
                                                        {result.policy_compliance.policy_violations.length > 0 && (
                                                            <div>
                                                                <h4 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-3">
                                                                    Policy Violations
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    {result.policy_compliance.policy_violations.map((violation, i) => (
                                                                        <div key={i} className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                                                                <span className="font-medium text-yellow-400">{violation.rule}</span>
                                                                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                                                    violation.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                                                                                    violation.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                                                                    violation.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                                    'bg-blue-500/20 text-blue-400'
                                                                                }`}>
                                                                                    {violation.severity}
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-sm text-muted-foreground">{violation.violation}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Recommendations */}
                                                        {result.policy_compliance.recommendations.length > 0 && (
                                                            <div>
                                                                <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">
                                                                    Recommendations
                                                                </h4>
                                                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                                                    {result.policy_compliance.recommendations.map((rec, i) => (
                                                                        <li key={i}>{rec}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
