// src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";

// Configure the Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Telecom Mileage",
  description: "Find value-for-money recharge plans.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}