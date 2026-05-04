import "./globals.css";

export const metadata = {
  title: 'Travel Agency – Indian & Overseas Tour Packages',
  description: 'Book the best Indian, Overseas, and Divine tour packages. Travel Agency offers stress-free, curated journeys at the best prices.',
  openGraph: {
    title: 'Travel Agency',
    description: 'Best tour packages for India and overseas destinations.',
    url: 'https://travelagenc.vercel.app',
    siteName: 'Travel Agency'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
