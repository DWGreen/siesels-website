export type SpecialOffer = {
  name: string;
  price: string;
  details: string;
};

export type SpecialTextAlternative = {
  heading: string;
  effectiveDates: string;
  introduction?: string;
  offers: SpecialOffer[];
  notices?: string[];
};

export type SpecialImage = {
  id: string;
  src: string;
  alt: string;
  title?: string;
  textAlternative: SpecialTextAlternative;
};

export type SpecialsCategory = {
  id: string;
  title: string;
  images: SpecialImage[];
};

export const biWeeklySpecials: SpecialImage[] = [
  {
    id: "special-1",
    src: "/images/specials/biweekly/specials1.jpg",
    alt: "Weekly butcher shop ad, page 1 of 2: meat specials, June 26–July 9, 2026",
    title: "Meat Specials",
    textAlternative: {
      heading: "Butcher Shops — Happy 4th of July!",
      effectiveDates: "Prices effective Friday, June 26 through Thursday, July 9, 2026.",
      introduction: "Family-owned, locally operated. Premium meats, hand-cut by skilled butchers. For serious cooks since 1968. Featuring 100% Midwestern USDA Prime & Choice beef, plus premium poultry, pork, and seafood. Celebrating 250 years of American independence. Expertly cut. Exceptionally sourced.",
      offers: [
        { name: "“Fat On” Tri-Tip", price: "$16.99 per lb.", details: "USDA Choice, Midwestern Angus beef. Marbled to perfection: this well-marbled tri-tip is left with its natural fat cap intact, delivering exceptional flavor, tenderness, and juiciness whether grilled, smoked, or roasted." },
        { name: "T-Bone Steak", price: "$27.99 per lb.", details: "USDA Choice, Midwestern Angus beef. Our T-Bone steaks are rich in flavor with beautiful marbling and a hearty steakhouse-quality cut. Perfect for grilling and serving as the centerpiece of any meal." },
        { name: "Brisket", price: "$9.99 per lb.", details: "USDA Choice, boneless Midwestern Angus beef. A rich, flavorful beef cut best when slow-cooked until tender and juicy." },
        { name: "New York Steak", price: "$31.99 per lb.", details: "USDA Prime, boneless, Midwestern Angus beef. A tender, well-marbled beef cut with bold flavor, ideal for grilling or pan-searing." },
        { name: "All Beef Hot Dogs", price: "$8.99 per lb.", details: "1/4 lb. Savory, juicy, and perfect for grilling or quick meals. They deliver classic, crowd-pleasing flavor in every bite." },
        { name: "Baby Back Ribs", price: "$5.99 per lb.", details: "Tender, meaty pork ribs that are perfect for slow-cooking or grilling until fall-off-the-bone delicious." },
        { name: "Mary’s Bone-In Chicken Breast", price: "$6.99 per lb.", details: "Air-chilled, No Antibiotic Ever, and Free-Range." },
        { name: "Bone-In Pork Butt", price: "$5.99 per lb.", details: "A flavorful pork cut ideal for slow roasting or smoking until tender and juicy." },
      ],
      notices: ["4th of July hours: Iowa Meat Farms, 9am–4pm; Siesel’s, 9am–5pm."],
    },
  },
  {
    id: "special-2",
    src: "/images/specials/biweekly/specials2.jpg",
    alt: "Weekly butcher shop ad, page 2 of 2: produce, deli, and grocery specials, June 26–July 9, 2026",
    title: "Produce, Deli & Grocery Specials",
    textAlternative: {
      heading: "Fresh. Local. Seasonal. — Fresh Deli Favorites",
      effectiveDates: "Prices effective June 26 through July 9, 2026 (date range printed on page 1 of this ad).",
      offers: [
        { name: "Fresh Sweet White Corn", price: "$0.99 each", details: "Picked just for you! Naturally sweet, crisp, and full of fresh summer flavor. It’s perfect for grilling, boiling, or adding to your favorite meals." },
        { name: "Sweet Red Cherries", price: "$2.99 per lb.", details: "Sweet red cherries." },
        { name: "Large Red Tomatoes", price: "$1.99 per lb.", details: "Large red tomatoes." },
        { name: "Red, White, & Blue Potato Salad", price: "$6.99 per lb.", details: "Red and white potatoes with blue cheese." },
        { name: "Dietz & Watson Hot Dogs", price: "$8.99 each", details: "Assorted varieties, 15 oz." },
        { name: "BLTA Sandwich", price: "$10.99 each", details: "A classic American favorite; bacon, lettuce, tomato, & avocado on fresh bread!" },
        { name: "Joe’s Potato Chips", price: "$3.99 each", details: "Assorted varieties, 5 oz." },
        { name: "Meat Church BBQ Rubs", price: "$9.99 each", details: "Assorted varieties, 12–13 oz." },
        { name: "Bone Suckin’ Sauce BBQ Sauce", price: "$7.99 each", details: "Assorted varieties, 18 oz." },
        { name: "AleSmith Brewing Company .394 Pale Ale", price: "$12.99 each", details: "6 pack, 12 oz. cans." },
        { name: "Ranga. Ranga. Sauvignon Blanc", price: "$16.99 each", details: "750 ml bottle." },
      ],
      notices: [
        "Fresh baked Julian Pies, while supplies last!",
        "Don’t forget your deli party trays! A convenient assortment of sliced meats, cheeses, and sides, perfect for entertaining and serving a crowd.",
        "Don’t forget our homemade signature famous potato salad, baked beans, & dips!",
        "Iowa Meat Farms: 6041 Mission Gorge Road, San Diego, CA 92120. 619-281-5766. Hours: Monday–Saturday 9am–6pm; Sunday 10am–6pm.",
        "Siesel’s Meat & Deli: 4131 Ashton Street, San Diego, CA 92110. 619-275-1234. Hours: Monday–Saturday 9am–7pm; Sunday 9am–6pm.",
        "BestMeatSanDiego.com. Groceries delivered right to your door through Instacart.",
      ],
    },
  },
];


export const weekendSpecials: SpecialImage[] = [
  {
    id: "special-1",
    src: "/images/specials/weekend/weekend1.jpg",
    alt: "Weekend two-day sale ad, page 1 of 2: raw shrimp, June 13–14, 2026",
    title: "Fresh Seafood Favorites",
    textAlternative: {
      heading: "Butcher Shop — Saturday & Sunday Savings — 2 Day Sale!",
      effectiveDates: "Prices effective Saturday, June 13 through Sunday, June 14, 2026 only.",
      introduction: "Iowa Meat Farms & Siesel’s Meats. Since 1968 for serious cooks.",
      offers: [
        { name: "Raw Shrimp", price: "$19.99 per lb.", details: "Mexican wild, peeled & deveined, 16–20 count. Fresh seafood favorites: fresh, wild-caught shrimp that are peeled and deveined for convenience, perfect for grilling, sautéing, or a great addition to any meal." },
      ],
    },
  },
  {
    id: "special-2",
    src: "/images/specials/weekend/weekend2.jpg",
    alt: "Weekend two-day sale ad, page 2 of 2: marinated tri-tip",
    title: "Marinated Tri-Tip",
    textAlternative: {
      heading: "Something Sweet!",
      effectiveDates: "Paired with the June 13–14, 2026 weekend ad. This image does not print a separate date range.",
      offers: [
        { name: "Marinated Tri-Tip", price: "$16.99 per lb.", details: "USDA Choice, Midwestern Angus beef. Hawaiian & assorted flavors. A flavorful beef cut soaked in marinade for extra tenderness and taste, perfect for grilling or roasting." },
      ],
    },
  },
];

export const specialsCategories: SpecialsCategory[] = [
  {
    id: "weekly-specials",
    title: "Weekly Specials",
    images: biWeeklySpecials,
  },
  {
    id: "weekend-two-day-only-specials",
    title: "Weekend Two Day Only Specials",
    images: weekendSpecials,
  },
];
