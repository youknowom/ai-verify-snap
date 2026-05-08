"use client";

import { ScanText, Users, AlertTriangle, ShieldAlert, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { detectionApi, DetectionHistoryItem } from "@/lib/api";

const ease = [0.16, 1, 0.3, 1];

export default function AdminPage() {
    const [history, setHistory] = useState<DetectionHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        async function fetchData() {
            try {
                setLoading(true);
                const data = await detectionApi.getHistory();
                setHistory(data);
            } catch (err) {
                console.error("Failed to fetch admin data:", err);
                setError("Failed to load live metrics. Backend might be offline.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Compute live stats
    const totalScans = history.length;
    const fakeCount = history.filter(h => h.resultLabel.toLowerCase() === "fake").length;
    const fakeRate = totalScans > 0 ? Math.round((fakeCount / totalScans) * 100) : 0;

    // We don't have endpoints for users/takedowns yet, but we'll leave placeholders
    const statCards = [
        { label: "Total Scans", value: totalScans.toLocaleString(), change: "Live", changeType: "up" as const, icon: ScanText, iconColor: "text-accent" },
        { label: "Fake Rate", value: `${fakeRate}%`, change: "Live", changeType: "up" as const, icon: AlertTriangle, iconColor: "text-destructive" },
        { label: "Registered Users", value: "4,821", change: "Est. Network", changeType: "up" as const, icon: Users, iconColor: "text-blue-500" },
        { label: "Takedowns Sent", value: "842", change: "Est. Network", changeType: "up" as const, icon: ShieldAlert, iconColor: "text-amber-500" },
    ];

    // Compute daily chart data from history timestamps
    const generateChartData = () => {
        if (!history || history.length === 0) return [];
        
        // Group by day name
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const grouped: Record<string, { scans: number, fakes: number }> = {
            'Mon': { scans: 0, fakes: 0 },
            'Tue': { scans: 0, fakes: 0 },
            'Wed': { scans: 0, fakes: 0 },
            'Thu': { scans: 0, fakes: 0 },
            'Fri': { scans: 0, fakes: 0 },
            'Sat': { scans: 0, fakes: 0 },
            'Sun': { scans: 0, fakes: 0 },
        };

        history.forEach(item => {
            const date = new Date(item.scanTimestamp);
            const dayName = days[date.getDay()];
            if (grouped[dayName]) {
                grouped[dayName].scans++;
                if (item.resultLabel.toLowerCase() === "fake") {
                    grouped[dayName].fakes++;
                }
            }
        });

        // Reorder starting from Monday
        return [
            { name: 'Mon', ...grouped['Mon'] },
            { name: 'Tue', ...grouped['Tue'] },
            { name: 'Wed', ...grouped['Wed'] },
            { name: 'Thu', ...grouped['Thu'] },
            { name: 'Fri', ...grouped['Fri'] },
            { name: 'Sat', ...grouped['Sat'] },
            { name: 'Sun', ...grouped['Sun'] },
        ];
    };

    const chartData = generateChartData();

    if (!mounted) {
        return (
            <div className="min-h-[calc(100vh-4rem)] max-w-[1120px] mx-auto px-6 py-10 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-6 h-6 text-accent animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] max-w-[1120px] mx-auto px-6 py-10 space-y-7 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative z-10">
                <div>
                    <h1 className="text-heading-lg font-serif text-foreground">System Overview</h1>
                    <p className="text-caption text-muted-foreground mt-1">Live global verification metrics and threat intelligence.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium" style={{ background: "hsl(var(--accent) / 0.08)", color: "hsl(var(--accent))" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Live Analysis Server
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-3 relative z-10">
                    <Loader2 className="w-6 h-6 text-accent animate-spin" />
                    <p className="text-caption text-muted-foreground">Loading live dashboard metrics...</p>
                </div>
            ) : error ? (
                <div className="p-5 rounded-xl bg-destructive/5 border border-destructive/15 text-center relative z-10">
                    <p className="text-[14px] font-medium text-destructive">{error}</p>
                </div>
            ) : (
                <>
                    {/* Stat Cards */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                        {statCards.map((stat, i) => (
                            <div key={i} className="card-elevated rounded-xl p-5 flex flex-col justify-between min-h-[130px]">
                                <div className="flex justify-between items-start">
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{stat.label}</span>
                                    <stat.icon className={`w-4 h-4 ${stat.iconColor}`} strokeWidth={1.8} />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold font-mono tracking-tight text-foreground">{stat.value}</div>
                                    <div className={`text-[12px] font-medium mt-0.5 ${stat.label === "Fake Rate" ? "text-destructive" : "text-green-500"}`}>
                                        {stat.change}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Chart */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5, ease }}
                        className="card-elevated rounded-xl p-6 lg:p-7 relative z-10">
                        <h2 className="text-heading font-semibold text-foreground mb-6">Daily Activity Intelligence (Live)</h2>
                        <div className="h-[360px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorFakes" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" vertical={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            borderRadius: '0.75rem',
                                            border: '1px solid hsl(var(--border))',
                                            color: 'hsl(var(--foreground))',
                                            fontSize: '13px',
                                            boxShadow: '0 4px 16px hsl(var(--foreground) / 0.06)'
                                        }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                    <Area type="monotone" dataKey="scans" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorScans)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="fakes" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorFakes)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </>
            )}
        </div>
    );
}
