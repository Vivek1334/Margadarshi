/**
 * regional-audio-service.js
 * Comprehensive Regional Audio & Language Service for Voyage Travel App.
 * Matches every destination, Indian state, and global city to its authentic regional language,
 * native scripts, phonetic pronunciation guides, and Web Speech synthesis voices.
 */

class RegionalAudioService {
  constructor() {
    this.voices = [];
    this.voicesLoaded = false;
    this.currentUtterance = null;
    this.isSpeaking = false;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.initVoices();
    }
  }

  initVoices() {
    const load = () => {
      this.voices = window.speechSynthesis.getVoices() || [];
      if (this.voices.length > 0) {
        this.voicesLoaded = true;
      }
    };
    load();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = load;
    }
  }

  /**
   * Find the optimal SpeechSynthesis voice for a given BCP-47 language tag
   * e.g. 'kn-IN' (Kannada), 'ta-IN' (Tamil), 'hi-IN' (Hindi), 'fr-FR' (French), 'ja-JP' (Japanese)
   */
  findBestVoice(lang) {
    if (!this.voices || this.voices.length === 0) {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        this.voices = window.speechSynthesis.getVoices() || [];
      }
    }

    if (!this.voices || this.voices.length === 0) return null;

    const targetLang = (lang || "en-US").toLowerCase().replace("_", "-");
    const langPrefix = targetLang.split("-")[0];

    // 1. Exact match (e.g. 'kn-IN', 'hi-IN', 'fr-FR')
    const exact = this.voices.find(v => v.lang.toLowerCase().replace("_", "-") === targetLang);
    if (exact) return exact;

    // 2. Language prefix match (e.g. 'kn', 'ta', 'mr', 'hi', 'fr', 'ja')
    const prefixMatch = this.voices.find(v => v.lang.toLowerCase().replace("_", "-").startsWith(langPrefix));
    if (prefixMatch) return prefixMatch;

    // 3. Indian language fallback: If specific Dravidian/Indo-Aryan voice is not installed on the OS,
    // use an Indian English or Hindi voice which has correct South Asian phonology and cadence.
    const isIndianLang = ["kn", "ta", "te", "ml", "mr", "bn", "pa", "gu", "or", "as", "kok", "hi", "ur"].includes(langPrefix);
    if (isIndianLang) {
      const indianVoice = this.voices.find(v => {
        const l = v.lang.toLowerCase();
        return l === "hi-in" || l.endsWith("-in") || v.name.toLowerCase().includes("india") || v.name.toLowerCase().includes("hindi");
      });
      if (indianVoice) return indianVoice;
    }

    // 4. Default voice
    return this.voices.find(v => v.default) || this.voices[0] || null;
  }

  /**
   * Speak a phrase in its native regional language with intelligent voice matching
   * @param {string} phrase - Phrase to speak
   * @param {string} lang - BCP-47 tag (e.g. 'kn-IN', 'ta-IN', 'hi-IN')
   * @param {Object} options - { rate, pitch, onStart, onEnd, onError }
   */
  speak(phrase, lang = "en-US", options = {}) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("Speech synthesis is not supported on this browser.");
      if (options.onError) options.onError("Speech synthesis unsupported");
      return;
    }

    window.speechSynthesis.cancel();

    // Clean phrase: If phrase contains native script and romanized text in parens like "Namaskara (ನಮಸ್ಕಾರ)",
    // decide which to feed TTS depending on whether a native voice is installed
    const voice = this.findBestVoice(lang);
    let textToSpeak = phrase;

    const langPrefix = (lang || "").split("-")[0].toLowerCase();
    const hasNativeVoice = voice && voice.lang.toLowerCase().startsWith(langPrefix);

    // If native voice is not installed on this OS, prefer the Romanized portion for cleaner phonetics
    if (!hasNativeVoice && phrase.includes("(") && phrase.includes(")")) {
      const match = phrase.match(/^([^(]+)/);
      if (match) textToSpeak = match[1].trim();
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang;
    if (voice) utterance.voice = voice;
    utterance.rate = options.rate || 0.88; // Slightly slower for natural language learning
    utterance.pitch = options.pitch || 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (err) => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (options.onError) options.onError(err);
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  /**
   * Stop currently playing speech
   */
  stop() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  /**
   * Get primary cultural greeting for a destination for quick audio chips / buttons
   */
  getRegionalGreeting(name = "", country = "", region = "") {
    const phrases = this.getRegionalPhrases(name, country, region);
    return phrases[0] || {
      phrase: "Hello",
      native: "Hello",
      english: "Greetings",
      phonetic: "heh-LOH",
      lang: "en-US"
    };
  }

  /**
   * Returns authentic native phrases for ANY destination, state, or region
   */
  getRegionalPhrases(name = "", country = "", region = "") {
    const norm = `${name} ${country} ${region}`.toLowerCase().replace(/[-_]/g, " ");

    // --- 1. INDIAN STATES & UNION TERRITORIES ---
    if (norm.includes("karnataka") || norm.includes("bangalore") || norm.includes("bengaluru") || norm.includes("mysore") || norm.includes("mysuru") || norm.includes("hampi") || norm.includes("coorg") || norm.includes("gokarna") || norm.includes("badami")) {
      return [
        { phrase: "Namaskara", native: "ನಮಸ್ಕಾರ", english: "Hello / Traditional respectful greeting", phonetic: "nah-mah-SKAH-rah", lang: "kn-IN" },
        { phrase: "Dhanyavadagalu", native: "ಧನ್ಯವಾದಗಳು", english: "Thank you very much", phonetic: "dhun-yah-VAH-dah-gah-loo", lang: "kn-IN" },
        { phrase: "Idakke eshtu bele?", native: "ಇದಕ್ಕೆ ಎಷ್ಟು ಬೆಲೆ?", english: "How much does this cost?", phonetic: "ee-DUHK-keh ESH-too BEH-leh", lang: "kn-IN" },
        { phrase: "Oota aayitha?", native: "ಊಟ ಆಯ್ತಾ?", english: "Did you have food? (Warm welcoming greeting)", phonetic: "OO-tah eye-TAH", lang: "kn-IN" },
        { phrase: "Tumba ruchiyagide!", native: "ತುಂಬಾ ರುಚಿಯಾಗಿದೆ!", english: "This is very delicious!", phonetic: "TOOM-bah roo-chee-YAH-gee-deh", lang: "kn-IN" }
      ];
    }

    if (norm.includes("tamil nadu") || norm.includes("tamilnadu") || norm.includes("chennai") || norm.includes("madurai") || norm.includes("ooty") || norm.includes("mahabalipuram") || norm.includes("thanjavur") || norm.includes("kodaikanal") || norm.includes("rameswaram") || norm.includes("kanyakumari")) {
      return [
        { phrase: "Vanakkam", native: "வணக்கம்", english: "Hello / Traditional greeting with folded hands", phonetic: "vah-NAH-kuhm", lang: "ta-IN" },
        { phrase: "Mikka Nandri", native: "மிக்க நன்றி", english: "Thank you very much", phonetic: "MEEK-kah NAHN-dree", lang: "ta-IN" },
        { phrase: "Idhu evvalavu?", native: "இது எவ்வளவு?", english: "How much is this?", phonetic: "EE-dhoo ehv-vah-LAH-voo", lang: "ta-IN" },
        { phrase: "Saapitteengala?", native: "சாப்பிட்டீங்களா?", english: "Have you eaten? (Warm traditional greeting)", phonetic: "sah-peet-TEEN-gah-lah", lang: "ta-IN" },
        { phrase: "Romba nalla irukku!", native: "ரொம்ப நல்லா இருக்கு!", english: "It is very good / delicious!", phonetic: "ROHM-bah NAHL-lah ee-ROO-koo", lang: "ta-IN" }
      ];
    }

    if (norm.includes("maharashtra") || norm.includes("mumbai") || norm.includes("pune") || norm.includes("nagpur") || norm.includes("nashik") || norm.includes("aurangabad") || norm.includes("shirdi") || norm.includes("lonavala") || norm.includes("mahabaleshwar") || norm.includes("ajanta") || norm.includes("ellora")) {
      return [
        { phrase: "Namaskar", native: "नमस्कार", english: "Hello / Respectful Marathi greeting", phonetic: "nah-mah-SKAR", lang: "mr-IN" },
        { phrase: "Khup khup dhanyawad", native: "खूप खूप धन्यवाद", english: "Thank you very much", phonetic: "khoop khoop dhun-yah-WAHD", lang: "mr-IN" },
        { phrase: "He kitila aahe?", native: "हे कितीला आहे?", english: "How much is this?", phonetic: "hay kee-TEE-lah AAH-hay", lang: "mr-IN" },
        { phrase: "Jevlaat ka?", native: "जेवलात का?", english: "Did you have a meal? (Warm hospitality greeting)", phonetic: "JAYV-laht kah", lang: "mr-IN" },
        { phrase: "Khupach chaan!", native: "खूपच छान!", english: "Wonderful / Very awesome!", phonetic: "KHOO-puch chahn", lang: "mr-IN" }
      ];
    }

    if (norm.includes("kerala") || norm.includes("kochi") || norm.includes("cochin") || norm.includes("munnar") || norm.includes("alleppey") || norm.includes("alappuzha") || norm.includes("wayanad") || norm.includes("trivandrum") || norm.includes("thiruvananthapuram") || norm.includes("varkala")) {
      return [
        { phrase: "Namaskaram", native: "നമസ്കാരം", english: "Hello / Traditional Malayalam greeting", phonetic: "nah-mas-KAH-ruhm", lang: "ml-IN" },
        { phrase: "Valare nanni", native: "വളരെ നന്ദി", english: "Thank you very much", phonetic: "VAH-lah-reh NAHN-nee", lang: "ml-IN" },
        { phrase: "Ithinu ethraya vila?", native: "ഇതിനു എത്രയാ വില?", english: "How much does this cost?", phonetic: "EE-thee-noo EH-thruh-yah VEE-lah", lang: "ml-IN" },
        { phrase: "Kollam! Nalla ruchiyundu", native: "കൊള്ളാം! നല്ല രുചിയുണ്ട്", english: "Awesome! Very delicious food", phonetic: "KOHL-lahm NAHL-lah roo-CHEE-yoon-doo", lang: "ml-IN" },
        { phrase: "Evideyanu sthalam?", native: "എവിടെയാണ് സ്ഥലം?", english: "Where is this location?", phonetic: "eh-vee-DAY-ah-noo STHAH-lahm", lang: "ml-IN" }
      ];
    }

    if (norm.includes("telangana") || norm.includes("andhra") || norm.includes("hyderabad") || norm.includes("visakhapatnam") || norm.includes("vizag") || norm.includes("tirupati") || norm.includes("vijayawada")) {
      return [
        { phrase: "Namaskaram", native: "నమస్కారం", english: "Hello / Respectful Telugu greeting", phonetic: "nah-mas-KAH-ruhm", lang: "te-IN" },
        { phrase: "Chala dhanyavadalu", native: "చాలా ధన్యవాదాలు", english: "Thank you very much", phonetic: "CHAH-lah dhun-yah-VAH-dah-loo", lang: "te-IN" },
        { phrase: "Idi entha?", native: "ఇది ఎంత?", english: "How much is this?", phonetic: "EE-dee EN-thah", lang: "te-IN" },
        { phrase: "Chala bagundi!", native: "చాలా బాగుంది!", english: "It is wonderful / very delicious!", phonetic: "CHAH-lah bah-GOON-dee", lang: "te-IN" },
        { phrase: "Mee peru emiti?", native: "మీ పేరు ఏమిటి?", english: "What is your name?", phonetic: "mee PAY-roo ay-MEE-tee", lang: "te-IN" }
      ];
    }

    if (norm.includes("west bengal") || norm.includes("bengal") || norm.includes("kolkata") || norm.includes("calcutta") || norm.includes("darjeeling") || norm.includes("sundarbans")) {
      return [
        { phrase: "Nomoshkar", native: "নমস্কার", english: "Hello / Respectful Bengali greeting", phonetic: "noh-mosh-KAR", lang: "bn-IN" },
        { phrase: "Onek dhonnobad", native: "অনেক ধন্যবাদ", english: "Thank you very much", phonetic: "oh-NEK dhon-noh-BAHD", lang: "bn-IN" },
        { phrase: "Eitar daam koto?", native: "এটার দাম কত?", english: "What is the price of this?", phonetic: "AY-tahr dahm KOH-toh", lang: "bn-IN" },
        { phrase: "Khub bhalo!", native: "খুব ভালো!", english: "Very good / Beautiful!", phonetic: "khoob BAH-loh", lang: "bn-IN" },
        { phrase: "Darun khete!", native: "দারুণ খেতে!", english: "Tastes absolutely delicious!", phonetic: "DAH-roon KHEH-tay", lang: "bn-IN" }
      ];
    }

    if (norm.includes("goa") || norm.includes("panaji") || norm.includes("calangute") || norm.includes("anjuna") || norm.includes("margao") || norm.includes("palolem")) {
      return [
        { phrase: "Deu boro dis dium", native: "देव बरो दीस दींव", english: "Good day / May God give you a good day (Konkani)", phonetic: "day-oo BOH-roh dees DEE-oom", lang: "kok-IN" },
        { phrase: "Dev borem korum", native: "देव बरें करूं", english: "Thank you / God bless you (Konkani)", phonetic: "dayv BOH-rem koh-ROOM", lang: "kok-IN" },
        { phrase: "Kitlem zalem?", native: "कितलें जालें?", english: "How much does it cost?", phonetic: "KIT-lem ZAH-lem", lang: "kok-IN" },
        { phrase: "Borem laglem!", native: "बरें लागलें!", english: "It was wonderful / delicious!", phonetic: "BOH-rem LAHG-lem", lang: "kok-IN" },
        { phrase: "Khuim vochpak zai?", native: "खंय वचपाक जाय?", english: "Where do you want to go?", phonetic: "kheem VOCH-pahk zye", lang: "kok-IN" }
      ];
    }

    if (norm.includes("uttarakhand") || norm.includes("rishikesh") || norm.includes("haridwar") || norm.includes("nainital") || norm.includes("mussoorie") || norm.includes("kedarnath") || norm.includes("badrinath") || norm.includes("dehradun") || norm.includes("auli")) {
      return [
        { phrase: "Namaste ji", native: "नमस्ते जी", english: "Hello / Respectful mountain greeting", phonetic: "nuh-muh-STAY jee", lang: "hi-IN" },
        { phrase: "Bahut bahut dhanyawad", native: "बहुत-बहुत धन्यवाद", english: "Thank you very much", phonetic: "buh-HOOT buh-HOOT dhun-yuh-VAHD", lang: "hi-IN" },
        { phrase: "Yeh kitne ka hai?", native: "यह कितने का है?", english: "How much is this?", phonetic: "yeh KIT-neh kah high", lang: "hi-IN" },
        { phrase: "Jai Badri Vishal!", native: "जय बद्री विशाल!", english: "Victory to Lord Badrinath (Sacred mountain greeting)", phonetic: "jay BUHD-ree vee-SHAHL", lang: "hi-IN" },
        { phrase: "Khana bahut swadisht hai!", native: "खाना बहुत स्वादिष्ट है!", english: "The food is delicious!", phonetic: "KHAH-nah buh-HOOT swah-DISHT high", lang: "hi-IN" }
      ];
    }

    if (norm.includes("uttar pradesh") || norm.includes("agra") || norm.includes("varanasi") || norm.includes("banaras") || norm.includes("kashi") || norm.includes("ayodhya") || norm.includes("lucknow") || norm.includes("mathura") || norm.includes("vrindavan") || norm.includes("prayagraj") || norm.includes("fatehpur")) {
      return [
        { phrase: "Namaste / Aadaab", native: "नमस्ते / आदाब", english: "Hello / Respectful Awadhi greeting", phonetic: "nuh-muh-STAY / ah-DAHB", lang: "hi-IN" },
        { phrase: "Aapka bahut shukriya", native: "आपका बहुत शुक्रिया", english: "Thank you very much", phonetic: "AHP-kah buh-HOOT shook-REE-yah", lang: "hi-IN" },
        { phrase: "Yeh kitne ka diya?", native: "यह कितने का दिया?", english: "What is the price for this?", phonetic: "yeh KIT-neh kah DEE-yah", lang: "hi-IN" },
        { phrase: "Har Har Mahadev!", native: "हर हर महादेव!", english: "Praise to Lord Shiva (Universal Varanasi greeting)", phonetic: "huhr huhr muh-hah-DAYV", lang: "hi-IN" },
        { phrase: "Subhan Allah, bahut lazeez!", native: "सुभान अल्लाह, बहुत लज़ीज़!", english: "Extremely delicious Nawabi food!", phonetic: "soo-BAHN uhl-LAH buh-HOOT luh-ZEEZ", lang: "hi-IN" }
      ];
    }

    if (norm.includes("rajasthan") || norm.includes("jaipur") || norm.includes("udaipur") || norm.includes("jodhpur") || norm.includes("jaisalmer") || norm.includes("pushkar") || norm.includes("ranthambore")) {
      return [
        { phrase: "Khamma Ghani", native: "खम्मा घणी", english: "Royal auspicious greeting / Hello", phonetic: "KHAM-mah GHAH-nee", lang: "hi-IN" },
        { phrase: "Ghano aabhaar", native: "घणो आभार", english: "Thank you very much", phonetic: "GHAH-noh ah-BHAHR", lang: "hi-IN" },
        { phrase: "Kai bhaav hai?", native: "काईं भाव है?", english: "What is the price?", phonetic: "kye bhahv high", lang: "hi-IN" },
        { phrase: "Padharo mhare des", native: "पधारो म्हारे देस", english: "Welcome to our land (Signature welcome)", phonetic: "pah-DHAH-roh MMAH-ray days", lang: "hi-IN" },
        { phrase: "Ghano hi chokho!", native: "घणो ही चोखो!", english: "Superb / Extremely delicious!", phonetic: "GHAH-noh hee CHOH-khoh", lang: "hi-IN" }
      ];
    }

    if (norm.includes("himachal") || norm.includes("shimla") || norm.includes("manali") || norm.includes("dharamshala") || norm.includes("mcleodganj") || norm.includes("spiti") || norm.includes("kasol") || norm.includes("kullu")) {
      return [
        { phrase: "Namaste ji", native: "नमस्ते जी", english: "Respectful Himalayan greeting", phonetic: "nuh-muh-STAY jee", lang: "hi-IN" },
        { phrase: "Tuhada bada dhanyawad", native: "तुहाडा बड़ा धन्यवाद", english: "Thank you very much", phonetic: "too-HAH-dah buh-DAH dhun-yuh-VAHD", lang: "hi-IN" },
        { phrase: "Ehde kitne paise?", native: "एहदे कितने पैसे?", english: "How much does this cost?", phonetic: "EH-day KIT-nay pie-SAY", lang: "hi-IN" },
        { phrase: "Bada suthra lagda!", native: "बड़ा सुथरा लगदा!", english: "Looks wonderfully scenic / clean!", phonetic: "buh-DAH SOOTH-rah LUHG-dah", lang: "hi-IN" },
        { phrase: "Khana bada swaad hai!", native: "खाना बड़ा स्वाद है!", english: "The food is packed with flavor!", phonetic: "KHAH-nah buh-DAH SWAHD high", lang: "hi-IN" }
      ];
    }

    if (norm.includes("punjab") || norm.includes("amritsar") || norm.includes("chandigarh")) {
      return [
        { phrase: "Sat Sri Akal", native: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", english: "God is Truth / Universal Sikh greeting", phonetic: "SUHT sree uh-KAHL", lang: "pa-IN" },
        { phrase: "Dhanwaad ji", native: "ਧੰਨਵਾਦ ਜੀ", english: "Thank you very much", phonetic: "dhun-WAHD jee", lang: "pa-IN" },
        { phrase: "Eh kinne da hai?", native: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", english: "How much is this?", phonetic: "eh KIN-nay dah high", lang: "pa-IN" },
        { phrase: "Swaad aa gaya!", native: "ਸਵਾਦ ਆ ਗਿਆ!", english: "Immense culinary delight / Delicious!", phonetic: "SWAHD ah GY-ah", lang: "pa-IN" },
        { phrase: "Chardi Kala!", native: "ਚੜ੍ਹਦੀ ਕਲਾ!", english: "High spirits / Ever-optimistic state", phonetic: "chuhr-DEE kuh-LAH", lang: "pa-IN" }
      ];
    }

    if (norm.includes("gujarat") || norm.includes("ahmedabad") || norm.includes("surat") || norm.includes("vadodara") || norm.includes("kutch") || norm.includes("gir")) {
      return [
        { phrase: "Kem cho? / Namaste", native: "કેમ છો? / નમસ્તે", english: "How are you? / Hello", phonetic: "KEM choh / nuh-muh-STAY", lang: "gu-IN" },
        { phrase: "Maja ma!", native: "મજા માં!", english: "I am doing great! (Standard response)", phonetic: "muh-JAH mah", lang: "gu-IN" },
        { phrase: "Khub aabhar", native: "ખૂબ આભાર", english: "Thank you very much", phonetic: "khoob ah-BHAHR", lang: "gu-IN" },
        { phrase: "Aa ketla nu che?", native: "આ કેટલા નું છે?", english: "How much is this?", phonetic: "ah KET-lah noo chay", lang: "gu-IN" },
        { phrase: "Bahu saras che!", native: "બહુ સરસ છે!", english: "Very nice / Wonderful!", phonetic: "BUH-hoo SUH-ruhs chay", lang: "gu-IN" }
      ];
    }

    if (norm.includes("kashmir") || norm.includes("srinagar") || norm.includes("gulmarg") || norm.includes("pahalgam")) {
      return [
        { phrase: "As-salamu alaykum / Adaab", native: "السلام علیکم / آداب", english: "Peace be upon you / Respectful greeting", phonetic: "us-suh-LAH-moo uh-LAY-koom", lang: "ur-IN" },
        { phrase: "Shukriya", native: "شکریہ", english: "Thank you", phonetic: "shook-REE-yah", lang: "ur-IN" },
        { phrase: "Yath kyah chhu mol?", native: "یَتھ کیا چُھ مول؟", english: "How much does this cost?", phonetic: "yuth kyah choo mohl", lang: "ur-IN" },
        { phrase: "Khosh aamdeed", native: "خوش آمدید", english: "Welcome to Paradise on Earth", phonetic: "khosh ahm-DEED", lang: "ur-IN" },
        { phrase: "Wazwan zabardast chhu!", native: "وازوان زبردست چُھ", english: "The feast is fantastic!", phonetic: "WAHZ-wahn zuh-buhr-DUHST choo", lang: "ur-IN" }
      ];
    }

    if (norm.includes("india") || norm.includes("delhi") || norm.includes("patna") || norm.includes("indore") || norm.includes("bhopal")) {
      return [
        { phrase: "Namaste", native: "नमस्ते", english: "Respectful traditional greeting", phonetic: "nuh-muh-STAY", lang: "hi-IN" },
        { phrase: "Aapka bahut dhanyawad", native: "आपका बहुत धन्यवाद", english: "Thank you very much", phonetic: "AHP-kah buh-HOOT dhun-yuh-VAHD", lang: "hi-IN" },
        { phrase: "Yeh kitne ka hai?", native: "यह कितने का है?", english: "How much does this cost?", phonetic: "yeh KIT-neh kah high", lang: "hi-IN" },
        { phrase: "Kripya thoda kam kijiye", native: "कृपया थोड़ा कम कीजिए", english: "Please give a fair price (polite)", phonetic: "KRIP-yah THOH-dah kuhm KEE-jee-yay", lang: "hi-IN" },
        { phrase: "Swadisht khana hai!", native: "स्वादिष्ट खाना है!", english: "The food is delicious!", phonetic: "swah-DISHT KHAH-nah high", lang: "hi-IN" }
      ];
    }

    // --- 2. GLOBAL COUNTRIES & REGIONS ---
    if (norm.includes("japan") || norm.includes("tokyo") || norm.includes("kyoto") || norm.includes("osaka") || norm.includes("nara") || norm.includes("fuji")) {
      return [
        { phrase: "Konnichiwa", native: "こんにちは", english: "Hello / Good afternoon", phonetic: "kohn-nee-chee-wah", lang: "ja-JP" },
        { phrase: "Arigatou gozaimasu", native: "ありがとうございます", english: "Thank you very much", phonetic: "ah-ree-GAH-toh go-ZYE-mahs", lang: "ja-JP" },
        { phrase: "Sumimasen", native: "すみません", english: "Excuse me / Sorry", phonetic: "soo-mee-mah-SEN", lang: "ja-JP" },
        { phrase: "Kore wa ikura desu ka?", native: "これはいくらですか？", english: "How much is this?", phonetic: "koh-reh wah ee-koo-rah dess kah", lang: "ja-JP" },
        { phrase: "Oishii desu!", native: "美味しいです！", english: "This is delicious!", phonetic: "oy-shee dess", lang: "ja-JP" }
      ];
    }

    if (norm.includes("france") || norm.includes("paris") || norm.includes("nice") || norm.includes("lyon") || norm.includes("marseille") || norm.includes("bordeaux")) {
      return [
        { phrase: "Bonjour, s'il vous plaît", native: "Bonjour, s'il vous plaît", english: "Hello, please", phonetic: "bohn-zhoor seel voo pleh", lang: "fr-FR" },
        { phrase: "Merci beaucoup", native: "Merci beaucoup", english: "Thank you very much", phonetic: "mehr-SEE boh-KOO", lang: "fr-FR" },
        { phrase: "L'addition, s'il vous plaît", native: "L'addition, s'il vous plaît", english: "The check, please", phonetic: "lah-dee-SYOHN seel voo pleh", lang: "fr-FR" },
        { phrase: "Où sont les toilettes?", native: "Où sont les toilettes?", english: "Where is the restroom?", phonetic: "oo sohn lay twah-LET", lang: "fr-FR" },
        { phrase: "C'est délicieux!", native: "C'est délicieux!", english: "It is delicious!", phonetic: "seh day-lee-SYUH", lang: "fr-FR" }
      ];
    }

    if (norm.includes("italy") || norm.includes("italia") || norm.includes("rome") || norm.includes("roma") || norm.includes("florence") || norm.includes("firenze") || norm.includes("venice") || norm.includes("milan") || norm.includes("naples")) {
      return [
        { phrase: "Buongiorno!", native: "Buongiorno!", english: "Good morning / Hello", phonetic: "bwon-JOHR-noh", lang: "it-IT" },
        { phrase: "Grazie mille", native: "Grazie mille", english: "A thousand thanks", phonetic: "GRAHT-see-eh MEEL-leh", lang: "it-IT" },
        { phrase: "Il conto, per favore", native: "Il conto, per favore", english: "The check, please", phonetic: "eel KOHN-toh pair fah-VOH-reh", lang: "it-IT" },
        { phrase: "Un caffè, per favore", native: "Un caffè, per favore", english: "An espresso, please", phonetic: "oon kahf-FEH pair fah-VOH-reh", lang: "it-IT" },
        { phrase: "Squisito!", native: "Squisito!", english: "Delicious / Exquisite!", phonetic: "skwee-ZEE-toh", lang: "it-IT" }
      ];
    }

    if (norm.includes("spain") || norm.includes("españa") || norm.includes("madrid") || norm.includes("barcelona") || norm.includes("seville") || norm.includes("valencia") || norm.includes("mexico") || norm.includes("argentina") || norm.includes("colombia") || norm.includes("peru") || norm.includes("cusco")) {
      return [
        { phrase: "¡Hola! ¿Cómo estás?", native: "¡Hola! ¿Cómo estás?", english: "Hello! How are you?", phonetic: "OH-lah KOH-moh ess-TAHS", lang: "es-ES" },
        { phrase: "Muchas gracias", native: "Muchas gracias", english: "Thank you very much", phonetic: "MOO-chahs GRAH-syahs", lang: "es-ES" },
        { phrase: "¿Cuánto cuesta?", native: "¿Cuánto cuesta?", english: "How much does it cost?", phonetic: "KWAHN-toh KWEHS-tah", lang: "es-ES" },
        { phrase: "La cuenta, por favor", native: "La cuenta, por favor", english: "The check, please", phonetic: "lah KWEHN-tah por fah-VOR", lang: "es-ES" },
        { phrase: "¡Está riquísimo!", native: "¡Está riquísimo!", english: "It is extremely delicious!", phonetic: "ess-TAH ree-KEE-see-moh", lang: "es-ES" }
      ];
    }

    if (norm.includes("germany") || norm.includes("deutschland") || norm.includes("berlin") || norm.includes("munich") || norm.includes("münchen") || norm.includes("frankfurt") || norm.includes("hamburg") || norm.includes("austria") || norm.includes("vienna") || norm.includes("wien")) {
      return [
        { phrase: "Guten Tag / Hallo", native: "Guten Tag / Hallo", english: "Hello / Good day", phonetic: "GOO-ten tahk / HAH-loh", lang: "de-DE" },
        { phrase: "Vielen Dank", native: "Vielen Dank", english: "Thank you very much", phonetic: "FEE-len dahnk", lang: "de-DE" },
        { phrase: "Was kostet das?", native: "Was kostet das?", english: "How much does this cost?", phonetic: "vahs KOHS-tet dahs", lang: "de-DE" },
        { phrase: "Die Rechnung, bitte", native: "Die Rechnung, bitte", english: "The bill, please", phonetic: "dee REKH-noong BIT-teh", lang: "de-DE" },
        { phrase: "Sehr lecker!", native: "Sehr lecker!", english: "Very delicious!", phonetic: "zair LEK-kair", lang: "de-DE" }
      ];
    }

    if (norm.includes("switzerland") || norm.includes("zurich") || norm.includes("geneva") || norm.includes("lucerne") || norm.includes("basel")) {
      return [
        { phrase: "Grüezi!", native: "Grüezi!", english: "Hello (Swiss German greeting)", phonetic: "GREW-tsee", lang: "de-CH" },
        { phrase: "Merci vilmal", native: "Merci vilmal", english: "Thank you very much", phonetic: "MAIR-see FEEL-mahl", lang: "de-CH" },
        { phrase: "Was choschtet das?", native: "Was choschtet das?", english: "How much does this cost?", phonetic: "vahs KHOHSH-tet dahs", lang: "de-CH" },
        { phrase: "En Guete!", native: "En Guete!", english: "Bon appétit / Enjoy your meal!", phonetic: "en GOO-eh-teh", lang: "de-CH" },
        { phrase: "Uf Wiederluege", native: "Uf Wiederluege", english: "Goodbye (Swiss German)", phonetic: "oof VEE-der-loo-eh-geh", lang: "de-CH" }
      ];
    }

    if (norm.includes("netherlands") || norm.includes("holland") || norm.includes("amsterdam") || norm.includes("rotterdam") || norm.includes("hague")) {
      return [
        { phrase: "Hallo / Goedendag", native: "Hallo / Goedendag", english: "Hello / Good day", phonetic: "HAH-loh / khoo-yeh-DAHK", lang: "nl-NL" },
        { phrase: "Dank je wel", native: "Dank je wel", english: "Thank you very much", phonetic: "dahnk yeh VEHL", lang: "nl-NL" },
        { phrase: "Hoeveel kost dit?", native: "Hoeveel kost dit?", english: "How much does this cost?", phonetic: "hoo-VEHL kohst dit", lang: "nl-NL" },
        { phrase: "De rekening, alstublieft", native: "De rekening, alstublieft", english: "The check, please", phonetic: "duh RAY-kuh-ning AHL-stoo-bleeft", lang: "nl-NL" },
        { phrase: "Lekker!", native: "Lekker!", english: "Delicious / Wonderful!", phonetic: "LEK-kuhr", lang: "nl-NL" }
      ];
    }

    if (norm.includes("brazil") || norm.includes("brasil") || norm.includes("rio") || norm.includes("são paulo") || norm.includes("salvador") || norm.includes("portugal") || norm.includes("lisbon") || norm.includes("porto")) {
      return [
        { phrase: "Olá, tudo bem?", native: "Olá, tudo bem?", english: "Hello, how are you?", phonetic: "oh-LAH TOO-doo bayng", lang: "pt-BR" },
        { phrase: "Muito obrigado", native: "Muito obrigado", english: "Thank you very much", phonetic: "MWEE-too oh-bree-GAH-doo", lang: "pt-BR" },
        { phrase: "Quanto custa?", native: "Quanto custa?", english: "How much does it cost?", phonetic: "KWAHN-too KOOSH-tah", lang: "pt-BR" },
        { phrase: "A conta, por favor", native: "A conta, por favor", english: "The check, please", phonetic: "ah KOHN-tah poor fah-VOHR", lang: "pt-BR" },
        { phrase: "Uma delícia!", native: "Uma delícia!", english: "Delicious!", phonetic: "OO-mah deh-LEE-see-ah", lang: "pt-BR" }
      ];
    }

    if (norm.includes("indonesia") || norm.includes("bali") || norm.includes("jakarta") || norm.includes("ubud") || norm.includes("lombok") || norm.includes("yogyakarta")) {
      return [
        { phrase: "Om Swastyastu", native: "Om Swastyastu", english: "Sacred Balinese greeting / Peace", phonetic: "ohm swahs-TYAHS-too", lang: "id-ID" },
        { phrase: "Matur suksma", native: "Matur suksma", english: "Thank you very much (Balinese)", phonetic: "MAH-toor SOOKS-mah", lang: "id-ID" },
        { phrase: "Berapa harganya?", native: "Berapa harganya?", english: "How much is this?", phonetic: "beh-RAH-pah har-GAHN-yah", lang: "id-ID" },
        { phrase: "Tolong minta bon", native: "Tolong minta bon", english: "The bill, please", phonetic: "TOH-lohng MEEN-tah bohn", lang: "id-ID" },
        { phrase: "Enak sekali!", native: "Enak sekali!", english: "Extremely delicious!", phonetic: "EH-nahk seh-KAH-lee", lang: "id-ID" }
      ];
    }

    if (norm.includes("egypt") || norm.includes("cairo") || norm.includes("alexandria") || norm.includes("luxor") || norm.includes("giza") || norm.includes("dubai") || norm.includes("uae") || norm.includes("emirates") || norm.includes("saudi") || norm.includes("qatar") || norm.includes("morocco")) {
      return [
        { phrase: "Salam Alaykum", native: "السلام عليكم", english: "Peace be upon you (Universal greeting)", phonetic: "suh-LAHM uh-LAY-koom", lang: "ar-EG" },
        { phrase: "Shukran jazeelan", native: "شكراً جزيلاً", english: "Thank you very much", phonetic: "SHOOK-rahn jah-ZEE-lahn", lang: "ar-EG" },
        { phrase: "Bikam hatha?", native: "بكم هذا؟", english: "How much is this?", phonetic: "bee-KAHM HAH-dhah", lang: "ar-EG" },
        { phrase: "El hesaab, law samaht", native: "الحساب لو سمحت", english: "The bill, please", phonetic: "el heh-SAHB low suh-MAHT", lang: "ar-EG" },
        { phrase: "La, shukran", native: "لا، شكراً", english: "No, thank you (Polite refusal)", phonetic: "lah SHOOK-rahn", lang: "ar-EG" }
      ];
    }

    if (norm.includes("china") || norm.includes("beijing") || norm.includes("shanghai") || norm.includes("guangzhou") || norm.includes("xi'an") || norm.includes("chengdu") || norm.includes("hong kong")) {
      return [
        { phrase: "Nǐ hǎo", native: "你好", english: "Hello / Greetings", phonetic: "nee how", lang: "zh-CN" },
        { phrase: "Xièxiè nǐ", native: "谢谢你", english: "Thank you very much", phonetic: "shee-eh shee-eh nee", lang: "zh-CN" },
        { phrase: "Zhège duōshǎo qián?", native: "这个多少钱？", english: "How much is this?", phonetic: "JAY-guh DWOR-shaow chyen", lang: "zh-CN" },
        { phrase: "Mǎidān, xièxiè", native: "买单，谢谢", english: "Check please, thank you", phonetic: "mye-DAHN shee-eh-shee-eh", lang: "zh-CN" },
        { phrase: "Hǎo chī!", native: "好吃！", english: "Delicious!", phonetic: "how chur", lang: "zh-CN" }
      ];
    }

    if (norm.includes("korea") || norm.includes("seoul") || norm.includes("busan") || norm.includes("jeju")) {
      return [
        { phrase: "Annyeonghaseyo", native: "안녕하세요", english: "Hello / Good day", phonetic: "ahn-nyung-hah-say-yoh", lang: "ko-KR" },
        { phrase: "Gamsahamnida", native: "감사합니다", english: "Thank you very much", phonetic: "gahm-sah-hahm-nee-dah", lang: "ko-KR" },
        { phrase: "Igeo eolmayeyo?", native: "이거 얼마예요?", english: "How much is this?", phonetic: "ee-gaw uhl-mah-yay-yoh", lang: "ko-KR" },
        { phrase: "Gyesanseo juseyo", native: "계산서 주세요", english: "Bill please", phonetic: "kyeh-sahn-saw joo-say-yoh", lang: "ko-KR" },
        { phrase: "Mas-iss-eoyo!", native: "맛있어요！", english: "It is delicious!", phonetic: "mah-shee-saw-yoh", lang: "ko-KR" }
      ];
    }

    if (norm.includes("thailand") || norm.includes("bangkok") || norm.includes("phuket") || norm.includes("chiang mai")) {
      return [
        { phrase: "Sawasdee khrup / ka", native: "สวัสดีครับ / ค่ะ", english: "Hello (Traditional greeting)", phonetic: "sah-wahd-DEE krahp / kah", lang: "th-TH" },
        { phrase: "Khob khun khrup / ka", native: "ขอบคุณครับ / ค่ะ", english: "Thank you very much", phonetic: "kop-KOON krahp / kah", lang: "th-TH" },
        { phrase: "Nee tao rai?", native: "นี่เท่าไหร่？", english: "How much is this?", phonetic: "nee tow-RYE", lang: "th-TH" },
        { phrase: "Check bin duay khrup / ka", native: "เช็คบิลด้วยครับ / ค่ะ", english: "Check please", phonetic: "chek-BIN doo-ay", lang: "th-TH" },
        { phrase: "Aroy mak!", native: "อร่อยมาก！", english: "Very delicious!", phonetic: "ah-ROY mahk", lang: "th-TH" }
      ];
    }

    if (norm.includes("vietnam") || norm.includes("hanoi") || norm.includes("ho chi minh") || norm.includes("da nang") || norm.includes("hoi an")) {
      return [
        { phrase: "Xin chào", native: "Xin chào", english: "Hello / Greetings", phonetic: "sin CHOW", lang: "vi-VN" },
        { phrase: "Cảm ơn bạn", native: "Cảm ơn bạn", english: "Thank you very much", phonetic: "gahm UN bahn", lang: "vi-VN" },
        { phrase: "Cái này bao nhiêu tiền?", native: "Cái này bao nhiêu tiền?", english: "How much is this?", phonetic: "kye nye bow nyew tyen", lang: "vi-VN" },
        { phrase: "Tính tiền, làm ơn", native: "Tính tiền, làm ơn", english: "Check please", phonetic: "tin tyen lahm un", lang: "vi-VN" },
        { phrase: "Ngon quá!", native: "Ngon quá!", english: "Delicious!", phonetic: "ngawn kwah", lang: "vi-VN" }
      ];
    }

    if (norm.includes("greece") || norm.includes("athens") || norm.includes("santorini") || norm.includes("mykonos") || norm.includes("crete")) {
      return [
        { phrase: "Kalimera!", native: "Καλημέρα!", english: "Good morning / Hello", phonetic: "kah-lee-MEH-rah", lang: "el-GR" },
        { phrase: "Efharisto poly", native: "Ευχαριστώ πολύ", english: "Thank you very much", phonetic: "ef-hah-rees-TOH poh-LEE", lang: "el-GR" },
        { phrase: "Poso kani afto?", native: "Πόσο κάνει αυτό;", english: "How much does this cost?", phonetic: "POH-soh KAH-nee ahf-TOH", lang: "el-GR" },
        { phrase: "To logariasmo, parakalo", native: "Το λογαριασμό, παρακαλώ", english: "The check, please", phonetic: "toh loh-gah-ryahs-MOH pah-rah-kah-LOH", lang: "el-GR" },
        { phrase: "Nostimo!", native: "Νόστιμο!", english: "Delicious!", phonetic: "NOHS-tee-moh", lang: "el-GR" }
      ];
    }

    if (norm.includes("turkey") || norm.includes("türkiye") || norm.includes("istanbul") || norm.includes("cappadocia") || norm.includes("antalya")) {
      return [
        { phrase: "Merhaba", native: "Merhaba", english: "Hello / Greetings", phonetic: "MEHR-hah-bah", lang: "tr-TR" },
        { phrase: "Teşekkür ederim", native: "Teşekkür ederim", english: "Thank you very much", phonetic: "teh-shek-KOOR eh-deh-reem", lang: "tr-TR" },
        { phrase: "Bu ne kadar?", native: "Bu ne kadar?", english: "How much is this?", phonetic: "boo neh kah-DAHR", lang: "tr-TR" },
        { phrase: "Hesap, lütfen", native: "Hesap, lütfen", english: "The bill, please", phonetic: "heh-SAHP lyoot-FEN", lang: "tr-TR" },
        { phrase: "Çok lezzetli!", native: "Çok lezzetli!", english: "Very delicious!", phonetic: "chohk lez-ZET-lee", lang: "tr-TR" }
      ];
    }

    if (norm.includes("russia") || norm.includes("moscow") || norm.includes("st petersburg")) {
      return [
        { phrase: "Zdravstvuyte", native: "Здравствуйте", english: "Hello / Respectful greeting", phonetic: "zDRAHST-voot-yeh", lang: "ru-RU" },
        { phrase: "Spasibo bolshoye", native: "Спасибо большое", english: "Thank you very much", phonetic: "spuh-SEE-buh buhl-SHOY-yeh", lang: "ru-RU" },
        { phrase: "Skolko eto stoit?", native: "Сколько это стоит?", english: "How much does this cost?", phonetic: "SKOHL-kuh EH-tuh STOH-eet", lang: "ru-RU" },
        { phrase: "Schyot, pozhaluysta", native: "Счёт, пожалуйста", english: "The bill, please", phonetic: "shchyoht pah-ZHAH-loo-stuh", lang: "ru-RU" },
        { phrase: "Ochen vkusno!", native: "Очень вкусно!", english: "Very delicious!", phonetic: "OH-cheen VKOOS-nuh", lang: "ru-RU" }
      ];
    }

    if (norm.includes("australia") || norm.includes("sydney") || norm.includes("melbourne") || norm.includes("brisbane") || norm.includes("perth")) {
      return [
        { phrase: "G'day mate!", native: "G'day mate!", english: "Classic Australian greeting", phonetic: "guh-DAY mayt", lang: "en-AU" },
        { phrase: "No worries at all", native: "No worries at all", english: "You're welcome / It is fine", phonetic: "noh WUR-reez aht awl", lang: "en-AU" },
        { phrase: "Flat white, please", native: "Flat white, please", english: "Ordering iconic Australian espresso coffee", phonetic: "FLAT wyte pleez", lang: "en-AU" },
        { phrase: "Cheers!", native: "Cheers!", english: "Thank you / Celebration", phonetic: "CHEERZ", lang: "en-AU" }
      ];
    }

    if (norm.includes("united kingdom") || norm.includes("uk") || norm.includes("london") || norm.includes("scotland") || norm.includes("edinburgh")) {
      return [
        { phrase: "Cheers!", native: "Cheers!", english: "Thank you / Good health", phonetic: "CHEERZ", lang: "en-GB" },
        { phrase: "Mind the gap", native: "Mind the gap", english: "Famous London Underground transit warning", phonetic: "mynd thuh gap", lang: "en-GB" },
        { phrase: "Fancy a cuppa?", native: "Fancy a cuppa?", english: "Would you like a cup of tea?", phonetic: "FAN-see uh KUP-pah", lang: "en-GB" },
        { phrase: "Could I have the bill, please?", native: "Could I have the bill, please?", english: "Asking for the restaurant check", phonetic: "kood eye hav thuh bil pleez", lang: "en-GB" }
      ];
    }

    // Default English fallback for international regions
    return [
      { phrase: "Hello", native: "Hello", english: "Everyday greeting", phonetic: "heh-LOH", lang: "en-US" },
      { phrase: "Thank you very much", native: "Thank you very much", english: "Expressing gratitude", phonetic: "THANK yoo VEH-ree much", lang: "en-US" },
      { phrase: "How much is this?", native: "How much is this?", english: "Asking the price", phonetic: "HOW much iz this", lang: "en-US" },
      { phrase: "Could you help me?", native: "Could you help me?", english: "Polite request for directions or assistance", phonetic: "kood yoo HELP mee", lang: "en-US" }
    ];
  }
}

export const regionalAudioService = new RegionalAudioService();
