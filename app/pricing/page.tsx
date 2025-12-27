'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { 
    Check, X, Sparkles, Zap, Crown, Building2, ArrowRight,
    HelpCircle, Shield, Clock, Users, Headphones
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

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

    const plans = [
        {
            name: "Starter",
            description: "Perfect for small teams getting started",
            icon: Zap,
            monthlyPrice: 29,
            yearlyPrice: 24,
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-500/5 dark:bg-blue-500/10",
            borderColor: "border-blue-500/20 dark:border-blue-500/30",
            popular: false,
            features: [
                { text: "Up to 100 invoices/month", included: true },
                { text: "Basic anomaly detection", included: true },
                { text: "Email notifications", included: true },
                { text: "Standard OCR", included: true },
                { text: "Policy compliance check", included: false },
                { text: "API access", included: false },
                { text: "Custom integrations", included: false },
                { text: "Dedicated support", included: false }
            ]
        },
        {
            name: "Professional",
            description: "For growing businesses with higher demands",
            icon: Crown,
            monthlyPrice: 79,
            yearlyPrice: 66,
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-500/5 dark:bg-purple-500/10",
            borderColor: "border-purple-500/40 dark:border-purple-500/50",
            popular: true,
            features: [
                { text: "Up to 1,000 invoices/month", included: true },
                { text: "Advanced AI detection", included: true },
                { text: "Real-time alerts", included: true },
                { text: "Premium OCR + AI extraction", included: true },
                { text: "Policy compliance check", included: true },
                { text: "API access", included: true },
                { text: "Custom integrations", included: false },
                { text: "Dedicated support", included: false }
            ]
        },
        {
            name: "Enterprise",
            description: "Custom solutions for large organizations",
            icon: Building2,
            monthlyPrice: null,
            yearlyPrice: null,
            color: "from-orange-500 to-red-500",
            bgColor: "bg-orange-500/5 dark:bg-orange-500/10",
            borderColor: "border-orange-500/20 dark:border-orange-500/30",
            popular: false,
            features: [
                { text: "Unlimited invoices", included: true },
                { text: "Custom AI models", included: true },
                { text: "Multi-channel alerts", included: true },
                { text: "Enterprise OCR suite", included: true },
                { text: "Custom policy rules", included: true },
                { text: "Full API access", included: true },
                { text: "Custom integrations", included: true },
                { text: "24/7 dedicated support", included: true }
            ]
        }
    ];

    const faqs = [
        {
            question: "Can I switch plans at any time?",
            answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing accordingly."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise customers. All payments are securely processed through Stripe."
        },
        {
            question: "Is there a free trial available?",
            answer: "Absolutely! All plans come with a 14-day free trial. No credit card required to start."
        },
        {
            question: "What happens if I exceed my invoice limit?",
            answer: "We'll notify you when you're approaching your limit. You can either upgrade your plan or purchase additional invoice credits as needed."
        }
    ];

    const benefits = [
        { icon: Shield, title: "Secure Processing", description: "Bank-grade encryption" },
        { icon: Clock, title: "24-Hour SLA", description: "Fast response times" },
        { icon: Users, title: "Unlimited Users", description: "On all plans" },
        { icon: Headphones, title: "Priority Support", description: "We're here to help" }
    ];

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-purple-500/30 overflow-hidden">
            <Navbar />
            
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-5%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 dark:bg-purple-600/20 blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-blue-600/10 dark:bg-blue-600/20 blur-[120px]" />
                <div className="absolute top-[50%] right-[20%] w-[20%] h-[20%] rounded-full bg-pink-600/10 dark:bg-pink-600/15 blur-[100px]" />
            </div>

            <div className="relative z-10 pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Hero Section */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center mb-16"
                    >
                        <motion.div 
                            variants={itemVariants}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 dark:border-purple-500/30 mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Simple Pricing</span>
                        </motion.div>
                        
                        <motion.h1 
                            variants={itemVariants}
                            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
                        >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 dark:from-purple-400 dark:via-pink-400 dark:to-orange-400">
                                Choose Your Plan
                            </span>
                        </motion.h1>
                        
                        <motion.p 
                            variants={itemVariants}
                            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10"
                        >
                            Start with a 14-day free trial. No credit card required. 
                            Upgrade anytime as your needs grow.
                        </motion.p>

                        {/* Billing Toggle */}
                        <motion.div 
                            variants={itemVariants}
                            className="inline-flex items-center gap-4 p-1.5 rounded-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10"
                        >
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                                    billingCycle === 'monthly' 
                                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' 
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                                    billingCycle === 'yearly' 
                                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' 
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                Yearly
                                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-bold">
                                    Save 17%
                                </span>
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Pricing Cards */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid lg:grid-cols-3 gap-8 mb-20"
                    >
                        {plans.map((plan, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className={`relative p-8 rounded-3xl ${plan.bgColor} border-2 ${plan.borderColor} backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${
                                    plan.popular ? 'lg:-mt-4 lg:mb-4' : ''
                                }`}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${plan.color} text-white text-sm font-bold shadow-lg`}>
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${plan.color} mb-6`}>
                                    <plan.icon className="w-6 h-6 text-white" />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {plan.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    {plan.description}
                                </p>

                                <div className="mb-8">
                                    {plan.monthlyPrice ? (
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                                                ${billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                                            </span>
                                            <span className="text-gray-500 dark:text-gray-400">/ month</span>
                                        </div>
                                    ) : (
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                            Custom Pricing
                                        </div>
                                    )}
                                    {billingCycle === 'yearly' && plan.monthlyPrice && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Billed annually
                                        </p>
                                    )}
                                </div>

                                <Link
                                    href="/anomaly-detector"
                                    className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 mb-8 ${
                                        plan.popular
                                            ? `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg hover:shadow-purple-500/25`
                                            : 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20'
                                    }`}
                                >
                                    {plan.monthlyPrice ? 'Start Free Trial' : 'Contact Sales'}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>

                                <div className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            {feature.included ? (
                                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                                                </div>
                                            ) : (
                                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center">
                                                    <X className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                                                </div>
                                            )}
                                            <span className={feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}>
                                                {feature.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Benefits Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
                    >
                        {benefits.map((benefit, index) => (
                            <div 
                                key={index}
                                className="text-center p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 backdrop-blur-xl"
                            >
                                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 mb-4">
                                    <benefit.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{benefit.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{benefit.description}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* FAQ Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                            Frequently Asked Questions
                        </h2>
                        
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div 
                                    key={index}
                                    className="p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 backdrop-blur-xl"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
                                            <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                                {faq.question}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mt-20 p-12 rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-white/10 dark:border-white/5 backdrop-blur-xl"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Still Have Questions?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
                            Our team is here to help. Get in touch and we'll get back to you within 24 hours.
                        </p>
                        <Link 
                            href="mailto:support@expensead.com"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5"
                        >
                            Contact Support
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
