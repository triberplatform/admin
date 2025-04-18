import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import SideNav from "./components/SideNav";
import LoadingStateManager from "./components/LoadingLayout";
import Loading from "./loading";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  // You can specify weight if needed
  // weight: ['400', '500', '700'],
  // You can also specify display style
  // display: 'swap',
});

export const metadata: Metadata = {
  title:"Triber Admin",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSans.className}`}>
        <div>{children}</div>
      </body>
    </html>
  );
}
