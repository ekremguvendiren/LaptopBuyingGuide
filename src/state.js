// ============================================================
// Shared Mutable State — imported by all modules that need it
// ============================================================
export const state = {
  step: 1,
  totalSteps: 10,
  answers: {
    budget: null, purpose: null, battery: null, portability: null,
    gaming: null, vmUse: null, ram: null, gpu: null, os: null, premium: null,
  },
  results: [],
  compareList: [],
  matchTier: 1,
  relaxedFields: [],
  favorites: new Set(),   // laptop IDs saved to favorites
  whatIfBudget: null,     // overrides answers.budget for what-if mode
};
