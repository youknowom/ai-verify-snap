"use client";

import { motion } from "framer-motion";
import { Check, Zap, Shield, Crown, ArrowRight, Sparkles, Loader2, HelpCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const ease = [0.16, 1, 0.3, 1] as const;

interface FeatureGroup {
    title: string;
    features: string[];
}

interface Tier {
    name: string;
    price: string;
    period: string;
    billing: string;
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    iconBg: string;
    cta: string;
    ctaClass: string;
    popular: boolean;
    featureGroups: FeatureGroup[];
}

const tiers: Tier[] = [
    {
        name: "Starter",
        price: "Free",
        period: "",
        billing: "No credit card required",
        description: "For individuals exploring deepfake verification.",
        icon: Zap,
        iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        cta: "Get Started Free",
        ctaClass: "starter",
        popular: false,
        featureGroups: [
            {
                title: "Detection & Analysis",
                features: [
                    "10 image scans per day",
                    "Basic ELA analysis",
                ]
            },
            {
                title: "Platform & Support",
                features: [
                    "Scan history (7 days)",
                    "Standard processing speed",
                    "Community support"
                ]
            }
        ]
    },
    {
        name: "Professional",
        price: "₹1,499",
        period: "/month",
        billing: "14-day free trial, cancel anytime",
        description: "For creators, journalists, and forensic researchers.",
        icon: Shield,
        iconBg: "bg-accent/15 text-accent",
        cta: "Start Free Trial",
        ctaClass: "professional",
        popular: true,
        featureGroups: [
            {
                title: "Detection & Analysis",
                features: [
                    "Unlimited image scans",
                    "Advanced ELA + heatmap analysis",
                    "Bulk upload (up to 50 images)"
                ]
            },
            {
                title: "Reports & Protection",
                features: [
                    "Full scan history",
                    "Identity protection scans",
                    "PDF report export"
                ]
            },
            {
                title: "Speed & Support",
                features: [
                    "Priority processing (fast lane)",
                    "Email support (under 24h)"
                ]
            }
        ]
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        billing: "Billed annually or custom terms",
        description: "For organizations and high-volume platforms.",
        icon: Crown,
        iconBg: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
        cta: "Contact Sales",
        ctaClass: "enterprise",
        popular: false,
        featureGroups: [
            {
                title: "Advanced Detection",
                features: [
                    "Everything in Professional",
                    "Video frame analysis",
                    "Custom model fine-tuning"
                ]
            },
            {
                title: "Integration & Scaling",
                features: [
                    "REST API access with keys",
                    "Bulk upload (unlimited)",
                    "Webhook notifications"
                ]
            },
            {
                title: "Enterprise SLA",
                features: [
                    "SLA guarantee (99.9% uptime)",
                    "Dedicated account manager",
                    "On-premise deployment option"
                ]
            }
        ]
    }
];

const faqs = [
    { q: "Can I switch plans later?", a: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately and billing is prorated." },
    { q: "Is there a free trial for Professional?", a: "Absolutely. Every Professional plan starts with a 14-day free trial, no credit card required." },
    { q: "What counts as a scan?", a: "Each image analyzed counts as one scan. Bulk uploads count each file individually. Viewing history or reports does not consume scans." },
    { q: "Do you offer student or non-profit discounts?", a: "Yes! We offer 50% off Professional plans for verified students and registered non-profits. Contact us for details." },
];

export default function PricingPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState<string | null>(null);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get("success") && query.get("userId")) {
            const userId = query.get("userId");
            const isMock = query.get("mock") === "true";
            
            toast.success("Billing completed successfully!");
            
            if (isMock) {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
                fetch(`${apiBase}/api/payments/mock-upgrade?userId=${userId}`, {
                    method: "POST"
                })
                .then(res => {
                    if (res.ok) {
                        toast.success("Account upgraded to PRO (Developer Sandbox Mode).");
                        setTimeout(() => {
                            window.location.href = "/detect";
                        }, 1500);
                    }
                })
                .catch(err => console.error("Sandbox upgrade failed", err));
            } else {
                toast.success("Account upgraded to PRO.");
                setTimeout(() => {
                    window.location.href = "/detect";
                }, 1500);
            }
        } else if (query.get("cancel")) {
            toast.info("Payment session was cancelled.");
        }
    }, []);

    const handleCheckout = async (tierName: string) => {
        if (tierName === "Starter") {
            window.location.href = "/detect";
            return;
        }
        if (tierName === "Enterprise") {
            window.location.href = "/docs";
            return;
        }

        if (!session || !session.user) {
            toast.error("Please sign in first to upgrade.");
            return;
        }

        try {
            setLoading(tierName);
            const priceId = "price_1TqDnQ4KgfMzpuLwD5X230AA"; 
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const userId = (session.user as any).id;
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
            const res = await fetch(`${apiBase}/api/payments/create-checkout-session?priceId=${priceId}&userId=${userId}`, {
                method: "POST",
            });
            
            if (!res.ok) {
                throw new Error("Billing service response error");
            }
            
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.error || "Failed to initiate payment session.");
            }
        } catch (err) {
            toast.error("Billing checkout server is offline.");
            console.error(err);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="flex flex-col items-center bg-background min-h-screen relative overflow-hidden">
            {/* Ambient Lighting Orbs */}
            <div className="ambient-orb ambient-orb-cool w-[600px] h-[600px] -top-[150px] -left-[200px] absolute opacity-50 dark:opacity-30" />
            <div className="ambient-orb ambient-orb-warm w-[500px] h-[500px] top-[400px] -right-[150px] absolute opacity-45 dark:opacity-25" />

            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Header Section */}
            <section className="w-full px-6 pt-24 pb-16 text-center relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease }} 
                    className="max-w-[720px] mx-auto space-y-6"
                >
                    <span className="section-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
                        Simple, transparent pricing
                    </span>
                    <h1 className="text-display-md md:text-display-lg font-serif text-foreground leading-[1.1] tracking-tight">
                        Deepfake verification<br />
                        <span className="text-muted-foreground font-sans font-light italic">scaled to your needs.</span>
                    </h1>
                    <p className="text-body-lg text-muted-foreground max-w-[540px] mx-auto font-light leading-relaxed">
                        Verify with absolute certainty. Start free, then upgrade to access advanced forensics, ELA heatmaps, reports, or APIs.
                    </p>
                </motion.div>
            </section>

            {/* Pricing Cards Section */}
            <section className="w-full max-w-[1200px] mx-auto px-6 pb-28 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    {tiers.map((tier, i) => (
                        <motion.div 
                            key={tier.name}
                            initial={{ opacity: 0, y: 40 }} 
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: i * 0.1, ease }}
                            whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
                            className={`relative flex flex-col rounded-3xl p-8 bg-card border transition-all duration-300 ${
                                tier.popular 
                                    ? "border-accent/40 shadow-[0_30px_70px_rgba(24,95,53,0.08)] lg:scale-[1.03] z-20" 
                                    : "border-border/60 shadow-[0_12px_40px_rgba(0,0,0,0.02)] z-10"
                            }`}
                        >
                            {/* Glow effect behind Recommended Card */}
                            {tier.popular && (
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-transparent to-accent/5 rounded-3xl -z-10 blur-xl opacity-75 pointer-events-none" />
                            )}
                            
                            {/* Premium border highlights */}
                            {tier.popular && (
                                <div className="absolute inset-0 rounded-3xl border border-transparent bg-gradient-to-b from-accent/40 via-transparent to-transparent [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />
                            )}

                            {/* Popular/Recommended Badge */}
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg"
                                        style={{ 
                                            background: "linear-gradient(135deg, hsl(var(--accent)) 0%, #ff8c42 100%)",
                                            boxShadow: "0 4px 16px hsl(var(--accent) / 0.35)" 
                                        }}
                                    >
                                        <Sparkles className="w-3.5 h-3.5" /> Most Popular
                                    </span>
                                </div>
                            )}

                            {/* Card Top / Identity */}
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tier.iconBg} shadow-inner`}>
                                    <tier.icon className="w-5.5 h-5.5" strokeWidth={2} />
                                </div>
                                <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{tier.name}</span>
                            </div>

                            <p className="text-body-md text-muted-foreground font-light leading-relaxed mb-6">
                                {tier.description}
                            </p>

                            {/* Price Presentation */}
                            <div className="space-y-1 mb-8">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-5xl font-extrabold tracking-tighter text-foreground">
                                        {tier.price}
                                    </span>
                                    {tier.period && (
                                        <span className="text-body-lg text-muted-foreground font-light">
                                            {tier.period}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                    <span>{tier.billing}</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => handleCheckout(tier.name)}
                                disabled={loading !== null}
                                aria-label={`Choose ${tier.name} plan`}
                                className={`group relative w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 font-semibold text-[15px] transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 overflow-hidden z-10 ${
                                    tier.popular 
                                        ? "bg-gradient-to-b from-foreground to-foreground/90 text-background shadow-[0_8px_25px_-8px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_30px_-8px_rgba(0,0,0,0.6)] hover:-translate-y-1 active:scale-[0.98]" 
                                        : "bg-gradient-to-b from-background to-muted/20 hover:to-muted/40 text-foreground border border-border shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] hover:-translate-y-1 active:scale-[0.98]"
                                } disabled:opacity-50 disabled:pointer-events-none`}
                            >
                                {tier.popular && (
                                    <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-[150%] -z-10" />
                                )}
                                {loading === tier.name ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-current" />
                                ) : (
                                    <>
                                        <span>{tier.cta}</span>
                                        <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1.5 duration-300" />
                                    </>
                                )}
                            </button>

                            {/* Subtle Divider */}
                            <div className="w-full border-t border-border/40 my-8" />

                            {/* Categorized Features list */}
                            <div className="space-y-6 flex-1">
                                {tier.featureGroups.map((group) => (
                                    <div key={group.title} className="space-y-3">
                                        <h4 className="text-[11px] font-bold text-foreground/75 uppercase tracking-wider">
                                            {group.title}
                                        </h4>
                                        <div className="space-y-2.5">
                                            {group.features.map((feature) => (
                                                <div key={feature} className="flex items-start gap-3">
                                                    <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mt-0.5 flex-shrink-0">
                                                        <Check className="w-3 h-3" strokeWidth={3} />
                                                    </div>
                                                    <span className="text-[13px] text-muted-foreground leading-normal font-light">
                                                        {feature}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Premium FAQ Section */}
            <section className="w-full max-w-[800px] mx-auto px-6 pb-36 relative z-10 border-t border-border/40 pt-20">
                <div className="text-center mb-14 space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-accent">Questions & Answers</span>
                    <h2 className="text-heading-lg font-serif text-foreground">
                        Frequently asked questions
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {faqs.map((faq, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 15 }} 
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} 
                            transition={{ duration: 0.5, delay: i * 0.05, ease }}
                            className="bg-card/40 border border-border/30 rounded-2xl p-6 shadow-sm hover:border-border/60 transition-all duration-300"
                        >
                            <div className="flex gap-2.5 items-start">
                                <HelpCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                                <div className="space-y-1.5">
                                    <h3 className="text-sm font-semibold text-foreground leading-snug">
                                        {faq.q}
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
