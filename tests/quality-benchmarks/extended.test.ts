/**
 * Extended quality benchmarks — tablet, web, Android, dark mode, forms, empty states, overlays.
 * Complements benchmark.test.ts (iOS-only golden screens) and negative.test.ts (must-fire cases).
 */

import { type BenchmarkScenario, button, col, frame, input, row, runScenarios, solid, txt } from './helpers.js';

const CORE = [
  'web-responsive-missing',
  'default-name',
  'empty-container',
  'no-autolayout',
  'wcag-contrast',
  'wcag-text-size',
  'text-overflow',
  'max-nesting-depth',
  'overflow-parent',
  'unbounded-hug',
];

const SCENARIOS: BenchmarkScenario[] = [
  {
    name: 'Tablet - iPad Dashboard',
    description: 'iPad 834x1194 dashboard: header, two-column content in a Layout row',
    nodes: [
      col(
        'Dashboard Screen',
        {
          width: 834,
          height: 1194,
          paddingLeft: 32,
          paddingRight: 32,
          paddingTop: 48,
          paddingBottom: 32,
          itemSpacing: 24,
          fills: solid('#FFFFFF'),
          clipsContent: true,
        },
        [
          txt('Page Title', 'Overview', 32, { width: 770, parentWidth: 770 }),
          row('Layout', { width: 770, height: 400, itemSpacing: 24, layoutAlign: 'STRETCH' }, [
            col('Main Column', { width: 480, height: 400, itemSpacing: 16, layoutAlign: 'STRETCH' }, [
              txt('Section Title', 'Revenue', 20, { width: 480, parentWidth: 480 }),
              txt('Section Body', 'Revenue is up 12% compared with last month.', 16, {
                width: 480,
                parentWidth: 480,
              }),
            ]),
            col('Side Column', { width: 266, height: 400, itemSpacing: 16, layoutAlign: 'STRETCH' }, [
              txt('Side Title', 'Activity', 20, { width: 266, parentWidth: 266 }),
              txt('Side Body', 'Three new orders today.', 14, { width: 266, parentWidth: 266 }),
            ]),
          ]),
        ],
      ),
    ],
    mustPass: [...CORE, 'mobile-dimensions'],
  },

  {
    name: 'Web - Landing Hero 1440',
    description: 'Desktop landing page: nav, hero with CTA, 12px captions allowed on desktop',
    nodes: [
      col('Landing Page', { width: 1440, height: 900, itemSpacing: 0, fills: solid('#FFFFFF'), clipsContent: true }, [
        row(
          'Navbar',
          {
            width: 1440,
            height: 72,
            layoutAlign: 'STRETCH',
            paddingLeft: 80,
            paddingRight: 80,
            counterAxisAlignItems: 'CENTER',
            primaryAxisAlignItems: 'SPACE_BETWEEN',
          },
          [
            txt('Logo', 'Acme', 24, { width: 80, parentWidth: 1280 }),
            row('Nav Links', { itemSpacing: 32, width: 300, height: 24 }, [
              txt('Nav Pricing', 'Pricing', 14, { width: 60, parentWidth: 300 }),
              txt('Nav Docs', 'Docs', 14, { width: 40, parentWidth: 300 }),
            ]),
          ],
        ),
        col(
          'Hero',
          {
            width: 1440,
            height: 640,
            layoutAlign: 'STRETCH',
            paddingLeft: 80,
            paddingRight: 80,
            paddingTop: 96,
            itemSpacing: 24,
          },
          [
            txt('Hero Title', 'Design faster with AI', 56, { width: 800, parentWidth: 1280, height: 68 }),
            txt('Hero Subtitle', 'Ship consistent interfaces from your design system.', 20, {
              width: 640,
              parentWidth: 1280,
            }),
            button('Get Started Button', 'Get started', 200),
            txt('Hero Caption', 'No credit card required', 12, { width: 240, parentWidth: 1280 }),
          ],
        ),
      ]),
    ],
    mustPass: [...CORE],
  },

  {
    name: 'Web - Sidebar App Shell',
    description: 'Desktop app: fixed sidebar + content area inside a horizontal Layout',
    nodes: [
      row('App Dashboard Page', { width: 1440, height: 900, fills: solid('#F7F7F8'), clipsContent: true }, [
        col(
          'Sidebar',
          {
            width: 240,
            height: 900,
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 24,
            itemSpacing: 8,
            fills: solid('#FFFFFF'),
          },
          [
            txt('Nav Home', 'Home', 14, { width: 208, parentWidth: 208 }),
            txt('Nav Reports', 'Reports', 14, { width: 208, parentWidth: 208 }),
            txt('Nav Settings', 'Settings', 14, { width: 208, parentWidth: 208 }),
          ],
        ),
        col(
          'Content',
          {
            width: 1200,
            height: 900,
            paddingLeft: 32,
            paddingRight: 32,
            paddingTop: 32,
            itemSpacing: 16,
            layoutAlign: 'STRETCH',
          },
          [
            txt('Content Title', 'Reports', 28, { width: 1136, parentWidth: 1136 }),
            txt('Content Body', 'Select a report to view details.', 16, { width: 1136, parentWidth: 1136 }),
          ],
        ),
      ]),
    ],
    mustPass: CORE,
  },

  {
    name: 'Android Login 412x915',
    description: 'Android login with inputs and CTA at the Android standard size',
    nodes: [
      col(
        'Login Screen',
        {
          width: 412,
          height: 915,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 64,
          paddingBottom: 32,
          itemSpacing: 16,
          fills: solid('#FFFFFF'),
          clipsContent: true,
        },
        [
          txt('Heading', 'Sign in', 28, { width: 364, parentWidth: 364 }),
          input('Email Input', 'Email address', 364),
          input('Password Input', 'Password', 364),
          button('Sign In Button', 'Sign in', 364),
        ],
      ),
    ],
    mustPass: [...CORE, 'mobile-dimensions'],
    shouldPass: ['button-solid-structure', 'input-field-structure', 'form-consistency'],
  },

  {
    name: 'Dark Mode - Settings Screen',
    description: 'Dark surface with light text; contrast must be evaluated against the dark parent',
    nodes: [
      col(
        'Settings Screen',
        {
          width: 402,
          height: 874,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 60,
          itemSpacing: 16,
          fills: solid('#121212'),
          clipsContent: true,
        },
        [
          txt('Title', 'Settings', 28, { width: 362, parentWidth: 362, fills: solid('#F2F2F2') }),
          row(
            'Settings Row / Notifications',
            {
              width: 362,
              height: 56,
              paddingLeft: 16,
              paddingRight: 16,
              counterAxisAlignItems: 'CENTER',
              cornerRadius: 12,
              fills: solid('#1E1E1E'),
            },
            [txt('Row Label', 'Notifications', 16, { width: 200, parentWidth: 330, fills: solid('#E6E6E6') })],
          ),
          txt('Footnote', 'Version 1.0.0', 12, { width: 362, parentWidth: 362, fills: solid('#9A9A9A') }),
        ],
      ),
    ],
    mustPass: [...CORE, 'mobile-dimensions'],
  },

  {
    name: 'Empty State - No Results',
    description: 'Centered empty state with illustration placeholder, message and action',
    nodes: [
      col(
        'Empty State Screen',
        {
          width: 402,
          height: 874,
          primaryAxisAlignItems: 'CENTER',
          counterAxisAlignItems: 'CENTER',
          paddingLeft: 32,
          paddingRight: 32,
          itemSpacing: 16,
          fills: solid('#FFFFFF'),
          clipsContent: true,
        },
        [
          frame('Illustration', { width: 160, height: 160, cornerRadius: 80, fills: solid('#EEF0F4') }, [
            txt('Illustration Label', 'No data', 14, { width: 80, parentWidth: 160 }),
          ]),
          txt('Empty Title', 'No results found', 20, {
            width: 338,
            parentWidth: 338,
            textAlignHorizontal: 'CENTER',
          } as never),
          txt('Empty Body', 'Try adjusting your filters or search term.', 16, { width: 338, parentWidth: 338 }),
          button('Clear Filters Button', 'Clear filters', 338),
        ],
      ),
    ],
    mustPass: [...CORE, 'mobile-dimensions'],
    shouldPass: ['button-solid-structure'],
  },

  {
    name: 'Bottom Sheet Modal',
    description: 'Modal sheet anchored over a dimmed screen with title, body, and two actions',
    nodes: [
      col(
        'Confirm Sheet',
        {
          width: 402,
          height: 320,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 24,
          paddingBottom: 24,
          itemSpacing: 16,
          cornerRadius: 24,
          fills: solid('#FFFFFF'),
        },
        [
          txt('Sheet Title', 'Delete this item?', 20, { width: 354, parentWidth: 354 }),
          txt('Sheet Body', 'This action cannot be undone.', 16, { width: 354, parentWidth: 354 }),
          button('Confirm Button', 'Delete', 354, '#B3261E'),
          button('Cancel Button', 'Cancel', 354, '#EDEDED', '#111111'),
        ],
      ),
    ],
    mustPass: CORE,
  },
];

runScenarios('Extended Quality Benchmarks', SCENARIOS);
