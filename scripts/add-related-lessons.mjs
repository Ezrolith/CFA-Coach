// One-shot script: add `relatedLessons` to selected lesson JSONs.
// Designed to be idempotent — running twice gives the same result.
//
// Keep the cross-references small (typically 2-4 per lesson) and purposeful:
// linking concepts that build on each other or that students will want to
// flip between during revision.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LESSONS_DIR = join(__dirname, '..', 'content', 'lessons');

// lessonId -> [ { id, why } ]
const RELATED = {
  // === Fixed Income cluster ===
  'fi-dur-overview': [
    { id: 'fi-conv-overview',     why: 'Convexity refines duration for larger yield moves.' },
    { id: 'fi-ir-overview',       why: 'Sources of return and the duration vs horizon relationship.' },
    { id: 'fi-curve-overview',    why: 'Key-rate duration handles non-parallel curve shifts.' },
  ],
  'fi-conv-overview': [
    { id: 'fi-dur-overview',      why: 'Duration is the first-order term; convexity is the second.' },
    { id: 'fi-mbs-overview',      why: 'MBS exhibit negative convexity at low yields.' },
    { id: 'fi-curve-overview',    why: 'Curve-based risk measures extend convexity ideas.' },
  ],
  'fi-curve-overview': [
    { id: 'fi-dur-overview',      why: 'Foundational parallel-shift duration measures.' },
    { id: 'fi-conv-overview',     why: 'Convexity for large parallel moves.' },
    { id: 'fi-ts-overview',       why: 'Term structure shapes drive non-parallel risk.' },
    { id: 'fi-cr-overview',       why: 'Spread duration is a key curve measure for credit.' },
  ],
  'fi-ir-overview': [
    { id: 'fi-dur-overview',      why: 'Macaulay duration = the horizon at which price/reinvestment offset.' },
    { id: 'fi-conv-overview',     why: 'Adds second-order correction for large rate moves.' },
    { id: 'fi-ts-overview',       why: 'How rate-curve shapes drive total return.' },
  ],
  'fi-ts-overview': [
    { id: 'fi-val-overview',      why: 'Spot rates discount each bond cash flow individually.' },
    { id: 'fi-yf-overview',       why: 'Short-end of the curve uses different yield conventions.' },
    { id: 'fi-ir-overview',       why: 'Curve shape drives return realisations.' },
    { id: 'deriv-fp-overview',    why: 'Forward rates derived from the spot curve.' },
  ],
  'fi-val-overview': [
    { id: 'fi-ym-overview',       why: 'YTM and yield spread measures for fixed-rate bonds.' },
    { id: 'fi-ts-overview',       why: 'Spot rates as discount factors.' },
    { id: 'fi-dur-overview',      why: 'Once you can price the bond, measure its rate sensitivity.' },
  ],
  'fi-ym-overview': [
    { id: 'fi-val-overview',      why: 'Pricing mechanics behind every yield measure.' },
    { id: 'fi-yf-overview',       why: 'Yields for floating-rate and money market instruments.' },
    { id: 'fi-cr-overview',       why: 'Z-spread vs OAS dissects credit & option premia.' },
  ],
  'fi-yf-overview': [
    { id: 'fi-ym-overview',       why: 'Fixed-rate yield conventions for comparison.' },
    { id: 'fi-mkt-overview',      why: 'Commercial paper and repos sit in this short-end market.' },
  ],
  'fi-cr-overview': [
    { id: 'fi-cc-overview',       why: 'Quantitative + qualitative analysis of corporate borrowers.' },
    { id: 'fi-cag-overview',      why: 'How sovereign credit differs from corporate.' },
    { id: 'fi-curve-overview',    why: 'Spread duration measures credit-spread sensitivity.' },
  ],
  'fi-cc-overview': [
    { id: 'fi-cr-overview',       why: 'Core credit-risk concepts and seniority.' },
    { id: 'fi-feat-overview',     why: 'Covenants and indenture terms feed the qualitative side.' },
    { id: 'fra-tech-overview',    why: 'Financial analysis techniques and ratios used in credit analysis.' },
  ],
  'fi-cag-overview': [
    { id: 'fi-cr-overview',       why: 'Credit-risk fundamentals applied to sovereigns.' },
    { id: 'econ-er-overview',     why: 'FX dynamics matter heavily for sovereign credit.' },
  ],
  'fi-sec-overview': [
    { id: 'fi-abs-overview',      why: 'Non-mortgage securitised products.' },
    { id: 'fi-mbs-overview',      why: 'Mortgage-backed securitisations.' },
    { id: 'fi-cr-overview',       why: 'Tranching reallocates credit risk.' },
  ],
  'fi-abs-overview': [
    { id: 'fi-sec-overview',      why: 'Securitisation mechanics that underlie ABS.' },
    { id: 'fi-mbs-overview',      why: 'Mortgage-backed counterpart.' },
  ],
  'fi-mbs-overview': [
    { id: 'fi-sec-overview',      why: 'Securitisation framework.' },
    { id: 'fi-conv-overview',     why: 'MBS show negative convexity from prepayment optionality.' },
    { id: 'fi-curve-overview',    why: 'Empirical duration is essential for MBS.' },
  ],
  'fi-feat-overview': [
    { id: 'fi-cf-overview',       why: 'How different cash-flow structures shape risk.' },
    { id: 'fi-cr-overview',       why: 'Seniority and covenants are credit-risk levers.' },
  ],
  'fi-cf-overview': [
    { id: 'fi-feat-overview',     why: 'Bond features that create these cash flows.' },
    { id: 'fi-mbs-overview',      why: 'Contingent cash flows in mortgage securitisations.' },
  ],
  'fi-iss-overview': [
    { id: 'fi-mkt-overview',      why: 'Corporate short- and long-term funding markets.' },
    { id: 'fi-gov-overview',      why: 'Government issuers and their auction mechanics.' },
  ],
  'fi-mkt-overview': [
    { id: 'fi-yf-overview',       why: 'Money-market yield conventions used here.' },
    { id: 'fi-iss-overview',      why: 'Issuance and trading structure.' },
  ],
  'fi-gov-overview': [
    { id: 'fi-iss-overview',      why: 'Auctions and primary issuance practices.' },
    { id: 'fi-cag-overview',      why: 'Credit analysis for sovereign issuers.' },
  ],

  // === Derivatives cluster ===
  'deriv-feat-overview': [
    { id: 'deriv-ff-overview',    why: 'Distinguishing forward commitments from contingent claims.' },
    { id: 'deriv-br-overview',    why: 'Why derivatives exist — benefits and risks.' },
  ],
  'deriv-ff-overview': [
    { id: 'deriv-feat-overview',  why: 'Underlying definitions and market features.' },
    { id: 'deriv-op-overview',    why: 'Detailed mechanics of options.' },
    { id: 'deriv-pcp-overview',   why: 'Put-call parity links calls and puts.' },
  ],
  'deriv-br-overview': [
    { id: 'deriv-feat-overview',  why: 'Instrument features that produce these risks.' },
    { id: 'deriv-irs-overview',   why: 'A worked example of issuer hedging.' },
  ],
  'deriv-arb-overview': [
    { id: 'deriv-fp-overview',    why: 'Forward pricing comes directly from no-arbitrage.' },
    { id: 'deriv-pcp-overview',   why: 'Put-call parity is no-arbitrage for options.' },
    { id: 'fi-ts-overview',       why: 'Forward rates from spot rates use the same logic.' },
  ],
  'deriv-fp-overview': [
    { id: 'deriv-arb-overview',   why: 'No-arbitrage logic underpins forward pricing.' },
    { id: 'deriv-futp-overview',  why: 'How futures pricing compares.' },
    { id: 'fi-ts-overview',       why: 'Implied forward rates from the spot curve.' },
  ],
  'deriv-futp-overview': [
    { id: 'deriv-fp-overview',    why: 'Forward pricing is the conceptual baseline.' },
    { id: 'deriv-arb-overview',   why: 'Cost of carry and convergence to spot.' },
  ],
  'deriv-irs-overview': [
    { id: 'deriv-fp-overview',    why: 'A swap is conceptually a strip of forwards.' },
    { id: 'fi-ts-overview',       why: 'Swap rate is a PV-weighted forward-rate average.' },
  ],
  'deriv-op-overview': [
    { id: 'deriv-pcp-overview',   why: 'Put-call parity links call and put prices.' },
    { id: 'deriv-bin-overview',   why: 'Binomial model gives numeric option prices.' },
    { id: 'deriv-ff-overview',    why: 'Payoff structure of calls and puts.' },
  ],
  'deriv-pcp-overview': [
    { id: 'deriv-op-overview',    why: 'Concepts of moneyness, time value, and exercise.' },
    { id: 'deriv-bin-overview',   why: 'Binomial valuation uses replication logic too.' },
    { id: 'deriv-arb-overview',   why: 'Parity is a no-arbitrage statement.' },
  ],
  'deriv-bin-overview': [
    { id: 'deriv-op-overview',    why: 'Option factors fed into the binomial tree.' },
    { id: 'deriv-pcp-overview',   why: 'Cross-check American vs European via parity.' },
  ],

  // === Quant cluster ===
  'quant-prob-overview': [
    { id: 'quant-portmath-overview', why: 'Expected value, variance and covariance applied to portfolios.' },
    { id: 'quant-stats-overview',    why: 'Sample statistics that estimate these moments.' },
  ],
  'quant-portmath-overview': [
    { id: 'quant-prob-overview', why: 'Expected return and variance from joint distributions.' },
    { id: 'pm-rr2-overview',     why: 'Mean-variance portfolio theory uses this directly.' },
    { id: 'quant-stats-overview', why: 'Correlation and covariance sample estimates.' },
  ],
  'quant-stats-overview': [
    { id: 'quant-portmath-overview', why: 'Volatility and correlation feed into portfolio risk.' },
    { id: 'quant-est-overview',      why: 'Sampling distributions and standard errors.' },
  ],
  'quant-sim-overview': [
    { id: 'quant-est-overview',      why: 'Bootstrap resampling is a simulation technique.' },
    { id: 'quant-prob-overview',     why: 'Distributions used in Monte Carlo simulation.' },
  ],
  'quant-est-overview': [
    { id: 'quant-hyp-overview',      why: 'Hypothesis testing builds on sampling distributions.' },
    { id: 'quant-stats-overview',    why: 'Sample statistics — what estimation produces.' },
    { id: 'quant-sim-overview',      why: 'Bootstrap as a resampling estimator.' },
  ],
  'quant-hyp-overview': [
    { id: 'quant-est-overview',      why: 'Sampling theory underpins test statistics.' },
    { id: 'quant-paramtests-overview', why: 'Specific parametric / non-parametric tests.' },
    { id: 'quant-slr-overview',      why: 'Regression coefficients tested with the same framework.' },
  ],
  'quant-paramtests-overview': [
    { id: 'quant-hyp-overview',      why: 'General hypothesis-testing framework.' },
    { id: 'quant-slr-overview',      why: 'Tests on regression coefficients and correlation.' },
  ],
  'quant-slr-overview': [
    { id: 'quant-hyp-overview',      why: 'Coefficient t-tests and overall F-test.' },
    { id: 'quant-stats-overview',    why: 'Correlation is the building block of slope estimation.' },
    { id: 'quant-bigdata-overview',  why: 'Regression as the simplest supervised ML model.' },
  ],
  'quant-bigdata-overview': [
    { id: 'quant-slr-overview',      why: 'Linear regression is the simplest supervised ML model.' },
    { id: 'quant-sim-overview',      why: 'Simulation and resampling techniques used in ML evaluation.' },
  ],

  // === Equity ↔ FRA ↔ Corp ===
  'eq-val-overview': [
    { id: 'eq-fc-overview',          why: 'Company analysis and forecasting feed valuation inputs.' },
    { id: 'fra-tech-overview',       why: 'Ratios that feed multiples-based valuation.' },
    { id: 'corp-bm-overview',        why: 'Business model affects valuation framework choice.' },
  ],

  // === Alts ↔ PM ===
  'alts-da-overview': [
    { id: 'alts-perf-overview',      why: 'How alternative-asset performance is measured.' },
    { id: 'pm-bb-overview',          why: 'Behavioural biases especially relevant in crypto markets.' },
  ],
};

// Run.
let updated = 0;
let skipped = 0;
const missing = [];

for (const [lessonId, items] of Object.entries(RELATED)) {
  const filename = `${lessonId}.json`;
  const filepath = join(LESSONS_DIR, filename);
  let raw;
  try {
    raw = readFileSync(filepath, 'utf8');
  } catch {
    missing.push(filename);
    continue;
  }
  const data = JSON.parse(raw);

  // Validate referenced IDs exist as lesson files
  const validItems = items.filter(item => {
    const targetPath = join(LESSONS_DIR, `${item.id}.json`);
    try { readFileSync(targetPath, 'utf8'); return true; }
    catch { console.warn(`  [warn] ${lessonId} → ${item.id} (missing target)`); return false; }
  });

  // Idempotency: replace any existing relatedLessons array.
  data.relatedLessons = validItems;

  // Pretty-print, keeping 2-space indent to match repo style.
  writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  updated++;
}

console.log(`Updated ${updated} lesson file(s)`);
if (skipped) console.log(`Skipped: ${skipped}`);
if (missing.length) console.log(`Missing files: ${missing.join(', ')}`);
