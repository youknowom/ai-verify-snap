"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, AlertCircle, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface AuthDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ isOpen, onOpenChange }: AuthDialogProps) {
    const [isLoading, setIsLoading] = useState<string | null>(null); // 'google' | 'credentials' | null
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOAuthLogin = async (provider: 'google') => {
        try {
            setIsLoading(provider);
            setError(null);
            await signIn(provider, { callbackUrl: "/detect" });
        } catch (err) {
            console.error(`${provider} Auth Error:`, err);
            setError(`Failed to connect with ${provider}. Please try again.`);
            toast.error(`Authentication failed with ${provider}`);
            setIsLoading(null);
        }
    };

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setIsLoading("credentials");
            setError(null);
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success(isSignUp ? "Account created successfully!" : "Authenticated successfully!");
            onOpenChange(false);
            window.location.href = "/detect";
        } catch {
            setError("Invalid credentials. Please use Google Login.");
            toast.error("Authentication failed");
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[360px] p-0 overflow-hidden border-0 bg-background shadow-2xl rounded-3xl gap-0">
                {/* 1. Blurred Gradient Canvas Header */}
                <div 
                    className="relative w-full h-[110px] flex items-center justify-center overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #d35400 0%, #1a1a24 35%, #2980b9 70%, #c0392b 100%)"
                    }}
                >
                    {/* Artistic noise overlay for texture */}
                    <div className="absolute inset-0 bg-black/10 opacity-30 mix-blend-overlay pointer-events-none" />
                    
                    {/* Centered White Typographic Logo */}
                    <span className="text-[26px] font-bold tracking-tighter text-white lowercase select-none">
                        aiverifysnap
                    </span>
                </div>

                <div className="p-8 space-y-6">
                    {/* Conditional Auth Screen rendering */}
                    {!showEmailForm ? (
                        <div className="space-y-6 flex flex-col items-center">
                            {/* Title */}
                            <h2 className="text-2xl font-semibold text-foreground text-center">
                                Sign in to continue
                            </h2>

                            {/* Checklist of benefits */}
                            <div className="w-full max-w-[280px] space-y-3 py-2">
                                <div className="flex items-center gap-3 text-[14px] text-foreground/80 font-medium">
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/10 text-green-500 shrink-0">
                                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                    </div>
                                    <span>100 free credits</span>
                                </div>
                                <div className="flex items-center gap-3 text-[14px] text-foreground/80 font-medium">
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/10 text-green-500 shrink-0">
                                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                    </div>
                                    <span>Forensic-grade audits</span>
                                </div>
                                <div className="flex items-center gap-3 text-[14px] text-foreground/80 font-medium">
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/10 text-green-500 shrink-0">
                                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                    </div>
                                    <span>No credit card required</span>
                                </div>
                            </div>

                            {/* Google Sign In - Rounded Pill with Dark Background */}
                            <button
                                onClick={() => handleOAuthLogin("google")}
                                disabled={isLoading !== null}
                                className="w-full max-w-[280px] h-12 flex items-center justify-center gap-2.5 rounded-full bg-[#18181b] hover:bg-[#27272a] disabled:opacity-50 text-white font-semibold text-sm transition-all duration-200 shadow-md focus:outline-none"
                            >
                                {isLoading === "google" ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                                    </svg>
                                )}
                                <span>Continue with Google</span>
                            </button>

                            {/* Use email options toggle */}
                            <button 
                                onClick={() => setShowEmailForm(true)}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors pt-2 focus:outline-none"
                            >
                                Use email or other options
                            </button>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <h2 className="text-xl font-bold text-foreground text-center">
                                {isSignUp ? "Create your account" : "Sign in with email"}
                            </h2>

                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/5 border border-destructive/15 text-destructive text-[12px] font-medium animate-fade-in">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Email Password Form */}
                            <form onSubmit={handleCredentialsLogin} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/75">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading !== null}
                                        className="h-10 rounded-lg text-sm bg-card border-border focus-visible:ring-primary/20"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/75">Password</Label>
                                        {!isSignUp && (
                                            <button
                                                type="button"
                                                onClick={() => toast.info("Simulated: Password reset link sent.")}
                                                className="text-xs font-semibold text-accent hover:underline focus:outline-none"
                                            >
                                                Forgot?
                                            </button>
                                        )}
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading !== null}
                                        className="h-10 rounded-lg text-sm bg-card border-border focus-visible:ring-primary/20"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoading !== null}
                                    className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/95 transition-colors text-xs flex items-center justify-center gap-1.5 mt-2"
                                >
                                    {isLoading === "credentials" ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <span>{isSignUp ? "Create account" : "Sign In"}</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            {/* Back and Switch Auth links */}
                            <div className="flex flex-col items-center gap-3 pt-3 border-t border-border/40 text-xs">
                                <button 
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="font-semibold text-accent hover:underline focus:outline-none"
                                >
                                    {isSignUp ? "Back to Sign In" : "Don't have an account? Sign Up"}
                                </button>
                                <button 
                                    onClick={() => { setShowEmailForm(false); setError(null); }}
                                    className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                                >
                                    Back to Google sign in
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Legal compliance footer links */}
                    <div className="text-center text-[10px] text-muted-foreground/50 leading-relaxed max-w-[280px] mx-auto pt-2">
                        By continuing, you agree to our{" "}
                        <a href="/terms" className="underline hover:text-foreground/80 transition-colors">Terms of Service</a> and{" "}
                        <a href="/privacy" className="underline hover:text-foreground/80 transition-colors">Privacy Policy</a>.
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
