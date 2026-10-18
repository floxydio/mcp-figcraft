/**
 * More must-fire scenarios. Each fixture contains exactly one intended defect.
 */

import { type BenchmarkScenario, button, col, frame, input, row, runScenarios, solid, txt } from './helpers.js';

const screen = (children: ReturnType<typeof txt>[], o = {}) =>
  col(
    'Home Screen',
    {
      width: 402,
      height: 874,
      itemSpacing: 16,
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 60,
      fills: solid('#FFFFFF'),
      ...o,
    },
    children,
  );

const SCENARIOS: BenchmarkScenario[] = [
  {
    name: 'Bad - Placeholder copy',
    description: 'Lorem ipsum left in the design',
    nodes: [screen([txt('Body', 'Lorem ipsum dolor sit amet', 16, { width: 354, parentWidth: 354 })])],
    mustPass: [],
    mustViolate: ['placeholder-text'],
  },
  {
    name: 'Bad - Generic label text',
    description: 'Text content is just "Title"',
    nodes: [screen([txt('Heading', 'Title', 24, { width: 354, parentWidth: 354 })])],
    mustPass: [],
    mustViolate: ['placeholder-text'],
  },
  {
    name: 'Bad - Text overflows its box',
    description: 'Fixed-size text wider than its container, no wrapping',
    nodes: [
      screen([
        txt('Long Text', 'This sentence is far too long to fit inside the narrow fixed box it lives in', 16, {
          width: 600,
          parentWidth: 354,
          textAutoResize: 'NONE',
        }),
      ]),
    ],
    mustPass: [],
    mustViolate: ['text-overflow'],
  },
  {
    name: 'Bad - Screen root is horizontal',
    description: 'Screen shell must be a VERTICAL auto-layout',
    nodes: [
      row('Home Screen', { width: 402, height: 874, itemSpacing: 8, fills: solid('#FFFFFF') }, [
        col('Left Pane', { width: 150, height: 874, itemSpacing: 8 }, [
          txt('Title', 'Home', 24, { width: 100, parentWidth: 150 }),
        ]),
        col('Right Pane', { width: 200, height: 874, itemSpacing: 8 }, [
          txt('Body', 'Details', 16, { width: 100, parentWidth: 200 }),
        ]),
      ]),
    ],
    mustPass: [],
    mustViolate: ['screen-shell-invalid'],
  },
  {
    name: 'Bad - Cramped stats row',
    description: 'Four stat cards squeezed into a 354px row',
    nodes: [
      screen([
        row(
          'Stats Row',
          { width: 354, height: 80, itemSpacing: 0 },
          ['A', 'B', 'C', 'D'].map((k) =>
            col(`Stat ${k}`, { width: 100, height: 80, itemSpacing: 2, paddingLeft: 4, paddingRight: 4 }, [
              txt('Stat Value', '12,345', 20, { width: 92, parentWidth: 100 }),
              txt('Stat Label', 'Total users', 12, { width: 92, parentWidth: 100 }),
            ]),
          ),
        ),
      ]),
    ],
    mustPass: [],
    mustViolate: ['stats-row-cramped'],
  },
  {
    name: 'Bad - CTA widths inconsistent',
    description: 'Two primary CTAs in the same stack have different widths',
    nodes: [
      screen([
        col('Login Form', { width: 354, height: 200, itemSpacing: 12, layoutAlign: 'STRETCH' }, [
          input('Email Input', 'Email address', 354),
          input('Password Input', 'Password', 354),
          button('Sign In Button', 'Sign in', 200),
        ]),
      ]),
    ],
    mustPass: [],
    mustViolate: ['cta-width-inconsistent'],
  },
  {
    name: 'Bad - Section spacing collapsed',
    description: 'Section stack with itemSpacing 0 and no self-spacing children',
    nodes: [
      col('Home Screen', { width: 402, height: 874, itemSpacing: 0, fills: solid('#FFFFFF') }, [
        col(
          'Content',
          { width: 402, height: 300, itemSpacing: 0, layoutAlign: 'STRETCH' },
          ['One', 'Two', 'Three'].map((k) =>
            col(`Block ${k}`, { width: 354, height: 60, itemSpacing: 4 }, [
              txt('Block Text', k, 16, { width: 300, parentWidth: 354 }),
            ]),
          ),
        ),
      ]),
    ],
    mustPass: [],
    mustViolate: ['section-spacing-collapse'],
  },
  {
    name: 'Bad - Low contrast on dark surface',
    description: 'Dark grey text on near-black background',
    nodes: [
      col('Home Screen', { width: 402, height: 874, itemSpacing: 12, fills: solid('#121212') }, [
        txt('Muted', 'Hard to read on dark', 16, { fills: solid('#2A2A2A') }),
      ]),
    ],
    mustPass: [],
    mustViolate: ['wcag-contrast'],
  },
  {
    name: 'Bad - Fails contrast in Dark mode only',
    description: 'Variable text color passes in Light but fails in Dark',
    nodes: [
      col('Home Screen', { width: 402, height: 874, itemSpacing: 12, fills: solid('#FFFFFF') }, [
        txt('Mode Text', 'Mode dependent', 16, {
          fills: solid('#111111'),
          variableModeColors: { Light: '#111111', Dark: '#202020' },
          parentBgModeColors: { Light: '#FFFFFF', Dark: '#121212' },
        }),
      ]),
    ],
    mustPass: [],
    mustViolate: ['wcag-contrast'],
  },
  {
    name: 'Bad - Fixed-width card row on tablet',
    description: 'Tablet content row hard-coded to the page width',
    nodes: [
      col('Dashboard Page', { width: 834, height: 1194, itemSpacing: 16, fills: solid('#FFFFFF') }, [
        row('Cards Row', { width: 834, height: 200, itemSpacing: 16 }, [
          txt('Card Title', 'Overview', 20, { width: 300, parentWidth: 834 }),
        ]),
      ]),
    ],
    mustPass: [],
    mustViolate: ['web-responsive-missing'],
  },
  {
    name: 'Bad - Absolute children and default layer names',
    description: 'Combined: absolute children and Frame/Rectangle names',
    nodes: [
      frame('Profile Screen', { width: 402, height: 874, fills: solid('#FFFFFF') }, [
        frame('Rectangle 3', { x: 20, y: 40, width: 100, height: 100, fills: solid('#EEEEEE') }, [
          txt('Label', 'A', 16, { width: 20, parentWidth: 100 }),
        ]),
        txt('Other', 'B', 16, { x: 20, y: 200 }),
      ]),
    ],
    mustPass: [],
    mustViolate: ['default-name', 'no-autolayout'],
  },
  {
    name: 'Bad - Hand-built frame duplicates a component',
    description: 'A "Product Card" frame exists as a component in the file',
    ctx: { availableComponents: ['Product Card', 'Primary Button'] },
    nodes: [
      screen([
        col('Product Card', { width: 354, height: 200, itemSpacing: 8, layoutAlign: 'STRETCH' }, [
          txt('Product Name', 'Wireless Headphones', 16, { width: 300, parentWidth: 354 }),
        ]),
      ]),
    ],
    mustPass: [],
    mustViolate: ['prefer-component-instance'],
  },
  {
    name: 'OK - No available components, nothing to prefer',
    description: 'Rule stays silent when no component list is known',
    nodes: [
      screen([
        col('Product Card', { width: 354, height: 200, itemSpacing: 8, layoutAlign: 'STRETCH' }, [
          txt('Product Name', 'Wireless Headphones', 16, { width: 300, parentWidth: 354 }),
        ]),
      ]),
    ],
    mustPass: ['prefer-component-instance'],
  },
];

runScenarios('More Negative Benchmarks (must-fire)', SCENARIOS);
