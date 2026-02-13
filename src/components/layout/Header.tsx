import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-brand-black text-brand-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6">
        <div className="font-heading text-2xl font-bold uppercase">
          Siesel&apos;s
        </div>
        <div className="flex gap-6 font-body text-sm">
          <Link href="/" className="transition-colors hover:text-brand-wood">
            Home
          </Link>
        </div>
      </nav>
    </header>
  );
}
