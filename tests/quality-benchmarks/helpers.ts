/**
 * Shared builders + runner for quality benchmarks.
 *
 * Two kinds of scenario:
 * - positive ("golden"): well-designed UI; `mustPass` rules must produce zero violations (precision).
 * - negative ("bad"):    deliberately flawed UI; `mustViolate` rules must fire (recall).
 */

import { describe, expect, it } from 'vitest';
import { getAvailableRules, runLint } from '../../packages/quality-engine/src/engine.js';
import type { AbstractNode, LintContext } from '../../packages/quality-engine/src/types.js';

export const emptyCtx: LintContext = {
  colorTokens: new Map(),
  spacingTokens: new Map(),
  radiusTokens: new Map(),
  typographyTokens: new Map(),
  variableIds: new Map(),
};

export interface BenchmarkScenario {
  name: string;
  description: string;
  nodes: AbstractNode[];
  /** Extra lint context (e.g. availableComponents). */
  ctx?: Partial<LintContext>;
  /** Rules that MUST produce zero violations. */
  mustPass: string[];
  /** Rules that SHOULD pass (up to 2 minor violations tolerated). */
  shouldPass?: string[];
  /** Rules that MUST fire at least once (negative scenarios). */
  mustViolate?: string[];
}

let seq = 0;
const nextId = () => `b:${++seq}`;

export const solid = (color: string) => [{ type: 'SOLID', color, visible: true }];

export function frame(name: string, o: Partial<AbstractNode> = {}, children: AbstractNode[] = []): AbstractNode {
  return { id: nextId(), name, type: 'FRAME', ...o, children };
}

export function col(name: string, o: Partial<AbstractNode>, children: AbstractNode[]): AbstractNode {
  return frame(name, { layoutMode: 'VERTICAL', ...o }, children);
}

export function row(name: string, o: Partial<AbstractNode>, children: AbstractNode[]): AbstractNode {
  return frame(name, { layoutMode: 'HORIZONTAL', ...o }, children);
}

export function txt(name: string, chars: string, fontSize = 16, o: Partial<AbstractNode> = {}): AbstractNode {
  return {
    id: nextId(),
    name,
    type: 'TEXT',
    characters: chars,
    fontSize,
    textAutoResize: 'HEIGHT',
    width: 300,
    height: Math.round(fontSize * 1.4),
    parentWidth: 400,
    fills: solid('#111111'),
    ...o,
  };
}

export function button(name: string, label: string, width: number, bg = '#1A1A2E', fg = '#FFFFFF'): AbstractNode {
  return row(
    name,
    {
      width,
      height: 52,
      counterAxisAlignItems: 'CENTER',
      primaryAxisAlignItems: 'CENTER',
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 14,
      paddingBottom: 14,
      cornerRadius: 12,
      fills: solid(bg),
    },
    [txt('Button Label', label, 16, { width: 80, height: 20, parentWidth: width, fills: solid(fg) })],
  );
}

export function input(name: string, placeholder: string, width: number): AbstractNode {
  return row(
    name,
    {
      width,
      height: 52,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 14,
      paddingBottom: 14,
      cornerRadius: 12,
      counterAxisAlignItems: 'CENTER',
      strokes: solid('#D0D0D0'),
      strokeWeight: 1,
    },
    [txt('Placeholder', placeholder, 16, { width: width - 32, parentWidth: width, fills: solid('#6B6B6B') })],
  );
}

export function runScenarios(title: string, scenarios: BenchmarkScenario[]): void {
  const allRuleNames = getAvailableRules().map((r) => r.name);

  describe(title, () => {
    for (const scenario of scenarios) {
      describe(scenario.name, () => {
        // 'verbose' so rules like default-name / empty-container / max-nesting-depth are actually evaluated
        // (they are filtered out by default, which would make mustPass vacuous).
        const report = runLint(scenario.nodes, { ...emptyCtx, ...scenario.ctx }, { minSeverity: 'verbose' });
        const byRule = new Map<string, number>();
        for (const cat of report.categories) {
          byRule.set(cat.rule, (byRule.get(cat.rule) ?? 0) + cat.nodes.length);
        }
        const count = (rule: string) => byRule.get(rule) ?? 0;
        const known = (rule: string) => expect(allRuleNames, `Rule "${rule}" not found in engine`).toContain(rule);

        for (const rule of scenario.mustPass) {
          it(`MUST PASS: ${rule}`, () => {
            known(rule);
            expect(count(rule), `${scenario.name}: ${count(rule)} "${rule}" violation(s)`).toBe(0);
          });
        }
        for (const rule of scenario.shouldPass ?? []) {
          it(`SHOULD PASS: ${rule}`, () => {
            known(rule);
            expect(count(rule), `${scenario.name}: ${count(rule)} "${rule}" violation(s)`).toBeLessThanOrEqual(2);
          });
        }
        for (const rule of scenario.mustViolate ?? []) {
          it(`MUST VIOLATE: ${rule}`, () => {
            known(rule);
            expect(count(rule), `${scenario.name}: expected "${rule}" to fire but it did not`).toBeGreaterThan(0);
          });
        }
      });
    }
  });
}
