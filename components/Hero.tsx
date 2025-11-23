"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, FileText, ShieldCheck, Bell, Database } from "lucide-react";

export default function Hero() {
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

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden text-foreground pt-16">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 dark:bg-purple-600/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 dark:bg-blue-600/20 blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] rounded-full bg-pink-600/10 dark:bg-pink-600/10 blur-[80px] animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0"
        >
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Expense Anomaly
            </span>
            <br />
            Detector
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0">
            AI-powered reimbursement validation. Detect anomalies, automate approvals, and streamline your expense workflow.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 font-medium text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer">
              <span className="relative z-10 mr-2">Try It</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </button>
            <button className="inline-flex h-12 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 px-8 font-medium text-gray-700 dark:text-gray-300 backdrop-blur-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-slate-900">
              Learn More
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
             {[
                { icon: FileText, text: "OCR Receipt Validation" },
                { icon: ShieldCheck, text: "Policy Compliance Check" },
                { icon: Bell, text: "Smart Notifications" },
                { icon: Database, text: "Auto-Update Sheets" }
             ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <feature.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm">{feature.text}</span>
                </div>
             ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:w-1/2 relative"
        >
           {/* Abstract UI Representation */}
           <div className="relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-6 shadow-2xl">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                   <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <FileText size={20} />
                      </div>
                      <div>
                        <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                        <div className="h-2 w-16 bg-gray-300 dark:bg-gray-800 rounded" />
                      </div>
                   </div>
                   <div className="h-6 w-16 bg-green-500/20 rounded-full flex items-center justify-center text-xs text-green-600 dark:text-green-400">
                      Approved
                   </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-red-500/30 relative overflow-hidden">
                   <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
                   <div className="flex items-center space-x-3 z-10">
                      <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                        <div className="h-2 w-16 bg-gray-300 dark:bg-gray-800 rounded" />
                      </div>
                   </div>
                   <div className="h-6 w-20 bg-red-500/20 rounded-full flex items-center justify-center text-xs text-red-600 dark:text-red-400 z-10">
                      Anomaly
                   </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                   <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <Bell size={20} />
                      </div>
                      <div>
                        <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                        <div className="h-2 w-16 bg-gray-300 dark:bg-gray-800 rounded" />
                      </div>
                   </div>
                   <div className="h-6 w-16 bg-yellow-500/20 rounded-full flex items-center justify-center text-xs text-yellow-600 dark:text-yellow-400">
                      Pending
                   </div>
                </div>
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
