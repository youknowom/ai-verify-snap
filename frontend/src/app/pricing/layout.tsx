import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing for AI Image Verification Software",
  description: "Flexible pricing plans for individuals, creators, and enterprises. Get access to professional image forensic tools, API access, and bulk scanning.",
  alternates: {
    canonical: "https://aiverifysnap.com/pricing",
  }
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
