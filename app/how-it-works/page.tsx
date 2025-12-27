'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { 
    Upload, Cpu, FileSearch, CheckCircle2, ArrowRight, 
    Sparkles, FileText, Shield, Brain, AlertTriangle,
    Database, Zap, Code2
} from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
            },
        },
    };

    const steps = [
        {
            number: "01",
            icon: Upload,
            title: "Upload Your Documents",
            description: "Simply drag and drop your invoices, receipts, or expense documents. We support PDF, images, and multiple file formats for your convenience.",
            features: ["Drag & Drop Interface", "Batch Upload Support", "Multiple File Formats"],
            color: "from-blue-500 to-cyan-500",
            bgGlow: "bg-blue-500/20"
        },
        {
            number: "02",
            icon: Brain,
            title: "AI Agent Analysis",
            description: "Our intelligent AI agents powered by OpenAI extract and validate all information from your documents using advanced OCR and natural language processing.",
            features: ["Smart OCR Extraction", "Field Validation", "Data Normalization"],
            color: "from-purple-500 to-pink-500",
            bgGlow: "bg-purple-500/20"
        },
        {
            number: "03",
            icon: Shield,
            title: "Policy Compliance Check",
            description: "Each document is automatically checked against your company's expense policies stored in our knowledge base, identifying any violations or concerns.",
            features: ["Custom Policy Rules", "Real-time Compliance", "Severity Assessment"],
            color: "from-orange-500 to-red-500",
            bgGlow: "bg-orange-500/20"
        },
        {
            number: "04",
            icon: FileSearch,
            title: "Anomaly Detection",
            description: "Our advanced algorithms analyze expense patterns, detect outliers, and flag potentially fraudulent or suspicious transactions for review.",
            features: ["Pattern Recognition", "Fraud Detection", "Risk Scoring"],
            color: "from-green-500 to-emerald-500",
            bgGlow: "bg-green-500/20"
        },
        {
            number: "05",
            icon: CheckCircle2,
            title: "Review & Action",
            description: "Get a comprehensive analysis report with clear recommendations. Approved expenses are auto-synced, while flagged items are queued for human review.",
            features: ["Detailed Reports", "Auto-Approval", "Easy Review Workflow"],
            color: "from-indigo-500 to-purple-500",
            bgGlow: "bg-indigo-500/20"
        }
    ];

    const techStack = [
        { icon: Brain, name: "OpenAI Agents SDK", description: "Multi-agent orchestration" },
        { icon: Database, name: "Supabase Vector DB", description: "Policy knowledge base" },
        { icon: Zap, name: "Real-time Processing", description: "Instant analysis" },
        { icon: Code2, name: "Type-safe Output", description: "Zod schema validation" }
    ];

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-purple-500/30 overflow-hidden">
            <Navbar />
            
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-blue-600/10 dark:bg-blue-600/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[10%] w-[35%] h-[35%] rounded-full bg-purple-600/10 dark:bg-purple-600/20 blur-[120px]" />
                <div className="absolute top-[60%] left-[30%] w-[25%] h-[25%] rounded-full bg-orange-600/10 dark:bg-orange-600/15 blur-[100px]" />
            </div>

            <div className="relative z-10 pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Hero Section */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center mb-24"
                    >
                        <motion.div 
                            variants={itemVariants}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-blue-500/30 mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Simple & Powerful</span>
                        </motion.div>
                        
                        <motion.h1 
                            variants={itemVariants}
                            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
                        >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                                How It Works
                            </span>
                        </motion.h1>
                        
                        <motion.p 
                            variants={itemVariants}
                            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
                        >
                            From upload to approval in seconds. Our AI-powered system handles the 
                            entire expense validation workflow automatically.
                        </motion.p>
                    </motion.div>

                    {/* Steps Section */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative mb-24"
                    >
                        {/* Vertical Line (desktop) */}
                        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-green-500/50" />
                        
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className={`relative flex flex-col lg:flex-row items-center gap-8 mb-16 last:mb-0 ${
                                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                                }`}
                            >
                                {/* Content Card */}
                                <div className={`flex-1 ${index % 2 === 1 ? 'lg:text-right' : 'lg:text-left'}`}>
                                    <div className={`relative inline-block p-8 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 backdrop-blur-xl hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 group`}>
                                        {/* Glow effect */}
                                        <div className={`absolute -inset-1 ${step.bgGlow} blur-xl opacity-0 group-hover:opacity-50 transition-opacity rounded-2xl`} />
                                        
                                        <div className="relative">
                                            <div className={`inline-flex items-center gap-3 mb-4`}>
                                                <span className={`text-sm font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r ${step.color}`}>
                                                    {step.number}
                                                </span>
                                                <div className={`p-2 rounded-lg bg-gradient-to-br ${step.color}`}>
                                                    <step.icon className="w-5 h-5 text-white" />
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                                {step.title}
                                            </h3>
                                            
                                            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed max-w-md">
                                                {step.description}
                                            </p>
                                            
                                            <div className={`flex flex-wrap gap-2 ${index % 2 === 1 ? 'lg:justify-end' : ''}`}>
                                                {step.features.map((feature, i) => (
                                                    <span 
                                                        key={i}
                                                        className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Center Icon (desktop) */}
                                <div className="hidden lg:flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 border-4 border-white dark:border-gray-900 shadow-xl z-10">
                                    <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${step.color}`}>
                                        {index + 1}
                                    </span>
                                </div>
                                
                                {/* Empty space for alternating layout */}
                                <div className="flex-1 hidden lg:block" />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Tech Stack Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mb-20"
                    >
                        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                            Powered by Modern Technology
                        </h2>
                        
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {techStack.map((tech, index) => (
                                <div 
                                    key={index}
                                    className="group p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 backdrop-blur-xl hover:border-purple-500/30 transition-all duration-300 text-center"
                                >
                                    <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 mb-4 group-hover:scale-110 transition-transform">
                                        <tech.icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{tech.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{tech.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="relative text-center p-12 rounded-3xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 dark:border-white/5 backdrop-blur-xl overflow-hidden"
                    >
                        {/* Animated gradient orbs */}
                        <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                        
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">
                            See It In Action
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto relative z-10">
                            Upload your first invoice and experience the power of AI-driven expense analysis in just a few clicks.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                            <Link 
                                href="/anomaly-detector"
                                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                Start Analyzing
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link 
                                href="/features"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-semibold hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300"
                            >
                                Explore Features
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
