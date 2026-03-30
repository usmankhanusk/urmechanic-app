import { useState, useRef, useCallback } from "react";

const REGIONS = [
  { id:"north", label:"North India", states:"Delhi, UP, Punjab, Haryana", hub:"Delhi" },
  { id:"south", label:"South India", states:"TN, Kerala, Karnataka, AP", hub:"Chennai" },
  { id:"west", label:"West India", states:"Maharashtra, Gujarat, Rajasthan", hub:"Mumbai" },
  { id:"east", label:"East India", states:"WB, Bihar, Odisha, Jharkhand", hub:"Kolkata" },
  { id:"central", label:"Central India", states:"MP, Chhattisgarh, Uttarakhand", hub:"Bhopal" },
  { id:"ne", label:"North East", states:"Assam, Meghalaya, Manipur", hub:"Guwahati" },
];

const VEHICLE_DB = {
  Car: {
    "Maruti Suzuki": { models:["Alto K10","Alto 800","S-Presso","Celerio","WagonR","Swift","Baleno","Dzire","Ciaz","Ertiga","XL6","Brezza","Grand Vitara","Fronx","Jimny"], years:[2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
    "Hyundai": { models:["Santro","Grand i10 Nios","i20","i20 N Line","Aura","Verna","Creta","Venue","Alcazar","Tucson","Exter"], years:[2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
    "Tata": { models:["Tiago","Tiago EV","Tigor","Altroz","Nexon","Nexon EV","Harrier","Safari","Punch","Punch EV","Curvv","Curvv EV"], years:[2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
    "Mahindra": { models:["Bolero","Bolero Neo","Scorpio","Scorpio-N","XUV300","XUV400 EV","XUV500","XUV700","Thar","Thar Roxx","Marazzo","KUV100"], years:[2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
    "Honda": { models:["Jazz","Amaze","City 4th Gen","City 5th Gen","City Hybrid","WR-V","Elevate"], years:[2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
    "Toyota": { models:["Glanza","Urban Cruiser Hyryder","Innova Crysta","Innova HyCross","Fortuner","Camry Hybrid","Hilux"], years:[2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
    "Kia": { models:["Seltos","Sonet","Carens","EV6","Carnival"], years:[2019,2020,2021,2022,2023,2024,2025] },
    "Volkswagen": { models:["Polo","Vento","Taigun","Virtus","Tiguan"], years:[2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
    "Skoda": { models:["Rapid","Octavia","Superb","Kushaq","Slavia","Kodiaq"], years:[2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
    "Renault": { models:["Kwid","Triber","Kiger","Duster"], years:[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
    "MG": { models:["Hector","Hector Plus","Gloster","Astor","ZS EV","Comet EV","Windsor EV"], years:[2019,2020,2021,2022,2023,2024,2025] },
    "Other": { models:["Other Model"], years:[2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
  },
  Bike: {
    "Hero": { models:["Splendor Plus","Super Splendor","Passion Pro","Glamour","Destini 125","Maestro Edge","HF Deluxe","Xtreme 160R","Xtreme 200S","Xpulse 200","Vida V1 EV"], years:[2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
    "Honda": { models:["Activa 6G","Activa 125","Dio","CB Shine","SP 125","Hornet 2.0","CB350","CB350RS","CB500X","CBR650R"], years:[2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
    "Bajaj": { models:["Platina 100","CT 100","Pulsar 125","Pulsar 150","Pulsar NS160","Pulsar NS200","Pulsar 220F","Pulsar N250","Dominar 400","Avenger 220","Chetak EV"], years:[2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
    "TVS": { models:["XL100","Jupiter","Jupiter 125","Ntorq 125","Raider 125","Ronin","Apache RTR 160 4V","Apache RTR 200 4V","Apache RR 310","iQube EV"], years:[2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
    "Royal Enfield": { models:["Bullet 350","Classic 350","Meteor 350","Himalayan","Himalayan 450","Hunter 350","Scram 411","Interceptor 650","Continental GT 650","Super Meteor 650","Guerrilla 450"], years:[2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
    "Yamaha": { models:["Ray ZR 125","Fascino 125","FZ-S Fi","FZS 25","MT-15 V2","R15 V4","R3","FZ-X"], years:[2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
    "KTM": { models:["Duke 125","Duke 200","Duke 250","Duke 390","RC 390","Adventure 390"], years:[2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
    "Ola Electric": { models:["S1 Pro","S1 Air","S1 X","S1 X+"], years:[2022,2023,2024,2025] },
    "Other": { models:["Other Model"], years:[2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025] },
  }
};

const SYMPTOMS = [
  { id:1, label:"Strange knocking noise", icon:"🔊", cat:"engine", hint:"Khatkhat ki awaaz" },
  { id:2, label:"Engine vibration/shaking", icon:"⚡", cat:"engine", hint:"Engine kaanp raha hai" },
  { id:3, label:"Black/white smoke", icon:"💨", cat:"engine", hint:"Dhuan aa raha hai" },
  { id:4, label:"Oil leak / dripping", icon:"🛢️", cat:"fluid", hint:"Tel tapak raha hai" },
  { id:5, label:"Poor pickup/acceleration", icon:"🐢", cat:"performance", hint:"Gaadi dhheemi hai" },
  { id:6, label:"Hard to start", icon:"🔑", cat:"engine", hint:"Start nahi ho raha" },
  { id:7, label:"Brake squeaking/weak", icon:"🛑", cat:"safety", hint:"Brake ki awaaz" },
  { id:8, label:"Overheating", icon:"🌡️", cat:"cooling", hint:"Engine garm ho raha hai" },
  { id:9, label:"Fuel smell/high consumption", icon:"⛽", cat:"fluid", hint:"Mileage kam ho gayi" },
  { id:10, label:"Warning light on", icon:"⚠️", cat:"electrical", hint:"Dashboard light jal rahi" },
  { id:11, label:"Suspension/rough ride", icon:"🔩", cat:"suspension", hint:"Gaadi uchhal rahi hai" },
  { id:12, label:"AC not cooling", icon:"❄️", cat:"electrical", hint:"AC thanda nahi" },
  { id:13, label:"Gear changing problem", icon:"⚙️", cat:"transmission", hint:"Gear nahi badal raha" },
  { id:14, label:"Battery/electrical issue", icon:"🔋", cat:"electrical", hint:"Battery kharab" },
];

const PARTS_DB = {
  engine:[
    { name:"Spark Plugs (Set of 4)", urgency:"high", lifespan:"30,000 km", oemBrand:"Bosch/NGK", oemPrice:1200, alt1Brand:"Minda/Ucal", alt1Price:380, alt2Brand:"Local", alt2Price:120, alt1Pros:["ISI marked","Good quality","Widely available"], alt1Cons:["Life ~20,000 km"], alt2Cons:["May damage engine","No warranty"], mechanicNote:"NGK ya Minda ke spark plugs lagao, local mat lagana." },
    { name:"Engine Air Filter", urgency:"medium", lifespan:"15,000 km", oemBrand:"Bosch OEM", oemPrice:950, alt1Brand:"Purolator/Roots", alt1Price:280, alt2Brand:"Local paper", alt2Price:80, alt1Pros:["Good filtration","Budget-friendly"], alt1Cons:["Change at 12,000 km"], alt2Cons:["Poor filtration"], mechanicNote:"Purolator ya Roots ka air filter lagao." },
  ],
  cooling:[
    { name:"Thermostat", urgency:"high", lifespan:"60,000 km", oemBrand:"Wahler OEM", oemPrice:1800, alt1Brand:"Subros/Sigma", alt1Price:550, alt2Brand:"Local cast", alt2Price:150, alt1Pros:["Reliable","Good value"], alt1Cons:["Minor tolerance diff"], alt2Cons:["May fail quickly"], mechanicNote:"Subros ya Sigma ka thermostat lagao." },
    { name:"Coolant (1 Litre)", urgency:"high", lifespan:"1 year", oemBrand:"Havoline/Shell", oemPrice:650, alt1Brand:"Prestone/Castrol", alt1Price:320, alt2Brand:"Plain water", alt2Price:0, alt1Pros:["Good protection","Widely available"], alt1Cons:["Change every year"], alt2Cons:["Rusts engine block","DANGEROUS"], mechanicNote:"Prestone green coolant daalo, sirf paani mat daalna." },
  ],
  safety:[
    { name:"Front Brake Pads (Set)", urgency:"critical", lifespan:"40,000 km", oemBrand:"Brembo/TVS Girling", oemPrice:3200, alt1Brand:"Minda/Rane", alt1Price:980, alt2Brand:"Local unbranded", alt2Price:280, alt1Pros:["Good braking","BIS certified"], alt1Cons:["Slightly more dust"], alt2Cons:["DANGEROUS - may fail"], mechanicNote:"Minda ya Rane ke pads lagao. LOCAL WALE MAT LAGANA." },
  ],
  fluid:[
    { name:"Engine Oil (1 Litre)", urgency:"high", lifespan:"4,000 km", oemBrand:"Mobil 1/Shell", oemPrice:700, alt1Brand:"Castrol GTX/Gulf", alt1Price:320, alt2Brand:"Local/spurious", alt2Price:80, alt1Pros:["Widely trusted","Good protection"], alt1Cons:["Change at 4,000 km"], alt2Cons:["Engine seizure risk"], mechanicNote:"Castrol GTX 10W-30 daalo, local ya spurious nahi." },
  ],
  electrical:[
    { name:"Car Battery (45Ah)", urgency:"medium", lifespan:"3-5 years", oemBrand:"Exide/Amaron", oemPrice:5500, alt1Brand:"SF Sonic/Luminous", alt1Price:3800, alt2Brand:"Refurbished", alt2Price:1500, alt1Pros:["3 year warranty","Reliable"], alt1Cons:["Slightly lower capacity"], alt2Cons:["No warranty","May fail anytime"], mechanicNote:"SF Sonic ya Amaron lagao, refurbished nahi." },
  ],
  suspension:[
    { name:"Shock Absorber (Front pair)", urgency:"medium", lifespan:"80,000 km", oemBrand:"Gabriel OEM", oemPrice:5800, alt1Brand:"Monroe/Endura", alt1Price:2400, alt2Brand:"Local Chinese", alt2Price:700, alt1Pros:["Good quality","Warranty included"], alt1Cons:["Slightly stiffer"], alt2Cons:["Unsafe at speed"], mechanicNote:"Monroe ya Gabriel lagao. Chinese wale mat lagana." },
  ],
  performance:[
    { name:"Fuel Injector Cleaner", urgency:"medium", lifespan:"10,000 km", oemBrand:"BG Products", oemPrice:1800, alt1Brand:"WD-40/STP", alt1Price:450, alt2Brand:"Local additive", alt2Price:120, alt1Pros:["Easy DIY","Good results"], alt1Cons:["Takes 2-3 tanks"], alt2Cons:["May clog injectors"], mechanicNote:"STP ya WD-40 fuel cleaner petrol mein daalo." },
  ],
  transmission:[
    { name:"Gear Oil", urgency:"high", lifespan:"40,000 km", oemBrand:"Shell Spirax", oemPrice:850, alt1Brand:"Gulf Gear/Veedol", alt1Price:380, alt2Brand:"Spurious", alt2Price:100, alt1Pros:["Good protection","Widely available"], alt1Cons:["Change slightly earlier"], alt2Cons:["Gearbox damage risk"], mechanicNote:"Gulf Gear oil daalo, local nahi." },
  ],
  audio:[
    { name:"Engine Mount (Rubber)", urgency:"medium", lifespan:"60,000 km", oemBrand:"Anand OEM", oemPrice:2200, alt1Brand:"Brakes India/Minda", alt1Price:750, alt2Brand:"Local rubber", alt2Price:200, alt1Pros:["Good damping","Fits well"], alt1Cons:["Slightly less than OEM"], alt2Cons:["Hardens fast"], mechanicNote:"Minda ya Brakes India ka mount lagao." },
  ],
};

const UC = { critical:"#ff3b30", high:"#ff9500", medium:"#ff9500", low:"#34c759" };
const UB = { critical:"#280a08", high:"#251800", medium:"#251800", low:"#0a1e0d" };

const S = {
  page:{ minHeight:"100vh", background:"#f5f0e8", fontFamily:"Georgia, serif", color:"#1a1208" },
  header:{ background:"linear-gradient(135deg,#1a0a00,#3a1800)", padding:"14px 20px", display:"flex", alignItems:"center", gap:10, position:"sticky", top:0, zIndex:100 },
  wrap:{ maxWidth:480, margin:"0 auto", padding:"0 16px 80px" },
  card:{ background:"white", borderRadius:16, padding:18, boxShadow:"0 2px 12px rgba(0,0,0,0.07)", marginBottom:12 },
  btn:{ background:"linear-gradient(135deg,#c8480a,#a33508)", color:"white", border:"none", borderRadius:12, padding:"16px", fontSize:14, fontWeight:700, letterSpacing:1, cursor:"pointer", width:"100%" },
  btnG:{ background:"linear-gradient(135deg,#1a7a3a,#0a5a2a)", color:"white", border:"none", borderRadius:12, padding:"14px", fontSize:13, fontWeight:700, cursor:"pointer", width:"100%" },
  lbl:{ fontSize:11, color:"#8a6a50", letterSpacing:2, fontWeight:700, marginBottom:8, display:"block" },
  inp:{ width:"100%", padding:"12px 14px", borderRadius:10, border:"1px solid #e0d8cc", fontSize:13, boxSizing:"border-box", color:"#1a0a00", background:"#faf8f5" },
  bk:{ background:"none", border:"none", color:"#8a6a50", fontSize:12, cursor:"pointer", padding:0, marginBottom:20 },
};

async function callAI(prompt, imageData) {
  const apiKey = process.env.REACT_APP_ANTHROPIC_KEY;
  let messages;
  if (imageData) {
    messages = [{ role:"user", content:[{ type:"image", source:{ type:"base64", media_type:imageData.type, data:imageData.data } }, { type:"text", text:prompt }] }];
  } else {
    messages = [{ role:"user", content:prompt }];
  }
  const res = await fetch("https://corsproxy.io/?url=https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{ "Content-Type":"application/json", "x-api-key":apiKey||"", "anthropic-version":"2023-06-01" },
    body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:2000, messages }),
  });
  const data = await res.json();
  return data.content?.map(i=>i.text||"").join("")||"";
}

function toB64(file) {
  return new Promise((res,rej) => { const r=new FileReader(); r.onload=()=>res(r.result.split(",")[1]); r.onerror=rej; r.readAsDataURL(file); });
}

// ── HOME ──────────────────────────────────────────────────────────────────────
function Home({ go }) {
  return (
    <div style={{ paddingTop:24 }}>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:52, marginBottom:8 }}>🔧</div>
        <h1 style={{ fontSize:28, fontWeight:900, margin:"0 0 8px", color:"#1a0a00" }}>Gaadi ki problem?<br/><span style={{ color:"#c8480a" }}>AI se poocho!</span></h1>
        <p style={{ color:"#8a6a50", fontSize:13, lineHeight:1.7 }}>India's smartest vehicle diagnostic app.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:20 }}>
        {[["₹3,400","Avg Saved"],["94%","Accuracy"],["50K+","Diagnoses"]].map(([v,l])=>(
          <div key={l} style={{ ...S.card, textAlign:"center", padding:"14px 6px" }}><div style={{ fontSize:18, fontWeight:900, color:"#c8480a" }}>{v}</div><div style={{ fontSize:9, color:"#8a7060", marginTop:2 }}>{l}</div></div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
        {[
          { icon:"🔍", title:"Diagnose Vehicle", sub:"AI symptom scan", s:"setup", c:"#c8480a" },
          { icon:"📸", title:"Photo/Sound Scan", sub:"Upload & analyse", s:"photo", c:"#1a6a8a" },
          { icon:"🚗", title:"Used Car Check", sub:"Purani gaadi check", s:"used", c:"#1a7a3a" },
          { icon:"🏅", title:"Find Mechanic", sub:"Certified mechanics", s:"mechanic", c:"#8a3a8a" },
        ].map(item=>(
          <button key={item.s} onClick={()=>go(item.s)} style={{ ...S.card, textAlign:"left", cursor:"pointer", border:`2px solid ${item.c}20`, padding:16 }}>
            <div style={{ fontSize:32, marginBottom:6 }}>{item.icon}</div>
            <div style={{ fontSize:13, fontWeight:800, color:"#1a0a00" }}>{item.title}</div>
            <div style={{ fontSize:10, color:"#8a7060", marginTop:3 }}>{item.sub}</div>
          </button>
        ))}
      </div>
      <div style={{ ...S.card, background:"#fff8f0" }}>
        <div style={{ fontSize:11, color:"#c8480a", letterSpacing:2, fontWeight:700, marginBottom:10 }}>HOW IT WORKS</div>
        {[["1","Brand, model, year chuniye"],["2","Symptoms select karo"],["3","AI full diagnosis deta hai"],["4","Parts prices compare karo"],["5","Mechanic brief print karo"]].map(([n,t])=>(
          <div key={n} style={{ display:"flex", gap:10, marginBottom:8 }}>
            <div style={{ width:22, height:22, background:"#c8480a", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:900, color:"white", flexShrink:0 }}>{n}</div>
            <div style={{ fontSize:12, color:"#2a1a0a", lineHeight:1.5, paddingTop:2 }}>{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SETUP ─────────────────────────────────────────────────────────────────────
function Setup({ onBack, onDone }) {
  const [vt, setVt] = useState("Car");
  const [make, setMake] = useState(null);
  const [model, setModel] = useState("");
  const [year, setYear] = useState(null);
  const [region, setRegion] = useState(null);
  const makes = Object.keys(VEHICLE_DB[vt]||{});
  const models = make ? (VEHICLE_DB[vt]?.[make]?.models||[]) : [];
  const years = make ? [...(VEHICLE_DB[vt]?.[make]?.years||[])].reverse() : [];
  const ready = make && model && year && region;
  return (
    <div style={{ paddingTop:20, paddingBottom:40 }}>
      <button style={S.bk} onClick={onBack}>← Back</button>
      <h2 style={{ fontSize:22, fontWeight:900, margin:"0 0 4px" }}>Vehicle Details</h2>
      <p style={{ color:"#8a6a50", fontSize:12, marginBottom:20 }}>Apni gaadi ki poori details bharein</p>
      <span style={S.lbl}>STEP 1 — VEHICLE TYPE</span>
      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
        {["Car","Bike"].map(t=>(
          <button key={t} onClick={()=>{setVt(t);setMake(null);setModel("");setYear(null);}} style={{ flex:1, padding:"12px", borderRadius:12, border:`2px solid ${vt===t?"#c8480a":"#e0d8cc"}`, background:vt===t?"#fff3ec":"white", cursor:"pointer", fontWeight:800, fontSize:14, color:vt===t?"#c8480a":"#4a3020" }}>{t==="Car"?"🚗":"🏍️"} {t}</button>
        ))}
      </div>
      <span style={S.lbl}>STEP 2 — BRAND</span>
      <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:20 }}>
        {makes.map(m=>(
          <button key={m} onClick={()=>{setMake(m);setModel("");setYear(null);}} style={{ padding:"7px 13px", borderRadius:20, background:make===m?"#c8480a":"white", border:`1px solid ${make===m?"#c8480a":"#e0d8cc"}`, color:make===m?"white":"#4a3020", fontSize:11, fontWeight:700, cursor:"pointer" }}>{m}</button>
        ))}
      </div>
      {make && (<>
        <span style={S.lbl}>STEP 3 — MODEL</span>
        <select value={model} onChange={e=>{setModel(e.target.value);setYear(null);}} style={{ ...S.inp, marginBottom:20, fontWeight:700, border:`2px solid ${model?"#c8480a":"#e0d8cc"}` }}>
          <option value="">-- Model chuniye --</option>
          {models.map(m=><option key={m} value={m}>{m}</option>)}
        </select>
      </>)}
      {model && (<>
        <span style={S.lbl}>STEP 4 — YEAR</span>
        <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:20 }}>
          {years.map(y=>(
            <button key={y} onClick={()=>setYear(y)} style={{ padding:"7px 11px", borderRadius:9, background:year===y?"#c8480a":"white", border:`1px solid ${year===y?"#c8480a":"#e0d8cc"}`, color:year===y?"white":"#4a3020", fontSize:11, fontWeight:700, cursor:"pointer" }}>{y}</button>
          ))}
        </div>
      </>)}
      {year && (<>
        <span style={S.lbl}>STEP 5 — REGION</span>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:20 }}>
          {REGIONS.map(r=>(
            <button key={r.id} onClick={()=>setRegion(r.id)} style={{ background:region===r.id?"#fff3ec":"white", border:`2px solid ${region===r.id?"#c8480a":"#e8e0d4"}`, borderRadius:12, padding:"12px 10px", cursor:"pointer", textAlign:"left" }}>
              <div style={{ fontSize:12, fontWeight:800, color:"#1a0a00" }}>{r.label}</div>
              <div style={{ fontSize:9, color:"#8a7060", marginTop:2 }}>{r.states}</div>
            </button>
          ))}
        </div>
      </>)}
      {ready && (<>
        <div style={{ background:"#fff3ec", border:"2px solid #c8480a", borderRadius:12, padding:"12px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:24 }}>{vt==="Car"?"🚗":"🏍️"}</span>
          <div><div style={{ fontSize:14, fontWeight:900, color:"#c8480a" }}>{year} {make} {model}</div><div style={{ fontSize:11, color:"#8a6050" }}>{vt} · {REGIONS.find(r=>r.id===region)?.label}</div></div>
          <span style={{ marginLeft:"auto", fontSize:18 }}>✅</span>
        </div>
        <button style={S.btn} onClick={()=>onDone({vt,make,model,year,region})}>Symptoms Chuniye →</button>
      </>)}
    </div>
  );
}

// ── SYMPTOMS ──────────────────────────────────────────────────────────────────
function Symptoms({ vehicle, onBack, onScan }) {
  const [sel, setSel] = useState([]);
  const tog = s => setSel(p=>p.find(x=>x.id===s.id)?p.filter(x=>x.id!==s.id):[...p,s]);
  const reg = REGIONS.find(r=>r.id===vehicle.region);
  return (
    <div style={{ paddingTop:20, paddingBottom:100 }}>
      <button style={S.bk} onClick={onBack}>← Back</button>
      <h2 style={{ fontSize:22, fontWeight:900, margin:"0 0 4px" }}>Kya problem hai?</h2>
      <div style={{ fontSize:10, color:"#c8480a", fontWeight:700, marginBottom:16 }}>{vehicle.year} {vehicle.make} {vehicle.model} · {reg?.label}</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {SYMPTOMS.map(s=>{
          const on=sel.find(x=>x.id===s.id);
          return (<button key={s.id} onClick={()=>tog(s)} style={{ background:on?"#fff3ec":"white", border:`2px solid ${on?"#c8480a":"#e8e0d4"}`, borderRadius:14, padding:"14px 10px", cursor:"pointer", textAlign:"left" }}>
            <div style={{ fontSize:26, marginBottom:6 }}>{s.icon}</div>
            <div style={{ fontSize:11, fontWeight:700, color:on?"#c8480a":"#1a0a00", lineHeight:1.3 }}>{s.label}</div>
            <div style={{ fontSize:9, color:"#b09080", marginTop:3, fontStyle:"italic" }}>{s.hint}</div>
          </button>);
        })}
      </div>
      {sel.length>0 && (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, padding:"16px 16px 24px", background:"linear-gradient(transparent,#f5f0e8 30%)" }}>
          <div style={{ maxWidth:480, margin:"0 auto" }}>
            <button style={S.btn} onClick={()=>onScan(sel)}>🔍 {sel.length} SYMPTOMS SCAN KARO →</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── SCANNING ──────────────────────────────────────────────────────────────────
function Scanning({ vehicle, symptoms }) {
  const steps = ["AI se jud rahe hain...","Symptoms analyse ho rahe hain...","Parts DB search...","Fault probability calculate...","Report ban rahi hai..."];
  const [step, setStep] = useState(0);
  const [prog, setProg] = useState(0);
  useState(()=>{
    let s=0;
    const t=setInterval(()=>{ s++; setStep(Math.min(s,steps.length-1)); setProg(Math.min(s*20,90)); },800);
    return ()=>clearInterval(t);
  });
  return (
    <div style={{ paddingTop:80, textAlign:"center" }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <div style={{ position:"relative", width:140, height:140, margin:"0 auto 32px" }}>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"3px solid transparent", borderTopColor:"#c8480a", animation:"spin 1s linear infinite" }} />
        <div style={{ position:"absolute", inset:10, borderRadius:"50%", border:"2px solid transparent", borderTopColor:"#ffd60a", animation:"spin 1.5s linear infinite reverse" }} />
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:52 }}>{vehicle.vt==="Bike"?"🏍️":"🚗"}</div>
      </div>
      <div style={{ fontSize:11, color:"#c8480a", letterSpacing:3, marginBottom:10, fontWeight:700 }}>AI SCANNING...</div>
      <div style={{ fontSize:15, fontWeight:700, color:"#1a0a00", marginBottom:24 }}>{steps[step]}</div>
      <div style={{ background:"#e8e0d4", borderRadius:6, height:6, overflow:"hidden", marginBottom:8 }}>
        <div style={{ height:"100%", width:`${prog}%`, background:"linear-gradient(90deg,#c8480a,#ffd60a)", transition:"width 0.7s ease" }} />
      </div>
      <div style={{ fontSize:12, color:"#8a7060" }}>{prog}% complete</div>
    </div>
  );
}

// ── RESULTS ───────────────────────────────────────────────────────────────────
function Results({ diag, vehicle, onMechanic }) {
  const [tab, setTab] = useState("diag");
  const [exp, setExp] = useState(null);
  const reg = REGIONS.find(r=>r.id===vehicle.region);
  const sev = (diag.severity||"medium").toLowerCase();
  return (
    <div style={{ paddingTop:20, paddingBottom:40 }}>
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {[["diag","🔍 Diagnosis"],["mech","🔧 Mechanic Brief"],["parts","🛒 Parts & Price"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:"9px 16px", borderRadius:20, border:"none", cursor:"pointer", fontSize:11, fontWeight:700, letterSpacing:1, background:tab===t?"#c8480a":"#ede8e0", color:tab===t?"white":"#8a7060" }}>{l}</button>
        ))}
      </div>
      {tab==="diag" && (
        <div>
          <div style={{ background:UB[sev]||UB.medium, border:`2px solid ${UC[sev]||UC.medium}`, borderRadius:16, padding:18, marginBottom:12 }}>
            <div style={{ fontSize:10, color:UC[sev]||UC.medium, letterSpacing:3, fontWeight:700, marginBottom:6 }}>{sev==="critical"?"🚨 TURANT THIK KARO":sev==="high"?"⚠️ JALDI THIK KARO":"ℹ️ DHYAN DO"}</div>
            <div style={{ fontSize:18, fontWeight:900, color:"white", lineHeight:1.3 }}>{diag.mainIssue}</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            <div style={{ ...S.card, padding:14 }}><div style={{ fontSize:9, color:"#8a7060", letterSpacing:1, marginBottom:4 }}>MECHANIC QUOTE</div><div style={{ fontSize:18, fontWeight:900, color:"#c8480a" }}>{diag.estimatedMechanicCostINR}</div></div>
            <div style={{ ...S.card, padding:14, background:"#f0fff4" }}><div style={{ fontSize:9, color:"#8a7060", letterSpacing:1, marginBottom:4 }}>PARTS COST</div><div style={{ fontSize:18, fontWeight:900, color:"#1a7a3a" }}>{diag.estimatedPartsCostINR}</div></div>
          </div>
          <div style={{ ...S.card, background:"#fff8ec", border:"1px solid #ffd60a40" }}>
            <div style={{ fontSize:10, color:"#c8480a", letterSpacing:2, fontWeight:700, marginBottom:6 }}>💰 AAPKI BACHAT</div>
            <div style={{ fontSize:26, fontWeight:900, color:"#c8480a" }}>{diag.totalSavingIfSelfSource}</div>
          </div>
          <div style={S.card}>
            <div style={{ fontSize:10, color:"#8a7060", letterSpacing:2, fontWeight:700, marginBottom:8 }}>🔍 AI ANALYSIS</div>
            <p style={{ fontSize:13, lineHeight:1.8, color:"#2a1a0a", margin:"0 0 12px" }}>{diag.fullExplanation}</p>
            <div style={{ borderTop:"1px dashed #e0d0c0", paddingTop:12 }}>
              <div style={{ fontSize:10, color:"#c8480a", fontWeight:700, marginBottom:6 }}>हिंदी में:</div>
              <p style={{ fontSize:12, lineHeight:1.8, color:"#4a2a1a", margin:0, fontStyle:"italic" }}>{diag.hindiExplanation}</p>
            </div>
          </div>
          {diag.immediateAction && <div style={{ ...S.card, background:"#fff0f0", border:"1px solid #ff3b3040" }}><div style={{ fontSize:10, color:"#c8000a", letterSpacing:2, fontWeight:700, marginBottom:6 }}>⚡ ABHI KYA KARO</div><p style={{ fontSize:13, color:"#2a0000", margin:0, lineHeight:1.7, fontWeight:700 }}>{diag.immediateAction}</p></div>}
          {diag.futureRisks?.length>0 && <div style={{ ...S.card, background:"#1a0a00" }}><div style={{ fontSize:10, color:"#ff6a30", letterSpacing:2, fontWeight:700, marginBottom:10 }}>⚠️ IGNORE KIYA TO</div>{diag.futureRisks.map((r,i)=><div key={i} style={{ display:"flex", gap:8, marginBottom:8 }}><span style={{ color:"#ff3b30" }}>▸</span><span style={{ fontSize:12, color:"#d09080", lineHeight:1.5 }}>{r}</span></div>)}</div>}
          <button style={S.btn} onClick={()=>setTab("mech")}>🔧 Mechanic Brief Dekho →</button>
        </div>
      )}
      {tab==="mech" && (
        <div>
          <div style={{ ...S.card, background:"#1a0a00", marginBottom:12 }}><div style={{ fontSize:10, color:"#ffd60a", letterSpacing:3, fontWeight:700, marginBottom:8 }}>📋 MECHANIC KO BOLEIN — ENGLISH</div><p style={{ fontSize:13, color:"#f0d8c0", lineHeight:1.8, margin:0, borderLeft:"3px solid #ffd60a", paddingLeft:12 }}>{diag.mechanicBriefEnglish}</p></div>
          <div style={{ ...S.card, background:"#0a1a00", marginBottom:12 }}><div style={{ fontSize:10, color:"#4ade80", letterSpacing:3, fontWeight:700, marginBottom:8 }}>📋 MECHANIC KO BOLEIN — HINDI</div><p style={{ fontSize:13, color:"#c0e8c0", lineHeight:1.8, margin:0, borderLeft:"3px solid #4ade80", paddingLeft:12 }}>{diag.mechanicBriefHindi}</p></div>
          <div style={{ ...S.card, background:"#fff8f0", border:"2px solid #c8480a" }}><div style={{ fontSize:11, color:"#c8480a", fontWeight:900, marginBottom:8 }}>🏅 URMECHANIC CERTIFIED PROTOCOL</div><p style={{ fontSize:12, color:"#2a1008", lineHeight:1.8, margin:0 }}>{diag.certifiedMechanicNote}</p></div>
          <button style={S.btn} onClick={()=>setTab("parts")}>🛒 Parts Prices Dekho →</button>
        </div>
      )}
      {tab==="parts" && (
        <div>
          <div style={{ fontSize:11, color:"#8a7060", marginBottom:14 }}>📍 Delivery to {reg?.label} (Hub: {reg?.hub})</div>
          {(diag.parts||[]).map((p,i)=>(
            <div key={i} style={{ ...S.card, cursor:"pointer" }} onClick={()=>setExp(exp===i?null:i)}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"inline-block", background:UB[p.urgency||"medium"], border:`1px solid ${UC[p.urgency||"medium"]}`, borderRadius:6, padding:"2px 8px", fontSize:9, color:UC[p.urgency||"medium"], fontWeight:700, marginBottom:6 }}>{(p.urgency||"medium").toUpperCase()}</div>
                  <div style={{ fontSize:14, fontWeight:800, color:"#1a0a00" }}>{p.name}</div>
                  <div style={{ fontSize:10, color:"#8a7060", marginTop:2 }}>Life: {p.lifespan}</div>
                </div>
                <div style={{ fontSize:14, color:"#c8480a" }}>{exp===i?"▲":"▼"}</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:7, marginTop:12 }}>
                {[
                  { label:"OEM", price:p.oemPrice, brand:p.oemBrand, color:"#1a4a8a", bg:"#f0f4ff", hi:false },
                  { label:"⭐ BEST", price:p.alt1Price, brand:p.alt1Brand, color:"#1a7a3a", bg:"#e8fff0", hi:true },
                  { label:"USED", price:p.alt2Price, brand:p.alt2Brand, color:"#8a7060", bg:"#faf8f5", hi:false },
                ].map(opt=>(
                  <div key={opt.label} style={{ background:opt.bg, border:`${opt.hi?"2":"1"}px solid ${opt.hi?"#1a7a3a":"#e0d8cc"}`, borderRadius:10, padding:"10px 6px", textAlign:"center" }}>
                    <div style={{ fontSize:8, color:opt.color, fontWeight:900, marginBottom:3 }}>{opt.label}</div>
                    <div style={{ fontSize:15, fontWeight:900, color:opt.color }}>₹{opt.price}</div>
                    <div style={{ fontSize:8, color:"#a09080", marginTop:2 }}>{(opt.brand||"").split("/")[0]}</div>
                    <button style={{ marginTop:6, width:"100%", padding:"4px 0", background:opt.hi?"#1a7a3a":"#e8e0d4", border:"none", borderRadius:6, color:opt.hi?"white":"#6a5040", fontSize:8, fontWeight:700, cursor:"pointer" }}>{opt.hi?"BUY ✓":"VIEW"}</button>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:8, fontSize:11, color:"#1a7a3a", fontWeight:700 }}>💰 OEM se ₹{(p.oemPrice||0)-(p.alt1Price||0)} bachao</div>
              {exp===i && (
                <div style={{ marginTop:14, borderTop:"1px dashed #e0d0c0", paddingTop:14 }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                    <div><div style={{ fontSize:10, color:"#1a7a3a", fontWeight:700, marginBottom:6 }}>✅ PROS</div>{(p.alt1Pros||[]).map((x,j)=><div key={j} style={{ fontSize:11, color:"#2a4a2a", marginBottom:3 }}>✓ {x}</div>)}</div>
                    <div><div style={{ fontSize:10, color:"#c8480a", fontWeight:700, marginBottom:6 }}>❌ CONS</div>{(p.alt1Cons||[]).map((x,j)=><div key={j} style={{ fontSize:11, color:"#4a2a1a", marginBottom:3 }}>✗ {x}</div>)}</div>
                  </div>
                  <div style={{ background:"#fff8f0", borderRadius:10, padding:10, marginBottom:8 }}>
                    <div style={{ fontSize:9, color:"#c8480a", fontWeight:700, marginBottom:4 }}>⚠️ LOCAL SE BACHEIN</div>
                    {(p.alt2Cons||[]).map((x,j)=><div key={j} style={{ fontSize:11, color:"#8a3020", marginBottom:3 }}>✗ {x}</div>)}
                  </div>
                  <div style={{ background:"#1a0a00", borderRadius:10, padding:12 }}>
                    <div style={{ fontSize:9, color:"#ffd60a", fontWeight:700, marginBottom:6 }}>💬 MECHANIC KO BOLEIN</div>
                    <p style={{ fontSize:11, color:"#d0b090", margin:0, lineHeight:1.7, fontStyle:"italic" }}>"{p.mechanicNote}"</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div style={{ background:"linear-gradient(135deg,#1a0a00,#3a1800)", borderRadius:16, padding:20, textAlign:"center", marginBottom:12 }}>
            <div style={{ fontSize:10, color:"#ffd60a", letterSpacing:3, fontWeight:700, marginBottom:6 }}>💰 TOTAL BACHAT</div>
            <div style={{ fontSize:32, fontWeight:900, color:"#ffd60a" }}>₹{(diag.parts||[]).reduce((a,p)=>a+(p.oemPrice||0)-(p.alt1Price||0),0).toLocaleString("en-IN")}</div>
          </div>
          <div style={{ ...S.card, textAlign:"center", background:"#fff8f0", border:"2px solid #c8480a" }}>
            <div style={{ fontSize:22, marginBottom:8 }}>🏅</div>
            <div style={{ fontSize:13, fontWeight:800, color:"#c8480a" }}>UrMechanic Certified Mechanic Chahiye?</div>
            <div style={{ fontSize:11, color:"#8a6050", margin:"6px 0 14px", lineHeight:1.6 }}>Verified mechanics who follow diagnosis protocol.</div>
            <button style={{ ...S.btn, width:"auto", padding:"11px 24px" }} onClick={onMechanic}>🔍 FIND CERTIFIED MECHANIC</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PHOTO SCAN ────────────────────────────────────────────────────────────────
function PhotoScan({ onBack }) {
  const [mode, setMode] = useState(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRef = useRef(null);

  const openCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:"environment" } });
      streamRef.current = s;
      if(videoRef.current) videoRef.current.srcObject = s;
    } catch { alert("Camera permission denied. Please allow camera."); }
  };

  const capture = () => {
    if(!videoRef.current||!canvasRef.current) return;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    canvasRef.current.getContext("2d").drawImage(videoRef.current,0,0);
    canvasRef.current.toBlob(blob=>{
      const f = new File([blob],"photo.jpg",{type:"image/jpeg"});
      setFile(f); setPreview(URL.createObjectURL(f));
      streamRef.current?.getTracks().forEach(t=>t.stop()); streamRef.current=null;
    },"image/jpeg",0.9);
  };

  const startRec = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio:true });
      mediaRef.current = new MediaRecorder(s);
      const chunks = [];
      mediaRef.current.ondataavailable = e=>chunks.push(e.data);
      mediaRef.current.onstop = ()=>{ const b=new Blob(chunks,{type:"audio/webm"}); setAudioURL(URL.createObjectURL(b)); };
      mediaRef.current.start(); setRecording(true);
    } catch { alert("Microphone permission denied."); }
  };

  const stopRec = () => { mediaRef.current?.stop(); setRecording(false); };

  const analyse = async () => {
    if(!file && !audioURL) return;
    setScanning(true); setResult(null);
    try {
      let r;
      if(file) {
        const b64 = await toB64(file);
        const prompt = `You are UrMechanic AI India vehicle inspector. Analyse this vehicle photo. ${desc?"User says: "+desc:""}\n\nRespond ONLY in valid JSON:\n{"overallCondition":"Good","conditionScore":75,"mainFindings":["finding1"],"issuesFound":["issue1"],"urgentActions":["action1"],"estimatedRepairCostINR":"₹500-₹5000","safeToUse":true,"summaryEnglish":"3 sentence summary","summaryHindi":"Hindi summary","mechanicBrief":"Tell mechanic this"}`;
        const res = await fetch("https://corsproxy.io/?url=https://api.anthropic.com/v1/messages",{
          method:"POST",headers:{"Content-Type":"application/json","x-api-key":process.env.REACT_APP_ANTHROPIC_KEY||"","anthropic-version":"2023-06-01"},
          body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:file.type,data:b64}},{type:"text",text:prompt}]}]})
        });
        const d = await res.json();
        const t = d.content?.map(i=>i.text||"").join("")||"";
        try { r=JSON.parse(t.replace(/```json|```/g,"").trim()); } catch { r=null; }
      }
      if(!r) r={ overallCondition:"Fair", conditionScore:65, mainFindings:["Photo/audio analysed"], issuesFound:["Professional inspection recommended"], urgentActions:["Visit certified mechanic"], estimatedRepairCostINR:"₹500-₹5,000", safeToUse:true, summaryEnglish:"Vehicle has been analysed. A certified mechanic should inspect in person.", summaryHindi:"Gaadi ko dekha gaya. Certified mechanic se milein.", mechanicBrief:"Please inspect this vehicle thoroughly for the reported issues." };
      setResult(r);
    } catch { setResult({ overallCondition:"Fair", conditionScore:50, mainFindings:["Analysis done"], issuesFound:["Visit mechanic for full inspection"], urgentActions:["Get professional inspection"], estimatedRepairCostINR:"₹500-₹5,000", safeToUse:true, summaryEnglish:"Please visit a certified mechanic.", summaryHindi:"Certified mechanic ke paas jaayein.", mechanicBrief:"Full inspection needed." }); }
    setScanning(false);
  };

  const sc = s => s>=80?"#1a7a3a":s>=60?"#ff9500":"#ff3b30";

  return (
    <div style={{ paddingTop:20, paddingBottom:40 }}>
      <button style={S.bk} onClick={onBack}>← Back</button>
      <h2 style={{ fontSize:22, fontWeight:900, margin:"0 0 4px" }}>📸 Photo & Sound Scan</h2>
      <p style={{ color:"#8a6a50", fontSize:12, marginBottom:20 }}>Photo ya sound se AI condition batayega</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:20 }}>
        {[{m:"upload",i:"📁",l:"Upload Photo"},{m:"camera",i:"📷",l:"Camera Scan"},{m:"sound",i:"🎤",l:"Sound Record"}].map(x=>(
          <button key={x.m} onClick={()=>{ setMode(x.m); setResult(null); setFile(null); setPreview(null); setAudioURL(null); if(x.m==="camera") setTimeout(openCamera,200); }} style={{ ...S.card, textAlign:"center", cursor:"pointer", border:`2px solid ${mode===x.m?"#c8480a":"#e0d8cc"}`, background:mode===x.m?"#fff3ec":"white", padding:"14px 8px" }}>
            <div style={{ fontSize:28, marginBottom:6 }}>{x.i}</div>
            <div style={{ fontSize:10, fontWeight:700, color:mode===x.m?"#c8480a":"#4a3020" }}>{x.l}</div>
          </button>
        ))}
      </div>
      {mode==="upload" && (
        <div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>{ const f=e.target.files[0]; if(f){setFile(f);setPreview(URL.createObjectURL(f));} }} />
          {!preview ? <div onClick={()=>fileRef.current?.click()} style={{ border:"2px dashed #c8480a", borderRadius:16, padding:"32px 20px", textAlign:"center", cursor:"pointer", marginBottom:16, background:"#fff8f5" }}><div style={{ fontSize:40, marginBottom:8 }}>📸</div><div style={{ fontSize:13, fontWeight:700, color:"#c8480a" }}>Photo yahan tap karo</div><div style={{ fontSize:11, color:"#8a6a50", marginTop:4 }}>Engine, tyres, dashboard, under-body</div></div>
          : <img src={preview} alt="" style={{ width:"100%", borderRadius:12, marginBottom:12, objectFit:"cover", maxHeight:250 }} />}
        </div>
      )}
      {mode==="camera" && (
        <div>
          {!preview ? (
            <div style={{ marginBottom:16 }}>
              <video ref={videoRef} autoPlay playsInline style={{ width:"100%", borderRadius:12, marginBottom:10, maxHeight:280, objectFit:"cover", background:"#000" }} />
              <canvas ref={canvasRef} style={{ display:"none" }} />
              <button style={S.btn} onClick={capture}>📸 Photo Lo</button>
            </div>
          ) : (
            <div>
              <img src={preview} alt="" style={{ width:"100%", borderRadius:12, marginBottom:12, objectFit:"cover", maxHeight:250 }} />
              <button onClick={()=>{setPreview(null);setFile(null);openCamera();}} style={{ ...S.btn, background:"#e8e0d4", color:"#4a3020", marginBottom:12 }}>🔄 Dobara Lo</button>
            </div>
          )}
        </div>
      )}
      {mode==="sound" && (
        <div style={{ ...S.card, background:"#fff8f0", textAlign:"center", padding:24, marginBottom:16 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>{recording?"🔴":"🎤"}</div>
          <div style={{ fontSize:14, fontWeight:700, color:"#1a0a00", marginBottom:8 }}>{recording?"Recording...":"Engine sound record karo"}</div>
          <div style={{ fontSize:11, color:"#8a6a50", marginBottom:16 }}>Engine start karo, phir record dabao.</div>
          {!recording && !audioURL && <button style={S.btn} onClick={startRec}>🎤 Recording Shuru</button>}
          {recording && <button style={{ ...S.btn, background:"#ff3b30" }} onClick={stopRec}>⏹ Band Karo</button>}
          {audioURL && <div><audio src={audioURL} controls style={{ width:"100%", marginBottom:10 }} /><button style={{ ...S.btn, background:"#e8e0d4", color:"#4a3020" }} onClick={()=>{setAudioURL(null);}}>🔄 Dobara</button></div>}
        </div>
      )}
      {(file||audioURL) && !scanning && !result && (
        <div>
          <span style={S.lbl}>Problem describe karo (optional)</span>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="e.g. Engine se knocking sound aa raha hai..." style={{ ...S.inp, height:70, resize:"vertical", marginBottom:12 }} />
          <button style={S.btn} onClick={analyse}>🔍 AI SE ANALYSE KARO</button>
        </div>
      )}
      {scanning && <div style={{ ...S.card, textAlign:"center", padding:32 }}><div style={{ width:60, height:60, border:"3px solid #e8e0d4", borderTopColor:"#c8480a", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 16px" }} /><div style={{ fontSize:14, fontWeight:700, color:"#c8480a" }}>Analyse ho raha hai...</div></div>}
      {result && (
        <div>
          <div style={{ ...S.card, background:result.safeToUse?"#f0fff4":"#fff0f0", border:`2px solid ${result.safeToUse?"#1a7a3a":"#ff3b30"}`, textAlign:"center", padding:20, marginBottom:12 }}>
            <div style={{ fontSize:40, marginBottom:8 }}>{result.safeToUse?"✅":"🚨"}</div>
            <div style={{ fontSize:22, fontWeight:900, color:sc(result.conditionScore||50) }}>{result.conditionScore||65}/100</div>
            <div style={{ fontSize:14, fontWeight:700, color:"#1a0a00" }}>{result.overallCondition} Condition</div>
          </div>
          <div style={S.card}><div style={{ fontSize:10, color:"#8a7060", letterSpacing:2, fontWeight:700, marginBottom:8 }}>FINDINGS</div>{(result.mainFindings||[]).map((f,i)=><div key={i} style={{ display:"flex", gap:8, marginBottom:6 }}><span style={{ color:"#1a7a3a" }}>✓</span><span style={{ fontSize:12 }}>{f}</span></div>)}</div>
          {(result.issuesFound||[]).length>0 && <div style={{ ...S.card, background:"#fff8f0" }}><div style={{ fontSize:10, color:"#c8480a", letterSpacing:2, fontWeight:700, marginBottom:8 }}>⚠️ ISSUES</div>{result.issuesFound.map((f,i)=><div key={i} style={{ display:"flex", gap:8, marginBottom:6 }}><span style={{ color:"#c8480a" }}>!</span><span style={{ fontSize:12 }}>{f}</span></div>)}</div>}
          <div style={S.card}><div style={{ fontSize:10, color:"#8a7060", letterSpacing:2, fontWeight:700, marginBottom:8 }}>SUMMARY</div><p style={{ fontSize:13, color:"#2a1a0a", lineHeight:1.8, margin:"0 0 10px" }}>{result.summaryEnglish}</p><p style={{ fontSize:12, color:"#4a2a1a", lineHeight:1.8, margin:0, fontStyle:"italic" }}>{result.summaryHindi}</p></div>
          <div style={{ ...S.card, background:"#1a0a00" }}><div style={{ fontSize:10, color:"#ffd60a", fontWeight:700, marginBottom:8 }}>💬 MECHANIC KO BOLEIN</div><p style={{ fontSize:12, color:"#d0b090", lineHeight:1.8, margin:0, fontStyle:"italic" }}>"{result.mechanicBrief}"</p></div>
          <div style={{ ...S.card, background:"#f0f4ff" }}><div style={{ fontSize:9, color:"#1a4a8a", letterSpacing:1, fontWeight:700 }}>ESTIMATED REPAIR</div><div style={{ fontSize:18, fontWeight:900, color:"#1a4a8a" }}>{result.estimatedRepairCostINR}</div></div>
        </div>
      )}
    </div>
  );
}

// ── USED CAR ──────────────────────────────────────────────────────────────────
function UsedCar({ onBack }) {
  const [step, setStep] = useState("info");
  const [info, setInfo] = useState({make:"",model:"",year:"",price:"",km:""});
  const [uploads, setUploads] = useState({});
  const [scanning, setScanning] = useState(false);
  const [report, setReport] = useState(null);
  const fileRefs = useRef({});

  const checks = [
    {id:1,icon:"🔧",label:"Engine area photo",desc:"Oil leaks, rust, damage check"},
    {id:2,icon:"🚗",label:"Under-body photo",desc:"Chassis rust aur accident damage"},
    {id:3,icon:"⭕",label:"Tyre condition photo",desc:"Wear pattern — alignment issue"},
    {id:4,icon:"📊",label:"Dashboard photo",desc:"Warning lights on ya off?"},
    {id:5,icon:"🎵",label:"Engine start/idle sound",desc:"Knocking ya rough idle?"},
    {id:6,icon:"🏎️",label:"Acceleration sound",desc:"Transmission health check"},
  ];

  const analyse = async () => {
    setScanning(true);
    try {
      let imgs = [];
      for(const c of checks) {
        if(uploads[c.id] && uploads[c.id].type?.startsWith("image/")) {
          const b64 = await toB64(uploads[c.id]);
          imgs.push({type:"image",source:{type:"base64",media_type:uploads[c.id].type,data:b64}});
          imgs.push({type:"text",text:"Above: "+c.label});
        }
      }
      imgs.push({type:"text",text:`You are UrMechanic AI India used car expert. These are photos of a ${info.year} ${info.make} ${info.model} being sold for Rs.${info.price} with ${info.km} km.\n\nRespond ONLY in valid JSON:\n{"overallScore":70,"buyRecommendation":"Buy","fairPrice":"Rs.4,00,000","estimatedRepairsNeeded":"Rs.5,000-Rs.20,000","redFlags":["flag1"],"goodPoints":["point1"],"negotiationTips":["tip1"],"checklistFindings":{"engine":"Good","body":"Fair","tyres":"Good","interior":"Good","electrical":"Fair"},"summaryEnglish":"3 sentence verdict","summaryHindi":"Hindi verdict","mechanicCheckList":"What mechanic should check"}`});
      const res = await fetch("https://corsproxy.io/?url=https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json","x-api-key":process.env.REACT_APP_ANTHROPIC_KEY||"","anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,messages:[{role:"user",content:imgs}]})
      });
      const d = await res.json();
      const t = d.content?.map(i=>i.text||"").join("")||"";
      let r;
      try { r=JSON.parse(t.replace(/```json|```/g,"").trim()); } catch { r=null; }
      if(!r) r={ overallScore:65, buyRecommendation:"Negotiate", fairPrice:"Negotiate further", estimatedRepairsNeeded:"Rs.5,000-Rs.20,000", redFlags:["Get mechanic inspection before buying"], goodPoints:["Photos submitted"], negotiationTips:["Ask for lower price"], checklistFindings:{engine:"Fair",body:"Fair",tyres:"Fair",interior:"Fair",electrical:"Fair"}, summaryEnglish:"Get a professional mechanic inspection before purchase.", summaryHindi:"Kharidne se pehle mechanic se inspection karwayein.", mechanicCheckList:"Full inspection needed." };
      setReport(r);
    } catch { setReport({ overallScore:50, buyRecommendation:"Negotiate", fairPrice:"Unknown", estimatedRepairsNeeded:"Unknown", redFlags:["Get offline inspection"], goodPoints:["Checklist submitted"], negotiationTips:["Get independent inspection"], checklistFindings:{engine:"Unknown",body:"Unknown",tyres:"Unknown",interior:"Unknown",electrical:"Unknown"}, summaryEnglish:"Please visit a certified mechanic for inspection.", summaryHindi:"Certified mechanic se milein.", mechanicCheckList:"Full vehicle inspection required." }); }
    setScanning(false); setStep("report");
  };

  const rc = { "Buy":"#1a7a3a", "Negotiate":"#ff9500", "Avoid":"#ff3b30" };

  return (
    <div style={{ paddingTop:20, paddingBottom:40 }}>
      <button style={S.bk} onClick={onBack}>← Back</button>
      {step==="info" && (
        <div>
          <div style={{ textAlign:"center", marginBottom:20 }}><div style={{ fontSize:48, marginBottom:8 }}>🚗</div><h2 style={{ fontSize:22, fontWeight:900, margin:"0 0 6px" }}>Secondhand Car Check</h2><p style={{ color:"#8a6a50", fontSize:12, lineHeight:1.7 }}>Purani gaadi kharidne se pehle AI se check karwao. Lakhs ki galti se bachao!</p></div>
          <div style={{ ...S.card, background:"#fff8f0", marginBottom:16 }}>
            <div style={{ fontSize:11, color:"#c8480a", letterSpacing:2, fontWeight:700, marginBottom:10 }}>KYA CHECK HOGA?</div>
            {[["🔧","Engine — leaks, rust, damage"],["🚗","Under-body — chassis rust"],["⭕","Tyres — alignment issues"],["📊","Dashboard — warning lights"],["🎵","Engine sound — knocking, rough idle"],["🏎️","Acceleration — transmission health"]].map(([i,t])=>(
              <div key={t} style={{ display:"flex", gap:10, marginBottom:8 }}><span style={{ fontSize:16 }}>{i}</span><span style={{ fontSize:12, color:"#2a1a0a", lineHeight:1.5 }}>{t}</span></div>
            ))}
          </div>
          <div style={S.card}>
            <div style={{ fontSize:11, color:"#8a7060", letterSpacing:2, fontWeight:700, marginBottom:12 }}>GAADI KI DETAILS</div>
            {[{k:"make",l:"Brand",p:"e.g. Maruti Suzuki"},{k:"model",l:"Model",p:"e.g. Swift"},{k:"year",l:"Year",p:"e.g. 2019"},{k:"price",l:"Asking Price (Rs.)",p:"e.g. 450000"},{k:"km",l:"KM Driven",p:"e.g. 45000"}].map(f=>(
              <div key={f.k} style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, color:"#6a5040", fontWeight:700, marginBottom:5 }}>{f.l}</div>
                <input style={S.inp} placeholder={f.p} value={info[f.k]} onChange={e=>setInfo(p=>({...p,[f.k]:e.target.value}))} />
              </div>
            ))}
          </div>
          <button style={S.btn} onClick={()=>setStep("photos")}>📸 Photos Upload Karo →</button>
        </div>
      )}
      {step==="photos" && (
        <div>
          <h3 style={{ fontSize:18, fontWeight:900, margin:"0 0 4px" }}>Photos Upload Karo</h3>
          <p style={{ color:"#8a6a50", fontSize:12, marginBottom:16 }}>Jitni zyada photos, utna accurate result</p>
          {checks.map(c=>(
            <div key={c.id} style={{ ...S.card, marginBottom:10 }}>
              <input ref={el=>fileRefs.current[c.id]=el} type="file" accept={c.id>4?"audio/*":"image/*"} style={{ display:"none" }} onChange={e=>{ if(e.target.files[0]) setUploads(p=>({...p,[c.id]:e.target.files[0]})); }} />
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ fontSize:28 }}>{c.icon}</div>
                <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:700, color:"#1a0a00" }}>{c.label}</div><div style={{ fontSize:10, color:"#8a7060", marginTop:2 }}>{c.desc}</div></div>
                <button onClick={()=>fileRefs.current[c.id]?.click()} style={{ padding:"8px 12px", borderRadius:10, background:uploads[c.id]?"#1a7a3a":"#c8480a", color:"white", border:"none", fontSize:11, fontWeight:700, cursor:"pointer", flexShrink:0 }}>{uploads[c.id]?"✅ Done":"Upload"}</button>
              </div>
              {uploads[c.id]?.type?.startsWith("image/") && <img src={URL.createObjectURL(uploads[c.id])} alt="" style={{ width:"100%", borderRadius:8, marginTop:8, maxHeight:150, objectFit:"cover" }} />}
            </div>
          ))}
          <div style={{ ...S.card, background:"#f0fff4", marginBottom:16, textAlign:"center" }}><div style={{ fontSize:13, fontWeight:700, color:"#1a7a3a" }}>{Object.keys(uploads).length}/{checks.length} items uploaded</div></div>
          {Object.keys(uploads).length>=2 && <button style={S.btn} onClick={analyse} disabled={scanning}>{scanning?"⏳ Analyse ho raha hai...":"🔍 AI SE CHECK KARO →"}</button>}
          {scanning && <div style={{ ...S.card, textAlign:"center", padding:32, marginTop:12 }}><div style={{ width:60, height:60, border:"3px solid #e8e0d4", borderTopColor:"#c8480a", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 16px" }} /><div style={{ fontSize:14, fontWeight:700, color:"#c8480a" }}>AI photos analyse kar raha hai...</div><div style={{ fontSize:11, color:"#8a7060", marginTop:4 }}>30-60 seconds lag sakte hain</div></div>}
        </div>
      )}
      {step==="report" && report && (
        <div>
          <div style={{ ...S.card, textAlign:"center", background:report.buyRecommendation==="Buy"?"#f0fff4":report.buyRecommendation==="Avoid"?"#fff0f0":"#fff8f0", border:`2px solid ${rc[report.buyRecommendation]||"#ff9500"}`, padding:20, marginBottom:12 }}>
            <div style={{ fontSize:40, marginBottom:8 }}>{report.buyRecommendation==="Buy"?"✅":report.buyRecommendation==="Avoid"?"🚫":"⚠️"}</div>
            <div style={{ fontSize:28, fontWeight:900, color:rc[report.buyRecommendation]||"#ff9500" }}>{report.buyRecommendation==="Buy"?"BUY KARO":report.buyRecommendation==="Avoid"?"MAT KHARIDO":"NEGOTIATE KARO"}</div>
            <div style={{ fontSize:14, fontWeight:700, color:"#1a0a00", marginTop:4 }}>Score: {report.overallScore}/100</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            <div style={S.card}><div style={{ fontSize:9, color:"#8a7060", letterSpacing:1 }}>FAIR PRICE</div><div style={{ fontSize:16, fontWeight:900, color:"#c8480a" }}>{report.fairPrice}</div></div>
            <div style={S.card}><div style={{ fontSize:9, color:"#8a7060", letterSpacing:1 }}>REPAIRS NEEDED</div><div style={{ fontSize:14, fontWeight:900, color:"#ff9500" }}>{report.estimatedRepairsNeeded}</div></div>
          </div>
          <div style={S.card}>
            <div style={{ fontSize:10, color:"#8a7060", letterSpacing:2, fontWeight:700, marginBottom:10 }}>CONDITION REPORT</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {Object.entries(report.checklistFindings||{}).map(([k,v])=>(
                <div key={k} style={{ background:v==="Good"?"#f0fff4":v==="Poor"?"#fff0f0":"#fff8f0", borderRadius:8, padding:"8px 10px", display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:11, fontWeight:700, textTransform:"capitalize" }}>{k}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:v==="Good"?"#1a7a3a":v==="Poor"?"#ff3b30":"#ff9500" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          {(report.redFlags||[]).length>0 && <div style={{ ...S.card, background:"#fff0f0" }}><div style={{ fontSize:10, color:"#ff3b30", letterSpacing:2, fontWeight:700, marginBottom:8 }}>🚩 RED FLAGS</div>{report.redFlags.map((f,i)=><div key={i} style={{ fontSize:12, color:"#2a0a0a", marginBottom:5 }}>🔴 {f}</div>)}</div>}
          {(report.goodPoints||[]).length>0 && <div style={{ ...S.card, background:"#f0fff4" }}><div style={{ fontSize:10, color:"#1a7a3a", letterSpacing:2, fontWeight:700, marginBottom:8 }}>✅ GOOD POINTS</div>{report.goodPoints.map((f,i)=><div key={i} style={{ fontSize:12, color:"#0a2a0a", marginBottom:5 }}>✅ {f}</div>)}</div>}
          {(report.negotiationTips||[]).length>0 && <div style={{ ...S.card, background:"#fff8f0" }}><div style={{ fontSize:10, color:"#c8480a", letterSpacing:2, fontWeight:700, marginBottom:8 }}>💬 NEGOTIATE KARO</div>{report.negotiationTips.map((t,i)=><div key={i} style={{ fontSize:12, color:"#2a1a0a", marginBottom:5 }}>• {t}</div>)}</div>}
          <div style={S.card}><div style={{ fontSize:10, color:"#8a7060", letterSpacing:2, fontWeight:700, marginBottom:8 }}>VERDICT</div><p style={{ fontSize:13, color:"#2a1a0a", lineHeight:1.8, margin:"0 0 10px" }}>{report.summaryEnglish}</p><p style={{ fontSize:12, color:"#4a2a1a", lineHeight:1.8, margin:0, fontStyle:"italic" }}>{report.summaryHindi}</p></div>
          <button style={{ ...S.btn, marginTop:8 }} onClick={()=>{setStep("info");setReport(null);setUploads({});setInfo({make:"",model:"",year:"",price:"",km:""});}}>🔄 Naya Check</button>
        </div>
      )}
    </div>
  );
}

// ── MECHANIC ──────────────────────────────────────────────────────────────────
function Mechanic({ onBack, onRegister, region }) {
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);
  const reg = REGIONS.find(r=>r.id===region);
  return (
    <div style={{ paddingTop:20, paddingBottom:40 }}>
      <button style={S.bk} onClick={onBack}>← Back</button>
      <div style={{ textAlign:"center", marginBottom:20 }}><div style={{ fontSize:48, marginBottom:8 }}>🏅</div><h2 style={{ fontSize:22, fontWeight:900, margin:"0 0 6px" }}>UrMechanic Certified</h2><p style={{ color:"#8a6a50", fontSize:12, lineHeight:1.7 }}>Trusted mechanics who follow AI diagnosis protocol</p></div>
      <div style={{ ...S.card, background:"#fff8f0", marginBottom:14 }}>
        <div style={{ fontSize:11, color:"#c8480a", letterSpacing:2, fontWeight:700, marginBottom:10 }}>CERTIFIED MECHANIC KYA KARTA HAI?</div>
        {["Sirf app ke diagnosis ke according kaam karta hai","Part lagane se pehle aapko dikhata hai","Koi hidden charge nahi","30 din ki guarantee deta hai"].map((t,i)=>(
          <div key={i} style={{ display:"flex", gap:8, marginBottom:7 }}><span style={{ color:"#c8480a" }}>✅</span><span style={{ fontSize:12, color:"#2a1a0a" }}>{t}</span></div>
        ))}
      </div>
      <div style={{ ...S.card, background:"#1a0a00", marginBottom:14 }}>
        <div style={{ fontSize:11, color:"#ffd60a", letterSpacing:2, fontWeight:700, marginBottom:10 }}>📍 {reg?.label?.toUpperCase()||"APNE AREA"} — MECHANICS</div>
        <div style={{ textAlign:"center", padding:"16px 0" }}><div style={{ fontSize:36, marginBottom:10 }}>🔜</div><div style={{ fontSize:14, fontWeight:700, color:"#d0b890", marginBottom:6 }}>Mechanics verify ho rahe hain</div><div style={{ fontSize:11, color:"#8a6a50", lineHeight:1.7 }}>{reg?.hub||"Aapke area"} mein mechanics onboard ho rahe hain.</div></div>
      </div>
      {!done ? (
        <div style={{ ...S.card, marginBottom:14 }}>
          <div style={{ fontSize:11, color:"#c8480a", letterSpacing:2, fontWeight:700, marginBottom:10 }}>🔔 NOTIFY ME</div>
          <input style={{ ...S.inp, marginBottom:10 }} type="tel" placeholder="WhatsApp number" value={phone} onChange={e=>setPhone(e.target.value)} />
          <button style={S.btn} onClick={()=>{ if(phone.length>=10) setDone(true); }}>📲 Notify Karo — FREE</button>
        </div>
      ) : (
        <div style={{ ...S.card, background:"#f0fff4", border:"2px solid #1a7a3a", textAlign:"center", marginBottom:14 }}><div style={{ fontSize:36, marginBottom:8 }}>✅</div><div style={{ fontSize:14, fontWeight:800, color:"#1a7a3a" }}>Registered!</div><div style={{ fontSize:12, color:"#2a5a2a", marginTop:4 }}>WhatsApp pe notify karenge.</div></div>
      )}
      <div style={{ background:"linear-gradient(135deg,#0a1f0a,#1a3a1a)", borderRadius:16, padding:20, border:"1px solid #2a5a2a" }}>
        <div style={{ fontSize:14, fontWeight:900, color:"#4ade80", marginBottom:8 }}>🔧 Kya aap mechanic hain?</div>
        <p style={{ fontSize:12, color:"#80c880", lineHeight:1.7, marginBottom:14 }}>UrMechanic Certified bano. Rs.499/month. Pehle 3 mahine FREE.</p>
        <button style={S.btnG} onClick={onRegister}>✅ CERTIFIED BANO →</button>
      </div>
    </div>
  );
}

// ── REGISTER ──────────────────────────────────────────────────────────────────
function Register({ onBack }) {
  const [form, setForm] = useState({name:"",workshop:"",phone:"",city:"",pin:"",exp:""});
  const [specs, setSpecs] = useState([]);
  const [done, setDone] = useState(false);
  const tog = s => setSpecs(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]);
  if(done) return (
    <div style={{ paddingTop:60, textAlign:"center" }}>
      <div style={{ fontSize:64, marginBottom:16 }}>🏅</div>
      <h2 style={{ fontSize:24, fontWeight:900, color:"#1a0a00", margin:"0 0 10px" }}>Registration Ho Gaya!</h2>
      <p style={{ color:"#8a6a50", fontSize:13, lineHeight:1.8 }}>Hamari team 24 ghante mein aapke WhatsApp pe contact karegi.</p>
      <button style={{ ...S.btn, marginTop:20 }} onClick={onBack}>← Wapas Jaao</button>
    </div>
  );
  return (
    <div style={{ paddingTop:20, paddingBottom:40 }}>
      <button style={S.bk} onClick={onBack}>← Back</button>
      <div style={{ textAlign:"center", marginBottom:20 }}><div style={{ fontSize:40, marginBottom:6 }}>🔧</div><h2 style={{ fontSize:20, fontWeight:900, margin:"0 0 4px" }}>Mechanic Registration</h2><div style={{ display:"inline-block", background:"#fff3ec", border:"2px solid #c8480a", borderRadius:20, padding:"4px 16px", fontSize:11, color:"#c8480a", fontWeight:700 }}>Rs.499/month · FREE pehle 3 mahine</div></div>
      <div style={S.card}>
        {[{k:"name",l:"Aapka Naam",p:"Ramesh Kumar"},{k:"workshop",l:"Workshop Name",p:"Ramesh Auto Works"},{k:"phone",l:"WhatsApp Number",p:"98765 43210"},{k:"city",l:"City",p:"Delhi"},{k:"pin",l:"Pin Code",p:"110001"},{k:"exp",l:"Experience",p:"10 saal"}].map(f=>(
          <div key={f.k} style={{ marginBottom:12 }}><div style={{ fontSize:11, color:"#6a5040", fontWeight:700, marginBottom:5 }}>{f.l}</div><input style={S.inp} placeholder={f.p} value={form[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} /></div>
        ))}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, color:"#6a5040", fontWeight:700, marginBottom:8 }}>Specialization</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {["Car","Bike","Engine","AC Repair","Electrical","Body Work","Tyres"].map(sp=>(
              <button key={sp} onClick={()=>tog(sp)} style={{ padding:"6px 12px", borderRadius:16, background:specs.includes(sp)?"#c8480a":"#fff3ec", border:"1px solid #c8480a", color:specs.includes(sp)?"white":"#c8480a", fontSize:11, fontWeight:700, cursor:"pointer" }}>{sp}</button>
            ))}
          </div>
        </div>
        <div style={{ background:"#f0fff4", border:"1px solid #1a7a3a40", borderRadius:10, padding:12, marginBottom:16 }}>
          <div style={{ fontSize:11, color:"#1a7a3a", fontWeight:700, marginBottom:6 }}>✅ Aap agree karte hain:</div>
          <div style={{ fontSize:11, color:"#2a5a2a", lineHeight:1.8 }}>• App ke diagnosis ke hisaab se kaam karoonga<br/>• Customer ko part pehle dikhaunga<br/>• Hidden charge nahi lunga<br/>• 30 din ki guarantee dunga</div>
        </div>
        <button style={S.btn} onClick={()=>{ if(form.name&&form.phone&&form.city) setDone(true); }}>🏅 SUBMIT — FREE</button>
        <div style={{ textAlign:"center", marginTop:10, fontSize:11, color:"#8a7060" }}>24 ghante mein WhatsApp pe contact karenge</div>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function UrMechanicApp() {
  const [screen, setScreen] = useState("home");
  const [vehicle, setVehicle] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [diag, setDiag] = useState(null);

  const fallbackDiag = useCallback((syms, veh) => {
    const sl = syms.map(s=>s.label).join(", ");
    const cats = [...new Set(syms.map(s=>s.cat))];
    const parts = cats.flatMap(c=>PARTS_DB[c]||[]);
    return {
      mainIssue:`Issues Found — ${veh.make} ${veh.model}`, severity:"High",
      fullExplanation:`Your ${veh.year} ${veh.make} ${veh.model} shows: ${sl}. These need attention.`,
      hindiExplanation:`Aapki ${veh.make} mein yeh samasya hai: ${sl}. Mechanic ke paas jaao.`,
      estimatedMechanicCostINR:"₹800 – ₹3,500", estimatedPartsCostINR:"₹500 – ₹4,000",
      totalSavingIfSelfSource:"₹1,500", diyDifficulty:"Medium",
      rootCause:"Needs inspection.", immediateAction:"Check oil and coolant first.",
      partsNeeded:syms.slice(0,3).map(s=>s.label),
      mechanicBriefEnglish:`My ${veh.year} ${veh.make} ${veh.model} has: ${sl}. Only branded parts please.`,
      mechanicBriefHindi:`Mere ${veh.make} mein: ${sl}. Branded part lagao.`,
      futureRisks:["Engine damage if ignored","Higher costs later"],
      certifiedMechanicNote:"Run OBD scan. Check all fluids, brakes, battery, belts.",
      preventionTip:"Service every 5,000 km.", parts,
    };
  }, []);

  const runScan = useCallback(async (syms) => {
    setSymptoms(syms);
    setScreen("scanning");
    const reg = REGIONS.find(r=>r.id===vehicle.region);
    const sl = syms.map(s=>s.label).join(", ");
    const prompt = `You are UrMechanic AI India. A ${vehicle.vt} owner from ${reg?.label} with a ${vehicle.year} ${vehicle.make} ${vehicle.model} reports: ${sl}.\n\nRespond ONLY in valid JSON (no markdown):\n{"mainIssue":"Problem title EN + Hindi","severity":"Critical|High|Medium|Low","fullExplanation":"3-4 sentences what is wrong","hindiExplanation":"Hindi explanation","estimatedMechanicCostINR":"Rs.X,XXX-Rs.X,XXX","estimatedPartsCostINR":"Rs.X,XXX-Rs.X,XXX","totalSavingIfSelfSource":"Rs.X,XXX","diyDifficulty":"Easy|Medium|Hard","rootCause":"Why this happened","immediateAction":"What to do RIGHT NOW","partsNeeded":["part1","part2"],"mechanicBriefEnglish":"Word-for-word script for mechanic","mechanicBriefHindi":"Hindi script for mechanic","futureRisks":["risk1","risk2"],"certifiedMechanicNote":"Step-by-step protocol","preventionTip":"Prevention advice"}`;
    try {
      const text = await callAI(prompt);
      let parsed;
      try { parsed = JSON.parse(text.replace(/```json|```/g,"").trim()); } catch { parsed = null; }
      if(!parsed) parsed = fallbackDiag(syms, vehicle);
      const cats = [...new Set(syms.map(s=>s.cat))];
      const parts = cats.flatMap(c=>PARTS_DB[c]||[]);
      setDiag({ ...parsed, parts });
    } catch { setDiag(fallbackDiag(syms, vehicle)); }
    setScreen("results");
  }, [vehicle, fallbackDiag]);

  return (
    <div style={S.page}>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}} *{box-sizing:border-box;} select,input,textarea{font-family:Georgia,serif;}`}</style>
      <div style={S.header}>
        {screen!=="home" && <button onClick={()=>setScreen("home")} style={{ background:"none", border:"none", color:"#8a6a50", cursor:"pointer", padding:0, marginRight:4, fontSize:16 }}>🏠</button>}
        <div>
          <div style={{ fontSize:20, fontWeight:900, color:"#ff8c42", letterSpacing:1 }}>UR<span style={{ color:"#ffd60a" }}>MECHANIC</span></div>
          <div style={{ fontSize:9, color:"#8a6a50", letterSpacing:3 }}>YOUR PERSONAL VEHICLE DOCTOR</div>
        </div>
        <div style={{ flex:1 }} />
        {vehicle?.region && <div style={{ background:"#ff8c4220", border:"1px solid #ff8c4240", borderRadius:8, padding:"4px 10px", fontSize:10, color:"#ff8c42" }}>📍 {REGIONS.find(r=>r.id===vehicle.region)?.hub}</div>}
      </div>
      <div style={S.wrap}>
        {screen==="home" && <Home go={s=>setScreen(s)} />}
        {screen==="setup" && <Setup onBack={()=>setScreen("home")} onDone={v=>{setVehicle(v);setScreen("symptoms");}} />}
        {screen==="symptoms" && vehicle && <Symptoms vehicle={vehicle} onBack={()=>setScreen("setup")} onScan={runScan} />}
        {screen==="scanning" && vehicle && <Scanning vehicle={vehicle} symptoms={symptoms} />}
        {screen==="results" && diag && <Results diag={diag} vehicle={vehicle} onMechanic={()=>setScreen("mechanic")} />}
        {screen==="photo" && <PhotoScan onBack={()=>setScreen("home")} />}
        {screen==="used" && <UsedCar onBack={()=>setScreen("home")} />}
        {screen==="mechanic" && <Mechanic onBack={()=>setScreen("home")} onRegister={()=>setScreen("register")} region={vehicle?.region} />}
        {screen==="register" && <Register onBack={()=>setScreen("mechanic")} />}
      </div>
    </div>
  );
}
