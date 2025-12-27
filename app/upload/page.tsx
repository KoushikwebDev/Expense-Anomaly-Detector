'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { uploadCompanyPolicy } from '@/app/actions/uploadPolicy';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, X, Database,  Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
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
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setUploadResult(null);
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    
    if (!validTypes.includes(selectedFile.type)) {
      alert('Invalid file type. Please upload a PDF, DOCX, or TXT file.');
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
      alert('File is too large. Maximum size is 10MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('policy', file);
    // You can append other fields if needed, e.g., companyId

    try {
      const result = await uploadCompanyPolicy(formData);
      setUploadResult(result);
    } catch (error) {
      setUploadResult({ success: false, error: 'An unexpected error occurred during upload.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-purple-500/30 overflow-hidden">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        
        {/* Background Gradients */}
        <div className="fixed top-0 left-0 right-0 h-[500px] bg-purple-900/10 blur-[120px] -z-10 pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] -z-10 pointer-events-none" />

        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-4">
              <Database className="w-4 h-4" />
              <span>Knowledge Base Upload</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-linear-to-r from-white via-purple-200 to-purple-400">
              Upload Policy Document
            </h1>
            <p className="text-lg text-muted-foreground w-full max-w-xl mx-auto">
              Upload your company expense policy (PDF). It will be parsed, chunked, and embedded into the vector database to power the AI Agent.
            </p>
          </motion.div>

          {/* Upload Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-purple-500/50 to-transparent opacity-50" />

            {!file ? (
              <div 
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer
                  ${isDragging 
                    ? 'border-purple-500 bg-purple-500/10 scale-[1.02]' 
                    : 'border-white/10 hover:border-purple-500/30 hover:bg-white/5'
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-white/10">
                  <Upload className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Click to upload or drag and drop</h3>
                <p className="text-muted-foreground mb-6">PDF, DOCX or TXT (Max 10MB)</p>
                <button className="px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-medium">
                  Select File
                </button>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative group">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-linear-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center shrink-0">
                    <FileText className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-medium truncate pr-8">{file.name}</h4>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button 
                    onClick={handleRemoveFile}
                    className="p-2 rounded-full hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".pdf,.docx,.txt"
            />

            {/* Action Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={!file || isUploading}
                className={`
                  relative overflow-hidden group px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 w-full md:w-auto min-w-[200px]
                  ${!file || isUploading ? 'opacity-50 cursor-not-allowed bg-white/5' : 'bg-linear-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-0.5'}
                `}
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-5 h-5" />
                      <span>Process & Embed</span>
                    </>
                  )}
                </div>
                {!isUploading && file && (
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Results Area */}
          <AnimatePresence>
            {uploadResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`mt-6 p-6 rounded-xl border ${uploadResult.success ? 'border-green-500/20 bg-green-500/10' : 'border-red-500/20 bg-red-500/10'}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${uploadResult.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {uploadResult.success ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-1 ${uploadResult.success ? 'text-green-400' : 'text-red-400'}`}>
                      {uploadResult.success ? 'Upload Complete' : 'Upload Failed'}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {uploadResult.message || uploadResult.error}
                    </p>
                    
                    {uploadResult.success && (
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-black/20 p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Chunks</p>
                          <p className="text-2xl font-mono text-white">{uploadResult.chunksCreated}</p>
                        </div>
                        <div className="bg-black/20 p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Sections</p>
                          <p className="text-2xl font-mono text-white">{uploadResult.sections?.length || 0}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </main>
  );
}
