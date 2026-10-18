/**
 * prefer-component-instance — a hand-built FRAME that duplicates an available component.
 *
 * When the file (or selected library) already has a component with the same name, the frame
 * should be an instance of it, so it stays in sync with the design system. Matching is by
 * normalized name only (case-insensitive, ignoring trailing counters and "copy"); fuzzy matching
 * is deliberately avoided to keep false positives low. Skipped without `ctx.availableComponents`.
 */

import type { AbstractNode, LintContext, LintRule, LintViolation } from '../../types.js';
import { tr } from '../../types.js';

/** "Card / Product 2" -> "card / product"; "Button copy" -> "button". */
function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*\/\s*/g, ' / ')
    .replace(/\s+copy(\s+\d+)?$/, '')
    .replace(/[\s_-]*#?\d+$/, '')
    .trim();
}

function lastSegment(name: string): string {
  const parts = name.split(' / ');
  return parts[parts.length - 1];
}

let cachedSource: string[] | undefined;
let cachedKeys: Set<string> = new Set();

/** Component name lookup, rebuilt only when the context's list changes (lint visits every node). */
function componentKeys(names: string[]): Set<string> {
  if (cachedSource !== names) {
    cachedSource = names;
    cachedKeys = new Set(names.map(normalize).filter(Boolean));
  }
  return cachedKeys;
}

export const preferComponentInstanceRule: LintRule = {
  name: 'prefer-component-instance',
  description: 'A frame that duplicates an available component should be an instance of that component.',
  category: 'component',
  severity: 'heuristic',
  ai: {
    preventionHint:
      'If a component with the same name exists (local or library), create type:"instance" instead of hand-building a frame',
    phase: ['structure'],
    tags: ['component', 'frame'],
  },

  check(node: AbstractNode, ctx: LintContext): LintViolation[] {
    if (!ctx.availableComponents || ctx.availableComponents.length === 0) return [];
    if (node.type !== 'FRAME') return [];
    if (node.insideComponentSubtree) return [];
    if (node.role === 'screen' || node.role === 'page') return [];
    if (!node.children || node.children.length === 0) return [];

    const key = normalize(node.name);
    if (!key) return [];
    const keys = componentKeys(ctx.availableComponents);
    // Full name first; the last path segment only counts when the frame is itself path-less
    // ("Button" matches "Actions / Button"), never the other way round.
    const hit = keys.has(key) || (!key.includes(' / ') && [...keys].some((k) => lastSegment(k) === key));
    if (!hit) return [];

    return [
      {
        nodeId: node.id,
        nodeName: node.name,
        rule: 'prefer-component-instance',
        severity: 'heuristic',
        currentValue: `FRAME "${node.name}"`,
        expectedValue: 'INSTANCE of the existing component',
        suggestion: tr(
          ctx.lang,
          `"${node.name}" is hand-built but a component with this name exists — replace it with an instance so it stays in sync`,
          `「${node.name}」是手工搭建的,但已存在同名组件——请替换为该组件的实例,以保持同步`,
        ),
        autoFixable: false,
      },
    ];
  },
};
