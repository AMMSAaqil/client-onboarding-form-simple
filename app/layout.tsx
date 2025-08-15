import "./globals.css"; 

export const metadata = {
  title: "Client Onboarding",
  description: "Client Onboarding Form – Next.js + RHF + Zod"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}