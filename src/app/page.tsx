import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-brand-gray">
        <div className="text-center">
          <h1 className="font-heading text-5xl font-bold uppercase text-brand-black">
            Siesel&apos;s
          </h1>
          <p className="mt-4 font-body text-lg text-brand-dark">Coming Soon</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
