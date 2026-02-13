export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-white">
      <div className="mx-auto max-w-7xl p-6 text-center font-body text-sm">
        <p>
          &copy; {new Date().getFullYear()} Siesel&apos;s. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
