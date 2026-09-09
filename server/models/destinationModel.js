import pool, { memoryStore, getIsMySqlAvailable } from "../config/database.js";

// Initial seed destinations for Ethiopia
export const SEED_DESTINATIONS = [
  {
    id: "lalibela",
    slug: "lalibela",
    name: "Lalibela",
    region: "Amhara",
    category: "Religious",
    tag: "UNESCO",
    level: "Easy",
    price_usd: 180,
    transport_cost_etb: 3500,
    accommodation_cost_etb: 3200,
    food_cost_etb: 900,
    activity_cost_etb: 2500,
    lat: 12.0316,
    lng: 39.0473,
    image_url: "https://images.unsplash.com/photo-1578922864835-e9b4661a5b8a?auto=format&fit=crop&w=1200&q=80",
    gallery_json: [
      "https://images.unsplash.com/photo-1578922864835-e9b4661a5b8a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    ],
    short_desc: "Eleven medieval rock-hewn churches carved downward into volcanic rock, still an active pilgrimage site.",
    description: "Known as the New Jerusalem, Lalibela is a high-mountain town in northern Ethiopia famous for its 11 monolithic and semi-monolithic churches carved directly out of solid volcanic basalt in the 12th and 13th centuries.",
    things_to_do_json: [
      "Visit the iconic cross-shaped Bete Giyorgis (Church of Saint George)",
      "Explore the Northern & Eastern Church Clusters linked by ancient tunnels",
      "Hike or ride mule to the high-altitude Asheton Maryam Monastery",
    ],
    best_season: "October to March",
    duration_days: "2 – 3 Days",
  },
  {
    id: "simien-mountains",
    slug: "simien-mountains",
    name: "Simien Mountains",
    region: "Amhara",
    category: "Nature & Wildlife",
    tag: "Trekking",
    level: "Challenging",
    price_usd: 240,
    transport_cost_etb: 4800,
    accommodation_cost_etb: 2800,
    food_cost_etb: 1100,
    activity_cost_etb: 3500,
    lat: 13.1833,
    lng: 38.0500,
    image_url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
    gallery_json: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
    ],
    short_desc: "Jagged escarpments, roaming gelada monkeys, and trekking routes above 4,000m.",
    description: "The Simien Mountains National Park is a UNESCO World Heritage site known as 'The Chessboard of the Gods', with massive precipices and home to endemic Gelada baboons and Walia ibex.",
    things_to_do_json: [
      "Trek along the escarpment from Sankaber to Geech camp",
      "Sit among friendly troops of bleeding-heart Gelada baboons",
      "Stand before the cascading Jinbar Waterfall into the abyss",
    ],
    best_season: "October to April",
    duration_days: "3 – 5 Days",
  },
  {
    id: "danakil-depression",
    slug: "danakil-depression",
    name: "Danakil Depression",
    region: "Afar",
    category: "Adventure",
    tag: "Extreme",
    level: "Extreme",
    price_usd: 320,
    transport_cost_etb: 6500,
    accommodation_cost_etb: 3500,
    food_cost_etb: 1400,
    activity_cost_etb: 4800,
    lat: 14.2417,
    lng: 40.3000,
    image_url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
    gallery_json: [
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
    ],
    short_desc: "Sulphur springs, salt flats, and an active lava lake — one of the hottest, lowest places on Earth.",
    description: "Located in the Afar Triangle, the Danakil Depression is one of the lowest and hottest places on Earth, featuring vibrant neon hydrothermal vents at Dallol and the glowing lava lake of Erta Ale.",
    things_to_do_json: [
      "Walk among the steaming neon-yellow and turquoise chimneys of Dallol",
      "Watch Afar camel caravans transport hand-cut salt slabs across Lake Assal",
      "Trek to the rim of Erta Ale and gaze into the glowing molten lava lake",
    ],
    best_season: "November to February",
    duration_days: "3 – 4 Days",
  },
  {
    id: "gondar",
    slug: "gondar",
    name: "Gondar",
    region: "Amhara",
    category: "Historical",
    tag: "UNESCO",
    level: "Easy",
    price_usd: 140,
    transport_cost_etb: 3200,
    accommodation_cost_etb: 2600,
    food_cost_etb: 850,
    activity_cost_etb: 1800,
    lat: 12.6030,
    lng: 37.4521,
    image_url: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80",
    gallery_json: [
      "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80",
    ],
    short_desc: "Royal castles and enclosures earning it the nickname 'Africa's Camelot'.",
    description: "Founded by Emperor Fasilides in 1636, Gondar served as Ethiopia's royal capital for over two centuries with grand stone castles and the angel-painted Debre Berhan Selassie church.",
    things_to_do_json: [
      "Tour the massive stone castles of Fasil Ghebbi royal enclosure",
      "Admire the iconic 80 angel faces ceiling at Debre Berhan Selassie",
      "Visit Fasilides' Bath",
    ],
    best_season: "September to May",
    duration_days: "1 – 2 Days",
  },
  {
    id: "bahir-dar",
    slug: "bahir-dar",
    name: "Bahir Dar",
    region: "Amhara",
    category: "Nature & Wildlife",
    tag: "Nature",
    level: "Easy",
    price_usd: 130,
    transport_cost_etb: 2800,
    accommodation_cost_etb: 2400,
    food_cost_etb: 800,
    activity_cost_etb: 2000,
    lat: 11.5936,
    lng: 37.3908,
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    gallery_json: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    ],
    short_desc: "Island monasteries on Ethiopia's largest lake and the thundering source of the Blue Nile.",
    description: "Bahir Dar is a beautiful lakeside city on Lake Tana, offering boat trips to ancient island monasteries and visits to the majestic Tis Issat (Blue Nile Falls).",
    things_to_do_json: [
      "Take a boat across Lake Tana to Zege Peninsula monasteries",
      "Hike to the viewpoint of Tis Issat (Blue Nile Falls)",
      "Watch local fishermen glide on traditional papyrus tankwa boats",
    ],
    best_season: "September to April",
    duration_days: "2 Days",
  },
  {
    id: "axum",
    slug: "axum",
    name: "Axum",
    region: "Tigray",
    category: "Historical",
    tag: "UNESCO",
    level: "Easy",
    price_usd: 150,
    transport_cost_etb: 4000,
    accommodation_cost_etb: 2500,
    food_cost_etb: 850,
    activity_cost_etb: 1900,
    lat: 14.1213,
    lng: 38.7269,
    image_url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
    gallery_json: [
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    ],
    short_desc: "Ancient obelisks and ruins of the Kingdom of Aksum, said to house the Ark of the Covenant.",
    description: "The ancient seat of the Aksumite Empire, known for colossal granite obelisks, the Queen of Sheba's bath, and the Chapel of the Tablet.",
    things_to_do_json: [
      "Stand beneath the 24-meter Great Stelae in the Northern Stelae Field",
      "Visit the Chapel of the Tablet at St. Mary of Zion Church",
      "Explore the archaeological ruins of Dungur",
    ],
    best_season: "October to April",
    duration_days: "1 – 2 Days",
  },
  {
    id: "harar",
    slug: "harar",
    name: "Harar Jugol",
    region: "Harari",
    category: "Cultural",
    tag: "UNESCO",
    level: "Easy",
    price_usd: 130,
    transport_cost_etb: 3000,
    accommodation_cost_etb: 2200,
    food_cost_etb: 800,
    activity_cost_etb: 1500,
    lat: 9.3131,
    lng: 42.1183,
    image_url: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80",
    gallery_json: [
      "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80",
    ],
    short_desc: "A walled Islamic city of 82 mosques, colourful alleyways, and the famous hyena feeding.",
    description: "Surrounded by a 16th-century wall with five historic gates, Harar is known for pastel alleys, traditional Harari homes, and the thrilling nightly hyena feeding ceremony.",
    things_to_do_json: [
      "Witness the thrilling nightly wild hyena feeding ceremony outside the walls",
      "Wander the colorful pastel alleys and traditional Harari cultural houses",
      "Visit the Arthur Rimbaud Cultural Center",
    ],
    best_season: "Year-round",
    duration_days: "2 Days",
  },
  {
    id: "bale-mountains",
    slug: "bale-mountains",
    name: "Bale Mountains",
    region: "Oromia",
    category: "Nature & Wildlife",
    tag: "Wildlife",
    level: "Moderate",
    price_usd: 210,
    transport_cost_etb: 4200,
    accommodation_cost_etb: 3000,
    food_cost_etb: 950,
    activity_cost_etb: 2800,
    lat: 6.8833,
    lng: 39.7500,
    image_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    gallery_json: [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    ],
    short_desc: "Afro-alpine highlands and the best chance on Earth to see the rare Ethiopian wolf.",
    description: "Bale Mountains National Park protects the largest Afro-alpine habitat in Africa, home to the rare red-coated Ethiopian wolf and misty Harenna Cloud Forest.",
    things_to_do_json: [
      "Spot the rare Ethiopian Wolf hunting on the windswept Sanetti Plateau",
      "Drive Africa's highest all-weather road across the Afro-alpine plateau",
      "Hike beneath moss-draped canopy trees in the Harenna Cloud Forest",
    ],
    best_season: "November to April",
    duration_days: "3 Days",
  },
  {
    id: "omo-valley",
    slug: "omo-valley",
    name: "Omo Valley",
    region: "South Ethiopia",
    category: "Cultural",
    tag: "Cultural",
    level: "Moderate",
    price_usd: 260,
    transport_cost_etb: 5500,
    accommodation_cost_etb: 3200,
    food_cost_etb: 1100,
    activity_cost_etb: 4000,
    lat: 5.9333,
    lng: 36.5667,
    image_url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
    gallery_json: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
    ],
    short_desc: "Home to more than a dozen distinct indigenous communities and centuries-old traditions.",
    description: "A cultural tapestry of indigenous tribes including Mursi, Hamer, Karo, and Dassanech preserving unique cultural ceremonies, body ornamentation, and market traditions.",
    things_to_do_json: [
      "Visit traditional Mursi and Hamer homestead villages with local cultural guides",
      "Attend an authentic Hamer Bull Jumping initiation ceremony",
      "Cross the Omo River in a wooden dugout canoe",
    ],
    best_season: "June to September & Dec to March",
    duration_days: "4 – 6 Days",
  },
  {
    id: "hawassa",
    slug: "hawassa",
    name: "Hawassa",
    region: "Sidama",
    category: "Nature & Wildlife",
    tag: "Lakeside",
    level: "Easy",
    price_usd: 110,
    transport_cost_etb: 2000,
    accommodation_cost_etb: 2200,
    food_cost_etb: 750,
    activity_cost_etb: 1200,
    lat: 7.0504,
    lng: 38.4763,
    image_url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
    gallery_json: [
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    ],
    short_desc: "Vibrant Rift Valley city with lakeside promenades, famous fish market and birdlife.",
    description: "A peaceful lakeside resort city known for its scenic shoreline promenade, morning Amora Gedel fish market, aquatic birds, and Colobus monkeys.",
    things_to_do_json: [
      "Experience the bustling Amora Gedel morning fish market and try fresh fish",
      "Boat ride on Lake Hawassa to spot pods of hippos and aquatic birds",
      "Stroll through lakeside parks inhabited by Colobus monkeys",
    ],
    best_season: "Year-round",
    duration_days: "1 – 2 Days",
  },
  {
    id: "arba-minch",
    slug: "arba-minch",
    name: "Arba Minch & Nechisar",
    region: "South Ethiopia",
    category: "Nature & Wildlife",
    tag: "Safari",
    level: "Moderate",
    price_usd: 175,
    transport_cost_etb: 3400,
    accommodation_cost_etb: 2600,
    food_cost_etb: 850,
    activity_cost_etb: 2200,
    lat: 6.0333,
    lng: 37.5500,
    image_url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
    gallery_json: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
    ],
    short_desc: "Forty springs, Lake Chamo's giant crocodile market, and Dorze elephant-shaped houses.",
    description: "Set between Lake Abaya and Lake Chamo, Arba Minch features giant Nile crocodiles, savannah plains of Nechisar National Park, and Dorze woven bamboo huts in Chencha.",
    things_to_do_json: [
      "Boat safari on Lake Chamo to see the massive Nile crocodile market",
      "Visit Chencha highland village to see Dorze bamboo architecture",
      "Explore the 40 natural springs forest trail",
    ],
    best_season: "October to April",
    duration_days: "2 – 3 Days",
  },
  {
    id: "addis-ababa",
    slug: "addis-ababa",
    name: "Addis Ababa",
    region: "Addis Ababa",
    category: "Cultural",
    tag: "Capital",
    level: "Easy",
    price_usd: 95,
    transport_cost_etb: 1200,
    accommodation_cost_etb: 3500,
    food_cost_etb: 1000,
    activity_cost_etb: 1500,
    lat: 9.0320,
    lng: 38.7469,
    image_url: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80",
    gallery_json: [
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80",
    ],
    short_desc: "Ethiopia's vibrant capital, home to 3.2-million-year-old Lucy, Merkato, and Entoto Park.",
    description: "The diplomatic capital of Africa, featuring Lucy at the National Museum, panoramic Mount Entoto Park, Africa's largest open-air market Merkato, and Unity Park.",
    things_to_do_json: [
      "Meet 3.2-million-year-old fossil Lucy at the National Museum",
      "Enjoy panoramic sunset views of the metropolis from Mount Entoto Park",
      "Explore the vast Merkato open-air marketplace",
      "Tour Unity Park within the historic Grand Palace",
    ],
    best_season: "Year-round",
    duration_days: "1 – 2 Days",
  },
];

// Initialize memory store with seed destinations
memoryStore.destinations = [...SEED_DESTINATIONS];

/**
 * Get all destinations with optional filter & search
 */
export async function getAllDestinations({ query, region, category, maxPrice } = {}) {
  let list = [...memoryStore.destinations];

  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    list = list.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.short_desc.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
    );
  }

  if (region && region !== "All Regions") {
    list = list.filter((d) => d.region.toLowerCase() === region.toLowerCase());
  }

  if (category && category !== "All") {
    list = list.filter((d) => d.category.toLowerCase() === category.toLowerCase());
  }

  if (maxPrice) {
    list = list.filter((d) => Number(d.price_usd) <= Number(maxPrice));
  }

  return list;
}

/**
 * Find destination by ID or slug
 */
export async function getDestinationById(idOrSlug) {
  if (!idOrSlug) return null;
  const key = idOrSlug.toLowerCase().trim();
  const dest = memoryStore.destinations.find(
    (d) => d.id.toLowerCase() === key || d.slug.toLowerCase() === key
  );
  return dest || null;
}

/**
 * Create or update destination (Admin)
 */
export async function upsertDestination(data) {
  const existingIdx = memoryStore.destinations.findIndex(
    (d) => d.id.toLowerCase() === data.id?.toLowerCase() || d.slug?.toLowerCase() === data.slug?.toLowerCase()
  );

  const destObj = {
    ...data,
    id: data.id || data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    slug: data.slug || data.id || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    updated_at: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    memoryStore.destinations[existingIdx] = {
      ...memoryStore.destinations[existingIdx],
      ...destObj,
    };
    return memoryStore.destinations[existingIdx];
  } else {
    destObj.created_at = new Date().toISOString();
    memoryStore.destinations.push(destObj);
    return destObj;
  }
}

/**
 * Delete destination (Admin)
 */
export async function deleteDestination(idOrSlug) {
  const key = idOrSlug.toLowerCase().trim();
  const index = memoryStore.destinations.findIndex(
    (d) => d.id.toLowerCase() === key || d.slug.toLowerCase() === key
  );
  if (index >= 0) {
    const deleted = memoryStore.destinations.splice(index, 1)[0];
    return deleted;
  }
  return null;
}

export default {
  getAllDestinations,
  getDestinationById,
  upsertDestination,
  deleteDestination,
};
