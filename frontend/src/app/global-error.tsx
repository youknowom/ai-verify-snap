"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
                        <AlertTriangle className="w-8 h-8 text-destructive" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground mb-2">Something went wrong</h2>
                        <p className="text-sm text-muted-foreground">
                            An unexpected error occurred. Please try again or contact support if the issue persists.
                        </p>
                    </div>
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-semibold rounded-xl hover:opacity-90 transition-all text-sm"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}
