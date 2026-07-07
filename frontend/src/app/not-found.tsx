import Link from "next/link";
import { ArrowRight, SearchX } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist on AI Verify Snap.",
  robots: {
    index: false,
    follow: true,
  }
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="p-4 bg-muted rounded-full mb-6">
        <SearchX className="w-12 h-12 text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">404 - Page Not Found</h1>
      <p className="text-muted-foreground max-w-[500px] mb-8 text-lg">
        We couldn&apos;t find the page you were looking for. It might have been moved or doesn&apos;t exist.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/" 
          className="inline-flex items-center justify-center rounded-md bg-foreground text-background px-6 py-3 text-sm font-medium transition-colors hover:bg-foreground/90"
        >
          Return Home
        </Link>
        <Link 
          href="/detect" 
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Scan an Image
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
