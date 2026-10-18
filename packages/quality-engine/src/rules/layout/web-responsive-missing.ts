/**
 * web-responsive-missing — desktop/tablet sections pinned to a fixed width.
 *
 * On a desktop-class screen (platform propagated by the engine), a direct child of a VERTICAL
 * auto-layout parent that spans most of the parent's width but is not set to STRETCH (Fill
 * container) will not follow the screen when it is resized or when the frame is reused at another
 * breakpoint. Mobile screens are skipped: they are designed at a fixed device size.
 */

import type { AbstractNode, FixDescriptor, LintContext, LintRule, LintViolation } from '../../types.js';
import { tr } from '../../types.js';

/** Parent must be at least this wide to be treated as a resizable web/tablet canvas. */
const MIN_PARENT_WIDTH = 768;
/**
 * A child spanning at least this share of the parent is meant to be full-width. Centered max-width
 * containers (e.g. 1080-1200px content columns on a 1440 page) sit below it and are left alone.
 */
const FULL_WIDTH_RATIO = 0.85;

export const webResponsiveMissingRule: LintRule = {
  name: 'web-responsive-missing',
  description:
    'On web/tablet screens, full-width sections should fill their parent (Fill container) instead of using a fixed width.',
  category: 'layout',
  severity: 'heuristic',
  ai: {
    preventionHint:
      'Web/tablet: sections that span the page width must use layoutAlign STRETCH (Fill container), not a hard-coded width',
    phase: ['layout'],
    tags: ['responsive', 'frame'],
  },

  check(node: AbstractNode, ctx: LintContext): LintViolation[] {
    if (node.type !== 'FRAME') return [];
    if (node.platform !== 'desktop') return [];
    if (node.parentLayoutMode !== 'VERTICAL') return [];
    if (node.layoutPositioning === 'ABSOLUTE') return [];
    if (node.layoutAlign === 'STRETCH') return [];
    if (node.insideComponentSubtree) return [];

    const w = node.width;
    const pw = node.parentWidth;
    if (w == null || pw == null || pw < MIN_PARENT_WIDTH) return [];
    // Only real sections: empty/leaf frames are covered by other rules.
    if (!node.children || node.children.length === 0) return [];
    if (w / pw < FULL_WIDTH_RATIO || w > pw) return [];

    return [
      {
        nodeId: node.id,
        nodeName: node.name,
        rule: 'web-responsive-missing',
        severity: 'heuristic',
        currentValue: `fixed ${Math.round(w)}px of ${Math.round(pw)}px parent`,
        expectedValue: 'Fill container (layoutAlign: STRETCH)',
        suggestion: tr(
          ctx.lang,
          `"${node.name}" spans the page on a web/tablet screen but has a fixed width — set it to Fill container so it follows the screen width`,
          `「${node.name}」在 Web/平板屏幕上横跨整页但使用固定宽度——请改为 Fill container,使其随屏幕宽度变化`,
        ),
        autoFixable: true,
        fixData: { fix: 'stretch', layoutAlign: 'STRETCH' },
      },
    ];
  },

  describeFix(v): FixDescriptor | null {
    if (!v.fixData) return null;
    return { kind: 'set-properties', props: { layoutAlign: v.fixData.layoutAlign ?? 'STRETCH' } };
  },
};
