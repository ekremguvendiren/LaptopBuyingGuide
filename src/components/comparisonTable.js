// ============================================================
// Comparison Table Component — bar, modal, and table rendering
// ============================================================
import { KNOWLEDGE_BASE, EUR_TO_GBP } from '../data/laptops.js';
import { BADGE_COLORS } from '../data/rules.js';
import { matchQualityLabel } from '../utils/recommendationEngine.js';
import { state } from '../state.js';

export function setCompareCheckbox(cb, on) {
  const lbl = cb.closest('label'); if (!lbl) return;
  const tg = lbl.querySelector('.compare-toggle'), cm = lbl.querySelector('.check-mark');
  if (on) { tg.classList.add('bg-violet-600', 'border-violet-500'); cm.classList.remove('hidden'); cb.checked = true; }
  else    { tg.classList.remove('bg-violet-600', 'border-violet-500'); cm.classList.add('hidden'); cb.checked = false; }
}

export function updateCompareBar() {
  const bar = document.getElementById('compare-bar');
  const slots = document.getElementById('compare-slots');
  const btn = document.getElementById('open-compare-btn');
  if (!state.compareList.length) { bar.classList.add('hidden'); return; }
  bar.classList.remove('hidden');
  slots.innerHTML = state.compareList.map(id => {
    const l = KNOWLEDGE_BASE.find(x => x.id === id); if (!l) return '';
    return `<div class="flex items-center gap-1.5 bg-slate-800 rounded-lg px-2.5 py-1.5">
      <span class="text-xs text-slate-200 max-w-[120px] truncate">${l.name}</span>
      <button class="text-slate-500 hover:text-white text-xs ml-1" onclick="removeFromCompare('${id}')">✕</button>
    </div>`;
  }).join('');
  btn.disabled = state.compareList.length < 2;
  btn.textContent = state.compareList.length < 2
    ? `Select ${2 - state.compareList.length} more`
    : 'Compare Side-by-Side →';
}

export function handleCompareToggle(cb) {
  const id = cb.dataset.id;
  if (cb.checked) {
    if (state.compareList.length >= 3) { cb.checked = false; return; }
    state.compareList.push(id);
    setCompareCheckbox(cb, true);
  } else {
    state.compareList = state.compareList.filter(i => i !== id);
    setCompareCheckbox(cb, false);
  }
  updateCompareBar();
}

export function removeFromCompare(id) {
  state.compareList = state.compareList.filter(i => i !== id);
  const cb = document.querySelector(`.compare-checkbox[data-id="${id}"]`);
  if (cb) setCompareCheckbox(cb, false);
  updateCompareBar();
}

export function clearCompare() {
  state.compareList.forEach(id => {
    const cb = document.querySelector(`.compare-checkbox[data-id="${id}"]`);
    if (cb) setCompareCheckbox(cb, false);
  });
  state.compareList = [];
  updateCompareBar();
}

export function openCompareModal() {
  if (state.compareList.length < 2) return;
  renderCompareTable();
  document.getElementById('compare-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

export function closeCompareModal() {
  document.getElementById('compare-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

export function renderCompareTable() {
  const laptops = state.compareList.map(id => {
    const b = KNOWLEDGE_BASE.find(l => l.id === id);
    const r = state.results.find(l => l.id === id);
    return r || b;
  }).filter(Boolean);

  const rows = [
    { label: 'Brand',         get: l => l.brand },
    { label: 'Price (EUR)',   get: l => `<span class="text-emerald-400 font-bold">€${l.priceEUR.toLocaleString()}</span>` },
    { label: 'Price (GBP)',   get: l => `£${Math.round(l.priceEUR * EUR_TO_GBP).toLocaleString()}` },
    { label: 'Expert Score',  get: l => `${l.valueScore}/10` },
    { label: 'Confidence',    get: l => l.confidence ? `<span class="font-bold text-violet-400">${l.confidence}%</span>` : '—' },
    { label: 'Match Quality', get: l => l.confidence ? `<span class="${matchQualityLabel(l.confidence).color} font-semibold">${matchQualityLabel(l.confidence).label}</span>` : '—' },
    { label: 'CPU',           get: l => l.specs.cpu },
    { label: 'GPU',           get: l => l.specs.gpu },
    { label: 'RAM',           get: l => l.specs.ramDisplay },
    { label: 'Storage',       get: l => l.specs.storage },
    { label: 'Display',       get: l => l.specs.display },
    { label: 'Weight',        get: l => l.specs.weightDisplay },
    { label: 'Battery',       get: l => l.specs.battery },
    { label: 'Build',         get: l => l.specs.buildQuality },
    { label: 'RAM Upgradeable', get: l => l.specs.upgradeableRam ? '✓ Yes' : '✗ Soldered' },
    { label: 'OS',            get: l => l.specs.os === 'macos' ? 'macOS' : 'Windows 11' },
    { label: 'Best For',      get: l => l.bestFor.slice(0, 2).join(', ') },
    { label: 'Buy Links',     get: l => `<div class="flex flex-col gap-1">
      <a href="${l.links?.amazonde || ''}" target="_blank" class="text-xs text-violet-400 hover:text-white underline">Amazon.de →</a>
      <a href="${l.links?.amazones || ''}" target="_blank" class="text-xs text-violet-400 hover:text-white underline">Amazon.es →</a>
      <a href="${l.links?.mediamarkt || ''}" target="_blank" class="text-xs text-violet-400 hover:text-white underline">MediaMarkt →</a>
    </div>` },
  ];

  const cw = laptops.length === 2 ? 'w-1/2' : 'w-1/3';
  document.getElementById('compare-table-container').innerHTML = `
    <table class="w-full text-sm compare-table"><thead><tr class="border-b border-white/10">
      <th class="text-left text-slate-500 text-xs uppercase py-3 pr-4 w-28">Spec</th>
      ${laptops.map(l => `<th class="text-left py-3 px-3 ${cw}">
        <p class="text-[10px] text-slate-500 uppercase">${l.brand}</p>
        <p class="font-bold text-white text-sm">${l.name}</p>
        <span class="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${BADGE_COLORS[l.badgeColor] || BADGE_COLORS.slate}">${l.badge}</span>
      </th>`).join('')}
    </tr></thead><tbody>
      ${rows.map((row, i) => `<tr class="border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}">
        <td class="text-slate-500 text-xs font-medium py-3 pr-4 align-top">${row.label}</td>
        ${laptops.map(l => `<td class="py-3 px-3 text-slate-200 text-xs align-top">${row.get(l)}</td>`).join('')}
      </tr>`).join('')}
    </tbody></table>`;
}
