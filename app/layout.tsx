import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer.tsx";
import Provider from "./components/Provider";
import MainNav from "./components/MainNav";
import MobileNav from "./components/Mobilnav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auction app dashboard",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <Provider>
          <main className="h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex bg-gray-50 dark:bg-gray-900">
              <MobileNav />
              <section className="flex flex-col flex-1 w-full">
                <MainNav />
                <div className="container px-6 mx-auto grid">{children}</div>
              </section>
            </div>
            <Footer />
          </main>
        </Provider>
      </body>
    </html>
  );
}
