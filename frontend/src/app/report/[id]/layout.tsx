import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Authenticity Report",
  description: "View the deterministic forensic analysis report for this scanned image, including metadata analysis and AI probability scores.",
  robots: {
    index: false,
    follow: false,
  }
};

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
