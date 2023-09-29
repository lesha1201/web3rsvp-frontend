import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

import { Space_Grotesk } from "next/font/google";

import Layout from "../components/Layout";
import Providers from "../components/Providers";
import faviconWhite from "./metadata-favicon-white.ico";
import favicon from "./metadata-favicon.ico";

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
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
