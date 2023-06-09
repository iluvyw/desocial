import { MetaMaskContextProvider } from "@/hooks/useMetaMask";
import "./globals.css";
import { Inter } from "next/font/google";
import Nav from "./components/Nav";
import React from "react";
import Navigator from "./components/Navigator";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Desocial.",
  description: "Generated by An Pham",
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="h-auto min-h-screen w-screen bg-white flex flex-col items-center py-24">
        <MetaMaskContextProvider>
          <Nav />
          {props.children}
          <Navigator />
        </MetaMaskContextProvider>
      </body>
    </html>
  );
}
