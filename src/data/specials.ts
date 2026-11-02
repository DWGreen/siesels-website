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

// Crop bounds are percentages of the original flyer, measured from its top-left.
export type SpecialRegion = {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SpecialImage = {
  id: string;
  src: string;
  alt: string;
  title?: string;
  textAlternative: SpecialTextAlternative;
  guidedRegions?: SpecialRegion[];
};

export type SpecialsCategory = {
  id: string;
  title: string;
  images: SpecialImage[];
};

export const biWeeklySpecials: SpecialImage[] = [
  {
    "id": "special-1",
    "src": "/images/specials/biweekly/11-02-26/page1.webp",
    "alt": "Butcher shop holiday ad, page 1 of 2: turkey, turducken, ham, and beef specials, November 2–25, 2026",
    "title": "Holiday Meat Specials",
    "guidedRegions": [
      {
        "label": "Diestel Fresh Turkeys",
        "x": 4.3,
        "y": 27.7,
        "width": 91.4,
        "height": 27.5
      },
      {
        "label": "Turduckens",
        "x": 4.3,
        "y": 55.8,
        "width": 25.3,
        "height": 21.4
      },
      {
        "label": "Turducken Roll",
        "x": 4.3,
        "y": 77.1,
        "width": 25.3,
        "height": 19.5
      },
      {
        "label": "Diestel Turkey Breast",
        "x": 29.6,
        "y": 57.6,
        "width": 18,
        "height": 39.1
      },
      {
        "label": "Kruse Hams",
        "x": 47.6,
        "y": 60,
        "width": 23.1,
        "height": 12.9
      },
      {
        "label": "Siesel’s Double Smoked Hams",
        "x": 70.9,
        "y": 60,
        "width": 24.8,
        "height": 12.9
      },
      {
        "label": "Standing Rib Roast — Choice & Prime",
        "x": 47.6,
        "y": 73.5,
        "width": 28,
        "height": 23.5
      },
      {
        "label": "New York Roast",
        "x": 76.5,
        "y": 73.5,
        "width": 19.2,
        "height": 23.5
      }
    ],
    "textAlternative": {
      "heading": "Set the Table! — Holiday Favorites",
      "effectiveDates": "Prices effective Monday, November 2 through Wednesday, November 25, 2026.",
      "introduction": "Iowa Meat Farms & Siesel’s Meats. For the serious cooks. Make your holiday centerpiece a fresh Diestel turkey, roasting up tender and juicy with rich, traditional turkey flavor.",
      "offers": [
        {
          "name": "Diestel Fresh Turkeys",
          "price": "$5.99 per lb.",
          "details": "Fresh Diestel turkeys for your holiday centerpiece."
        },
        {
          "name": "Turduckens — Small",
          "price": "$170 each",
          "details": "A boneless chicken nestled inside a boneless duck, then inside a turkey, layered with savory stuffing and made in-house by our skilled butchers."
        },
        {
          "name": "Turduckens — Large",
          "price": "$195 each",
          "details": "A boneless chicken nestled inside a boneless duck, then inside a turkey, layered with savory stuffing and made in-house by our skilled butchers."
        },
        {
          "name": "Turducken Roll",
          "price": "$125 each",
          "details": "Boneless turkey, duck, and chicken layered with stuffing, rolled into an easy-to-carve holiday roast."
        },
        {
          "name": "Diestel Bone-In Turkey Breast",
          "price": "$10.99 per lb.",
          "details": "Tender, flavorful white meat. Choose bone-in for a classic presentation."
        },
        {
          "name": "Diestel Boneless Turkey Breast",
          "price": "$12.99 per lb.",
          "details": "Tender, flavorful white meat. Choose boneless for easy carving."
        },
        {
          "name": "Kruse Hams",
          "price": "$4.49 per lb.",
          "details": "Whole or half. Bring home the savory, smoky flavor of a Kruse ham—a delicious centerpiece available whole or half to fit your gathering."
        },
        {
          "name": "Siesel’s In-House Double Smoked Hams",
          "price": "$5.49 per lb.",
          "details": "Our signature hams are double smoked in-house for deep, smoky flavor and a juicy, tender bite—a holiday favorite worth sharing."
        },
        {
          "name": "USDA Choice Standing Rib Roast",
          "price": "$29.99 per lb.",
          "details": "100% Midwestern beef. Beautifully marbled with exceptional tenderness and rich flavor. Available in USDA Prime or USDA Choice—when the very best is what matters!"
        },
        {
          "name": "USDA Prime Standing Rib Roast",
          "price": "$35.99 per lb.",
          "details": "100% Midwestern beef. Beautifully marbled with exceptional tenderness and rich flavor. Available in USDA Prime or USDA Choice—when the very best is what matters!"
        },
        {
          "name": "USDA Choice Boneless New York Roast",
          "price": "$25.99 per lb.",
          "details": "100% Midwestern beef. Treat your guests to boneless New York steaks, prized for their hearty beef flavor and satisfying tenderness. Excellent grilled or pan-seared."
        }
      ]
    }
  },
  {
    "id": "special-2",
    "src": "/images/specials/biweekly/11-02-26/page2.webp",
    "alt": "Butcher shop holiday ad, page 2 of 2: pork, chicken, seafood, and deli specials, November 2–25, 2026",
    "title": "Seafood, Deli & More Holiday Specials",
    "guidedRegions": [
      {
        "label": "Stuffed Pork Chops",
        "x": 4.4,
        "y": 2.6,
        "width": 20.3,
        "height": 20.2
      },
      {
        "label": "Boneless Pork Loin Roast",
        "x": 26.1,
        "y": 2.6,
        "width": 20.3,
        "height": 20.2
      },
      {
        "label": "Mary’s Whole Chickens",
        "x": 4.4,
        "y": 23.2,
        "width": 20.3,
        "height": 19.4
      },
      {
        "label": "Breakfast Sausage",
        "x": 26.1,
        "y": 23.2,
        "width": 20.3,
        "height": 19.4
      },
      {
        "label": "Colossal Raw Shrimp",
        "x": 47.8,
        "y": 5.4,
        "width": 15.4,
        "height": 26.6
      },
      {
        "label": "Maine Lobster Tails",
        "x": 64,
        "y": 5.4,
        "width": 15.4,
        "height": 26.6
      },
      {
        "label": "Fresh Scottish Salmon",
        "x": 80.4,
        "y": 5.4,
        "width": 15.3,
        "height": 26.6
      },
      {
        "label": "Turkey Gravy",
        "x": 47.8,
        "y": 36,
        "width": 15.4,
        "height": 24.3
      },
      {
        "label": "Red Skinned Mashed Potatoes",
        "x": 64,
        "y": 36,
        "width": 15.4,
        "height": 24.3
      },
      {
        "label": "Macaroni & Cheese",
        "x": 80.4,
        "y": 36,
        "width": 15.3,
        "height": 24.3
      }
    ],
    "textAlternative": {
      "heading": "The Freshest Catch — Holiday Across the Store",
      "effectiveDates": "Prices effective November 2 through November 25, 2026 (date range printed on page 1 of this ad).",
      "offers": [
        {
          "name": "Made In-House Stuffed Pork Chops",
          "price": "$7.99 per lb.",
          "details": "Heritage breed premium pork. Our hearty stuffed pork chops bring extra flavor to your table. Choose savory cajun, sage, or sweet apple cinnamon stuffing."
        },
        {
          "name": "Boneless Pork Loin Roast",
          "price": "$7.99 per lb.",
          "details": "Heritage breed premium pork. Lean and tender with a mild, delicious flavor, our pork loin roast pairs beautifully with your favorite herbs, seasonings, or holiday glaze."
        },
        {
          "name": "Mary’s Whole Chickens",
          "price": "$5.99 per lb.",
          "details": "Air-chilled, free-range. Roast a delicious family dinner with Mary’s air-chilled, free-range whole chickens, featuring tender meat and rich, natural chicken flavor."
        },
        {
          "name": "Made In-House Bulk Breakfast Sausage",
          "price": "$4.99 per lb.",
          "details": "Start your morning with flavorful breakfast sausage. Delicious alongside eggs, pancakes, or your favorite holiday breakfast dishes."
        },
        {
          "name": "Colossal Raw Shrimp",
          "price": "$11.99 per lb.",
          "details": "Peeled & deveined, U-15, frozen / defrosted. Big on size and flavor, our colossal raw shrimp offer a firm texture and sweet, delicate taste. Perfect for shrimp cocktail, grilling, or garlic butter scampi."
        },
        {
          "name": "Maine Lobster Tails",
          "price": "$14.99 each",
          "details": "5–6 oz., frozen / defrosted. Make any meal a celebration with sweet, succulent Maine lobster tails. Serve with warm drawn butter for an elegant holiday treat."
        },
        {
          "name": "Fresh Scottish Salmon",
          "price": "$19.99 per lb.",
          "details": "Enjoy the rich flavor and tender, flaky texture of Scottish salmon—a delicious choice for roasting, grilling, or pan-searing."
        },
        {
          "name": "Deli Fresh Turkey Gravy",
          "price": "$9.99 each",
          "details": "1 quart. Complete your holiday meal with our rich, savory turkey gravy—delicious poured over roasted turkey, mashed potatoes, or stuffing."
        },
        {
          "name": "Deli Fresh Red Skinned Mashed Potatoes",
          "price": "$5.99 per lb.",
          "details": "Round out your holiday meal with our creamy red-skinned mashed potatoes—a comforting side for turkey, ham, or roast beef."
        },
        {
          "name": "Deli Fresh Macaroni & Cheese",
          "price": "$6.99 per lb.",
          "details": "Treat the whole family to tender macaroni in a rich, creamy cheese sauce—a satisfying side everyone will love."
        }
      ],
      "notices": [
        "Don’t forget our homemade signature famous potato salad, baked beans, & dips!",
        "Fresh baked Julian Pies, while supplies last!",
        "Don’t forget your deli party trays! A convenient assortment of sliced meats, cheeses, and sides, perfect for entertaining and serving a crowd. Made to order! Please order 48 hours in advance. Call store for details.",
        "We’ve launched our new website! Reserve your holiday meats online today! View our weekly specials, cooking tips, upcoming events, & more.",
        "Iowa Meat Farms: 6041 Mission Gorge Road, San Diego, CA 92120. 619-281-5766. Hours: Monday–Saturday 9am–6pm; Sunday 10am–6pm.",
        "Siesel’s Meat & Deli: 4131 Ashton Street, San Diego, CA 92110. 619-275-1234. Hours: Monday–Saturday 9am–7pm; Sunday 9am–6pm.",
        "BestMeatsSanDiego.com. Groceries delivered right to your door through Instacart."
      ]
    }
  }
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
