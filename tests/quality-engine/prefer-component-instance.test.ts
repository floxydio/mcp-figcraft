import { describe, expect, it } from 'vitest';
import { runLint } from '../../packages/quality-engine/src/engine.js';
import type { AbstractNode, LintContext } from '../../packages/quality-engine/src/types.js';

const base: LintContext = {
  colorTokens: new Map(),
  spacingTokens: new Map(),
  radiusTokens: new Map(),
  typographyTokens: new Map(),
  variableIds: new Map(),
};

const child: AbstractNode = {
  id: 't',
  name: 'Label',
  type: 'TEXT',
  characters: 'Hi',
  fontSize: 16,
  width: 40,
  height: 20,
};
const frame = (name: string, extra: Partial<AbstractNode> = {}): AbstractNode => ({
  id: name,
  name,
  type: 'FRAME',
  layoutMode: 'VERTICAL',
  width: 200,
  height: 100,
  children: [child],
  ...extra,
});
const screen = (children: AbstractNode[]): AbstractNode => ({
  id: 's',
  name: 'Home Screen',
  type: 'FRAME',
  layoutMode: 'VERTICAL',
  itemSpacing: 12,
  width: 402,
  height: 874,
  children,
});
const hits = (names: string[] | undefined, nodes: AbstractNode[]) =>
  runLint(
    [screen(nodes)],
    { ...base, availableComponents: names },
    { rules: ['prefer-component-instance'] },
  ).categories.flatMap((c) => c.nodes.map((n) => n.nodeName));

describe('prefer-component-instance', () => {
  it('flags a frame named like an available component', () => {
    expect(hits(['Card'], [frame('Card')])).toEqual(['Card']);
  });
  it('ignores case, trailing counters and "copy"', () => {
    expect(hits(['Card'], [frame('card 2'), frame('Card copy')])).toHaveLength(2);
  });
  it('matches a path-less frame to the last segment of a component path', () => {
    expect(hits(['Actions / Button'], [frame('Button')])).toEqual(['Button']);
  });
  it('does not match unrelated names or partial words', () => {
    expect(hits(['Card'], [frame('Cardholder'), frame('Product Card List')])).toEqual([]);
  });
  it('is skipped without availableComponents', () => {
    expect(hits(undefined, [frame('Card')])).toEqual([]);
    expect(hits([], [frame('Card')])).toEqual([]);
  });
  it('ignores instances, empty frames and nodes inside a component subtree', () => {
    expect(hits(['Card'], [{ ...frame('Card'), type: 'INSTANCE' }, frame('Card', { children: [] })])).toEqual([]);
    expect(hits(['Card'], [{ id: 'c', name: 'Wrapper', type: 'COMPONENT', children: [frame('Card')] }])).toEqual([]);
  });
});
