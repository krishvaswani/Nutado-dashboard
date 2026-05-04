import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "@/styles/globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nutado - Every Home Deserves Better Snacking",
  description:
    "Premium snack gifting and subscription platform. Curate the perfect snack boxes for every occasion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className="font-figtree bg-nutado-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
