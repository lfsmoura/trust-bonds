import "@repo/ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "@rainbow-me/rainbowkit/styles.css";
import NavBar from "./components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrustBonds | Decentralized Trust Network",
  description:
    "Create and manage trust bonds on the blockchain, powered by Scroll",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen h-full`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-1 p-4 md:p-24 min-h-screen">{children}</main>
            <footer className="w-full bg-gray-50 py-4 border-t border-gray-100">
              <div className="container mx-auto px-4 flex gap-8 items-center">
                <div className="text-gray-500">
                  <a
                    href="https://www.modularcarnival.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-700 transition-colors"
                  >
                    Modular Carnival
                  </a>
                </div>
                <div className="text-gray-500">
                  <a
                    href="https://scroll.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-700 transition-colors"
                  >
                    Scroll
                  </a>
                </div>
                <div className="text-gray-500">
                  <a
                    href="https://github.com/lfsmoura/trust-bonds"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-700 transition-colors"
                  >
                    Contribute to project
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
