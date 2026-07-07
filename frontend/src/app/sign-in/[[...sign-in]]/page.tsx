"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Chrome, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SignInPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push("/detect");
        }
    }, [session, router]);

    if (status === "loading" || session) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 text-accent animate-spin" />
                <p className="text-caption text-muted-foreground">Redirecting to console...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden bg-muted/20">
            {/* Ambient background blur */}
            <div className="ambient-orb ambient-orb-cool w-[500px] h-[500px] -top-[100px] -left-[100px] absolute opacity-40 pointer-events-none" />
            <div className="ambient-orb ambient-orb-warm w-[400px] h-[400px] bottom-[100px] -right-[100px] absolute opacity-30 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-[420px] w-full card-elevated rounded-2xl p-8 relative z-10 space-y-7"
            >
                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto text-accent">
                        <ShieldCheck className="w-6 h-6" strokeWidth={1.8} />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground">Welcome to AIVerifySnap</h2>
                    <p className="text-caption text-muted-foreground">
                        Sign in to access advanced forensic analysis and protection modules.
                    </p>
                </div>

                {/* Primary OAuth Actions */}
                <button
                    onClick={() => signIn("google")}
                    className="w-full flex items-center justify-center gap-3 px-5 py-3 border border-border bg-card rounded-xl hover:bg-muted/50 transition-colors font-semibold text-[14px] text-foreground group"
                >
                    <Chrome className="w-4 h-4 text-accent" />
                    <span>Continue with Google</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto text-muted-foreground/50 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                </button>

                {/* Bottom Footer Notice */}
                <div className="text-center">
                    <p className="text-[11px] text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
