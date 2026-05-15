//data mockup for rotating images on the front page, need to get the five images from instagram in the future but for now it will just be these static images

import { InstagramImage } from "@/types/images";

export const instagramPhotos: InstagramImage[] = [
  {
    id: 1,
    alt: "Holiday ham dinner spread",
    color: "from-amber-900 to-amber-800",
    label: "Holiday Ham",
    src:"images/instagram/573816110_18161735002385133_8782683820096044712_n.jpg"
  },
  {
    id: 2,
    alt: "Prime rib rack of lamb dinner",
    color: "from-red-900 to-red-800",
    label: "Prime Rib",
    src: "images/instagram/583088626_18163694464385133_8105374841340819312_n.jpg"
  },
  {
    id: 3,
    alt: "Iowa Meat Farms gift cards",
    color: "from-yellow-800 to-yellow-700",
    label: "Gift Cards",
    src:"images/instagram/591049543_18165879238385133_6597505046112348860_n.jpg"
  },
  {
    id: 4,
    alt: "Store interior and staff",
    color: "from-stone-700 to-stone-600",
    label: "Our Team",
    src: "images/instagram/600614286_18166249816385133_382410465862591004_n.jpg"
  },
  {
    id: 5,
    alt: "Fresh cuts display",
    color: "from-rose-900 to-rose-800",
    label: "Fresh Cuts",
    src: "images/instagram/o.jpg"
  },
];