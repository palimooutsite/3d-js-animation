import "./globals.css";

export const metadata = {
  title: "Nebula One - 3D Landing",
  description: "Landing page dengan animasi Three.js di Next.js."
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
