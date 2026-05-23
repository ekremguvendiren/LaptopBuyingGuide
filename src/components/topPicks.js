// ============================================================
// Top 3 Recommendations Panel Component
// ============================================================
import { EUR_TO_GBP } from '../data/laptops.js';
import { matchQualityLabel } from '../utils/recommendationEngine.js';

export function renderTopThreePicks(overall, budget, perf) {
  const picks = [
    { label: '🏆 Best Overall Match', laptop: overall, color: 'violet' },
    { label: '💰 Best Budget Match',  laptop: budget,  color: 'emerald' },
    { label: '⚡ Best Performance',   laptop: perf,    color: 'cyan' },
  ];
  return `<div class="mb-8 p-5 glass-card rounded-2xl border border-violet-500/20">
    <h3 class="text-lg font-bold mb-1 gradient-text">Expert System Top 3 Recommendations</h3>
    <p class="text-xs text-slate-500 mb-4">Inference engine identified these as strongest matches across three evaluation categories.</p>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      ${picks.map(({ label, laptop, color }) => {
        if (!laptop) return '';
        const mq = matchQualityLabel(laptop.confidence);
        return `<div class="p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20">
          <p class="text-[10px] font-bold text-${color}-400 uppercase tracking-wider mb-1">${label}</p>
          <p class="font-bold text-white text-sm leading-tight">${laptop.name}</p>
          <div class="flex items-center gap-2 mt-1.5">
            <span class="text-emerald-400 font-bold text-sm">€${laptop.priceEUR.toLocaleString()}</span>
            <span class="text-slate-500 text-xs">/ £${Math.round(laptop.priceEUR * EUR_TO_GBP)}</span>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-xs ${mq.color} font-semibold">${mq.label}</span>
            <span class="text-xs text-slate-500">${laptop.confidence}%</span>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}
