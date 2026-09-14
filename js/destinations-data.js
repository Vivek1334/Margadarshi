import { INDIAN_STATES_REGISTRY } from "./services/indian-states-data.js";
// Global Destinations and Famous Places Data with Audio Phrasebook

export const DESTINATIONS = [
  {
    id: "kyoto-japan",
    name: "Kyoto",
    country: "Japan",
    continent: "Asia",
    tagline: "The Ancient Heart of Millennial Japanese Culture",
    summary: "Famed for its thousands of classical Buddhist temples, gardens, imperial palaces, traditional wooden machiya houses, and geisha culture in the Gion district.",
    fullDescription: "Kyoto served as Japan's imperial capital for over a millennium. Nestled in a scenic basin surrounded by verdant mountains, it preserves an extraordinary cultural heritage spanning 17 UNESCO World Heritage sites. From the ethereal morning mist over the Arashiyama bamboo forest to serene rock gardens and vibrant seasonal cherry blossoms or autumn foliage, Kyoto is a captivating tapestry of tranquility and living tradition.",
    coordinates: { lat: 35.0116, lng: 135.7681 },
    heroImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
    imageKeywords: ["kyoto japan temple", "bamboo grove arashiyama", "fushimi inari"],
    region: "Kansai",
    vibes: ["Cultural", "Romantic", "Foodie", "Spiritual"],
    budget: "$$", // Moderate
    budgetDailyEstimate: 110, // in USD
    currency: "JPY (¥)",
    language: "Japanese",
    bestTimeToVisit: "March–May (Cherry Blossoms) & Oct–Nov (Autumn Foliage)",
    idealDuration: "4 to 6 days",
    safetyRating: "5/5 (Very High)",
    timeZone: "GMT+9",
    localCuisine: [
      "Kaiseki Ryori (Traditional multi-course dinner)",
      "Yudofu (Simmered silky tofu)",
      "Matcha Parfait & Uji Green Tea",
      "Kyoto-style Ramen (Rich pork broth with back fat)"
    ],
    travelTips: [
      "Purchase an ICOCA IC card for seamless bus and train journeys.",
      "Always respect Gion photography restrictions around working geiko and maiko.",
      "Visit Fushimi Inari at sunrise (around 6:30 AM) to experience the torii gates in mystical silence."
    ],
    localPhrases: [
      { phrase: "Arigatou gozaimasu", native: "ありがとうございます", english: "Thank you very much", phonetic: "ah-ree-GAH-toh go-ZYE-mahs", lang: "ja-JP" },
      { phrase: "Sumimasen", native: "すみません", english: "Excuse me / Sorry", phonetic: "soo-mee-mah-SEN", lang: "ja-JP" },
      { phrase: "Kore wa ikura desu ka?", native: "これはいくらですか？", english: "How much is this?", phonetic: "koh-reh wah ee-koo-rah dess kah", lang: "ja-JP" },
      { phrase: "Oishii desu!", native: "美味しいです！", english: "This is delicious!", phonetic: "oy-shee dess", lang: "ja-JP" }
    ],
    famousPlaces: [
      {
        id: "fushimi-inari",
        name: "Fushimi Inari Taisha",
        category: "Spiritual & Shrine",
        wikiTitle: "Fushimi_Inari-taisha",
        image: "./assets/images/landmarks/fushimi_inari.jpg",
        description: "An iconic shrine dedicated to the Shinto god of rice and commerce, famed for over 10,000 vivid vermilion torii gates winding up the sacred Mount Inari.",
        whyVisit: "One of the most photogenic and spiritual hiking experiences on earth.",
        insiderTip: "Most tourists turn back at the first crossroads. Continue past the Yotsutsuji intersection for panoramic views of Kyoto without the crowds.",
        estimatedTime: "2.5 – 3.5 hours",
        entryCost: "Free admission",
        rating: 4.9,
        reviewsCount: 68400,
        coordinates: { lat: 34.9671, lng: 135.7727 }
      },
      {
        id: "arashiyama-bamboo",
        name: "Arashiyama Bamboo Grove",
        category: "Natural Wonder",
        wikiTitle: "Arashiyama",
        image: "./assets/images/landmarks/arashiyama_bamboo_grove.jpg",
        description: "A breathtaking natural corridor of towering green bamboo stalks that whisper and sway in the mountain breeze.",
        whyVisit: "Designated as one of the '100 Soundscapes of Japan' by the Ministry of the Environment.",
        insiderTip: "Pair with a visit to the neighboring Tenryu-ji Zen temple gardens and the picturesque Togetsukyo Bridge.",
        estimatedTime: "1 – 2 hours",
        entryCost: "Free (Tenryu-ji garden: ¥500)",
        rating: 4.8,
        reviewsCount: 52100,
        coordinates: { lat: 35.0167, lng: 135.6713 }
      },
      {
        id: "kinkaku-ji",
        name: "Kinkaku-ji (The Golden Pavilion)",
        category: "Historic Architecture",
        wikiTitle: "Kinkaku-ji",
        image: "./assets/images/landmarks/kinkaku_ji_the_golden_pavilion.jpg",
        description: "A Zen temple whose top two floors are completely draped in dazzling gold leaf, reflected magically in the surrounding Mirror Pond.",
        whyVisit: "A stunning embodiment of Muromachi period garden design and architectural elegance.",
        insiderTip: "Best photographed around midday when sunlight directly illuminates the golden leaf gilding.",
        estimatedTime: "1 – 1.5 hours",
        entryCost: "¥500 (~$3.50)",
        rating: 4.7,
        reviewsCount: 45900,
        coordinates: { lat: 35.0394, lng: 135.7292 }
      },
      {
        id: "gion-district",
        name: "Gion & Hanami-koji Historic Quarter",
        category: "Cultural District",
        wikiTitle: "Gion",
        image: "./assets/images/landmarks/gion_hanami_koji_historic_quarter.jpg",
        description: "Kyoto's legendary entertainment district featuring 17th-century preserved wooden tea houses, exclusive ochaya, and lantern-lit stone alleyways.",
        whyVisit: "Step back in time to the golden age of traditional Japanese hospitality and arts.",
        insiderTip: "Stroll along the Shirakawa canal at twilight when lanterns glow over weeping willows and wooden bridges.",
        estimatedTime: "2 – 3 hours",
        entryCost: "Free to explore",
        rating: 4.8,
        reviewsCount: 39800,
        coordinates: { lat: 35.0037, lng: 135.7772 }
      }
    ]
  },
  {
    id: "paris-france",
    name: "Paris",
    country: "France",
    continent: "Europe",
    tagline: "The City of Light, Art, and Eternal Romance",
    summary: "A global hub for art, fashion, gastronomy, and culture, celebrated for its Hausmannian boulevards, iconic monuments, world-class museums, and riverside cafés.",
    fullDescription: "Paris is an open-air museum where every bridge over the Seine tells a story. From the soaring iron silhouette of the Eiffel Tower to the bohemian alleys of Montmartre and the sprawling treasures of the Louvre, the French capital balances grandeur with intimate bistro life. Stroll through the Luxembourg Gardens, savor fresh croissants, and experience the timeless allure of the city.",
    coordinates: { lat: 48.8566, lng: 2.3522 },
    heroImage: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1600&q=80",
    imageKeywords: ["paris france eiffel", "louvre museum", "montmartre"],
    region: "Île-de-France",
    vibes: ["Romantic", "Cultural", "Foodie", "Urban & Modern"],
    budget: "$$$",
    budgetDailyEstimate: 160,
    currency: "EUR (€)",
    language: "French",
    bestTimeToVisit: "April–June & September–October",
    idealDuration: "4 to 7 days",
    safetyRating: "4.5/5 (High)",
    timeZone: "GMT+1 (CET)",
    localCuisine: [
      "Fresh Butter Croissants & Baguettes",
      "Duck Confit with Sarladaise Potatoes",
      "Boeuf Bourguignon",
      "Artisan Macarons & Crème Brûlée"
    ],
    travelTips: [
      "Book Louvre and Eiffel Tower summit tickets online weeks in advance.",
      "Greet shopkeepers with 'Bonjour Madame/Monsieur' when entering establishments.",
      "Download the Île-de-France Mobilités app for easy metro tap-to-pay."
    ],
    localPhrases: [
      { phrase: "Bonjour, s'il vous plaît", english: "Hello, please", phonetic: "bohn-zhoor seel voo pleh", lang: "fr-FR" },
      { phrase: "Merci beaucoup", english: "Thank you very much", phonetic: "mair-see boh-koo", lang: "fr-FR" },
      { phrase: "L'addition, s'il vous plaît", english: "The check, please", phonetic: "lah-dee-syohn seel voo pleh", lang: "fr-FR" },
      { phrase: "Où sont les toilettes?", english: "Where is the restroom?", phonetic: "oo sohn lay twah-let", lang: "fr-FR" }
    ],
    famousPlaces: [
      {
        id: "eiffel-tower",
        name: "Eiffel Tower & Champ de Mars",
        category: "Iconic Monument",
        wikiTitle: "Eiffel_Tower",
        image: "./assets/images/landmarks/eiffel_tower_champ_de_mars.jpg",
        description: "Gustave Eiffel's 330-meter wrought-iron masterpiece that has defined Paris's skyline since the 1889 World's Fair.",
        whyVisit: "The world's most recognized architectural icon offering sweeping vistas across all of Paris.",
        insiderTip: "Catch the sparkling illumination on the hour every evening starting at nightfall.",
        estimatedTime: "2 – 3 hours",
        entryCost: "€18 – €35",
        rating: 4.8,
        reviewsCount: 142000,
        coordinates: { lat: 48.8584, lng: 2.2945 }
      },
      {
        id: "louvre-museum",
        name: "Musée du Louvre",
        category: "Art & Museum",
        wikiTitle: "Louvre",
        image: "./assets/images/landmarks/mus_e_du_louvre.jpg",
        description: "The world's largest art museum, housed in a magnificent former royal palace fronted by I.M. Pei's futuristic glass pyramid.",
        whyVisit: "Home to the Mona Lisa, Winged Victory of Samothrace, and Venus de Milo among 35,000 masterpieces.",
        insiderTip: "Enter through the Carrousel du Louvre underground mall entrance rather than the main glass pyramid queue.",
        estimatedTime: "3.5 – 5 hours",
        entryCost: "€22",
        rating: 4.8,
        reviewsCount: 118000,
        coordinates: { lat: 48.8606, lng: 2.3376 }
      },
      {
        id: "montmartre-sacre-coeur",
        name: "Montmartre & Basilique du Sacré-Cœur",
        category: "Historic Neighborhood",
        wikiTitle: "Sacré-Cœur,_Paris",
        image: "./assets/images/landmarks/montmartre_basilique_du_sacr_c_ur.jpg",
        description: "A hilltop bohemian village crowned by the romano-byzantine white dome of Sacré-Cœur, offering panoramic views over the Parisian basin.",
        whyVisit: "Historic enclave where Picasso, Monet, and Van Gogh lived and painted.",
        insiderTip: "Wander the quieter rear streets such as Rue de l'Abreuvoir and visit the Montmartre Vineyard.",
        estimatedTime: "2.5 – 3 hours",
        entryCost: "Basilica: Free (Dome: €7)",
        rating: 4.7,
        reviewsCount: 88500,
        coordinates: { lat: 48.8867, lng: 2.3431 }
      },
      {
        id: "notre-dame-seine",
        name: "Notre-Dame Cathedral & Seine Banks",
        category: "Gothic Heritage",
        wikiTitle: "Notre-Dame_de_Paris",
        image: "./assets/images/landmarks/notre_dame_cathedral_seine_banks.jpg",
        description: "The crown jewel of French Gothic architecture on the Île de la Cité, lovingly restored with its soaring rose windows and flying buttresses.",
        whyVisit: "The spiritual heart of Paris, framed by riverside bouquinistes and historic bridges.",
        insiderTip: "Take a scenic sunset river cruise on the Vedettes du Pont Neuf for magical river-level angles.",
        estimatedTime: "1.5 – 2.5 hours",
        entryCost: "Free to admire from plaza / river",
        rating: 4.8,
        reviewsCount: 95400,
        coordinates: { lat: 48.8530, lng: 2.3499 }
      }
    ]
  },
  {
    id: "cape-town-south-africa",
    name: "Cape Town",
    country: "South Africa",
    continent: "Africa",
    tagline: "Where Dramatic Mountains Meet Atlantic and Indian Oceans",
    summary: "A coastal powerhouse framed by the flat-topped Table Mountain, dramatic cliffside drives, golden beaches, African penguin colonies, and world-renowned vineyards.",
    fullDescription: "Cape Town is one of the most visually spectacular cities on the planet. Perched on the southern tip of the African continent, it seamlessly combines raw rugged nature with cutting-edge design, cosmopolitan dining, and rich cultural history. Whether riding the rotating aerial cableway to Table Mountain or wine-tasting in Constantia, the Mother City never fails to enchant.",
    coordinates: { lat: -33.9249, lng: 18.4241 },
    heroImage: "./assets/images/capetown_hero.jpg",
    imageKeywords: ["cape town table mountain", "cape point ocean", "boulders beach penguins"],
    region: "Western Cape",
    vibes: ["Adventure", "Beach", "Mountain & Nature", "Foodie"],
    budget: "$$",
    budgetDailyEstimate: 85,
    currency: "ZAR (R)",
    language: "English, Afrikaans, Xhosa",
    bestTimeToVisit: "November–March (Summer & Beach season)",
    idealDuration: "5 to 8 days",
    safetyRating: "3.8/5 (Moderate - practice urban awareness)",
    timeZone: "GMT+2",
    localCuisine: [
      "Cape Malay Bobotie (Spiced minced meat with savory custard)",
      "Braai (Authentic South African BBQ)",
      "Fresh Atlantic Snoek & Seafood Platters",
      "Malva Pudding with Warm Custard"
    ],
    travelTips: [
      "Book Table Mountain cableway tickets with flexible weather dates, as high winds cause closures.",
      "Uber is reliable, safe, and very affordable across central Cape Town and the Atlantic Seaboard.",
      "Drive the Chapman's Peak toll road during golden hour for one of the world's greatest scenic routes."
    ],
    localPhrases: [
      { phrase: "Howzit!", english: "Hello / How are you?", phonetic: "HOW-zit", lang: "en-ZA" },
      { phrase: "Baie dankie", english: "Thank you very much (Afrikaans)", phonetic: "BUY-uh DAHN-kee", lang: "af-ZA" },
      { phrase: "Enkosi kakhulu", english: "Thank you very much (Xhosa)", phonetic: "en-KOH-see kah-KOO-loo", lang: "xh-ZA" },
      { phrase: "Lekker!", english: "Great / Awesome / Delicious", phonetic: "LEK-er", lang: "af-ZA" }
    ],
    famousPlaces: [
      {
        id: "table-mountain",
        name: "Table Mountain & Aerial Cableway",
        category: "Natural Wonder",
        wikiTitle: "Table_Mountain",
        image: "./assets/images/table_mountain.jpg",
        description: "A prominent flat-topped plateau rising 1,086 meters above sea level, one of the official New 7 Wonders of Nature.",
        whyVisit: "Unmatched 360-degree views of Cape Town, Lion's Head, and the vast Atlantic coastline.",
        insiderTip: "If you love hiking, trek up Platteklip Gorge in the early morning and take the revolving cableway down.",
        estimatedTime: "3 – 4 hours",
        entryCost: "Cableway return: ~R420 ($23)",
        rating: 4.9,
        reviewsCount: 51200,
        coordinates: { lat: -33.9628, lng: 18.4098 }
      },
      {
        id: "boulders-beach",
        name: "Boulders Beach Penguin Colony",
        category: "Wildlife Sanctuary",
        wikiTitle: "Boulders_Beach",
        image: "./assets/images/boulders_beach.jpg",
        description: "A sheltered white-sand bay filled with massive granite boulders, home to a wild breeding colony of over 2,500 African penguins.",
        whyVisit: "One of the few spots on earth where you can observe wild penguins at arm's length from wooden boardwalks.",
        insiderTip: "Visit the adjacent Foxy Beach boardwalk for the densest penguin views, then swim at Middle Beach.",
        estimatedTime: "2 hours",
        entryCost: "R190 (~$10.50)",
        rating: 4.8,
        reviewsCount: 38900,
        coordinates: { lat: -34.1972, lng: 18.4513 }
      },
      {
        id: "cape-point-good-hope",
        name: "Cape Point & Cape of Good Hope",
        category: "Scenic Coastline",
        wikiTitle: "Cape_Point",
        image: "./assets/images/cape_point.jpg",
        description: "The rugged, windswept southwesternmost tip of the African continent within the Table Mountain National Park marine reserve.",
        whyVisit: "Towering sea cliffs, rolling fynbos wilderness, and shipwreck trails overlooking roaring ocean currents.",
        insiderTip: "Take the Flying Dutchman Funicular to the historic lighthouse, then hike down to the scenic Dias Beach.",
        estimatedTime: "3.5 – 5 hours",
        entryCost: "Park entry: R400 (~$22)",
        rating: 4.9,
        reviewsCount: 42100,
        coordinates: { lat: -34.3568, lng: 18.4967 }
      },
      {
        id: "kirstenbosch-gardens",
        name: "Kirstenbosch National Botanical Garden",
        category: "Botanical Garden",
        wikiTitle: "Kirstenbosch_National_Botanical_Garden",
        image: "./assets/images/kirstenbosch.jpg",
        description: "Acclaimed as one of the great botanical gardens of the world, nestled against the eastern slopes of Table Mountain, featuring the famous Boomslang canopy walkway.",
        whyVisit: "Walk above the tree tops on a curved steel-and-timber bridge while admiring rare indigenous Cape flora.",
        insiderTip: "Pack a picnic blanket; on summer Sunday evenings, the gardens host open-air sunset concerts.",
        estimatedTime: "2.5 – 3.5 hours",
        entryCost: "R220 (~$12)",
        rating: 4.8,
        reviewsCount: 34600,
        coordinates: { lat: -33.9877, lng: 18.4326 }
      }
    ]
  },
  {
    id: "tokyo-japan",
    name: "Tokyo",
    country: "Japan",
    continent: "Asia",
    tagline: "The Futuristic Metropolis Pulsing with Ancient Soul",
    summary: "Where neon skyscrapers and robot cafes meet quiet Shinto shrines, Michelin-starred back-alley ramen bars, and bustling anime districts.",
    fullDescription: "Tokyo is the world's most populous metropolitan area, yet it operates with immaculate precision and courtesy. From the organized chaos of Shibuya Crossing to the timeless spirituality of Senso-ji temple, Tokyo offers an electrifying juxtaposition of ultra-modern innovation and deeply revered heritage.",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    heroImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80",
    imageKeywords: ["tokyo shibuya neon", "sensoji temple tokyo", "shinjuku skyline"],
    region: "Kanto",
    vibes: ["Urban & Modern", "Foodie", "Cultural"],
    budget: "$$",
    budgetDailyEstimate: 125,
    currency: "JPY (¥)",
    language: "Japanese",
    bestTimeToVisit: "March–May & September–November",
    idealDuration: "5 to 8 days",
    safetyRating: "5/5 (Exceptional)",
    timeZone: "GMT+9",
    localCuisine: [
      "Edomae Sushi (Crafted by master itamae)",
      "Tonkotsu & Shoyu Ramen",
      "Yakitori Skewers in Omoide Yokocho",
      "Fresh Tempura & Matcha Sweets"
    ],
    travelTips: [
      "Rent a pocket Wi-Fi or activate an e-SIM before arriving for seamless navigation.",
      "Get a Suica or Pasmo digital transit pass on Apple Wallet / Google Wallet.",
      "Tipping in Japan is not practiced and may cause confusion."
    ],
    localPhrases: [
      { phrase: "Konnichiwa", english: "Hello / Good day", phonetic: "kohn-nee-chee-wah", lang: "ja-JP" },
      { phrase: "Eigo ga hanasemasu ka?", english: "Do you speak English?", phonetic: "ay-goh gah hah-nah-seh-mass kah", lang: "ja-JP" },
      { phrase: "Okaikei onegaishimasu", english: "Check please", phonetic: "oh-kye-kay oh-neh-guy-she-mahs", lang: "ja-JP" },
      { phrase: "Tasuke te kudasai", english: "Please help me", phonetic: "tah-soo-keh teh koo-dah-sye", lang: "ja-JP" }
    ],
    famousPlaces: [
      {
        id: "shibuya-crossing",
        name: "Shibuya Crossing & Hachiko Plaza",
        category: "Urban Landmark",
        wikiTitle: "Shibuya_Crossing",
        image: "./assets/images/landmarks/shibuya_crossing_hachiko_plaza.jpg",
        description: "The world's busiest pedestrian scramble intersection, where up to 3,000 people cross simultaneously on a single green light.",
        whyVisit: "The quintessential pulsating heartbeat of modern urban Tokyo.",
        insiderTip: "Head to the Shibuya Sky rooftop observation deck for an astonishing 360-degree top-down perspective.",
        estimatedTime: "1.5 – 2 hours",
        entryCost: "Free (Shibuya Sky: ¥2,200)",
        rating: 4.8,
        reviewsCount: 92400,
        coordinates: { lat: 35.6595, lng: 139.7005 }
      },
      {
        id: "senso-ji",
        name: "Senso-ji Temple & Nakamise Street",
        category: "Ancient Temple",
        wikiTitle: "Sensō-ji",
        image: "./assets/images/landmarks/senso_ji_temple_nakamise_street.jpg",
        description: "Tokyo's oldest and most significant Buddhist temple, founded in 645 AD, approached via the colossal Kaminarimon (Thunder Gate).",
        whyVisit: "Immerse in ancient Tokyo tradition and sample authentic street snacks along the 250-meter temple market street.",
        insiderTip: "Return after sunset when the temple structures and 5-story pagoda are illuminated and serenely quiet.",
        estimatedTime: "2 – 3 hours",
        entryCost: "Free admission",
        rating: 4.8,
        reviewsCount: 84000,
        coordinates: { lat: 35.7148, lng: 139.7967 }
      },
      {
        id: "shinjuku-gyoen",
        name: "Shinjuku Gyoen National Garden",
        category: "Imperial Park",
        wikiTitle: "Shinjuku_Gyoen",
        image: "./assets/images/landmarks/shinjuku_gyoen.jpg",
        description: "A tranquil 144-acre oasis blending traditional Japanese landscape gardening, formal French gardens, and English landscape lawns.",
        whyVisit: "A peaceful sanctuary right in the middle of Tokyo's neon skyscraper district.",
        insiderTip: "Alcohol is strictly prohibited, keeping the park exceptionally serene and family-friendly.",
        estimatedTime: "2 – 3 hours",
        entryCost: "¥500 (~$3.50)",
        rating: 4.8,
        reviewsCount: 46800,
        coordinates: { lat: 35.6852, lng: 139.7101 }
      },
      {
        id: "meiji-jingu",
        name: "Meiji Jingu Shrine & Forest",
        category: "Shinto Shrine",
        wikiTitle: "Meiji_Shrine",
        image: "./assets/images/landmarks/meiji_jingu_shrine_forest.jpg",
        description: "A grand Shinto shrine dedicated to Emperor Meiji, enveloped by a handcrafted sacred evergreen forest of 100,000 trees.",
        whyVisit: "Cross under towering 12-meter cedar Torii gates into peaceful forest paths directly adjacent to bustling Harajuku.",
        insiderTip: "Check out the decorative wall of consecrated sake barrels donated by wineries and breweries.",
        estimatedTime: "1.5 – 2 hours",
        entryCost: "Free",
        rating: 4.8,
        reviewsCount: 57200,
        coordinates: { lat: 35.6764, lng: 139.6993 }
      }
    ]
  },
  {
    id: "new-york-city-usa",
    name: "New York City",
    country: "United States",
    continent: "North America",
    tagline: "The Cultural Capital That Never Sleeps",
    summary: "An iconic urban powerhouse of five boroughs, celebrated for Broadway theater, world-defining skyline, Central Park, and incomparable global food.",
    fullDescription: "From the bright lights of Broadway and soaring heights of the Empire State Building to the leafy streets of Greenwich Village and art galleries of Chelsea, New York City generates an intoxicating energy. Every block feels like a film set, backed by a world-class melting pot of cultures, artistic expression, and architectural grandeur.",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    heroImage: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=80",
    imageKeywords: ["new york skyline manhattan", "central park nyc", "brooklyn bridge sunset"],
    region: "New York State",
    vibes: ["Urban & Modern", "Cultural", "Foodie"],
    budget: "$$$",
    budgetDailyEstimate: 220,
    currency: "USD ($)",
    language: "English",
    bestTimeToVisit: "April–June & September–November",
    idealDuration: "4 to 7 days",
    safetyRating: "4.4/5 (High)",
    timeZone: "GMT-5 (EST)",
    localCuisine: [
      "Classic New York Thin-Crust Pizza",
      "Pastrami on Rye from Katz's Delicatessen",
      "Fresh Kettle-Boiled Bagel with Lox & Schmear",
      "Junior's New York Style Cheesecake"
    ],
    travelTips: [
      "Use contactless credit cards (OMNY) directly at subway turnstiles.",
      "Walk the High Line park starting from Hudson Yards down to the Meatpacking District.",
      "Take the free Staten Island Ferry for stunning views of the Statue of Liberty."
    ],
    localPhrases: [
      { phrase: "How's it going?", english: "Everyday greeting", phonetic: "howz-it-goh-ing", lang: "en-US" },
      { phrase: "Where's the nearest subway?", english: "Transit direction", phonetic: "sub-way", lang: "en-US" },
      { phrase: "Can I get a slice to go?", english: "Ordering NY pizza", phonetic: "to-goh", lang: "en-US" },
      { phrase: "Keep the change, thank you!", english: "Tipping courtesy", phonetic: "chaynj", lang: "en-US" }
    ],
    famousPlaces: [
      {
        id: "central-park",
        name: "Central Park & Bethesda Terrace",
        category: "Urban Park",
        wikiTitle: "Central_Park",
        image: "./assets/images/landmarks/central_park_bethesda_terrace.jpg",
        description: "An 843-acre masterpiece of landscape architecture in the center of Manhattan, featuring meadows, lakes, castles, and wooded paths.",
        whyVisit: "The green sanctuary of NYC offering rowboating on The Lake and relaxing beneath majestic elm trees.",
        insiderTip: "Rent a classic wooden rowboat at the Loeb Boathouse for $25/hour for iconic skyline reflections.",
        estimatedTime: "2 – 4 hours",
        entryCost: "Free",
        rating: 4.9,
        reviewsCount: 156000,
        coordinates: { lat: 40.7851, lng: -73.9683 }
      },
      {
        id: "brooklyn-bridge",
        name: "Brooklyn Bridge & DUMBO",
        category: "Architectural Icon",
        wikiTitle: "Brooklyn_Bridge",
        image: "./assets/images/landmarks/brooklyn_bridge_dumbo.jpg",
        description: "A neo-Gothic suspension bridge completed in 1883, spanning the East River to connect Manhattan with Brooklyn.",
        whyVisit: "Walking across its elevated wooden boardwalk provides legendary skyline panoramas.",
        insiderTip: "Walk from Brooklyn toward Manhattan in late afternoon to watch the setting sun cast golden hues on lower Manhattan.",
        estimatedTime: "1.5 – 2.5 hours",
        entryCost: "Free",
        rating: 4.8,
        reviewsCount: 112000,
        coordinates: { lat: 40.7061, lng: -73.9969 }
      },
      {
        id: "empire-state-building",
        name: "Empire State Building Observatory",
        category: "Skyscraper Observatory",
        wikiTitle: "Empire_State_Building",
        image: "./assets/images/landmarks/empire_state_building_observatory.jpg",
        description: "The world's most famous Art Deco skyscraper, towering 102 stories over Midtown Manhattan.",
        whyVisit: "The 86th-floor open-air observatory gives breathtaking 360-degree vistas across up to six US states.",
        insiderTip: "Reserve morning sunrise or late night (after 10 PM) time slots to avoid heavy mid-day lines.",
        estimatedTime: "2 hours",
        entryCost: "$44 – $79",
        rating: 4.7,
        reviewsCount: 98000,
        coordinates: { lat: 40.7484, lng: -73.9857 }
      },
      {
        id: "met-museum",
        name: "The Metropolitan Museum of Art (The Met)",
        category: "World Art Museum",
        wikiTitle: "Metropolitan_Museum_of_Art",
        image: "./assets/images/landmarks/the_met.jpg",
        description: "One of the world's greatest art institutions, spanning 5,000 years of human creativity from Ancient Egypt to modern American sculpture.",
        whyVisit: "Marvel at the monumental Temple of Dendur in its glass pavilion and European masters like Rembrandt and Monet.",
        insiderTip: "Head to the Cantor Roof Garden (open May–October) for drinks with panoramic Central Park views.",
        estimatedTime: "3 – 5 hours",
        entryCost: "$30",
        rating: 4.9,
        reviewsCount: 104000,
        coordinates: { lat: 40.7794, lng: -73.9632 }
      }
    ]
  },
  {
    id: "rome-italy",
    name: "Rome",
    country: "Italy",
    continent: "Europe",
    tagline: "The Eternal City of Emperors, Piazzas, and Dolce Vita",
    summary: "Over 2,800 years of living history where ancient Roman ruins sit alongside Renaissance palazzos, bubbling fountains, and lively trattorias.",
    fullDescription: "Rome is an intoxicating sensory feast. Walking through Rome feels like navigating an open-air amphitheater where the ancient Colosseum stands just steps from espresso bars and lively piazzas. Throw a coin in the Trevi Fountain, gaze through the Pantheon's oculus, and savor handmade cacio e pepe under the stars.",
    coordinates: { lat: 41.9028, lng: 12.4964 },
    heroImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80",
    imageKeywords: ["rome colosseum sunset", "trevi fountain rome", "pantheon piazza navona"],
    region: "Lazio",
    vibes: ["Cultural", "Romantic", "Foodie"],
    budget: "$$",
    budgetDailyEstimate: 130,
    currency: "EUR (€)",
    language: "Italian",
    bestTimeToVisit: "April–June & September–October",
    idealDuration: "4 to 6 days",
    safetyRating: "4.3/5 (High - beware of pickpockets)",
    timeZone: "GMT+1 (CET)",
    localCuisine: [
      "Rigatoni alla Carbonara (Guanciale, egg yolks, Pecorino Romano)",
      "Cacio e Pepe & Amatriciana Pasta",
      "Supplì (Fried crispy risotto balls with melted mozzarella)",
      "Authentic Artisan Pistachio Gelato"
    ],
    travelTips: [
      "Carry a reusable water bottle — Rome's historic public fountains ('nasoni') dispense ice-cold, pristine drinking water 24/7.",
      "Cover shoulders and knees when visiting the Vatican, St. Peter's Basilica, or churches.",
      "Never pay more than €1.50 for an espresso at a counter bar."
    ],
    localPhrases: [
      { phrase: "Buongiorno!", english: "Good morning / Hello", phonetic: "bwon-JOHR-noh", lang: "it-IT" },
      { phrase: "Grazie mille", english: "A thousand thanks", phonetic: "GRAHT-syeh MEE-leh", lang: "it-IT" },
      { phrase: "Il conto, per favore", english: "The check, please", phonetic: "eel KOHN-toh pair fah-VOH-ray", lang: "it-IT" },
      { phrase: "Un caffè, per favore", english: "An espresso, please", phonetic: "oon kahf-FEH pair fah-VOH-ray", lang: "it-IT" }
    ],
    famousPlaces: [
      {
        id: "colosseum-forum",
        name: "The Colosseum & Roman Forum",
        category: "Ancient Wonder",
        wikiTitle: "Colosseum",
        image: "./assets/images/landmarks/the_colosseum_roman_forum.jpg",
        description: "The largest ancient amphitheater ever built, completed in 80 AD, where gladiators fought before 65,000 spectators.",
        whyVisit: "The absolute pinnacle of Roman engineering and the beating heart of the ancient empire.",
        insiderTip: "Book the Arena Floor or Underground tour to stand directly where gladiators waited before entering the arena.",
        estimatedTime: "3 – 4 hours",
        entryCost: "€18",
        rating: 4.8,
        reviewsCount: 139000,
        coordinates: { lat: 41.8902, lng: 12.4922 }
      },
      {
        id: "pantheon-rome",
        name: "The Pantheon",
        category: "Architectural Marvel",
        wikiTitle: "Pantheon,_Rome",
        image: "./assets/images/landmarks/the_pantheon.jpg",
        description: "The best-preserved monument of ancient Rome, possessing the world's largest unreinforced concrete dome with a 9-meter central oculus.",
        whyVisit: "Nearly 2,000 years old, its harmonious mathematical proportions remain an architectural miracle.",
        insiderTip: "Visit during a rainy day to watch rain cascade through the open oculus onto 2,000-year-old marble drainage holes.",
        estimatedTime: "1 hour",
        entryCost: "€5",
        rating: 4.8,
        reviewsCount: 94000,
        coordinates: { lat: 41.8986, lng: 12.4769 }
      },
      {
        id: "trevi-fountain",
        name: "Trevi Fountain (Fontana di Trevi)",
        category: "Baroque Monument",
        wikiTitle: "Trevi_Fountain",
        image: "./assets/images/landmarks/trevi_fountain_fontana_di_trevi.jpg",
        description: "Nicola Salvi's dramatic Baroque fountain carved from travertine stone, depicting Oceanus commanding roaring sea horses.",
        whyVisit: "Tossing a coin over your left shoulder with your right hand ensures your return to Rome.",
        insiderTip: "Visit at 6:30 AM before sunrise to experience the fountain's roaring waters in complete tranquility.",
        estimatedTime: "45 minutes",
        entryCost: "Free",
        rating: 4.8,
        reviewsCount: 124000,
        coordinates: { lat: 41.9009, lng: 12.4833 }
      },
      {
        id: "vatican-city-museums",
        name: "Vatican Museums & Sistine Chapel",
        category: "Renaissance Art",
        wikiTitle: "Vatican_Museums",
        image: "./assets/images/landmarks/vatican_museums_sistine_chapel.jpg",
        description: "A monumental complex of 54 galleries showcasing millennia of papacy collections, culminating in Michelangelo's Sistine Chapel ceiling.",
        whyVisit: "Witness Michelangelo's 'Creation of Adam' and 'The Last Judgment' in person.",
        insiderTip: "Book the earliest morning 8:00 AM breakfast ticket to enter galleries an hour before the general public.",
        estimatedTime: "3.5 – 5 hours",
        entryCost: "€20",
        rating: 4.8,
        reviewsCount: 116000,
        coordinates: { lat: 41.9067, lng: 12.4547 }
      }
    ]
  },
  {
    id: "sydney-australia",
    name: "Sydney",
    country: "Australia",
    continent: "Oceania",
    tagline: "Sun-Drenched Harbor Metropolis and Golden Surf Havens",
    summary: "Framed by the iconic Sydney Opera House and Harbor Bridge, blending urban sophistication with turquoise beaches, coastal trails, and wildlife.",
    fullDescription: "Sydney is blessed with one of the most magnificent natural harbors in existence. With over 100 golden sand beaches, including the world-famous Bondi and Manly, it is a haven for outdoor lovers, food enthusiasts, and coastal explorers. Ferry rides through Sydney Harbor are an everyday luxury that showcases the city's sunlit glory.",
    coordinates: { lat: -33.8688, lng: 151.2093 },
    heroImage: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=80",
    imageKeywords: ["sydney opera house harbor", "bondi beach aerial", "sydney harbor bridge"],
    region: "New South Wales",
    vibes: ["Beach", "Urban & Modern", "Adventure", "Foodie"],
    budget: "$$$",
    budgetDailyEstimate: 175,
    currency: "AUD ($)",
    language: "English",
    bestTimeToVisit: "September–November & March–May",
    idealDuration: "4 to 7 days",
    safetyRating: "4.8/5 (Very High)",
    timeZone: "GMT+10 (AEST)",
    localCuisine: [
      "Sydney Rock Oysters with Finger Lime",
      "Fresh Barramundi & Fish and Chips",
      "Aussie Flat White Coffee & Lamingtons",
      "Wood-Fired Pizza along Bondi Beach"
    ],
    travelTips: [
      "Use your contactless bank card or phone directly on ferries, trains, and light rail.",
      "Take the public ferry from Circular Quay to Manly for the cheapest million-dollar harbor cruise in the world.",
      "Always swim between the red and yellow flags on surf beaches."
    ],
    localPhrases: [
      { phrase: "G'day mate!", english: "Classic Australian greeting", phonetic: "guh-DAY mayt", lang: "en-AU" },
      { phrase: "No worries at all", english: "You're welcome / It's fine", phonetic: "no wuh-reez", lang: "en-AU" },
      { phrase: "Flat white, please", english: "Iconic Australian coffee", phonetic: "flat wyt", lang: "en-AU" },
      { phrase: "Cheers!", english: "Thank you / Celebration", phonetic: "cheerz", lang: "en-AU" }
    ],
    famousPlaces: [
      {
        id: "sydney-opera-house",
        name: "Sydney Opera House & Bennelong Point",
        category: "Architectural Icon",
        wikiTitle: "Sydney_Opera_House",
        image: "./assets/images/landmarks/sydney_opera_house_bennelong_point.jpg",
        description: "Jørn Utzon's 20th-century architectural masterpiece with soaring precast concrete sail roofs jutting into Sydney Harbor.",
        whyVisit: "One of the most instantly recognizable cultural buildings of the modern era.",
        insiderTip: "Enjoy a sunset drink at the outdoor Opera Bar with the Harbor Bridge as your backdrop.",
        estimatedTime: "2 hours",
        entryCost: "Free outside; Interior Tour: $43 AUD",
        rating: 4.8,
        reviewsCount: 89000,
        coordinates: { lat: -33.8568, lng: 151.2153 }
      },
      {
        id: "bondi-coogee-walk",
        name: "Bondi Beach & Bondi to Coogee Coastal Walk",
        category: "Coastal Trail & Beach",
        wikiTitle: "Bondi_Beach",
        image: "./assets/images/landmarks/bondi_beach_bondi_to_coogee_coastal_walk.jpg",
        description: "A 6-kilometer cliffside coastal trail connecting Sydney's most famous surf beaches, rock pools, and ocean views.",
        whyVisit: "Take a dip in the famous Bondi Icebergs ocean pool overlooking crashing turquoise waves.",
        insiderTip: "Begin early in the morning from Bondi to finish with fresh seafood lunch at Coogee Pavilion.",
        estimatedTime: "2.5 – 3.5 hours",
        entryCost: "Free (Icebergs pool: $10 AUD)",
        rating: 4.9,
        reviewsCount: 65400,
        coordinates: { lat: -33.8915, lng: 151.2767 }
      },
      {
        id: "sydney-harbour-bridge",
        name: "Sydney Harbour Bridge & Pylon Lookout",
        category: "Engineering Wonder",
        wikiTitle: "Sydney_Harbour_Bridge",
        image: "./assets/images/landmarks/sydney_harbour_bridge.jpg",
        description: "Affectionately nicknamed 'The Coathanger', this massive steel arch bridge spans 503 meters across the sparkling harbor.",
        whyVisit: "Walk across the pedestrian path for free or climb to the bridge summit for adrenaline-filled panoramas.",
        insiderTip: "For an affordable high vantage point without the steep BridgeClimb fee, visit the South Pylon Lookout for $19 AUD.",
        estimatedTime: "1.5 – 2 hours",
        entryCost: "Free to walk / BridgeClimb from $268 AUD",
        rating: 4.8,
        reviewsCount: 165000,
        coordinates: { lat: -33.8523, lng: 151.2108 }
      },
      {
        id: "royal-botanic-garden-sydney",
        name: "Royal Botanic Garden & Mrs Macquarie's Chair",
        category: "Botanical Oasis",
        wikiTitle: "Royal_Botanic_Garden,_Sydney",
        image: "./assets/images/landmarks/sydney_botanic_garden.jpg",
        description: "A lush 74-acre harborside botanical park established in 1816, wrapping around Farm Cove right next to the Opera House.",
        whyVisit: "Mrs Macquarie's Chair provides the iconic postcard angle aligning both the Opera House and Harbour Bridge.",
        insiderTip: "Bring a picnic in the late afternoon to watch the sky turn pastel pink over the city skyline.",
        estimatedTime: "2 – 3 hours",
        entryCost: "Free",
        rating: 4.8,
        reviewsCount: 42300,
        coordinates: { lat: -33.8642, lng: 151.2166 }
      }
    ]
  },
  {
    id: "rio-de-janeiro-brazil",
    name: "Rio de Janeiro",
    country: "Brazil",
    continent: "South America",
    tagline: "The Marvelous City of Samba, Sun, and Sugarloaf",
    summary: "Known as Cidade Maravilhosa, nestled dramatically between emerald rainforest peaks and the legendary white sands of Copacabana and Ipanema.",
    fullDescription: "Rio de Janeiro is a city of intoxicating rhythm and breathtaking geography. Sheer granite mountains jut directly out of the Atlantic Ocean, draped in dense tropical jungle and flanked by golden crescent beaches. With the open arms of Christ the Redeemer gazing down from Corcovado mountain and samba pulsing through bohemian Lapa, Rio's spirit is pure joie de vivre.",
    coordinates: { lat: -22.9068, lng: -43.1729 },
    heroImage: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1600&q=80",
    imageKeywords: ["rio de janeiro christ redeemer", "sugarloaf mountain rio", "copacabana beach"],
    region: "Southeast Brazil",
    vibes: ["Beach", "Adventure", "Cultural"],
    budget: "$$",
    budgetDailyEstimate: 75,
    currency: "BRL (R$)",
    language: "Portuguese",
    bestTimeToVisit: "December–March (Summer & Carnival) & May–October (Milder)",
    idealDuration: "4 to 7 days",
    safetyRating: "3.7/5 (Moderate - stay in beach zones)",
    timeZone: "GMT-3 (BRT)",
    localCuisine: [
      "Feijoada (Rich black bean stew with pork and farofa)",
      "Pão de Queijo (Chewy warm Brazilian cheese bread)",
      "Fresh Açaí Bowls with Guaraná and Granola",
      "Churrascaria Barbecue & Fresh Caipirinhas"
    ],
    travelTips: [
      "Catch the sunset at Arpoador rock between Copacabana and Ipanema, where locals applaud as the sun sinks into the sea.",
      "Take yellow registered taxis or Uber after dark.",
      "Visit Christ the Redeemer on the first morning train to beat the cloud cover and tour crowds."
    ],
    localPhrases: [
      { phrase: "Olá, tudo bem?", english: "Hello, how are you?", phonetic: "oh-LAH TOO-doo bayng", lang: "pt-BR" },
      { phrase: "Muito obrigado", english: "Thank you very much", phonetic: "MOO-ee-toh oh-bree-GAH-doo", lang: "pt-BR" },
      { phrase: "A conta, por favor", english: "The check, please", phonetic: "ah KOHN-tah poor fah-VOHR", lang: "pt-BR" },
      { phrase: "Uma água de coco, por favor", english: "A fresh coconut water, please", phonetic: "OO-mah AH-gwah jee KOH-koo", lang: "pt-BR" }
    ],
    famousPlaces: [
      {
        id: "christ-the-redeemer",
        name: "Christ the Redeemer & Corcovado Mountain",
        category: "New 7 Wonder",
        wikiTitle: "Christ_the_Redeemer_(statue)",
        image: "./assets/images/landmarks/christ_the_redeemer_corcovado_mountain.jpg",
        description: "A colossal 30-meter Art Deco statue of Jesus Christ with a 28-meter arm span, perched atop the 710-meter summit of Corcovado.",
        whyVisit: "The supreme symbol of Brazil and an awe-inspiring vista over Guanabara Bay, Sugarloaf, and the beaches.",
        insiderTip: "Take the historic Trem do Corcovado cogwheel train that winds through the lush Tijuca rainforest.",
        estimatedTime: "2.5 – 3.5 hours",
        entryCost: "R$85 – R$110 (~$17–$22)",
        rating: 4.9,
        reviewsCount: 110000,
        coordinates: { lat: -22.9519, lng: -43.2105 }
      },
      {
        id: "sugarloaf-mountain",
        name: "Sugarloaf Mountain (Pão de Açúcar)",
        category: "Geological Peak",
        wikiTitle: "Sugarloaf_Mountain",
        image: "./assets/images/landmarks/sugarloaf_mountain_p_o_de_a_car.jpg",
        description: "A 396-meter monolithic granite dome rising straight from the mouth of Guanabara Bay, reached by bubble cable cars.",
        whyVisit: "The two-stage cableway offers cinematic 360-degree views of the entire coastal landscape.",
        insiderTip: "Arrive 1.5 hours before sunset to enjoy golden hour and watch Rio's city lights shimmer to life.",
        estimatedTime: "2.5 – 3 hours",
        entryCost: "R$150 (~$30)",
        rating: 4.8,
        reviewsCount: 82000,
        coordinates: { lat: -22.9492, lng: -43.1545 }
      },
      {
        id: "ipanema-beach",
        name: "Ipanema & Copacabana Beaches",
        category: "Iconic Coastline",
        wikiTitle: "Ipanema",
        image: "./assets/images/landmarks/ipanema_copacabana_beaches.jpg",
        description: "World-famous twin beach crescents lined with wave-patterned mosaic promenades, beach volley posts, and coconut kiosks.",
        whyVisit: "The vibrant stage where Rio's beach culture, music, and beach sports thrive day and night.",
        insiderTip: "Posto 9 in Ipanema is the trendiest hangout for artists, while Posto 8 is popular with surf enthusiasts.",
        estimatedTime: "2 – 4 hours",
        entryCost: "Free",
        rating: 4.8,
        reviewsCount: 74000,
        coordinates: { lat: -22.9868, lng: -43.2045 }
      },
      {
        id: "selaron-steps",
        name: "Escadaria Selarón & Santa Teresa",
        category: "Urban Art Landmark",
        wikiTitle: "Escadaria_Selarón",
        image: "./assets/images/landmarks/escadaria_selar_n_santa_teresa.jpg",
        description: "Jorge Selarón's world-famous 215-step staircase adorned with over 2,000 brightly colored ceramic tiles from 60+ countries.",
        whyVisit: "A vibrant tribute to the Brazilian spirit connecting the bohemian enclaves of Lapa and Santa Teresa.",
        insiderTip: "Walk up into Santa Teresa afterward to ride the historic yellow Bonde tram and visit art galleries.",
        estimatedTime: "1.5 – 2 hours",
        entryCost: "Free",
        rating: 4.7,
        reviewsCount: 56000,
        coordinates: { lat: -22.9155, lng: -43.1793 }
      }
    ]
  },
  {
    id: "reykjavik-iceland",
    name: "Reykjavik",
    country: "Iceland",
    continent: "Europe",
    tagline: "The Land of Fire, Ice, and Aurora Magic",
    summary: "The world's northernmost capital, opening onto geothermal lagoons, roaring waterfalls, volcanic black sand beaches, and the Northern Lights.",
    fullDescription: "Reykjavik is an imaginative, colorful, and environmentally pristine northern hub. While the city itself boasts a vibrant culinary scene, whimsical corrugated-iron houses, and cutting-edge design, it serves as the launching pad to Iceland's supernatural landscapes.",
    coordinates: { lat: 64.1466, lng: -21.9426 },
    heroImage: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1600&q=80",
    imageKeywords: ["iceland northern lights", "reykjavik hallgrimskirkja", "blue lagoon geothermal"],
    region: "Capital Region",
    vibes: ["Adventure", "Mountain & Nature", "Romantic"],
    budget: "$$$",
    budgetDailyEstimate: 190,
    currency: "ISK (kr)",
    language: "Icelandic, English",
    bestTimeToVisit: "Sept–March (Northern Lights) & June–August (Midnight Sun)",
    idealDuration: "4 to 7 days",
    safetyRating: "5/5 (Safest on earth)",
    timeZone: "GMT+0 (UTC)",
    localCuisine: [
      "Icelandic Lamb Soup (Kjötsúpa)",
      "Fresh Arctic Char & Langoustine Soup",
      "Bæjarins Beztu Pylsur (Iconic lamb hot dogs)",
      "Creamy Skyr with Wild Blueberries"
    ],
    travelTips: [
      "Rent a 4WD vehicle if you plan to explore Iceland's Ring Road or Golden Circle on your own.",
      "Check the Vedur.is aurora forecast for cloud cover and Kp-index before hunting the Northern Lights.",
      "Bring windproof, waterproof layers regardless of what season you visit."
    ],
    localPhrases: [
      { phrase: "Góðan daginn", english: "Good day / Hello", phonetic: "GOH-than DYE-in", lang: "is-IS" },
      { phrase: "Takk fyrir", english: "Thank you", phonetic: "tahk FEER-eer", lang: "is-IS" },
      { phrase: "Hvað kostar þetta?", english: "How much does this cost?", phonetic: "kvahth KOSS-tar THET-tah", lang: "is-IS" },
      { phrase: "Skál!", english: "Cheers! / Good health", phonetic: "skowl", lang: "is-IS" }
    ],
    famousPlaces: [
      {
        id: "blue-lagoon",
        name: "Blue Lagoon Geothermal Spa",
        category: "Geothermal Oasis",
        wikiTitle: "Blue_Lagoon_(geothermal_spa)",
        image: "./assets/images/landmarks/blue_lagoon_geothermal_spa.jpg",
        description: "Mineral-rich milky cyan geothermal waters heated by volcanic earth, surrounded by dramatic black lava fields on the Reykjanes Peninsula.",
        whyVisit: "Soak in 38°C (100°F) silica and sulfur enriched waters while enjoying natural face masks.",
        insiderTip: "Pre-booking is strictly mandatory. Stop here directly en route to or from Keflavik International Airport.",
        estimatedTime: "3 – 4 hours",
        entryCost: "From $75 USD",
        rating: 4.8,
        reviewsCount: 76000,
        coordinates: { lat: 63.8804, lng: -22.4495 }
      },
      {
        id: "hallgrimskirkja",
        name: "Hallgrímskirkja Church & Tower",
        category: "Nordic Architecture",
        wikiTitle: "Hallgrímskirkja",
        image: "./assets/images/landmarks/hallgr_mskirkja_church_tower.jpg",
        description: "Iceland's largest church, towering 74.5 meters, designed by Guðjón Samúelsson to mimic basalt lava cooling columns.",
        whyVisit: "The open bell tower elevator takes you to the finest 360-degree view of Reykjavik's brightly colored rooftops and mountains.",
        insiderTip: "Step inside to hear the colossal 5,275-pipe concert organ played during mid-day organ recitals.",
        estimatedTime: "1 – 1.5 hours",
        entryCost: "Church: Free (Tower: ~$10)",
        rating: 4.8,
        reviewsCount: 58000,
        coordinates: { lat: 64.1417, lng: -21.9266 }
      },
      {
        id: "golden-circle-gullfoss",
        name: "Gullfoss Waterfall & Geysir",
        category: "Natural Wonder",
        wikiTitle: "Gullfoss",
        image: "./assets/images/landmarks/gullfoss_waterfall_geysir.jpg",
        description: "The 'Golden Falls' plunges in two dramatic tiers into a rugged canyon, paired with the Strokkur geysir erupting every 6–10 minutes.",
        whyVisit: "Witness the immense geological raw power of glacial meltwater and bubbling subterranean thermal activity.",
        insiderTip: "Walk the lower wooden trail in summer to feel the glacial spray and view frequent double rainbows.",
        estimatedTime: "Day trip (4 – 6 hours from Reykjavik)",
        entryCost: "Free",
        rating: 4.9,
        reviewsCount: 68000,
        coordinates: { lat: 64.3271, lng: -20.1199 }
      },
      {
        id: "harpa-concert-hall",
        name: "Harpa Concert Hall & Old Harbor",
        category: "Modern Glass Architecture",
        wikiTitle: "Harpa_(concert_hall)",
        image: "./assets/images/landmarks/harpa_concert_hall_old_harbor.jpg",
        description: "An architectural marvel featuring a distinctive geometric colored glass facade inspired by basalt crystallization.",
        whyVisit: "Wander inside the glass atrium where shifting northern sunlight reflects dazzling kaleidoscope patterns.",
        insiderTip: "Walk along the Old Harbor waterfront afterward for fresh lobster soup at the iconic Sægreifinn.",
        estimatedTime: "1.5 – 2 hours",
        entryCost: "Free to explore public spaces",
        rating: 4.7,
        reviewsCount: 39000,
        coordinates: { lat: 64.1504, lng: -21.9329 }
      }
    ]
  },
  {
    id: "bali-indonesia",
    name: "Bali",
    country: "Indonesia",
    continent: "Asia",
    tagline: "The Island of the Gods, Emerald Terraces, and Sacred Serenity",
    summary: "A tropical paradise celebrated for its sculpted rice terraces, clifftop sea temples, coral reefs, yoga sanctuaries, and warm Balinese hospitality.",
    fullDescription: "Bali is far more than a beach getaway — it is a spiritual journey. From the mist-shrouded jungle ravines of Ubud and dramatic sea temples of Uluwatu to the surf breaks of Canggu and volcanic sunrises atop Mount Batur, Bali seamlessly weaves vibrant Hindu ceremonies and artistic craft into daily life.",
    coordinates: { lat: -8.4095, lng: 115.1889 },
    heroImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80",
    imageKeywords: ["bali temple water", "ubud rice terrace", "uluwatu cliff sunset"],
    region: "Lesser Sunda Islands",
    vibes: ["Beach", "Cultural", "Spiritual", "Romantic"],
    budget: "$",
    budgetDailyEstimate: 50,
    currency: "IDR (Rp)",
    language: "Indonesian, Balinese, English",
    bestTimeToVisit: "April–October (Dry season & Sunniest skies)",
    idealDuration: "5 to 10 days",
    safetyRating: "4.5/5 (High)",
    timeZone: "GMT+8 (WITA)",
    localCuisine: [
      "Nasi Goreng & Mie Goreng with Satay Ayam",
      "Babi Guling (Balinese suckling roast pig)",
      "Bebek Betutu (Slow-cooked spiced duck wrapped in banana leaves)",
      "Fresh Coconut Water & Tropical Dragonfruit Smoothies"
    ],
    travelTips: [
      "Wear a sarong and sash when entering any Balinese Hindu temple.",
      "Hire a private driver for full-day excursions ($35–$45 USD/day).",
      "Keep sunglasses and phones secured around macaques at Uluwatu."
    ],
    localPhrases: [
      { phrase: "Om Swastyastu", native: "Om Swastyastu (ᬒᬁ ᬲ᭄ᬯᬲ᭄ᬢ᭄ᬬᬲ᭄ᬢᬸ)", english: "Sacred Balinese greeting", phonetic: "om swahs-tee-ahs-too", lang: "id-ID" },
      { phrase: "Matur suksma", native: "Matur suksma", english: "Thank you very much (Balinese)", phonetic: "MAH-toor SOOK-smah", lang: "id-ID" },
      { phrase: "Berapa harganya?", native: "Berapa harganya?", english: "How much is this?", phonetic: "beh-RAH-pah har-GAHN-yah", lang: "id-ID" },
      { phrase: "Enak sekali!", native: "Enak sekali!", english: "Extremely delicious!", phonetic: "eh-NAHK seh-KAH-lee", lang: "id-ID" }
    ],
    famousPlaces: [
      {
        id: "tegalalang-rice-terrace",
        name: "Tegalalang Rice Terraces & Ubud Valleys",
        category: "Agricultural Heritage",
        wikiTitle: "Tegallalang",
        image: "./assets/images/landmarks/tegalalang_rice_terraces_ubud_valleys.jpg",
        description: "Emerald green stepped rice paddies carved into hillsides following the UNESCO-recognized 9th-century Subak cooperative irrigation system.",
        whyVisit: "Iconic tropical scenery offering scenic canyon trekking, jungle swings, and peaceful farmer trails.",
        insiderTip: "Arrive at sunrise (around 6:00 AM) to see rays of morning sunlight pierce through palm fronds with zero crowds.",
        estimatedTime: "2 – 3 hours",
        entryCost: "IDR 25,000 (~$1.60)",
        rating: 4.8,
        reviewsCount: 61000,
        coordinates: { lat: -8.4333, lng: 115.2811 }
      },
      {
        id: "uluwatu-temple",
        name: "Uluwatu Temple & Kecak Fire Dance",
        category: "Clifftop Sea Temple",
        wikiTitle: "Uluwatu_Temple",
        image: "./assets/images/landmarks/uluwatu_temple_kecak_fire_dance.jpg",
        description: "A sacred Balinese sea temple perched on the precipice of a sheer 70-meter limestone cliff dropping into the crashing Indian Ocean.",
        whyVisit: "Watch the hypnotic Kecak Fire Dance performance in an open-air amphitheater with the blazing sun setting into the ocean.",
        insiderTip: "Buy your Kecak dance tickets online by 4:30 PM to secure prime front-row amphitheater seating.",
        estimatedTime: "2.5 – 3.5 hours",
        entryCost: "Temple: IDR 50,000; Dance: IDR 150,000",
        rating: 4.8,
        reviewsCount: 78000,
        coordinates: { lat: -8.8291, lng: 115.0849 }
      },
      {
        id: "tanah-lot",
        name: "Tanah Lot Temple",
        category: "Offshore Sea Temple",
        wikiTitle: "Tanah_Lot",
        image: "./assets/images/landmarks/tanah_lot_temple.jpg",
        description: "An ancient Hindu pilgrimage shrine perched atop a distinctive offshore rock outcrop shaped by ocean tides.",
        whyVisit: "During low tide you can walk across the reef to the temple base and receive a holy water blessing.",
        insiderTip: "Stake out a cliffside café on the headland overlooking the temple 45 minutes before sunset.",
        estimatedTime: "2 hours",
        entryCost: "IDR 60,000 (~$4)",
        rating: 4.7,
        reviewsCount: 84000,
        coordinates: { lat: -8.6212, lng: 115.0868 }
      },
      {
        id: "ubud-monkey-forest",
        name: "Sacred Monkey Forest Sanctuary",
        category: "Nature & Wildlife",
        wikiTitle: "Ubud_Monkey_Forest",
        image: "./assets/images/landmarks/sacred_monkey_forest_sanctuary.jpg",
        description: "A 12.5-hectare sacred nutmeg forest reserve with ancient banyan roots, mossy statues, and over 1,200 wild Balinese long-tailed macaques.",
        whyVisit: "Fosters the Balinese philosophy of Tri Hita Karana (harmony between humans, nature, and the divine).",
        insiderTip: "Do not look monkeys directly in the eye and avoid touching them for a peaceful, delightful visit.",
        estimatedTime: "1.5 – 2.5 hours",
        entryCost: "IDR 80,000 (~$5)",
        rating: 4.7,
        reviewsCount: 59000,
        coordinates: { lat: -8.5188, lng: 115.2606 }
      }
    ]
  },
  {
    id: "cairo-egypt",
    name: "Cairo",
    country: "Egypt",
    continent: "Africa",
    tagline: "The Cradle of Civilization Along the Timeless Nile",
    summary: "Home to the last remaining wonder of the ancient world, the Pyramids of Giza, Islamic medieval citadels, and bustling historic bazaars.",
    fullDescription: "Cairo is a mesmerizing, timeless whirlwind where millennia of human civilization converge. Across the Nile in Giza stand the towering Pyramids and the enigmatic Sphinx, enduring monuments built over 4,500 years ago.",
    coordinates: { lat: 30.0444, lng: 31.2357 },
    heroImage: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1600&q=80",
    imageKeywords: ["giza pyramids egypt", "cairo nile sphinx", "islamic cairo mosque"],
    region: "Nile Delta",
    vibes: ["Cultural", "Adventure", "Foodie"],
    budget: "$",
    budgetDailyEstimate: 55,
    currency: "EGP (E£)",
    language: "Arabic, English",
    bestTimeToVisit: "October–April (Cooler, pleasant weather)",
    idealDuration: "3 to 5 days",
    safetyRating: "4.1/5 (Moderate - hire licensed guides)",
    timeZone: "GMT+2",
    localCuisine: [
      "Koshary (Egypt's national dish of lentils, rice, pasta & spiced tomato sauce)",
      "Ta'ameya (Crispy authentic Egyptian fava bean falafel)",
      "Ful Medames with Warm Aish Baladi Bread",
      "Om Ali (Warm layered puff pastry pudding with nuts & cream)"
    ],
    travelTips: [
      "Hire an Egyptologist guide for the Giza Plateau to navigate camel touts.",
      "Dress conservatively when visiting mosques, covering shoulders and legs.",
      "Take an evening felucca sailboat ride on the Nile to see Cairo's illuminated skyline."
    ],
    localPhrases: [
      { phrase: "Salam Alaykum", native: "السلام عليكم", english: "Peace be upon you (Greeting)", phonetic: "sah-LAHM ah-LAY-koom", lang: "ar-EG" },
      { phrase: "Shukran jazeelan", native: "شكراً جزيلاً", english: "Thank you very much", phonetic: "SHOOK-rahn jah-ZEE-lahn", lang: "ar-EG" },
      { phrase: "Bikam hatha?", native: "بكام هذا؟", english: "How much is this?", phonetic: "bee-KAHM HAH-thah", lang: "ar-EG" },
      { phrase: "La, shukran", native: "لا، شكراً", english: "No, thank you (Polite refusal)", phonetic: "lah, SHOOK-rahn", lang: "ar-EG" }
    ],
    famousPlaces: [
      {
        id: "giza-pyramids-sphinx",
        name: "Pyramids of Giza & Great Sphinx",
        category: "Ancient Wonder of the World",
        wikiTitle: "Giza_pyramid_complex",
        image: "./assets/images/landmarks/pyramids_of_giza_great_sphinx.jpg",
        description: "The Great Pyramid of Khufu, Khafre, Menkaure, and the Great Sphinx, standing on the edge of the Sahara Desert for over 4,500 years.",
        whyVisit: "The sole surviving wonder of the original Seven Wonders of the Ancient World.",
        insiderTip: "Walk behind the Pyramid of Khafre to the panoramic viewpoint where all three main pyramids align across desert sands.",
        estimatedTime: "3.5 – 5 hours",
        entryCost: "360 EGP (~$11 USD)",
        rating: 4.9,
        reviewsCount: 148000,
        coordinates: { lat: 29.9792, lng: 31.1342 }
      },
      {
        id: "grand-egyptian-museum",
        name: "Grand Egyptian Museum (GEM)",
        category: "World Archeology Museum",
        wikiTitle: "Grand_Egyptian_Museum",
        image: "./assets/images/landmarks/grand_egyptian_museum_gem.jpg",
        description: "The largest archaeological museum complex in the world, showcasing over 100,000 pharaonic artifacts including Tutankhamun treasures.",
        whyVisit: "A state-of-the-art architectural triumph featuring glass walls framing direct views to the Giza Pyramids.",
        insiderTip: "Book trial access tickets online in advance to view the Grand Staircase and Atrium.",
        estimatedTime: "3 – 4 hours",
        entryCost: "Around $25 USD",
        rating: 4.9,
        reviewsCount: 42000,
        coordinates: { lat: 29.9950, lng: 31.1197 }
      },
      {
        id: "khan-el-khalili",
        name: "Khan el-Khalili & Islamic Cairo",
        category: "Historic Bazaar",
        wikiTitle: "Khan_el-Khalili",
        image: "./assets/images/landmarks/khan_el_khalili_islamic_cairo.jpg",
        description: "A labyrinthine 14th-century souk bustling with merchants selling brass lamps, spices, perfumes, silver jewelry, and vibrant textiles.",
        whyVisit: "Step into the living sensory pulse of medieval Islamic Cairo.",
        insiderTip: "Take a break at El Fishawy Café (operating continuously since 1797) for mint tea and shisha amidst carved mirrors.",
        estimatedTime: "2.5 – 3.5 hours",
        entryCost: "Free to explore",
        rating: 4.7,
        reviewsCount: 52000,
        coordinates: { lat: 30.0478, lng: 31.2622 }
      },
      {
        id: "saladin-citadel",
        name: "Citadel of Saladin & Mosque of Muhammad Ali",
        category: "Medieval Fortress",
        wikiTitle: "Cairo_Citadel",
        image: "./assets/images/landmarks/citadel_of_saladin_mosque_of_muhammad_ali.jpg",
        description: "A fortified medieval Islamic citadel built by Saladin on the Mokattam hills, crowned by the grand Ottoman-style Alabaster Mosque.",
        whyVisit: "The citadel terrace offers sweeping views across Cairo all the way to the Giza Pyramids on a clear day.",
        insiderTip: "Remove shoes before entering the prayer hall to marvel at its concentric crystal chandeliers.",
        estimatedTime: "2 – 3 hours",
        entryCost: "300 EGP (~$9.50 USD)",
        rating: 4.8,
        reviewsCount: 48000,
        coordinates: { lat: 30.0299, lng: 31.2613 }
      }
    ]
  },
  {
    id: "cusco-machu-picchu-peru",
    name: "Cusco & Machu Picchu",
    country: "Peru",
    continent: "South America",
    tagline: "The Sacred Valley and Lost Citadel of the Inca Empire",
    summary: "Perched high in the Andes mountains, blending colonial plazas built upon imperial Inca stonework with the mystical cloud-forest citadel of Machu Picchu.",
    fullDescription: "Cusco was the imperial navel of the Inca Empire, situated at 3,400 meters altitude. Here, Spanish baroque cathedrals rest directly on mortarless Inca stone foundations so tightly fitted that a knife blade cannot slide between them. A train ride down the Urubamba River valley leads to the legendary 15th-century mountain citadel of Machu Picchu.",
    coordinates: { lat: -13.5319, lng: -71.9675 },
    heroImage: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1600&q=80",
    imageKeywords: ["machu picchu peru", "cusco plaza de armas", "sacred valley andes"],
    region: "Cusco Region",
    vibes: ["Adventure", "Cultural", "Mountain & Nature"],
    budget: "$$",
    budgetDailyEstimate: 95,
    currency: "PEN (S/.)",
    language: "Spanish, Quechua",
    bestTimeToVisit: "May–October (Dry Andean season & Clear skies)",
    idealDuration: "4 to 7 days",
    safetyRating: "4.4/5 (High)",
    timeZone: "GMT-5 (PET)",
    localCuisine: [
      "Peruvian Ceviche with Sweet Potato & Giant Andean Corn (Choclo)",
      "Lomo Saltado (Stir-fried beef tenderloin with onions, tomatoes & fries)",
      "Causa Rellena (Layered yellow potato terrine with avocado)",
      "Warm Coca Tea & Muña Herbal Infusions"
    ],
    travelTips: [
      "Spend at least 2 full days in Cusco or the Sacred Valley before undertaking strenuous treks to acclimatize to the altitude.",
      "Reserve your official Machu Picchu Circuit entry tickets months ahead of time.",
      "Take the Vistadome scenic train from Ollantaytambo for views of Andean river gorges."
    ],
    localPhrases: [
      { phrase: "Allianllachu", english: "Hello, how are you? (Quechua)", phonetic: "eye-ee-yahn-yah-choo", lang: "es-PE" },
      { phrase: "Muchas gracias", english: "Thank you very much (Spanish)", phonetic: "MOO-chahs GRAH-syahs", lang: "es-PE" },
      { phrase: "¿Cuánto cuesta?", english: "How much is it?", phonetic: "KWAHN-toh KWEHS-tah", lang: "es-PE" },
      { phrase: "Sulpayki", english: "Thank you from the heart (Quechua)", phonetic: "sool-PYE-kee", lang: "es-PE" }
    ],
    famousPlaces: [
      {
        id: "machu-picchu-citadel",
        name: "Historic Sanctuary of Machu Picchu",
        category: "New 7 Wonder & UNESCO Heritage",
        wikiTitle: "Machu_Picchu",
        image: "./assets/images/landmarks/historic_sanctuary_of_machu_picchu.jpg",
        description: "An extraordinary 15th-century royal estate built on a ridge 2,430 meters above sea level between steep Andean cloud-forest peaks.",
        whyVisit: "The supreme masterpiece of Inca civil engineering and harmonious architecture seamlessly integrated into nature.",
        insiderTip: "Hike to the Sun Gate (Inti Punku) for the breathtaking first view travelers on the Inca Trail see.",
        estimatedTime: "Full day excursion",
        entryCost: "From 152 PEN (~$40 USD)",
        rating: 5.0,
        reviewsCount: 165000,
        coordinates: { lat: -13.1631, lng: -72.5450 }
      },
      {
        id: "sacsayhuaman",
        name: "Sacsayhuamán Fortress & Complex",
        category: "Megalithic Inca Fortress",
        wikiTitle: "Sacsayhuamán",
        image: "./assets/images/landmarks/sacsayhuam_n_fortress_complex.jpg",
        description: "A monumental citadel overlooking Cusco, constructed from gigantic hand-carved limestone blocks weighing up to 128 tons.",
        whyVisit: "Marvel at how ancient Inca stonemasons interlocked massive stones with laser-like precision without modern machinery.",
        insiderTip: "Walk up from the San Blas neighborhood through colonial alleyways for great city overlooks.",
        estimatedTime: "2 – 3 hours",
        entryCost: "Included in Cusco Tourist Ticket (BTC)",
        rating: 4.8,
        reviewsCount: 47000,
        coordinates: { lat: -13.5086, lng: -71.9819 }
      },
      {
        id: "plaza-de-armas-cusco",
        name: "Plaza de Armas & San Blas",
        category: "Colonial Heart & Artisan Quarter",
        wikiTitle: "Cusco",
        image: "./assets/images/landmarks/plaza_de_armas_cusco_cathedral.jpg",
        description: "Cusco's historic main square anchored by the ornate Cathedral of Santo Domingo and surrounded by carved wooden balconies.",
        whyVisit: "Sip coffee while observing indigenous weavers in vibrant traditional Andean garments and explore artisan craft shops.",
        insiderTip: "Find the famous Twelve-Angled Stone on Calle Hatun Rumiyoc along the wall of the Archbishop's Palace.",
        estimatedTime: "2 – 3 hours",
        entryCost: "Free",
        rating: 4.8,
        reviewsCount: 62000,
        coordinates: { lat: -13.5160, lng: -71.9785 }
      },
      {
        id: "rainbow-mountain",
        name: "Vinicunca (Rainbow Mountain)",
        category: "Geological Phenomenon",
        wikiTitle: "Vinicunca",
        image: "./assets/images/landmarks/vinicunca_rainbow_mountain.jpg",
        description: "A breathtaking high-altitude mountain peak striped in 14 distinct mineral colors created by weathering and sedimentary deposits.",
        whyVisit: "One of the most visually surreal natural landscapes in the world, reaching 5,200 meters altitude.",
        insiderTip: "Only attempt this trek after at least 3 days in Cusco to avoid altitude sickness, and dress in warm layers.",
        estimatedTime: "Full day excursion",
        entryCost: "Tour: $30–$45 USD",
        rating: 4.7,
        reviewsCount: 38000,
        coordinates: { lat: -13.8694, lng: -71.3030 }
      }
    ]
  },
  {
    id: "banff-canada",
    name: "Banff & Canadian Rockies",
    country: "Canada",
    continent: "North America",
    tagline: "Turquoise Glacial Lakes Framed by Majestic Rocky Peaks",
    summary: "Canada's first national park, celebrated for brilliant turquoise glacial waters, soaring alpine peaks, hot springs, and abundant wildlife.",
    fullDescription: "Banff National Park in Alberta is a postcard of pristine alpine grandeur. From the surreal emerald waters of Lake Louise and Moraine Lake reflecting the Valley of the Ten Peaks to wildlife encounters with elk and grizzly bears along the Icefields Parkway, Banff offers unmatched wilderness beauty in every season.",
    coordinates: { lat: 51.1784, lng: -115.5708 },
    heroImage: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1600&q=80",
    imageKeywords: ["banff moraine lake canada", "lake louise turquoise", "canadian rockies alpine"],
    region: "Alberta",
    vibes: ["Mountain & Nature", "Adventure", "Romantic"],
    budget: "$$$",
    budgetDailyEstimate: 180,
    currency: "CAD ($)",
    language: "English, French",
    bestTimeToVisit: "June–August (Hiking & Lake canoeing) & Dec–March (Skiing)",
    idealDuration: "4 to 7 days",
    safetyRating: "5/5 (Exceptional)",
    timeZone: "GMT-7 (MST)",
    localCuisine: [
      "Alberta AAA Prime Rib & Bison Burgers",
      "Traditional Canadian Poutine with Fresh Squeaky Cheese Curds",
      "Warm BeaverTails Pastries with Cinnamon Sugar",
      "Rocky Mountain Craft Beer & Nanaimo Bars"
    ],
    travelTips: [
      "Moraine Lake road is closed to private vehicles; book Parks Canada shuttle buses in advance.",
      "Carry bear spray and know how to use it when hiking any trail in Banff National Park.",
      "Rent a red canoe at Lake Louise early in the morning for serene glass-like reflections."
    ],
    localPhrases: [
      { phrase: "Good day, how's it going?", english: "Canadian mountain greeting", phonetic: "good day", lang: "en-CA" },
      { phrase: "Merci beaucoup", english: "Thank you (Bilingual Canada)", phonetic: "mair-see boh-koo", lang: "fr-CA" },
      { phrase: "Where is the trail head?", english: "Hiking directions", phonetic: "trayl hed", lang: "en-CA" },
      { phrase: "A BeaverTail with cinnamon, please", english: "Classic Canadian pastry order", phonetic: "bee-ver-tayl", lang: "en-CA" }
    ],
    famousPlaces: [
      {
        id: "lake-louise",
        name: "Lake Louise & Victoria Glacier",
        category: "Glacial Lake",
        wikiTitle: "Lake_Louise_(Alberta)",
        image: "./assets/images/landmarks/lake_louise_victoria_glacier.jpg",
        description: "A world-famous turquoise glacial lake fed by the Victoria Glacier, framed by towering rugged peaks and the grand Fairmont Chateau.",
        whyVisit: "The vibrant turquoise color, caused by rock flour suspended in glacier meltwater, is breathtaking.",
        insiderTip: "Hike the Lake Agnes Teahouse trail (3.5 km) up to a rustic alpine teahouse built in 1901 serving 100+ loose-leaf teas.",
        estimatedTime: "3 – 5 hours",
        entryCost: "Parks Canada Pass (~$11 CAD/day)",
        rating: 4.9,
        reviewsCount: 94000,
        coordinates: { lat: 51.4254, lng: -116.1773 }
      },
      {
        id: "moraine-lake",
        name: "Moraine Lake & Valley of the Ten Peaks",
        category: "Alpine Wonder",
        wikiTitle: "Moraine_Lake",
        image: "./assets/images/landmarks/moraine_lake_valley_of_the_ten_peaks.jpg",
        description: "An intensely vivid cobalt-blue lake nestled in the Valley of the Ten Peaks, famously featured on the reverse of the 1969 Canadian twenty-dollar bill.",
        whyVisit: "Considered by many travelers and photographers to be the single most beautiful lake on planet earth.",
        insiderTip: "Climb the short Rockpile Trail right next to the parking lot for the iconic elevated viewpoint.",
        estimatedTime: "2 – 3 hours",
        entryCost: "Parks Canada Pass + Shuttle",
        rating: 5.0,
        reviewsCount: 88000,
        coordinates: { lat: 51.3217, lng: -116.1860 }
      },
      {
        id: "banff-gondola",
        name: "Banff Gondola & Sulphur Mountain",
        category: "Alpine Observation",
        wikiTitle: "Sulphur_Mountain_(Alberta)",
        image: "./assets/images/landmarks/sulphur_mountain_banff.jpg",
        description: "A 4-passenger glass gondola that glides 698 meters up Sulphur Mountain to an altitude of 2,281 meters above sea level.",
        whyVisit: "The multi-level rooftop deck and 1-kilometer boardwalk along the mountain ridge provide unmatched 360° views of six Rocky Mountain ranges.",
        insiderTip: "Visit at sunset and book dinner at the Sky Bistro atop the summit for an unforgettable culinary experience above the clouds.",
        estimatedTime: "2.5 – 3 hours",
        entryCost: "From $65 CAD",
        rating: 4.8,
        reviewsCount: 52000,
        coordinates: { lat: 51.1481, lng: -115.5583 }
      },
      {
        id: "johnston-canyon",
        name: "Johnston Canyon Waterfalls",
        category: "Canyon Trail",
        wikiTitle: "Johnston_Canyon",
        image: "./assets/images/landmarks/johnston_canyon_waterfalls.jpg",
        description: "A dramatic limestone canyon carved over millennia, traversed via steel catwalks cantilevered directly over the roaring river.",
        whyVisit: "Accessible hike leading to the Lower Falls (with a secret walk-through tunnel) and towering Upper Falls.",
        insiderTip: "In winter, the waterfalls freeze into colossal blue-white ice walls popular with ice climbers.",
        estimatedTime: "2 – 3 hours",
        entryCost: "Free with National Park Pass",
        rating: 4.8,
        reviewsCount: 46000,
        coordinates: { lat: 51.2454, lng: -115.8402 }
      }
    ]
  },
  {
    id: "agra-india",
    name: "Agra & Taj Mahal",
    country: "India",
    continent: "Asia",
    tagline: "The Monumental City of Eternal Mughal Romance and Marvels",
    summary: "Home to the world's most breathtaking testament of love, the marble Taj Mahal, alongside fortified imperial palaces and red sandstone citadels.",
    fullDescription: "Agra sits gracefully on the banks of the sacred Yamuna River in northern India. As the imperial capital of the Mughal Empire under emperors Akbar, Jahangir, and Shah Jahan, Agra became a magnificent center of art, Persian-inspired garden architecture, and culture. The shimmering white marble dome of the Taj Mahal at dawn, the imposing red sandstone ramparts of Agra Fort, and the deserted royal ghost city of Fatehpur Sikri make Agra an essential pilgrimage for global travelers.",
    coordinates: { lat: 27.1767, lng: 78.0081 },
    heroImage: "./assets/images/taj_mahal.jpg",
    imageKeywords: ["taj mahal agra india", "agra fort marble", "mehtab bagh taj"],
    region: "Uttar Pradesh",
    vibes: ["Cultural", "Romantic"],
    budget: "$",
    budgetDailyEstimate: 45,
    currency: "INR (₹)",
    language: "Hindi, English",
    bestTimeToVisit: "October–March (Pleasant winter sunshine)",
    idealDuration: "2 to 3 days",
    safetyRating: "4.2/5 (Moderate - hire authorized guides)",
    timeZone: "GMT+5:30 (IST)",
    localCuisine: [
      "Agra Petha (Translucent candied ash gourd sweet)",
      "Bedmi Puri with Spicy Hing Aloo Sabzi",
      "Mughlai Biryani & Dum Gosht",
      "Crispy Hot Jalebi with Creamy Rabri"
    ],
    travelTips: [
      "The Taj Mahal is strictly closed to tourists every Friday for congregational prayers.",
      "Arrive at the East Gate ticket counter at 5:30 AM for sunrise when the ivory marble turns ethereal pink.",
      "Visit Mehtab Bagh across the Yamuna river at golden hour for stunning reflection photos without interior crowds."
    ],
    localPhrases: [
      { phrase: "Namaste", native: "नमस्ते", english: "Respectful traditional greeting", phonetic: "nuh-muh-STAY", lang: "hi-IN" },
      { phrase: "Aapka bahut bahut dhanyawad", native: "आपका बहुत बहुत धन्यवाद", english: "Thank you very much", phonetic: "AHP-kuh buh-HOOT DHUHN-yuh-vahd", lang: "hi-IN" },
      { phrase: "Yeh kitne ka hai?", native: "यह कितने का है?", english: "How much does this cost?", phonetic: "yeh KIT-nay kuh hye", lang: "hi-IN" },
      { phrase: "Kripya thoda kam kijiye", native: "कृपया थोड़ा कम कीजिये", english: "Please lower the price a bit (polite)", phonetic: "KRIP-yuh THOH-duh kuhm KEE-jee-yay", lang: "hi-IN" }
    ],
    famousPlaces: [
      {
        id: "taj-mahal",
        name: "The Taj Mahal",
        category: "New 7 Wonder & UNESCO Heritage",
        wikiTitle: "Taj_Mahal",
        image: "./assets/images/taj_mahal.jpg",
        description: "An immense ivory-white marble mausoleum commissioned in 1632 by Emperor Shah Jahan for his beloved queen Mumtaz Mahal.",
        whyVisit: "Universally acknowledged as the jewel of Muslim art in India and one of the universally admired masterpieces of world heritage.",
        insiderTip: "Walk to the central water pavilion (Hauz-i-Kawsar) early morning to capture the iconic reflection of the central dome with zero crowds.",
        estimatedTime: "3 – 4 hours",
        entryCost: "₹50 (Indian citizens) / ₹1,100 (~$13 USD foreign tourists)",
        rating: 4.9,
        reviewsCount: 198000,
        coordinates: { lat: 27.1751, lng: 78.0421 }
      },
      {
        id: "agra-fort",
        name: "Agra Fort (Red Fort of Agra)",
        category: "Imperial Red Sandstone Citadel",
        wikiTitle: "Agra_Fort",
        image: "./assets/images/agra_fort.jpg",
        description: "A monumental 16th-century Mughal fortress of red sandstone encompassing grand audience halls, marble mosques, and royal quarters.",
        whyVisit: "Stand on the marble balcony of the Musamman Burj tower where Shah Jahan spent his final years gazing at the Taj Mahal.",
        insiderTip: "Enter through the monumental Amar Singh Gate and explore the Sheesh Mahal (Palace of Mirrors).",
        estimatedTime: "2 – 3 hours",
        entryCost: "₹50 (Indian) / ₹650 (~$8 foreign)",
        rating: 4.8,
        reviewsCount: 92000,
        coordinates: { lat: 27.1795, lng: 78.0211 }
      },
      {
        id: "fatehpur-sikri",
        name: "Fatehpur Sikri & Buland Darwaza",
        category: "Mughal Imperial Ghost City",
        wikiTitle: "Fatehpur_Sikri",
        image: "./assets/images/fatehpur_sikri.jpg",
        description: "Emperor Akbar's short-lived capital city founded in 1571, crowned by Buland Darwaza (the 54-meter Door of Victory) and the white marble tomb of Salim Chishti.",
        whyVisit: "One of the best-preserved royal architectural complexes from the Mughal golden age.",
        insiderTip: "Tie a sacred red thread on the carved marble jali screens of Sheikh Salim Chishti's shrine for good fortune.",
        estimatedTime: "3 – 4 hours (Day trip 37 km from Agra)",
        entryCost: "₹50 (Indian) / ₹610 (~$7.50 foreign)",
        rating: 4.7,
        reviewsCount: 68000,
        coordinates: { lat: 27.0945, lng: 77.6679 }
      },
      {
        id: "mehtab-bagh",
        name: "Mehtab Bagh (Moonlight Garden)",
        category: "Mughal Riverfront Garden",
        wikiTitle: "Mehtab_Bagh",
        image: "./assets/images/mehtab_bagh.jpg",
        description: "A charbagh garden complex situated on the opposite northern bank of the Yamuna River, perfectly aligned with the Taj Mahal.",
        whyVisit: "Provides the ultimate uncrowded panoramic viewpoint of the rear facade of the Taj Mahal glowing in evening sunset light.",
        insiderTip: "Arrive 45 minutes before sunset for ethereal silhouette photography across the tranquil Yamuna waters.",
        estimatedTime: "1 – 1.5 hours",
        entryCost: "₹25 (Indian) / ₹300 (~$3.60 foreign)",
        rating: 4.6,
        reviewsCount: 41000,
        coordinates: { lat: 27.1800, lng: 78.0436 }
      }
    ]
  },
  {
    id: "jaipur-india",
    name: "Jaipur",
    country: "India",
    continent: "Asia",
    tagline: "The Pink City of Maharajas, Forts, and Desert Splendor",
    summary: "Capital of Rajasthan, famed for terracotta-pink stone facades, hilltop forts, grand palaces, astronomical observatories, and vibrant bazaars.",
    fullDescription: "Founded in 1727 by Maharaja Sawai Jai Singh II, Jaipur is India's first planned city. Painted in a distinctive terracotta pink in 1876 to welcome the Prince of Wales, it remains one of the world's most photogenic royal destinations. From the honeycombed screens of Hawa Mahal to the colossal Amber Fort overlooking Maota Lake, Jaipur pulses with royal chivalry and vibrant Rajasthani culture.",
    coordinates: { lat: 26.9124, lng: 75.7873 },
    heroImage: "./assets/images/hawa_mahal.jpg",
    imageKeywords: ["jaipur pink city amber fort", "hawa mahal palace of winds", "jal mahal jaipur"],
    region: "Rajasthan",
    vibes: ["Cultural", "Romantic", "Foodie"],
    budget: "$",
    budgetDailyEstimate: 50,
    currency: "INR (₹)",
    language: "Hindi, Rajasthani, English",
    bestTimeToVisit: "October–March (Mild days and cool desert evenings)",
    idealDuration: "3 to 5 days",
    safetyRating: "4.4/5 (High - tourist-friendly police)",
    timeZone: "GMT+5:30 (IST)",
    localCuisine: [
      "Dal Baati Churma with Pure Desi Ghee",
      "Laal Maas (Spicy Rajasthani mutton curry)",
      "Rawat Mishthan Bhandar Pyaaz Kachori",
      "Traditional Ghevar sweet topped with saffron malai"
    ],
    travelTips: [
      "Buy a composite tourist ticket at Amber Fort to save up to 60% on all Jaipur monuments.",
      "Hire an e-rickshaw to navigate through the crowded, colorful lanes of Johari Bazaar and Bapu Bazaar.",
      "Drive up to Nahargarh Fort at sunset for panoramic views of the entire illuminated Pink City below."
    ],
    localPhrases: [
      { phrase: "Khamma Ghani", native: "खम्मा घणी", english: "Traditional royal Rajasthani greeting", phonetic: "KHAM-mah GHUHN-ee", lang: "hi-IN" },
      { phrase: "Dhanyawad", native: "धन्यवाद", english: "Thank you", phonetic: "DHUHN-yuh-vahd", lang: "hi-IN" },
      { phrase: "Sahi daam batao", native: "सही दाम बताओ", english: "Give me the fair/honest price", phonetic: "SUH-hee DAHM buh-TAH-oh", lang: "hi-IN" },
      { phrase: "Swadisht khana hai!", native: "स्वादिष्ट खाना है!", english: "The food is delicious!", phonetic: "swah-DISHT KHAH-nuh hye", lang: "hi-IN" }
    ],
    famousPlaces: [
      {
        id: "amber-fort",
        name: "Amber Palace & Fort (Amer Fort)",
        category: "Hilltop UNESCO Fortress",
        wikiTitle: "Amer_Fort",
        image: "./assets/images/amber_fort.jpg",
        description: "A monumental 16th-century fortress of yellow and pink sandstone, built on the rugged Cheel ka Teela hill overlooking Maota Lake.",
        whyVisit: "Features the legendary Sheesh Mahal (Hall of Mirrors) where a single candle flame illuminates the entire chamber through convex mirror inlays.",
        insiderTip: "Walk through the secret underground tunnel connecting Amber Fort to Jaigarh Fort at the mountain peak.",
        estimatedTime: "3 – 4 hours",
        entryCost: "₹100 (Indian) / ₹500 (~$6 foreign)",
        rating: 4.9,
        reviewsCount: 135000,
        coordinates: { lat: 26.9855, lng: 75.8513 }
      },
      {
        id: "hawa-mahal",
        name: "Hawa Mahal (Palace of Winds)",
        category: "Royal Architectural Icon",
        wikiTitle: "Hawa_Mahal",
        image: "./assets/images/hawa_mahal.jpg",
        description: "A five-story pink sandstone pyramid with 953 intricately carved jharokha latticed windows, designed in 1799 for royal women to observe street processions unseen.",
        whyVisit: "The supreme symbol of Jaipur's architectural genius, resembling the crown of Lord Krishna.",
        insiderTip: "Visit The Tattoo Cafe & Lounge or Wind View Cafe directly opposite the street for the best rooftop photography angle.",
        estimatedTime: "1 – 1.5 hours",
        entryCost: "₹50 (Indian) / ₹200 (~$2.40 foreign)",
        rating: 4.7,
        reviewsCount: 118000,
        coordinates: { lat: 26.9239, lng: 75.8267 }
      },
      {
        id: "city-palace-jaipur",
        name: "City Palace & Jantar Mantar",
        category: "Royal Residence & Astronomical Observatory",
        wikiTitle: "City_Palace,_Jaipur",
        image: "./assets/images/city_palace.jpg",
        description: "A sprawling complex of courtyards, gardens, and palaces where the royal family of Jaipur still resides, paired with the world's largest stone astronomical observatory.",
        whyVisit: "Admire the famous Peacock Gate in Pritam Niwas Chowk and the world's largest sundial at Jantar Mantar.",
        insiderTip: "Book the Chandra Mahal private tour to visit the inner rooms and royal living spaces preserved in lavish opulence.",
        estimatedTime: "2.5 – 3.5 hours",
        entryCost: "₹200 (Indian) / ₹700 (~$8.50 foreign)",
        rating: 4.8,
        reviewsCount: 88000,
        coordinates: { lat: 26.9258, lng: 75.8237 }
      },
      {
        id: "jal-mahal",
        name: "Jal Mahal (The Water Palace)",
        category: "Lake Palace",
        wikiTitle: "Jal_Mahal",
        image: "./assets/images/landmarks/jal_mahal_water_palace_jaipur.jpg",
        description: "A stunning five-story Rajput-style palace situated in the middle of Man Sagar Lake, with four stories submerged underwater when the lake is full.",
        whyVisit: "The glowing red sandstone palace appears to float magically on the lake against the backdrop of the Aravalli hills.",
        insiderTip: "Stroll along the lakeside promenade in the evening when local street performers play folk music and the palace is illuminated with golden spotlights.",
        estimatedTime: "1 hour",
        entryCost: "Free to view from promenade",
        rating: 4.6,
        reviewsCount: 72000,
        coordinates: { lat: 26.9535, lng: 75.8462 }
      }
    ]
  },
  {
    id: "kerala-india",
    name: "Kerala",
    country: "India",
    continent: "Asia",
    tagline: "God's Own Country: Backwaters, Tea Hills, and Spice Coast",
    summary: "A tropical coastal paradise celebrated for serene palm-fringed backwaters, misty mountain tea plantations, Ayurvedic wellness, and Kathakali dance.",
    fullDescription: "Stretching along India's tropical Malabar Coast, Kerala is universally acclaimed as 'God's Own Country'. Drift through tranquil emerald backwater lagoons aboard a traditional thatch-roofed kettuvallam houseboat in Alleppey, breathe the crisp mountain air amidst carpeted green tea estates in Munnar, and watch historic Chinese fishing nets dip into the Arabian Sea in Fort Kochi.",
    coordinates: { lat: 9.4981, lng: 76.3388 },
    heroImage: "./assets/images/alleppey_backwaters.jpg",
    imageKeywords: ["kerala backwaters houseboat", "munnar tea plantations", "fort kochi fishing nets"],
    region: "South India",
    vibes: ["Mountain & Nature", "Romantic", "Beach", "Foodie", "Spiritual"],
    budget: "$",
    budgetDailyEstimate: 55,
    currency: "INR (₹)",
    language: "Malayalam, English",
    bestTimeToVisit: "September–March (Pleasant coastal breezes) & June–Aug (Ayurveda Monsoon)",
    idealDuration: "5 to 8 days",
    safetyRating: "4.8/5 (Highest literacy & very welcoming)",
    timeZone: "GMT+5:30 (IST)",
    localCuisine: [
      "Traditional Kerala Sadya on Fresh Banana Leaf (24+ vegetarian delicacies)",
      "Karimeen Pollichathu (Pearl spot fish marinated in masala and wrapped in banana leaf)",
      "Fluffy Appam with Creamy Vegetable or Chicken Stew",
      "Malabar Layered Parotta with Beef or Paneer Roast"
    ],
    travelTips: [
      "Book an overnight houseboat cruise in Alleppey with all meals freshly caught and prepared onboard.",
      "Experience an authentic Kathakali classical dance and Kalaripayattu martial arts performance in Fort Kochi.",
      "Carry light woolens if visiting Munnar or Wayanad hills, where evening temperatures can drop."
    ],
    localPhrases: [
      { phrase: "Namaskaram", native: "നമസ്കാരം", english: "Traditional Malayalam respectful greeting", phonetic: "nuh-muh-skah-ruhm", lang: "ml-IN" },
      { phrase: "Valare nanni", native: "വളരെ നന്ദി", english: "Thank you very much", phonetic: "VUH-luh-ray NUHN-nee", lang: "ml-IN" },
      { phrase: "Ithinu ethraya vila?", native: "ഇതിനെത്ര വില?", english: "How much does this cost?", phonetic: "ee-THIN-oo ETH-ruh-yah VEE-luh", lang: "ml-IN" },
      { phrase: "Kollam! Nalla ruchiyundu", native: "കൊള്ളാം! നല്ല രുചിയുണ്ട്", english: "Awesome! Very delicious food", phonetic: "KOH-luhm! NUHL-luh roo-CHEE-yoon-doo", lang: "ml-IN" }
    ],
    famousPlaces: [
      {
        id: "alleppey-backwaters",
        name: "Alleppey Backwaters (Alappuzha)",
        category: "Tropical Canal Network",
        wikiTitle: "Alappuzha",
        image: "./assets/images/alleppey_backwaters.jpg",
        description: "A labyrinthine network of interconnected lagoons, lakes, and palm-shaded canals parallel to the Arabian Sea coast.",
        whyVisit: "Drift past floating lotus blooms and village life aboard a private eco-friendly kettuvallam wooden houseboat.",
        insiderTip: "Take the 2-hour government village ferry (SWTD) for just ₹25 for an authentic non-touristy journey through narrow canals.",
        estimatedTime: "Full day / Overnight cruise",
        entryCost: "Houseboat: ₹7,000–₹12,000/night (~$85–$140 USD)",
        rating: 4.9,
        reviewsCount: 96000,
        coordinates: { lat: 9.4981, lng: 76.3388 }
      },
      {
        id: "munnar-tea-gardens",
        name: "Munnar Hills & Eravikulam National Park",
        category: "Mountain Tea Plantations & Wildlife",
        wikiTitle: "Munnar",
        image: "./assets/images/munnar_tea.jpg",
        description: "Rolling mist-shrouded emerald hills covered in manicured tea gardens at 1,600 meters altitude, home to the endangered Nilgiri Tahr mountain goat.",
        whyVisit: "Breathtaking green valleys, cascading mountain waterfalls, and crisp high-altitude air.",
        insiderTip: "Visit Top Station on the border of Kerala and Tamil Nadu for panoramic views above floating clouds.",
        estimatedTime: "1 – 2 days",
        entryCost: "Park: ₹200 (Indian) / ₹500 (~$6 foreign)",
        rating: 4.9,
        reviewsCount: 84000,
        coordinates: { lat: 10.0889, lng: 77.0595 }
      },
      {
        id: "fort-kochi-nets",
        name: "Fort Kochi & Chinese Fishing Nets",
        category: "Historic Maritime Quarter",
        wikiTitle: "Fort_Kochi",
        image: "./assets/images/chinese_fishing_nets.jpg",
        description: "A seaside colonial enclave featuring giant cantilevered Chinese fishing nets (Cheena Vala) introduced by 14th-century explorer Zheng He.",
        whyVisit: "Walk cobblestone streets lined with Portuguese churches, Dutch palaces, Jewish synagogues, and bohemian art cafes.",
        insiderTip: "Buy fresh catch directly from local fishermen at sunset and have the street shacks grill it with spiced Kerala masala.",
        estimatedTime: "2.5 – 4 hours",
        entryCost: "Free to explore",
        rating: 4.7,
        reviewsCount: 65000,
        coordinates: { lat: 9.9658, lng: 76.2425 }
      },
      {
        id: "marari-beach",
        name: "Marari Beach & Coastal Groves",
        category: "Quiet Coconut Beach",
        wikiTitle: "Marari_Beach",
        image: "./assets/images/landmarks/marari_beach_kerala.jpg",
        description: "An unspoiled golden sand beach fringed by deep coconut palm groves and traditional fishing hamlets, away from crowded tourist hubs.",
        whyVisit: "The ideal sanctuary for relaxation, Ayurvedic rejuvenation massage, and witnessing local fishermen launch wooden boats at dawn.",
        insiderTip: "Enjoy fresh tender coconut and fresh seafood curry at an eco-resort shack overlooking the Arabian Sea sunset.",
        estimatedTime: "Half day or full day",
        entryCost: "Free",
        rating: 4.8,
        reviewsCount: 39000,
        coordinates: { lat: 9.6011, lng: 76.2974 }
      }
    ]
  },
  {
    id: "goa-india",
    name: "Goa",
    country: "India",
    continent: "Asia",
    tagline: "The Sunshine Coast of Golden Beaches, Susegad, and Heritage",
    summary: "India's beloved coastal haven, offering a fusion of Portuguese colonial architecture, sun-kissed surf beaches, spice plantations, and vibrant nightlife.",
    fullDescription: "Goa is a coastal wonderland shaped by over 450 years of Portuguese rule. Here, the relaxed concept of 'susegad' (a contented, unhurried pace of life) permeates every sunlit day. From the pristine turquoise bays of South Goa like Palolem to the historic baroque churches of Velha Goa and vibrant beach shacks of the north, Goa is India's ultimate holiday getaway.",
    coordinates: { lat: 15.2993, lng: 74.1240 },
    heroImage: "./assets/images/palolem_beach.jpg",
    imageKeywords: ["goa beach palm trees", "palolem beach goa", "dudhsagar waterfall"],
    region: "Konkan Coast",
    vibes: ["Beach", "Adventure", "Foodie", "Romantic"],
    budget: "$",
    budgetDailyEstimate: 50,
    currency: "INR (₹)",
    language: "Konkani, English, Hindi",
    bestTimeToVisit: "November–March (Sunny skies and gentle sea breezes)",
    idealDuration: "4 to 7 days",
    safetyRating: "4.7/5 (Very High for solo & international travelers)",
    timeZone: "GMT+5:30 (IST)",
    localCuisine: [
      "Goan Fish Curry with Steamed Rice (Infused with kokum and coconut)",
      "Chicken Xacuti & Pork Vindaloo",
      "Fresh Prawn Balchão & Butter Garlic Crab",
      "Traditional Multi-Layered Bebinca Cake"
    ],
    travelTips: [
      "Rent a scooter or car to explore South Goa's quiet hidden coves at your own leisure.",
      "Visit Old Goa churches in the morning when the morning light streams through antique stained-glass windows.",
      "Head to Cola Beach to swim in an emerald freshwater lagoon separated from the ocean by a narrow sandbar."
    ],
    localPhrases: [
      { phrase: "Deu boro dis dium", native: "देव बरो दीस दींव", english: "Good day / May God give you a good day (Konkani)", phonetic: "day-oo BOH-roh dees dee-oom", lang: "kok-IN" },
      { phrase: "Dev borem korum", native: "देव बरें करूं", english: "Thank you / God bless you (Konkani)", phonetic: "DAY-oo BOH-rem KOH-room", lang: "kok-IN" },
      { phrase: "Kitlem zalem?", native: "कितलें जालें?", english: "How much does it cost?", phonetic: "kit-LEM ZAH-lem", lang: "kok-IN" },
      { phrase: "Borem laglem!", native: "बरें लागलें!", english: "It was wonderful / delicious!", phonetic: "BOH-rem LAHG-lem", lang: "kok-IN" }
    ],
    famousPlaces: [
      {
        id: "basilica-bom-jesus",
        name: "Basilica of Bom Jesus & Se Cathedral",
        category: "UNESCO Portuguese Baroque Heritage",
        wikiTitle: "Basilica_of_Bom_Jesus",
        image: "./assets/images/basilica_bom_jesus.jpg",
        description: "A 16th-century Portuguese baroque basilica holding the sacred mortal remains of St. Francis Xavier in a silver casket inside a lavish mausoleum.",
        whyVisit: "One of the oldest churches in India and a landmark of world Christian pilgrimage and architecture.",
        insiderTip: "Cross the lawn to Se Cathedral to see the famous Golden Bell, the largest bell in Asia.",
        estimatedTime: "2 – 3 hours",
        entryCost: "Free",
        rating: 4.8,
        reviewsCount: 82000,
        coordinates: { lat: 15.5009, lng: 73.9116 }
      },
      {
        id: "palolem-beach",
        name: "Palolem Beach & Butterfly Beach",
        category: "Scenic Crescent Bay",
        wikiTitle: "Palolem_Beach",
        image: "./assets/images/palolem_beach.jpg",
        description: "A picture-perfect 1.5 km crescent bay of calm turquoise waters fringed by leaning coconut palms and colorful wooden beach huts.",
        whyVisit: "Gentle shallow waves make it the safest and most scenic swimming beach in all of Goa.",
        insiderTip: "Hire a sea kayak early in the morning to paddle around Canacona Island and spot wild dolphins.",
        estimatedTime: "Half day or full day",
        entryCost: "Free",
        rating: 4.8,
        reviewsCount: 76000,
        coordinates: { lat: 15.0100, lng: 74.0232 }
      },
      {
        id: "dudhsagar-falls",
        name: "Dudhsagar Waterfalls",
        category: "Four-Tiered Natural Waterfall",
        wikiTitle: "Dudhsagar_Falls",
        image: "./assets/images/landmarks/dudhsagar_waterfalls_railway_bridge.jpg",
        description: "A colossal 310-meter four-tiered waterfall on the Mandovi River resembling a cascading 'Sea of Milk' roaring through the Bhagwan Mahaveer Sanctuary.",
        whyVisit: "Witness trains rumble across the historic railway arched bridge directly across the waterfall spray.",
        insiderTip: "Take an open jeep safari through the jungle stream crossings to swim in the natural plunge pool below.",
        estimatedTime: "Day trip (5 – 6 hours from coast)",
        entryCost: "Jeep safari: ₹500–₹600/person (~$7 USD)",
        rating: 4.8,
        reviewsCount: 64000,
        coordinates: { lat: 15.3144, lng: 74.3143 }
      },
      {
        id: "fort-aguada",
        name: "Fort Aguada & Lighthouse",
        category: "17th-Century Coastal Fort",
        wikiTitle: "Aguada_Fort",
        image: "./assets/images/fort_aguada.jpg",
        description: "A well-preserved Portuguese fort built in 1612 to protect against the Dutch and Marathas, featuring a four-tiered freshwater cistern and 19th-century lighthouse.",
        whyVisit: "Spectacular sweeping views over Sinquerim Beach and the mouth of the Mandovi River joining the Arabian Sea.",
        insiderTip: "Visit Lower Aguada along the rocky shoreline at sunset for dramatic wave splashes against ancient stone walls.",
        estimatedTime: "1.5 – 2 hours",
        entryCost: "₹25 (Indian) / ₹300 (~$3.60 foreign)",
        rating: 4.7,
        reviewsCount: 71000,
        coordinates: { lat: 15.4927, lng: 73.7736 }
      }
    ]
  }
];

// Map of all searched / external locations, kept strictly separate from the front page
export const SEARCHED_DESTINATIONS = new Map();

// Helper to look up any destination (either from front-page 17 or searched locations)
export function getDestinationById(id) {
  if (!id) return null;
  const cleanId = String(id).toLowerCase().trim();

  // 1. Direct front-page match
  const front = DESTINATIONS.find((d) => 
    d.id.toLowerCase() === cleanId || 
    d.name.toLowerCase() === cleanId ||
    cleanId.startsWith(d.id.toLowerCase()) ||
    d.id.toLowerCase().startsWith(cleanId)
  );
  if (front) return front;

  // 2. Match in INDIAN_STATES_REGISTRY (Verified Authentic Regional Registry)
  for (const [key, stateObj] of Object.entries(INDIAN_STATES_REGISTRY)) {
    if (
      key.toLowerCase() === cleanId ||
      stateObj.id.toLowerCase() === cleanId ||
      stateObj.name.toLowerCase() === cleanId ||
      cleanId.startsWith(key.toLowerCase()) ||
      cleanId.startsWith(stateObj.name.toLowerCase()) ||
      cleanId.includes(stateObj.name.toLowerCase()) ||
      stateObj.name.toLowerCase().includes(cleanId)
    ) {
      return stateObj;
    }
  }

  // 3. Direct map match in SEARCHED_DESTINATIONS
  if (SEARCHED_DESTINATIONS.has(id)) return SEARCHED_DESTINATIONS.get(id);

  // 4. Case-insensitive / slug-matched search in SEARCHED_DESTINATIONS
  for (const [key, val] of SEARCHED_DESTINATIONS.entries()) {
    if (
      key.toLowerCase() === cleanId ||
      val.id.toLowerCase() === cleanId ||
      val.name.toLowerCase() === cleanId ||
      cleanId.startsWith(key.toLowerCase()) ||
      key.toLowerCase().startsWith(cleanId) ||
      cleanId.includes(val.name.toLowerCase()) ||
      val.name.toLowerCase().includes(cleanId)
    ) {
      return val;
    }
  }

  return null;
}

// Get all destinations available for trips/itineraries (Front page + Searched)
export function getAllAvailableDestinations() {
  return [
    ...DESTINATIONS,
    ...Object.values(INDIAN_STATES_REGISTRY),
    ...Array.from(SEARCHED_DESTINATIONS.values())
  ];
}

// Register and persist newly searched locations (NOT added to front-page DESTINATIONS)
export function registerSearchedDestination(newDest) {
  if (!newDest || !newDest.id) return null;
  SEARCHED_DESTINATIONS.set(newDest.id, newDest);

  try {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("voyage_searched_locations");
      const list = saved ? JSON.parse(saved) : [];
      const idx = list.findIndex((d) => d.id === newDest.id);
      if (idx >= 0) {
        list[idx] = newDest;
      } else {
        list.push(newDest);
      }
      localStorage.setItem("voyage_searched_locations", JSON.stringify(list));
    }
  } catch (e) {
    console.warn("Could not save searched destination to storage:", e);
  }

  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function" && typeof CustomEvent !== "undefined") {
    window.dispatchEvent(new CustomEvent("voyage:searched-destinations-updated", { detail: newDest }));
  }
  return newDest;
}

// Backwards compatibility alias
export function registerDestination(newDest) {
  return registerSearchedDestination(newDest);
}

// Load previously searched locations from localStorage
export function loadSavedSearchedDestinations() {
  try {
    if (typeof localStorage !== "undefined") {
      // Versioned cache invalidation so stale or broken image URLs are completely wiped
      const CURRENT_CACHE_VERSION = "v8_google_arts_verified_landmarks";
      if (localStorage.getItem("voyage_cache_ver") !== CURRENT_CACHE_VERSION) {
        localStorage.removeItem("voyage_searched_locations");
        localStorage.removeItem("voyage_custom_destinations");
        localStorage.setItem("voyage_cache_ver", CURRENT_CACHE_VERSION);
        SEARCHED_DESTINATIONS.clear();
        return;
      }

      localStorage.removeItem("voyage_custom_destinations");

      const saved = localStorage.getItem("voyage_searched_locations");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach((d) => {
            if (d && d.id) {
              SEARCHED_DESTINATIONS.set(d.id, d);
            }
          });
        }
      }
    }
  } catch (e) {
    console.warn("Could not load searched destinations from storage:", e);
  }
}

// Automatically load searched destinations on boot
loadSavedSearchedDestinations();

