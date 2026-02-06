import "./globals.css";
import { DM_Sans, Space_Grotesk } from "next/font/google";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-body" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-title" });

export const metadata = {
  title: "Engineer Quest",
  description: "A kid-friendly mechanical engineering journey with real sources.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${spaceGrotesk.variable} bg-sand text-ink font-body`}> 
        {children}
      </body>
    </html>
  );
}
