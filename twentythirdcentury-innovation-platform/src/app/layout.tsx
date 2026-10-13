import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "TwentyThirdCentury — The future is still yours",
  description:
    "A hopeful, human-first space for AI companions, emerging technology, small moments of play, and what comes next.",
  applicationName: "TwentyThirdCentury",
  openGraph: {
    title: "TwentyThirdCentury — The future is still yours",
    description:
      "Find a little support, follow a spark of curiosity, and take your next step at your own pace.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
