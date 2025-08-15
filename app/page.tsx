import Link from "next/link";


export default function HomePage() {
  return (
    <main className="card">
      <h1 className="h1">Client Onboarding</h1>
      <p className="p">A simple, accessible onboarding form built with Next.js (App Router), React Hook Form, and Zod.</p>
      <Link href="/onboard">Go to Onboarding Form →</Link>
    </main>
  );
}