import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";
import { searchRecipes } from "@/services/recipes";
import RecipeSearchBar from "@/components/recipes/RecipeSearchBar";
import RecipeGrid from "@/components/recipes/RecipeGrid";

type PageProps = {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
};

export default async function CookingPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = Number(params.page ?? 1);

  const result = await searchRecipes({
    query: params.query,
    page,
    limit: 12,
  });
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex flex-1 flex-col">
        <InteriorHero
          title="Cooking"
          backgroundImage="/images/hero/butcher.jpg"
          backgroundAlt="Butcher at work at Siesel's Meats"
        />
    
         <div className="bg-brand-gray">
        <RecipeSearchBar />
      </div>
<section className="flex flex-1 items-center justify-center bg-brand-gray px-4 py-20 lg:py-32">
      <RecipeGrid recipes={result.recipes} />
      </section>
      </main>
      <div className="bg-footer-texture">
        <Footer />
      </div>
    </div>
  );
}
