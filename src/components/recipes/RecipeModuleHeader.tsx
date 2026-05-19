"use client";

import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
};

export default function RecipeModuleHeader({
  title,
  subtitle,
}: Props) {
  return (
    <header
      className="
        border-b-2
        border-neutral-900
        bg-neutral-900
        px-4
        py-5
        text-white
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-7xl
          flex-col
          gap-4
          md:flex-row
          md:items-end
          md:justify-between
        "
      >
        <div>
          <Link
            href="/recipes"
            className="
              text-xs
              font-black
              uppercase
              tracking-[0.25em]
              text-white/70
              hover:text-white
            "
          >
            Cooking
          </Link>

          <h1
            className="
              mt-2
              text-4xl
              font-black
              uppercase
              leading-none
              tracking-tight
            "
          >
            {title}
          </h1>

          {subtitle && (
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              {subtitle}
            </p>
          )}
        </div>

        <nav
          className="
            flex
            flex-wrap
            gap-2
          "
        >
          <HeaderLink href="/recipes">
            Recipes
          </HeaderLink>

          <HeaderLink href="/recipes/my-recipes">
            My Recipes
          </HeaderLink>

          <HeaderLink href="/recipes/my-menu">
            My Menu
          </HeaderLink>

          <HeaderLink href="/recipes/shoppinglist">
            Shopping List
          </HeaderLink>
        </nav>
      </div>
    </header>
  );
}

function HeaderLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="
        border
        border-white/40
        px-3
        py-2
        text-xs
        font-black
        uppercase
        tracking-widest
        text-white
        transition
        hover:border-white
        hover:bg-white
        hover:text-neutral-900
      "
    >
      {children}
    </Link>
  );
}