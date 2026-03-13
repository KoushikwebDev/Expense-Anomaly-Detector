"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Sparkles, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate a brief delay for premium feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === "koushik.saha@intglobal.com" && password === "Ksaha26#1998") {
      // In a real app, we'd use a secure session. For this local project, we'll use a simple cookie.
      document.cookie = "admin_session=true; path=/; max-age=86400"; // 24 hours
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials. Please contact system administrator.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 selection:bg-purple-500/30">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden relative group">
          {/* Subtle top light effect */}
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-500/50 to-transparent" />
          
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="p-3.5 rounded-2xl bg-linear-to-br from-blue-600 to-purple-600 text-white mb-4 shadow-lg shadow-purple-500/20"
            >
              <ShieldCheck size={28} />
            </motion.div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
            <p className="text-gray-400 text-sm mt-1">Authorized access only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-purple-500 transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@intglobal.com"
                  className="w-full bg-white/3 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-hidden focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Secure Password</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-purple-500 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/3 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-white placeholder:text-gray-600 focus:outline-hidden focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-500 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-400 text-xs font-medium bg-red-500/10 p-3 rounded-xl border border-red-500/20 flex items-center gap-2"
              >
                <Sparkles size={12} /> {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full group relative overflow-hidden bg-white text-black font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 shadow-xl"
            >
              <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center gap-2 group-hover:text-white transition-colors">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black group-hover:border-white border-t-transparent animate-spin rounded-full" />
                ) : (
                  <>
                    Grant Access
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-600 text-[10px] uppercase tracking-[0.2em] font-medium">
              Enterprise Anomaly Detection System v2.0
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
