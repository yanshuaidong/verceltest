import "./globals.css";

export const metadata = {
  title: "Vercel DB Demo",
  description: "A tiny full-stack database demo for Vercel learning."
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
