// Traveler's Essential Telemetry & 12-Month Seasonality Engine for MargaDarshi
// Provides electrical plugs, tap water safety, tipping culture, emergency numbers, visa info & seasonality matrices

export class TelemetryService {
  constructor() {
    this.registry = {
      "Japan": {
        plugs: {
          types: ["Type A", "Type B"],
          voltage: "100V",
          frequency: "50Hz (East) / 60Hz (West)",
          summary: "Two flat parallel pins (Type A). Needs universal adapter if your gear uses 3 pins or 230V."
        },
        tapWater: {
          safe: true,
          status: "100% Safe to Drink",
          grade: "Excellent",
          notes: "Municipal tap water in Japan is among the cleanest in the world. Safe from all taps and hotels."
        },
        tipping: {
          norm: "Strictly Not Customary",
          percentage: "0%",
          notes: "Tipping is not practiced and can cause confusion or even offense. Exceptional service is standard and included."
        },
        emergency: {
          police: "110",
          ambulanceFire: "119",
          touristHelpline: "+81 3-3201-3331 (JNTO 24/7 in English)",
          general: "110"
        },
        visa: {
          type: "Visa-Free / eVisa (68 Countries)",
          duration: "Up to 90 Days",
          notes: "US, UK, EU, Canada, Australia get 90-day visa-free tourist entry. Complete Visit Japan Web digital customs before arrival."
        },
        transit: {
          card: "IC Card (Suica, Pasmo, or ICOCA)",
          notes: "Usable on subways, buses, convenience stores, and vending machines nationwide."
        },
        seasonality: {
          bestMonths: "March – May & October – November",
          currentSeasonName: (month) => {
            if ([2, 3, 4].includes(month)) return { season: "Peak Season", tag: "Cherry Blossoms & Mild Spring", color: "emerald" };
            if ([9, 10].includes(month)) return { season: "Peak Season", tag: "Vivid Autumn Foliage", color: "emerald" };
            if ([5, 8].includes(month)) return { season: "Shoulder Season", tag: "Early Summer & Autumn Transition", color: "amber" };
            if ([6, 7].includes(month)) return { season: "Low / Rainy Season", tag: "Tsuyu Monsoon & High Humidity", color: "cyan" };
            return { season: "Low Season", tag: "Crisp Winter (Clear Mt Fuji Views)", color: "slate" };
          },
          months: [
            { name: "Jan", temp: "5°C / 41°F", status: "low", crowds: "Low", desc: "Chilly & crisp; clear skies, lowest crowds." },
            { name: "Feb", temp: "6°C / 43°F", status: "low", crowds: "Moderate", desc: "Plum blossoms start; ski season peak." },
            { name: "Mar", temp: "10°C / 50°F", status: "shoulder", crowds: "Rising", desc: "Early cherry blossoms bloom in late March." },
            { name: "Apr", temp: "15°C / 59°F", status: "peak", crowds: "High", desc: "Iconic Sakura season. High crowds and gorgeous parks." },
            { name: "May", temp: "20°C / 68°F", status: "peak", crowds: "High", desc: "Pleasant green season and mild sunny days." },
            { name: "Jun", temp: "23°C / 73°F", status: "low", crowds: "Moderate", desc: "Tsuyu rainy season begins; lush gardens." },
            { name: "Jul", temp: "27°C / 81°F", status: "low", crowds: "High", desc: "Hot & humid; summer festivals and fireworks." },
            { name: "Aug", temp: "29°C / 84°F", status: "low", crowds: "High", desc: "Midsummer heat; beach trips & Obon holiday." },
            { name: "Sep", temp: "25°C / 77°F", status: "shoulder", crowds: "Moderate", desc: "Temperatures cool down; occasional typhoons." },
            { name: "Oct", temp: "19°C / 66°F", status: "peak", crowds: "High", desc: "Prime autumn foliage starts; spectacular weather." },
            { name: "Nov", temp: "13°C / 55°F", status: "peak", crowds: "High", desc: "Peak vibrant Momiji maple colors & temple illuminations." },
            { name: "Dec", temp: "8°C / 46°F", status: "low", crowds: "Moderate", desc: "Winter illuminations, Christmas markets, crisp air." }
          ]
        }
      },
      "France": {
        plugs: {
          types: ["Type C", "Type E"],
          voltage: "230V",
          frequency: "50Hz",
          summary: "Standard Europlug (two round pins). US/UK devices require an adapter."
        },
        tapWater: {
          safe: true,
          status: "100% Safe to Drink",
          grade: "Excellent",
          notes: "Eau potable from all taps and public drinking fountains (Wallace Fountains in Paris) is clean and fresh."
        },
        tipping: {
          norm: "Service Included (Pourboire optional)",
          percentage: "Round up or 5–10%",
          notes: "A 15% service charge ('service compris') is legally included on all restaurant bills. Leaving €1–€2 for good bistro service is customary."
        },
        emergency: {
          police: "17",
          ambulanceFire: "15 (SAMU) / 18 (Pompiers)",
          touristHelpline: "112 (EU Universal Hotline in English)",
          general: "112"
        },
        visa: {
          type: "Schengen Visa (90/180 Rule)",
          duration: "90 Days",
          notes: "Schengen area member. US, Canada, Australia, UK, and Japan passports do not require a tourist visa for stays up to 90 days."
        },
        transit: {
          card: "Navigo Easy / Île-de-France Mobilités",
          notes: "Rechargeable contactless card for Paris Metro, RER trains, buses, and trams."
        },
        seasonality: {
          bestMonths: "April – June & September – October",
          currentSeasonName: (month) => {
            if ([3, 4, 5, 8, 9].includes(month)) return { season: "Peak Season", tag: "Golden Spring & Warm Autumn", color: "emerald" };
            if ([6, 7].includes(month)) return { season: "Peak / Crowded", tag: "High Summer & Heavy Tourist Flow", color: "amber" };
            return { season: "Low Season", tag: "Winter Culture & Museum Season", color: "slate" };
          },
          months: [
            { name: "Jan", temp: "5°C / 41°F", status: "low", crowds: "Low", desc: "Winter sales, quiet museums, chilly strolls." },
            { name: "Feb", temp: "6°C / 43°F", status: "low", crowds: "Low", desc: "Romantic winter ambience; quiet landmarks." },
            { name: "Mar", temp: "10°C / 50°F", status: "shoulder", crowds: "Moderate", desc: "Spring thaw begins; gardens start blooming." },
            { name: "Apr", temp: "14°C / 57°F", status: "peak", crowds: "Moderate", desc: "Cherry blossoms by the Eiffel Tower & outdoor cafe terraces open." },
            { name: "May", temp: "18°C / 64°F", status: "peak", crowds: "High", desc: "Glorious long daylight hours, pleasant temperatures." },
            { name: "Jun", temp: "22°C / 72°F", status: "peak", crowds: "High", desc: "Fête de la Musique, vibrant Seine riverbanks." },
            { name: "Jul", temp: "25°C / 77°F", status: "peak", crowds: "Very High", desc: "Bastille Day fireworks, summer peak crowds." },
            { name: "Aug", temp: "25°C / 77°F", status: "shoulder", crowds: "High", desc: "Many local shops close for holidays; open outdoor cinema." },
            { name: "Sep", temp: "21°C / 70°F", status: "peak", crowds: "High", desc: "La Rentrée; wonderful weather, grape harvest." },
            { name: "Oct", temp: "16°C / 61°F", status: "peak", crowds: "Moderate", desc: "Golden foliage in Luxembourg Gardens, pleasant jacket weather." },
            { name: "Nov", temp: "10°C / 50°F", status: "low", crowds: "Low", desc: "Crisp autumn, lowest queues for Louvre & Orsay." },
            { name: "Dec", temp: "6°C / 43°F", status: "shoulder", crowds: "Moderate", desc: "Festive Christmas markets, illuminated Champs-Élysées." }
          ]
        }
      },
      "Italy": {
        plugs: {
          types: ["Type C", "Type F", "Type L"],
          voltage: "230V",
          frequency: "50Hz",
          summary: "Round pin Europlug (Type C/F) and Italian 3-inline pin (Type L). Europlug fits all modern sockets."
        },
        tapWater: {
          safe: true,
          status: "100% Safe to Drink",
          grade: "Excellent",
          notes: "Fresh alpine & aqueduct water flows freely from historic public fountains ('Nasoni' in Rome). Completely safe."
        },
        tipping: {
          norm: "Optional / Coperto Included",
          percentage: "€1–€2 per person or 5–10%",
          notes: "Most restaurants include 'Coperto' (bread & cover charge, €1–€3). Tipping is not expected, but small coins for exceptional service are appreciated."
        },
        emergency: {
          police: "113 / 112",
          ambulanceFire: "118 (Ambulance) / 115 (Fire)",
          touristHelpline: "112 (EU Universal Hotline in English)",
          general: "112"
        },
        visa: {
          type: "Schengen Visa (90 Days)",
          duration: "90 Days",
          notes: "Schengen area rules apply. 90 days visa-free for citizens of USA, UK, Canada, Australia, etc."
        },
        transit: {
          card: "Contactless / Trenitalia & ATAC Metrebus",
          notes: "Tap credit card directly on Rome/Milan turnstiles or purchase multi-day transit passes."
        },
        seasonality: {
          bestMonths: "April – June & September – October",
          currentSeasonName: (month) => {
            if ([3, 4, 5, 8, 9].includes(month)) return { season: "Peak Season", tag: "Prime Sightseeing & Warm Sunshine", color: "emerald" };
            if ([6, 7].includes(month)) return { season: "Peak / Hot", tag: "High Summer Sun & Ferragosto", color: "amber" };
            return { season: "Low Season", tag: "Mild Winter & Peaceful Monuments", color: "slate" };
          },
          months: [
            { name: "Jan", temp: "10°C / 50°F", status: "low", crowds: "Low", desc: "Mild Mediterranean winter; no lines at Colosseum." },
            { name: "Feb", temp: "11°C / 52°F", status: "low", crowds: "Low", desc: "Venice Carnival season; crisp sunshine." },
            { name: "Mar", temp: "15°C / 59°F", status: "shoulder", crowds: "Moderate", desc: "Spring blossoms appear across piazza gardens." },
            { name: "Apr", temp: "18°C / 64°F", status: "peak", crowds: "High", desc: "Easter festivities, sunny outdoor dining." },
            { name: "May", temp: "23°C / 73°F", status: "peak", crowds: "High", desc: "Perfection: warm days, blooming roses, gelato season." },
            { name: "Jun", temp: "27°C / 81°F", status: "peak", crowds: "High", desc: "Early summer warmth; open air opera and concerts." },
            { name: "Jul", temp: "31°C / 88°F", status: "low", crowds: "Very High", desc: "Intense midday heat; stay hydrated at nasoni fountains." },
            { name: "Aug", temp: "31°C / 88°F", status: "low", crowds: "High", desc: "Ferragosto holiday; locals head to coastlines." },
            { name: "Sep", temp: "26°C / 79°F", status: "peak", crowds: "High", desc: "Grape harvest season, pleasant balmy evenings." },
            { name: "Oct", temp: "21°C / 70°F", status: "peak", crowds: "Moderate", desc: "Mild autumn, golden light over historic ruins." },
            { name: "Nov", temp: "15°C / 59°F", status: "low", crowds: "Low", desc: "Truffle and olive oil season; quiet galleries." },
            { name: "Dec", temp: "11°C / 52°F", status: "shoulder", crowds: "Moderate", desc: "Nativity scenes, roasted chestnuts, Piazza Navona market." }
          ]
        }
      },
      "India": {
        plugs: {
          types: ["Type C", "Type D", "Type M"],
          voltage: "230V",
          frequency: "50Hz",
          summary: "Type D (three round pins in triangle) and Type C (two round pins). Universal travel adapter recommended."
        },
        tapWater: {
          safe: false,
          status: "Bottled / Filtered Water Advised",
          grade: "Requires Precaution",
          notes: "Drink sealed bottled mineral water (Kinley, Aquafina, Bisleri) or certified RO-filtered water. Avoid unfiltered street ice."
        },
        tipping: {
          norm: "Customary & Appreciated",
          percentage: "7% – 10% in Restaurants",
          notes: "Check if a 10% 'Service Charge' is on the bill. If not, leaving 5–10% for waitstaff and ₹50–₹100 for hotel porters is standard courtesy."
        },
        emergency: {
          police: "112 / 100",
          ambulanceFire: "108 / 102 (Ambulance) / 101 (Fire)",
          touristHelpline: "1363 (24/7 National Tourist Helpline, multi-language)",
          general: "112"
        },
        visa: {
          type: "Indian e-Tourist Visa (Online)",
          duration: "30 Days / 1 Year / 5 Years",
          notes: "Citizens of over 165 countries can apply for a quick online e-Visa at least 4 days prior to travel. Fast and digital."
        },
        transit: {
          card: "Metro Smart Card / UPI & Apps",
          notes: "Uber and Ola apps operate smoothly. Delhi/Bangalore/Varanasi have modern metro and e-rickshaw fleets."
        },
        seasonality: {
          bestMonths: "October – March (Winter Sunshine)",
          currentSeasonName: (month) => {
            if ([9, 10, 11, 0, 1, 2].includes(month)) return { season: "Peak Season", tag: "Crisp Pleasant Weather & Festive Energy", color: "emerald" };
            if ([5, 6, 7, 8].includes(month)) return { season: "Monsoon Season", tag: "Lush Greenery & Vibrant Rain", color: "cyan" };
            return { season: "Low Season", tag: "Hot Summer Pre-Monsoon", color: "slate" };
          },
          months: [
            { name: "Jan", temp: "15°C / 59°F", status: "peak", crowds: "High", desc: "Cool, pleasant days; prime season across northern and southern India." },
            { name: "Feb", temp: "18°C / 64°F", status: "peak", crowds: "High", desc: "Warm sunny days, comfortable evenings; great monument sightseeing." },
            { name: "Mar", temp: "24°C / 75°F", status: "shoulder", crowds: "Moderate", desc: "Holi festival celebrations, warming spring weather." },
            { name: "Apr", temp: "30°C / 86°F", status: "low", crowds: "Low", desc: "Hot summer arrives; great time for Himalayan regions." },
            { name: "May", temp: "35°C / 95°F", status: "low", crowds: "Low", desc: "Peak summer heat in plains; ideal for Ladakh and hill stations." },
            { name: "Jun", temp: "33°C / 91°F", status: "low", crowds: "Low", desc: "Ladakh passes open; pre-monsoon showers in South." },
            { name: "Jul", temp: "29°C / 84°F", status: "low", crowds: "Low", desc: "Monsoon rains bring lush emerald landscapes; Ladakh peak season." },
            { name: "Aug", temp: "28°C / 82°F", status: "low", crowds: "Low", desc: "Lush greenery everywhere; ideal for Ayurvedic retreats & Ladakh." },
            { name: "Sep", temp: "27°C / 81°F", status: "shoulder", crowds: "Moderate", desc: "Monsoon recedes; clean air and scenic landscapes." },
            { name: "Oct", temp: "24°C / 75°F", status: "peak", crowds: "High", desc: "Diwali festivities, golden autumn sunshine begins." },
            { name: "Nov", temp: "19°C / 66°F", status: "peak", crowds: "High", desc: "Peak tourist season begins; pleasant, clear, dry weather." },
            { name: "Dec", temp: "15°C / 59°F", status: "peak", crowds: "High", desc: "Cool winter breezes, festive celebrations, vibrant temple ghats." }
          ]
        }
      },
      "United States": {
        plugs: {
          types: ["Type A", "Type B"],
          voltage: "120V",
          frequency: "60Hz",
          summary: "Two flat pins (Type A) or two flat + round ground pin (Type B)."
        },
        tapWater: {
          safe: true,
          status: "100% Safe to Drink",
          grade: "High Quality",
          notes: "NYC and US municipal tap water is strictly tested and safe. Free tap water ('ice water') is provided automatically at all sit-down restaurants."
        },
        tipping: {
          norm: "Strictly Expected & Customary",
          percentage: "18% – 22% in Restaurants",
          notes: "Waitstaff rely on tips as primary income. 18-20% is standard for good service, 15% minimum, 22%+ for outstanding service. $1-2/drink at bars."
        },
        emergency: {
          police: "911",
          ambulanceFire: "911",
          touristHelpline: "311 (NYC / Municipal Non-Emergency Services)",
          general: "911"
        },
        visa: {
          type: "ESTA (Visa Waiver) or B1/B2 Visa",
          duration: "Up to 90 Days",
          notes: "Citizens of 40 Visa Waiver Program countries must apply for an ESTA online at least 72 hours before boarding."
        },
        transit: {
          card: "OMNY / Contactless Tap",
          notes: "Tap your contactless credit card or phone directly on NYC Subway and bus turnstiles. Weekly fare caps apply automatically."
        },
        seasonality: {
          bestMonths: "April – June & September – November",
          currentSeasonName: (month) => {
            if ([3, 4, 5, 8, 9, 10].includes(month)) return { season: "Peak Season", tag: "Crisp Spring & Golden Autumn Foliage", color: "emerald" };
            if ([6, 7].includes(month)) return { season: "Summer Season", tag: "High Sun & Rooftop Vibrance", color: "amber" };
            return { season: "Winter Season", tag: "Holiday Lights & Cozy Broadway Evenings", color: "slate" };
          },
          months: [
            { name: "Jan", temp: "2°C / 36°F", status: "low", crowds: "Low", desc: "Crisp winter cold; post-holiday discounts and quiet museums." },
            { name: "Feb", temp: "3°C / 37°F", status: "low", crowds: "Low", desc: "Winter restaurant week, ice skating in Central Park." },
            { name: "Mar", temp: "7°C / 45°F", status: "shoulder", crowds: "Moderate", desc: "St Patrick's Day parade, early spring days." },
            { name: "Apr", temp: "13°C / 55°F", status: "peak", crowds: "High", desc: "Cherry blossoms in Central Park & Brooklyn Botanic Garden." },
            { name: "May", temp: "18°C / 64°F", status: "peak", crowds: "High", desc: "Delightful outdoor weather, rooftop dining opens." },
            { name: "Jun", temp: "23°C / 73°F", status: "peak", crowds: "High", desc: "Outdoor movies, Pride celebrations, long summer daylight." },
            { name: "Jul", temp: "26°C / 79°F", status: "shoulder", crowds: "High", desc: "4th of July fireworks, warm summer heat." },
            { name: "Aug", temp: "25°C / 77°F", status: "shoulder", crowds: "Moderate", desc: "US Open tennis, warm evenings, beach daytrips." },
            { name: "Sep", temp: "21°C / 70°F", status: "peak", crowds: "High", desc: "Crisp clear skies, fashion week, optimal walking weather." },
            { name: "Oct", temp: "15°C / 59°F", status: "peak", crowds: "High", desc: "Peak fall foliage in Central Park, Halloween parade." },
            { name: "Nov", temp: "10°C / 50°F", status: "shoulder", crowds: "High", desc: "Macy's Thanksgiving Day Parade, crisp autumn air." },
            { name: "Dec", temp: "4°C / 39°F", status: "peak", crowds: "Very High", desc: "Rockefeller Center tree, holiday window displays, magical atmosphere." }
          ]
        }
      },
      "United Kingdom": {
        plugs: {
          types: ["Type G"],
          voltage: "230V",
          frequency: "50Hz",
          summary: "Three rectangular prongs in a triangular pattern with built-in safety shutters. Requires UK adapter."
        },
        tapWater: {
          safe: true,
          status: "100% Safe to Drink",
          grade: "Excellent",
          notes: "Mains tap water in London and throughout the UK is strictly monitored and clean. You can ask for free tap water in any pub or restaurant."
        },
        tipping: {
          norm: "Discretionary (10–12.5%)",
          percentage: "10% – 12.5%",
          notes: "Most sit-down restaurants automatically add a 12.5% 'Optional Service Charge' to the bill. No tipping needed at pubs when ordering at the bar."
        },
        emergency: {
          police: "999 / 112",
          ambulanceFire: "999 / 112",
          touristHelpline: "111 (NHS Non-Emergency Health Advice)",
          general: "999"
        },
        visa: {
          type: "ETA / Standard Visitor (6 Months)",
          duration: "Up to 6 Months",
          notes: "US, EU, Canadian, Australian visitors receive up to 6 months visa-free entry. Check UK Electronic Travel Authorisation (ETA) requirement."
        },
        transit: {
          card: "Contactless / Oyster Card",
          notes: "Tap your phone or bank card directly at Tube stations and on London double-decker buses. Automatic daily fare capping."
        },
        seasonality: {
          bestMonths: "May – September (Long Daylight)",
          currentSeasonName: (month) => {
            if ([4, 5, 6, 7, 8].includes(month)) return { season: "Peak Season", tag: "Sunny Pub Gardens & 16-Hour Daylight", color: "emerald" };
            if ([3, 9, 10].includes(month)) return { season: "Shoulder Season", tag: "Crisp Walks & Cozy Pub Evenings", color: "amber" };
            return { season: "Low Season", tag: "Winter Culture & West End Shows", color: "slate" };
          },
          months: [
            { name: "Jan", temp: "6°C / 43°F", status: "low", crowds: "Low", desc: "Chilly winter, fewest tourists at museums, great theater deals." },
            { name: "Feb", temp: "7°C / 45°F", status: "low", crowds: "Low", desc: "Snowdrops and crocuses in Royal Parks." },
            { name: "Mar", temp: "10°C / 50°F", status: "shoulder", crowds: "Moderate", desc: "Daffodils bloom across St James's Park." },
            { name: "Apr", temp: "12°C / 54°F", status: "shoulder", crowds: "Moderate", desc: "London Marathon, fresh spring breezes." },
            { name: "May", temp: "16°C / 61°F", status: "peak", crowds: "High", desc: "Chelsea Flower Show, green parks, warm sunshine." },
            { name: "Jun", temp: "19°C / 66°F", status: "peak", crowds: "High", desc: "King's Birthday Parade, open air theater, long 16h days." },
            { name: "Jul", temp: "22°C / 72°F", status: "peak", crowds: "High", desc: "Wimbledon Tennis, bustling pub gardens, Thames cruises." },
            { name: "Aug", temp: "22°C / 72°F", status: "peak", crowds: "High", desc: "Notting Hill Carnival, summer festival atmosphere." },
            { name: "Sep", temp: "18°C / 64°F", status: "peak", crowds: "Moderate", desc: "London Design Festival, pleasant golden September light." },
            { name: "Oct", temp: "14°C / 57°F", status: "shoulder", crowds: "Moderate", desc: "Golden autumn trees in Hyde Park, Frieze Art Fair." },
            { name: "Nov", temp: "10°C / 50°F", status: "low", crowds: "Low", desc: "Bonfire Night fireworks, early festive lights." },
            { name: "Dec", temp: "7°C / 45°F", status: "shoulder", crowds: "High", desc: "Oxford Street lights, Winter Wonderland, festive ice rinks." }
          ]
        }
      },
      "Australia": {
        plugs: { types: ["Type I"], voltage: "230V", frequency: "50Hz", summary: "Two angled flat pins forming a V-shape, often with vertical grounding pin. Requires Type I adapter." },
        tapWater: { safe: true, status: "100% Safe to Drink", grade: "Pristine", notes: "Australian tap water is among the highest quality in the world. Drink freely from all taps." },
        tipping: { norm: "Optional / Not Expected", percentage: "Round up or 5–10%", notes: "Waitstaff receive fair award wages. Tipping is never mandatory, but 10% for exceptional dining is appreciated." },
        emergency: { police: "000", ambulanceFire: "000", touristHelpline: "112 (From mobile phones)", general: "000" },
        visa: { type: "ETA (Subclass 601) / eVisitor (651)", duration: "Up to 90 Days", notes: "Apply online for Australian ETA prior to boarding via the official Australian ETA app." },
        transit: { card: "Opal Card / Contactless Tap", notes: "Tap credit card or smartphone directly on Sydney ferries, trains, light rail, and buses." },
        seasonality: {
          bestMonths: "September – November & March – May",
          currentSeasonName: (month) => {
            if ([8, 9, 10].includes(month)) return { season: "Peak Spring", tag: "Blooming Jacarandas & Coastal Walks", color: "emerald" };
            if ([11, 0, 1].includes(month)) return { season: "Peak Summer", tag: "Bondi Beach Sun & NYE Harbour Fireworks", color: "emerald" };
            if ([2, 3, 4].includes(month)) return { season: "Shoulder Season", tag: "Mild Golden Autumn (Vivid Sydney festival)", color: "amber" };
            return { season: "Low Season", tag: "Crisp Coastal Winter & Whale Migration", color: "cyan" };
          },
          months: [
            { name: "Jan", temp: "26°C / 79°F", status: "peak", crowds: "High", desc: "Summer beach season, Sydney Festival outdoor concerts." },
            { name: "Feb", temp: "26°C / 79°F", status: "peak", crowds: "High", desc: "Warm ocean swells at Manly & Bondi beaches." },
            { name: "Mar", temp: "24°C / 75°F", status: "shoulder", crowds: "Moderate", desc: "Pleasant autumn warmth, calm harbour waters." },
            { name: "Apr", temp: "22°C / 72°F", status: "shoulder", crowds: "Moderate", desc: "Easter shows, great hiking in Blue Mountains." },
            { name: "May", temp: "19°C / 66°F", status: "shoulder", crowds: "Moderate", desc: "Vivid Sydney light installations illuminate Opera House." },
            { name: "Jun", temp: "16°C / 61°F", status: "low", crowds: "Low", desc: "Winter starts; humpback whales migrate north." },
            { name: "Jul", temp: "16°C / 61°F", status: "low", crowds: "Low", desc: "Cool crisp days, clear skies, lowest hotel rates." },
            { name: "Aug", temp: "17°C / 63°F", status: "low", crowds: "Low", desc: "Early spring blossoms, City2Surf run." },
            { name: "Sep", temp: "20°C / 68°F", status: "peak", crowds: "Moderate", desc: "Delightful spring warmth, coastal flora blooms." },
            { name: "Oct", temp: "22°C / 72°F", status: "peak", crowds: "High", desc: "Purple Jacaranda trees blossom across Sydney." },
            { name: "Nov", temp: "24°C / 75°F", status: "peak", crowds: "High", desc: "Sculpture by the Sea along Bondi-to-Bronte cliff walk." },
            { name: "Dec", temp: "25°C / 77°F", status: "peak", crowds: "Very High", desc: "World-famous Sydney Harbour New Year fireworks." }
          ]
        }
      },
      "Brazil": {
        plugs: { types: ["Type N", "Type C"], voltage: "127V / 220V", frequency: "60Hz", summary: "Type N three-round pins (Brazilian standard) and Europlug Type C. Adapter recommended for Type A/G." },
        tapWater: { safe: false, status: "Filtered / Bottled Recommended", grade: "Precautionary", notes: "Treated municipal water is available, but older building pipes mean bottled or filtered water is advised." },
        tipping: { norm: "10% 'Serviço' Included", percentage: "10%", notes: "A 10% service charge is customarily included on the restaurant bill ('serviço'). Small extra change appreciated." },
        emergency: { police: "190", ambulanceFire: "192 (SAMU) / 193 (Bombeiros)", touristHelpline: "DEAT (Tourist Police Rio): +55 21 2332-2924", general: "190" },
        visa: { type: "eVisa / Visa-Free (Many Passports)", duration: "Up to 90 Days", notes: "Check Brazil eVisa requirements for US/Canada/Australia before departure. Fast online portal." },
        transit: { card: "Riocard Mais / Metro Rio & Uber", notes: "Metro Rio is clean and air-conditioned. Uber is safe, ubiquitous, and very affordable." },
        seasonality: {
          bestMonths: "May – October (Dry & Pleasant Winter) & Feb (Carnival)",
          currentSeasonName: (month) => {
            if ([1, 2].includes(month)) return { season: "Peak Carnival", tag: "World's Greatest Samba Carnival & Tropical Heat", color: "emerald" };
            if ([4, 5, 6, 7, 8, 9].includes(month)) return { season: "Prime Season", tag: "Pleasant Winter Sun (25°C) & Low Humidity", color: "emerald" };
            return { season: "Summer Season", tag: "Tropical Heat & Warm Ocean Water", color: "amber" };
          },
          months: [
            { name: "Jan", temp: "30°C / 86°F", status: "peak", crowds: "High", desc: "Hot summer, Copacabana beach energy." },
            { name: "Feb", temp: "31°C / 88°F", status: "peak", crowds: "Very High", desc: "Rio Carnival in full swing at Sambadrome." },
            { name: "Mar", temp: "29°C / 84°F", status: "shoulder", crowds: "High", desc: "Late summer warmth, sunset gatherings on Arpoador." },
            { name: "Apr", temp: "27°C / 81°F", status: "shoulder", crowds: "Moderate", desc: "Temperatures become comfortable and pleasant." },
            { name: "May", temp: "25°C / 77°F", status: "peak", crowds: "Moderate", desc: "Superb hiking weather up Sugarloaf and Christ the Redeemer." },
            { name: "Jun", temp: "24°C / 75°F", status: "peak", crowds: "Moderate", desc: "Mild winter sun, crystal clear visibility." },
            { name: "Jul", temp: "24°C / 75°F", status: "peak", crowds: "Moderate", desc: "Lowest rainfall, great panoramic photography." },
            { name: "Aug", temp: "24°C / 75°F", status: "peak", crowds: "Moderate", desc: "Sunny comfortable days, cool evening breezes." },
            { name: "Sep", temp: "25°C / 77°F", status: "peak", crowds: "Moderate", desc: "Spring warming begins; lush Tijuca rainforest." },
            { name: "Oct", temp: "26°C / 79°F", status: "shoulder", crowds: "Moderate", desc: "Pleasant days, botanic garden blooms." },
            { name: "Nov", temp: "27°C / 81°F", status: "shoulder", crowds: "Moderate", desc: "Pre-summer festival season." },
            { name: "Dec", temp: "29°C / 84°F", status: "peak", crowds: "Very High", desc: "Reveillon New Year's Eve on Copacabana beach." }
          ]
        }
      },
      "Iceland": {
        plugs: { types: ["Type C", "Type F"], voltage: "230V", frequency: "50Hz", summary: "Standard European two round pin sockets. Standard Europlug works." },
        tapWater: { safe: true, status: "100% Purest Spring Water", grade: "World Best", notes: "Icelandic tap water comes untreated straight from natural glacier springs. One of the purest on Earth." },
        tipping: { norm: "Strictly Not Customary", percentage: "0%", notes: "All service charges and taxes are legally included in listed prices. Tipping is never expected." },
        emergency: { police: "112", ambulanceFire: "112", touristHelpline: "112 (All Emergency & ICE-SAR Search & Rescue)", general: "112" },
        visa: { type: "Schengen Visa (90 Days)", duration: "90 Days", notes: "Iceland is a Schengen area member state. 90-day visa-free for citizens of US, UK, Canada, Australia." },
        transit: { card: "Rental Car 4x4 & Strætó Bus", notes: "Renting a 4x4 car is recommended for the Ring Road and Golden Circle routes." },
        seasonality: {
          bestMonths: "June – August (Midnight Sun) & Sept – March (Northern Lights)",
          currentSeasonName: (month) => {
            if ([5, 6, 7].includes(month)) return { season: "Peak Summer", tag: "24-Hour Midnight Sun & Lupine Blooms", color: "emerald" };
            if ([8, 9, 10, 11, 0, 1, 2].includes(month)) return { season: "Aurora Season", tag: "Northern Lights (Aurora Borealis) & Ice Caves", color: "cyan" };
            return { season: "Spring Thaw", tag: "Waterfall Thaw & Returning Puffins", color: "amber" };
          },
          months: [
            { name: "Jan", temp: "-1°C / 30°F", status: "low", crowds: "Moderate", desc: "Dark winter skies; prime Northern Lights & crystal ice caves." },
            { name: "Feb", temp: "0°C / 32°F", status: "low", crowds: "Moderate", desc: "Winter lights festival, frozen waterfalls, geothermal spas." },
            { name: "Mar", temp: "1°C / 34°F", status: "shoulder", crowds: "Moderate", desc: "Spring equinox auroras, increasing daylight." },
            { name: "Apr", temp: "3°C / 37°F", status: "shoulder", crowds: "Low", desc: "Puffins arrive; snow begins to thaw in valleys." },
            { name: "May", temp: "7°C / 45°F", status: "shoulder", crowds: "Moderate", desc: "Long daylight hours, purple lupine flowers start blooming." },
            { name: "Jun", temp: "11°C / 52°F", status: "peak", crowds: "High", desc: "Summer solstice; 24 hours of golden midnight sun." },
            { name: "Jul", temp: "13°C / 55°F", status: "peak", crowds: "Very High", desc: "Warmest month; Highlands F-roads open for hiking." },
            { name: "Aug", temp: "13°C / 55°F", status: "peak", crowds: "Very High", desc: "Reykjavik Culture Night, whale watching peak." },
            { name: "Sep", temp: "9°C / 48°F", status: "peak", crowds: "Moderate", desc: "Autumn colors, first Northern Lights return to night skies." },
            { name: "Oct", temp: "5°C / 41°F", status: "shoulder", crowds: "Moderate", desc: "Crisp cold nights, active aurora activity." },
            { name: "Nov", temp: "2°C / 36°F", status: "low", crowds: "Moderate", desc: "Iceland Airwaves music festival, cozy cafes." },
            { name: "Dec", temp: "0°C / 32°F", status: "shoulder", crowds: "High", desc: "Magical Christmas lights, festive folklore, 4h daylight." }
          ]
        }
      },
      "Egypt": {
        plugs: { types: ["Type C", "Type F"], voltage: "220V", frequency: "50Hz", summary: "Standard European round two-pin plug. Standard Europlug adapter works." },
        tapWater: { safe: false, status: "Sealed Bottled Water Advised", grade: "Precautionary", notes: "Do not drink unboiled tap water. Use sealed bottled mineral water (Nestle, Baraka, Dasani)." },
        tipping: { norm: "Baksheesh is Universal", percentage: "10% – 15%", notes: "Tipping ('Baksheesh') is an essential cultural norm for waitstaff, temple guardians, drivers, and felucca captains." },
        emergency: { police: "122", ambulanceFire: "123 / 180", touristHelpline: "126 (Tourist Police 24/7 in English)", general: "122" },
        visa: { type: "e-Visa / Visa on Arrival ($25 USD)", duration: "30 Days", notes: "Citizens of over 70 nations can obtain a $25 USD stamp on arrival or online e-Visa." },
        transit: { card: "Cairo Metro Card & Uber", notes: "Uber operates cleanly and reliably across Cairo, Giza, and Alexandria." },
        seasonality: {
          bestMonths: "October – April (Mild Winter Sun)",
          currentSeasonName: (month) => {
            if ([9, 10, 11, 0, 1, 2, 3].includes(month)) return { season: "Peak Season", tag: "Pleasant Daytime Sun & Cool Desert Evenings", color: "emerald" };
            return { season: "Low / Hot Season", tag: "Intense Midday Summer Heat (Early Morning Touring)", color: "slate" };
          },
          months: [
            { name: "Jan", temp: "19°C / 66°F", status: "peak", crowds: "High", desc: "Cool crisp desert days; ideal for exploring Giza Pyramids." },
            { name: "Feb", temp: "20°C / 68°F", status: "peak", crowds: "High", desc: "Sun festival at Abu Simbel, mild daytime weather." },
            { name: "Mar", temp: "24°C / 75°F", status: "peak", crowds: "High", desc: "Warm spring days, Nile felucca sailing cruises." },
            { name: "Apr", temp: "28°C / 82°F", status: "shoulder", crowds: "Moderate", desc: "Sham en-Nessim spring holiday; warm afternoon sun." },
            { name: "May", temp: "33°C / 91°F", status: "low", crowds: "Low", desc: "Summer heat begins; visit monuments at 7 AM opening." },
            { name: "Jun", temp: "35°C / 95°F", status: "low", crowds: "Low", desc: "Hot desert sun; great hotel and cruise discounts." },
            { name: "Jul", temp: "36°C / 97°F", status: "low", crowds: "Low", desc: "Quiet temple visits; Red Sea coastal escapes." },
            { name: "Aug", temp: "36°C / 97°F", status: "low", crowds: "Low", desc: "Low tourist volumes, indoor air-conditioned museums." },
            { name: "Sep", temp: "33°C / 91°F", status: "shoulder", crowds: "Low", desc: "Warming transitions; Nile river breezes." },
            { name: "Oct", temp: "30°C / 86°F", status: "peak", crowds: "High", desc: "Peak winter season begins; Grand Egyptian Museum touring." },
            { name: "Nov", temp: "25°C / 77°F", status: "peak", crowds: "High", desc: "Optimal weather across Cairo, Luxor, and Aswan." },
            { name: "Dec", temp: "21°C / 70°F", status: "peak", crowds: "High", desc: "Festive holiday season, comfortable temple explorations." }
          ]
        }
      },
      "Peru": {
        plugs: { types: ["Type A", "Type C"], voltage: "220V", frequency: "60Hz", summary: "Most hotel sockets are combination outlets accepting both US flat pins (Type A) and Euro round pins (Type C)." },
        tapWater: { safe: false, status: "Bottled / Purified Advised", grade: "Precautionary", notes: "Do not drink tap water. Drink bottled water and take coca tea to help acclimatize to high altitude in Cusco." },
        tipping: { norm: "10% in Restaurants", percentage: "10%", notes: "Tipping 10% for good service is standard. Small tips for Inca Trail porters and trekking guides are customary." },
        emergency: { police: "105", ambulanceFire: "117 (SAMU) / 116 (Fire)", touristHelpline: "+51 1 574-8000 (POLTUR Tourist Police)", general: "105" },
        visa: { type: "90-Day Visa Exemption", duration: "Up to 90 Days", notes: "Citizens of North America, EU, UK, and Australia receive up to 90 days visa-free upon arrival." },
        transit: { card: "PeruRail & Inca Rail / Registered Taxis", notes: "Book train tickets from Ollantaytambo to Aguas Calientes (Machu Picchu) well in advance." },
        seasonality: {
          bestMonths: "May – October (Dry Andean Season)",
          currentSeasonName: (month) => {
            if ([4, 5, 6, 7, 8, 9].includes(month)) return { season: "Peak Dry Season", tag: "Crystal Andean Skies & Machu Picchu Treks", color: "emerald" };
            return { season: "Rainy Season", tag: "Lush Green Mountains (Inca Trail closed in Feb)", color: "cyan" };
          },
          months: [
            { name: "Jan", temp: "19°C / 66°F", status: "low", crowds: "Moderate", desc: "Rainy season in Andes; lush green mountain valleys." },
            { name: "Feb", temp: "19°C / 66°F", status: "low", crowds: "Low", desc: "Wettest month; Inca Trail closed for maintenance." },
            { name: "Mar", temp: "19°C / 66°F", status: "shoulder", crowds: "Moderate", desc: "Rains subside; vibrant cloud forests." },
            { name: "Apr", temp: "20°C / 68°F", status: "shoulder", crowds: "Moderate", desc: "Inca Trail re-opens; fresh mountain air." },
            { name: "May", temp: "20°C / 68°F", status: "peak", crowds: "High", desc: "Dry season arrives; clear views of Machu Picchu citadel." },
            { name: "Jun", temp: "20°C / 68°F", status: "peak", crowds: "Very High", desc: "Inti Raymi (Festival of the Sun) in Cusco; clear blue skies." },
            { name: "Jul", temp: "19°C / 66°F", status: "peak", crowds: "Very High", desc: "Cold starry Andean nights, sunny daytime treks." },
            { name: "Aug", temp: "20°C / 68°F", status: "peak", crowds: "Very High", desc: "Peak trekking season; optimal visibility at Sun Gate." },
            { name: "Sep", temp: "21°C / 70°F", status: "peak", crowds: "High", desc: "Mild days, less crowded than July and August." },
            { name: "Oct", temp: "21°C / 70°F", status: "shoulder", crowds: "Moderate", desc: "End of dry season; blooming Sacred Valley orchids." },
            { name: "Nov", temp: "21°C / 70°F", status: "shoulder", crowds: "Moderate", desc: "Occasional afternoon rain showers; quiet ruins." },
            { name: "Dec", temp: "20°C / 68°F", status: "shoulder", crowds: "High", desc: "Christmas markets in Plaza de Armas Cusco." }
          ]
        }
      },
      "Canada": {
        plugs: { types: ["Type A", "Type B"], voltage: "120V", frequency: "60Hz", summary: "Standard North American two flat pins (Type A) or two flat + ground pin (Type B)." },
        tapWater: { safe: true, status: "100% Pristine Glacial Tap Water", grade: "Pristine", notes: "Canadian tap water is exceptionally pure and clean. You can drink directly from any tap with complete confidence." },
        tipping: { norm: "15% – 20% Standard", percentage: "15% – 20%", notes: "Tipping 15–20% on restaurant bills is standard and expected for waitstaff." },
        emergency: { police: "911", ambulanceFire: "911", touristHelpline: "911 / 811 (HealthLink BC/Alberta)", general: "911" },
        visa: { type: "eTA (Electronic Travel Authorization)", duration: "Up to 6 Months", notes: "Visa-exempt travelers must apply online for an eTA ($7 CAD) before boarding flights to Canada." },
        transit: { card: "Roam Transit & Discovery Pass", notes: "Purchase a Parks Canada Discovery Pass for vehicle entry to Banff and Jasper National Parks." },
        seasonality: {
          bestMonths: "June – August (Summer Lakes) & Dec – March (Skiing)",
          currentSeasonName: (month) => {
            if ([5, 6, 7].includes(month)) return { season: "Peak Summer", tag: "Vibrant Turquoise Lakes & Alpine Hiking", color: "emerald" };
            if ([11, 0, 1, 2].includes(month)) return { season: "Peak Ski Season", tag: "World-Class Powder Snow & Ice Skating", color: "cyan" };
            return { season: "Shoulder Season", tag: "Golden Larch Trees & Quiet Mountain Lodges", color: "amber" };
          },
          months: [
            { name: "Jan", temp: "-9°C / 15°F", status: "peak", crowds: "High", desc: "Champagne powder skiing at Lake Louise, Banff SnowDays festival." },
            { name: "Feb", temp: "-7°C / 19°F", status: "peak", crowds: "High", desc: "Ice magic ice carving competitions, frozen canyon ice walks." },
            { name: "Mar", temp: "-2°C / 28°F", status: "peak", crowds: "High", desc: "Sunny spring skiing, long bluebird days on slopes." },
            { name: "Apr", temp: "4°C / 39°F", status: "shoulder", crowds: "Low", desc: "Spring ski season ends; lakes begin thawing." },
            { name: "May", temp: "9°C / 48°F", status: "shoulder", crowds: "Moderate", desc: "Bears emerge from hibernation, waterfalls roar with meltwater." },
            { name: "Jun", temp: "15°C / 59°F", status: "peak", crowds: "High", desc: "Lake Louise and Moraine Lake thaw to brilliant turquoise." },
            { name: "Jul", temp: "22°C / 72°F", status: "peak", crowds: "Very High", desc: "Warm alpine sunshine, canoeing on Lake Moraine, wildflowers." },
            { name: "Aug", temp: "21°C / 70°F", status: "peak", crowds: "Very High", desc: "Optimal hiking weather along Icefields Parkway." },
            { name: "Sep", temp: "15°C / 59°F", status: "peak", crowds: "High", desc: "Golden larch needles transform valley ridges; crisp air." },
            { name: "Oct", temp: "8°C / 46°F", status: "shoulder", crowds: "Moderate", desc: "First mountain snow dustings, quiet cozy lodges." },
            { name: "Nov", temp: "-3°C / 26°F", status: "shoulder", crowds: "Moderate", desc: "Ski resorts open for the winter season." },
            { name: "Dec", temp: "-8°C / 17°F", status: "peak", crowds: "Very High", desc: "Fairytale winter wonderland, ice skating on frozen Lake Louise." }
          ]
        }
      }
    };

    // Generic international fallback profiles
    this.defaultProfiles = {
      "Europe": {
        plugs: { types: ["Type C", "Type F"], voltage: "230V", frequency: "50Hz", summary: "Standard European round two-pin plug. Universal adapter recommended." },
        tapWater: { safe: true, status: "100% Safe to Drink", grade: "High Quality", notes: "Municipal tap water meets strict European Union drinking water standards." },
        tipping: { norm: "Modest / Round Up", percentage: "5% – 10%", notes: "Tipping is appreciated for good table service; rounding up the bill is customary." },
        emergency: { police: "112", ambulanceFire: "112", touristHelpline: "112 (Universal EU Emergency Line in English)", general: "112" },
        visa: { type: "Schengen Visa or Tourist Exemption", duration: "90 Days", notes: "Standard 90/180 day tourist guidelines apply for international travelers." },
        transit: { card: "Contactless / City Metro Card", notes: "Major European cities support contactless credit card taps across metro and bus gates." }
      },
      "Asia": {
        plugs: { types: ["Type C", "Type G", "Type A"], voltage: "220V - 240V", frequency: "50Hz", summary: "Multi-socket outlets common in hotels. Multi-plug adapter advised." },
        tapWater: { safe: false, status: "Bottled / Purified Advised", grade: "Precautionary", notes: "Filtered or sealed bottled mineral water is recommended for travelers." },
        tipping: { norm: "Varies by Country", percentage: "0% – 10%", notes: "Not traditional in East Asia; service charge often included in upscale spots." },
        emergency: { police: "112 / 191", ambulanceFire: "1669 / 115", touristHelpline: "Tourist Police available in major hubs", general: "112" },
        visa: { type: "Visa on Arrival / eVisa", duration: "30 to 60 Days", notes: "Check online eVisa portals before departure for fast processing." },
        transit: { card: "Local Transit Card & Ride-Hailing", notes: "Apps like Grab, Uber, and local transit IC cards offer smooth city navigation." }
      },
      "Americas": {
        plugs: { types: ["Type A", "Type B"], voltage: "110V - 127V", frequency: "60Hz", summary: "Standard North/Central American two or three prong flat plugs." },
        tapWater: { safe: true, status: "Safe in Major Metros", grade: "Good", notes: "Treated municipal water in established metropolitan areas." },
        tipping: { norm: "Expected in Hospitality", percentage: "10% – 18%", notes: "Tipping waitstaff and drivers is customary across North and South America." },
        emergency: { police: "911 / 190", ambulanceFire: "911 / 192", touristHelpline: "Municipal 911 / 311 assistance", general: "911" },
        visa: { type: "eTA or Tourist Visa", duration: "Up to 90 Days", notes: "Verify electronic travel authorization requirements prior to flight booking." },
        transit: { card: "Metro Card & Rideshare", notes: "Uber, Lyft, and contactless transit cards available across urban centers." }
      }
    };
  }

  getTelemetryForDestination(dest) {
    if (!dest) return null;
    const country = dest.country || "";
    const continent = dest.continent || "Europe";

    // Direct match
    if (this.registry[country]) {
      return this.registry[country];
    }

    // Specific country overrides
    if (country === "Spain") {
      const p = JSON.parse(JSON.stringify(this.registry["France"]));
      p.tipping.notes = "Leaving 5–10% or small change for good tapas service is common. Not strictly mandatory.";
      p.transit.card = "T-Casual / Hola Barcelona Card";
      p.transit.notes = "Contactless multi-journey card valid across Barcelona metro, bus, and tram networks.";
      return p;
    }

    if (country === "UAE" || country === "United Arab Emirates") {
      return {
        plugs: { types: ["Type G"], voltage: "230V", frequency: "50Hz", summary: "Three rectangular pins (British standard). UK/Universal adapter works perfectly." },
        tapWater: { safe: true, status: "Safe to Drink (Desalinated)", grade: "Safe", notes: "Municipal tap water is desalinated and safe, though most locals prefer bottled water for taste." },
        tipping: { norm: "10% – 15% Customary", percentage: "10% – 15%", notes: "A 10% service fee is often included in Dubai restaurants, but leaving an extra 5-10% is standard practice." },
        emergency: { police: "999", ambulanceFire: "998 (Ambulance) / 997 (Fire)", touristHelpline: "800 2626 (Dubai Tourism Security 24/7)", general: "999" },
        visa: { type: "30-Day Free Visa on Arrival", duration: "30 Days", notes: "Citizens of over 70 nationalities receive a complimentary 30-day visa upon landing at Dubai/Abu Dhabi." },
        transit: { card: "Nol Card", notes: "Contactless smart card for Dubai Metro, trams, water taxis, and buses." },
        seasonality: {
          bestMonths: "November – March (Pleasant Warmth)",
          currentSeasonName: (month) => {
            if ([10, 11, 0, 1, 2].includes(month)) return { season: "Peak Season", tag: "Golden Sunshine & Mild Evenings (24°C)", color: "emerald" };
            if ([3, 9].includes(month)) return { season: "Shoulder Season", tag: "Warm Beach Days & Cool Pools", color: "amber" };
            return { season: "Low Season", tag: "Intense Summer Heat (Air-Conditioned Megamalls)", color: "slate" };
          },
          months: [
            { name: "Jan", temp: "24°C / 75°F", status: "peak", crowds: "High", desc: "Dubai Shopping Festival, perfect beach temperatures." },
            { name: "Feb", temp: "25°C / 77°F", status: "peak", crowds: "High", desc: "Food festivals, outdoor desert safaris, ideal weather." },
            { name: "Mar", temp: "28°C / 82°F", status: "shoulder", crowds: "Moderate", desc: "Warm days, comfortable rooftop dining." },
            { name: "Apr", temp: "33°C / 91°F", status: "shoulder", crowds: "Moderate", desc: "Sunny and warm; great resort pool weather." },
            { name: "May", temp: "38°C / 100°F", status: "low", crowds: "Low", desc: "Summer heat begins; luxury hotel deals." },
            { name: "Jun", temp: "40°C / 104°F", status: "low", crowds: "Low", desc: "Indoor theme parks, aquarium, air-conditioned attractions." },
            { name: "Jul", temp: "42°C / 108°F", status: "low", crowds: "Low", desc: "Dubai Summer Surprises indoor retail deals." },
            { name: "Aug", temp: "43°C / 109°F", status: "low", crowds: "Low", desc: "Lowest hotel rates of the year; indoor dining." },
            { name: "Sep", temp: "39°C / 102°F", status: "low", crowds: "Low", desc: "Warm seas, late-summer transitions." },
            { name: "Oct", temp: "35°C / 95°F", status: "shoulder", crowds: "Moderate", desc: "Outdoor events resume, pleasant evening breezes." },
            { name: "Nov", temp: "30°C / 86°F", status: "peak", crowds: "High", desc: "Abu Dhabi F1 Grand Prix, glorious outdoor weather." },
            { name: "Dec", temp: "26°C / 79°F", status: "peak", crowds: "High", desc: "Spectacular New Year fireworks at Burj Khalifa." }
          ]
        }
      };
    }

    if (country === "Thailand") {
      return {
        plugs: { types: ["Type A", "Type B", "Type C"], voltage: "230V", frequency: "50Hz", summary: "Hybrid wall sockets in hotels fit US flat pins (Type A) and European round pins (Type C)." },
        tapWater: { safe: false, status: "Bottled Water Recommended", grade: "Precautionary", notes: "Bottled water is ubiquitous, inexpensive (~10 THB / $0.30), and provided free in all hotels." },
        tipping: { norm: "Appreciated (Not Mandatory)", percentage: "20–50 THB or 10%", notes: "Rounding up taxi fares or leaving 20-50 THB for massage and cafe service is warmly received." },
        emergency: { police: "191", ambulanceFire: "1669 / 199", touristHelpline: "1155 (Tourist Police 24/7 in English)", general: "1155" },
        visa: { type: "60-Day Visa Exemption", duration: "60 Days", notes: "Citizens of over 90 countries enter Thailand visa-free for tourism up to 60 days." },
        transit: { card: "Rabbit Card & MRT Card / Grab", notes: "Rabbit card for BTS Skytrain; Grab and Bolt apps for affordable fixed-price taxi rides." },
        seasonality: {
          bestMonths: "November – February (Cool & Dry Season)",
          currentSeasonName: (month) => {
            if ([10, 11, 0, 1].includes(month)) return { season: "Peak Season", tag: "Cool Dry Breezes & Night Markets", color: "emerald" };
            if ([2, 3].includes(month)) return { season: "Hot Season", tag: "Songkran Water Festival & Warm Sunshine", color: "amber" };
            return { season: "Monsoon Season", tag: "Tropical Afternoon Showers & Lush Temples", color: "cyan" };
          },
          months: [
            { name: "Jan", temp: "27°C / 81°F", status: "peak", crowds: "High", desc: "Clear blue skies, minimal rainfall, optimal sightseeing." },
            { name: "Feb", temp: "28°C / 82°F", status: "peak", crowds: "High", desc: "Chinese New Year celebrations, pleasant evenings." },
            { name: "Mar", temp: "30°C / 86°F", status: "shoulder", crowds: "Moderate", desc: "Temperatures climb; great time for island beaches." },
            { name: "Apr", temp: "32°C / 90°F", status: "peak", crowds: "High", desc: "Songkran (Thai New Year water festival), hottest month." },
            { name: "May", temp: "31°C / 88°F", status: "low", crowds: "Moderate", desc: "Early monsoon showers cool the air." },
            { name: "Jun", temp: "30°C / 86°F", status: "low", crowds: "Low", desc: "Occasional brief tropical rain showers; quiet temples." },
            { name: "Jul", temp: "29°C / 84°F", status: "low", crowds: "Moderate", desc: "Lush tropical scenery, fruit harvesting season." },
            { name: "Aug", temp: "29°C / 84°F", status: "low", crowds: "Low", desc: "Afternoon rainstorms, great hotel discounts." },
            { name: "Sep", temp: "28°C / 82°F", status: "low", crowds: "Low", desc: "Wettest month; dramatic evening lightning over rivers." },
            { name: "Oct", temp: "28°C / 82°F", status: "shoulder", crowds: "Moderate", desc: "Rain subsides, pleasant weather returns." },
            { name: "Nov", temp: "27°C / 81°F", status: "peak", crowds: "High", desc: "Loy Krathong lantern festival, cool dry season begins." },
            { name: "Dec", temp: "26°C / 79°F", status: "peak", crowds: "High", desc: "Peak winter holiday season, comfortable balmy nights." }
          ]
        }
      };
    }

    if (country === "Indonesia") {
      return {
        plugs: { types: ["Type C", "Type F"], voltage: "230V", frequency: "50Hz", summary: "Standard European two round pin sockets. Standard Europlug works." },
        tapWater: { safe: false, status: "Bottled Water Advised", grade: "Precautionary", notes: "Do not drink tap water in Bali. Use bottled water even for brushing teeth." },
        tipping: { norm: "5% – 10% Appreciated", percentage: "5% – 10%", notes: "Most cafes add 5% service and 10% tax. Leaving extra small change for villa staff & drivers is appreciated." },
        emergency: { police: "110", ambulanceFire: "118 / 113", touristHelpline: "112 (National Emergency)", general: "112" },
        visa: { type: "e-VOA (Electronic Visa on Arrival)", duration: "30 Days (Extendable)", notes: "Apply online for 30-day e-VOA before arrival ($35 USD) to skip airport queues." },
        transit: { card: "GoJek & Grab Apps", notes: "Ride-hailing scooters and cars are the easiest way to travel across Bali." },
        seasonality: {
          bestMonths: "April – October (Dry Season)",
          currentSeasonName: (month) => {
            if ([3, 4, 5, 6, 7, 8, 9].includes(month)) return { season: "Peak Season", tag: "Dry Season: Low Humidity & Ideal Surfing", color: "emerald" };
            return { season: "Rainy Season", tag: "Tropical Rain & Lush Rice Terraces", color: "cyan" };
          },
          months: [
            { name: "Jan", temp: "28°C / 82°F", status: "low", crowds: "Moderate", desc: "Rainy season showers, lush waterfalls and emerald rice fields." },
            { name: "Feb", temp: "28°C / 82°F", status: "low", crowds: "Low", desc: "Warm rain showers, quiet yoga retreats in Ubud." },
            { name: "Mar", temp: "29°C / 84°F", status: "shoulder", crowds: "Moderate", desc: "Nyepi (Day of Silence) festival; rain clears up." },
            { name: "Apr", temp: "29°C / 84°F", status: "peak", crowds: "High", desc: "Dry season starts; sunny skies, low humidity." },
            { name: "May", temp: "28°C / 82°F", status: "peak", crowds: "High", desc: "Pleasant breezes, great scuba diving & temple visits." },
            { name: "Jun", temp: "27°C / 81°F", status: "peak", crowds: "High", desc: "Bali Arts Festival, great surf conditions." },
            { name: "Jul", temp: "27°C / 81°F", status: "peak", crowds: "Very High", desc: "Cool offshore trade winds, Bali Kite Festival." },
            { name: "Aug", temp: "27°C / 81°F", status: "peak", crowds: "Very High", desc: "Driest month; sunny days and vibrant beach clubs." },
            { name: "Sep", temp: "28°C / 82°F", status: "peak", crowds: "High", desc: "Warm sunshine, less crowded beaches than August." },
            { name: "Oct", temp: "29°C / 84°F", status: "shoulder", crowds: "Moderate", desc: "End of dry season; warm waters, quiet temples." },
            { name: "Nov", temp: "29°C / 84°F", status: "low", crowds: "Moderate", desc: "Early afternoon showers; peaceful spa season." },
            { name: "Dec", temp: "28°C / 82°F", status: "shoulder", crowds: "High", desc: "Festive Christmas & New Year holiday season." }
          ]
        }
      };
    }

    if (country === "South Africa") {
      return {
        plugs: { types: ["Type M", "Type C", "Type N"], voltage: "230V", frequency: "50Hz", summary: "Large three round pin plug (Type M). Most hotels have Europlug (Type C) adapters." },
        tapWater: { safe: true, status: "100% Safe in Major Cities", grade: "High Quality", notes: "Cape Town and urban tap water is thoroughly treated and safe to drink directly from the tap." },
        tipping: { norm: "10% – 15% Expected", percentage: "10% – 15%", notes: "Tipping 10-15% for waitstaff is customary. Car guards in parking areas are tipped R5–R10." },
        emergency: { police: "10111", ambulanceFire: "10177 / 112", touristHelpline: "112 (Universal cell emergency)", general: "112" },
        visa: { type: "90-Day Visa Exemption", duration: "90 Days", notes: "Citizens of US, UK, Canada, and EU enter visa-free for up to 90 days." },
        transit: { card: "MyCiTi Card / Uber", notes: "Uber is widely used, safe, and inexpensive in Cape Town." },
        seasonality: {
          bestMonths: "November – March (Southern Hemisphere Summer)",
          currentSeasonName: (month) => {
            if ([10, 11, 0, 1, 2].includes(month)) return { season: "Peak Season", tag: "Warm Summer Sun & Table Mountain Hikes", color: "emerald" };
            if ([3, 4, 8, 9].includes(month)) return { season: "Shoulder Season", tag: "Mild Wine Country Harvest", color: "amber" };
            return { season: "Low Season", tag: "Green Winter & Whale Watching (Hermanus)", color: "cyan" };
          },
          months: [
            { name: "Jan", temp: "26°C / 79°F", status: "peak", crowds: "High", desc: "Peak summer sunshine, Kirstenbosch sunset concerts." },
            { name: "Feb", temp: "27°C / 81°F", status: "peak", crowds: "High", desc: "Warmest month; beach days at Clifton and Camps Bay." },
            { name: "Mar", temp: "25°C / 77°F", status: "peak", crowds: "High", desc: "Wine harvest festival in Stellenbosch, calm winds." },
            { name: "Apr", temp: "23°C / 73°F", status: "shoulder", crowds: "Moderate", desc: "Crisp autumn mornings, golden vineyards." },
            { name: "May", temp: "20°C / 68°F", status: "shoulder", crowds: "Moderate", desc: "Mild days, low tourist crowds." },
            { name: "Jun", temp: "18°C / 64°F", status: "low", crowds: "Low", desc: "Winter rain starts; cozy fireside wine tasting." },
            { name: "Jul", temp: "18°C / 64°F", status: "low", crowds: "Low", desc: "Peak southern right whale watching along coast." },
            { name: "Aug", temp: "18°C / 64°F", status: "low", crowds: "Low", desc: "West Coast spring wild flower blooms start." },
            { name: "Sep", temp: "19°C / 66°F", status: "shoulder", crowds: "Moderate", desc: "Hermanus Whale Festival, warming days." },
            { name: "Oct", temp: "21°C / 70°F", status: "shoulder", crowds: "Moderate", desc: "Spring breezes, outdoor trails re-open." },
            { name: "Nov", temp: "24°C / 75°F", status: "peak", crowds: "High", desc: "Summer arrives; Table Mountain cable car in full swing." },
            { name: "Dec", temp: "25°C / 77°F", status: "peak", crowds: "Very High", desc: "Festive holidays, buzzing V&A Waterfront." }
          ]
        }
      };
    }

    // Default continental fallback
    const fallbackBase = this.defaultProfiles[continent] || this.defaultProfiles["Europe"];
    return {
      ...fallbackBase,
      seasonality: {
        bestMonths: dest.bestTimeToVisit || "Spring & Autumn (Mild Season)",
        currentSeasonName: (month) => {
          if ([3, 4, 8, 9].includes(month)) return { season: "Peak Season", tag: "Pleasant Temperatures & Great Sightseeing", color: "emerald" };
          if ([5, 6, 7].includes(month)) return { season: "Summer Season", tag: "Long Daylight & Warm Evenings", color: "amber" };
          return { season: "Low Season", tag: "Quiet Season & Lower Accommodation Rates", color: "slate" };
        },
        months: [
          { name: "Jan", temp: "Mild", status: "low", crowds: "Low", desc: "Quiet season for cultural exploration." },
          { name: "Feb", temp: "Mild", status: "low", crowds: "Low", desc: "Peaceful monuments and museums." },
          { name: "Mar", temp: "Warm", status: "shoulder", crowds: "Moderate", desc: "Spring thaw begins." },
          { name: "Apr", temp: "Pleasant", status: "peak", crowds: "High", desc: "Blooming parks and open terraces." },
          { name: "May", temp: "Warm", status: "peak", crowds: "High", desc: "Optimal outdoor exploration." },
          { name: "Jun", temp: "Warm", status: "peak", crowds: "High", desc: "Long sunny days." },
          { name: "Jul", temp: "Sunny", status: "shoulder", crowds: "High", desc: "Summer vacation period." },
          { name: "Aug", temp: "Sunny", status: "shoulder", crowds: "High", desc: "Peak summer activities." },
          { name: "Sep", temp: "Pleasant", status: "peak", crowds: "High", desc: "Golden autumn warmth." },
          { name: "Oct", temp: "Mild", status: "peak", crowds: "Moderate", desc: "Crisp autumn foliage." },
          { name: "Nov", temp: "Cool", status: "shoulder", crowds: "Moderate", desc: "Cultural exhibits and food." },
          { name: "Dec", temp: "Cool", status: "shoulder", crowds: "Moderate", desc: "Festive holiday celebrations." }
        ]
      }
    };
  }
}

export const telemetryService = new TelemetryService();
