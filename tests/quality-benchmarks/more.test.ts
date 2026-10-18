/**
 * More golden screens — common product flows across mobile, tablet and web.
 * Every scenario runs at minSeverity 'verbose' (see helpers.ts), so naming/empty/nesting rules count.
 */

import { type BenchmarkScenario, button, col, frame, input, row, runScenarios, solid, txt } from './helpers.js';

const CORE = [
  'default-name',
  'empty-container',
  'no-autolayout',
  'wcag-contrast',
  'wcag-text-size',
  'text-overflow',
  'max-nesting-depth',
  'overflow-parent',
  'unbounded-hug',
  'web-responsive-missing',
  'screen-shell-invalid',
  'section-spacing-collapse',
  'placeholder-text',
];

const mobileScreen = (name: string, children: ReturnType<typeof txt>[], extra = {}) =>
  col(
    name,
    {
      width: 402,
      height: 874,
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 60,
      paddingBottom: 34,
      itemSpacing: 16,
      fills: solid('#FFFFFF'),
      clipsContent: true,
      ...extra,
    },
    children,
  );

const SCENARIOS: BenchmarkScenario[] = [
  {
    name: 'Onboarding - Welcome',
    description: 'Hero illustration, headline, body, primary CTA and secondary link',
    nodes: [
      mobileScreen('Onboarding Screen', [
        frame('Hero Illustration', { width: 354, height: 320, cornerRadius: 24, fills: solid('#E8EEF9') }, [
          txt('Hero Label', 'Illustration', 14, { width: 100, parentWidth: 354 }),
        ]),
        txt('Headline', 'Plan your week with ease', 28, { width: 354, parentWidth: 354 }),
        txt('Body', 'Organize tasks, set reminders and stay on track.', 16, { width: 354, parentWidth: 354 }),
        button('Get Started Button', 'Get started', 354),
        txt('Skip Link', 'Skip for now', 14, { width: 354, parentWidth: 354, fills: solid('#444444') }),
      ]),
    ],
    mustPass: CORE,
    shouldPass: ['button-solid-structure', 'cta-width-inconsistent'],
  },
  {
    name: 'Forgot Password',
    description: 'Single input + CTA with helper text',
    nodes: [
      mobileScreen('Forgot Password Screen', [
        txt('Heading', 'Reset your password', 28, { width: 354, parentWidth: 354 }),
        txt('Helper', "We'll email you a link to reset it.", 16, { width: 354, parentWidth: 354 }),
        input('Email Input', 'Email address', 354),
        button('Send Link Button', 'Send reset link', 354),
      ]),
    ],
    mustPass: CORE,
    shouldPass: ['input-field-structure', 'button-solid-structure', 'form-consistency'],
  },
  {
    name: 'OTP Verification',
    description: 'Six equal code cells in a row + resend text',
    nodes: [
      mobileScreen('Verification Screen', [
        txt('Heading', 'Enter the code', 28, { width: 354, parentWidth: 354 }),
        row(
          'Code Row',
          { width: 354, height: 56, itemSpacing: 8, primaryAxisAlignItems: 'CENTER', layoutAlign: 'STRETCH' },
          Array.from({ length: 6 }, (_, i) =>
            row(
              `Code Cell ${i + 1}`,
              {
                width: 50,
                height: 56,
                cornerRadius: 10,
                primaryAxisAlignItems: 'CENTER',
                counterAxisAlignItems: 'CENTER',
                strokes: solid('#D0D0D0'),
                strokeWeight: 1,
              },
              [txt('Digit', '0', 20, { width: 12, height: 24, parentWidth: 50 })],
            ),
          ),
        ),
        txt('Resend', 'Resend code in 0:30', 14, { width: 354, parentWidth: 354, fills: solid('#555555') }),
      ]),
    ],
    mustPass: CORE,
  },
  {
    name: 'Search Results List',
    description: 'Search field and a vertical list of result rows',
    nodes: [
      mobileScreen('Search Results Screen', [
        input('Search Input', 'Search products', 354),
        ...['Wireless Headphones', 'Portable Speaker', 'Smart Watch'].map((label, i) =>
          row(
            `Result Row ${i + 1}`,
            {
              width: 354,
              height: 72,
              itemSpacing: 12,
              paddingLeft: 12,
              paddingRight: 12,
              counterAxisAlignItems: 'CENTER',
              cornerRadius: 12,
              fills: solid('#F6F6F8'),
              layoutAlign: 'STRETCH',
            },
            [
              frame('Thumbnail', { width: 48, height: 48, cornerRadius: 8, fills: solid('#DDDDE3') }, [
                txt('Thumb Label', 'img', 10, { width: 20, height: 12, parentWidth: 48 }),
              ]),
              txt('Result Title', label, 16, { width: 220, parentWidth: 330 }),
            ],
          ),
        ),
      ]),
    ],
    mustPass: CORE,
    shouldPass: ['input-field-structure'],
  },
  {
    name: 'Product Detail',
    description: 'Large image, title, price, description and sticky add-to-cart CTA',
    nodes: [
      col(
        'Product Detail Screen',
        {
          width: 402,
          height: 874,
          primaryAxisAlignItems: 'SPACE_BETWEEN',
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 60,
          paddingBottom: 34,
          fills: solid('#FFFFFF'),
          clipsContent: true,
        },
        [
          col('Product Info', { width: 354, height: 600, itemSpacing: 12, layoutAlign: 'STRETCH' }, [
            frame('Product Image', { width: 354, height: 360, cornerRadius: 20, fills: solid('#EDEDF2') }, [
              txt('Image Label', 'Product photo', 14, { width: 120, parentWidth: 354 }),
            ]),
            txt('Product Name', 'Wireless Headphones', 24, { width: 354, parentWidth: 354 }),
            txt('Product Price', '$79.99', 20, { width: 354, parentWidth: 354 }),
            txt('Product Description', 'Comfortable over-ear design with 30-hour battery life.', 16, {
              width: 354,
              parentWidth: 354,
            }),
          ]),
          button('Add To Cart Button', 'Add to cart', 354),
        ],
      ),
    ],
    mustPass: CORE,
    shouldPass: ['button-solid-structure'],
  },
  {
    name: 'Chat Conversation',
    description: 'Message bubbles of both sides and a composer row',
    nodes: [
      col(
        'Chat Screen',
        {
          width: 402,
          height: 874,
          primaryAxisAlignItems: 'SPACE_BETWEEN',
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 60,
          paddingBottom: 24,
          fills: solid('#FFFFFF'),
          clipsContent: true,
        },
        [
          col('Messages', { width: 370, height: 600, itemSpacing: 12, layoutAlign: 'STRETCH' }, [
            col(
              'Incoming Bubble',
              {
                width: 260,
                height: 60,
                paddingLeft: 14,
                paddingRight: 14,
                paddingTop: 10,
                paddingBottom: 10,
                cornerRadius: 16,
                fills: solid('#F0F0F3'),
              },
              [txt('Incoming Text', 'Hi! Is the item still available?', 16, { width: 232, parentWidth: 260 })],
            ),
            col(
              'Outgoing Bubble',
              {
                width: 240,
                height: 60,
                paddingLeft: 14,
                paddingRight: 14,
                paddingTop: 10,
                paddingBottom: 10,
                cornerRadius: 16,
                fills: solid('#1A1A2E'),
                layoutAlign: 'INHERIT',
              },
              [txt('Outgoing Text', 'Yes, it is.', 16, { width: 212, parentWidth: 240, fills: solid('#FFFFFF') })],
            ),
          ]),
          input('Message Input', 'Type a message', 370),
        ],
      ),
    ],
    mustPass: CORE,
  },
  {
    name: 'Bottom Tab Navigation',
    description: 'Content area and a 4-item tab bar',
    nodes: [
      col(
        'Home Screen',
        {
          width: 402,
          height: 874,
          primaryAxisAlignItems: 'SPACE_BETWEEN',
          paddingTop: 60,
          fills: solid('#FFFFFF'),
          clipsContent: true,
        },
        [
          col(
            'Home Content',
            { width: 402, height: 600, paddingLeft: 24, paddingRight: 24, itemSpacing: 12, layoutAlign: 'STRETCH' },
            [txt('Home Title', 'Good morning', 28, { width: 354, parentWidth: 354 })],
          ),
          row(
            'Tab Bar',
            {
              width: 402,
              height: 83,
              paddingTop: 8,
              paddingBottom: 24,
              primaryAxisAlignItems: 'SPACE_BETWEEN',
              paddingLeft: 24,
              paddingRight: 24,
              layoutAlign: 'STRETCH',
              fills: solid('#FFFFFF'),
              strokes: solid('#E5E5EA'),
              strokeWeight: 1,
            },
            ['Home', 'Search', 'Saved', 'Profile'].map((l) =>
              col(`Tab ${l}`, { width: 64, height: 51, itemSpacing: 4, counterAxisAlignItems: 'CENTER' }, [
                txt('Tab Label', l, 12, { width: 48, height: 16, parentWidth: 64, fills: solid('#444444') }),
              ]),
            ),
          ),
        ],
      ),
    ],
    mustPass: CORE,
    shouldPass: ['nav-overcrowded'],
  },
  {
    name: 'Toast / Snackbar',
    description: 'Compact message with action',
    nodes: [
      row(
        'Snackbar',
        {
          width: 354,
          height: 56,
          paddingLeft: 16,
          paddingRight: 16,
          itemSpacing: 12,
          counterAxisAlignItems: 'CENTER',
          primaryAxisAlignItems: 'SPACE_BETWEEN',
          cornerRadius: 12,
          fills: solid('#1F1F24'),
        },
        [
          txt('Message', 'Item added to cart', 14, { width: 200, parentWidth: 322, fills: solid('#FFFFFF') }),
          txt('Action', 'Undo', 14, { width: 40, parentWidth: 322, fills: solid('#9CC2FF') }),
        ],
      ),
    ],
    mustPass: ['default-name', 'empty-container', 'no-autolayout', 'wcag-contrast', 'text-overflow'],
  },
  {
    name: 'Tablet - Split View (Master/Detail)',
    description: 'iPad landscape 1194x834: list pane + detail pane inside Layout',
    nodes: [
      col(
        'Inbox Page',
        {
          width: 1194,
          height: 834,
          paddingTop: 32,
          paddingLeft: 32,
          paddingRight: 32,
          itemSpacing: 16,
          fills: solid('#FFFFFF'),
          clipsContent: true,
        },
        [
          row('Layout', { width: 1130, height: 700, itemSpacing: 24, layoutAlign: 'STRETCH' }, [
            col('List Pane', { width: 360, height: 700, itemSpacing: 8, layoutAlign: 'STRETCH' }, [
              txt('Pane Title', 'Inbox', 24, { width: 360, parentWidth: 360 }),
              txt('Mail Item', 'Welcome to the team', 16, { width: 360, parentWidth: 360 }),
            ]),
            col('Detail Pane', { width: 746, height: 700, itemSpacing: 12, layoutAlign: 'STRETCH' }, [
              txt('Detail Title', 'Welcome to the team', 24, { width: 746, parentWidth: 746 }),
              txt('Detail Body', 'We are glad to have you onboard. Here is what to expect in your first week.', 16, {
                width: 746,
                parentWidth: 746,
              }),
            ]),
          ]),
        ],
      ),
    ],
    mustPass: CORE,
  },
  {
    name: 'Web - Pricing Page',
    description: 'Three equal pricing cards centered in a full-width section',
    nodes: [
      col(
        'Pricing Page',
        {
          width: 1440,
          height: 900,
          paddingTop: 80,
          itemSpacing: 40,
          counterAxisAlignItems: 'CENTER',
          fills: solid('#FFFFFF'),
          clipsContent: true,
        },
        [
          txt('Pricing Title', 'Simple pricing', 40, { width: 600, parentWidth: 1440, height: 48 }),
          row(
            'Plans',
            { width: 1080, height: 420, itemSpacing: 24 },
            ['Free', 'Pro', 'Team'].map((plan) =>
              col(
                `Plan ${plan}`,
                {
                  width: 344,
                  height: 420,
                  paddingLeft: 24,
                  paddingRight: 24,
                  paddingTop: 24,
                  paddingBottom: 24,
                  itemSpacing: 12,
                  cornerRadius: 16,
                  fills: solid('#F7F7F8'),
                },
                [
                  txt('Plan Name', plan, 20, { width: 296, parentWidth: 296 }),
                  txt('Plan Price', plan === 'Free' ? '$0' : plan === 'Pro' ? '$12' : '$29', 32, {
                    width: 296,
                    parentWidth: 296,
                  }),
                ],
              ),
            ),
          ),
        ],
      ),
    ],
    mustPass: CORE,
  },
  {
    name: 'Web - Admin Table',
    description: 'Dense desktop table; 12px cells are acceptable on desktop',
    nodes: [
      col(
        'Orders Page',
        {
          width: 1440,
          height: 900,
          paddingLeft: 48,
          paddingRight: 48,
          paddingTop: 48,
          itemSpacing: 16,
          fills: solid('#FFFFFF'),
          clipsContent: true,
        },
        [
          txt('Table Title', 'Orders', 28, { width: 1344, parentWidth: 1344 }),
          col(
            'Orders Table',
            {
              width: 1344,
              height: 240,
              layoutAlign: 'STRETCH',
              cornerRadius: 12,
              strokes: solid('#E5E5EA'),
              strokeWeight: 1,
            },
            ['#1001', '#1002', '#1003'].map((id) =>
              row(
                `Table Row ${id}`,
                {
                  width: 1344,
                  height: 48,
                  paddingLeft: 16,
                  paddingRight: 16,
                  counterAxisAlignItems: 'CENTER',
                  itemSpacing: 24,
                  layoutAlign: 'STRETCH',
                },
                [
                  txt('Order Id', id, 12, { width: 80, parentWidth: 1312 }),
                  txt('Customer', 'Ada Lovelace', 12, { width: 240, parentWidth: 1312 }),
                  txt('Total', '$129.00', 12, { width: 80, parentWidth: 1312 }),
                ],
              ),
            ),
          ),
        ],
      ),
    ],
    mustPass: CORE,
  },
  {
    name: 'Dark Mode - Web Dashboard',
    description: 'Dark desktop page, light text on dark surfaces',
    nodes: [
      col(
        'Analytics Dashboard Page',
        {
          width: 1440,
          height: 900,
          paddingLeft: 48,
          paddingRight: 48,
          paddingTop: 48,
          itemSpacing: 16,
          fills: solid('#0F1115'),
          clipsContent: true,
        },
        [
          txt('Title', 'Analytics', 32, { width: 600, parentWidth: 1344, fills: solid('#F4F4F5') }),
          row(
            'Metrics',
            { width: 1344, height: 120, itemSpacing: 16, layoutAlign: 'STRETCH' },
            ['Visitors', 'Signups', 'Revenue'].map((m) =>
              col(
                `Metric ${m}`,
                {
                  width: 432,
                  height: 120,
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 20,
                  itemSpacing: 8,
                  cornerRadius: 16,
                  fills: solid('#1B1E25'),
                },
                [
                  txt('Metric Label', m, 14, { width: 392, parentWidth: 392, fills: solid('#A8ADB8') }),
                  txt('Metric Value', '1,284', 28, { width: 392, parentWidth: 392, fills: solid('#FFFFFF') }),
                ],
              ),
            ),
          ),
        ],
      ),
    ],
    mustPass: CORE,
  },
  {
    name: 'Android - Profile',
    description: 'Android 412x915 profile with avatar and rows',
    nodes: [
      col(
        'Profile Screen',
        {
          width: 412,
          height: 915,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 64,
          itemSpacing: 16,
          counterAxisAlignItems: 'CENTER',
          fills: solid('#FFFFFF'),
          clipsContent: true,
        },
        [
          frame('Avatar', { width: 96, height: 96, cornerRadius: 48, fills: solid('#D9DCE6') }, [
            txt('Initials', 'AL', 28, { width: 40, height: 34, parentWidth: 96 }),
          ]),
          txt('Display Name', 'Ada Lovelace', 24, { width: 364, parentWidth: 364 }),
          txt('Email', 'ada@example.com', 16, { width: 364, parentWidth: 364, fills: solid('#555555') }),
        ],
      ),
    ],
    mustPass: [...CORE, 'mobile-dimensions'],
  },
];

runScenarios('More Golden Screens', SCENARIOS);
