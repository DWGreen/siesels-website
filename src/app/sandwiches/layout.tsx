import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartGrid from "@/components/cart/CartGrid";
import CartSidebar from "@/components/cart/CartSideBar";

export default function SandwichesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main
        id="main-content"
        className="flex flex-1 flex-col"
      >
        {children}
      <CartSidebar/>
      </main>

      <div className="bg-footer-texture">
        <Footer />
      </div>
    </div>
  );
}