export type SteakEntry = {
  id: string;
  name: string;
  category: "cut" | "info" | "temps";
  tagline: string;
  paragraphs: string[];
  image?: string;
  tempRange?: string | null;
};

export const steaks: SteakEntry[] = [
  {
    id: "rare",
    name: "Rare",
    category: "temps",
    tagline: "Cool red center with a lightly seared exterior.",
    image: "/images/steaks/temp/rare.jpg",
    tempRange: "120-125F",
    paragraphs: [
     "Rare steaks are seared on the outside while remaining cool and bright red throughout most of the center. This temperature offers the softest texture and highlights the natural flavor of the beef. Best suited for premium, well-marbled cuts like ribeye and filet mignon."
    ],
  },
  {
    id: "medium-rare",
    name: "Medium Rare",
    category: "temps",
    tagline: "Warm red center — the classic steakhouse favorite.",
    image: "/images/steaks/temp/medium-rare.jpg",
    tempRange: "130-135F",
    paragraphs: [
      "Often considered the ideal steak temperature, medium rare features a warm red center surrounded by a thin band of pink. It delivers the perfect balance of tenderness, juiciness, and rich beef flavor, making it the preferred doneness for most premium steaks."
    ],
  },
  {
    id: "medium",
    name: "Medium",
    category: "temps",
    tagline: "Warm pink center with excellent balance.",
    image: "/images/steaks/temp/medium.jpg",
    tempRange: "140-145F",
    paragraphs: [
     "Medium steaks have a warm pink center with more of the interior fully cooked. They remain juicy while offering a firmer texture than medium rare. This is a great choice for those who enjoy a little less redness without sacrificing moisture."
    ],
  },


  {
    id: "ribeye",
    name: "Ribeyes",
    category: "cut",
    tagline: "The king of steaks — richest flavor of all the steaks",
    image: "/images/steaks/new-cuts/ribeye.jpg",
    paragraphs: [
      "The first of the \"middle meat\" steaks, the rib section starts between the fifth and sixth ribs. The entire rib section runs from the sixth to the twelfth rib. This section is actually three muscles that overlap each other.",
      "Since most fat is stored between muscles, the ribeye usually has more fat than the other cuts. Because of that, it has the richest flavor of all the steaks. They tend to be \"soft\" as well as tender. They also have a great balance between tenderness and flavor.",
      "They are available as a boneless steak or a bone-in steak. The bone-in ribeye is referred to as a \"Delmonico.\" It is exactly the same steak, but it still has the bone attached.",
    ],
  },
  {
    id: "new-york",
    name: "New York",
    category: "cut",
    tagline: "Firm, tender, and full of flavor",
    image: "/images/steaks/new-cuts/new-york.png",
    paragraphs: [
      "This is sometimes referred to as a \"top loin,\" \"strip steak,\" or, in New York, as a \"sirloin.\" It is actually a continuation of one of the muscles that makes up the ribeye.",
      "Unlike the ribeye, the New York is primarily a single muscle. Because of that and its location directly in the middle of the back, the difference between the ribeye and the New York is a textural one. While very tender, this steak has a firmer texture than its next door neighbor.",
      "Choosing between these two is really a toss-up. They are both good, tender, flavorful steaks.",
    ],
  },
  {
    id: "filet-mignon",
    name: "Filet Mignon",
    category: "cut",
    tagline: "The most tender of all the steaks",
    image: "/images/steaks/new-cuts/filet-mignon.png",
    paragraphs: [
      "All of the steaks that we are describing run along the spine on top of the ribs. The filet actually comes from underneath the spine where it does virtually no work at all. Because of this, it is the most tender of all the steaks.",
      "If you remember the rule, though, you will realize that it will also be the least flavorful of all. If tenderness alone is your criteria, this is the one for you. Flavor is usually enhanced by such methods as wrapping with bacon, stuffing with bleu cheese or mushrooms, or topping with various sauces.",
      "Because it is a small muscle, the filet is normally cut thick, around 1¾ inches. That provides a serving portion of around 8 oz. When cooking, it is treated as a \"four-sided\" steak. The cooking time can be 16 to 24 minutes — that translates to 4 to 6 minutes per side.",
    ],
  },
  {
    id: "top-sirloin",
    name: "Top Sirloin",
    category: "cut",
    tagline: "The king of steaks — maximum flavor",
    image: "/images/steaks/new-cuts/top-sirloin.jpg",
    paragraphs: [
      "This is the last of the \"middle meat.\" It runs from the end of the New York to the hip joint. It is the one that works the most, is the least tender, and has the most flavor. It is said to have gotten its name from Henry VIII, who pulled out his sword, tapped it, and dubbed it \"Sir Loin.\"",
      "This can really be the \"king\" of steaks. With its inherent flavor, when you get one that is tender, it is unsurpassed. Even with proper beef, this can be tricky, but, if flavor is your criteria, this is the steak for you.",
    ],
  },
  {
    id: "cattlemans-top",
    name: "Cattleman's Top",
    category: "cut",
    tagline: "The ultimate combination of flavor and tenderness",
    image: "/images/steaks/new-cuts/cattlemans.png",
    paragraphs: [
      "For some reason, the thicker you cut a top sirloin, the more tender it becomes. The Cattleman's is a top sirloin that has been cut between 1¾ and two inches thick.",
      "Do not be afraid of them. They are the simplest thing in the world to cook. Simply place on a covered grill for ten minutes on the first side, and fifteen to twenty minutes on the second. Check it with a good testing thermometer and cook to an internal temperature of 135 degrees.",
      "This is probably the ultimate combination of both flavor and tenderness. We normally offer these in \"USDA Prime\" grade. We have never seen a bad Cattleman's Cut!",
    ],
  },
  {
    id: "baseball-top",
    name: "Baseball Top",
    category: "cut",
    tagline: "Extremely lean, tender, and uniquely shaped",
    image: "/images/steaks/new-cuts/baseball.jpg",
    paragraphs: [
      "There is one steak that is the transition point from the New York to the top sirloin. It has a \"seam\" of tendon in the center. If you hold it in one hand and press upward with one finger, it will stretch into a \"ball.\" With that little \"seam,\" it resembles a baseball — thus the name.",
      "A few restaurants got ahold of these and put them on their menus. They are extremely tender and flavorful, but there are only two \"true\" baseballs on the whole animal. The solution was to create a \"baseball style\" steak.",
      "The top sirloin actually consists of two muscles. If you remove the top one, you are left with a single muscle that is the more tender of the two. From that, the steaks are cut into thick, individual servings. They mimic a filet in size and appearance but are much more flavorful.",
      "Because they are extremely lean, we recommend coating in olive oil before grilling. We offer an \"Italian\" baseball marinated in extra virgin olive oil, chopped garlic, fresh parsley, and cracked black pepper.",
    ],
  },
  {
    id: "t-bone-porterhouse",
    name: "T-Bone & Porterhouse",
    category: "cut",
    tagline: "A bone-in combination of New York and filet",
    image: "/images/steaks/new-cuts/t-bone.png",
    paragraphs: [
      "These are cut, bone-in, from the loin section. The larger of the two muscles you see is actually a \"New York.\" The smaller muscle on the other side of the bone is the filet.",
      "The whole filet, as it sits below the spine, is large at one end and tapers down to a flat point at the other. The first few steaks that come off of this section have the larger sized filets — these are called \"porterhouse\" steaks. By definition, the filet on the porterhouse must be at least 2¼ inches across.",
      "As you progress down the loin, the filet becomes smaller and smaller. These steaks are referred to as \"T-bones\" because of the shape of the bone. Very simply, these steaks are a bone-in combination of New York and filet.",
    ],
  },
  {
    id: "flatiron",
    name: "Flatiron",
    category: "cut",
    tagline: "Second most tender muscle in the animal",
    image: "/images/steaks/new-cuts/flat-iron.jpg",
    paragraphs: [
      "This is the only premium steak that does not come from the \"middle meat.\" The flatiron is actually one of the muscles that make up the \"chuck,\" or shoulder. Coming from there, you would not think that it could be tender.",
      "The fact is that it was found to be the second most tender muscle in the animal — second only to filet mignon. Its name comes from its size and shape: long and flat, varying in thickness from ¾ to 1 inch.",
      "Besides the incredible flavor and incredible tenderness, we love these because they are so quick and simple to cook. Just 3–5 minutes per side over a medium hot fire and they are on the table.",
    ],
  },
  {
    id: "grading-system",
    name: "The Grading System",
    category: "info",
    tagline: "What separates Prime from the rest",
    image: "/images/steaks/prime.png",
    paragraphs: [
      "We recognize three grades of beef: USDA Prime, USDA Choice, and \"USDA ROADKILL!\" (That's our name for \"USDA Select\"). Choice and Prime beef are the only ones that we carry, and the only ones that our customers deserve!",
      "Grading is the second step — all beef is first inspected for wholesomeness. From that point, it can optionally be sent to the grader, who evaluates the following criteria:",
      "1. Conformation – Generally the thickness of the muscle. Beef cattle are bred to have short, thick bodies; the grader looks for thick, full muscle.\n2. Maturity – There are areas which tell the grader the age of the animal. It has to do with cartilage that, on an older animal, would have turned to bone. Youth is essential.\n3. Color and Texture – Proper color and texture can also help determine the age of the animal. Older animals are not acceptable.\n4. Intramuscular Fat (Marbling) – The presence of marbling is both an indication that the animal has been inactive and that it has had proper finishing on a high-sugar feed.",
      "THE BEEF BASICS: YOUTH, INACTIVITY, PROPER FEED, AND PROPER AGING!",
    ],
  },
  {
    id: "dry-aging",
    name: "The Dry-Aging Process",
    category: "info",
    tagline: "30+ days of transformation",
    image: "/images/steaks/new-cuts/dry-aged.png",
    paragraphs: [
      "During the aging process, natural enzymes act to both tenderize the meat and develop complex flavors. In our dry aging program we age in a vacuum-sealed bag for a minimum of 30 days. It is then opened and exposed to the air for a minimum of 14 days.",
      "Exposing it in this manner introduces a certain amount of dehydration. This greatly intensifies the flavor, deepens the color, and increases tenderness.",
      "Only cuts that are naturally protected by fat and bones can be processed in this manner. The extra time, handling, loss of weight by dehydration, and trimming and discarding the exposed meat make this an expensive process. The extremely tender and intensely flavored meat is well worth the effort.",
    ],
  },
  {
    id: "seafood",
    name: "Seafood",
    category: "info",
    tagline: "Fresh shipments daily — except Sundays",
    image: "/images/steaks/new-cuts/salmon.jpg",
    paragraphs: [
      "We also offer a selection of fresh seafood. We receive shipments of fresh fish daily (except Sundays). We will offer whatever is best in the marketplace at the time.",
      "We also carry a large variety of frozen shellfish, such as lobster tails, as well Mexican white shrimp.",
    ],
  },
];
