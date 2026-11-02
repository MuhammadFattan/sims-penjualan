import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
        <Toaster richColors position="top-right" />;
      </body>
    </html>
  );
}
