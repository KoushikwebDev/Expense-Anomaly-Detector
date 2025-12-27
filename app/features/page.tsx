'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { 
    FileText, ShieldCheck, Bell, Database, Zap, Brain, 
    LineChart, Lock, Globe, Cpu, CheckCircle2, ArrowRight,
    Sparkles, Target, TrendingUp, Settings
} from 'lucide-react';
import Link from 'next/link';

export default function FeaturesPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
            },
        },
    };

    const features = [
        {
            icon: Brain,
            title: "AI-Powered Detection",
            description: "Advanced machine learning algorithms analyze expense patterns and detect anomalies in real-time with over 99% accuracy.",
            color: "from-purple-500 to-blue-500",
            bgColor: "bg-purple-500/10 dark:bg-purple-500/20",
            borderColor: "border-purple-500/20 dark:border-purple-500/30"
        },
        {
            icon: FileText,
            title: "OCR Receipt Validation",
            description: "Automatically extract and validate information from receipts, invoices, and documents using state-of-the-art OCR technology.",
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
            borderColor: "border-blue-500/20 dark:border-blue-500/30"
        },
        {
            icon: ShieldCheck,
            title: "Policy Compliance Check",
            description: "Ensure all expenses comply with your company policies. Automatic flagging of violations with detailed explanations.",
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-500/10 dark:bg-green-500/20",
            borderColor: "border-green-500/20 dark:border-green-500/30"
        },
        {
            icon: Bell,
            title: "Smart Notifications",
            description: "Get instant alerts for suspicious activities, policy violations, and approval requests through multiple channels.",
            color: "from-orange-500 to-red-500",
            bgColor: "bg-orange-500/10 dark:bg-orange-500/20",
            borderColor: "border-orange-500/20 dark:border-orange-500/30"
        },
        {
            icon: Database,
            title: "Auto-Update Sheets",
            description: "Seamlessly sync validated expenses to your spreadsheets and databases with automated data entry.",
            color: "from-pink-500 to-rose-500",
            bgColor: "bg-pink-500/10 dark:bg-pink-500/20",
            borderColor: "border-pink-500/20 dark:border-pink-500/30"
        },
        {
            icon: LineChart,
            title: "Analytics Dashboard",
            description: "Comprehensive insights into spending patterns, trends, and potential areas of concern with interactive visualizations.",
            color: "from-indigo-500 to-purple-500",
            bgColor: "bg-indigo-500/10 dark:bg-indigo-500/20",
            borderColor: "border-indigo-500/20 dark:border-indigo-500/30"
        },
        {
            icon: Lock,
            title: "Enterprise Security",
            description: "Bank-grade encryption, SOC 2 compliance, and role-based access control to keep your data safe.",
            color: "from-gray-500 to-slate-500",
            bgColor: "bg-gray-500/10 dark:bg-gray-500/20",
            borderColor: "border-gray-500/20 dark:border-gray-500/30"
        },
        {
            icon: Globe,
            title: "Multi-Currency Support",
            description: "Handle expenses in any currency with real-time conversion rates and localized formatting.",
            color: "from-teal-500 to-green-500",
            bgColor: "bg-teal-500/10 dark:bg-teal-500/20",
            borderColor: "border-teal-500/20 dark:border-teal-500/30"
        },
        {
            icon: Cpu,
            title: "Batch Processing",
            description: "Process hundreds of invoices simultaneously with our powerful batch analysis engine.",
            color: "from-yellow-500 to-orange-500",
            bgColor: "bg-yellow-500/10 dark:bg-yellow-500/20",
            borderColor: "border-yellow-500/20 dark:border-yellow-500/30"
        }
    ];

    const highlights = [
        { icon: Target, text: "99.5% Detection Accuracy", subtext: "Industry-leading precision" },
        { icon: Zap, text: "< 3s Average Processing", subtext: "Lightning-fast analysis" },
        { icon: TrendingUp, text: "40% Cost Savings", subtext: "Reduced manual review time" },
        { icon: Settings, text: "100+ Integrations", subtext: "Works with your tools" }
    ];

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-purple-500/30 overflow-hidden">
            <Navbar />
            
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 dark:bg-purple-600/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 dark:bg-blue-600/20 blur-[120px]" />
                <div className="absolute top-[50%] right-[20%] w-[20%] h-[20%] rounded-full bg-pink-600/10 dark:bg-pink-600/15 blur-[100px]" />
            </div>

            <div className="relative z-10 pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Hero Section */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center mb-20"
                    >
                        <motion.div 
                            variants={itemVariants}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 dark:border-purple-500/30 mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Powerful Features</span>
                        </motion.div>
                        
                        <motion.h1 
                            variants={itemVariants}
                            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
                        >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 dark:from-purple-400 dark:via-blue-400 dark:to-cyan-400">
                                Everything You Need
                            </span>
                            <br />
                            <span className="text-gray-900 dark:text-white">to Detect Anomalies</span>
                        </motion.h1>
                        
                        <motion.p 
                            variants={itemVariants}
                            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
                        >
                            Our comprehensive suite of AI-powered tools helps you catch expense fraud, 
                            ensure compliance, and streamline your reimbursement workflow.
                        </motion.p>
                    </motion.div>

                    {/* Stats/Highlights Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
                    >
                        {highlights.map((item, index) => (
                            <div 
                                key={index}
                                className="relative group p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 backdrop-blur-xl hover:border-purple-500/30 transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <item.icon className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
                                <p className="font-bold text-gray-900 dark:text-white">{item.text}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{item.subtext}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className={`group relative p-8 rounded-2xl ${feature.bgColor} border ${feature.borderColor} backdrop-blur-xl hover:scale-[1.02] transition-all duration-300`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />
                                
                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    {feature.title}
                                </h3>
                                
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="relative text-center p-12 rounded-3xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-white/10 dark:border-white/5 backdrop-blur-xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-blue-600/5 rounded-3xl" />
                        
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">
                            Ready to Get Started?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto relative z-10">
                            Experience the power of AI-driven expense analysis. Start detecting anomalies today.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                            <Link 
                                href="/anomaly-detector"
                                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                Try It Now
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link 
                                href="/pricing"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-semibold hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300"
                            >
                                View Pricing
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
