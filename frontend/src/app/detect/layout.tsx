import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Fake Image Detector & Forensic Analysis",
  description: "Upload any photo to detect AI generated content, manipulation, and deepfakes using our advanced ELA heatmaps and visual forensic scanner.",
  alternates: {
    canonical: "https://aiverifysnap.com/detect",
  }
};

export default function DetectLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SearchAction",
            "target": "https://aiverifysnap.com/detect?q={search_term_string}",
            "query-input": "required name=search_term_string"
          })
        }}
      />
      {children}
    </>
  );
}
