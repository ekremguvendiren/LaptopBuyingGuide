// ============================================================
// Recommendation Engine — Rule Firing, Scoring, Confidence,
// 3-Tier Fallback, Match Badges, Match Quality Labels
// ============================================================
import { KNOWLEDGE_BASE } from '../data/laptops.js';
import { INFERENCE_RULES } from '../data/rules.js';
import { state } from '../state.js';

// ── Match Quality Label ──────────────────────────────────────
export function matchQualityLabel(confidence) {
  if (confidence >= 85) return { label: 'Excellent Match', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' };
  if (confidence >= 70) return { label: 'Good Match',      color: 'text-blue-400',    bg: 'bg-blue-500/15 border-blue-500/30' };
  if (confidence >= 55) return { label: 'Partial Match',   color: 'text-amber-400',   bg: 'bg-amber-500/15 border-amber-500/30' };
  return                       { label: 'Alternative',     color: 'text-slate-400',   bg: 'bg-slate-500/15 border-slate-500/30' };
}

export function getScoreClass(s) {
  return s >= 9.0 ? 'score-green' : s >= 8.0 ? 'score-blue' : s >= 7.0 ? 'score-yellow' : 'score-orange';
}

// ── Rule-Based Inference Engine ──────────────────────────────
export function runInferenceEngine(laptop, answers) {
  const activatedRules = [];
  let score = 50;
  for (const rule of INFERENCE_RULES) {
    if (rule.condition(answers)) {
      const r = rule.apply(laptop, answers);
      score += r.score;
      if (r.reason) activatedRules.push({ id: rule.id, name: rule.name, score: r.score, reason: r.reason, matched: r.match });
    }
  }
  // Budget proximity bonus
  if (answers.budget) {
    const diff = answers.budget - laptop.priceEUR;
    score += diff >= 0 ? (1 - diff / answers.budget) * 20 : Math.max(0, 10 + diff / 80);
  }
  // Value score bonus
  score += (laptop.valueScore - 7) * 3;
  return { score: Math.max(0, score), activatedRules };
}

// ── Confidence Score ─────────────────────────────────────────
export function computeConfidence(laptop, answers, activatedRules) {
  const checks = [
    answers.os === 'any' || !answers.os ? true : answers.os === 'linux' ? laptop.specs.os !== 'macos' : laptop.specs.os === answers.os,
    laptop.specs.ram >= (parseInt(answers.ram) || 8),
    answers.gpu === 'yes' ? laptop.hasGpu : answers.gpu === 'no' ? !laptop.hasGpu : true,
    answers.battery === 'yes' ? laptop.specs.batteryHours >= 10 : true,
    answers.portability === 'travel' ? laptop.specs.weight <= 1.6 : answers.portability === 'desk' ? laptop.specs.weight >= 1.5 : true,
    laptop.priceEUR <= answers.budget * 1.2,
    answers.gaming === 'serious' ? laptop.hasGpu : true,
    answers.vmUse === 'yes' ? laptop.specs.ram >= 16 : true,
    answers.premium === 'yes' ? ['aluminum', 'carbon-fiber', 'military-grade'].includes(laptop.specs.buildQuality) : true,
  ];
  const base = Math.round(checks.filter(Boolean).length / checks.length * 100);
  const ruleRate = activatedRules.length > 0 ? activatedRules.filter(r => r.matched).length / activatedRules.length : 0.5;
  return Math.min(99, Math.round(base * 0.6 + ruleRate * 100 * 0.4));
}

// ── Match Badges & Warnings ──────────────────────────────────
export function generateMatchBadges(laptop, answers) {
  const badges = [], warnings = [];
  if (laptop.priceEUR <= answers.budget)          badges.push('✓ Within your budget');
  if (laptop.priceEUR <= answers.budget * 0.8)    badges.push('✓ Significantly under budget');
  if (laptop.specs.batteryHours >= 15)            badges.push('✓ Excellent battery life');
  else if (laptop.specs.batteryHours >= 10)       badges.push('✓ Good battery life');
  if (laptop.specs.weight <= 1.3)                 badges.push('✓ Ultra-lightweight');
  else if (laptop.specs.weight <= 1.6)            badges.push('✓ Lightweight & portable');
  if (laptop.hasGpu && answers.gpu === 'yes')     badges.push('✓ Dedicated GPU matched');
  if (laptop.specs.ram >= 32)                     badges.push('✓ High RAM (32GB+)');
  else if (laptop.specs.ram >= 16)                badges.push('✓ Sufficient RAM (16GB)');
  if (laptop.specs.display.toLowerCase().includes('oled')) badges.push('✓ OLED display');
  if (laptop.specs.upgradeableRam)                badges.push('✓ RAM upgradeable');
  if (laptop.valueScore >= 9.0)                   badges.push('✓ Top value score');
  if (['aluminum', 'carbon-fiber'].includes(laptop.specs.buildQuality)) badges.push('✓ Premium build');
  if (laptop.specs.refreshRate >= 120)            badges.push('✓ High refresh rate');
  if (answers.purpose && laptop.purpose.includes(answers.purpose)) badges.push('✓ Matched to your use case');
  if (answers.os === 'linux' && (laptop.id.includes('thinkpad') || laptop.id.includes('framework'))) badges.push('✓ Best Linux compatibility');

  if (laptop.priceEUR > answers.budget)           warnings.push('⚠ Slightly over your budget');
  if (laptop.priceEUR > answers.budget * 1.3)     warnings.push('⚠ Significantly over budget');
  if (answers.gaming === 'serious' && !laptop.hasGpu) warnings.push('⚠ No dedicated GPU for gaming');
  if (answers.battery === 'yes' && laptop.specs.batteryHours < 8) warnings.push('⚠ Short battery for your needs');
  if (answers.portability === 'travel' && laptop.specs.weight > 1.8) warnings.push('⚠ Heavy for frequent travel');
  if (answers.vmUse === 'yes' && laptop.specs.ram < 16) warnings.push('⚠ Low RAM for virtual machines');
  if (answers.ram && laptop.specs.ram < parseInt(answers.ram)) warnings.push(`⚠ RAM below your ${answers.ram}GB requirement`);
  if (!laptop.specs.upgradeableRam && answers.upgradeable === 'yes') warnings.push('⚠ RAM is soldered — not upgradeable');
  if (laptop.specs.buildQuality === 'plastic' && answers.premium === 'yes') warnings.push('⚠ Plastic chassis — not premium');
  if (laptop.specs.batteryHours <= 5 && answers.portability !== 'desk') warnings.push('⚠ Very short battery away from desk');
  return { badges, warnings };
}

// ── 3-Tier Fallback Engine ───────────────────────────────────
export function getMatchedLaptops(answers) {
  const score = (l) => {
    const { score, activatedRules } = runInferenceEngine(l, answers);
    const confidence = computeConfidence(l, answers, activatedRules);
    const { badges, warnings } = generateMatchBadges(l, answers);
    return { ...l, matchScore: score, confidence, activatedRules, badges, warnings };
  };

  const osOk = (l) => {
    if (!answers.os || answers.os === 'any') return true;
    if (answers.os === 'linux')   return l.specs.os !== 'macos';
    if (answers.os === 'macos')   return l.specs.os === 'macos';
    if (answers.os === 'windows') return l.specs.os !== 'macos';
    return true;
  };

  // ── Tier 1: Strict ──────────────────────────────────────────
  const ramReq = Math.min(parseInt(answers.ram) || 8, 32);
  const tier1 = KNOWLEDGE_BASE
    .filter(l => osOk(l) && (answers.gpu !== 'yes' || l.hasGpu) && l.specs.ram >= ramReq && l.priceEUR <= answers.budget * 1.25)
    .map(score).sort((a, b) => b.matchScore - a.matchScore).slice(0, 9);

  if (tier1.length >= 3) {
    state.matchTier = 1; state.relaxedFields = [];
    return tier1;
  }

  // ── Tier 2: Relaxed ─────────────────────────────────────────
  const relaxed = [];
  if (answers.gpu === 'yes' && tier1.length < 3) relaxed.push('dedicated GPU requirement');
  const ramRelaxed = Math.max(8, ramReq - 8);
  if (ramRelaxed < ramReq) relaxed.push('RAM minimum');
  relaxed.push('budget range (+50%)');

  const tier2 = KNOWLEDGE_BASE
    .filter(l => osOk(l) && l.specs.ram >= ramRelaxed && l.priceEUR <= answers.budget * 1.5)
    .map(score).sort((a, b) => b.matchScore - a.matchScore).slice(0, 9);

  if (tier2.length >= 3) {
    state.matchTier = 2; state.relaxedFields = relaxed;
    return tier2;
  }

  // ── Tier 3: Alternatives (only OS conflicts excluded) ────────
  relaxed.push('OS preference', 'budget limit');
  const tier3 = KNOWLEDGE_BASE
    .map(score).sort((a, b) => b.matchScore - a.matchScore).slice(0, 9);

  state.matchTier = 3; state.relaxedFields = relaxed;
  return tier3;
}
