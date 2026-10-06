const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export interface CategorySeed {
  name: string;
  slug: string;
  blurb: string;
  image: string;
  accent: string;
}

export interface ProductSeed {
  name: string;
  slug: string;
  description: string;
  details: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  badge: string;
  rating: number;
  reviewCount: number;
  stock: number;
  featured: boolean;
  seasonal: boolean;
  origin: string;
}

export const categories: CategorySeed[] = [
  {
    name: 'Citrus',
    slug: 'citrus',
    blurb: 'Sun-ripened oranges, lemons, and grapefruit.',
    image: img('photo-1611080626919-7cf5a9dbab5b'),
    accent: '#F6C445',
  },
  {
    name: 'Berries',
    slug: 'berries',
    blurb: 'Soft fruit picked at peak color and sweetness.',
    image: img('photo-1464965911861-746a04b4bca6'),
    accent: '#E36B6B',
  },
  {
    name: 'Nuts & Seeds',
    slug: 'nuts',
    blurb: 'Slow-roasted, unsalted, and still in their skins.',
    image: img('photo-1508747703725-719777637510'),
    accent: '#C4A574',
  },
  {
    name: 'Cold-Pressed',
    slug: 'pressed',
    blurb: 'Juice pressed the morning it leaves the grove.',
    image: img('photo-1600271886742-f049cd451bba'),
    accent: '#F08A24',
  },
];

export const products: ProductSeed[] = [
  {
    name: 'Sunshine Navel Oranges',
    slug: 'sunshine-navel-oranges',
    description: 'Thick-skinned navels with a honeyed, low-acid juice. Ideal for eating out of hand.',
    details:
      'Grown without synthetic sprays and picked when the oil in the peel smells sweet. Each fruit is cushioned in paper, not plastic netting. Keep on the counter for up to a week, or chill to slow them down.',
    price: 4.8,
    unit: 'lb',
    category: 'citrus',
    image: img('photo-1547514701-42782101795e'),
    badge: 'Grove pick',
    rating: 4.9,
    reviewCount: 128,
    stock: 48,
    featured: true,
    seasonal: false,
    origin: 'Valencia coast',
  },
  {
    name: 'Meyer Lemons',
    slug: 'meyer-lemons',
    description: 'A thinner peel and a floral, almost tangerine finish. The lemon cooks actually want.',
    details:
      'Meyers bruise easily, so we pack them in a single layer. Zest them the day they arrive — the oils are brightest then. Refrigerate after a few days on the counter.',
    price: 5.6,
    unit: 'lb',
    category: 'citrus',
    image: img('photo-1590502593747-42a996133562'),
    badge: '',
    rating: 4.8,
    reviewCount: 86,
    stock: 32,
    featured: true,
    seasonal: false,
    origin: 'Coastal orchards',
  },
  {
    name: 'Ruby Grapefruit',
    slug: 'ruby-grapefruit',
    description: 'Deep pink segments, bittersweet and juicy. Breakfast, halved, with a spoon.',
    details:
      'We leave the natural bloom on the rind. Rinse before cutting. A cool pantry keeps the pith from drying out.',
    price: 3.9,
    unit: 'lb',
    category: 'citrus',
    image: img('photo-1577234286642-fc512a5f8f11'),
    badge: '',
    rating: 4.6,
    reviewCount: 54,
    stock: 40,
    featured: false,
    seasonal: false,
    origin: 'River valley',
  },
  {
    name: 'Blood Oranges',
    slug: 'blood-oranges',
    description: 'Crimson flesh with a raspberry note. Gorgeous in salads and for pressing.',
    details:
      'Color deepens as the nights cool. If a fruit looks rusty on the outside, the inside is often the sweetest.',
    price: 6.2,
    unit: 'lb',
    category: 'citrus',
    image: img('photo-1611080626919-7cf5a9dbab5b'),
    badge: 'Limited',
    rating: 4.9,
    reviewCount: 41,
    stock: 18,
    featured: false,
    seasonal: true,
    origin: 'Hill orchards',
  },
  {
    name: 'Wild Strawberries',
    slug: 'wild-strawberries',
    description: 'Small, fragrant berries with a real perfume. Eat them the day they land.',
    details:
      'Packed in a shallow punnet so the bottom layer stays dry. Do not wash until you are ready to eat. They do not improve with time.',
    price: 7.5,
    unit: 'punnet',
    category: 'berries',
    image: img('photo-1464965911861-746a04b4bca6'),
    badge: 'Just picked',
    rating: 4.9,
    reviewCount: 203,
    stock: 24,
    featured: true,
    seasonal: true,
    origin: 'Upland fields',
  },
  {
    name: 'Blueberry Punnets',
    slug: 'blueberry-punnets',
    description: 'Dusty-blue berries with a snap. Sweet enough to skip the sugar.',
    details:
      'Look for the silvery bloom — that is a sign they were handled gently. Keep chilled and dry.',
    price: 6.4,
    unit: 'punnet',
    category: 'berries',
    image: img('photo-1498557850523-fd3d118b962e'),
    badge: '',
    rating: 4.7,
    reviewCount: 97,
    stock: 36,
    featured: true,
    seasonal: false,
    origin: 'Northern bogs',
  },
  {
    name: 'Raspberry Baskets',
    slug: 'raspberry-baskets',
    description: 'Tart, jewel-toned raspberries. Fragile, so we ship them on their own.',
    details:
      'Spread them on a towel if any look damp. They are perfect over yogurt or pressed into the berry blend.',
    price: 6.9,
    unit: 'basket',
    category: 'berries',
    image: img('photo-1577003833619-76bbd7f82948'),
    badge: '',
    rating: 4.8,
    reviewCount: 73,
    stock: 20,
    featured: false,
    seasonal: true,
    origin: 'Cane rows',
  },
  {
    name: 'Mixed Berry Bowl',
    slug: 'mixed-berry-bowl',
    description: 'Strawberries, blueberries, and raspberries packed for the week’s breakfasts.',
    details:
      'A house mix weighed to order. The berries are kept separate in the box so juices do not run together.',
    price: 12.5,
    unit: 'box',
    category: 'berries',
    image: img('photo-1596591606975-97ee5cef3a1e'),
    badge: 'Best seller',
    rating: 4.8,
    reviewCount: 164,
    stock: 22,
    featured: true,
    seasonal: false,
    origin: 'Grove market',
  },
  {
    name: 'Raw Almonds',
    slug: 'raw-almonds',
    description: 'Whole almonds, unsalted, with the brown skin left on.',
    details:
      'Stored in tins away from light. A short toast in a dry pan wakes up the oils if you like them warm.',
    price: 9.4,
    unit: 'bag',
    category: 'nuts',
    image: img('photo-1508061253366-f7da158b6d46'),
    badge: '',
    rating: 4.7,
    reviewCount: 61,
    stock: 50,
    featured: false,
    seasonal: false,
    origin: 'Dryland groves',
  },
  {
    name: 'Cashew Halves',
    slug: 'cashew-halves',
    description: 'Creamy halves, lightly dried, never fried.',
    details:
      'A 250g pouch. Reseal tightly — cashews pick up fridge smells faster than other nuts.',
    price: 11.2,
    unit: 'pouch',
    category: 'nuts',
    image: img('photo-1599599810769-bcde5a160d32'),
    badge: '',
    rating: 4.6,
    reviewCount: 44,
    stock: 28,
    featured: false,
    seasonal: false,
    origin: 'Tropical coast',
  },
  {
    name: 'Sicilian Pistachios',
    slug: 'sicilian-pistachios',
    description: 'Vivid green kernels with a deep, almost herbal sweetness.',
    details:
      'Shelled and sorted by hand. A little goes a long way over fruit or folded into yogurt.',
    price: 14.8,
    unit: 'tin',
    category: 'nuts',
    image: img('photo-1615485925763-86786288908a'),
    badge: 'Grove pick',
    rating: 4.9,
    reviewCount: 39,
    stock: 16,
    featured: true,
    seasonal: false,
    origin: 'Volcanic slopes',
  },
  {
    name: 'Toasted Hazelnuts',
    slug: 'toasted-hazelnuts',
    description: 'Rolled in a warm pan until the skins loosen and the centers smell like praline.',
    details:
      'We toast in small batches twice a week. Skins are rubbed off, not chemically removed.',
    price: 10.6,
    unit: 'bag',
    category: 'nuts',
    image: img('photo-1599599810694-b5b37304c041'),
    badge: '',
    rating: 4.5,
    reviewCount: 27,
    stock: 30,
    featured: false,
    seasonal: false,
    origin: 'Woodland farms',
  },
  {
    name: 'Morning Orange Press',
    slug: 'morning-orange-press',
    description: 'Navel oranges pressed before sunrise. Nothing added, not even ice.',
    details:
      '750ml glass bottle. Shake gently — the pulp settles. Drink within five days and keep cold.',
    price: 8.5,
    unit: 'bottle',
    category: 'pressed',
    image: img('photo-1600271886742-f049cd451bba'),
    badge: 'Pressed today',
    rating: 4.9,
    reviewCount: 188,
    stock: 26,
    featured: true,
    seasonal: true,
    origin: 'Grove press',
  },
  {
    name: 'Ginger Citrus Tonic',
    slug: 'ginger-citrus-tonic',
    description: 'Lemon, orange, and a bright hit of fresh ginger. Sharp, then warm.',
    details:
      '500ml. Ginger is juiced, not powdered. Expect a little spice at the finish.',
    price: 7.9,
    unit: 'bottle',
    category: 'pressed',
    image: img('photo-1621506289937-a8e4df240d0b'),
    badge: 'Seasonal',
    rating: 4.8,
    reviewCount: 92,
    stock: 20,
    featured: true,
    seasonal: true,
    origin: 'Grove press',
  },
  {
    name: 'Berry Morning Blend',
    slug: 'berry-morning-blend',
    description: 'Strawberry, blueberry, and a splash of lemon so the sweetness stays bright.',
    details:
      '500ml. Pulp included. The color is the fruit — we do not add concentrates.',
    price: 8.2,
    unit: 'bottle',
    category: 'pressed',
    image: img('photo-1557800636-894a64c1696f'),
    badge: '',
    rating: 4.7,
    reviewCount: 70,
    stock: 18,
    featured: false,
    seasonal: true,
    origin: 'Grove press',
  },
];
