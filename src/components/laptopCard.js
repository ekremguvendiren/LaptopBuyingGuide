// ============================================================
// Laptop Card Component  v4
// Real product images, sparklines, favorites, radar trigger
// ============================================================
import { EUR_TO_GBP } from '../data/laptops.js';
import { BADGE_COLORS } from '../data/rules.js';
import { matchQualityLabel, getScoreClass } from '../utils/recommendationEngine.js';
import { state } from '../state.js';

// ── Brand badge colours ───────────────────────────────────────
const BRAND_COLOURS = {
  'Apple':     'bg-slate-600/30 border-slate-400/30 text-slate-100',
  'Dell':      'bg-blue-700/20 border-blue-500/30 text-blue-200',
  'HP':        'bg-blue-800/20 border-blue-600/30 text-blue-200',
  'Lenovo':    'bg-red-800/20 border-red-500/30 text-red-200',
  'ASUS':      'bg-cyan-800/20 border-cyan-500/30 text-cyan-200',
  'Acer':      'bg-emerald-800/20 border-emerald-500/30 text-emerald-200',
  'MSI':       'bg-red-900/30 border-red-600/30 text-red-300',
  'Microsoft': 'bg-cyan-900/20 border-cyan-400/30 text-cyan-200',
  'LG':        'bg-purple-800/20 border-purple-500/30 text-purple-200',
  'Framework': 'bg-orange-800/20 border-orange-500/30 text-orange-200',
  'Samsung':   'bg-blue-900/20 border-blue-400/30 text-blue-200',
  'Razer':     'bg-green-900/20 border-green-600/30 text-green-300',
};
const BRAND_DEFAULT = 'bg-slate-700/30 border-slate-500/30 text-slate-200';

export function brandColour(brand) {
  return BRAND_COLOURS[brand] || BRAND_DEFAULT;
}

const BRAND_ICON = {
  'Apple': '🍎', 'Dell': '💻', 'HP': '💻', 'Lenovo': '💻',
  'ASUS': '💻', 'Acer': '💻', 'MSI': '🎮', 'Razer': '🎮',
  'Microsoft': '🪟', 'Samsung': '📱', 'LG': '💻', 'Framework': '🔧',
};

const PURPOSE_LABELS = {
  student: '🎓 Student', programming: '💻 Dev', gaming: '🎮 Gaming',
  content: '🎨 Creator', business: '💼 Business', office: '📋 Office',
};
const OS_LABELS = { macos: '🍎 macOS', linux: '🐧 Linux', windows: '🪟 Windows' };

// ── Sparkline SVG ─────────────────────────────────────────────
export function sparklineSvg(laptop) {
  // Deterministic pseudo-random from laptop id → consistent chart
  const seed = [...laptop.id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = laptop.priceEUR;
  const pts = Array.from({ length: 12 }, (_, i) => {
    const v = Math.sin(seed * 0.07 + i * 0.85) * 0.06
            + Math.cos(seed * 0.031 + i * 0.4) * 0.035
            + Math.sin(i * 0.3) * 0.02;
    return base * (1 + v);
  });
  const mn = Math.min(...pts), mx = Math.max(...pts), r = mx - mn || 1;
  const coords = pts.map((p, i) => ({
    x: parseFloat((i / 11 * 46 + 1).toFixed(1)),
    y: parseFloat((18 - ((p - mn) / r) * 14 + 1).toFixed(1)),
  }));
  const d = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x},${c.y}`).join(' ');
  const up = pts[11] >= pts[0];
  const color = up ? '#34d399' : '#f87171';
  const last = coords[11];
  return `<svg viewBox="0 0 48 20" width="52" height="20" fill="none" class="sparkline-svg" aria-hidden="true">
    <path d="${d}" stroke="${color}" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
    <circle cx="${last.x}" cy="${last.y}" r="1.8" fill="${color}"/>
  </svg>`;
}

// ── Radar Chart Data ──────────────────────────────────────────
export function radarData(laptop) {
  // 6 axes 0-100
  const perf = Math.min(100, laptop.valueScore * 10 + (laptop.hasGpu ? 10 : 0));
  const batt = Math.min(100, laptop.specs.batteryHours * 5.5);
  const port = Math.min(100, Math.max(0, (3 - laptop.specs.weight) / 1.8 * 100));
  const val  = Math.min(100, laptop.valueScore * 10);
  const disp = laptop.specs.display.toLowerCase().includes('oled') ? 95
             : laptop.specs.refreshRate >= 144 ? 80
             : laptop.specs.refreshRate >= 120 ? 70 : 55;
  const build = { 'aluminum': 90, 'carbon-fiber': 95, 'military-grade': 85, 'plastic': 50, 'magnesium': 80 }[laptop.specs.buildQuality] || 60;
  return { perf, batt, port, val, disp, build };
}

// ── Brand Header ─────────────────────────────────────────────
export function brandHeaderHtml(laptop) {
  const bc   = brandColour(laptop.brand);
  const icon = BRAND_ICON[laptop.brand] || '💻';
  const imgSrc = laptop.image || '/laptops/default-laptop.jpg';
  const purposes = (laptop.purpose || []).slice(0, 2).map(p => PURPOSE_LABELS[p] || p);
  const osTag = OS_LABELS[laptop.specs.os] || '';
  if (osTag) purposes.push(osTag);
  const purposeHtml = purposes.map(p =>
    `<span class="inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-700/50 text-slate-400 border border-white/5">${p}</span>`
  ).join('');

  const fallbackId = `img-fb-${laptop.id}`;
  const imgId      = `img-el-${laptop.id}`;

  return `
  <div class="relative mx-4 mt-3 rounded-xl bg-slate-800/50 border border-white/[0.06] overflow-hidden" style="height:148px">
    <img
      id="${imgId}"
      src="${imgSrc}"
      alt="${laptop.name}"
      loading="lazy"
      class="w-full h-full object-contain p-3 transition-opacity duration-300"
      onerror="handleImageError(this,'${fallbackId}','${imgId}')"
    >
    <div id="${fallbackId}" class="hidden absolute inset-0 flex flex-col items-center justify-center gap-2">
      <div class="w-14 h-14 rounded-xl border flex flex-col items-center justify-center ${bc}">
        <span class="text-xl leading-none">${icon}</span>
        <span class="text-[8px] font-black uppercase tracking-tight mt-0.5 leading-none">${laptop.brand.substring(0,3)}</span>
      </div>
      <span class="text-xs font-semibold text-slate-400">${laptop.name}</span>
    </div>
  </div>
  <div class="mx-4 mt-2.5 flex items-center gap-2 flex-wrap">
    <span class="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${bc}">${laptop.brand}</span>
    ${purposeHtml}
  </div>`;
}

export function handleImageError(imgEl, fallbackId, imgId) {
  const img = imgEl || document.getElementById(imgId);
  const fb  = document.getElementById(fallbackId);
  if (img) img.classList.add('hidden');
  if (fb)  fb.classList.remove('hidden');
}

export function imageHtml() { return ''; }

export function specItem(label, value) {
  return `<div class="spec-item"><span class="text-slate-500 block leading-none mb-0.5">${label}</span><span class="text-slate-200 font-medium leading-tight">${value}</span></div>`;
}

export function generateDetailedReasoning(laptop) {
  const a = state.answers;
  const parts = [];
  const pm = {
    gaming: 'gaming and high performance', programming: 'software development',
    content: 'video/photo editing and design', student: 'student and daily use',
    office: 'office productivity', business: 'business and professional use',
  };
  if (a.purpose) parts.push(`Primary use case: <strong>${pm[a.purpose] || a.purpose}</strong>.`);
  if (a.budget) {
    const diff = a.budget - laptop.priceEUR;
    parts.push(diff >= 0
      ? `Costs €${laptop.priceEUR} — <strong>€${diff} under budget</strong>.`
      : `Costs €${laptop.priceEUR} — <strong>€${Math.abs(diff)} above budget</strong>, upgraded specs may justify the difference.`);
  }
  if (a.gpu === 'yes' && laptop.hasGpu)  parts.push(`Dedicated GPU (${laptop.specs.gpu}) required and matched.`);
  if (a.gpu === 'yes' && !laptop.hasGpu) parts.push(`You requested a dedicated GPU — this laptop has integrated graphics only.`);
  if (a.battery === 'yes')      parts.push(`Long battery required — this laptop provides <strong>~${laptop.specs.batteryHours}h</strong>.`);
  if (a.portability === 'travel') parts.push(`Travel portability required — this laptop weighs <strong>${laptop.specs.weightDisplay}</strong>.`);
  if (a.vmUse === 'yes')        parts.push(`VM use selected — <strong>${laptop.specs.ramDisplay}</strong> available for concurrent environments.`);
  if (state.matchTier > 1)      parts.push(`<em>Found after constraint relaxation (Tier ${state.matchTier}).</em>`);
  parts.push(`Confidence score: <strong>${laptop.confidence}%</strong> — ${matchQualityLabel(laptop.confidence).label}.`);
  return parts.join(' ');
}

// ── Laptop Card ───────────────────────────────────────────────
export function renderLaptopCard(laptop, rank) {
  const gbp = Math.round(laptop.priceEUR * EUR_TO_GBP);
  const sc  = getScoreClass(laptop.valueScore);
  const bc  = BADGE_COLORS[laptop.badgeColor] || BADGE_COLORS.slate;
  const mq  = matchQualityLabel(laptop.confidence);
  const confColor = laptop.confidence >= 80 ? 'text-emerald-400' : laptop.confidence >= 60 ? 'text-blue-400' : 'text-amber-400';
  const confBg    = laptop.confidence >= 80 ? 'bg-emerald-400'   : laptop.confidence >= 60 ? 'bg-blue-400'   : 'bg-amber-400';
  const isTop = rank === 0;
  const isFav = state.favorites.has(laptop.id);

  const amzDe = laptop.links?.amazonde   || `https://www.amazon.de/s?k=${encodeURIComponent(laptop.name)}&i=computers`;
  const amzEs = laptop.links?.amazones   || `https://www.amazon.es/s?k=${encodeURIComponent(laptop.name)}&i=computers`;
  const mm    = laptop.links?.mediamarkt || `https://www.mediamarkt.de/de/search.html?query=${encodeURIComponent(laptop.name)}`;

  const badgesHtml = (laptop.badges || []).slice(0, 4).map(b =>
    `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">${b}</span>`).join('');
  const warnsHtml = (laptop.warnings || []).slice(0, 3).map(w =>
    `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25">${w}</span>`).join('');
  const rulesHtml = (laptop.activatedRules || []).slice(0, 4).map(r =>
    `<div class="flex items-start gap-1.5 text-[10px] leading-relaxed ${r.matched ? 'text-slate-300' : 'text-slate-500'}">
      <span class="shrink-0 mt-px">${r.matched ? '✓' : '✗'}</span>
      <span>[${r.id}] ${r.reason}</span>
    </div>`).join('');

  // Sparkline
  const spark = sparklineSvg(laptop);

  return `<div class="laptop-card glass-card rounded-2xl overflow-hidden flex flex-col" data-id="${laptop.id}">

    <!-- Badge row -->
    <div class="flex items-start justify-between px-4 pt-4 pb-0 gap-2">
      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${bc}">
        ${isTop ? '⭐ ' : ''}${laptop.badge}
      </span>
      <div class="flex items-center gap-2 shrink-0">
        <!-- Favorite button -->
        <button
          class="fav-btn ${isFav ? 'fav-active' : ''} w-7 h-7 rounded-lg flex items-center justify-center text-base transition-all"
          onclick="toggleFavorite('${laptop.id}', this)"
          title="${isFav ? 'Remove from favorites' : 'Save to favorites'}"
          data-id="${laptop.id}"
        >${isFav ? '❤️' : '🤍'}</button>
        <!-- Radar chart button -->
        <button
          class="w-7 h-7 rounded-lg flex items-center justify-center text-sm bg-slate-700/40 hover:bg-violet-500/20 border border-white/5 hover:border-violet-500/30 transition-all"
          onclick="openRadarModal('${laptop.id}')"
          title="View profile radar chart"
        >📊</button>
        <div class="flex flex-col items-center">
          <div class="value-ring ${sc}"><span class="text-[11px] font-black leading-none">${laptop.valueScore}</span></div>
          <span class="text-[9px] text-slate-600 mt-0.5 uppercase tracking-wide">Value</span>
        </div>
      </div>
    </div>

    <!-- Match quality + confidence bar -->
    <div class="mx-4 mt-2">
      <div class="flex items-center justify-between mb-1">
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${mq.bg} ${mq.color}">${mq.label}</span>
        <div class="flex items-center gap-2">
          ${spark}
          <span class="text-[11px] font-bold ${confColor}">${laptop.confidence}%</span>
        </div>
      </div>
      <div class="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
        <div class="h-full ${confBg} rounded-full" style="width:${laptop.confidence}%"></div>
      </div>
    </div>

    <!-- Product image + brand row -->
    ${brandHeaderHtml(laptop)}

    <!-- Content -->
    <div class="p-4 flex flex-col flex-grow min-h-0">

      <!-- Price + sparkline -->
      <div class="flex items-baseline gap-2 mb-4">
        <span class="text-2xl font-extrabold text-emerald-400" id="price-display-${laptop.id}">€${laptop.priceEUR.toLocaleString()}</span>
        <span class="text-sm text-slate-500">/ £${gbp.toLocaleString()}</span>
      </div>

      <!-- Specs grid -->
      <div class="grid grid-cols-2 gap-x-3 gap-y-2 mb-4 text-xs">
        ${specItem('CPU', laptop.specs.cpu)}
        ${specItem('GPU', laptop.specs.gpu)}
        ${specItem('RAM', laptop.specs.ramDisplay)}
        ${specItem('Storage', laptop.specs.storage)}
        ${specItem('Display', laptop.specs.display)}
        ${specItem('Weight', laptop.specs.weightDisplay)}
        ${specItem('Battery', laptop.specs.battery)}
        ${specItem('OS', laptop.specs.os === 'macos' ? 'macOS' : 'Windows 11')}
      </div>

      ${badgesHtml ? `<div class="flex flex-wrap gap-1 mb-2">${badgesHtml}</div>` : ''}
      ${warnsHtml  ? `<div class="flex flex-wrap gap-1 mb-3">${warnsHtml}</div>` : ''}

      <!-- Inference reasoning -->
      <details class="mb-2">
        <summary class="cursor-pointer text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5 select-none list-none">
          <span class="why-arrow">▶</span> Inference Engine Reasoning
        </summary>
        <div class="mt-2 text-xs text-slate-300 leading-relaxed bg-violet-500/10 rounded-xl p-3 border border-violet-500/20 space-y-2">
          <p>${generateDetailedReasoning(laptop)}</p>
          ${rulesHtml ? `<div class="border-t border-violet-500/20 pt-2">
            <p class="text-[10px] text-violet-400 font-bold mb-1 uppercase tracking-wide">Activated Rules:</p>
            <div class="space-y-0.5">${rulesHtml}</div>
          </div>` : ''}
        </div>
      </details>

      <!-- Pros / Cons -->
      <details class="mb-3">
        <summary class="cursor-pointer text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 select-none list-none">
          <span class="why-arrow">▶</span> Pros &amp; Cons · Expert Notes
        </summary>
        <div class="mt-2 text-xs rounded-xl p-3 bg-slate-800/50 border border-white/5 space-y-3">
          <div>
            <p class="text-emerald-400 font-bold mb-1">Pros</p>
            ${laptop.pros.map(p => `<div class="flex gap-1.5 text-slate-300 mb-0.5"><span class="text-emerald-400 shrink-0">+</span>${p}</div>`).join('')}
          </div>
          <div>
            <p class="text-red-400 font-bold mb-1">Cons</p>
            ${laptop.cons.map(c => `<div class="flex gap-1.5 text-slate-400 mb-0.5"><span class="text-red-400 shrink-0">−</span>${c}</div>`).join('')}
          </div>
          <div class="border-t border-white/5 pt-2">
            <p class="text-slate-500 font-bold mb-1">Expert Note</p>
            <p class="text-slate-400 leading-relaxed">${laptop.expertNotes}</p>
          </div>
          <div class="border-t border-white/5 pt-2">
            <p class="text-slate-500 font-bold mb-1">User Feedback</p>
            <p class="text-slate-400 leading-relaxed">${laptop.userFeedback}</p>
          </div>
        </div>
      </details>

      <!-- Compare toggle -->
      <label class="flex items-center gap-2 mb-4 cursor-pointer group/check select-none">
        <div class="compare-toggle w-4 h-4 rounded border border-slate-600 flex items-center justify-center transition-all shrink-0">
          <span class="check-mark text-[10px] hidden text-violet-300">✓</span>
        </div>
        <input type="checkbox" class="compare-checkbox sr-only" data-id="${laptop.id}" onchange="handleCompareToggle(this)">
        <span class="text-xs text-slate-500 group-hover/check:text-slate-300 transition-colors">Add to comparison</span>
      </label>

      <!-- Buy buttons -->
      <div class="mt-auto grid grid-cols-3 gap-1.5">
        <a href="${amzDe}" target="_blank" rel="noopener" class="buy-btn">
          <span class="block text-[9px] text-slate-500 leading-none mb-0.5">Amazon</span>
          <span class="font-bold text-xs">.de</span>
        </a>
        <a href="${amzEs}" target="_blank" rel="noopener" class="buy-btn">
          <span class="block text-[9px] text-slate-500 leading-none mb-0.5">Amazon</span>
          <span class="font-bold text-xs">.es</span>
        </a>
        <a href="${mm}" target="_blank" rel="noopener" class="buy-btn buy-btn-mm">
          <span class="block text-[9px] text-slate-500 leading-none mb-0.5">Media</span>
          <span class="font-bold text-xs">Markt</span>
        </a>
      </div>

    </div>
  </div>`;
}
