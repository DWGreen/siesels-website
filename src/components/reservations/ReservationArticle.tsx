import type { ReservationType } from "@/data/storeLocations";

const articles = {
  turkey: [{
    title: "Diestel Turkeys: A Holiday Tradition Worth Sharing",
    paragraphs: [
      "The holiday meal brings everyone together, and a beautiful roasted turkey takes center stage. At Iowa Meat Farms and Siesel’s Meats, we’re proud to offer Diestel turkeys for the family gatherings and traditions that make this season special.",
      "Family-owned since 1949 and now in its fourth generation, Diestel Family Ranch takes a thoughtful approach to raising turkeys. Their birds are raised without antibiotics, fed a 100% vegetarian diet enhanced with vitamins and minerals, and given time to grow slowly—an approach rooted in generations of family farming.",
      "That attention to quality makes Diestel a wonderful choice for your holiday table. Whether you prepare a treasured family recipe with butter and herbs or try a new seasoning blend, a Diestel turkey offers the foundation for a memorable feast. Picture golden-brown skin, the aroma of turkey roasting in the oven, and a platter surrounded by all your favorite holiday sides.",
    ],
  }],
  "turkey-breast": [{
    title: "Diestel Turkey Breasts: A Delicious Choice for Your Holiday Table",
    paragraphs: [
      <>Enjoy the tradition of holiday turkey with Diestel turkey breasts, available in <strong>bone-in and boneless</strong> at Iowa Meat Farms and Siesel’s Meats. They’re a wonderful choice for smaller gatherings, white-meat lovers, or anyone looking to serve extra turkey alongside a whole bird.</>,
      "Bone-in turkey breast offers a classic presentation, perfect for roasting with butter, fresh herbs, and your favorite seasonings. Boneless turkey breast makes carving and serving easy, with convenient slices for holiday dinner plates and leftover sandwiches.",
      "Whether you’re planning an intimate family dinner or adding more white meat to your holiday feast, Diestel turkey breasts bring a delicious taste of tradition to the table.",
    ],
  }],
  ham: [
    {
      title: "Kruse Hams — Available Whole or Half",
      paragraphs: ["Bring a holiday favorite to your table with a delicious Kruse ham, available whole or half to suit your gathering. Whether you’re serving a crowd or enjoying a smaller family celebration, a Kruse ham makes a satisfying centerpiece with plenty to enjoy in sandwiches and favorite leftover recipes."],
    },
    {
      title: "Siesel’s Signature Double Smoked Hams — A Siesel’s Exclusive",
      paragraphs: ["We start with a Kruse ham, hand-score the exterior, and double-smoke it in our in-house smokers to develop a rich, smoky flavor and a naturally glazed exterior. Crafted with care, our Siesel’s Signature Double Smoked Ham is an exclusive holiday favorite that brings something special to your table."],
    },
  ],
  roast: [{
    title: "Standing Rib Roast: The Centerpiece of an Unforgettable Holiday Meal",
    paragraphs: [
      "Make your holiday table extraordinary with a standing rib roast from Iowa Meat Farms and Siesel’s Meats. Available in USDA Prime or USDA Choice, our roasts feature 100% Midwestern beef, selected to deliver the tenderness, rich flavor, and impressive presentation your celebration deserves.",
      "With abundant marbling, each roast delivers an exceptionally rich eating experience and a delicious balance of tenderness and beefy flavor. It makes a memorable centerpiece alongside your favorite holiday sides.",
      "Our skilled butchers trim each roast to perfection, carve the ribs back, and tie it for an amazing presentation and for easy carving. Our standing rib roasts reflect our commitment to bringing you the best beef you can buy. When only the best will do, make our standing rib roast part of your holiday tradition.",
    ],
  }],
};

export default function ReservationArticle({ type }: { type: ReservationType }) {
  return (
    <article aria-label="About your holiday selection" className="relative mt-7 bg-white px-4 pb-4 pt-20 sm:px-6 sm:pb-6">
      <div aria-hidden="true" className="absolute left-1/2 top-6 flex h-8 -translate-x-1/2 items-center justify-center gap-3 text-2xl leading-none text-brand-black">
        <span>★</span>
        <span>★</span>
        <span>★</span>
      </div>
      <div className="space-y-8">
      {articles[type].map(section => (
        <section key={section.title}>
          <h2 className="font-heading text-2xl font-bold uppercase leading-tight tracking-[0.06em] sm:text-3xl">{section.title}</h2>
          <span aria-hidden="true" className="mb-5 mt-3 block h-0.5 w-10 bg-[#9d321e]" />
          <div className="space-y-4 font-serif text-base leading-7 text-neutral-700">
            {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
        </section>
      ))}
      </div>
    </article>
  );
}
