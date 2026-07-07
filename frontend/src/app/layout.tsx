import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import { HeaderNav } from "@/components/shared/HeaderNav";
import Link from "next/link";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export const metadata: Metadata = {
  metadataBase: new URL("https://aiverifysnap.com"), // Base URL for the application
  title: {
    default: "AI Verify Snap | AI Image Detector & Deepfake Scanner",
    template: "%s | AI Verify Snap",
  },
  description: "Protect your digital identity with AI Verify Snap by Omkar Bagul. Industry-leading AI generated image detector, deepfake scanner, and forensic photo authenticity checker.",
  keywords: ["AI image detector", "Deepfake detector", "Image forensic analysis", "AI image verification", "Detect AI generated photos", "Omkar Bagul", "youknowom"],
  authors: [{ name: "Omkar Bagul", url: "https://github.com/youknowom" }],
  creator: "Omkar Bagul",
  publisher: "AI Verify Snap",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "AI Verify Snap | Deepfake Detection Platform",
    description: "Detect AI-generated images and protect your digital identity with advanced forensic analysis.",
    url: "https://aiverifysnap.com",
    siteName: "AI Verify Snap",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Verify Snap | Deepfake Detection Platform",
    description: "Detect AI-generated images and protect your digital identity with advanced forensic analysis.",
    creator: "@youknowom",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextAuthProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "AI Verify Snap",
                "url": "https://aiverifysnap.com",
                "founder": {
                  "@type": "Person",
                  "name": "Omkar Bagul"
                },
                "sameAs": [
                  "https://twitter.com/youknowom",
                  "https://github.com/youknowom"
                ]
              })
            }}
          />
        </head>
        <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`} suppressHydrationWarning>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {/* Announcement Bar */}
            {/* <div className="w-full py-2.5 flex items-center justify-center text-[13px] font-medium gap-2.5 px-4 relative z-50"
              style={{ background: "linear-gradient(135deg, #e17b27ff 0%, #ecac2cff 50%, #fe7200ff 100%)", color: "white" }}>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold border border-white/25 bg-white/15">BETA</span>
              <span>Forensic Engine is live. Try it now</span>
              <span className="text-base leading-none">&rarr;</span>
            </div> */}

            <HeaderNav />

            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="w-full mt-32 border-t" style={{ borderColor: "hsl(var(--border) / 0.4)" }}>
              <div className="mx-auto max-w-[1280px] px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">
                  <div className="col-span-2 md:col-span-2">
                    <Link href="/" className="inline-block mb-3">
                      <span className="text-lg font-bold tracking-tighter lowercase text-foreground">
                        ai<span className="font-light text-accent">verify</span>snap
                      </span>
                    </Link>
                    <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[280px]">
                      India&apos;s deepfake detection and digital identity protection platform.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4">Platform</h4>
                    <ul className="space-y-2.5">
                      <li><Link href="/detect" className="text-[14px] text-foreground/60 hover:text-foreground transition-colors">Image Detection</Link></li>
                      <li><Link href="/detect?mode=bulk" className="text-[14px] text-foreground/60 hover:text-foreground transition-colors">Bulk Scan</Link></li>
                      <li><Link href="/protection" className="text-[14px] text-foreground/60 hover:text-foreground transition-colors">Identity Protection</Link></li>
                      <li><Link href="/history" className="text-[14px] text-foreground/60 hover:text-foreground transition-colors">Scan History</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4">Developers</h4>
                    <ul className="space-y-2.5">
                      <li><Link href="/docs" className="text-[14px] text-foreground/60 hover:text-foreground transition-colors">API Reference</Link></li>
                      <li><Link href="/#how-it-works" className="text-[14px] text-foreground/60 hover:text-foreground transition-colors">How It Works</Link></li>
                      <li><Link href="/admin" className="text-[14px] text-foreground/60 hover:text-foreground transition-colors">Dashboard</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4">Company</h4>
                    <ul className="space-y-2.5">
                      <li><Link href="/pricing" className="text-[14px] text-foreground/60 hover:text-foreground transition-colors">Pricing</Link></li>
                      <li><Link href="/#about" className="text-[14px] text-foreground/60 hover:text-foreground transition-colors">About</Link></li>
                      <li><Link href="/#contact" className="text-[14px] text-foreground/60 hover:text-foreground transition-colors">Contact</Link></li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-10 mt-12 gap-3" style={{ borderTop: "1px solid hsl(var(--border) / 0.3)" }}>
                  <p className="text-[12px] text-muted-foreground">
                    &copy; {new Date().getFullYear()} AIVerifySnap. All rights reserved.
                  </p>
                  <p className="text-[11px] text-muted-foreground/60 font-medium tracking-[0.2em] uppercase">
                    Truth starts here
                  </p>
                </div>
              </div>
            </footer>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </NextAuthProvider>
  );
}
