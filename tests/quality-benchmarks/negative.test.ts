/**
 * Negative quality benchmarks — deliberately flawed UIs that lint MUST flag.
 * Guards recall: a rule change that silently stops catching a known defect fails here.
 */

import { type BenchmarkScenario, button, col, frame, row, runScenarios, solid, txt } from './helpers.js';

const SCENARIOS: BenchmarkScenario[] = [
  {
    name: 'Bad - Legacy size + default names',
    description: 'iPhone 14 size and Figma auto-names',
    nodes: [
      col('Login Screen', { width: 390, height: 844, itemSpacing: 12, fills: solid('#FFFFFF') }, [
        frame('Frame 1', { width: 300, height: 40 }, [txt('Label', 'Hello', 16)]),
      ]),
    ],
    mustPass: [],
    mustViolate: ['mobile-dimensions', 'default-name'],
  },
  {
    name: 'Bad - Low contrast text',
    description: 'Light grey text on white',
    nodes: [
      col('Home Screen', { width: 402, height: 874, itemSpacing: 12, fills: solid('#FFFFFF') }, [
        txt('Muted Text', 'Barely readable', 16, { fills: solid('#CCCCCC') }),
      ]),
    ],
    mustPass: [],
    mustViolate: ['wcag-contrast'],
  },
  {
    name: 'Bad - Tiny text on mobile',
    description: 'Text smaller than the mobile minimum',
    nodes: [
      col('Home Screen', { width: 402, height: 874, itemSpacing: 12, fills: solid('#FFFFFF') }, [
        txt('Tiny Text', 'Too small', 8, { width: 100, height: 12 }),
      ]),
    ],
    mustPass: [],
    mustViolate: ['wcag-text-size'],
  },
  {
    name: 'Bad - No auto-layout',
    description: 'Multi-child frame with absolute positioning only',
    nodes: [
      frame('Profile Screen', { width: 402, height: 874, fills: solid('#FFFFFF') }, [
        txt('Name', 'Ada', 20, { x: 20, y: 40 }),
        txt('Bio', 'Engineer', 16, { x: 20, y: 80 }),
        txt('Location', 'Jakarta', 16, { x: 20, y: 110 }),
      ]),
    ],
    mustPass: [],
    mustViolate: ['no-autolayout'],
  },
  {
    name: 'Bad - Empty container',
    description: 'Auto-layout frame with no children',
    nodes: [
      col('Home Screen', { width: 402, height: 874, itemSpacing: 12, fills: solid('#FFFFFF') }, [
        col('Card', { width: 300, height: 100 }, []),
        txt('Title', 'Home', 24),
      ]),
    ],
    mustPass: [],
    mustViolate: ['empty-container'],
  },
  {
    name: 'Bad - Deep nesting',
    description: 'Eight wrapper levels around a single text',
    nodes: [
      (() => {
        let inner = txt('Deep Text', 'Deep', 16);
        for (let i = 8; i >= 1; i--) {
          inner = col(`Wrapper ${i}`, { width: 300, height: 60, itemSpacing: 4 }, [inner]);
        }
        return col('Home Screen', { width: 402, height: 874, itemSpacing: 12, fills: solid('#FFFFFF') }, [inner]);
      })(),
    ],
    mustPass: [],
    mustViolate: ['max-nesting-depth'],
  },
  {
    name: 'Bad - Child overflows parent',
    description: 'Fixed-width child wider than its parent',
    nodes: [
      col('Home Screen', { width: 402, height: 874, itemSpacing: 12, fills: solid('#FFFFFF') }, [
        row('Banner', { width: 600, height: 80, itemSpacing: 8, parentWidth: 402 }, [
          txt('Banner Text', 'Wide banner', 16, { width: 560, parentWidth: 600 }),
        ]),
      ]),
    ],
    mustPass: [],
    mustViolate: ['overflow-parent'],
  },
  {
    name: 'Bad - Small touch target',
    description: 'Toggle below 24x24 (WCAG 2.5.8) (button kinds are owned by button-*-structure rules)',
    nodes: [
      col('Home Screen', { width: 402, height: 874, itemSpacing: 12, fills: solid('#FFFFFF') }, [
        row('Menu Toggle', { width: 20, height: 20, itemSpacing: 4, fills: solid('#EEEEEE') }, [
          txt('Toggle Label', 'On', 12, { width: 20, height: 16, parentWidth: 20 }),
        ]),
      ]),
    ],
    mustPass: [],
    mustViolate: ['wcag-target-size'],
  },
  {
    name: 'Bad - Fixed-width section on web',
    description: 'Desktop page whose navbar is hard-coded to 1440 instead of Fill container',
    nodes: [
      col('Landing Page', { width: 1440, height: 900, itemSpacing: 0, fills: solid('#FFFFFF') }, [
        row('Navbar', { width: 1440, height: 72, paddingLeft: 80, paddingRight: 80 }, [
          txt('Logo', 'Acme', 24, { width: 80, parentWidth: 1280 }),
        ]),
      ]),
    ],
    mustPass: [],
    mustViolate: ['web-responsive-missing'],
  },
  {
    name: 'OK - Mobile fixed width is not flagged',
    description: 'Mobile screens are device-sized; web-responsive-missing must stay silent',
    nodes: [
      col('Home Screen', { width: 402, height: 874, itemSpacing: 12, fills: solid('#FFFFFF') }, [
        row('Header', { width: 402, height: 64, paddingLeft: 16, paddingRight: 16 }, [
          txt('Title', 'Home', 20, { width: 100, parentWidth: 370 }),
        ]),
      ]),
    ],
    mustPass: ['web-responsive-missing'],
  },
];

runScenarios('Negative Quality Benchmarks (must-fire)', SCENARIOS);
