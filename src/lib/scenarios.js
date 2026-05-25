// Load ethics scenarios from the content directory.

import scenarios from '../../content/ethics-scenarios.json';

export function allEthicsScenarios() {
  return scenarios.scenarios ?? [];
}
