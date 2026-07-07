"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShieldCheck, Fingerprint, Upload, FileCheck, Users, Layers, Activity, Lock, Image as ImageIcon, ChevronRight, Search, Loader2, Instagram, Twitter, Heart, Briefcase } from "lucide-react";
import Link from "next/link";
import { useRef, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { detectionApi } from "@/lib/api";
import { useRouter } from "next/navigation";

const AnimatedCounter = dynamic(
    () => Promise.resolve(({ target, suffix = "" }: { target: number; suffix?: string }) => {
        const [count, setCount] = useState(0);
        const ref = useRef<HTMLSpanElement>(null);
        const isInView = useInView(ref, { once: true, margin: "-100px" });

        useEffect(() => {
            if (!isInView) return;
            let startTime: number;
            const duration = 2500; // slightly longer, premium feel
            const animate = (time: number) => {
                if (!startTime) startTime = time;
                const progress = Math.min((time - startTime) / duration, 1);
                // Custom Ease Out Quart
                const easeProgress = 1 - Math.pow(1 - progress, 4);
                setCount(Math.floor(easeProgress * target));
                if (progress < 1) requestAnimationFrame(animate);
                else setCount(target);
            };
            requestAnimationFrame(animate);
        }, [target, isInView]);

        return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
    }),
    { ssr: false }
);

const ease = [0.16, 1, 0.3, 1] as const;

export default function Home() {
    const router = useRouter();
    const [stats, setStats] = useState([
        { value: 12500, suffix: "+", label: "Images Analyzed", icon: ImageIcon },
        { value: 100, suffix: "+", label: "Registered Users", icon: Users },
        { value: 45000, suffix: "+", label: "Deepfakes Detected", icon: ShieldCheck },
    ]);
    const [isDragging, setIsDragging] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    // For parallax effect in Hero
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 1000], [0, 200]);

    useEffect(() => {
        detectionApi.getStats().then((data) => {
            setStats([
                { value: 12500 + (data.totalScans || 0), suffix: "+", label: "Images Analyzed", icon: ImageIcon },
                { value: 100 + (data.totalUsers || 0), suffix: "+", label: "Registered Users", icon: Users },
                { value: 45000 + (data.deepfakesDetected || 0), suffix: "+", label: "Deepfakes Detected", icon: ShieldCheck },
            ]);
        }).catch(() => { /* backend offline */ });
    }, []);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        router.push('/detect');
    }, [router]);

    const tabs = [
        { title: "Upload & Encrypt", desc: "Drag and drop media securely. We support standard formats up to 10MB with instant AES-256 encryption.", icon: Lock },
        { title: "Forensic Analysis", desc: "Our engine dissects the image using proprietary Error Level Analysis and Vision Transformers.", icon: Search },
        { title: "Deterministic Verdict", desc: "Receive a mathematically backed verdict and a visual heatmap report of tampered regions.", icon: FileCheck }
    ];

    return (
        <div className="flex flex-col bg-background min-h-screen relative overflow-hidden selection:bg-foreground selection:text-background font-sans">
            
            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>

            {/* Super Soft Ambient Glows */}
            <div className="absolute top-[-10%] inset-x-0 h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(236,172,44,0.08)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle_at_center,rgba(254,114,0,0.05)_0%,transparent_50%)] blur-[120px] pointer-events-none" />

            {/* ───── HERO SECTION ───── */}
            <section className="relative w-full px-6 pt-32 pb-24 lg:pt-48 lg:pb-40 flex flex-col items-center justify-center min-h-[100vh]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none mask-image:linear-gradient(to_bottom,white,transparent)" />
                
                <motion.div style={{ y: heroY }} className="text-center max-w-[1000px] mx-auto relative z-10 w-full">
                    
                    {/* Badge */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="flex justify-center mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-muted/30 backdrop-blur-md text-xs font-medium text-muted-foreground shadow-sm hover:border-border transition-colors cursor-pointer">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Engine v2.0 is now live
                            <ArrowRight className="w-3 h-3 ml-1" />
                        </div>
                    </motion.div>

                    {/* Headline */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease }}>
                        <h1 className="text-[4rem] leading-[1] md:text-[6rem] lg:text-[7.5rem] font-bold text-foreground text-balance mb-8 tracking-tighter">
                            Verify Images.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground">Detect AI.</span><br />
                        </h1>
                    </motion.div>

                    {/* Subheadline */}
                    <motion.p
                        className="text-lg md:text-xl text-muted-foreground text-balance max-w-[650px] mx-auto mb-12 font-medium leading-relaxed"
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease }}
                    >
                        Built on advanced forensic networks. Powered by frontier-class explainability models. Delivering irrefutable authenticity for the modern web.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div 
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease }}
                    >
                        <Link href="/detect" className="group relative w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-foreground text-background hover:bg-orange-500 hover:text-white font-bold text-[15px] shadow-[0_8px_30px_-8px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_-10px_rgba(249,115,22,0.6)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
                            <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-[150%] -z-10" />
                            Start Scanning Free
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link href="/docs" className="group relative w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-background text-foreground border border-border/80 hover:bg-foreground hover:text-background font-bold text-[15px] shadow-sm hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
                            <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-[150%] -z-10" />
                            Read Documentation
                        </Link>
                    </motion.div>

                    {/* Interactive Drop Zone (Hero Mockup) */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4, ease }}
                        className="w-full max-w-[850px] mx-auto relative"
                        style={{ perspective: "2000px" }}
                    >
                        <div 
                            className={`relative rounded-[2rem] border border-border/60 bg-card/40 backdrop-blur-3xl shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-500 flex flex-col items-center justify-center py-20 cursor-pointer ${
                                isDragging ? "border-foreground/50 scale-[1.02] bg-accent/5 ring-4 ring-accent/10" : "hover:border-border hover:shadow-[0_40px_120px_-20px_rgba(0,0,0,0.12)]"
                            }`}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            onClick={() => router.push('/detect')}
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20 pointer-events-none" />
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                            
                            <div className="w-20 h-20 rounded-[1.25rem] bg-gradient-to-br from-background to-muted border border-border shadow-inner flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500">
                                <Upload className={`w-8 h-8 text-foreground transition-all duration-500 ${isDragging ? "scale-110 -translate-y-2 text-accent" : ""}`} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-3 relative z-10 tracking-tight">Drag & drop an image to verify</h3>
                            <p className="text-sm font-medium text-muted-foreground/80 relative z-10">
                                JPG, PNG, WEBP up to 10MB
                            </p>

                            {/* Floating decorative elements */}
                            <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none animate-pulse" />
                            <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ───── TESTIMONIALS (SOCIAL PROOF) ───── */}
            <section className="w-full py-16 border-y border-border/40 bg-muted/10 overflow-hidden flex flex-col items-center justify-center relative">
                <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                
                <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-10 text-center px-4">Trusted by creators, influencers & security experts</p>
                <div className="flex w-max animate-marquee hover:[animation-play-state:paused] transition-all duration-500">
                    {[
                        { name: "Priya Sharma", role: "Content Creator", content: "AIVerifySnap has completely changed how I verify images on social media. It's incredibly fast and accurate.", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop", icon: "Instagram", color: "text-pink-500" },
                        { name: "Ananya Patel", role: "Digital Security", content: "The ELA heatmaps are the best in the industry. I use it to verify dating profiles before meeting anyone.", avatar: "https://images.unsplash.com/photo-1592621385612-4d7129426394?w=150&h=150&fit=crop", icon: "Heart", color: "text-rose-500" },
                        { name: "Rohan Desai", role: "Journalist", content: "Deterministic verdicts save us hours of manual forensic work when breaking news hits the timeline.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop", icon: "Twitter", color: "text-blue-400" },
                        { name: "Neha Gupta", role: "Influencer", content: "I use this to protect my digital identity. The automated scanning is an absolute lifesaver for my brand.", avatar: "https://images.unsplash.com/photo-1557053910-d9eadeed1c58?w=150&h=150&fit=crop", icon: "Instagram", color: "text-pink-500" },
                        { name: "Sneha Reddy", role: "Legal Consultant", content: "Provides the mathematically backed evidence we need for digital authenticity in our cyber cases.", avatar: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=150&h=150&fit=crop", icon: "Briefcase", color: "text-slate-400" },
                        // Duplicate for seamless infinite scroll
                        { name: "Priya Sharma", role: "Content Creator", content: "AIVerifySnap has completely changed how I verify images on social media. It's incredibly fast and accurate.", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop", icon: "Instagram", color: "text-pink-500" },
                        { name: "Ananya Patel", role: "Digital Security", content: "The ELA heatmaps are the best in the industry. I use it to verify dating profiles before meeting anyone.", avatar: "https://images.unsplash.com/photo-1592621385612-4d7129426394?w=150&h=150&fit=crop", icon: "Heart", color: "text-rose-500" },
                        { name: "Rohan Desai", role: "Journalist", content: "Deterministic verdicts save us hours of manual forensic work when breaking news hits the timeline.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop", icon: "Twitter", color: "text-blue-400" },
                        { name: "Neha Gupta", role: "Influencer", content: "I use this to protect my digital identity. The automated scanning is an absolute lifesaver for my brand.", avatar: "https://images.unsplash.com/photo-1557053910-d9eadeed1c58?w=150&h=150&fit=crop", icon: "Instagram", color: "text-pink-500" },
                        { name: "Sneha Reddy", role: "Legal Consultant", content: "Provides the mathematically backed evidence we need for digital authenticity in our cyber cases.", avatar: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=150&h=150&fit=crop", icon: "Briefcase", color: "text-slate-400" },
                    ].map((review, index) => {
                        // Dynamically render icon
                        const Icon = review.icon === "Instagram" ? Instagram : review.icon === "Twitter" ? Twitter : review.icon === "Heart" ? Heart : Briefcase;
                        return (
                            <div key={index} className="flex-none w-[380px] mx-4 p-7 rounded-[2rem] border border-border/50 bg-card/40 shadow-sm hover:shadow-lg hover:border-border transition-all duration-300 backdrop-blur-xl relative">
                                <div className={`absolute top-6 right-6 ${review.color} opacity-80`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex items-center gap-4 mb-5">
                                    <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover shadow-inner border border-border/50" />
                                    <div>
                                        <h4 className="font-bold text-foreground text-[16px] leading-tight">{review.name}</h4>
                                        <p className="text-[13px] font-medium text-muted-foreground mt-0.5">{review.role}</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground font-medium text-[15px] leading-relaxed">&quot;{review.content}&quot;</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ───── STATS SECTION (GLASSMORPHIC CARDS) ───── */}
            <section className="w-full py-32 bg-background relative z-10">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, i) => (
                            <motion.div 
                                key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: i * 0.1, ease }}
                                className="relative flex flex-col items-start p-10 rounded-[2rem] border border-border/50 bg-gradient-to-b from-card to-card/50 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] overflow-hidden group hover:border-border hover:shadow-lg transition-all duration-300"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full pointer-events-none group-hover:bg-accent/10 transition-colors duration-500" />
                                <stat.icon className="w-8 h-8 text-muted-foreground mb-10 group-hover:text-foreground transition-colors duration-300" />
                                <div className="text-[3rem] font-bold text-foreground leading-none tracking-tighter mb-4" suppressHydrationWarning>
                                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="text-sm font-semibold text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── BENTO GRID FEATURES ───── */}
            <section className="w-full py-32 relative bg-background border-t border-border/30">
                <div className="max-w-[1200px] mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease }}
                        className="max-w-[700px] mb-20"
                    >
                        <h2 className="text-[3rem] md:text-[4.5rem] leading-[1.05] font-bold text-foreground tracking-tighter mb-6 text-balance">
                            Forensic clarity,<br />by design.
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground font-medium text-balance leading-relaxed">
                            Our proprietary architecture combines deep feature extraction with Error Level Analysis to uncover synthetic modifications invisible to the naked eye.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[320px]">
                        {/* Feature 1 - Large */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1, ease }}
                            className="md:col-span-8 rounded-[2rem] border border-border/60 bg-card p-10 flex flex-col justify-end relative overflow-hidden group hover:border-border transition-all duration-500 shadow-sm hover:shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent pointer-events-none" />
                            <div className="absolute top-10 right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/15 transition-all duration-700" />
                            
                            <ShieldCheck className="w-10 h-10 text-foreground mb-6 relative z-10" strokeWidth={1.5} />
                            <h3 className="text-3xl font-bold text-foreground mb-4 relative z-10 tracking-tight">Dual-Stream ResNet</h3>
                            <p className="text-muted-foreground font-medium max-w-md relative z-10 leading-relaxed text-[15px]">Industry-leading vision models that capture subtle synthetic compression artifacts and generative flaws simultaneously.</p>
                        </motion.div>

                        {/* Feature 2 - Small */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2, ease }}
                            className="md:col-span-4 rounded-[2rem] border border-border/50 bg-foreground p-10 flex flex-col justify-end relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 shadow-xl"
                        >
                            <Activity className="w-10 h-10 text-background mb-6" strokeWidth={1.5} />
                            <h3 className="text-3xl font-bold text-background mb-4 tracking-tight">ELA Heatmaps</h3>
                            <p className="text-background/70 font-medium text-[15px] leading-relaxed">Visualizing structural inconsistencies instantly with pixel-perfect precision.</p>
                        </motion.div>

                        {/* Feature 3 - Small */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3, ease }}
                            className="md:col-span-4 rounded-[2rem] border border-border/60 bg-card p-10 flex flex-col justify-end relative overflow-hidden group hover:border-border transition-all duration-500 shadow-sm hover:shadow-xl"
                        >
                            <Fingerprint className="w-10 h-10 text-foreground mb-6" strokeWidth={1.5} />
                            <h3 className="text-3xl font-bold text-foreground mb-4 tracking-tight">Identity Protection</h3>
                            <p className="text-muted-foreground font-medium text-[15px] leading-relaxed">Automated web scans to protect your digital likeness globally.</p>
                        </motion.div>

                        {/* Feature 4 - Large */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4, ease }}
                            className="md:col-span-8 rounded-[2rem] border border-border/60 bg-card p-10 flex flex-col justify-end relative overflow-hidden group hover:border-border transition-all duration-500 shadow-sm hover:shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tl from-foreground/[0.02] to-transparent pointer-events-none" />
                            <Layers className="w-10 h-10 text-foreground mb-6 relative z-10" strokeWidth={1.5} />
                            <h3 className="text-3xl font-bold text-foreground mb-4 relative z-10 tracking-tight">Enterprise API</h3>
                            <p className="text-muted-foreground font-medium max-w-md relative z-10 leading-relaxed text-[15px]">Integrate our detection engine directly into your platform with a single REST API call. Built for immense scale.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ───── INTERACTIVE WORKFLOW ───── */}
            <section id="how-it-works" className="w-full py-32 border-t border-border/30 bg-muted/10 relative overflow-hidden">
                <div className="max-w-[1200px] mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.6, ease }}
                        className="mb-16 md:mb-24 text-center md:text-left"
                    >
                        <h2 className="text-[3rem] md:text-[4.5rem] leading-[1.05] font-bold tracking-tighter text-balance">
                            Three steps to<br className="hidden md:block"/> the truth.
                        </h2>
                    </motion.div>

                    <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center">
                        {/* Tabs list */}
                        <div className="w-full md:w-1/2 flex flex-col gap-4">
                            {tabs.map((tab, i) => {
                                const isActive = activeTab === i;
                                return (
                                    <div 
                                        key={i}
                                        onClick={() => setActiveTab(i)}
                                        className={`group relative p-6 md:p-8 rounded-3xl cursor-pointer transition-all duration-500 border ${
                                            isActive 
                                                ? "bg-card border-border/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" 
                                                : "bg-transparent border-transparent hover:bg-muted/50"
                                        }`}
                                    >
                                        {isActive && (
                                            <motion.div layoutId="activeTabIndicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-foreground rounded-r-full" />
                                        )}
                                        <div className="flex items-start gap-5">
                                            <div className={`mt-1 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${isActive ? "bg-foreground text-background" : "bg-muted text-muted-foreground group-hover:bg-border/60"}`}>
                                                <tab.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 tracking-tight ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                                                    {tab.title}
                                                </h3>
                                                <p className={`font-medium leading-relaxed transition-colors duration-300 text-[15px] ${isActive ? "text-muted-foreground" : "text-muted-foreground/60"}`}>
                                                    {tab.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* Dynamic Visual Area */}
                        <div className="w-full md:w-1/2 relative h-[450px] md:h-[550px]">
                            <div className="absolute inset-0 rounded-[2rem] bg-[#0c0c0c] text-white overflow-hidden border border-white/10 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.4)] flex flex-col ring-1 ring-white/5">
                                {/* Fake Mac Window Header */}
                                <div className="h-12 w-full bg-white/5 flex items-center px-5 gap-2 border-b border-white/5 backdrop-blur-md">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                    <div className="ml-4 text-xs font-mono text-white/40 tracking-wider">aiverify-engine ~ zsh</div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col justify-center relative font-mono text-[14px] leading-relaxed">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="h-full flex flex-col"
                                    >
                                        {activeTab === 0 && (
                                            <div className="space-y-5">
                                                <p className="text-emerald-400">❯ upload --secure ./target_image.jpg</p>
                                                <p className="text-white/60">Initializing secure pipeline...</p>
                                                <p className="text-white/60">Encrypting payload with AES-256...</p>
                                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-6">
                                                    <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-emerald-400" />
                                                </div>
                                                <p className="text-white/60 mt-4">Upload complete. 4.2MB transferred securely.</p>
                                            </div>
                                        )}
                                        {activeTab === 1 && (
                                            <div className="space-y-5">
                                                <p className="text-blue-400">❯ analyze --model=resnet_v2 target_image.enc</p>
                                                <p className="text-white/60">Extracting EXIF metadata layers...</p>
                                                <p className="text-white/60">Running Error Level Analysis (ELA)...</p>
                                                <p className="text-white/60">Passing through Vision Transformer arrays...</p>
                                                <div className="flex items-center gap-3 mt-6 text-yellow-400 bg-yellow-400/10 px-4 py-3 rounded-xl border border-yellow-400/20">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Calculating deterministic confidence score...</span>
                                                </div>
                                            </div>
                                        )}
                                        {activeTab === 2 && (
                                            <div className="space-y-5">
                                                <p className="text-purple-400">❯ report --generate</p>
                                                <div className="p-6 rounded-2xl border border-white/10 bg-white/5 mt-6 shadow-inner">
                                                    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-6">
                                                        <span className="font-semibold text-white/80">Verdict:</span>
                                                        <span className="text-red-400 font-bold px-4 py-1.5 rounded-full bg-red-400/10 border border-red-400/20 text-sm tracking-widest uppercase">Deepfake Detected</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-white/60 mb-4">
                                                        <span>Confidence Score:</span>
                                                        <span className="text-white font-mono text-lg">99.8%</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-white/60">
                                                        <span>Primary Anomalies:</span>
                                                        <span className="text-white">Facial blending inconsistencies</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── CTA SECTION ───── */}
            <section className="w-full py-40 relative overflow-hidden bg-background">
                {/* Huge Radial Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,rgba(254,114,0,0.05)_0%,transparent_60%)] pointer-events-none blur-3xl" />
                
                <div className="max-w-[800px] mx-auto px-6 text-center relative z-10">
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.6, ease }}
                        className="text-[4rem] md:text-[5.5rem] font-bold text-foreground tracking-tighter leading-[1.05] mb-8"
                    >
                        Ready to find<br />the truth?
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1, ease }}
                        className="text-lg md:text-xl text-muted-foreground font-medium mb-12 max-w-[550px] mx-auto leading-relaxed"
                    >
                        Join thousands of organizations using AIVerifySnap to protect their digital integrity.
                    </motion.p>
                    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2, ease }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/detect" className="group relative flex items-center justify-center gap-2 bg-foreground text-background hover:bg-orange-500 hover:text-white px-10 py-4 rounded-full font-bold text-[15px] transition-all shadow-[0_8px_30px_-8px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_-10px_rgba(249,115,22,0.6)] hover:-translate-y-1 overflow-hidden w-full sm:w-auto">
                            <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-[150%] -z-10" />
                            Start Free Trial
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/contact" className="group relative flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-4 rounded-full font-bold bg-background text-foreground border border-border/80 hover:bg-foreground hover:text-background shadow-sm hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-1 text-[15px] overflow-hidden">
                            <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-[150%] -z-10" />
                            Contact Sales
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
