// ============================================================
// Chat Expert System — ByteDragon v5
// Original mascot · fire reveal · state cards · expert tabs
// Facts panel · rule trace · what-if · ES report
// ============================================================
import { KNOWLEDGE_BASE, EUR_TO_GBP } from '../data/laptops.js';
import { INFERENCE_RULES } from '../data/rules.js';
import {
  runInferenceEngine, computeConfidence,
  generateMatchBadges, matchQualityLabel,
} from '../utils/recommendationEngine.js';
import { brandColour } from './laptopCard.js';

// ── Inject styles once ────────────────────────────────────────
(function injectStyles() {
  if (document.getElementById('bd-v5-styles')) return;
  const s = document.createElement('style');
  s.id = 'bd-v5-styles';
  s.textContent = `
    /* ── Message animations ── */
    @keyframes chatFadeIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
    .chat-msg-anim{animation:chatFadeIn .22s ease both}
    @keyframes chatDot{0%,80%,100%{transform:translateY(0);opacity:.35}40%{transform:translateY(-5px);opacity:1}}
    .chat-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#94a3b8;animation:chatDot 1.1s infinite}
    .chat-dot:nth-child(2){animation-delay:.18s}
    .chat-dot:nth-child(3){animation-delay:.36s}

    /* ── ByteDragon animations ── */
    #bytedragon{animation:bdBob 2.6s ease-in-out infinite;filter:drop-shadow(0 2px 10px rgba(79,70,229,.55));cursor:default}
    @keyframes bdBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
    #bd-wing-l{transform-origin:16px 40px;animation:bdWL 3s ease-in-out infinite}
    #bd-wing-r{transform-origin:44px 40px;animation:bdWR 3s ease-in-out infinite;animation-delay:.28s}
    @keyframes bdWL{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(6deg)}}
    @keyframes bdWR{0%,100%{transform:rotate(8deg)}50%{transform:rotate(-6deg)}}
    #bd-eye-l,#bd-eye-r{animation:bdEye 2.6s ease-in-out infinite}
    #bd-eye-r{animation-delay:.18s}
    @keyframes bdEye{0%,100%{opacity:1}50%{opacity:.45}}
    #bd-aura-l,#bd-aura-r{animation:bdAura 2.6s ease-in-out infinite}
    #bd-aura-r{animation-delay:.18s}
    @keyframes bdAura{0%,100%{opacity:.22}50%{opacity:.55}}
    #bd-chest{animation:bdChest 1.5s ease-in-out infinite}
    @keyframes bdChest{0%,100%{opacity:.95}50%{opacity:.2}}
    #bd-nostril-l,#bd-nostril-r{animation:bdNos 3s ease-in-out infinite}
    #bd-nostril-r{animation-delay:.5s}
    @keyframes bdNos{0%,100%{opacity:.5}50%{opacity:1}}
    /* Talking */
    #bytedragon.talking{animation:bdBobFast 1s ease-in-out infinite!important}
    @keyframes bdBobFast{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
    #bytedragon.talking #bd-eye-l,
    #bytedragon.talking #bd-eye-r{animation:bdEyeTalk .28s ease-in-out infinite alternate}
    @keyframes bdEyeTalk{from{transform:scaleY(1)}to{transform:scaleY(.4)}}
    #bytedragon.talking #bd-nostril-l,
    #bytedragon.talking #bd-nostril-r{animation:bdNosTalk .25s ease-in-out infinite alternate;opacity:.9}
    @keyframes bdNosTalk{from{r:1.3}to{r:2.3}}
    #bytedragon.talking #bd-wing-l{animation:bdWLF .38s ease-in-out infinite}
    #bytedragon.talking #bd-wing-r{animation:bdWRF .38s ease-in-out infinite}
    @keyframes bdWLF{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(10deg)}}
    @keyframes bdWRF{0%,100%{transform:rotate(14deg)}50%{transform:rotate(-10deg)}}
    #bytedragon.talking #bd-chest{animation:bdChestTalk .28s ease-in-out infinite}
    @keyframes bdChestTalk{0%,100%{opacity:1}50%{opacity:.3}}

    /* ── State card ── */
    .bd-state-card{background:rgba(15,10,40,.85);border:1px solid rgba(99,102,241,.3);border-radius:12px;padding:10px 12px;font-size:10px;line-height:1.6}
    .bd-fact{font-family:monospace;color:#34d399;font-size:10px}
    .bd-rule{color:#a78bfa;font-size:10px}
    .bd-conflict{color:#fbbf24;font-size:10px}

    /* ── Fire Reveal ── */
    #fire-reveal{position:absolute;inset:0;z-index:60;background:radial-gradient(ellipse at 50% 110%,#1a0a00 0%,#060612 60%);display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden}
    .fire-p{position:absolute;bottom:-16px;border-radius:60% 60% 20% 20%/60% 60% 40% 40%;animation:fireUp linear infinite;opacity:0}
    @keyframes fireUp{0%{transform:translateY(0) scale(1);opacity:.85}70%{opacity:.5}100%{transform:translateY(-80vh) scale(0) rotate(20deg);opacity:0}}
    .fire-step{font-family:monospace;font-size:11px;color:#94a3b8;opacity:0;transform:translateX(-10px);transition:opacity .28s ease,transform .28s ease;margin:2px 0}
    .fire-step.show{opacity:1;transform:translateX(0)}
    .fire-step.done{color:#34d399}
    #skip-reveal{position:absolute;top:10px;right:12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:#94a3b8;font-size:11px;padding:4px 10px;border-radius:8px;cursor:pointer;transition:all .15s}
    #skip-reveal:hover{background:rgba(255,255,255,.15);color:#fff}

    /* ── Result tabs ── */
    .rt-tabs{display:flex;border-bottom:1px solid rgba(255,255,255,.07);margin-bottom:0}
    .rt-tab{flex:1;padding:5px 4px;font-size:10px;font-weight:600;text-align:center;cursor:pointer;color:#64748b;border-bottom:2px solid transparent;transition:all .15s;background:none;border-top:none;border-left:none;border-right:none}
    .rt-tab.active{color:#818cf8;border-bottom-color:#6366f1}
    .rt-tab:hover{color:#a5b4fc}
    .rt-panel{padding:10px 12px;font-size:10px;line-height:1.6}
    .rt-panel.hidden{display:none}

    /* ── What-if buttons ── */
    .wi-btn{display:block;width:100%;text-align:left;padding:5px 8px;margin-bottom:4px;border-radius:6px;border:1px solid rgba(99,102,241,.25);background:rgba(99,102,241,.07);color:#a5b4fc;font-size:10px;cursor:pointer;transition:all .15s}
    .wi-btn:hover{background:rgba(99,102,241,.2);border-color:rgba(99,102,241,.5);color:#c7d2fe}
    .wi-result{margin-top:8px;padding:8px;border-radius:8px;background:rgba(34,211,238,.07);border:1px solid rgba(34,211,238,.2)}

    /* ── Command buttons (post-result mode) ── */
    .cmd-btn{display:flex;align-items:center;gap:6px;width:100%;text-align:left;padding:7px 10px;border-radius:8px;border:1px solid rgba(99,102,241,.22);background:rgba(20,12,45,.75);color:#c4b5fd;font-size:10px;cursor:pointer;transition:all .18s;font-family:inherit;line-height:1.4}
    .cmd-btn:hover{background:rgba(99,102,241,.28);border-color:rgba(139,92,246,.55);color:#e0d9ff;transform:translateX(3px)}
    .cmd-btn .cmd-icon{font-size:13px;flex-shrink:0}
    /* ── Trace / chain lines ── */
    .trace-line{font-family:monospace;font-size:9.5px;padding:2px 7px;border-left:2px solid;border-radius:0 4px 4px 0;margin-bottom:1px;line-height:1.5}
    .trace-fire{border-color:#4f46e5;background:rgba(79,70,229,.08);color:#a5b4fc}
    .trace-skip{border-color:#1e293b;background:transparent;color:#475569}
    .trace-init{border-color:#22d3ee;background:rgba(34,211,238,.06);color:#67e8f9}
    .trace-rank{border-color:#34d399;background:rgba(52,211,153,.06);color:#6ee7b7}
    /* ── Backward chaining nodes ── */
    .bc-goal{background:rgba(139,92,246,.14);border:1px solid rgba(139,92,246,.35);padding:5px 10px;border-radius:7px;font-size:10px;margin:3px 0;font-weight:600}
    .bc-sub{background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.22);padding:4px 10px 4px 20px;border-radius:6px;font-size:10px;margin:2px 0}
    .bc-ok{color:#34d399}.bc-fail{color:#f87171}
    /* ── CF bars ── */
    .cf-row{display:flex;align-items:center;gap:6px;font-size:10px;margin-bottom:4px}
    .cf-bar{flex:1;height:5px;background:#1e293b;border-radius:999px;overflow:hidden}
    .cf-fill{height:100%;border-radius:999px}
    /* ── Fuzzy chart ── */
    .fz-set{display:flex;align-items:flex-end;gap:2px;height:36px}
    .fz-bar{border-radius:3px 3px 0 0;min-width:8px;transition:all .3s}
    /* ── ES concept panel ── */
    .es-panel{background:rgba(12,8,35,.8);border:1px solid rgba(99,102,241,.18);border-radius:11px;padding:11px 13px;font-size:10px;margin-top:4px;line-height:1.6}
    .es-badge{display:inline-block;padding:1px 7px;border-radius:999px;font-size:9px;font-weight:700;letter-spacing:.04em}
  `;
  document.head.appendChild(s);
})();

// ── Brand icons ───────────────────────────────────────────────
const BRAND_ICON = {
  Apple:'🍎', Dell:'💻', HP:'💻', Lenovo:'💻', ASUS:'💻',
  Acer:'💻', MSI:'🎮', Razer:'🎮', Microsoft:'🪟',
  Samsung:'📱', LG:'💻', Framework:'🔧',
};

// ── State ─────────────────────────────────────────────────────
let chatAnswers = {
  budget:null, purpose:null, battery:null, portability:null,
  gaming:null, vmUse:null,  ram:null, gpu:null, os:null, premium:null,
  displaySize:null,
  customBudgetEUR:null, customBudgetMinEUR:null, customBudgetMaxEUR:null,
};
let currentStep = 0;
let chatDone    = false;
let lastChatResults = null;   // stored after inference runs

// ── Budget helpers ────────────────────────────────────────────
const BUDGET_MAP = { 'under600':500,'600-900':750,'900-1300':1100,'1300-1800':1550,'1800+':2200 };

function mapBudgetRange(amt) {
  if (amt < 600)   return 'Under €600';
  if (amt <= 900)  return '€600–€900';
  if (amt <= 1300) return '€900–€1,300';
  if (amt <= 1800) return '€1,300–€1,800';
  return '€1,800+';
}

function chatBudgetAdj(laptop, ans) {
  if (!ans.customBudgetEUR) return { bonus:0, warning:null };
  const b = ans.customBudgetEUR, p = laptop.priceEUR;
  if (p <= b)            return { bonus: p/b < .6 ? 5 : 20, warning:null };
  if (p <= b * 1.10)    return { bonus:8,  warning:`${Math.round((p/b-1)*100)}% above your €${b.toLocaleString()} budget` };
  if (p <= b * 1.25)    return { bonus:-15, warning:`Above your €${b.toLocaleString()} budget` };
  return                        { bonus:-40, warning:`Significantly over your €${b.toLocaleString()} budget` };
}

function parseBudget(text) {
  const t = text.toLowerCase().trim();
  const between = t.match(/between\s+([\d,.]+)\s+and\s+([\d,.]+)/);
  if (between) { const a=+between[1].replace(/[,.]/g,''), b=+between[2].replace(/[,.]/g,''); if (a>=100&&b>a) return {type:'range',min:a,max:b,amount:b}; }
  const dash = t.match(/([\d,.]+)\s*[-–]\s*([\d,.]+)/);
  if (dash)    { const a=+dash[1].replace(/[,.]/g,''), b=+dash[2].replace(/[,.]/g,''); if (a>=100&&b>a) return {type:'range',min:a,max:b,amount:b}; }
  const maxM = t.match(/(?:under|below|max(?:imum)?|up\s*to|less\s+than|at\s+most|no\s+more\s+than|budget\s+of)\s*[€$£]?\s*([\d,.]+)/);
  if (maxM) { const a=+maxM[1].replace(/[,.]/g,''); if (a>=100) return {type:'maximum',amount:a}; }
  const num = t.match(/[€$£]?\s*([\d]{3,5})/);
  if (num)  { const a=+num[1]; if (a>=100&&a<=15000) return {type:'exact',amount:a}; }
  if (/cheap|low|tight|afford|broke/.test(t))        return {type:'keyword',amount:500};
  if (/mid(?:dle)?|medium|moderate|average/.test(t)) return {type:'keyword',amount:1100};
  if (/high|premium|expensive|luxury|top/.test(t))   return {type:'keyword',amount:2200};
  return null;
}

function screenInch(l) { const m=(l.specs.display||'').match(/^(\d+(?:\.\d+)?)/); return m?+m[1]:15; }

// ── Facts collector ───────────────────────────────────────────
function getCollectedFacts() {
  const a = chatAnswers, PL = {
    student:'Student & Daily Use', programming:'Programming & Dev',
    gaming:'Gaming', cybersecurity:'Cybersecurity / VMs',
    business:'Business & Office', content:'Video Editing & Design', travel:'Travel',
  };
  const rows = [];
  if (a.purpose)     rows.push({ k:'fact_usage',       v: PL[a.purpose]||a.purpose });
  if (a.customBudgetEUR)
                     rows.push({ k:'fact_budget',      v:`€${a.customBudgetEUR.toLocaleString()} (exact)` });
  else if (a.budget) rows.push({ k:'fact_budget',      v:`~€${Number(a.budget).toLocaleString()} (range)` });
  if (a.battery)     rows.push({ k:'fact_battery',     v:a.battery });
  if (a.portability) rows.push({ k:'fact_portability', v:a.portability });
  if (a.displaySize) rows.push({ k:'fact_screen',      v:a.displaySize });
  if (a.gpu)         rows.push({ k:'fact_gpu',         v:a.gpu });
  if (a.vmUse)       rows.push({ k:'fact_vm_usage',    v:a.vmUse });
  if (a.os&&a.os!=='any') rows.push({ k:'fact_os',    v:a.os });
  if (a.premium)     rows.push({ k:'fact_preference',  v:a.premium });
  if (a.ram)         rows.push({ k:'fact_ram',         v:`${a.ram}GB` });
  return rows;
}

// ── Rule activations per answer ───────────────────────────────
function rulesForAnswer(key, value) {
  const MAP = {
    purpose: {
      gaming:       ['R01 Gaming → GPU Required','R09 Windows Gaming → Exclude macOS'],
      programming:  ['R02 Programming → RAM ≥16GB'],
      content:      ['R04 Content Creation → GPU & OLED'],
      business:     ['R05 Business → Premium Build & Battery'],
      cybersecurity:['R10 VM Use → High RAM (≥16GB)','R02 Programming → RAM ≥16GB'],
      student:      ['R03 Student/Office → Battery & Price'],
    },
    battery:     { yes:['R14 Long Battery Required → battery score ×2'] },
    portability: { travel:['R06 Travel → Lightweight ≤1.5 kg'] },
    gpu:         { yes:['R12 GPU Required → Dedicated Only'], no:['R13 No GPU → Battery Boost'] },
    vmUse:       { yes:['R10 VM Use → High RAM prioritised'] },
    os:          { macos:['R08 macOS Required → Apple Only'], linux:['R18 Linux → ThinkPad/Framework Priority'] },
    premium:     { yes:['R15 Premium Build → Aluminum/Carbon scored'] },
    displaySize: { compact:['Screen size filter: ≤14.5" active'], large:['Screen size filter: ≥15" active'] },
  };
  return MAP[key]?.[value] || [];
}

// ── Conflict detector ─────────────────────────────────────────
function detectConflicts(ans) {
  const c = [];
  if (ans.gpu==='yes'&&ans.customBudgetEUR&&ans.customBudgetEUR<750)
    c.push('Low budget + dedicated GPU — gaming laptops start ~€750');
  if (ans.gaming==='serious'&&ans.portability==='travel')
    c.push('Serious gaming + carry everywhere — gaming laptops avg. 2.5 kg+');
  if (ans.os==='macos'&&ans.customBudgetEUR&&ans.customBudgetEUR<700)
    c.push('macOS + budget under €700 — Apple starts at €699');
  if (ans.vmUse==='yes'&&ans.customBudgetEUR&&ans.customBudgetEUR<700)
    c.push('VM usage + low budget — VMs need 16 GB+ RAM (typically €800+)');
  if (ans.battery==='yes'&&ans.gaming==='serious')
    c.push('Long battery + serious gaming — gaming GPUs avg. 3–5h under load');
  if (ans.gpu==='yes'&&ans.os==='macos')
    c.push('Dedicated GPU + macOS — Apple Silicon has no discrete GPU option');
  return c;
}

// ── ByteDragon reactions per answer ──────────────────────────
const BD_REACTIONS = {
  purpose: {
    programming:  'Nice! 🐉 I\'ve logged <strong>fact_usage = Programming</strong>. Activating CPU & RAM priority rules.',
    gaming:       'Gaming detected! 🐉 Activating <strong>R01 GPU Required</strong> and performance rules.',
    cybersecurity:'Cybersecurity — classic! 🐉 <strong>fact_vm_usage = Yes</strong> pre-set. High RAM rules activated.',
    content:      'Content creation! 🐉 Activating <strong>GPU + OLED display</strong> scoring rules.',
    business:     'Business profile confirmed. 🐉 <strong>Premium build & battery</strong> rules activated.',
    student:      'Student profile set. 🐉 Activating <strong>battery & value</strong> scoring rules.',
    travel:       'Travel & ultraportable! 🐉 <strong>R06 Lightweight ≤1.5 kg</strong> rule now active.',
  },
};

// ── CHAT QUESTIONS ────────────────────────────────────────────
const CHAT_QUESTIONS = [
  // 1. PURPOSE
  {
    key:'purpose',
    text:`<strong>What\'s your main use case?</strong><br><span class='text-slate-400 text-xs'>Type freely or pick — e.g. <em>programming</em>, <em>I use Kali and VMs</em>, <em>gaming</em></span>`,
    replies:[
      {label:'🎓 Student & Daily Use',       value:'student'},
      {label:'💻 Programming & Development', value:'programming'},
      {label:'🎮 Gaming',                    value:'gaming'},
      {label:'🔐 Cybersecurity / VMs',       value:'cybersecurity'},
      {label:'💼 Business & Office',         value:'business'},
      {label:'🎨 Video Editing & Design',    value:'content'},
      {label:'✈️ Travel & Ultraportable',    value:'travel'},
    ],
    parse(t){
      const tx=t.toLowerCase();
      if(/gaming|game[rs]?|fps|aaa|esport|steam|rtx|nvidia|fortnite|valorant/.test(tx))                                                       return 'gaming';
      if(/cyber|security|hacking|hack|kali|penetrat|pen.?test|ethical|nmap|vm[s]?\b|virtual\s*machine/.test(tx))                             return 'cybersecurity';
      if(/cod(ing|e[rs]?)|programm|software|develop|python|javascript|java\b|react|backend|frontend|full.?stack|cs\b|web\s*dev|docker/.test(tx)) return 'programming';
      if(/student|school|university|college|study|homework|class|lecture|note|basic|browse|daily|general/.test(tx))                           return 'student';
      if(/business|office|work|corporate|excel|powerpoint|word\b|meeting|email|presentation/.test(tx))                                        return 'business';
      if(/video|edit(ing)?|design|creator|photo|premiere|blender|photoshop|after.?effect|davinci|illustrator/.test(tx))                       return 'content';
      if(/travel|light(weight)?|portable|commut|ultrabook|backpack|flight|thin|slim|carry/.test(tx))                                          return 'travel';
      return null;
    },
    apply(val){
      const L={student:'Student & Daily Use',programming:'Programming & Development',gaming:'Gaming',
               cybersecurity:'Cybersecurity / VMs',business:'Business & Office',content:'Video Editing & Design',travel:'Travel & Ultraportable'};
      switch(val){
        case 'gaming':       chatAnswers.purpose='gaming';      chatAnswers.gaming='serious'; chatAnswers.gpu='yes'; break;
        case 'cybersecurity':chatAnswers.purpose='programming'; chatAnswers.vmUse='yes'; chatAnswers.ram='32'; chatAnswers.gaming='no'; break;
        case 'content':      chatAnswers.purpose='content';     chatAnswers.gpu='yes'; break;
        case 'travel':       chatAnswers.purpose='student';     chatAnswers.portability='travel'; break;
        default:             chatAnswers.purpose=val;
      }
      return BD_REACTIONS.purpose[val] || `Got it! 🐉 Main usage set to <strong>${L[val]||val}</strong>.`;
    },
    displayValue(v){return {student:'Student & Daily Use',programming:'Programming & Development',gaming:'Gaming',
      cybersecurity:'Cybersecurity / VMs',business:'Business & Office',content:'Video Editing & Design',travel:'Travel & Ultraportable'}[v]||v;},
  },

  // 2. BUDGET
  {
    key:'budget',
    text:`<strong>What\'s your budget?</strong><br><span class='text-slate-400 text-xs'>Choose a range or type — e.g. <em>733</em>, <em>max 1200</em>, <em>600–900</em></span>`,
    dynamicText(a){
      const hint={gaming:`<br><span class='text-amber-400/80 text-xs'>💡 Gaming laptops typically start ~€700–800 for decent GPU.</span>`,
                  cybersecurity:`<br><span class='text-amber-400/80 text-xs'>💡 For VMs & pen-testing, €800+ gives RAM headroom.</span>`,
                  content:`<br><span class='text-amber-400/80 text-xs'>💡 Video editing benefits from €900+ with dedicated GPU.</span>`}[a.purpose]||'';
      return `<strong>What\'s your budget?</strong>${hint}<br><span class='text-slate-400 text-xs'>Choose a range or type freely — e.g. <em>733</em>, <em>max 1200</em></span>`;
    },
    replies:[
      {label:'💚 Under €600',      value:'under600'},
      {label:'💛 €600 – €900',     value:'600-900'},
      {label:'🔵 €900 – €1,300',   value:'900-1300'},
      {label:'🟣 €1,300 – €1,800', value:'1300-1800'},
      {label:'⭐ €1,800+',          value:'1800+'},
    ],
    parse:parseBudget,
    apply(val){
      if(typeof val==='string'){
        chatAnswers.budget=BUDGET_MAP[val]||1100;
        chatAnswers.customBudgetEUR=chatAnswers.customBudgetMinEUR=chatAnswers.customBudgetMaxEUR=null;
        return null;
      }
      const {type,amount,min,max}=val;
      chatAnswers.customBudgetEUR=amount; chatAnswers.budget=amount;
      if(type==='range'){chatAnswers.customBudgetMinEUR=min; chatAnswers.customBudgetMaxEUR=max;}
      const rng=mapBudgetRange(amount);
      if(type==='range')   return `Got it! 🐉 Budget range <strong>€${min.toLocaleString()}–€${max.toLocaleString()}</strong> saved as <strong>fact_budget</strong> (tier: ${rng}).`;
      if(type==='maximum') return `Got it! 🐉 Maximum budget <strong>€${amount.toLocaleString()}</strong> saved as <strong>fact_budget</strong> (tier: ${rng}).`;
      if(type==='keyword') return `Got it! 🐉 Budget set to approximately <strong>€${amount.toLocaleString()}</strong>.`;
      return `Got it! 🐉 Exact budget <strong>€${amount.toLocaleString()}</strong> saved as <strong>fact_budget</strong>. Price-proximity scoring activated.`;
    },
    displayValue(v){
      if(typeof v==='string') return {'under600':'Under €600','600-900':'€600–€900','900-1300':'€900–€1,300','1300-1800':'€1,300–€1,800','1800+':'€1,800+'}[v]||v;
      const {type,amount,min,max}=v;
      if(type==='range') return `€${min.toLocaleString()}–€${max.toLocaleString()}`;
      if(type==='maximum') return `Max €${amount.toLocaleString()}`;
      return `€${amount.toLocaleString()}`;
    },
  },

  // 3. BATTERY
  {
    key:'battery',
    text:`<strong>How important is battery life?</strong>`,
    dynamicText(a){
      if(a.portability==='travel') return `Since you\'ll carry it everywhere — <strong>how important is battery life?</strong>`;
      if(a.purpose==='gaming')     return `Gaming drains fast — <strong>how important is battery to you?</strong>`;
      return `<strong>How important is battery life?</strong>`;
    },
    replies:[
      {label:'⚡ Very important — 8h+',value:'yes'},
      {label:'😐 Somewhat important',  value:'moderate'},
      {label:'🔌 Not a priority',      value:'no'},
    ],
    parse(t){
      const tx=t.toLowerCase();
      if(/very|yes\b|important|long.?batt|all.?day|8h|10h|12h|always|critical|must/.test(tx)) return 'yes';
      if(/some|moderate|middle|ok\b|average|normal|medium|5h|6h|enough/.test(tx))             return 'moderate';
      if(/no\b|not|don.?t|outlet|plug|desk|charge|doesn.?t\s+matter/.test(tx))               return 'no';
      if(/\bbattery\b/.test(tx)) return 'yes';
      return null;
    },
    apply(v){
      chatAnswers.battery=v;
      const L={yes:'Very important (8h+)',moderate:'Somewhat important',no:'Not a priority'};
      return `Got it! 🐉 <strong>fact_battery = ${v}</strong> saved.${v==='yes'?' Activating R14 battery scoring rule.':''}`;
    },
    displayValue(v){{return {yes:'Very important',moderate:'Somewhat important',no:'Not a priority'}[v]||v;}},
  },

  // 4. PORTABILITY
  {
    key:'portability',
    text:`<strong>How portable does it need to be?</strong>`,
    dynamicText(a){
      if(a.purpose==='gaming') return `Gaming laptops can be heavy — <strong>how important is portability?</strong>`;
      return `<strong>How portable does it need to be?</strong>`;
    },
    replies:[
      {label:'🏃 Carry it everywhere', value:'travel'},
      {label:'⚖️ Sometimes travel',    value:'balanced'},
      {label:'🖥️ Mostly at my desk',   value:'desk'},
    ],
    parse(t){
      const tx=t.toLowerCase();
      if(/every|always|travel|commut|light(weight)?|ultrabook|carry|backpack|flight|portable|thin|slim|on.*go/.test(tx)) return 'travel';
      if(/sometimes?|occasional|balanced|mixed|both|bit/.test(tx))                                                       return 'balanced';
      if(/desk|home|mostly|stay|stationary|heavy.*ok|don.?t.*travel|rarely|fixed/.test(tx))                              return 'desk';
      if(/\blight\b|\bportable\b/.test(tx)) return 'travel';
      if(/\bdesk\b/.test(tx)) return 'desk';
      return null;
    },
    apply(v){
      if(!chatAnswers.portability) chatAnswers.portability=v;
      const L={travel:'Carry everywhere',balanced:'Sometimes travel',desk:'Mostly at desk'};
      return `Got it! 🐉 <strong>fact_portability = ${v}</strong> saved.${v==='travel'?' Activating R06 lightweight rule (≤1.5 kg).':''}`;
    },
    shouldSkip(){return chatAnswers.portability!==null;},
    displayValue(v){return {travel:'Carry everywhere',balanced:'Sometimes travel',desk:'Mostly at desk'}[v]||v;},
  },

  // 5. DISPLAY SIZE
  {
    key:'displaySize',
    text:`<strong>What screen size do you prefer?</strong>`,
    dynamicText(a){
      const hint={travel:`<br><span class='text-cyan-400/70 text-xs'>💡 Compact 13–14" pairs well with portability.</span>`,
                  gaming:`<br><span class='text-cyan-400/70 text-xs'>💡 Most gaming laptops are 15–16" for better immersion.</span>`}[a.portability||a.purpose]||'';
      return `<strong>What screen size do you prefer?</strong>${hint}`;
    },
    replies:[
      {label:'💼 Compact — up to 14"',   value:'compact'},
      {label:'🖥️ Large — 15" and above', value:'large'},
      {label:'🤷 No preference',          value:'any'},
    ],
    parse(t){
      const tx=t.toLowerCase();
      if(/no\s*prefer|any|doesn.?t\s*matter|either|both/.test(tx))               return 'any';
      if(/\b13\b|\b14\b|compact|small|portab|ultrabook|light|thin/.test(tx))    return 'compact';
      if(/\b15\b|\b16\b|\b17\b|large|big|wide|desktop|immersive/.test(tx))      return 'large';
      return null;
    },
    apply(v){
      chatAnswers.displaySize=v;
      const L={compact:'Compact (≤14")',large:'Large (≥15")',any:'No preference'};
      return v==='any'?null:`Got it! 🐉 <strong>fact_screen = ${v}</strong> saved. Screen size filter activated.`;
    },
    displayValue(v){return {compact:'Compact (up to 14")',large:'Large (15"+)',any:'No preference'}[v]||v;},
  },

  // 6. GPU
  {
    key:'gpu',
    text:`<strong>Do you need a dedicated GPU?</strong>`,
    dynamicText(a){
      if(a.purpose==='gaming')      return `You're into gaming — <strong>how powerful should the GPU be?</strong>`;
      if(a.purpose==='content')     return `For video editing — <strong>do you need a dedicated GPU?</strong><br><span class='text-slate-400 text-xs'>GPU accelerates rendering in Premiere, DaVinci, Blender.</span>`;
      if(a.purpose==='programming') return `For development — <strong>do you need a GPU?</strong><br><span class='text-slate-400 text-xs'>Useful for ML/AI training or CUDA work.</span>`;
      return `<strong>Do you need a dedicated GPU / graphics card?</strong>`;
    },
    replies:[
      {label:'🚀 Yes — for gaming or design',value:'yes'},
      {label:'🔶 Sometimes / nice to have',  value:'any'},
      {label:'🪫 No — integrated is fine',   value:'no'},
    ],
    parse(t){
      const tx=t.toLowerCase();
      if(/\bno\b|\bnot\b|\bdon.?t\b|\bwithout\b|\bintegrat|\bbuilt.in/.test(tx)) return 'no';
      if(/some|maybe|nice|sometime|occasional|casual|light\s*gaming/.test(tx))   return 'any';
      if(/yes\b|need|require|gaming|design|render|cuda|rtx|gtx|radeon|nvidia|dedicated|graphic|3d|ml\b|machine\s*learn/.test(tx)) return 'yes';
      return null;
    },
    apply(v){
      if(!chatAnswers.gpu){
        chatAnswers.gpu=v;
        if(v==='yes'&&!chatAnswers.gaming) chatAnswers.gaming='serious';
        if(v==='no' &&!chatAnswers.gaming) chatAnswers.gaming='no';
        if(v==='any'&&!chatAnswers.gaming) chatAnswers.gaming='casual';
      }
      const L={yes:'Yes — dedicated GPU required',any:'Sometimes / nice to have',no:'No — integrated is fine'};
      return `Got it! 🐉 <strong>fact_gpu = ${v}</strong>.${v==='yes'?' Activating R12 GPU scoring rule.':v==='no'?' Activating R13 battery-boost rule.':''}`;
    },
    shouldSkip(){return chatAnswers.gpu!==null;},
    displayValue(v){return {yes:'Yes — dedicated GPU',any:'Sometimes / nice to have',no:'No — integrated is fine'}[v]||v;},
  },

  // 7. VM
  {
    key:'vmUse',
    text:`<strong>Do you use virtual machines or heavy software?</strong><br><span class='text-slate-400 text-xs'>e.g. Docker, VMs, Kali Linux, heavy IDEs</span>`,
    dynamicText(a){
      if(a.purpose==='cybersecurity') return `Since you\'re into cybersecurity — <strong>how heavily do you run VMs and pen-testing tools?</strong>`;
      if(a.purpose==='programming')   return `As a developer — <strong>do you run Docker, VMs, or heavy IDEs?</strong>`;
      return `<strong>Do you use virtual machines or heavy software?</strong><br><span class='text-slate-400 text-xs'>e.g. Docker, VMs, Kali Linux, heavy IDEs</span>`;
    },
    replies:[
      {label:'✅ Yes — regularly',value:'yes'},
      {label:'🔸 Sometimes',      value:'sometimes'},
      {label:'❌ No',             value:'no'},
    ],
    parse(t){
      const tx=t.toLowerCase();
      if(/yes\b|vm[s]?\b|virtual\s*machine|docker|kali|container|heavy|regularly|always|pentesting|cybersec/.test(tx)) return 'yes';
      if(/some|sometime|occasional|rarely|once\s*in/.test(tx))                                                         return 'sometimes';
      if(/no\b|not|don.?t|never|nope/.test(tx))                                                                        return 'no';
      return null;
    },
    apply(v){
      if(!chatAnswers.vmUse){
        chatAnswers.vmUse=v;
        if(v==='yes'      &&!chatAnswers.ram) chatAnswers.ram='32';
        if(v==='sometimes'&&!chatAnswers.ram) chatAnswers.ram='16';
        if(v==='no'       &&!chatAnswers.ram) chatAnswers.ram='8';
      }
      const L={yes:'Yes, regularly',sometimes:'Sometimes',no:'No'};
      return `Got it! 🐉 <strong>fact_vm_usage = ${v}</strong> saved.${v==='yes'?' Activating R10 — high RAM (≥32 GB) prioritised.':''}`;
    },
    shouldSkip(){return chatAnswers.vmUse!==null;},
    displayValue(v){return {yes:'Yes, regularly',sometimes:'Sometimes',no:'No'}[v]||v;},
  },

  // 8. OS
  {
    key:'os',
    text:`<strong>Which operating system do you prefer?</strong>`,
    dynamicText(a){
      if(a.purpose==='gaming') return `Most games require Windows — <strong>are you OK with Windows, or open to others?</strong>`;
      if(a.customBudgetEUR&&a.customBudgetEUR<700) return `At €${a.customBudgetEUR.toLocaleString()}, macOS options are limited — <strong>which OS do you prefer?</strong>`;
      return `<strong>Which operating system do you prefer?</strong>`;
    },
    replies:[
      {label:'🪟 Windows',       value:'windows'},
      {label:'🍎 macOS (Apple)', value:'macos'},
      {label:'🤷 No preference', value:'any'},
    ],
    parse(t){
      const tx=t.toLowerCase();
      if(/no\s*prefer|doesn.?t\s*matter|does\s*not\s*matter|not\s*matter|don.?t\s*care|both|whatever|either\s*(?:is\s*)?(?:fine|ok)|any\s*(?:os|system)/.test(tx)) return 'any';
      if(/(?:cheap|budget|afford|low.?cost)\s*(?:mac(?:book)?|apple)/.test(tx)||/(?:mac(?:book)?|apple)\s*(?:cheap|budget|afford)/.test(tx)) return 'macos_budget';
      if(/mac(?:os|book)?|apple|osx/.test(tx))           return 'macos';
      if(/windows|win\b|microsoft|gaming\s*laptop/.test(tx)) return 'windows';
      if(/linux|ubuntu|debian|fedora|arch\b/.test(tx))   return 'linux';
      if(/\bany\b|\beither\b/.test(tx))                  return 'any';
      return null;
    },
    apply(v){
      if(v==='macos_budget'){
        chatAnswers.os='macos';
        if(!chatAnswers.customBudgetEUR&&chatAnswers.budget>1100) chatAnswers.budget=1100;
        return `Got it! 🐉 I'll prioritise <strong>affordable Apple / macOS</strong> options. Activating R08.`;
      }
      chatAnswers.os=v;
      const L={windows:'Windows',macos:'macOS (Apple)',linux:'Linux',any:'No preference'};
      return v==='any'?null:`Got it! 🐉 <strong>fact_os = ${v}</strong> saved.${v==='macos'?' Activating R08 macOS rule.':v==='linux'?' Activating R18 Linux compatibility rule.':''}`;
    },
    displayValue(v){return {windows:'Windows',macos:'macOS',linux:'Linux',any:'No preference',macos_budget:'Affordable macOS'}[v]||v;},
  },

  // 9. PREMIUM
  {
    key:'premium',
    text:`<strong>Last question — what matters more?</strong>`,
    dynamicText(a){
      const b=a.customBudgetEUR?` at €${a.customBudgetEUR.toLocaleString()}`:'';
      return `<strong>Almost done!${b}</strong> What matters more to you?`;
    },
    replies:[
      {label:'💎 Premium build quality',value:'yes'},
      {label:'💰 Best value for money', value:'no'},
      {label:'⚖️ Balanced',             value:'balanced'},
    ],
    parse(t){
      const tx=t.toLowerCase();
      if(/premium|high.?quality|best\s*build|aluminum|metal|luxury|flagship|durability/.test(tx)) return 'yes';
      if(/value|best\s*value|cheap|afford|money|budget|bang.*buck|cost.?effect|price.*perform/.test(tx)) return 'no';
      if(/balanced|both|mix|middle|moderate|normal|average/.test(tx))                             return 'balanced';
      return null;
    },
    apply(v){
      chatAnswers.premium=v==='yes'?'yes':'no';
      const L={yes:'Premium build quality',no:'Best value for money',balanced:'Balanced'};
      return `Got it! 🐉 <strong>fact_preference = ${v}</strong>.${v==='yes'?' Activating R15 premium build rule.':v==='no'?' Value-for-money scoring boosted.':''}`;
    },
    displayValue(v){return {yes:'Premium build',no:'Best value',balanced:'Balanced'}[v]||v;},
  },
];

const QUESTION_HINTS = {
  purpose:     `I didn't catch that. Try <strong>programming</strong>, <strong>gaming</strong>, <strong>I use Kali and VMs</strong>, or pick a button. 🐉`,
  budget:      `I couldn't detect a budget. Type a number like <strong>733</strong>, <strong>max 1200</strong>, <strong>600–900</strong>, or pick a range. 🐉`,
  battery:     `Try <strong>very important</strong>, <strong>somewhat</strong>, or <strong>not a priority</strong>. 🐉`,
  portability: `Try <strong>lightweight</strong>, <strong>sometimes travel</strong>, or <strong>mostly at desk</strong>. 🐉`,
  displaySize: `Try <strong>compact</strong> (≤14"), <strong>large</strong> (≥15"), or <strong>no preference</strong>. 🐉`,
  gpu:         `Try <strong>yes, I need a GPU</strong>, <strong>no, integrated is fine</strong>, or <strong>sometimes</strong>. 🐉`,
  vmUse:       `Try <strong>yes, I use Docker/VMs</strong>, <strong>sometimes</strong>, or <strong>no</strong>. 🐉`,
  os:          `Try <strong>Windows</strong>, <strong>macOS</strong>, <strong>cheap MacBook</strong>, or <strong>no preference</strong>. 🐉`,
  premium:     `Try <strong>premium build</strong>, <strong>best value</strong>, or <strong>balanced</strong>. 🐉`,
};

// ── Recommendation engine ─────────────────────────────────────
function getChatRecs() {
  const ans = { ...chatAnswers };
  const score = (l) => {
    const {score:base, activatedRules} = runInferenceEngine(l, ans);
    const confidence = computeConfidence(l, ans, activatedRules);
    const {badges, warnings} = generateMatchBadges(l, ans);
    const adj = chatBudgetAdj(l, ans);
    return { ...l, matchScore:base+adj.bonus, confidence, activatedRules, badges,
      warnings: adj.warning ? [...warnings, adj.warning] : warnings };
  };
  const osOk = (l) => {
    if(!ans.os||ans.os==='any') return true;
    if(ans.os==='linux')   return l.specs.os!=='macos';
    if(ans.os==='macos')   return l.specs.os==='macos';
    if(ans.os==='windows') return l.specs.os!=='macos';
    return true;
  };
  const sizeOk = (l) => {
    if(!ans.displaySize||ans.displaySize==='any') return true;
    const s = screenInch(l);
    if(ans.displaySize==='compact') return s<=14.5;
    if(ans.displaySize==='large')   return s>=14.9;
    return true;
  };
  const ramReq = Math.min(+ans.ram||8, 32);
  const bgt    = ans.budget||1100;
  const t1 = KNOWLEDGE_BASE
    .filter(l=>osOk(l)&&sizeOk(l)&&(ans.gpu!=='yes'||l.hasGpu)&&l.specs.ram>=ramReq&&l.priceEUR<=bgt*1.25)
    .map(score).sort((a,b)=>b.matchScore-a.matchScore).slice(0,9);
  if(t1.length>=3) return {laptops:t1, tier:1, relaxed:[]};
  const rx=[];
  if(ans.gpu==='yes') rx.push('GPU requirement');
  const rr=Math.max(8,ramReq-8); if(rr<ramReq) rx.push('RAM minimum');
  rx.push('budget (+50%)');
  const t2=KNOWLEDGE_BASE.filter(l=>osOk(l)&&l.specs.ram>=rr&&l.priceEUR<=bgt*1.5)
    .map(score).sort((a,b)=>b.matchScore-a.matchScore).slice(0,9);
  if(t2.length>=3) return {laptops:t2, tier:2, relaxed:rx};
  rx.push('OS preference','screen size','budget limit');
  const t3=KNOWLEDGE_BASE.map(score).sort((a,b)=>b.matchScore-a.matchScore).slice(0,9);
  return {laptops:t3, tier:3, relaxed:rx};
}

// ── DOM helpers ───────────────────────────────────────────────
function el(id){return document.getElementById(id);}
function scrollToBottom(){const m=el('chat-messages');if(m)m.scrollTop=m.scrollHeight;}

function appendMessage(html, type='bot'){
  const w=document.createElement('div');
  w.className=(type==='bot'?'flex gap-2.5 items-start':'flex gap-2.5 items-start justify-end')+' chat-msg-anim';
  if(type==='bot'){
    w.innerHTML=`<div class="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs shrink-0 mt-0.5">🐉</div>
      <div class="max-w-[85%] bg-slate-800/80 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-200 leading-relaxed">${html}</div>`;
  } else {
    w.innerHTML=`<div class="max-w-[75%] bg-violet-600/80 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white">${html}</div>
      <div class="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs shrink-0 mt-0.5">👤</div>`;
  }
  el('chat-messages').appendChild(w);
  scrollToBottom();
}

// ── State card (after each answer) ───────────────────────────
function showStateCard(key, value) {
  const facts   = getCollectedFacts();
  const rules   = rulesForAnswer(key, value);
  const conflicts = detectConflicts(chatAnswers);
  const factsHtml = facts.slice(-4).map(f=>
    `<div class="bd-fact">✓ ${f.k} = <span class="text-white">${f.v}</span></div>`
  ).join('');
  const rulesHtml = rules.map(r=>
    `<div class="bd-rule">⚡ ${r}</div>`
  ).join('');
  const conflictsHtml = conflicts.map(c=>
    `<div class="bd-conflict">⚠ ${c}</div>`
  ).join('');
  if(!factsHtml&&!rulesHtml&&!conflictsHtml) return;
  const w=document.createElement('div');
  w.className='flex gap-2.5 items-start chat-msg-anim ml-9';
  w.innerHTML=`<div class="w-full bd-state-card">
    ${factsHtml?`<div class="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Facts collected</div>${factsHtml}`:''}
    ${rulesHtml?`<div class="text-[9px] text-slate-500 uppercase tracking-widest mt-1.5 mb-1">Rules activated</div>${rulesHtml}`:''}
    ${conflictsHtml?`<div class="text-[9px] text-amber-500 uppercase tracking-widest mt-1.5 mb-1">⚠ Conflicts detected</div>${conflictsHtml}`:''}
  </div>`;
  el('chat-messages').appendChild(w);
  scrollToBottom();
}

// ── Typing indicator ──────────────────────────────────────────
function showTyping(){
  const bd=el('bytedragon'); if(bd) bd.classList.add('talking');
  if(el('chat-typing')) return;
  const w=document.createElement('div');
  w.id='chat-typing'; w.className='flex gap-2.5 items-start chat-msg-anim';
  w.innerHTML=`<div class="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs shrink-0 mt-0.5">🐉</div>
    <div class="bg-slate-800/80 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
      <span class="chat-dot"></span><span class="chat-dot"></span><span class="chat-dot"></span>
    </div>`;
  el('chat-messages').appendChild(w); scrollToBottom();
}
function hideTyping(){
  const bd=el('bytedragon'); if(bd) bd.classList.remove('talking');
  const t=el('chat-typing'); if(t) t.remove();
}

// ── Progress ──────────────────────────────────────────────────
const TOTAL_Q = CHAT_QUESTIONS.length;
function updateProgress(idx){
  const pct=Math.round(idx/TOTAL_Q*100);
  const f=el('chat-progress-fill'); if(f) f.style.width=pct+'%';
  const s=el('chat-status-text');   if(!s) return;
  s.textContent = idx>=TOTAL_Q
    ? '✅ Analysis complete — results ready'
    : `Question ${idx+1} of ${TOTAL_Q} · Rule-based AI · 18 inference rules`;
}

// ── Quick replies ─────────────────────────────────────────────
function setReplies(arr){
  const c=el('chat-quick-replies'); if(!c) return;
  c.innerHTML=arr.map(r=>
    `<button onclick="chatQuickReply('${r.value}')" class="chat-qr-btn px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-700/80 hover:bg-violet-600 border border-white/10 hover:border-violet-500 text-slate-200 hover:text-white transition-all">${r.label}</button>`
  ).join('');
}
function clearReplies(){const c=el('chat-quick-replies');if(c)c.innerHTML='';}

// ── Question text ─────────────────────────────────────────────
function qText(q){return q.dynamicText?q.dynamicText(chatAnswers):q.text;}

// ── Step advance ──────────────────────────────────────────────
function advanceStep(idx){
  if(idx>=CHAT_QUESTIONS.length){showChatResults();return;}
  const q=CHAT_QUESTIONS[idx];
  if(q.shouldSkip&&q.shouldSkip()){advanceStep(idx+1);return;}
  currentStep=idx; updateProgress(idx);
  appendMessage(qText(q),'bot');
  setReplies(q.replies);
  const inp=el('chat-input');
  if(inp){inp.placeholder='Type your answer or pick a button…';inp.focus();}
}

// ── Handle answer ─────────────────────────────────────────────
function handleAnswer(value, displayText){
  const q=CHAT_QUESTIONS[currentStep];
  appendMessage(escHtml(displayText||String(value)),'user');
  clearReplies();
  const confirm=q.apply(value);
  const key=q.key;
  currentStep++;
  if(confirm){
    showTyping();
    setTimeout(()=>{
      hideTyping();
      appendMessage(confirm,'bot');
      showStateCard(key, typeof value==='string'?value:(value.type||''));
      showTyping();
      setTimeout(()=>{hideTyping();advanceStep(currentStep);},620);
    },380);
  } else {
    showStateCard(key, typeof value==='string'?value:'');
    showTyping();
    setTimeout(()=>{hideTyping();advanceStep(currentStep);},500);
  }
}

function escHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

// ── Free-text parser ──────────────────────────────────────────
function parseInput(text){
  if(!text.trim()||chatDone) return;
  const q=CHAT_QUESTIONS[currentStep]; if(!q) return;
  const parsed=q.parse(text.trim());
  if(parsed!==null){
    handleAnswer(parsed, q.displayValue?q.displayValue(parsed):String(parsed));
  } else {
    const hint=QUESTION_HINTS[q.key]||`I didn't quite catch that. Please rephrase or pick an option. 🐉`;
    showTyping();
    setTimeout(()=>{hideTyping();appendMessage(hint,'bot');setReplies(q.replies);},320);
  }
}

// ── Working Memory summary ────────────────────────────────────
function showWorkingMemory(){
  const a=chatAnswers;
  const rows=getCollectedFacts();
  const html=rows.map(r=>
    `<div class="flex items-center gap-2 bg-slate-700/40 rounded-lg px-2.5 py-1.5">
      <span class="text-[10px] font-mono text-emerald-400 shrink-0">${r.k}</span>
      <span class="text-[10px] text-white font-semibold truncate">= ${r.v}</span>
    </div>`
  ).join('');
  appendMessage(`
    <p class="font-bold text-violet-300 mb-1 flex items-center gap-1.5">🧠 <span>Working Memory</span>
      <span class="text-[10px] font-normal text-slate-500">${rows.length} facts collected</span>
    </p>
    <div class="grid grid-cols-2 gap-1.5">${html}</div>
    <div class="mt-2 flex items-center gap-1.5">
      <span class="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse shrink-0"></span>
      <span class="text-[10px] text-slate-500">Forwarding to inference engine…</span>
    </div>
  `,'bot');
}

// ── Fire Reveal Animation ─────────────────────────────────────
function showFireReveal(onComplete){
  const modal=el('chat-messages').closest('.relative');
  if(!modal){onComplete();return;}

  const overlay=document.createElement('div');
  overlay.id='fire-reveal';

  // Fire particles (orange + cyan for digital effect)
  const particleColors=['#f97316','#fb923c','#fbbf24','#22d3ee','#f59e0b','#38bdf8','#f97316','#ea580c'];
  let particles='';
  for(let i=0;i<38;i++){
    const left=Math.random()*100;
    const size=4+Math.random()*12;
    const dur=1.2+Math.random()*2.2;
    const delay=Math.random()*2.4;
    const col=particleColors[Math.floor(Math.random()*particleColors.length)];
    particles+=`<div class="fire-p" style="left:${left}%;width:${size}px;height:${size*1.6}px;background:${col};animation-duration:${dur}s;animation-delay:${delay}s;box-shadow:0 0 ${size}px ${col}77"></div>`;
  }

  const steps=[
    '✓ User facts collected','✓ Knowledge base loaded',
    '✓ Inference engine activated','⚡ Applying 18 IF-THEN rules…',
    '⚡ Calculating confidence scores…','⚡ Ranking recommendations…',
    '✅ Top matches identified',
  ];

  overlay.innerHTML=`
    ${particles}
    <button id="skip-reveal" onclick="skipFireReveal()">Skip animation →</button>
    <div style="position:relative;z-index:2;text-align:center;padding:0 20px">
      <div style="font-size:52px;margin-bottom:12px;filter:drop-shadow(0 0 20px #f97316);animation:bdBob 1.5s ease-in-out infinite">🐉</div>
      <div style="font-family:monospace;font-size:13px;font-weight:700;color:#818cf8;letter-spacing:.12em;margin-bottom:4px">BYTEDRAGON</div>
      <div style="font-size:10px;color:#475569;margin-bottom:20px">Expert System · Knowledge Base Analysis</div>
      <div id="fire-steps" style="text-align:left;display:inline-block">
        ${steps.map((s,i)=>`<div class="fire-step" id="fstep-${i}">${s}</div>`).join('')}
      </div>
    </div>`;

  modal.appendChild(overlay);

  // Expose skip function globally (temporarily)
  window.skipFireReveal=()=>{
    overlay.remove();
    delete window.skipFireReveal;
    onComplete();
  };

  // Animate steps
  let si=0;
  const stepInterval=setInterval(()=>{
    const stepEl=el(`fstep-${si}`);
    if(stepEl){stepEl.classList.add('show'); if(si>1) stepEl.classList.add('done');}
    si++;
    if(si>=steps.length){
      clearInterval(stepInterval);
      setTimeout(()=>{
        overlay.style.opacity='0'; overlay.style.transition='opacity .7s ease';
        setTimeout(()=>{overlay.remove();delete window.skipFireReveal;onComplete();},700);
      },700);
    }
  },380);
}

// ── Forward-chaining animation ────────────────────────────────
function animateForwardChain(onComplete){
  const ans=chatAnswers;
  const w=document.createElement('div');
  w.className='flex gap-2.5 items-start chat-msg-anim';
  w.innerHTML=`
    <div class="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs shrink-0 mt-0.5">🐉</div>
    <div class="max-w-[85%] bg-slate-800/80 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
      <p class="font-bold text-violet-300 text-xs mb-2 flex items-center gap-1.5">⚡ Forward Chaining — 18 rules</p>
      <div id="fc-list" class="space-y-0.5 font-mono text-[10px] mb-2"></div>
      <p id="fc-status" class="text-[10px] text-slate-500 border-t border-white/5 pt-1.5 mt-1">Initialising…</p>
    </div>`;
  el('chat-messages').appendChild(w); scrollToBottom();

  const list=el('fc-list'), status=el('fc-status');
  let i=0;
  const tick=()=>{
    if(i>=INFERENCE_RULES.length){
      const fired=INFERENCE_RULES.filter(r=>r.condition(ans)).length;
      status.innerHTML=`<span class="text-cyan-400 font-semibold">🔀 Conflict resolution</span> — <strong>${fired}</strong> rules fired · ranking all candidates…`;
      scrollToBottom();
      setTimeout(onComplete,820);
      return;
    }
    const rule=INFERENCE_RULES[i];
    const fired=rule.condition(ans);
    const d=document.createElement('div');
    d.className=`flex items-center gap-1.5 ${fired?'text-emerald-400':'text-slate-600'}`;
    d.innerHTML=`<span class="shrink-0 font-bold w-3 text-center">${fired?'✓':'○'}</span>
      <span class="text-violet-400/80 shrink-0">[${rule.id}]</span>
      <span class="truncate">${rule.name}</span>
      ${fired?`<span class="ml-auto shrink-0 font-bold text-emerald-500 text-[9px]">FIRED</span>`:''}`;
    list.appendChild(d);
    i++; status.textContent=`Checking rule ${i} of ${INFERENCE_RULES.length}…`;
    scrollToBottom();
    setTimeout(tick,72);
  };
  setTimeout(tick,280);
}

// ── Show results flow ─────────────────────────────────────────
function showChatResults(){
  chatDone=true; clearReplies();
  const inp=el('chat-input'), btn=el('chat-send-btn');
  if(inp){inp.disabled=true;} if(btn){btn.disabled=true;}
  updateProgress(TOTAL_Q);
  showTyping();
  setTimeout(()=>{
    hideTyping();
    showWorkingMemory();
    setTimeout(()=>{
      showFireReveal(()=>{
        animateForwardChain(()=>renderResults());
      });
    },500);
  },500);
}

function renderResults(){
  const {laptops,tier,relaxed}=getChatRecs();
  lastChatResults={laptops,tier,relaxed};
  if(tier>1){
    const msg=tier===2
      ?`🔄 <span class="text-amber-300 font-semibold">Constraint Relaxation</span><br><span class="text-xs text-amber-200/70">Few strict matches — relaxed: <strong>${relaxed.join(', ')}</strong>.</span>`
      :`🔄 <span class="text-amber-300 font-semibold">No Strict Matches</span><br><span class="text-xs text-amber-200/70">Showing best alternatives. Relaxed: ${relaxed.join(', ')}.</span>`;
    appendMessage(msg,'bot');
  }
  const firedCount=INFERENCE_RULES.filter(r=>r.condition(chatAnswers)).length;
  const tierLabel=['','Strict Match ✅','Relaxed Match 🔄','Alternative Suggestions 💡'][tier];
  appendMessage(`✅ <strong>Inference complete</strong> — ${firedCount} rules fired · ${laptops.length} matches ranked<br>
    <span class="text-[10px] text-slate-500">Forward chaining · confidence scoring · constraint relaxation · ${tierLabel}</span><br><br>
    ByteDragon found your <strong>top 3 recommendations</strong>:`, 'bot');

  const overall=laptops[0];
  const budget=[...laptops].sort((a,b)=>(b.valueScore/b.priceEUR)-(a.valueScore/a.priceEUR))[0];
  const perf=[...laptops].sort((a,b)=>b.valueScore-a.valueScore)[0];

  [{icon:'🏆',label:'Best Overall Match',laptop:overall},
   {icon:'💰',label:'Best Budget Match', laptop:budget},
   {icon:'⚡',label:'Best Performance',  laptop:perf},
  ].forEach(({icon,label,laptop})=>{
    if(!laptop) return;
    appendMessage(buildCard(icon,label,laptop,chatAnswers,laptops),'bot');
  });

  // Report button
  appendMessage(`
    <p class="text-sm mb-2">💡 Want to explore all ${laptops.length} matches? Use the full <strong>"Find My Laptop"</strong> questionnaire for side-by-side comparison.</p>
    <button onclick="generateESReport()" class="px-4 py-1.5 rounded-lg bg-violet-600/70 hover:bg-violet-500 text-xs font-semibold border border-violet-500/30 transition-colors">📋 Generate Expert System Report</button>
  `,'bot');

  const rb=document.createElement('div');
  rb.className='flex justify-center mt-2 chat-msg-anim';
  rb.innerHTML=`<button onclick="restartChat()" class="px-5 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-sm font-semibold transition-colors border border-white/10">🔄 Start Over</button>`;
  el('chat-messages').appendChild(rb);

  // Re-enable input for post-result commands
  setTimeout(()=>{
    const inp=el('chat-input'),btn=el('chat-send-btn');
    if(inp){inp.disabled=false;inp.placeholder='Type: why · backward · trace · fuzzy · show gaming…';}
    if(btn) btn.disabled=false;
    showCommandBar();
  },600);
  scrollToBottom();
}

// ── Result card with expert tabs ──────────────────────────────
function buildCard(icon, label, laptop, answers, allLaptops){
  const id=laptop.id.replace(/[^a-z0-9]/g,'-');
  const mq=matchQualityLabel(laptop.confidence);
  const cc=laptop.confidence>=80?'text-emerald-400':laptop.confidence>=60?'text-blue-400':'text-amber-400';
  const cb=laptop.confidence>=80?'bg-emerald-400':laptop.confidence>=60?'bg-blue-400':'bg-amber-400';
  const gbp=Math.round(laptop.priceEUR*EUR_TO_GBP);
  const bc=brandColour(laptop.brand);
  const bi=BRAND_ICON[laptop.brand]||'💻';
  const si=screenInch(laptop);

  // Budget banner
  let bBanner='';
  if(answers.customBudgetEUR){
    const d=laptop.priceEUR-answers.customBudgetEUR;
    if(d<=0) bBanner=`<div class="mx-3 mb-2 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300 flex items-center gap-1">✓ Within your €${answers.customBudgetEUR.toLocaleString()} budget — saves €${Math.abs(d).toLocaleString()}</div>`;
    else if(d<=answers.customBudgetEUR*.10) bBanner=`<div class="mx-3 mb-2 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300">⚠ Slightly above your €${answers.customBudgetEUR.toLocaleString()} budget (+€${d.toLocaleString()})</div>`;
    else bBanner=`<div class="mx-3 mb-2 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] text-red-300">⚠ Above your €${answers.customBudgetEUR.toLocaleString()} budget (+€${d.toLocaleString()})</div>`;
  }

  // Badges / warnings
  const badgesHtml=(laptop.badges||[]).slice(0,3).map(b=>
    `<span class="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">${b}</span>`).join('');
  const warnsHtml=(laptop.warnings||[]).slice(0,2).map(w=>
    `<span class="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25">${w}</span>`).join('');

  // Tab: Overview
  const overviewHtml=`
    <div class="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
      <div><span class="text-slate-500">CPU </span><span class="text-slate-300">${laptop.specs.cpu.split('(')[0].trim()}</span></div>
      <div><span class="text-slate-500">GPU </span><span class="text-slate-300">${(laptop.specs.gpu||'Integrated').split(' ').slice(0,3).join(' ')}</span></div>
      <div><span class="text-slate-500">RAM </span><span class="text-slate-300">${laptop.specs.ramDisplay}</span></div>
      <div><span class="text-slate-500">Screen </span><span class="text-slate-300">${si}"</span></div>
      <div><span class="text-slate-500">Weight </span><span class="text-slate-300">${laptop.specs.weightDisplay}</span></div>
      <div><span class="text-slate-500">Battery </span><span class="text-slate-300">${laptop.specs.batteryHours?laptop.specs.batteryHours+'h':'—'}</span></div>
      <div><span class="text-slate-500">Storage </span><span class="text-slate-300">${(laptop.specs.storage||'').split(' ')[0]||'—'}</span></div>
      <div><span class="text-slate-500">OS </span><span class="text-slate-300">${laptop.specs.os==='macos'?'macOS':'Windows'}</span></div>
    </div>
    ${badgesHtml?`<div class="flex flex-wrap gap-1 mt-2">${badgesHtml}</div>`:''}
    ${warnsHtml ?`<div class="flex flex-wrap gap-1 mt-1">${warnsHtml}</div>` :''}
    <div class="grid grid-cols-3 gap-1 mt-3">
      <a href="${laptop.links?.amazonde||'#'}" target="_blank" rel="noopener" class="text-center py-1.5 rounded-lg bg-slate-800 hover:bg-orange-600/80 text-[10px] font-semibold text-slate-300 hover:text-white transition-colors">Amazon.de</a>
      <a href="${laptop.links?.amazones||'#'}" target="_blank" rel="noopener" class="text-center py-1.5 rounded-lg bg-slate-800 hover:bg-orange-600/80 text-[10px] font-semibold text-slate-300 hover:text-white transition-colors">Amazon.es</a>
      <a href="${laptop.links?.mediamarkt||'#'}" target="_blank" rel="noopener" class="text-center py-1.5 rounded-lg bg-slate-800 hover:bg-red-600/80 text-[10px] font-semibold text-slate-300 hover:text-white transition-colors">MediaMarkt</a>
    </div>`;

  // Tab: Expert Analysis (Rule Trace + Confidence Breakdown)
  const firedRules=(laptop.activatedRules||[]);
  const rulesHtml=firedRules.slice(0,6).map(r=>
    `<div class="flex items-start gap-1.5 text-[10px] ${r.matched?'text-slate-200':'text-slate-600'}">
      <span class="shrink-0 font-bold">${r.matched?'✓':'✗'}</span>
      <span><span class="text-violet-400 font-mono">[${r.id}]</span> ${r.reason}</span>
      <span class="ml-auto shrink-0 ${r.score>0?'text-emerald-400':'text-red-400'} font-bold">${r.score>0?'+':''}${r.score}</span>
    </div>`
  ).join('');

  const checks = [
    {label:'Budget match', val: laptop.priceEUR<=(answers.budget||9999)?25:Math.max(0,25-Math.round((laptop.priceEUR/(answers.budget||1)-1)*30)), max:30},
    {label:'Usage match',  val: answers.purpose&&laptop.purpose?.includes(answers.purpose)?22:10, max:25},
    {label:'RAM / CPU',    val: laptop.specs.ram>=(+(answers.ram)||8)?18:8, max:20},
    {label:'Battery',      val: answers.battery==='yes'?(laptop.specs.batteryHours>=15?10:laptop.specs.batteryHours>=10?7:3):10, max:10},
    {label:'Portability',  val: answers.portability==='travel'?(laptop.specs.weight<=1.5?8:5):8, max:10},
    {label:'OS match',     val: (!answers.os||answers.os==='any'||laptop.specs.os===answers.os)?5:0, max:5},
  ];
  const confHtml=checks.map(c=>`
    <div class="flex items-center gap-2 text-[10px]">
      <span class="text-slate-400 w-20 shrink-0">${c.label}</span>
      <div class="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden"><div class="h-full bg-violet-500 rounded-full" style="width:${Math.round(c.val/c.max*100)}%"></div></div>
      <span class="text-slate-400 shrink-0 w-10 text-right">${c.val}/${c.max}</span>
    </div>`).join('');

  // Why section (explanation)
  const whyParts=[];
  if(answers.purpose&&laptop.purpose?.includes(answers.purpose)) whyParts.push(`matches your <strong>${answers.purpose}</strong> use case`);
  if(answers.customBudgetEUR&&laptop.priceEUR<=answers.customBudgetEUR) whyParts.push(`fits your €${answers.customBudgetEUR.toLocaleString()} budget`);
  if(answers.portability==='travel'&&laptop.specs.weight<=1.5) whyParts.push(`is ultra-lightweight at ${laptop.specs.weightDisplay}`);
  if(answers.battery==='yes'&&laptop.specs.batteryHours>=10) whyParts.push(`offers excellent ${laptop.specs.batteryHours}h battery`);
  if(answers.gpu==='yes'&&laptop.hasGpu) whyParts.push(`has a dedicated GPU`);
  if(answers.os==='macos'&&laptop.specs.os==='macos') whyParts.push(`runs macOS`);
  const whyText=whyParts.length?`This laptop was recommended because it ${whyParts.join(', ')}. The inference engine gave it a <strong>${laptop.confidence}% confidence score</strong>.`:`The inference engine ranked this laptop highest based on your combined requirements with a <strong>${laptop.confidence}% confidence score</strong>.`;

  const expertHtml=`
    <div class="text-[10px] text-slate-400 italic mb-2">${whyText}</div>
    <div class="text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Activated inference rules</div>
    <div class="space-y-1 bg-violet-500/6 rounded-lg p-2 border border-violet-500/15 mb-3">${rulesHtml||'<span class="text-slate-600 text-[10px]">No rules fired for this laptop</span>'}</div>
    <div class="text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Confidence breakdown (${laptop.confidence}%)</div>
    <div class="space-y-1">${confHtml}</div>`;

  // Tab: What-if
  const whatifHtml=`
    <p class="text-[10px] text-slate-400 mb-2">Modify a preference and see updated top match:</p>
    <button class="wi-btn" onclick="applyWhatIf('budget-plus','${id}')">💰 Increase budget +€300</button>
    <button class="wi-btn" onclick="applyWhatIf('gaming','${id}')">🎮 Add gaming GPU need</button>
    <button class="wi-btn" onclick="applyWhatIf('macos','${id}')">🍎 Switch to macOS</button>
    <button class="wi-btn" onclick="applyWhatIf('battery','${id}')">🔋 Prioritise battery</button>
    <button class="wi-btn" onclick="applyWhatIf('ram32','${id}')">🧠 Need 32 GB RAM</button>
    <div id="wi-result-${id}" class="hidden"></div>`;

  return `
    <div class="chat-result-card mt-1 rounded-xl overflow-hidden bg-slate-900 border border-white/10">
      <div class="flex items-center justify-between px-3 pt-2.5 pb-1">
        <span class="text-[10px] font-bold text-violet-400 uppercase tracking-wider">${icon} ${label}</span>
        <span class="text-[10px] font-semibold ${mq.color} bg-slate-800 px-1.5 py-0.5 rounded-full">${mq.label}</span>
      </div>
      <div class="flex gap-3 px-3 pb-2">
        <div class="relative w-16 h-16 rounded-xl border border-white/10 bg-slate-800/60 overflow-hidden shrink-0 flex items-center justify-center">
          <img
            src="${laptop.image||'/laptops/default-laptop.jpg'}"
            alt="${laptop.name}"
            loading="lazy"
            class="w-full h-full object-contain p-1"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
          >
          <div style="display:none" class="absolute inset-0 flex flex-col items-center justify-center ${bc}">
            <span class="text-xl leading-none">${bi}</span>
            <span class="text-[8px] font-black uppercase tracking-tight mt-0.5">${laptop.brand.substring(0,3)}</span>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[10px] text-slate-500 uppercase tracking-wide">${laptop.brand}</p>
          <p class="font-bold text-white text-xs leading-snug">${laptop.name}</p>
          <div class="flex items-baseline gap-1.5 mt-0.5">
            <span class="text-emerald-400 font-bold text-sm">€${laptop.priceEUR.toLocaleString()}</span>
            <span class="text-[10px] text-slate-500">/ £${gbp}</span>
          </div>
          <div class="flex items-center gap-1.5 mt-1.5">
            <div class="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div class="h-full ${cb} rounded-full" style="width:${laptop.confidence}%"></div>
            </div>
            <span class="text-[10px] font-bold ${cc}">${laptop.confidence}% match</span>
          </div>
        </div>
      </div>
      ${bBanner}
      <!-- Tabs -->
      <div class="rt-tabs">
        <button class="rt-tab active" onclick="switchRTab('${id}','overview',this)">Overview</button>
        <button class="rt-tab"        onclick="switchRTab('${id}','expert',this)">Expert Analysis</button>
        <button class="rt-tab"        onclick="switchRTab('${id}','whatif',this)">What-if</button>
      </div>
      <div id="rp-${id}-overview" class="rt-panel">${overviewHtml}</div>
      <div id="rp-${id}-expert"   class="rt-panel hidden">${expertHtml}</div>
      <div id="rp-${id}-whatif"   class="rt-panel hidden">${whatifHtml}</div>
    </div>`;
}

// ── Tab switcher ──────────────────────────────────────────────
window.switchRTab = function(cardId, tab, btn){
  ['overview','expert','whatif'].forEach(t=>{
    const p=el(`rp-${cardId}-${t}`); if(p) p.classList.toggle('hidden', t!==tab);
  });
  btn.closest('.rt-tabs').querySelectorAll('.rt-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
};

// ── What-if ───────────────────────────────────────────────────
window.applyWhatIf = function(type, cardId){
  const modAns = {...chatAnswers};
  let label='';
  if(type==='budget-plus'){modAns.budget=(modAns.budget||1100)+300;if(modAns.customBudgetEUR)modAns.customBudgetEUR+=300;label='budget +€300';}
  else if(type==='gaming'){modAns.gaming='serious';modAns.gpu='yes';label='gaming GPU added';}
  else if(type==='macos'){modAns.os='macos';label='macOS preferred';}
  else if(type==='battery'){modAns.battery='yes';label='battery prioritised';}
  else if(type==='ram32'){modAns.ram='32';label='32 GB RAM required';}

  // Quick rerun
  const score=(l)=>{
    const {score:base,activatedRules}=runInferenceEngine(l,modAns);
    const conf=computeConfidence(l,modAns,activatedRules);
    return {...l,matchScore:base,confidence:conf,activatedRules};
  };
  const top=KNOWLEDGE_BASE.map(score).sort((a,b)=>b.matchScore-a.matchScore)[0];
  const res=el(`wi-result-${cardId}`);
  if(!res) return;
  res.className='wi-result';
  res.innerHTML=`
    <p class="text-[10px] text-cyan-300 font-semibold mb-1">After <em>${label}</em>:</p>
    <p class="text-[10px] text-white font-bold">${top.name}</p>
    <p class="text-[10px] text-slate-400">€${top.priceEUR.toLocaleString()} · ${top.confidence}% match · ${top.specs.ramDisplay}</p>
    <p class="text-[10px] text-slate-500 mt-1">${top.name===KNOWLEDGE_BASE[0]?.name?'Same top pick holds.':'Updated recommendation based on new preference.'}</p>`;
};

// ── Expert System Report ──────────────────────────────────────
window.generateESReport = function(){
  const {laptops,tier}=getChatRecs();
  const facts=getCollectedFacts();
  const firedRules=INFERENCE_RULES.filter(r=>r.condition(chatAnswers)).map(r=>`[${r.id}] ${r.name}`);
  const conflicts=detectConflicts(chatAnswers);
  const tierLabel=['','Strict Match','Relaxed Match','Alternative Suggestions'][tier];
  const top3=laptops.slice(0,3).map((l,i)=>`${['🏆','💰','⚡'][i]} ${l.name} — €${l.priceEUR.toLocaleString()} (${l.confidence}% match)`).join('<br>');
  const factsHtml=facts.map(f=>`<span class="font-mono text-emerald-400">${f.k}</span> = ${f.v}`).join('<br>');
  const rulesHtml=firedRules.slice(0,8).join('<br>');
  const conflictsHtml=conflicts.length?conflicts.map(c=>`⚠ ${c}`).join('<br>'):'None detected';
  const whyTop=laptops[0];
  const reasoning=`The highest-ranked laptop is <strong>${whyTop?.name}</strong> because it best satisfies the combination of user facts through forward-chaining inference. ${whyTop?.confidence}% confidence was computed from ${firedRules.length} activated rules. Match type: ${tierLabel}.`;

  appendMessage(`
    <p class="font-bold text-violet-300 mb-3 flex items-center gap-2">📋 Expert System Report</p>
    <div class="space-y-3 text-[10px]">
      <div><div class="text-[9px] text-slate-500 uppercase tracking-wider mb-1">Facts Collected (Working Memory)</div><div class="font-mono leading-relaxed text-slate-300">${factsHtml}</div></div>
      <div><div class="text-[9px] text-slate-500 uppercase tracking-wider mb-1">Activated IF-THEN Rules (${firedRules.length})</div><div class="font-mono text-violet-300 leading-relaxed">${rulesHtml}</div></div>
      <div><div class="text-[9px] text-slate-500 uppercase tracking-wider mb-1">Conflicts Detected</div><div class="text-amber-300 leading-relaxed">${conflictsHtml}</div></div>
      <div><div class="text-[9px] text-slate-500 uppercase tracking-wider mb-1">Top 3 Recommendations · ${tierLabel}</div><div class="leading-relaxed text-slate-200">${top3}</div></div>
      <div><div class="text-[9px] text-slate-500 uppercase tracking-wider mb-1">Explanation</div><div class="text-slate-300 leading-relaxed">${reasoning}</div></div>
    </div>
  `,'bot');
  scrollToBottom();
};

// ╔══════════════════════════════════════════════════════════════╗
// ║  POST-RESULT EXPERT SYSTEM CONCEPTS  (8 academic features)  ║
// ╚══════════════════════════════════════════════════════════════╝

// ── Command bar shown after inference completes ───────────────
function showCommandBar(){
  const CMDS=[
    {id:'backward', icon:'🔄', label:'Backward Chaining',    desc:'Goal-driven reasoning demo'},
    {id:'conflict',  icon:'⚡', label:'Conflict Set & Agenda',desc:'Rule competition & resolution'},
    {id:'why',       icon:'❓', label:'WHY explanation',      desc:'Justify top recommendation'},
    {id:'certainty', icon:'📊', label:'Certainty Factors',    desc:'MYCIN-style CF analysis'},
    {id:'trace',     icon:'📋', label:'Forward Chain Trace',  desc:'Step-by-step execution log'},
    {id:'fuzzy',     icon:'🌊', label:'Fuzzy Logic',          desc:'Soft budget membership sets'},
    {id:'kbquery',   icon:'🔍', label:'Query KB',             desc:'Search the knowledge base'},
    {id:'hypo',      icon:'🧪', label:'Hypothesis Test',      desc:'Backward-verify a claim'},
  ];
  const btns=CMDS.map(c=>`
    <button class="cmd-btn" onclick="chatCommand('${c.id}')">
      <span class="cmd-icon">${c.icon}</span>
      <div><div class="font-semibold text-[10.5px]">${c.label}</div>
      <div class="text-slate-500 text-[9px]">${c.desc}</div></div>
    </button>`).join('');
  appendMessage(`
    <p class="font-bold text-violet-300 mb-2 flex items-center gap-2">🐉 Expert System mode — explore deeper AI concepts</p>
    <div class="grid grid-cols-2 gap-1.5">${btns}</div>
    <p class="text-[9px] text-slate-600 mt-2">Or type: <span class="font-mono text-slate-500">why · backward · trace · fuzzy · show gaming · test: …</span></p>
  `,'bot');
  scrollToBottom();
}

// ── Text command router (post-result) ─────────────────────────
function parseChatCommand(text){
  appendMessage(escHtml(text),'user');
  const t=text.toLowerCase().trim();
  showTyping();
  setTimeout(()=>{
    hideTyping();
    if(/^why\b|explain|reasoning|justify/.test(t))            return showWhyExplanation();
    if(/backward|back.?chain|goal.?driven|top.?down/.test(t)) return showBackwardChaining();
    if(/conflict|agenda|rete|rule.?set|fired/.test(t))        return showConflictSet();
    if(/certain|mycin|cf\b|uncertain|evidence/.test(t))       return showCertaintyFactors();
    if(/trace|forward.?chain|exec|log|step.by.step|cycle/.test(t)) return showForwardChainTrace();
    if(/fuzzy|membership|soft|approximate|degree/.test(t))    return showFuzzyLogic();
    if(/^(show|find|search|query|list)\b/.test(t))            return showKBQuery(t.replace(/^(show|find|search|query|list)\s*/,'').trim());
    if(/^test[:\s]|hypothesis|assume|suppose|prove/.test(t))  return showHypothesisTest(text);
    // Fallback help
    appendMessage(`🐉 I didn't recognise that command. Try one of these:<br>
      <span class="font-mono text-[10px]">
      <span class="text-violet-300">why</span> · <span class="text-cyan-300">backward</span> · <span class="text-amber-300">conflict</span> · <span class="text-emerald-300">certainty</span><br>
      <span class="text-blue-300">trace</span> · <span class="text-pink-300">fuzzy</span> · <span class="text-slate-300">show gaming</span> · <span class="text-yellow-300">test: gaming under €800</span>
      </span>`,'bot');
  },380);
}

window.chatCommand = function(cmd){
  const labels={backward:'Backward Chaining',conflict:'Conflict Set',why:'WHY explanation',
    certainty:'Certainty Factors',trace:'Forward Chain Trace',fuzzy:'Fuzzy Logic',
    kbquery:'Query KB',hypo:'Hypothesis Test'};
  appendMessage(`${labels[cmd]||cmd}`,'user');
  showTyping();
  setTimeout(()=>{
    hideTyping();
    ({backward:showBackwardChaining,conflict:showConflictSet,why:showWhyExplanation,
      certainty:showCertaintyFactors,trace:showForwardChainTrace,fuzzy:showFuzzyLogic,
      kbquery:()=>showKBQuery(''),hypo:()=>showHypothesisTest('')
    }[cmd]||showBackwardChaining)();
  },550);
};

// ── 1. BACKWARD CHAINING ─────────────────────────────────────
function showBackwardChaining(){
  if(!lastChatResults) return;
  const laptop=lastChatResults.laptops[0];
  if(!laptop){ appendMessage('No results to analyse.','bot'); return; }

  const purpose=chatAnswers.purpose||'student';
  const purpLabel={gaming:'Gaming Performance',programming:'Software Development',
    content:'Content Creation',business:'Business Use',student:'Student & Daily Use',
    office:'Office Productivity',travel:'Travel & Portability'}[purpose]||purpose;

  // Define sub-goals to check
  const subgoals=[
    { label:'OS matches preference',
      fact:`os_pref = ${chatAnswers.os||'any'}`,
      ok: !chatAnswers.os||chatAnswers.os==='any'||laptop.specs.os===chatAnswers.os },
    { label:`RAM ≥ ${chatAnswers.ram||8}GB required`,
      fact:`ram_req = ${chatAnswers.ram||8}GB`,
      ok: laptop.specs.ram>=(parseInt(chatAnswers.ram)||8) },
    { label:'Budget constraint satisfied',
      fact:`budget ≤ €${(chatAnswers.customBudgetEUR||chatAnswers.budget||9999).toLocaleString()}`,
      ok: laptop.priceEUR<=(chatAnswers.customBudgetEUR||chatAnswers.budget||9999)*1.25 },
    { label:'Purpose category matched',
      fact:`purpose = ${purpose}`,
      ok: laptop.purpose?.includes(purpose)||laptop.purpose?.includes('office') },
    { label:'GPU requirement met',
      fact:`gpu_needed = ${chatAnswers.gpu||'any'}`,
      ok: chatAnswers.gpu==='yes'?laptop.hasGpu : chatAnswers.gpu==='no'?!laptop.hasGpu : true },
    { label:'Weight acceptable for portability',
      fact:`portability = ${chatAnswers.portability||'any'}`,
      ok: chatAnswers.portability==='travel'?laptop.specs.weight<=1.6:true },
    { label:'Battery life sufficient',
      fact:`battery_pref = ${chatAnswers.battery||'any'}`,
      ok: chatAnswers.battery==='yes'?laptop.specs.batteryHours>=10:true },
    { label:'Build quality matches premium pref',
      fact:`premium = ${chatAnswers.premium||'any'}`,
      ok: chatAnswers.premium==='yes'?['aluminum','carbon-fiber'].includes(laptop.specs.buildQuality):true },
  ].filter(g=>g.fact.indexOf('any')===-1||g.ok);  // skip irrelevant sub-goals

  const allOk=subgoals.every(g=>g.ok);
  const subHtml=subgoals.map((g,i)=>`
    <div class="bc-sub ${g.ok?'bc-ok':'bc-fail'}">
      <span class="font-mono text-[9px] text-slate-500">Sub-goal ${i+1}:</span>
      <span class="font-semibold"> ${g.label}</span><br>
      <span class="font-mono text-[9px] opacity-70">${g.fact}</span>
      <span class="float-right font-bold">${g.ok?'✓ PROVED':'✗ FAILED'}</span>
    </div>`).join('');

  appendMessage(`
    <p class="font-bold text-violet-300 mb-2">🔄 Backward Chaining Demo</p>
    <div class="es-panel">
      <p class="text-[9px] text-slate-500 uppercase tracking-widest mb-2">Reasoning Strategy: Goal-Driven / Top-Down</p>
      <div class="bc-goal">🎯 GOAL: <span class="text-white">"${laptop.name} is the best laptop for ${purpLabel}"</span></div>
      <div class="text-[9px] text-slate-500 ml-2 mb-1 mt-1">↓ decompose into sub-goals…</div>
      ${subHtml}
      <div class="mt-3 p-2 rounded-lg ${allOk?'bg-emerald-500/10 border border-emerald-500/25 text-emerald-300':'bg-amber-500/10 border border-amber-500/25 text-amber-300'} text-[10px] font-bold">
        ${allOk?'✅ GOAL PROVED — all sub-goals satisfied by backward chaining':'⚠ GOAL PARTIALLY PROVED — '+subgoals.filter(g=>!g.ok).length+' sub-goal(s) unresolved'}
      </div>
      <p class="text-[9px] text-slate-600 mt-2">Backward chaining starts from the goal and works backwards to determine which facts must be true. Contrast with forward chaining (fact-driven, bottom-up).</p>
    </div>
  `,'bot');
  scrollToBottom();
}

// ── 2. CONFLICT SET & AGENDA ─────────────────────────────────
function showConflictSet(){
  if(!lastChatResults) return;
  const laptop=lastChatResults.laptops[0];
  const fired=INFERENCE_RULES.filter(r=>r.condition(chatAnswers));
  const notFired=INFERENCE_RULES.filter(r=>!r.condition(chatAnswers));

  // For each fired rule, get the score it gave the top laptop
  const firedRows=fired.map(r=>{
    const res=r.apply(laptop,chatAnswers);
    const s=res.score;
    const col=s>0?'text-emerald-400':s<0?'text-red-400':'text-slate-500';
    return `<div class="trace-line trace-fire">
      <span class="text-emerald-400 font-bold">[${r.id}]</span>
      <span class="text-slate-300"> ${r.name}</span>
      <span class="float-right ${col} font-bold">${s>0?'+':''}${s}</span>
    </div>`;
  }).join('');

  const skipRows=notFired.slice(0,6).map(r=>
    `<div class="trace-line trace-skip"><span class="text-slate-600">[${r.id}]</span> <span class="text-slate-600">${r.name}</span><span class="float-right text-slate-700">not triggered</span></div>`
  ).join('');

  // Conflict resolution: top 3 by score
  const top3=lastChatResults.laptops.slice(0,3);
  const resRows=top3.map((l,i)=>{
    const sc=l.matchScore?.toFixed(1)||'—';
    return `<div class="flex items-center gap-2 text-[10px] ${i===0?'text-emerald-300 font-bold':'text-slate-400'}">
      <span>${['①','②','③'][i]}</span>
      <span class="flex-1 truncate">${l.name}</span>
      <span class="font-mono">${sc} pts</span>
      ${i===0?'<span class="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">SELECTED</span>':''}
    </div>`;
  }).join('');

  appendMessage(`
    <p class="font-bold text-violet-300 mb-2">⚡ Conflict Set & Agenda</p>
    <div class="es-panel">
      <p class="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Conflict Set — rules applicable to current working memory</p>
      <p class="text-[10px] text-slate-400 mb-2">${fired.length} rules entered the conflict set · ${notFired.length} rules not triggered</p>
      <div class="mb-2">${firedRows}</div>
      <details class="mb-2">
        <summary class="text-[9px] text-slate-600 cursor-pointer">▶ Not-triggered rules (${notFired.length})</summary>
        <div class="mt-1">${skipRows}${notFired.length>6?`<div class="trace-line trace-skip text-slate-700">…and ${notFired.length-6} more</div>`:''}</div>
      </details>
      <p class="text-[9px] text-slate-500 uppercase tracking-widest mb-1 mt-2">Conflict Resolution — Strategy: Max-Score</p>
      <p class="text-[9px] text-slate-600 mb-1">All KB entries scored · highest aggregate wins (no Rete network — simple linear scan)</p>
      <div class="space-y-1">${resRows}</div>
    </div>
  `,'bot');
  scrollToBottom();
}

// ── 3. WHY EXPLANATION ───────────────────────────────────────
function showWhyExplanation(){
  if(!lastChatResults) return;
  const laptop=lastChatResults.laptops[0];
  const runner=laptop.activatedRules||[];
  const pros=runner.filter(r=>r.matched&&r.score>0).map(r=>
    `<div class="trace-line trace-fire">✓ <span class="text-slate-300">${r.reason}</span><span class="float-right text-emerald-400 font-bold">+${r.score}</span></div>`
  ).join('');
  const cons=runner.filter(r=>!r.matched||r.score<0).map(r=>
    `<div class="trace-line trace-skip">✗ <span class="text-slate-500">${r.reason||r.name}</span><span class="float-right text-red-400 font-bold">${r.score}</span></div>`
  ).join('');

  // Alternatives and why they lost
  const others=lastChatResults.laptops.slice(1,4);
  const altRows=others.map(l=>{
    const diff=(laptop.matchScore-l.matchScore).toFixed(1);
    return `<div class="text-[10px] text-slate-500">• <span class="text-slate-400">${l.name}</span> — ranked lower by <span class="text-red-400/80">−${diff} pts</span></div>`;
  }).join('');

  appendMessage(`
    <p class="font-bold text-violet-300 mb-2">❓ WHY is <span class="text-white">${laptop.name}</span> recommended?</p>
    <div class="es-panel">
      <p class="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Evidence FOR (rules that matched)</p>
      <div class="mb-2">${pros||'<div class="text-slate-600 text-[10px]">No positive matches found</div>'}</div>
      ${cons?`<p class="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Evidence AGAINST (mismatches)</p><div class="mb-2">${cons}</div>`:''}
      <p class="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Total inference score</p>
      <div class="text-[10px] font-mono text-slate-300 mb-2">base(50) + rules(${(laptop.matchScore-50).toFixed(1)}) + budget_proximity + value_bonus = <span class="text-violet-300 font-bold">${laptop.matchScore?.toFixed(1)||'—'}</span></div>
      ${altRows?`<p class="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Why not the alternatives?</p><div class="space-y-1 mb-2">${altRows}</div>`:''}
      <p class="text-[9px] text-slate-600 leading-relaxed mt-2">The explanation facility traces each rule's contribution to the final score — a core requirement of any production expert system (cf. MYCIN's WHY/HOW commands).</p>
    </div>
  `,'bot');
  scrollToBottom();
}

// ── 4. CERTAINTY FACTORS (MYCIN-style) ──────────────────────
function showCertaintyFactors(){
  if(!lastChatResults) return;
  const laptop=lastChatResults.laptops[0];

  // Map requirement checks to individual CFs (−1.0 to +1.0)
  const evidence=[
    {label:'Purpose category match',  cf: laptop.purpose?.includes(chatAnswers.purpose)?0.30:chatAnswers.purpose?-0.10:0.05},
    {label:'Budget within range',     cf: laptop.priceEUR<=(chatAnswers.customBudgetEUR||chatAnswers.budget||9999)?0.25:(laptop.priceEUR<=(chatAnswers.budget||9999)*1.15?0.10:-0.15)},
    {label:'RAM requirement met',     cf: laptop.specs.ram>=(parseInt(chatAnswers.ram)||8)?0.18:-0.20},
    {label:'GPU requirement',         cf: chatAnswers.gpu==='yes'?(laptop.hasGpu?0.25:-0.35):chatAnswers.gpu==='no'?(!laptop.hasGpu?0.10:-0.05):0.05},
    {label:'Battery life',            cf: chatAnswers.battery==='yes'?(laptop.specs.batteryHours>=15?0.15:laptop.specs.batteryHours>=10?0.08:-0.12):0.05},
    {label:'OS preference',           cf: !chatAnswers.os||chatAnswers.os==='any'?0.05:laptop.specs.os===chatAnswers.os?0.20:-0.50},
    {label:'Portability / weight',    cf: chatAnswers.portability==='travel'?(laptop.specs.weight<=1.5?0.15:laptop.specs.weight<=1.9?0.04:-0.18):0.05},
    {label:'Build quality (premium)', cf: chatAnswers.premium==='yes'?(['aluminum','carbon-fiber'].includes(laptop.specs.buildQuality)?0.12:-0.08):0.03},
  ];

  // MYCIN combination: CF(A,B) = CF(A) + CF(B)×(1−CF(A)) for positives
  let combinedCF=0;
  for(const e of evidence){
    if(e.cf>0 && combinedCF>=0)      combinedCF = combinedCF + e.cf*(1-combinedCF);
    else if(e.cf<0 && combinedCF<=0) combinedCF = combinedCF + e.cf*(1+combinedCF);
    else                              combinedCF = (combinedCF+e.cf)/(1-Math.min(Math.abs(combinedCF),Math.abs(e.cf)));
    combinedCF=Math.max(-1,Math.min(1,combinedCF));
  }
  const cfPct=Math.round((combinedCF+1)/2*100);

  const rows=evidence.map(e=>{
    const pct=Math.round((e.cf+1)/2*100);
    const col=e.cf>0.1?'#34d399':e.cf<-0.1?'#f87171':'#94a3b8';
    const sign=e.cf>=0?'+':'';
    return `<div class="cf-row">
      <span class="text-slate-400 w-36 shrink-0 truncate">${e.label}</span>
      <div class="cf-bar"><div class="cf-fill" style="width:${pct}%;background:${col}"></div></div>
      <span class="font-mono text-[10px] w-10 text-right shrink-0" style="color:${col}">${sign}${e.cf.toFixed(2)}</span>
    </div>`;
  }).join('');

  const cfCol=combinedCF>0.5?'text-emerald-400':combinedCF>0?'text-blue-400':combinedCF>-0.3?'text-amber-400':'text-red-400';

  appendMessage(`
    <p class="font-bold text-violet-300 mb-2">📊 Certainty Factor Analysis <span class="text-[10px] font-normal text-slate-500">(MYCIN-style)</span></p>
    <div class="es-panel">
      <p class="text-[9px] text-slate-500 uppercase tracking-widest mb-2">Individual evidence CFs for <span class="text-slate-300">${laptop.name}</span></p>
      ${rows}
      <div class="mt-3 p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-[10px]">
        <p class="text-slate-400 mb-1">MYCIN combination formula:</p>
        <p class="font-mono text-violet-300">CF(A,B) = CF(A) + CF(B) × (1 − CF(A))  [if both > 0]</p>
        <p class="font-mono text-violet-300">CF(A,B) = CF(A) + CF(B) × (1 + CF(A))  [if both < 0]</p>
        <p class="font-mono text-violet-300">CF(A,B) = (CF(A)+CF(B)) / (1−min(|CF(A)|,|CF(B)|))  [mixed]</p>
      </div>
      <div class="mt-2 flex items-center gap-3">
        <span class="text-slate-400 text-[10px]">Combined CF:</span>
        <span class="font-mono font-bold text-base ${cfCol}">${combinedCF>=0?'+':''}${combinedCF.toFixed(3)}</span>
        <span class="text-slate-500 text-[9px]">→ ${cfPct}% confidence (mapped from [−1,+1] → [0,100%])</span>
      </div>
    </div>
  `,'bot');
  scrollToBottom();
}

// ── 5. FORWARD CHAIN TRACE ───────────────────────────────────
function showForwardChainTrace(){
  if(!lastChatResults) return;
  const laptop=lastChatResults.laptops[0];
  const facts=getCollectedFacts();

  // Init
  const initRows=facts.map(f=>`<div class="trace-line trace-init">WM ← <span class="font-mono text-emerald-300">${f.k} = "${f.v}"</span></div>`).join('');

  // Rule cycle
  let cycleScore=50;
  const cycleRows=INFERENCE_RULES.map((r,i)=>{
    const fires=r.condition(chatAnswers);
    if(!fires) return `<div class="trace-line trace-skip">Cycle ${i+1} [${r.id}] <span class="text-slate-600">condition FALSE → SKIP</span></div>`;
    const res=r.apply(laptop,chatAnswers);
    cycleScore+=res.score;
    const col=res.score>0?'text-emerald-400':'text-red-400';
    return `<div class="trace-line trace-fire">Cycle ${i+1} [${r.id}] <span class="text-violet-300">FIRE</span> → ${r.name} → score <span class="${col}">${res.score>=0?'+':''}${res.score}</span> → running total: <span class="text-white font-bold">${cycleScore.toFixed(0)}</span></div>`;
  }).join('');

  // Rank summary
  const top3=lastChatResults.laptops.slice(0,3);
  const rankRows=top3.map((l,i)=>`<div class="trace-line trace-rank">Rank ${i+1}: <span class="text-emerald-300">${l.name}</span> → score ${l.matchScore?.toFixed(1)||'—'} → confidence ${l.confidence}%</div>`).join('');

  appendMessage(`
    <p class="font-bold text-violet-300 mb-2">📋 Forward Chain Execution Trace</p>
    <div class="es-panel">
      <p class="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Phase 1 — Working Memory Initialisation</p>
      <div class="mb-2 max-h-24 overflow-y-auto">${initRows}</div>
      <p class="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Phase 2 — Rule Firing Cycles (showing top match: ${laptop.name})</p>
      <div class="mb-2 max-h-40 overflow-y-auto">${cycleRows}</div>
      <p class="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Phase 3 — Conflict Resolution & Ranking</p>
      <div class="mb-2">${rankRows}</div>
      <p class="text-[9px] text-slate-600 leading-relaxed">Forward chaining (data-driven): starts with facts in working memory → tests each rule's condition → fires matching rules → repeats until no new facts (fix-point). This engine does a single linear pass over all rules per laptop.</p>
    </div>
  `,'bot');
  scrollToBottom();
}

// ── 6. FUZZY LOGIC ──────────────────────────────────────────
function showFuzzyLogic(){
  const budget=chatAnswers.customBudgetEUR||chatAnswers.budget||1000;

  // Define 4 fuzzy sets for budget
  const sets=[
    {name:'Tight',    color:'#34d399', mu: b=>b<=500?1:b<=800?Math.max(0,(800-b)/300):0},
    {name:'Moderate', color:'#60a5fa', mu: b=>b<=600?0:b<=900?((b-600)/300):b<=1300?1:b<=1600?((1600-b)/300):0},
    {name:'High',     color:'#a78bfa', mu: b=>b<=900?0:b<=1500?((b-900)/600):b<=2200?1:b<=2800?((2800-b)/600):0},
    {name:'Premium',  color:'#f472b6', mu: b=>b<=1800?0:b<=2500?((b-1800)/700):1},
  ];

  const userMu=sets.map(s=>({...s, val:s.mu(budget)}));

  // Visual bar chart using heights
  const maxH=36;
  const labels=[];
  for(let b=300;b<=3000;b+=150) labels.push(b);

  // Draw each set as a row of mini bars
  const chartHtml=sets.map(s=>{
    const bars=labels.map(b=>{
      const h=Math.round(s.mu(b)*maxH);
      const active=Math.abs(b-budget)<100;
      return `<div class="fz-bar" style="height:${h}px;background:${active?'#fff':s.color};opacity:${active?1:0.6};width:${Math.max(3,Math.floor(200/labels.length))}px"></div>`;
    }).join('');
    const uv=s.mu(budget);
    return `<div class="mb-2">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-[9px] font-semibold w-16 shrink-0" style="color:${s.color}">${s.name}</span>
        <div class="fz-set">${bars}</div>
        <span class="font-mono text-[10px] w-12 text-right shrink-0" style="color:${s.color}">μ=${uv.toFixed(2)}</span>
      </div>
    </div>`;
  }).join('');

  // Crisp output: dominant set
  const dominant=userMu.reduce((a,b)=>a.val>=b.val?a:b);
  const memberships=userMu.filter(s=>s.val>0).map(s=>`<span class="es-badge" style="background:${s.color}22;color:${s.color};border:1px solid ${s.color}44">${s.name} μ=${s.val.toFixed(2)}</span>`).join(' ');

  appendMessage(`
    <p class="font-bold text-violet-300 mb-2">🌊 Fuzzy Logic — Budget Membership Analysis</p>
    <div class="es-panel">
      <p class="text-[9px] text-slate-500 uppercase tracking-widest mb-2">Universe of discourse: Budget (€300–€3,000) · Your input: <span class="text-white font-mono">€${budget.toLocaleString()}</span></p>
      <p class="text-[9px] text-slate-600 mb-3">White bar = your budget position</p>
      ${chartHtml}
      <div class="mt-2 p-2 rounded-lg bg-slate-800/50 border border-white/5">
        <p class="text-[9px] text-slate-500 mb-1">Membership degrees at €${budget.toLocaleString()}:</p>
        <div class="flex flex-wrap gap-1.5">${memberships}</div>
        <p class="text-[10px] text-slate-300 mt-2 font-semibold">Dominant fuzzy class: <span style="color:${dominant.color}">${dominant.name}</span> (μ = ${dominant.val.toFixed(2)})</p>
      </div>
      <p class="text-[9px] text-slate-600 leading-relaxed mt-2">Unlike crisp logic (€800 is "low budget" or it isn't), fuzzy logic assigns partial membership. A €750 budget is simultaneously 83% "Tight" AND 50% "Moderate". This allows smoother reasoning under vagueness.</p>
    </div>
  `,'bot');
  scrollToBottom();
}

// ── 7. KB QUERY ─────────────────────────────────────────────
function showKBQuery(query){
  const q=(query||'').toLowerCase().trim();
  const brandMap={apple:'apple',dell:'dell',hp:'hp',lenovo:'lenovo',asus:'asus',
    acer:'acer',msi:'msi',microsoft:'microsoft',framework:'framework',lg:'lg',
    samsung:'samsung',razer:'razer'};
  const purposeMap={gaming:'gaming',programming:'programming',student:'student',
    business:'business',content:'content',office:'office',travel:'travel'};

  let results=KNOWLEDGE_BASE;
  let desc='all laptops';

  // Brand filter
  for(const[k,v] of Object.entries(brandMap)){
    if(q.includes(k)){ results=results.filter(l=>l.brand.toLowerCase()===v); desc=`${k} laptops`; break;}
  }
  // Purpose filter
  for(const[k,v] of Object.entries(purposeMap)){
    if(q.includes(k)){ results=results.filter(l=>l.purpose?.includes(v)||l.purpose?.includes(k)); desc=`${k} laptops`; break;}
  }
  // GPU filter
  if(/\bgpu\b|gaming|rtx|nvidia|dedicated/.test(q)){ results=results.filter(l=>l.hasGpu); desc='laptops with dedicated GPU'; }
  // macOS filter
  if(/macos|apple|mac/.test(q)){ results=results.filter(l=>l.specs.os==='macos'); desc='macOS laptops'; }
  // Linux filter
  if(/linux|thinkpad|framework/.test(q)){ results=results.filter(l=>l.id.includes('thinkpad')||l.id.includes('framework')); desc='Linux-recommended laptops'; }
  // Budget filters
  const underM=q.match(/under\s*[€$]?\s*(\d+)/);
  if(underM){ const lim=+underM[1]; results=results.filter(l=>l.priceEUR<=lim); desc=`laptops under €${lim}`; }
  const ramM=q.match(/(\d+)\s*gb/);
  if(ramM){ const r=+ramM[1]; results=results.filter(l=>l.specs.ram>=r); desc=`laptops with ≥${r}GB RAM`; }
  // OLED filter
  if(/oled/.test(q)){ results=results.filter(l=>l.specs.display.toLowerCase().includes('oled')); desc='OLED laptops'; }

  if(!q||results.length===KNOWLEDGE_BASE.length) desc='all laptops (no filter applied — try "show gaming", "show Apple", "show under 1000", "show 32gb")';

  const rows=results.slice(0,8).map(l=>
    `<div class="flex items-center gap-2 text-[10px] py-1 border-b border-white/[0.04]">
      <span class="text-slate-500 w-4 shrink-0 font-mono">${l.hasGpu?'⚡':'○'}</span>
      <span class="text-slate-300 flex-1 truncate">${l.name}</span>
      <span class="text-emerald-400 font-mono shrink-0">€${l.priceEUR.toLocaleString()}</span>
      <span class="text-slate-600 shrink-0">${l.specs.ramDisplay}</span>
    </div>`
  ).join('');

  appendMessage(`
    <p class="font-bold text-violet-300 mb-2">🔍 KB Query: <span class="text-slate-300 font-normal">${desc}</span></p>
    <div class="es-panel">
      <p class="text-[9px] text-slate-500 mb-2">${results.length} result${results.length!==1?'s':''} found${results.length>8?' (showing first 8)':''}</p>
      ${rows||'<div class="text-slate-600 text-[10px]">No laptops matched this query.</div>'}
      <p class="text-[9px] text-slate-600 mt-2">Try: <span class="font-mono">show gaming · show Apple · show OLED · show 32gb · show under 1000 · show Linux</span></p>
    </div>
  `,'bot');
  scrollToBottom();
}

// ── 8. HYPOTHESIS TESTING ───────────────────────────────────
function showHypothesisTest(text){
  // Extract hypothesis from text: "test: gaming laptop under €800"
  const hypo=text.replace(/^test[:\s]+/i,'').trim()||'best laptop for my needs';

  // Parse hypothesis
  const t=hypo.toLowerCase();
  const testAnswers={...chatAnswers};

  const purposeM=t.match(/\b(gaming|programming|student|business|content|cybersecurity)\b/);
  if(purposeM) testAnswers.purpose=purposeM[1]==='cybersecurity'?'programming':purposeM[1];

  const budgetM=t.match(/under\s*[€$]?\s*(\d+)/);
  if(budgetM){ testAnswers.budget=+budgetM[1]; testAnswers.customBudgetEUR=+budgetM[1]; }

  if(/\bgpu\b|rtx|nvidia|gaming/.test(t)) testAnswers.gpu='yes';
  if(/macos|mac/.test(t)) testAnswers.os='macos';
  if(/linux/.test(t)) testAnswers.os='linux';
  if(/lightweight|travel|portable/.test(t)) testAnswers.portability='travel';

  // Run inference on test answers
  const testScore=(l)=>{
    const {score,activatedRules}=runInferenceEngine(l,testAnswers);
    const confidence=computeConfidence(l,testAnswers,activatedRules);
    return {...l,matchScore:score,confidence,activatedRules};
  };
  const candidates=KNOWLEDGE_BASE
    .filter(l=>!testAnswers.os||testAnswers.os==='any'||
      (testAnswers.os==='macos'?l.specs.os==='macos':l.specs.os!=='macos'))
    .filter(l=>!testAnswers.gpu||testAnswers.gpu!=='yes'||l.hasGpu)
    .filter(l=>!testAnswers.budget||l.priceEUR<=testAnswers.budget*1.3)
    .map(testScore).sort((a,b)=>b.matchScore-a.matchScore).slice(0,3);

  const proved=candidates.length>0&&candidates[0].confidence>=50;
  const resRows=candidates.map((l,i)=>`
    <div class="text-[10px] ${i===0?'text-slate-200':'text-slate-500'}">
      ${['①','②','③'][i]} <span class="${i===0?'font-semibold':''}">${l.name}</span>
      — €${l.priceEUR.toLocaleString()} · ${l.confidence}% CF
    </div>`).join('');

  // List what facts we used vs original
  const modFacts=[];
  if(purposeM&&purposeM[1]!==chatAnswers.purpose) modFacts.push(`purpose → ${purposeM[1]}`);
  if(budgetM) modFacts.push(`budget → €${testAnswers.budget}`);
  if(testAnswers.gpu==='yes'&&chatAnswers.gpu!=='yes') modFacts.push('gpu → yes');
  if(testAnswers.os!==chatAnswers.os) modFacts.push(`os → ${testAnswers.os}`);
  if(testAnswers.portability==='travel'&&chatAnswers.portability!=='travel') modFacts.push('portability → travel');

  appendMessage(`
    <p class="font-bold text-violet-300 mb-2">🧪 Hypothesis Test</p>
    <div class="es-panel">
      <p class="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Hypothesis</p>
      <div class="bc-goal">"${escHtml(hypo)}"</div>
      ${modFacts.length?`<p class="text-[9px] text-slate-600 mt-1 mb-2">Modified facts: ${modFacts.join(' · ')}</p>`:'<p class="text-[9px] text-slate-600 mt-1 mb-2">Using current session facts</p>'}
      <p class="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Inference result</p>
      <div class="space-y-1 mb-2">${resRows||'<div class="text-slate-600 text-[10px]">No candidates found for this hypothesis.</div>'}</div>
      <div class="p-2 rounded-lg ${proved?'bg-emerald-500/10 border border-emerald-500/25 text-emerald-300':'bg-red-500/10 border border-red-500/25 text-red-300'} text-[10px] font-bold">
        ${proved?`✅ HYPOTHESIS SUPPORTED — ${candidates[0]?.name} satisfies the stated requirements (CF: ${candidates[0]?.confidence}%)`:`⚠ HYPOTHESIS WEAKLY SUPPORTED or FAILED — best candidate confidence: ${candidates[0]?.confidence||0}%`}
      </div>
      <p class="text-[9px] text-slate-600 leading-relaxed mt-2">Hypothesis testing uses backward-style goal setting with forward-chain verification. The inference engine was re-run with modified working memory derived from your hypothesis. Try: <span class="font-mono">test: gaming laptop under €800</span></p>
    </div>
  `,'bot');
  scrollToBottom();
}

// ── Public API ────────────────────────────────────────────────
export function openChatModal(){
  const modal=el('chat-modal'); if(!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow='hidden';
  if(currentStep===0&&!chatDone){ initChat(); }
  else { scrollToBottom(); const i=el('chat-input'); if(i&&!i.disabled) i.focus(); }
}
export function closeChatModal(){
  const modal=el('chat-modal'); if(modal) modal.classList.add('hidden');
  document.body.style.overflow='';
}
export function handleChatKeydown(e){
  if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submitChatInput();}
}
export function submitChatInput(){
  const i=el('chat-input'); if(!i) return;
  const t=i.value.trim(); if(!t) return;
  i.value='';
  if(chatDone){ parseChatCommand(t); return; }
  parseInput(t);
}
export function chatQuickReply(value){
  if(chatDone) return;
  const q=CHAT_QUESTIONS[currentStep]; if(!q) return;
  handleAnswer(value, q.displayValue?q.displayValue(value):value);
}
export function restartChat(){
  chatAnswers={budget:null,purpose:null,battery:null,portability:null,gaming:null,
    vmUse:null,ram:null,gpu:null,os:null,premium:null,displaySize:null,
    customBudgetEUR:null,customBudgetMinEUR:null,customBudgetMaxEUR:null};
  currentStep=0; chatDone=false; lastChatResults=null;
  const msgs=el('chat-messages'); if(msgs) msgs.innerHTML='';
  clearReplies(); hideTyping();
  const i=el('chat-input'),b=el('chat-send-btn');
  if(i){i.disabled=false;i.value='';} if(b) b.disabled=false;
  const f=el('chat-progress-fill'); if(f) f.style.width='0%';
  const s=el('chat-status-text'); if(s) s.textContent='Rule-based AI · 18 inference rules · offline';
  initChat();
}

// ── Init ──────────────────────────────────────────────────────
function initChat(){
  // KB stats
  const brands=new Set(KNOWLEDGE_BASE.map(l=>l.brand)).size;
  const mac=KNOWLEDGE_BASE.filter(l=>l.specs.os==='macos').length;
  const avgP=Math.round(KNOWLEDGE_BASE.reduce((s,l)=>s+l.priceEUR,0)/KNOWLEDGE_BASE.length);
  const minP=Math.min(...KNOWLEDGE_BASE.map(l=>l.priceEUR));
  const maxP=Math.max(...KNOWLEDGE_BASE.map(l=>l.priceEUR));

  appendMessage(`
    <strong>Hi! I'm ByteDragon</strong> 🐉 — your Laptop Expert System assistant.<br><br>
    I will ask you questions, collect your needs as <strong>facts</strong>, activate <strong>expert IF-THEN rules</strong>,
    scan my knowledge base, and recommend the best laptops using <strong>forward-chaining inference</strong>.<br><br>
    <div class="mt-2 p-2 rounded-lg bg-slate-700/40 border border-white/5 text-[10px] text-slate-400">
      <span class="font-semibold text-slate-300">Knowledge Base: </span>
      ${KNOWLEDGE_BASE.length} laptops · ${brands} brands · ${INFERENCE_RULES.length} IF-THEN rules ·
      €${minP.toLocaleString()}–€${maxP.toLocaleString()} range · avg. €${avgP.toLocaleString()} ·
      ${mac} macOS laptops
    </div>
    <span class="text-slate-400 text-xs mt-2 block">Type freely or tap a button — e.g. <em>programming</em>, <em>733</em>, <em>no gaming</em>, <em>lightweight</em>.</span>
  `,'bot');

  showTyping();
  setTimeout(()=>{hideTyping();advanceStep(0);},650);
}
