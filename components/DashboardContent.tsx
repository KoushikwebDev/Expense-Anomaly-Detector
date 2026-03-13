"use client";

import React, { useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { 
  AlertCircle, CheckCircle2, 
  XCircle, Clock, FileText, IndianRupee, ShieldAlert,
  ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp, Info,
  AlertTriangle, CheckSquare, Target, User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LogEntry } from "@/lib/excel";
import { FinalAnalysis } from "@/lib/schemas/invoice";

const STATUS_COLORS: Record<string, string> = {
  approved: "#10b981", // Emerald
  rejected: "#ef4444", // Red
  flagged: "#f59e0b",  // Amber
  needs_review: "#6366f1", // Indigo
};

export default function DashboardContent({ initialLogs }: { initialLogs: LogEntry[] }) {
  const [expandedRowId, setExpandedRowId] = React.useState<string | null>(null);

  const stats = useMemo(() => {
    const total = initialLogs.length;
    const approved = initialLogs.filter(l => l.Status === 'approved').length;
    const rejected = initialLogs.filter(l => l.Status === 'rejected').length;
    const flagged = initialLogs.filter(l => l.Status === 'flagged' || l.Status === 'needs_review').length;
    const totalAmount = initialLogs.reduce((acc, curr) => {
      const val = typeof curr.Amount === 'number' ? curr.Amount : parseFloat(String(curr.Amount).replace(/,/g, '').match(/[0-9.]+/)?.[0] || '0');
      return acc + (isNaN(val) ? 0 : val);
    }, 0);

    return { total, approved, rejected, flagged, totalAmount };
  }, [initialLogs]);

  const chartData = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    initialLogs.forEach(log => {
      statusCounts[log.Status] = (statusCounts[log.Status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: STATUS_COLORS[name] || "#CBD5E1"
    }));
  }, [initialLogs]);

  const timelineData = useMemo(() => {
    const dailyLogs: Record<string, { count: number; amount: number }> = {};
    initialLogs.slice(-10).forEach(log => {
      const date = new Date(log['Processed At']).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!dailyLogs[date]) dailyLogs[date] = { count: 0, amount: 0 };
      dailyLogs[date].count += 1;
      dailyLogs[date].amount += Number(log.Amount) || 0;
    });

    return Object.entries(dailyLogs).map(([date, data]) => ({
      date,
      count: data.count,
      amount: data.amount
    }));
  }, [initialLogs]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Audit Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time analytics for invoice verification and anomaly detection.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href="/api/download-logs" 
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all"
            download
          >
            <FileText size={16} />
            Export to Excel
          </a>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-600 dark:text-purple-400 text-sm font-medium">
            <ShieldAlert size={16} />
            System Active
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Invoices" 
          value={stats.total} 
          icon={<FileText className="text-blue-500" />}
          trend="+12%"
          trendUp={true}
        />
        <StatCard 
          title="Approved" 
          value={stats.approved} 
          icon={<CheckCircle2 className="text-emerald-500" />}
          trend="+5%"
          trendUp={true}
        />
        <StatCard 
          title="Rejected" 
          value={stats.rejected} 
          icon={<XCircle className="text-red-500" />}
          trend="+2%"
          trendUp={false}
        />
        <StatCard 
          title="Total Value" 
          value={`₹${stats.totalAmount.toLocaleString()}`} 
          icon={<IndianRupee className="text-purple-500" />}
          trend="+18%"
          trendUp={true}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-3xl p-6 shadow-sm overflow-hidden relative group">
          <div className="relative z-10">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Clock size={18} className="text-purple-500" />
              Processing Volume
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors" />
        </motion.div>

        <motion.div variants={itemVariants} className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-500" />
            Decision Distribution
          </h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold">{stats.total}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Table */}
      <motion.div variants={itemVariants} className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Processing History</h3>
          <button className="text-sm text-purple-500 hover:underline">View All Records</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Merchant</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Risk</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {initialLogs.slice().reverse().map((log, i) => {
                const isExpanded = expandedRowId === log['Invoice ID'];
                let details: FinalAnalysis | null = null;
                try {
                  details = log.Details ? JSON.parse(log.Details) : null;
                } catch (e) {
                  console.error("Failed to parse details for log", log['Invoice ID']);
                }

                return (
                  <React.Fragment key={log['Invoice ID'] || i}>
                    <tr 
                      className={`hover:bg-muted/30 transition-colors group cursor-pointer ${isExpanded ? 'bg-muted/40' : ''}`}
                      onClick={() => setExpandedRowId(isExpanded ? null : log['Invoice ID'])}
                    >
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{log['Invoice ID']}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{log.Merchant}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{log.Date}</td>
                      <td className="px-6 py-4 font-semibold">
                        {log.Currency?.includes('(') ? log.Currency.split(' ')[0] : (log.Currency || '₹')} 
                        {Number(typeof log.Amount === 'number' ? log.Amount : String(log.Amount).replace(/,/g, '').match(/[0-9.]+/)?.[0] || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          log.Status === 'approved' ? 'bg-emerald-500/10 text-emerald-600' :
                          log.Status === 'rejected' ? 'bg-red-500/10 text-red-600' :
                          'bg-amber-500/10 text-amber-600'
                        }`}>
                          {log.Status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 w-12 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                 log['Risk Score'] > 70 ? 'bg-red-500' :
                                 log['Risk Score'] > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${log['Risk Score']}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{log['Risk Score']}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground group-hover:text-purple-500">
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </td>
                    </tr>
                    <AnimatePresence>
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="px-6 py-6 bg-muted/20">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              {details ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                  {/* Section 1: Extraction */}
                                  <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                      <Target size={14} className="text-blue-500" />
                                      Extracted Details
                                    </h4>
                                    <div className="space-y-2 bg-background/50 p-4 rounded-2xl border border-border/50">
                                      <DetailItem label="Invoice #" value={details.validation.extracted_fields.invoice_number} />
                                      <DetailItem label="Merchant" value={details.validation.extracted_fields.merchant_name} />
                                      <DetailItem label="Address" value={details.validation.extracted_fields.merchant_address} />
                                      <DetailItem label="Buyer" value={details.validation.extracted_fields.buyer_name} />
                                      <DetailItem label="Amount" value={`${details.validation.extracted_fields.currency || ''} ${details.validation.extracted_fields.amount || 0}`} />
                                      <DetailItem label="Type" value={details.validation.extracted_fields.invoice_type} icon={true} />
                                    </div>
                                  </div>

                                  {/* Section 2: Policy Compliance */}
                                  <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                      <ShieldAlert size={14} className="text-purple-500" />
                                      Policy Analysis
                                    </h4>
                                    <div className="space-y-3">
                                      {details.policy_compliance.policy_violations.length > 0 ? (
                                        details.policy_compliance.policy_violations.map((v, idx) => (
                                          <div key={idx} className="bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
                                            <p className="text-xs font-bold text-red-600 flex items-center gap-1 uppercase">
                                              <AlertCircle size={10} /> {v.severity} Severity
                                            </p>
                                            <p className="text-sm font-medium mt-1">{v.violation}</p>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">{v.rule}</p>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl flex items-center gap-2">
                                          <CheckSquare size={16} className="text-emerald-500" />
                                          <span className="text-sm font-medium text-emerald-600">No Policy Violations Found</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Section 3: AI Summary & Recommendations */}
                                  <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                      <Info size={14} className="text-amber-500" />
                                      AI Insight
                                    </h4>
                                    <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl">
                                      <p className="text-sm italic leading-relaxed text-muted-foreground">
                                        "{details.summary}"
                                      </p>
                                      {details.policy_compliance.recommendations.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-amber-500/10">
                                          <p className="text-xs font-bold text-amber-600 uppercase mb-2">Recommendations</p>
                                          <ul className="text-xs space-y-1.5 text-muted-foreground">
                                            {details.policy_compliance.recommendations.map((r, idx) => (
                                              <li key={idx} className="flex items-start gap-1.5">
                                                <span className="mt-1 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                                                {r}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
                                  <AlertTriangle size={24} className="opacity-20" />
                                  <p>Full analysis data not available for this record.</p>
                                </div>
                              )}
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
              {initialLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No records found. Invoices analyzed will appear here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailItem({ label, value, icon = false }: { label: string, value: any, icon?: boolean }) {
  if (value === null || value === undefined) return null;
  return (
    <div className="flex justify-between items-start gap-4 py-1.5 border-b border-border/30 last:border-0">
      <span className="text-[10px] font-bold text-muted-foreground uppercase">{label}</span>
      <span className={`text-xs font-medium text-right ${icon ? 'px-2 py-0.5 bg-muted rounded-full' : ''}`}>
        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
      </span>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendUp }: any) {
  return (
    <motion.div 
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="p-2.5 rounded-2xl bg-muted/50 group-hover:bg-muted transition-colors">
          {icon}
        </div>
        <div className={`flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
          {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <div className="mt-4 relative z-10">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <h4 className="text-2xl font-bold mt-1">{value}</h4>
      </div>
      {/* Decorative background element */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-linear-to-br from-transparent to-muted/20 rounded-full blur-2xl group-hover:to-muted/40 transition-colors" />
    </motion.div>
  );
}
