import { useState, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const INDIA_REGIONS = [
  { id: "north", label: "North India", states: "Delhi, UP, Punjab, Haryana, HP", hub: "Delhi" },
  { id: "south", label: "South India", states: "Tamil Nadu, Kerala, Karnataka, AP, Telangana", hub: "Chennai" },
  { id: "west", label: "West India", states: "Maharashtra, Gujarat, Rajasthan, Goa", hub: "Mumbai" },
  { id: "east", label: "East India", states: "West Bengal, Bihar, Odisha, Jharkhand", hub: "Kolkata" },
  { id: "central", label: "Central India", states: "MP, Chhattisgarh, Uttarakhand", hub: "Bhopal" },
  { id: "ne", label: "North East", states: "Assam, Meghalaya, Manipur, Tripura", hub: "Guwahati" },
];

const VEHICLE_MAKES = {
  Car: ["Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Honda", "Toyota", "Kia", "Volkswagen", "Skoda", "Ford", "Other"],
  Bike: ["Hero", "Honda", "Bajaj", "TVS", "Royal Enfield", "Yamaha", "Suzuki", "KTM", "Other"],
};

const SYMPTOMS = [
  { id: 1, label: "Strange knocking noise", icon: "🔊", category: "engine", hindiHint: "Khatkhat ki awaaz" },
  { id: 2, label: "Engine vibration / shaking", icon: "⚡", category: "engine", hindiHint: "Engine kaanp raha hai" },
  { id: 3, label: "Black / white smoke", icon: "💨", category: "engine", hindiHint: "Dhuan aa raha hai" },
  { id: 4, label: "Oil leak / dripping", icon: "🛢️", category: "fluid", hindiHint: "Tel tapak raha hai" },
  { id: 5, label: "Poor pickup / acceleration", icon: "🐢", category: "performance", hindiHint: "Gaadi dhheemi hai" },
  { id: 6, label: "Hard to start / crank", icon: "🔑", category: "engine", hindiHint: "Start nahi ho raha" },
  { id: 7, label: "Brake squeaking / weak", icon: "🛑", category: "safety", hindiHint: "Brake ki awaaz / dhheele brake" },
  { id: 8, label: "Overheating", icon: "🌡️", category: "cooling", hindiHint: "Engine garm ho raha hai" },
  { id: 9, label: "Fuel smell / high consumption", icon: "⛽", category: "fluid", hindiHint: "Petrol ki badboo / mileage kam" },
  { id: 10, label: "Warning light on dashboard", icon: "⚠️", category: "electrical", hindiHint: "Dashboard mein light jal rahi hai" },
  { id: 11, label: "Suspension / rough ride", icon: "🔩", category: "suspension", hindiHint: "Gaadi uchhal rahi hai" },
  { id: 12, label: "AC not cooling", icon: "❄️", category: "electrical", hindiHint: "AC thanda nahi kar raha" },
  { id: 13, label: "Gear changing problem", icon: "⚙️", category: "transmission", hindiHint: "Gear nahi badal raha" },
  { id: 14, label: "Battery/electrical issue", icon: "🔋", category: "electrical", hindiHint: "Battery kharab / bijli ki dikkat" },
];

// Parts DB with INR prices + alternatives + pros/cons
const PARTS_DB = {
  engine: [
    {
      name: "Spark Plugs (Set of 4)",
      oemBrand: "Bosch / NGK (OEM)", oemPrice: 1200,
      alt1Brand: "Minda / Ucal (Aftermarket)", alt1Price: 380,
      alt2Brand: "Local / Unbranded", alt2Price: 120,
      oemPros: ["Exact factory fit", "Longer life 40,000 km", "Best performance"],
      oemCons: ["Expensive", "Only at authorized dealer"],
      alt1Pros: ["Good quality", "Widely available", "ISI marked"],
      alt1Cons: ["Life ~20,000 km", "Slight power difference"],
      alt2Pros: ["Very cheap", "Available everywhere"],
      alt2Cons: ["Poor quality", "May damage engine", "No warranty"],
      recommended: "alt1",
      urgency: "high", lifespan: "30,000 km",
      mechanicNote: "Mere gaadi mein spark plugs kharab hain. NGK ya Minda ke spark plugs lagao, local mat lagana.",
      deliveryDays: { north: 2, south: 3, west: 2, east: 4, central: 3, ne: 6 },
    },
    {
      name: "Engine Air Filter",
      oemBrand: "Bosch / OEM", oemPrice: 950,
      alt1Brand: "Purolator / Roots (Aftermarket)", alt1Price: 280,
      alt2Brand: "Local paper filter", alt2Price: 80,
      oemPros: ["Perfect fitment", "Best filtration"],
      oemCons: ["Costly", "Dealer-only"],
      alt1Pros: ["Good filtration", "Budget-friendly", "Easy to find"],
      alt1Cons: ["Change earlier at 12,000 km"],
      alt2Pros: ["Cheapest option"],
      alt2Cons: ["Poor filtration", "Engine damage risk"],
      recommended: "alt1",
      urgency: "medium", lifespan: "15,000 km",
      mechanicNote: "Air filter ekdum band ho gaya hai. Purolator ya Roots ka air filter lagao, local ka mat lagana.",
      deliveryDays: { north: 1, south: 2, west: 1, east: 3, central: 2, ne: 5 },
    },
  ],
  cooling: [
    {
      name: "Thermostat",
      oemBrand: "Wahler / OEM", oemPrice: 1800,
      alt1Brand: "Subros / Sigma (Aftermarket)", alt1Price: 550,
      alt2Brand: "Local cast", alt2Price: 150,
      oemPros: ["Precise temperature control", "Long life"],
      oemCons: ["High cost"],
      alt1Pros: ["Reliable", "Good value"],
      alt1Cons: ["Minor tolerance difference"],
      alt2Pros: ["Very cheap"],
      alt2Cons: ["May fail quickly", "Engine overheating risk"],
      recommended: "alt1",
      urgency: "high", lifespan: "60,000 km",
      mechanicNote: "Thermostat kharab hai isliye engine garm ho raha hai. Subros ya Sigma ka lagao.",
      deliveryDays: { north: 2, south: 3, west: 2, east: 4, central: 3, ne: 7 },
    },
    {
      name: "Coolant (1 Litre)",
      oemBrand: "Havoline / Shell OEM", oemPrice: 650,
      alt1Brand: "Prestone / Castrol (Aftermarket)", alt1Price: 320,
      alt2Brand: "Plain water / local", alt2Price: 0,
      oemPros: ["Anti-corrosion additives", "2-year life"],
      oemCons: ["Expensive"],
      alt1Pros: ["Widely available", "Good protection"],
      alt1Cons: ["Change every year"],
      alt2Pros: ["Free (water)"],
      alt2Cons: ["Rusts engine block", "No anti-freeze", "Very dangerous"],
      recommended: "alt1",
      urgency: "high", lifespan: "1 year",
      mechanicNote: "Coolant khatam ho gaya hai. Prestone ka green coolant daalo, sirf paani mat daalna.",
      deliveryDays: { north: 1, south: 1, west: 1, east: 2, central: 2, ne: 4 },
    },
  ],
  safety: [
    {
      name: "Front Brake Pads (Set)",
      oemBrand: "Brembo / TVS Girling (OEM)", oemPrice: 3200,
      alt1Brand: "Minda / Rane (Aftermarket)", alt1Price: 980,
      alt2Brand: "Local unbranded", alt2Price: 280,
      oemPros: ["Best stopping power", "Low dust", "3 year warranty"],
      oemCons: ["Very expensive"],
      alt1Pros: ["Good braking", "BIS certified", "Value for money"],
      alt1Cons: ["Slightly more brake dust"],
      alt2Pros: ["Cheapest"],
      alt2Cons: ["DANGEROUS — may fail", "No braking guarantee"],
      recommended: "alt1",
      urgency: "critical", lifespan: "40,000 km",
      mechanicNote: "Mere brake pads ghis gaye hain. Minda ya Rane ke pads lagao. LOCAL WALE BILKUL MAT LAGANA — jaan ka khatre hai.",
      deliveryDays: { north: 1, south: 2, west: 1, east: 3, central: 2, ne: 5 },
    },
  ],
  fluid: [
    {
      name: "Engine Oil (1 Litre)",
      oemBrand: "Mobil 1 / Shell Helix (OEM)", oemPrice: 700,
      alt1Brand: "Castrol GTX / Gulf Pride (Aftermarket)", alt1Price: 320,
      alt2Brand: "Spurious / duplicate oil", alt2Price: 80,
      oemPros: ["Full synthetic", "Best engine protection", "5,000 km change interval"],
      oemCons: ["Expensive"],
      alt1Pros: ["Semi-synthetic", "Widely trusted", "Good protection"],
      alt1Cons: ["Change at 3,000–4,000 km"],
      alt2Pros: ["Cheap"],
      alt2Cons: ["Engine seizure risk", "Likely fake/adulterated"],
      recommended: "alt1",
      urgency: "high", lifespan: "4,000 km",
      mechanicNote: "Engine oil khatam/kharab ho gaya hai. Castrol GTX 10W-30 daalo, koi bhi local ya spurious oil mat daalna.",
      deliveryDays: { north: 1, south: 1, west: 1, east: 1, central: 1, ne: 3 },
    },
  ],
  electrical: [
    {
      name: "Car Battery (45Ah)",
      oemBrand: "Exide / Amaron (OEM)", oemPrice: 5500,
      alt1Brand: "SF Sonic / Luminous (Aftermarket)", alt1Price: 3800,
      alt2Brand: "Local refurbished", alt2Price: 1500,
      oemPros: ["5 year warranty", "Maintenance free", "Best cranking"],
      oemCons: ["High cost"],
      alt1Pros: ["3 year warranty", "Reliable", "Good value"],
      alt1Cons: ["Slightly lower reserve capacity"],
      alt2Pros: ["Very cheap"],
      alt2Cons: ["No warranty", "May fail anytime", "Risky in monsoon"],
      recommended: "alt1",
      urgency: "medium", lifespan: "3–5 years",
      mechanicNote: "Battery discharge ho gayi hai. SF Sonic ya Amaron lagao, refurbished wali bilkul mat lagana.",
      deliveryDays: { north: 1, south: 1, west: 1, east: 2, central: 2, ne: 5 },
    },
  ],
  suspension: [
    {
      name: "Shock Absorber (Front pair)",
      oemBrand: "Gabriel / OEM", oemPrice: 5800,
      alt1Brand: "Monroe / Endura (Aftermarket)", alt1Price: 2400,
      alt2Brand: "Local Chinese", alt2Price: 700,
      oemPros: ["Factory spec", "Long lasting", "Best ride quality"],
      oemCons: ["Expensive"],
      alt1Pros: ["Good quality", "Warranty included", "Wide availability"],
      alt1Cons: ["Slightly stiffer ride"],
      alt2Pros: ["Very cheap"],
      alt2Cons: ["May collapse within months", "Unsafe at high speed"],
      recommended: "alt1",
      urgency: "medium", lifespan: "80,000 km",
      mechanicNote: "Shock absorbers khatam ho gaye hain. Monroe ya Gabriel lagao. Chinese wale mat lagana — speed mein khatre mein pad sakte ho.",
      deliveryDays: { north: 2, south: 3, west: 2, east: 4, central: 3, ne: 7 },
    },
  ],
  performance: [
    {
      name: "Fuel Injector Cleaner",
      oemBrand: "BG Products / OEM flush", oemPrice: 1800,
      alt1Brand: "WD-40 Fuel System / STP (Aftermarket)", alt1Price: 450,
      alt2Brand: "Local additive", alt2Price: 120,
      oemPros: ["Complete system clean", "Dealership-grade"],
      oemCons: ["Only at service center"],
      alt1Pros: ["Easy DIY", "Good results", "Available everywhere"],
      alt1Cons: ["Takes 2–3 tanks to work fully"],
      alt2Pros: ["Cheap"],
      alt2Cons: ["Unverified formula", "May clog injectors"],
      recommended: "alt1",
      urgency: "medium", lifespan: "Every 10,000 km",
      mechanicNote: "Fuel injector ganda ho gaya hai. STP ya WD-40 ka fuel cleaner petrol mein daalo, phir service karo.",
      deliveryDays: { north: 1, south: 2, west: 1, east: 3, central: 2, ne: 5 },
    },
  ],
  transmission: [
    {
      name: "Gear Oil (ATF/Manual)",
      oemBrand: "Shell Spirax / Castrol TQ (OEM)", oemPrice: 850,
      alt1Brand: "Gulf Gear / Veedol (Aftermarket)", alt1Price: 380,
      alt2Brand: "Spurious gear oil", alt2Price: 100,
      oemPros: ["Correct viscosity", "Gearbox protection"],
      oemCons: ["Costly"],
      alt1Pros: ["Good protection", "Widely available"],
      alt1Cons: ["Change slightly earlier"],
      alt2Pros: ["Very cheap"],
      alt2Cons: ["Gearbox damage risk", "No quality guarantee"],
      recommended: "alt1",
      urgency: "high", lifespan: "40,000 km",
      mechanicNote: "Gear oil kharab/khatam ho gaya. Gulf Gear oil daalo, local ya spurious bilkul nahi.",
      deliveryDays: { north: 1, south: 2, west: 1, east: 3, central: 2, ne: 5 },
    },
  ],
  audio: [
    {
      name: "Engine Mount (Rubber)",
      oemBrand: "Anand / OEM", oemPrice: 2200,
      alt1Brand: "Brakes India / Minda (Aftermarket)", alt1Price: 750,
      alt2Brand: "Local rubber", alt2Price: 200,
      oemPros: ["Exact damping", "Long life", "Reduces noise best"],
      oemCons: ["Expensive", "Dealer only"],
      alt1Pros: ["Good damping", "Fits well", "Trusted brand"],
      alt1Cons: ["Slightly less damping than OEM"],
      alt2Pros: ["Cheap"],
      alt2Cons: ["Hardens fast", "Vibration returns quickly"],
      recommended: "alt1",
      urgency: "medium", lifespan: "60,000 km",
      mechanicNote: "Engine mount ghis gaya hai isliye vibration aa raha hai. Minda ya Brakes India ka lagao.",
      deliveryDays: { north: 2, south: 3, west: 2, east: 4, central: 3, ne: 7 },
    },
  ],
};

const urgencyColor = { critical: "#ff3b30", high: "#ff9500", medium: "#ffcc00", low: "#34c759" };
const urgencyBg = { critical: "#280a08", high: "#251800", medium: "#252000", low: "#0a1e0d" };
const urgencyLabel = { critical: "🚨 तुरंत ठीक करो / CRITICAL", high: "⚠️ जल्दी ठीक करो / URGENT", medium: "ℹ️ जल्द ठीक करो / SOON", low: "✅ नज़र रखो / MONITOR" };

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function UrMechanicApp() {
  const [screen, setScreen] = useState("home");
  const [vehicleType, setVehicleType] = useState(null);
  const [vehicleMake, setVehicleMake] = useState(null);
  const [region, setRegion] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState(0);
  const [diagnosis, setDiagnosis] = useState(null);
  const [activeTab, setActiveTab] = useState("diagnosis");
  const [expandedPart, setExpandedPart] = useState(null);
  const intervalRef = useRef(null);

  const scanSteps = [
    "AI से जुड़ रहे हैं... / Connecting AI...",
    "लक्षण विश्लेषण... / Analysing symptoms...",
    "भारतीय पार्ट्स DB खोज रहे हैं... / Searching India parts DB...",
    "खराबी की संभावना गिन रहे हैं... / Calculating faults...",
    "मैकेनिक रिपोर्ट बना रहे हैं... / Building mechanic report...",
  ];

  const toggle = (s) => setSelectedSymptoms(p => p.find(x => x.id === s.id) ? p.filter(x => x.id !== s.id) : [...p, s]);

  const startScan = async () => {
    setScreen("scanning");
    setScanProgress(0);
    setScanStep(0);

    const regionInfo = INDIA_REGIONS.find(r => r.id === region);
    const symptomList = selectedSymptoms.map(s => s.label).join(", ");

    const prompt = `You are UrMechanic AI — India's most trusted vehicle diagnostic expert. A ${vehicleType} owner from ${regionInfo?.label} (${regionInfo?.states}) with a ${vehicleMake} reports these problems: ${symptomList}.

Give a thorough diagnosis like a TOP Indian mechanic. Respond ONLY in valid JSON (no markdown):
{
  "mainIssue": "Main problem title in English + Hindi (e.g. 'Spark Plug Failure / स्पार्क प्लग खराब')",
  "severity": "Critical|High|Medium|Low",
  "fullExplanation": "3-4 sentences in simple English. Explain exactly what is wrong, why it happened, and what will break next if ignored.",
  "hindiExplanation": "Same explanation in simple Hindi/Hinglish that a common Indian person understands.",
  "estimatedMechanicCostINR": "₹X,XXX – ₹X,XXX (labour only)",
  "estimatedPartsCostINR": "₹X,XXX – ₹X,XXX",
  "totalSavingIfSelfSource": "₹X,XXX",
  "diyDifficulty": "Easy|Medium|Hard|Expert Only",
  "rootCause": "Why did this problem occur? In 1-2 sentences.",
  "immediateAction": "What should the owner do RIGHT NOW before going to mechanic?",
  "partsNeeded": ["Part 1", "Part 2", "Part 3"],
  "mechanicBriefEnglish": "Exact word-for-word script the customer should read to the mechanic. Very specific. Mention exact parts, brands, and what NOT to do.",
  "mechanicBriefHindi": "Same brief in Hindi/Hinglish. Customer ko yahi bolna hai mechanic ko.",
  "futureRisks": ["Risk 1 in English (Hindi)", "Risk 2 in English (Hindi)"],
  "certifiedMechanicNote": "What a UrMechanic Certified mechanic MUST do step by step to fix this issue correctly.",
  "preventionTip": "How to prevent this in future."
}`;

    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      setScanStep(Math.min(step, scanSteps.length - 1));
      setScanProgress(Math.min(step * 20, 90));
    }, 800);

    try {
      const apiKey = process.env.REACT_APP_ANTHROPIC_KEY;
      if (!apiKey) {
        throw new Error("API key missing");
      }
      const res = await fetch("https://corsproxy.io/?url=https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(i => i.text || "").join("") || "";
      clearInterval(intervalRef.current);
      setScanProgress(100);

      let parsed;
      try { parsed = JSON.parse(text.replace(/```json|```/g, "").trim()); }
      catch {
        parsed = {
          mainIssue: `Multiple Issues / एकाधिक खराबी (${vehicleMake})`,
          severity: "High",
          fullExplanation: `Your ${vehicleMake} is showing ${symptomList}. These symptoms indicate a serious issue that needs immediate attention.`,
          hindiExplanation: `Aapki ${vehicleMake} mein ${symptomList} wali samasya hai. Yeh gambhir masla hai, jaldi mechanic ke paas jaao.`,
          estimatedMechanicCostINR: "₹800 – ₹3,500",
          estimatedPartsCostINR: "₹500 – ₹4,000",
          totalSavingIfSelfSource: "₹1,500",
          diyDifficulty: "Medium",
          rootCause: "Multiple systems are stressed. Could be lack of maintenance.",
          immediateAction: "Do not drive at high speed. Check oil and coolant level first.",
          partsNeeded: selectedSymptoms.slice(0, 3).map(s => s.label),
          mechanicBriefEnglish: `My ${vehicleMake} has these problems: ${symptomList}. Please diagnose each issue and show me the original part before replacing.`,
          mechanicBriefHindi: `Mere ${vehicleMake} mein yeh samasya hai: ${symptomList}. Koi bhi part lagane se pehle mujhe dikhao aur original part hi lagao.`,
          futureRisks: ["Engine seizure if oil is not topped up", "Brake failure if brake pads are not changed"],
          certifiedMechanicNote: "Run a full OBD diagnostic scan. Check all fluid levels. Test brake pad thickness. Inspect belts and filters.",
          preventionTip: "Service your vehicle every 5,000 km. Check tyre pressure and oil weekly.",
        };
      }

      // attach parts
      const cats = [...new Set(selectedSymptoms.map(s => s.category))];
      const allParts = cats.flatMap(c => PARTS_DB[c] || []);
      setDiagnosis({ ...parsed, parts: allParts, categories: cats });
      setTimeout(() => { setScreen("results"); setActiveTab("diagnosis"); }, 500);
    } catch (err) {
      clearInterval(intervalRef.current);
      setScanProgress(100);
      const symptomList2 = selectedSymptoms.map(s => s.label).join(", ");
      const fallback = {
        mainIssue: `Issues Detected / समस्या मिली (${vehicleMake})`,
        severity: "High",
        fullExplanation: `Your ${vehicleMake} is showing: ${symptomList2}. These symptoms need attention. Show the parts list below to your mechanic.`,
        hindiExplanation: `Aapki ${vehicleMake} mein yeh samasya hai: ${symptomList2}. Mechanic ke paas jaao aur parts list dikhao.`,
        estimatedMechanicCostINR: "₹800 – ₹3,500",
        estimatedPartsCostINR: "₹500 – ₹4,000",
        totalSavingIfSelfSource: "₹1,500",
        diyDifficulty: "Medium",
        rootCause: "Multiple systems need inspection based on reported symptoms.",
        immediateAction: "Do not drive at high speed. Check oil and coolant level immediately.",
        partsNeeded: selectedSymptoms.slice(0, 3).map(s => s.label),
        mechanicBriefEnglish: `My ${vehicleMake} has: ${symptomList2}. Show me original part before replacing. Only branded parts please.`,
        mechanicBriefHindi: `Mere ${vehicleMake} mein: ${symptomList2}. Part lagane se pehle purana dikhao. Sirf branded part lagao.`,
        futureRisks: ["Engine damage if oil not checked", "Brake failure if brake symptoms ignored"],
        certifiedMechanicNote: "Run OBD scan. Check all fluids. Inspect brake pads. Test battery. Check belts and filters.",
        preventionTip: "Service every 5,000 km. Check tyre pressure and oil weekly.",
      };
      const cats2 = [...new Set(selectedSymptoms.map(s => s.category))];
      const allParts2 = cats2.flatMap(c => PARTS_DB[c] || []);
      setDiagnosis({ ...fallback, parts: allParts2, categories: cats2 });
      setTimeout(() => { setScreen("results"); setActiveTab("diagnosis"); }, 500);
    }
  };

  const regionInfo = INDIA_REGIONS.find(r => r.id === region);

  // ─── RENDER ──────────────────────────────────────────────────────────────────

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f0e8",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#1a1208",
    }}>
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fadeUp { animation: fadeUp 0.4s ease forwards; }
        .btn-primary { background: linear-gradient(135deg, #c8480a, #a33508); color: white; border: none; border-radius: 12px; padding: 16px; font-size: 14px; font-weight: 700; letter-spacing: 1px; cursor: pointer; width: 100%; }
        .btn-primary:active { transform: scale(0.98); }
        .card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); margin-bottom: 14px; }
        .tab { padding: 10px 18px; border: none; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 1px; cursor: pointer; }
        .tab-active { background: #c8480a; color: white; }
        .tab-inactive { background: #ede8e0; color: #8a7060; }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a0a00, #3a1800)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#ff8c42", letterSpacing: 1 }}>UR<span style={{ color: "#ffd60a" }}>MECHANIC</span></div>
          <div style={{ fontSize: 9, color: "#8a6a50", letterSpacing: 3 }}>YOUR PERSONAL VEHICLE DOCTOR</div>
        </div>
        <div style={{ flex: 1 }} />
        {region && <div style={{ background: "#ff8c4220", border: "1px solid #ff8c4240", borderRadius: 8, padding: "4px 10px", fontSize: 10, color: "#ff8c42" }}>📍 {regionInfo?.hub}</div>}
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 80px" }}>

        {/* ── HOME ── */}
        {screen === "home" && (
          <div className="fadeUp" style={{ paddingTop: 32 }}>
            {/* Hero */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 56, marginBottom: 8 }}>🔧</div>
              <h1 style={{ fontSize: 30, fontWeight: 900, margin: "0 0 8px", color: "#1a0a00" }}>
                Gaadi ki problem?<br />
                <span style={{ color: "#c8480a" }}>AI se poocho!</span>
              </h1>
              <p style={{ color: "#8a6a50", fontSize: 13, lineHeight: 1.7 }}>
                India's smartest vehicle diagnostic app.<br />
                Mechanic se pehle jaano — kya kharab hai aur kitna lagega.
              </p>
            </div>

            {/* Trust stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 28 }}>
              {[["₹3,400", "Avg Saved"], ["94%", "Accuracy"], ["50K+", "Diagnoses"]].map(([v, l]) => (
                <div key={l} className="card" style={{ textAlign: "center", padding: "16px 8px" }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#c8480a" }}>{v}</div>
                  <div style={{ fontSize: 9, color: "#8a7060", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Vehicle type */}
            <div style={{ marginBottom: 8, fontSize: 11, color: "#8a6a50", letterSpacing: 2, fontWeight: 700 }}>APNI GAADI CHUNIYE</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              {[{ t: "Car", i: "🚗", d: "Sedan, SUV, Hatchback, MUV" }, { t: "Bike", i: "🏍️", d: "Motorcycle, Scooter, Moped" }].map(v => (
                <button key={v.t} onClick={() => setVehicleType(v.t)}
                  style={{
                    background: vehicleType === v.t ? "#fff3ec" : "white",
                    border: `2px solid ${vehicleType === v.t ? "#c8480a" : "#e8e0d4"}`,
                    borderRadius: 16, padding: "20px 12px", cursor: "pointer", textAlign: "center",
                  }}>
                  <div style={{ fontSize: 36, marginBottom: 6 }}>{v.i}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#1a0a00" }}>{v.t}</div>
                  <div style={{ fontSize: 10, color: "#8a7060", marginTop: 2 }}>{v.d}</div>
                </button>
              ))}
            </div>

            {vehicleType && (
              <button className="btn-primary" onClick={() => setScreen("setup")}>
                आगे बढ़ें → CONTINUE
              </button>
            )}

            {/* How it works */}
            <div className="card" style={{ marginTop: 24, background: "#fff8f0" }}>
              <div style={{ fontSize: 11, color: "#c8480a", letterSpacing: 2, fontWeight: 700, marginBottom: 12 }}>यह कैसे काम करता है?</div>
              {[
                ["1", "अपना vehicle और region चुनो", "Select vehicle & region"],
                ["2", "Symptoms tap karo", "Select your symptoms"],
                ["3", "AI scan karo", "Get full AI diagnosis"],
                ["4", "Mechanic brief print karo", "Show mechanic exact fix needed"],
                ["5", "Parts price compare karo", "Buy cheapest verified parts"],
              ].map(([n, h, e]) => (
                <div key={n} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 24, height: 24, background: "#c8480a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "white", flexShrink: 0 }}>{n}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1a0a00" }}>{h}</div>
                    <div style={{ fontSize: 11, color: "#8a7060" }}>{e}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SETUP (make + region) ── */}
        {screen === "setup" && (
          <div className="fadeUp" style={{ paddingTop: 24 }}>
            <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: "#8a6a50", fontSize: 12, cursor: "pointer", marginBottom: 20, padding: 0 }}>← वापस / Back</button>

            <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 4px" }}>Vehicle Details</h2>
            <p style={{ color: "#8a6a50", fontSize: 12, marginBottom: 20 }}>Apni gaadi ki details bharein</p>

            {/* Make */}
            <div style={{ fontSize: 11, color: "#8a6a50", letterSpacing: 2, fontWeight: 700, marginBottom: 10 }}>BRAND / MAKE चुनें</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {(VEHICLE_MAKES[vehicleType] || []).map(m => (
                <button key={m} onClick={() => setVehicleMake(m)}
                  style={{
                    padding: "8px 14px", borderRadius: 20,
                    background: vehicleMake === m ? "#c8480a" : "white",
                    border: `1px solid ${vehicleMake === m ? "#c8480a" : "#e0d8cc"}`,
                    color: vehicleMake === m ? "white" : "#4a3020",
                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                  }}>{m}</button>
              ))}
            </div>

            {/* Region */}
            <div style={{ fontSize: 11, color: "#8a6a50", letterSpacing: 2, fontWeight: 700, marginBottom: 10 }}>📍 APNA REGION CHUNIYE</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
              {INDIA_REGIONS.map(r => (
                <button key={r.id} onClick={() => setRegion(r.id)}
                  style={{
                    background: region === r.id ? "#fff3ec" : "white",
                    border: `2px solid ${region === r.id ? "#c8480a" : "#e8e0d4"}`,
                    borderRadius: 12, padding: "14px 12px", cursor: "pointer", textAlign: "left",
                  }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#1a0a00" }}>{r.label}</div>
                  <div style={{ fontSize: 9, color: "#8a7060", marginTop: 3, lineHeight: 1.4 }}>{r.states}</div>
                  {region === r.id && <div style={{ fontSize: 10, color: "#c8480a", marginTop: 4, fontWeight: 700 }}>Hub: {r.hub} ✓</div>}
                </button>
              ))}
            </div>

            {vehicleMake && region && (
              <button className="btn-primary" onClick={() => setScreen("select")}>
                Symptoms Chuniye →
              </button>
            )}
          </div>
        )}

        {/* ── SYMPTOM SELECT ── */}
        {screen === "select" && (
          <div className="fadeUp" style={{ paddingTop: 24 }}>
            <button onClick={() => setScreen("setup")} style={{ background: "none", border: "none", color: "#8a6a50", fontSize: 12, cursor: "pointer", marginBottom: 20, padding: 0 }}>← वापस / Back</button>

            <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 4px" }}>Kya problem hai?</h2>
            <p style={{ color: "#8a6a50", fontSize: 12, marginBottom: 4 }}>Jo bhi problem ho sab select karo</p>
            <div style={{ fontSize: 10, color: "#c8480a", marginBottom: 20 }}>
              {vehicleType} · {vehicleMake} · {regionInfo?.label}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 100 }}>
              {SYMPTOMS.map(s => {
                const sel = selectedSymptoms.find(x => x.id === s.id);
                return (
                  <button key={s.id} onClick={() => toggle(s)}
                    style={{
                      background: sel ? "#fff3ec" : "white",
                      border: `2px solid ${sel ? "#c8480a" : "#e8e0d4"}`,
                      borderRadius: 14, padding: "14px 10px",
                      cursor: "pointer", textAlign: "left",
                    }}>
                    <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: sel ? "#c8480a" : "#1a0a00", lineHeight: 1.3 }}>{s.label}</div>
                    <div style={{ fontSize: 9, color: "#b09080", marginTop: 3, fontStyle: "italic" }}>{s.hindiHint}</div>
                  </button>
                );
              })}
            </div>

            {selectedSymptoms.length > 0 && (
              <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px", background: "linear-gradient(transparent, #f5f0e8 30%)", paddingBottom: 24 }}>
                <div style={{ maxWidth: 480, margin: "0 auto" }}>
                  <button className="btn-primary" onClick={startScan}>
                    🔍 {selectedSymptoms.length} SYMPTOMS SCAN KARO →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SCANNING ── */}
        {screen === "scanning" && (
          <div style={{ paddingTop: 80, textAlign: "center" }}>
            <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto 32px" }}>
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                border: "3px solid transparent", borderTopColor: "#c8480a",
                animation: "spin 1s linear infinite",
              }} />
              <div style={{
                position: "absolute", inset: 10, borderRadius: "50%",
                border: "2px solid transparent", borderTopColor: "#ffd60a",
                animation: "spin 1.5s linear infinite reverse",
              }} />
              <div style={{
                position: "absolute", inset: 0, display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 52,
              }}>{vehicleType === "Bike" ? "🏍️" : "🚗"}</div>
            </div>

            <div style={{ fontSize: 11, color: "#c8480a", letterSpacing: 3, marginBottom: 10, fontWeight: 700 }}>AI SCANNING...</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a0a00", marginBottom: 24, minHeight: 28 }}>
              {scanSteps[scanStep]}
            </div>

            <div style={{ background: "#e8e0d4", borderRadius: 6, height: 6, overflow: "hidden", marginBottom: 8 }}>
              <div style={{
                height: "100%", width: `${scanProgress}%`,
                background: "linear-gradient(90deg, #c8480a, #ffd60a)",
                transition: "width 0.7s ease",
              }} />
            </div>
            <div style={{ fontSize: 12, color: "#8a7060" }}>{scanProgress}% complete</div>

            <div className="card" style={{ marginTop: 40, textAlign: "left" }}>
              <div style={{ fontSize: 11, color: "#8a7060", marginBottom: 8 }}>Analysing your {vehicleMake}:</div>
              {selectedSymptoms.map(s => (
                <div key={s.id} style={{ display: "flex", gap: 8, marginBottom: 6, animation: "pulse 2s infinite" }}>
                  <span>{s.icon}</span>
                  <span style={{ fontSize: 12, color: "#1a0a00" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {screen === "results" && diagnosis && (
          <div className="fadeUp" style={{ paddingTop: 20 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {["diagnosis", "mechanic", "parts"].map(t => (
                <button key={t} className={`tab ${activeTab === t ? "tab-active" : "tab-inactive"}`}
                  onClick={() => setActiveTab(t)}>
                  {t === "diagnosis" ? "🔍 Diagnosis" : t === "mechanic" ? "🔧 Mechanic Brief" : "🛒 Parts & Price"}
                </button>
              ))}
            </div>

            {/* DIAGNOSIS TAB */}
            {activeTab === "diagnosis" && (
              <div>
                {/* Severity card */}
                <div style={{
                  background: urgencyBg[diagnosis.severity?.toLowerCase()],
                  border: `2px solid ${urgencyColor[diagnosis.severity?.toLowerCase()]}`,
                  borderRadius: 16, padding: 18, marginBottom: 14,
                }}>
                  <div style={{ fontSize: 10, color: urgencyColor[diagnosis.severity?.toLowerCase()], letterSpacing: 3, fontWeight: 700, marginBottom: 6 }}>
                    {urgencyLabel[diagnosis.severity?.toLowerCase()]}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "white", lineHeight: 1.3 }}>{diagnosis.mainIssue}</div>
                </div>

                {/* Cost comparison */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  <div className="card" style={{ padding: 14 }}>
                    <div style={{ fontSize: 9, color: "#8a7060", letterSpacing: 1, marginBottom: 4 }}>MECHANIC QUOTE</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#c8480a" }}>{diagnosis.estimatedMechanicCostINR}</div>
                    <div style={{ fontSize: 9, color: "#a07060" }}>Labour only</div>
                  </div>
                  <div className="card" style={{ padding: 14, background: "#fff8f0" }}>
                    <div style={{ fontSize: 9, color: "#8a7060", letterSpacing: 1, marginBottom: 4 }}>PARTS COST</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#1a8a3a" }}>{diagnosis.estimatedPartsCostINR}</div>
                    <div style={{ fontSize: 9, color: "#3a8a5a" }}>If you source yourself</div>
                  </div>
                </div>

                <div className="card" style={{ background: "#fff8ec", border: "1px solid #ffd60a40" }}>
                  <div style={{ fontSize: 10, color: "#c8480a", letterSpacing: 2, fontWeight: 700, marginBottom: 6 }}>💰 AAPKI POTENTIAL BACHAT</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#c8480a" }}>{diagnosis.totalSavingIfSelfSource}</div>
                  <div style={{ fontSize: 11, color: "#8a7060" }}>by buying parts yourself vs mechanic supply</div>
                </div>

                {/* English explanation */}
                <div className="card">
                  <div style={{ fontSize: 10, color: "#8a7060", letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>🔍 AI DIAGNOSIS</div>
                  <p style={{ fontSize: 13, lineHeight: 1.8, color: "#2a1a0a", margin: "0 0 12px" }}>{diagnosis.fullExplanation}</p>
                  <div style={{ borderTop: "1px dashed #e0d0c0", paddingTop: 12 }}>
                    <div style={{ fontSize: 10, color: "#c8480a", letterSpacing: 1, fontWeight: 700, marginBottom: 6 }}>हिंदी में / In Hindi:</div>
                    <p style={{ fontSize: 13, lineHeight: 1.8, color: "#4a2a1a", margin: 0, fontStyle: "italic" }}>{diagnosis.hindiExplanation}</p>
                  </div>
                </div>

                {/* Root cause */}
                {diagnosis.rootCause && (
                  <div className="card" style={{ background: "#f0f8ff" }}>
                    <div style={{ fontSize: 10, color: "#0a5a8a", letterSpacing: 2, fontWeight: 700, marginBottom: 6 }}>🧠 ROOT CAUSE</div>
                    <p style={{ fontSize: 13, color: "#0a2a4a", margin: 0, lineHeight: 1.7 }}>{diagnosis.rootCause}</p>
                  </div>
                )}

                {/* Immediate action */}
                {diagnosis.immediateAction && (
                  <div className="card" style={{ background: "#fff0f0", border: "1px solid #ff3b3040" }}>
                    <div style={{ fontSize: 10, color: "#c8000a", letterSpacing: 2, fontWeight: 700, marginBottom: 6 }}>⚡ ABHI KYA KARO / IMMEDIATE ACTION</div>
                    <p style={{ fontSize: 13, color: "#2a0000", margin: 0, lineHeight: 1.7, fontWeight: 700 }}>{diagnosis.immediateAction}</p>
                  </div>
                )}

                {/* Future risks */}
                {diagnosis.futureRisks?.length > 0 && (
                  <div className="card" style={{ background: "#1a0a00" }}>
                    <div style={{ fontSize: 10, color: "#ff6a30", letterSpacing: 2, fontWeight: 700, marginBottom: 10 }}>⚠️ IGNORE KIYA TO KYA HOGA</div>
                    {diagnosis.futureRisks.map((r, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        <span style={{ color: "#ff3b30" }}>▸</span>
                        <span style={{ fontSize: 12, color: "#d09080", lineHeight: 1.5 }}>{r}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Prevention */}
                {diagnosis.preventionTip && (
                  <div className="card" style={{ background: "#f0fff4" }}>
                    <div style={{ fontSize: 10, color: "#1a8a3a", letterSpacing: 2, fontWeight: 700, marginBottom: 6 }}>🛡️ BHAVISHYA MEIN BACHNE KA TARIKA</div>
                    <p style={{ fontSize: 12, color: "#0a3a1a", margin: 0, lineHeight: 1.7 }}>{diagnosis.preventionTip}</p>
                  </div>
                )}

                <button className="btn-primary" onClick={() => setActiveTab("mechanic")}>
                  🔧 Mechanic Brief Dekho →
                </button>
              </div>
            )}

            {/* MECHANIC BRIEF TAB */}
            {activeTab === "mechanic" && (
              <div>
                <div className="card" style={{ background: "#1a0a00", marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: "#ffd60a", letterSpacing: 3, fontWeight: 700, marginBottom: 8 }}>📋 MECHANIC KO YEH BOLNA HAI — ENGLISH</div>
                  <p style={{ fontSize: 13, color: "#f0d8c0", lineHeight: 1.8, margin: 0, borderLeft: "3px solid #ffd60a", paddingLeft: 12 }}>
                    {diagnosis.mechanicBriefEnglish}
                  </p>
                </div>

                <div className="card" style={{ background: "#0a1a00", marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: "#4ade80", letterSpacing: 3, fontWeight: 700, marginBottom: 8 }}>📋 MECHANIC KO YEH BOLNA HAI — HINDI</div>
                  <p style={{ fontSize: 13, color: "#c0e8c0", lineHeight: 1.8, margin: 0, borderLeft: "3px solid #4ade80", paddingLeft: 12 }}>
                    {diagnosis.mechanicBriefHindi}
                  </p>
                </div>

                {/* Certified mechanic note */}
                {diagnosis.certifiedMechanicNote && (
                  <div className="card" style={{ background: "#fff8f0", border: "2px solid #c8480a" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: 20 }}>🏅</span>
                      <div>
                        <div style={{ fontSize: 11, color: "#c8480a", fontWeight: 900, letterSpacing: 1 }}>URMECHANIC CERTIFIED MECHANIC PROTOCOL</div>
                        <div style={{ fontSize: 9, color: "#8a6050" }}>Only for verified mechanics</div>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: "#2a1008", lineHeight: 1.8, margin: 0 }}>{diagnosis.certifiedMechanicNote}</p>
                  </div>
                )}

                {/* Parts needed */}
                <div className="card">
                  <div style={{ fontSize: 10, color: "#8a7060", letterSpacing: 2, fontWeight: 700, marginBottom: 10 }}>🔩 PARTS NEEDED</div>
                  {(diagnosis.partsNeeded || []).map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
                      <div style={{ width: 20, height: 20, background: "#c8480a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "white", flexShrink: 0 }}>{i + 1}</div>
                      <span style={{ fontSize: 13, color: "#1a0a00" }}>{p}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: "#fff3ec", border: "1px dashed #c8480a", borderRadius: 12, padding: 16, marginBottom: 14, fontSize: 12, color: "#8a4020", lineHeight: 1.7 }}>
                  💡 <strong>Tip:</strong> Is brief ka screenshot lo aur mechanic ko dikhao. UrMechanic Certified mechanic se ye kaam karwao — woh sirf yahi parts lagayega jo app ne kaha hai.
                </div>

                <button className="btn-primary" onClick={() => setActiveTab("parts")}>
                  🛒 Parts Prices Dekho →
                </button>
              </div>
            )}

            {/* PARTS TAB */}
            {activeTab === "parts" && (
              <div>
                <div style={{ fontSize: 11, color: "#8a7060", marginBottom: 16, lineHeight: 1.7 }}>
                  📍 Delivery to <strong>{regionInfo?.label}</strong> (Hub: {regionInfo?.hub})
                </div>

                {(diagnosis.parts || []).map((part, i) => (
                  <div key={i} className="card" style={{ cursor: "pointer" }} onClick={() => setExpandedPart(expandedPart === i ? null : i)}>
                    {/* Part header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: "inline-block",
                          background: urgencyBg[part.urgency],
                          border: `1px solid ${urgencyColor[part.urgency]}`,
                          borderRadius: 6, padding: "2px 8px",
                          fontSize: 9, color: urgencyColor[part.urgency],
                          letterSpacing: 1, fontWeight: 700, marginBottom: 6,
                        }}>{part.urgency?.toUpperCase()}</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#1a0a00" }}>{part.name}</div>
                        <div style={{ fontSize: 10, color: "#8a7060", marginTop: 2 }}>Life: {part.lifespan} · Delivery: {part.deliveryDays?.[region] || 3}–{(part.deliveryDays?.[region] || 3) + 1} days</div>
                      </div>
                      <div style={{ fontSize: 14, color: "#c8480a" }}>{expandedPart === i ? "▲" : "▼"}</div>
                    </div>

                    {/* Price row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
                      {[
                        { label: "OEM", price: part.oemPrice, brand: part.oemBrand, color: "#1a4a8a", bg: "#f0f4ff" },
                        { label: "⭐ BEST", price: part.alt1Price, brand: part.alt1Brand, color: "#1a7a3a", bg: "#f0fff4", highlight: true },
                        { label: "USED", price: part.alt2Price, brand: part.alt2Brand, color: "#8a7060", bg: "#faf8f5" },
                      ].map(opt => (
                        <div key={opt.label} style={{
                          background: opt.highlight ? "#e8fff0" : opt.bg,
                          border: opt.highlight ? "2px solid #1a7a3a" : "1px solid #e0d8cc",
                          borderRadius: 10, padding: "10px 6px", textAlign: "center",
                        }}>
                          <div style={{ fontSize: 8, color: opt.color, fontWeight: 900, letterSpacing: 1, marginBottom: 3 }}>{opt.label}</div>
                          <div style={{ fontSize: 16, fontWeight: 900, color: opt.color }}>₹{opt.price}</div>
                          <div style={{ fontSize: 8, color: "#a09080", marginTop: 2, lineHeight: 1.3 }}>{opt.brand?.split(" / ")[0]}</div>
                          <button style={{
                            marginTop: 6, width: "100%", padding: "4px 0",
                            background: opt.highlight ? "#1a7a3a" : "#e8e0d4",
                            border: "none", borderRadius: 6,
                            color: opt.highlight ? "white" : "#6a5040",
                            fontSize: 8, fontWeight: 700, cursor: "pointer", letterSpacing: 1,
                          }}>
                            {opt.highlight ? "BUY ✓" : "VIEW"}
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Savings badge */}
                    <div style={{ marginTop: 10, fontSize: 11, color: "#1a7a3a", fontWeight: 700 }}>
                      💰 OEM se ₹{part.oemPrice - part.alt1Price} bachao · {Math.round((1 - part.alt1Price / part.oemPrice) * 100)}% savings
                    </div>

                    {/* Expanded: pros/cons + mechanic note */}
                    {expandedPart === i && (
                      <div style={{ marginTop: 16, borderTop: "1px dashed #e0d0c0", paddingTop: 16 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                          <div>
                            <div style={{ fontSize: 10, color: "#1a7a3a", fontWeight: 700, marginBottom: 6 }}>✅ {part.alt1Brand?.split(" / ")[0]} PROS</div>
                            {(part.alt1Pros || []).map((p, j) => <div key={j} style={{ fontSize: 11, color: "#2a4a2a", marginBottom: 3 }}>✓ {p}</div>)}
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: "#c8480a", fontWeight: 700, marginBottom: 6 }}>❌ CONS</div>
                            {(part.alt1Cons || []).map((c, j) => <div key={j} style={{ fontSize: 11, color: "#4a2a1a", marginBottom: 3 }}>✗ {c}</div>)}
                          </div>
                        </div>

                        <div style={{ background: "#fff8f0", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                          <div style={{ fontSize: 9, color: "#c8480a", fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>⚠️ LOCAL / UNBRANDED SE BACHEIN</div>
                          {(part.alt2Cons || []).map((c, j) => <div key={j} style={{ fontSize: 11, color: "#8a3020", marginBottom: 3 }}>✗ {c}</div>)}
                        </div>

                        <div style={{ background: "#1a0a00", borderRadius: 10, padding: 12 }}>
                          <div style={{ fontSize: 9, color: "#ffd60a", fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>💬 MECHANIC KO EXACTLY BOLEIN</div>
                          <p style={{ fontSize: 11, color: "#d0b090", margin: 0, lineHeight: 1.7, fontStyle: "italic" }}>"{part.mechanicNote}"</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Total savings */}
                <div style={{
                  background: "linear-gradient(135deg, #1a0a00, #3a1800)",
                  borderRadius: 16, padding: 20, marginTop: 8, textAlign: "center",
                }}>
                  <div style={{ fontSize: 11, color: "#ffd60a", letterSpacing: 3, fontWeight: 700, marginBottom: 8 }}>💰 AAPKI TOTAL BACHAT</div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "#ffd60a" }}>
                    ₹{(diagnosis.parts || []).reduce((a, p) => a + (p.oemPrice - p.alt1Price), 0).toLocaleString("en-IN")}
                  </div>
                  <div style={{ fontSize: 11, color: "#8a6a50", marginTop: 4 }}>OEM vs best aftermarket option</div>
                </div>

                <div className="card" style={{ marginTop: 14, textAlign: "center", background: "#fff8f0", border: "2px solid #c8480a" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>🏅</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#c8480a" }}>UrMechanic Certified Mechanic Chahiye?</div>
                  <div style={{ fontSize: 11, color: "#8a6050", margin: "6px 0 14px", lineHeight: 1.6 }}>
                    {regionInfo?.label} mein verified mechanics dhundho jo sirf app ke diagnosis ke hisaab se kaam karein.
                  </div>
                  <button style={{
                    background: "#c8480a", color: "white", border: "none",
                    borderRadius: 10, padding: "12px 24px",
                    fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: 1,
                  }}>
                    🔍 CERTIFIED MECHANIC DHUNDHO
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
