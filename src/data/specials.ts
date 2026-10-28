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
    src: "/images/specials/biweekly/page1.webp",
    alt: "Weekly butcher shop ad, page 1 of 2: meat and seafood specials, October 23–November 5, 2026",
    title: "Meat & Seafood Specials",
    textAlternative: {
      heading: "A True Butcher Shop — Butcher Shop Specialty",
      effectiveDates: "Prices effective Friday, October 23 through Thursday, November 5, 2026.",
      introduction: "Iowa Meat Farms & Siesel’s Meats. For the serious cooks. Locally owned. Real butchers since 1968. 100% Midwestern beef. Expertly cut. Exceptionally sourced.",
      offers: [
        { name: "Flanken Style Short Ribs", price: "$15.99 per lb.", details: "100% Midwestern beef, USDA Choice. Korean-style or Maui marinated. Packed with rich beef flavor and beautifully layered with marbling. Perfect for grilling or braising in your favorite savory sauce." },
        { name: "White Shrimp", price: "$12.99 per lb.", details: "Wild-caught, Mexican. Shell-on, 16/20 count. Previously frozen and defrosted. Offering a sweet, succulent flavor and a firm texture, perfect for grilling, sautéing, or serving with your favorite seafood seasonings." },
        { name: "Beef Shank", price: "$7.99 per lb.", details: "100% Midwestern Angus beef, USDA Choice. Rich in flavor and perfect for slow cooking until tender and delicious. Ideal for hearty stews, braised dishes, and comforting homemade soups." },
        { name: "Baseball Cut Sirloin Steak", price: "$21.99 per lb.", details: "100% Midwestern beef, USDA Prime. Prized for its exceptional tenderness, rich beef flavor, and beautiful marbling. Perfect for grilling or pan-searing to create a delicious, steakhouse-quality meal at home." },
        { name: "Top Sirloin Steak", price: "$15.99 per lb.", details: "100% Midwestern Angus beef, USDA Choice. Lean, tender, and packed with rich beef flavor. Perfect for grilling, pan-searing, or serving with your favorite sides." },
        { name: "Inside Skirt Steak", price: "$17.99 per lb.", details: "100% Midwestern Angus beef, USDA Choice. Rich in beefy flavor with a deliciously tender texture when cooked properly. Perfect for grilling, fajitas, or slicing thin for tacos and stir-fry." },
        { name: "St. Louis Style Pork Ribs", price: "$6.99 per lb.", details: "Heritage breed premium pork. Meaty and full of rich, savory flavor. Perfect for slow cooking or grilling with your favorite barbecue sauce." },
        { name: "Mary’s Whole Chicken Wings", price: "$5.99 per lb.", details: "Flavorful and versatile, perfect for grilling, roasting, or baking with your favorite seasonings." },
      ],
    },
  },
  {
    id: "special-2",
    src: "/images/specials/biweekly/page2.webp",
    alt: "Weekly butcher shop ad, page 2 of 2: sandwich, deli, and grocery specials, October 23–November 5, 2026",
    title: "Sandwich, Deli & Grocery Specials",
    textAlternative: {
      heading: "Sandwich of the Week — Across the Store — Fresh Deli Favorites",
      effectiveDates: "Prices effective October 23 through November 5, 2026 (date range printed on page 1 of this ad).",
      offers: [
        { name: "Club House Sandwich", price: "$10.99 each", details: "Sandwich of the week. Turkey, baked ham, bacon, avocado, Monterey Jack, mayo, lettuce, tomato, & onion." },
        { name: "Rummo Pasta", price: "$5.49 each", details: "Assorted varieties, 16 oz." },
        { name: "Tresanti Italian Cookies", price: "$9.99 each", details: "16 oz." },
        { name: "Dietz and Watson Cheddarwurst, Knockwurst, or Bratwurst", price: "$7.99 each", details: "Selected varieties, 16 oz." },
        { name: "El Indio Tortilla Chips", price: "$6.99 each", details: "16 oz." },
        { name: "La Salsa Chilen Salsa", price: "$4.99 each", details: "Mild, medium, or hot, 16 oz." },
        { name: "Jalapeño Macaroni Salad", price: "$5.99 per lb.", details: "Combines a creamy pasta with a zesty kick of jalapeño for a flavorful side dish with just the right amount of heat." },
      ],
      notices: [
        "Iowa Meat Farms: 6041 Mission Gorge Road, San Diego, CA 92120. 619-281-5766. Hours: Monday–Saturday 9am–6pm; Sunday 10am–6pm.",
        "Siesel’s Meat & Deli: 4131 Ashton Street, San Diego, CA 92110. 619-275-1234. Hours: Monday–Saturday 9am–7pm; Sunday 9am–6pm.",
        "BestMeatSanDiego.com. Groceries delivered right to your door through Instacart.",
      ],
    },
  },
];


export const weekendSpecials: SpecialImage[] = [
 /* {
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
  },*/
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
