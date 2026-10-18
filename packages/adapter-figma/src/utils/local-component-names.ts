/**
 * Names of local components available on the current page, for the prefer-component-instance lint rule.
 *
 * Current page only: enumerating every page needs loadAsync() on each page, which is too slow for a
 * lint pass. Components living on a separate "Components" page are therefore not seen from other pages.
 */

const MAX_NAMES = 500;

export function collectLocalComponentNames(): string[] {
  const names = new Set<string>();
  try {
    const nodes = figma.currentPage.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] });
    for (const node of nodes) {
      // Variants inside a set are named "Prop=Value"; the set itself is what a designer instantiates.
      if (node.type === 'COMPONENT' && node.parent?.type === 'COMPONENT_SET') continue;
      names.add(node.name);
      if (names.size >= MAX_NAMES) break;
    }
  } catch {
    // Lint must never fail because component discovery did.
  }
  return [...names];
}
