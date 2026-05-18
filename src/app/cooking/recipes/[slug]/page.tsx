// src/app/cooking/recipes/[slug]/page.tsx

import { notFound } from "next/navigation";
import RecipeDetail from "@/components/recipes/RecipeDetail";
import { getRecipeBySlug } from "@/services/recipes";
import Footer from "@/components/layout/Footer";
import RecipeSearchBar from "@/components/recipes/RecipeSearchBar";
import InteriorHero from "@/components/sections/InteriorHero";
import Header from "@/components/layout/Header";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;

  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }
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
      <RecipeDetail recipe={recipe} />;
      </section>
      </main>
      <div className="bg-footer-texture">
        <Footer />
      </div>
    </div>
  );

}