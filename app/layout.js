import "./globals.css";

import { Space_Grotesk } from "next/font/google";

import faviconWhite from "./metadata-favicon-white.ico";
import favicon from "./metadata-favicon.ico";
import Layout from "../components/Layout";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata = {
  title: "web3rsvp",
  description: "Find, join, and create virtual events with your web3 friends.",
  icons: {
    icon: [
      { media: "(prefers-color-scheme: light)", url: favicon.src },
      { media: "(prefers-color-scheme: dark)", url: faviconWhite.src },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
