// ============================================================
// Knowledge Base Panel Component
// Renders the expandable KB overview in the results section
// ============================================================
import { KNOWLEDGE_BASE } from '../data/laptops.js';
import { INFERENCE_RULES, STEPS } from '../data/rules.js';

export function renderKnowledgeBaseStats() {
  // Laptop count is intentionally hidden from the UI
  // const el = document.getElementById('kb-stats-laptops');
  // if (el) el.textContent = KNOWLEDGE_BASE.length;

  const rulesEl = document.getElementById('kb-stats-rules');
  if (rulesEl) rulesEl.textContent = INFERENCE_RULES.length;

  const questionsEl = document.getElementById('kb-stats-questions');
  if (questionsEl) questionsEl.textContent = STEPS.length;

  renderRuleList();
}

function renderRuleList() {
  const container = document.getElementById('rule-list-container');
  if (!container) return;
  container.innerHTML = INFERENCE_RULES.map(r => `
    <div class="flex flex-wrap gap-x-1.5 gap-y-0.5 items-baseline font-mono text-[10px] leading-relaxed px-2 py-1.5 rounded-lg bg-slate-800/60 border border-white/[0.04]">
      <span class="text-emerald-400 font-bold shrink-0">[${r.id}]</span>
      <span class="text-violet-300 font-semibold shrink-0">IF</span>
      <span class="text-slate-300">${r.ifPart || r.name}</span>
      <span class="text-cyan-300 font-semibold shrink-0">THEN</span>
      <span class="text-slate-400">${r.thenPart || ''}</span>
    </div>
  `).join('');
}
