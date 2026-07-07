import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Reference & Developer Documentation",
  description: "Integrate our AI image detection API into your platform. Comprehensive documentation for forensic image analysis and deepfake detection.",
  alternates: {
    canonical: "https://aiverifysnap.com/docs",
  }
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
