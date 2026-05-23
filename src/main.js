// ============================================================
// Laptop Buying Guide — Expert System Entry Point
// University AI Course Project — KB v36 · Chat v6 · v12
// ============================================================

// Inject custom CSS as inline <style> — bypasses Vite link-tag transform
import appCss from './app.css?raw';
(function injectStyles() {
  if (document.getElementById('app-custom-styles')) return;
  const el = document.createElement('style');
  el.id = 'app-custom-styles';
  el.textContent = appCss;
  document.head.appendChild(el);
})();

import { state } from './state.js';
import { STEPS } from './data/rules.js';
import { KNOWLEDGE_BASE } from './data/laptops.js';
import { getMatchedLaptops, matchQualityLabel } from './utils/recommendationEngine.js';
import { renderLaptopCard, handleImageError, radarData } from './components/laptopCard.js?v=4';
import { renderTopThreePicks } from './components/topPicks.js';
import { renderKnowledgeBaseStats } from './components/knowledgeBase.js';
import {
  handleCompareToggle, setCompareCheckbox, updateCompareBar,
  removeFromCompare, clearCompare, openCompareModal, closeCompareModal,
} from './components/comparisonTable.js';
import {
  openChatModal, closeChatModal, handleChatKeydown, submitChatInput,
  chatQuickReply, restartChat,
} from './components/ChatExpertSystem.js?v=7';

// ============================================================
// INIT
// ============================================================
function init() {
  loadFavoritesFromStorage();
  initFromURL();
  renderProgressDots();
  renderStep(1);
  document.getElementById('sort-select').addEventListener('change', handleSortChange);
  renderKnowledgeBaseStats();
  initTicker();
  initPriceFlicker();
  initRuleTicker();
  initPopularHeroCards();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
}

// ============================================================
// MARKET TICKER — requestAnimationFrame smooth scroll
// ============================================================
function initTicker() {
  const track = document.getElementById('ticker-track');
  if (!track) return;

  // Clone all items for seamless loop
  const origItems = Array.from(track.children);
  origItems.forEach(item => track.appendChild(item.cloneNode(true)));

  let pos = 0;
  let paused = false;
  const speed = 0.7;

  const wrapper = track.parentElement;
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => { paused = true; });
    wrapper.addEventListener('mouseleave', () => { paused = false; });
  }

  function tick() {
    if (!paused) {
      // Recalculate half every frame — DOM may not be ready at init time
      const half = track.scrollWidth / 2;
      if (half > 0) {
        pos += speed;
        if (pos >= half) pos -= half;
        track.style.transform = `translateX(-${pos}px)`;
      }
    }
    requestAnimationFrame(tick);
  }

  // Small delay so browser has time to lay out and measure items
  setTimeout(() => requestAnimationFrame(tick), 100);
}

// ============================================================
// PRICE FLICKER — Ticker prices fluctuate slightly
// ============================================================
function initPriceFlicker() {
  const tickerData = [
    { name: 'MacBook Air M4 13"', base: 1199 },
    { name: 'ROG Zephyrus G14',   base: 1299 },
    { name: 'ThinkPad X1 Carbon', base: 1899 },
    { name: 'Dell XPS 13',        base: 1049 },
    { name: 'Framework 13 AMD',   base: 849  },
    { name: 'MSI Katana 15',      base: 799  },
    { name: 'HP Spectre x360',    base: 1349 },
    { name: 'Galaxy Book5 Pro',   base: 1399 },
    { name: 'ASUS ProArt P16',    base: 1899 },
    { name: 'Legion Pro 5 Gen 8', base: 1299 },
    { name: 'MacBook Pro 14" M4', base: 1999 },
    { name: 'Dell G15 Gaming',    base: 899  },
  ];

  function flicker() {
    // Update prices in all .t-price elements
    const prices = document.querySelectorAll('.t-price');
    prices.forEach(el => {
      const orig = parseInt(el.dataset.base || el.textContent.replace(/[€,]/g, ''));
      if (!el.dataset.base) el.dataset.base = orig;
      const delta = (Math.random() - 0.5) * orig * 0.008;
      const newPrice = Math.round(orig + delta);
      const oldPrice = parseInt(el.textContent.replace(/[€,]/g, ''));
      el.textContent = `€${newPrice.toLocaleString()}`;
      // Flash color
      if (newPrice > oldPrice) {
        el.classList.add('price-up-flash');
        setTimeout(() => el.classList.remove('price-up-flash'), 600);
      } else if (newPrice < oldPrice) {
        el.classList.add('price-down-flash');
        setTimeout(() => el.classList.remove('price-down-flash'), 600);
      }
    });
    setTimeout(flicker, 3500 + Math.random() * 2000);
  }

  setTimeout(flicker, 4000);
}

// ============================================================
// PROGRESS DOTS
// ============================================================
function renderProgressDots() {
  document.getElementById('progress-dots').innerHTML =
    Array.from({ length: state.totalSteps }, (_, i) =>
      `<div class="progress-dot ${i === 0 ? 'active' : ''}" data-dot="${i}"></div>`
    ).join('');
}

function updateProgressDots() {
  document.querySelectorAll('.progress-dot').forEach((d, i) => {
    d.className = 'progress-dot' + (i < state.step ? ' active' : '');
  });
  document.getElementById('step-counter').textContent = `Step ${state.step} of ${state.totalSteps}`;
}

// ============================================================
// STEP RENDERING
// ============================================================
function renderStep(stepNum) {
  state.step = stepNum;
  const cfg = STEPS[stepNum - 1];
  let html = `<p class="text-xs text-violet-400 font-semibold uppercase tracking-widest mb-2">Step ${stepNum} of ${state.totalSteps}</p>
    <h2 class="text-xl sm:text-2xl font-bold mb-1">${cfg.title}</h2>
    <p class="text-slate-400 text-sm mb-6">${cfg.subtitle}</p>`;

  if (cfg.type === 'budget') {
    html += `<div class="flex items-center gap-3 bg-slate-800/60 border border-white/10 rounded-xl px-4 py-3 mb-5 focus-within:border-violet-500 transition-colors">
      <span class="text-2xl font-black text-cyan-400">€</span>
      <input type="number" id="budget-input"
        class="bg-transparent flex-1 text-2xl font-bold outline-none text-white placeholder-slate-600"
        placeholder="e.g. 1500" min="300" max="10000" value="${state.answers.budget || ''}">
    </div>
    <p class="text-xs text-slate-600 mb-5">Min €300 · Max €10,000 · EU market prices</p>
    <button class="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-bold text-base transition-all"
      onclick="handleBudgetNext()">Continue →</button>`;
  } else {
    html += `<div class="flex flex-col gap-2.5">`;
    cfg.options.forEach(opt => {
      const sel = state.answers[cfg.key] === opt.value;
      html += `<button class="option-card text-left px-4 py-3.5 rounded-xl border transition-all duration-150 ${sel ? 'selected' : ''}"
        onclick="selectOption('${cfg.key}','${opt.value}',this)">
        <div class="font-semibold text-base">${opt.label}</div>
        <div class="text-slate-500 text-sm mt-0.5">${opt.desc}</div>
      </button>`;
    });
    html += `</div>
    <!-- Skip option -->
    <button class="mt-4 w-full py-2 rounded-xl border border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20 text-sm transition-all"
      onclick="skipStep()">Skip — Not sure / No preference →</button>`;
  }

  document.getElementById('step-content').innerHTML = html;
  updateProgressDots();
  document.getElementById('prev-btn').disabled = stepNum === 1;

  if (cfg.type === 'budget') {
    const inp = document.getElementById('budget-input');
    inp.focus();
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') handleBudgetNext(); });
  }
}

// ============================================================
// WIZARD NAVIGATION
// ============================================================
function handleBudgetNext() {
  const val = parseInt(document.getElementById('budget-input').value);
  if (!val || val < 300) {
    const inp = document.getElementById('budget-input');
    inp.classList.add('shake');
    setTimeout(() => inp.classList.remove('shake'), 400);
    return;
  }
  state.answers.budget = val;
  saveAnswersToStorage();
  nextStep();
}

function selectOption(key, value, btn) {
  btn.closest('.flex').querySelectorAll('.option-card').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.answers[key] = value;
  if (key === 'gaming' && value === 'serious' && !state.answers.gpu) state.answers.gpu = 'yes';
  saveAnswersToStorage();
  setTimeout(() => nextStep(), 280);
}

function skipStep() {
  const cfg = STEPS[state.step - 1];
  if (cfg && cfg.key) state.answers[cfg.key] = null;
  nextStep();
}

function nextStep() { if (state.step < state.totalSteps) renderStep(state.step + 1); else showResults(); }
function prevStep() { if (state.step > 1) renderStep(state.step - 1); }

// ============================================================
// RESULTS
// ============================================================
function showResults() {
  document.getElementById('wizard-section').classList.add('hidden');
  document.getElementById('results-section').classList.remove('hidden');
  document.getElementById('restart-header-btn').classList.remove('hidden');
  const ticker = document.getElementById('ticker-bar');
  if (ticker) ticker.classList.add('hidden');

  state.results = getMatchedLaptops(state.answers);
  renderResults(state.results);
  initWhatIf();
  updateFavoritesPanel();
  document.getElementById('used-markets-banner').classList.toggle('hidden', state.answers.condition !== 'used');
  document.getElementById('linux-note').classList.toggle('hidden', state.answers.os !== 'linux');

  const subtitle = document.getElementById('results-subtitle');
  const tierLabels = ['', 'Strict Match', 'Relaxed Match', 'Alternative Suggestions'];
  subtitle.textContent = `${state.results.length} laptops · ${tierLabels[state.matchTier]} · Rule-based inference applied`;
}

function handleSortChange() {
  const s = document.getElementById('sort-select').value;
  let sorted = [...state.results];
  if      (s === 'price-asc')  sorted.sort((a, b) => a.priceEUR - b.priceEUR);
  else if (s === 'price-desc') sorted.sort((a, b) => b.priceEUR - a.priceEUR);
  else if (s === 'value')      sorted.sort((a, b) => b.valueScore - a.valueScore);
  else if (s === 'confidence') sorted.sort((a, b) => b.confidence - a.confidence);
  else                         sorted.sort((a, b) => b.matchScore - a.matchScore);
  renderResults(sorted);
}

function renderResults(laptops) {
  document.getElementById('no-results').classList.add('hidden');
  renderRelaxationNotice();

  const topOverall = laptops[0];
  const topBudget  = [...laptops].sort((a, b) => (b.valueScore / b.priceEUR) - (a.valueScore / a.priceEUR))[0];
  const topPerf    = [...laptops].sort((a, b) => b.valueScore - a.valueScore)[0];
  document.getElementById('top-picks-container').innerHTML = renderTopThreePicks(topOverall, topBudget, topPerf);

  const grid = document.getElementById('results-grid');
  grid.innerHTML = laptops.map((l, i) => renderLaptopCard(l, i)).join('');

  state.compareList.forEach(id => {
    const cb = document.querySelector(`.compare-checkbox[data-id="${id}"]`);
    if (cb) setCompareCheckbox(cb, true);
  });

  // Restore favorite buttons
  state.favorites.forEach(id => {
    const btn = document.querySelector(`.fav-btn[data-id="${id}"]`);
    if (btn) { btn.classList.add('fav-active'); btn.textContent = '❤️'; }
  });
}

// ============================================================
// CONSTRAINT RELAXATION NOTICE
// ============================================================
function renderRelaxationNotice() {
  let el = document.getElementById('relaxation-notice');
  if (!el) {
    el = document.createElement('div');
    el.id = 'relaxation-notice';
    document.getElementById('top-picks-container').before(el);
  }
  if (state.matchTier === 1) { el.innerHTML = ''; return; }

  const tierMsg = state.matchTier === 2
    ? 'Your requirements were strict — fewer than 3 exact matches were found.'
    : 'No strict matches found — showing closest alternatives from the full knowledge base.';
  const relaxedStr = state.relaxedFields.length ? state.relaxedFields.join(', ') : 'secondary constraints';

  el.innerHTML = `
    <div class="mb-5 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
      <div class="flex items-start gap-3">
        <span class="text-amber-400 text-lg shrink-0">🔄</span>
        <div>
          <p class="text-amber-300 font-semibold text-sm mb-1">Constraint Relaxation Applied</p>
          <p class="text-amber-200/70 text-xs leading-relaxed">${tierMsg} The inference engine relaxed: <strong>${relaxedStr}</strong>. Results below are the best available matches with explanation of any mismatches.</p>
        </div>
      </div>
    </div>`;
}

// ============================================================
// FAVORITES (localStorage)
// ============================================================
function loadFavoritesFromStorage() {
  try {
    const saved = JSON.parse(localStorage.getItem('laptop-favorites') || '[]');
    state.favorites = new Set(saved);
  } catch {}
}

function saveFavoritesToStorage() {
  try {
    localStorage.setItem('laptop-favorites', JSON.stringify([...state.favorites]));
  } catch {}
}

function toggleFavorite(id, btn) {
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
    if (btn) { btn.textContent = '🤍'; btn.classList.remove('fav-active'); btn.title = 'Save to favorites'; }
  } else {
    state.favorites.add(id);
    if (btn) { btn.textContent = '❤️'; btn.classList.add('fav-active'); btn.title = 'Remove from favorites'; }
    // Pulse animation
    if (btn) { btn.classList.add('fav-pulse'); setTimeout(() => btn.classList.remove('fav-pulse'), 400); }
  }
  saveFavoritesToStorage();
  updateFavoritesPanel();
}

function updateFavoritesPanel() {
  const panel = document.getElementById('favorites-panel');
  const count = document.getElementById('favorites-count');
  if (count) count.textContent = state.favorites.size;
  if (!panel) return;
  if (state.favorites.size === 0) { panel.classList.add('hidden'); return; }
  panel.classList.remove('hidden');

  const list = document.getElementById('favorites-list');
  if (!list) return;
  list.innerHTML = [...state.favorites].map(id => {
    const laptop = state.results.find(l => l.id === id) || KNOWLEDGE_BASE.find(l => l.id === id);
    if (!laptop) return '';
    return `<div class="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
      <div>
        <p class="text-xs font-semibold text-slate-200">${laptop.name}</p>
        <p class="text-[10px] text-emerald-400">€${laptop.priceEUR?.toLocaleString?.() ?? ''}</p>
      </div>
      <button onclick="toggleFavorite('${id}', null); updateFavoritesPanel();" class="text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-0.5">✕</button>
    </div>`;
  }).join('');
}

// ============================================================
// SAVE / RESTORE ANSWERS (localStorage)
// ============================================================
function saveAnswersToStorage() {
  try {
    localStorage.setItem('laptop-answers', JSON.stringify(state.answers));
  } catch {}
}

function loadAnswersFromStorage() {
  try {
    const saved = JSON.parse(localStorage.getItem('laptop-answers'));
    if (saved && saved.budget) return saved;
  } catch {}
  return null;
}

// ============================================================
// SHARE RESULTS (URL hash encoding)
// ============================================================
function shareResults() {
  try {
    const encoded = btoa(JSON.stringify(state.answers));
    const url = `${location.origin}${location.pathname}#answers=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      showToast('🔗 Link copied to clipboard!');
    }).catch(() => {
      prompt('Copy this link:', url);
    });
  } catch (e) {
    showToast('❌ Could not generate share link');
  }
}

function initFromURL() {
  try {
    const hash = location.hash;
    if (!hash.includes('answers=')) return;
    const encoded = hash.split('answers=')[1];
    const answers = JSON.parse(atob(encoded));
    if (answers && answers.budget) {
      state.answers = { ...state.answers, ...answers };
      // Show banner offering to restore
      const banner = document.getElementById('restore-banner');
      if (banner) {
        banner.classList.remove('hidden');
        banner.querySelector('#restore-btn')?.addEventListener('click', () => {
          banner.classList.add('hidden');
          showResults();
        });
        banner.querySelector('#restore-dismiss')?.addEventListener('click', () => {
          banner.classList.add('hidden');
        });
      }
    }
  } catch {}
}

// ============================================================
// WHAT-IF ANALYSIS
// ============================================================
function initWhatIf() {
  const slider = document.getElementById('whatif-slider');
  const display = document.getElementById('whatif-display');
  if (!slider || !display) return;

  const origBudget = state.answers.budget || 1000;
  slider.min = Math.round(origBudget * 0.5);
  slider.max = Math.round(origBudget * 2.5);
  slider.value = origBudget;
  display.textContent = `€${origBudget.toLocaleString()}`;

  slider.addEventListener('input', () => {
    const v = parseInt(slider.value);
    display.textContent = `€${v.toLocaleString()}`;
  });
}

function runWhatIf() {
  const slider = document.getElementById('whatif-slider');
  if (!slider) return;
  const newBudget = parseInt(slider.value);
  const origBudget = state.answers.budget;

  // Temporarily override budget
  state.answers.budget = newBudget;
  state.results = getMatchedLaptops(state.answers);
  state.answers.budget = origBudget; // restore

  renderResults(state.results);
  showToast(`💡 What-If: Showing results for €${newBudget.toLocaleString()} budget`);

  const tierLabels = ['', 'Strict Match', 'Relaxed Match', 'Alternative Suggestions'];
  const subtitle = document.getElementById('results-subtitle');
  if (subtitle) subtitle.textContent = `${state.results.length} laptops · ${tierLabels[state.matchTier]} · What-If: €${newBudget.toLocaleString()} budget`;
}

// ============================================================
// PDF / PRINT EXPORT
// ============================================================
function exportPDF() {
  window.print();
}

// ============================================================
// RADAR CHART MODAL
// ============================================================
function openRadarModal(laptopId) {
  const laptop = state.results.find(l => l.id === laptopId) || KNOWLEDGE_BASE.find(l => l.id === laptopId);
  if (!laptop) return;

  const data = radarData(laptop);
  const axes = [
    { label: 'Performance', value: data.perf },
    { label: 'Battery',     value: data.batt },
    { label: 'Portability', value: data.port },
    { label: 'Value',       value: data.val  },
    { label: 'Display',     value: data.disp },
    { label: 'Build',       value: data.build },
  ];

  const svgStr = buildRadarSVG(axes, laptop.name);

  let modal = document.getElementById('radar-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'radar-modal';
    modal.className = 'fixed inset-0 z-[200] flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="closeRadarModal()"></div>
      <div class="relative glass-card rounded-2xl p-6 max-w-sm w-full border border-white/10 shadow-2xl">
        <button onclick="closeRadarModal()" class="absolute top-3 right-3 text-slate-400 hover:text-white text-lg">✕</button>
        <h3 id="radar-title" class="font-bold text-base mb-4 text-white pr-6"></h3>
        <div id="radar-svg-container" class="flex justify-center"></div>
        <div id="radar-axes-legend" class="grid grid-cols-2 gap-1.5 mt-4 text-xs"></div>
      </div>`;
    document.body.appendChild(modal);
  }

  document.getElementById('radar-title').textContent = `📊 ${laptop.name}`;
  document.getElementById('radar-svg-container').innerHTML = svgStr;
  document.getElementById('radar-axes-legend').innerHTML = axes.map(a =>
    `<div class="flex items-center gap-1.5">
      <div class="w-8 h-1.5 rounded-full bg-violet-500/50 overflow-hidden"><div class="h-full bg-violet-400 rounded-full" style="width:${a.value}%"></div></div>
      <span class="text-slate-400">${a.label}</span>
      <span class="text-violet-300 font-bold ml-auto">${Math.round(a.value)}</span>
    </div>`
  ).join('');

  modal.classList.remove('hidden');
}

function buildRadarSVG(axes, name) {
  const cx = 110, cy = 110, r = 85, n = axes.length;
  const angleStep = (Math.PI * 2) / n;
  const getPoint = (i, pct) => {
    const angle = i * angleStep - Math.PI / 2;
    const dist = (pct / 100) * r;
    return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist };
  };

  // Grid rings
  let rings = '';
  [20, 40, 60, 80, 100].forEach(pct => {
    const pts = axes.map((_, i) => {
      const p = getPoint(i, pct);
      return `${p.x},${p.y}`;
    }).join(' ');
    rings += `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>`;
  });

  // Spokes
  let spokes = '';
  axes.forEach((_, i) => {
    const p = getPoint(i, 100);
    spokes += `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
  });

  // Data polygon
  const dataPts = axes.map((a, i) => {
    const p = getPoint(i, a.value);
    return `${p.x},${p.y}`;
  }).join(' ');

  // Axis labels
  let labels = '';
  axes.forEach((a, i) => {
    const p = getPoint(i, 118);
    labels += `<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="middle"
      fill="#94a3b8" font-size="9" font-family="Outfit,sans-serif">${a.label}</text>`;
  });

  // Dots on data polygon
  let dots = '';
  axes.forEach((a, i) => {
    const p = getPoint(i, a.value);
    dots += `<circle cx="${p.x}" cy="${p.y}" r="3" fill="#8b5cf6"/>`;
  });

  return `<svg viewBox="0 0 220 220" width="220" height="220" xmlns="http://www.w3.org/2000/svg">
    ${rings}${spokes}
    <polygon points="${dataPts}" fill="rgba(139,92,246,0.2)" stroke="#8b5cf6" stroke-width="1.5"/>
    ${dots}${labels}
  </svg>`;
}

function closeRadarModal() {
  const modal = document.getElementById('radar-modal');
  if (modal) modal.classList.add('hidden');
}

// ============================================================
// TOAST NOTIFICATION
// ============================================================
function showToast(msg, duration = 2800) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 z-[300] px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-sm text-white shadow-xl transition-all duration-300 opacity-0 pointer-events-none';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(-4px)';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }, duration);
}

// ============================================================
// RESTART
// ============================================================
function restartApp() {
  state.step = 1; state.matchTier = 1; state.relaxedFields = [];
  state.answers = { budget: null, purpose: null, battery: null, portability: null, gaming: null, vmUse: null, ram: null, gpu: null, os: null, premium: null };
  state.results = []; state.compareList = [];
  localStorage.removeItem('laptop-answers');
  document.getElementById('wizard-section').classList.remove('hidden');
  document.getElementById('results-section').classList.add('hidden');
  document.getElementById('restart-header-btn').classList.add('hidden');
  document.getElementById('compare-bar').classList.add('hidden');
  document.getElementById('top-picks-container').innerHTML = '';
  const rn = document.getElementById('relaxation-notice'); if (rn) rn.innerHTML = '';
  closeCompareModal();
  closeRadarModal();
  const ticker = document.getElementById('ticker-bar');
  if (ticker) ticker.classList.remove('hidden');
  renderProgressDots();
  renderStep(1);
}

// ============================================================
// POPULAR HERO CARDS — top 2 from KB by valueScore
// ============================================================
function initPopularHeroCards() {
  const container = document.getElementById('popular-hero-cards');
  if (!container) return;

  // Diverse top-2: #1 overall + #1 gaming/performance
  const sorted = [...KNOWLEDGE_BASE].sort((a, b) => b.valueScore - a.valueScore);
  const top1 = sorted[0];
  const topGaming = sorted.find(l =>
    l.purpose?.includes('gaming') || l.id?.includes('gaming') ||
    l.id?.includes('legion') || l.id?.includes('rog') || l.id?.includes('strix')
  ) || sorted[2];

  const picks = [top1, topGaming];
  const rotations    = ['-2deg', '1.5deg'];
  const marginTops   = ['0',     '-8px'];
  const badgeStyles  = [
    'border-color:rgba(139,92,246,0.5);color:#a78bfa',
    'border-color:rgba(239,68,68,0.5);color:#f87171',
  ];
  const matchColors  = ['#a78bfa', '#f87171'];
  const matchLabels  = ['🏆 Most Popular', '🎮 Top Gaming'];

  container.innerHTML = picks.map((l, i) => {
    const cpu   = l.specs?.cpu?.split(' ').slice(0,3).join(' ') || '';
    const ram   = l.specs?.ramDisplay || (l.specs?.ram ? l.specs.ram + 'GB' : '');
    const batt  = l.specs?.batteryHours ? l.specs.batteryHours + 'h Batt' : '';
    return `
      <div class="laptop-hero-card" style="transform:rotate(${rotations[i]});margin-top:${marginTops[i]}">
        <div class="lhc-img-wrap">
          <img src="${l.image}" alt="${l.name}"
               onerror="this.src='${l.brandFallbackImage || '/laptops/default-laptop.jpg'}'">
          <div class="lhc-img-overlay"></div>
          <span class="lhc-score-badge" style="${badgeStyles[i]}">★ ${l.valueScore}/10</span>
        </div>
        <div class="lhc-info">
          <span class="lhc-brand">${(l.brand || '').toUpperCase()}</span>
          <span class="lhc-name">${l.name}</span>
          <span class="lhc-price">€${(l.priceEUR || 0).toLocaleString()}</span>
          <span class="lhc-match" style="color:${matchColors[i]}">${matchLabels[i]}</span>
          <div class="lhc-specs">
            ${cpu  ? `<span class="lhc-spec-badge">${cpu}</span>`  : ''}
            ${ram  ? `<span class="lhc-spec-badge">${ram}</span>`  : ''}
            ${batt ? `<span class="lhc-spec-badge">${batt}</span>` : ''}
          </div>
        </div>
      </div>`;
  }).join('');
}

// ============================================================
// HEADER RULE TICKER — cycles through all 18 IF-THEN rules
// ============================================================
function initRuleTicker() {
  const container = document.getElementById('header-rule-ticker');
  if (!container) return;

  const rules = [
    { num: 'R1',  cond: 'budget < €800',          then: 'budget tier' },
    { num: 'R2',  cond: 'gaming = serious',        then: 'GPU score +30' },
    { num: 'R3',  cond: 'portability = travel',    then: 'weight ≤ 1.5 kg' },
    { num: 'R4',  cond: 'os = macOS',              then: 'Apple only' },
    { num: 'R5',  cond: 'vmUse = yes',             then: 'RAM ≥ 16 GB req.' },
    { num: 'R6',  cond: 'battery = all-day',       then: 'runtime ≥ 12 h' },
    { num: 'R7',  cond: 'purpose = dev',           then: 'SSD speed +15' },
    { num: 'R8',  cond: 'premium = yes',           then: 'build quality +15' },
    { num: 'R9',  cond: 'ram = 32 GB',             then: 'workstation tier' },
    { num: 'R10', cond: 'condition = used',        then: 'refurb markets' },
    { num: 'R11', cond: 'gaming ∧ travel',         then: 'RTX 4060 slim' },
    { num: 'R12', cond: 'purpose = security',      then: 'ThinkPad priority' },
    { num: 'R13', cond: 'budget > €2000',          then: 'flagship tier' },
    { num: 'R14', cond: 'display = OLED',          then: 'OLED models +10' },
    { num: 'R15', cond: 'os = Linux',              then: 'ThinkPad +20' },
    { num: 'R16', cond: 'purpose = creative',      then: 'GPU + display' },
    { num: 'R17', cond: 'gaming ∧ budget < €1000', then: 'RTX 4060 mid-range' },
    { num: 'R18', cond: 'vmUse ∧ ram < 16 GB',    then: '32 GB DDR5 required' },
  ];

  let current = 0;
  let currentEl = null;

  function showRule(index) {
    const rule = rules[index];

    // Animate out old element
    if (currentEl) {
      const old = currentEl;
      old.classList.remove('rule-tick-in');
      old.classList.add('rule-tick-out');
      setTimeout(() => { if (old.parentNode) old.parentNode.removeChild(old); }, 320);
    }

    // Build new element
    const el = document.createElement('div');
    el.className = 'rule-tick-item rule-tick-in';
    el.innerHTML =
      `<span class="rule-num">${rule.num}</span>` +
      `<span class="rule-kw">IF</span>` +
      `<span class="rule-cond">${rule.cond}</span>` +
      `<span class="rule-arrow">→</span>` +
      `<span class="rule-then">${rule.then}</span>`;
    container.appendChild(el);
    currentEl = el;
  }

  showRule(0);
  setInterval(() => {
    current = (current + 1) % rules.length;
    showRule(current);
  }, 2600);
}

// ============================================================
// LIGHT / DARK THEME TOGGLE
// ============================================================
function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = isLight ? '☀️' : '🌙';
  try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); } catch {}
}

function restoreTheme() {
  try {
    if (localStorage.getItem('theme') === 'light') {
      document.body.classList.add('light-mode');
      const btn = document.getElementById('theme-toggle');
      if (btn) btn.textContent = '☀️';
    }
  } catch {}
}

// ============================================================
// EXPOSE GLOBALS (required for inline HTML event handlers)
// ============================================================
window.handleBudgetNext    = handleBudgetNext;
window.selectOption        = selectOption;
window.skipStep            = skipStep;
window.prevStep            = prevStep;
window.restartApp          = restartApp;
window.handleImageError    = handleImageError;
window.handleCompareToggle = handleCompareToggle;
window.removeFromCompare   = removeFromCompare;
window.clearCompare        = clearCompare;
window.openCompareModal    = openCompareModal;
window.closeCompareModal   = closeCompareModal;
// Chat Expert System
window.openChatModal       = openChatModal;
window.closeChatModal      = closeChatModal;
window.handleChatKeydown   = handleChatKeydown;
window.submitChatInput     = submitChatInput;
window.chatQuickReply      = chatQuickReply;
window.restartChat         = restartChat;
// New features
window.toggleFavorite      = toggleFavorite;
window.updateFavoritesPanel = updateFavoritesPanel;
window.shareResults        = shareResults;
window.runWhatIf           = runWhatIf;
window.exportPDF           = exportPDF;
window.openRadarModal      = openRadarModal;
window.closeRadarModal     = closeRadarModal;
window.showToast           = showToast;
window.toggleTheme         = toggleTheme;

// ============================================================
// BOOT
// ============================================================
restoreTheme();
init();
