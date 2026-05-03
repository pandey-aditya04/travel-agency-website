import "./globals.css";

export const metadata = {
  title: "RM Yaatra Travels | Best Travel Agency for Indian & Overseas Adventures",
  description: "Experience the world with RM Yaatra Travels. Expertly crafted tour packages for Indian Escapes, Overseas Adventures, and Divine Destinations. Book your next journey with India's most trusted travel partner.",
  keywords: "travel agency, india tours, kerala backwaters, swiss alps, kedarnath yatra, tour packages",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
