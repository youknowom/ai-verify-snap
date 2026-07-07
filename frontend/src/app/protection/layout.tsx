import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Identity Protection & Reverse Image Search",
  description: "Scan the web to see where your images are being used. Protect against identity theft and unauthorized AI synthetic media generation.",
  alternates: {
    canonical: "https://aiverifysnap.com/protection",
  }
};

export default function ProtectionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
