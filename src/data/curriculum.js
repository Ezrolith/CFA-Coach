// Static-import all curriculum JSON files at build time.
// Vite handles JSON imports natively.

import ethics      from '../../content/curriculum/01-ethics.json';
import quant       from '../../content/curriculum/02-quant.json';
import economics   from '../../content/curriculum/03-economics.json';
import fra         from '../../content/curriculum/04-fra.json';
import corpIssuers from '../../content/curriculum/05-corp-issuers.json';
import equity      from '../../content/curriculum/06-equity.json';
import fixedIncome from '../../content/curriculum/07-fixed-income.json';
import derivatives from '../../content/curriculum/08-derivatives.json';
import alts        from '../../content/curriculum/09-alt-investments.json';
import portfolio   from '../../content/curriculum/10-portfolio-mgmt.json';

export const TOPICS = [
  ethics, quant, economics, fra, corpIssuers,
  equity, fixedIncome, derivatives, alts, portfolio,
].sort((a, b) => a.order - b.order);

export function getTopicById(id) {
  return TOPICS.find(t => t.id === id) ?? null;
}

export function getModuleById(topicId, moduleId) {
  const topic = getTopicById(topicId);
  if (!topic) return null;
  return topic.modules.find(m => m.id === moduleId) ?? null;
}

// Total module count + (eventual) lesson + LOS counts
export function totalCounts() {
  let modules = 0;
  let lessons = 0;
  let los = 0;
  for (const t of TOPICS) {
    modules += t.modules.length;
    for (const m of t.modules) {
      lessons += (m.lessons ?? []).length;
      for (const l of m.lessons ?? []) {
        los += (l.los ?? []).length;
      }
    }
  }
  return { topics: TOPICS.length, modules, lessons, los };
}

// Midpoint of the weight range, used for sorting / pie-charts
export function topicWeightMid(topic) {
  return (topic.weightLow + topic.weightHigh) / 2;
}
