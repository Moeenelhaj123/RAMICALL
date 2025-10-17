# Call Center Dashboard

A professional call center dashboard designed for managing customer interactions, agent performance, and real-time metrics with an intuitive and modern interface.

**Experience Qualities**:
1. **Professional** - Clean, organized interface that inspires confidence and efficiency for call center operations
2. **Accessible** - Clear navigation and well-structured information hierarchy for quick data access
3. **Responsive** - Fluid layout that adapts seamlessly across different screen sizes and devices

**Complexity Level**: Light Application (multiple features with basic state)
The dashboard provides real-time monitoring capabilities with agent status tracking, KPI metrics display, navigation, search, and user profile management, establishing the foundation for future call center features.

## Essential Features

### Agents Status Board
- **Functionality**: Displays real-time status of 6 fixed call center agents with avatars, presence indicators, and call timers
- **Purpose**: Provides at-a-glance visibility into agent availability and current activities for supervisor monitoring
- **Trigger**: Automatically loads on dashboard view
- **Progression**: Dashboard loads → Agent cards display with current status → Timers update every second → Auto-break triggers after 180s idle
- **Success criteria**: All 6 agents visible, presence chips show correct states, call timers count accurately, auto-break logic fires callback

### Agent KPI Cards
- **Functionality**: Displays 10 configurable KPI metrics with icons, allowing users to show/hide specific cards
- **Purpose**: Provides customizable overview of key call center metrics for different supervisor needs
- **Trigger**: Automatically loads on dashboard view
- **Progression**: Dashboard loads → All visible cards display → User clicks settings → Toggles card visibility → Selection persists to localStorage
- **Success criteria**: All 10 KPIs render with proper formatting, settings modal allows toggling, preferences persist across sessions

### Hamburger Menu Navigation
- **Functionality**: Toggles a floating dark-themed drawer with sectioned navigation and quick stats
- **Purpose**: Provides clean, collapsible navigation that maximizes screen space for dashboard content while offering quick access to key information
- **Trigger**: Click hamburger icon in header
- **Progression**: User clicks hamburger → Dark drawer slides in from left → User views sections (Navigation, Quick Stats, System Status) → Selects navigation option or views stats → Drawer closes
- **Success criteria**: Drawer opens/closes smoothly, matches header dark theme (#111827), has rounded corners, proper spacing between sections, close button is clearly separated from content, backdrop opacity is 0.55, all navigation items (Dashboard, Users) are clickable

### Phone Number Quick Lookup
- **Functionality**: Header search that detects phone-like input (≥4 digits or starts with +), shows dropdown of matching client numbers with names and last call times, and navigates to filtered call history on selection
- **Purpose**: Enables rapid lookup of call history for any phone number without manual filtering
- **Trigger**: Type phone-like string into header search input
- **Progression**: User types partial/full number → Input debounces 250ms → Search detects phone pattern → Backend query for matching numbers → Dropdown appears with top 10 results → User navigates with keyboard (↑/↓/Enter) or clicks → Navigates to Call History filtered by selected number → Number chip displayed with clear button
- **Success criteria**: Detects phone patterns correctly, dropdown shows within 450ms, keyboard navigation works (Esc closes, arrows move, Enter selects), selected number auto-filters call history, number chip appears with working clear button, cache prevents duplicate requests, mobile touch selection works, RTL-safe layout, aria labels present, loading state shows spinner

### User Profile Avatar
- **Functionality**: Displays current user's profile picture
- **Purpose**: Provides user context and access point for account settings (future feature)
- **Trigger**: Visible on load, clickable for profile menu (future)
- **Progression**: User views avatar → Recognizes their identity → Can click for profile options
- **Success criteria**: Avatar is clearly visible and positioned appropriately in header

### Users Page
- **Functionality**: Dedicated page for user management with table/card views, search, filters, and full CRUD operations including avatar upload
- **Purpose**: Provides a foundation for managing system users and their permissions. **Users are the single source of truth for identity data** (name, avatar, email, role)
- **Trigger**: Click Users navigation item in drawer
- **Progression**: User opens drawer → Clicks Users → Page loads with user list → User can search/filter → Can add/edit/disable users → Changes sync to agent status board automatically
- **Success criteria**: Page loads correctly, displays user table/cards, CRUD operations work, avatar changes propagate immediately to Agents Status Board

### Call History Page
- **Functionality**: Comprehensive call records viewer with TanStack Table, full filtering (search, date range, direction, result, agent, phone number), sorting, pagination, CSV export, and column visibility toggle. Supports URL parameters for pre-filtered views (e.g., ?number=+971501234567)
- **Purpose**: Provides historical call data analysis with VoIP-ready types for future PBX integration. Displays detailed call metrics including duration, talk time, ring time, and hungup party with horizontal scrolling for wide tables. Phone number filter enables direct navigation from header search
- **Trigger**: Click Call History navigation item in drawer OR select phone number from header search dropdown
- **Progression**: User opens drawer → Clicks Call History → Page loads with call records table → User applies filters (search/date/direction/result/agent/number) → Sorts columns → Toggles column visibility via Columns button → Changes page/page size → Exports CSV → Clicks row for details (stub) → Scrolls horizontally to view all columns. OR User searches phone in header → Selects result → Page loads with number pre-filtered → Number chip shows with clear button
- **Success criteria**: Table displays with sticky header and zebra rows, all 14 columns render correctly in single horizontal lines (no label/value stacking), horizontal scroll enabled when table width exceeds viewport, "Columns" button opens menu to show/hide columns, column visibility persists to localStorage ("callHistory.columns.v1"), filters work instantly with debounce, sorting updates data, pagination shows correct ranges, preferences persist to localStorage ("callHistory.prefs.v1"), CSV exports filtered/visible data, all text uses tabular numerals for times/durations, cells use whitespace-nowrap with text-ellipsis truncation, phone number filter works on both callerNumber and calledNumber fields, number chip displays with working clear button

### Agent Performance Page
- **Functionality**: Comprehensive analytics page showing agent performance metrics over a selected date range with filters by Agents, Groups/Teams, and Queues. Includes summary KPI tiles (7 metrics), sortable performance table with 16 columns, and CSV export functionality
- **Purpose**: Provides detailed performance analysis for agents including inbound/outbound call metrics, talk times, ring times, break durations, and unique contact counts. Ready for integration with PBX/VoIP and data warehouse
- **Trigger**: Click Agent Performance navigation item in drawer (nested under Analytics section)
- **Progression**: User opens drawer → Clicks Agent Performance → Page loads with Last 7 Days default → User selects date range preset or custom dates → Applies filters for agents/groups/queues → Views KPI tiles with aggregated totals → Reviews sortable performance table → Toggles column visibility → Exports filtered data to CSV → Filters persist to localStorage
- **Success criteria**: Page renders with filters bar, 7 KPI tiles, and performance table with 16 columns, all filters work correctly (date presets: Today/Yesterday/Last 7/Last 30/This Month/Custom), multi-select filters for agents/groups/queues with chips, table is sortable by all columns, column visibility toggleable via Columns menu and persists to localStorage ("agentPerf.columns.v1"), filter preferences persist to localStorage ("agentPerf.filters.v1"), CSV export includes all visible columns with current filters, durations formatted as HH:MM:SS, counts with thousand separators, responsive grid layout (2→3→4→7 columns for KPIs), horizontal scroll for wide table, loading states with skeletons, all text uses tabular numerals

### Data Architecture
- **Single Source of Truth**: User identity data (name, avatarUrl, email, role) lives exclusively in the Users state
- **Agent-User Linking**: Each Agent has a `userId` field that references a User record
- **Derived Views**: AgentsStatusBoard displays AgentView objects created by joining Agent data with User data via selectors
- **Real-time Updates**: When user data changes (e.g., avatar upload), all agent cards automatically reflect the update without duplicate storage
- **Call History Types**: VoIP-ready TypeScript types (CallRecord, CallDirection, CallResult, HungupBy) prepared for PBX integration with fields for startAt, endAt, totalDurationSec, talkTimeSec, ringTimeSec, onHoldDurationSec, recordingUrl, callId
- **Performance Types**: VoIP-ready TypeScript types (AgentPerformanceRow, PerformanceQuery, AggregateTotals) with fields for answeredCount, busyCount, hungupCount, noAnswerCount, missedCount, avgRingSec, outboundCount, outboundAnsweredCount, outboundClientsCount, uniqueContactsCount, outboundTalkingSec, totalTalkingSec, breaksCount, breaksDurationSec
- **Backend Integration Ready**: API stubs in `src/api/calls.ts` with typed query parameters for GET /calls, GET /calls/:id, GET /calls/:id/recording, and `src/api/performance.ts` for GET /analytics/agent-performance, GET /analytics/agent-performance/export.csv

## Edge Case Handling

- **Missing user avatar**: Display fallback initials or default icon in avatar component
- **Long agent names/phone numbers**: Truncate with ellipsis to prevent card layout breaking
- **Missing call timestamps**: Timer shows from dialStartedAt if callAnsweredAt unavailable
- **Auto-break edge cases**: Only fires once per agent, resets when agent becomes active again
- **Empty visible cards**: Show helpful message prompting user to configure settings
- **localStorage errors**: Gracefully fallback to default all-visible state
- **Long search queries**: Truncate or scroll search input appropriately
- **Phone search no results**: Show "No matching numbers" message in dropdown when search returns empty
- **Phone search loading**: Display CircularProgress spinner while fetching results
- **Phone search rapid typing**: Debounce at 250ms, cancel stale requests via AbortController
- **Phone search cache**: Store recent results to prevent duplicate API calls
- **Phone search click outside**: Close dropdown when clicking outside search or dropdown area
- **Phone search keyboard nav**: Handle arrow keys for navigation, Enter for selection, Esc to close
- **Phone search invalid patterns**: Only trigger search when input looks like phone (≥4 digits or starts with +)
- **Call History number filter**: Match against both callerNumber and calledNumber fields with normalization
- **Call History number chip**: Display phone number in chip format with Phone icon and clear X button
- **Call History clear number**: Reset to all calls view when clearing number filter, maintain other active filters
- **Mobile navigation**: Drawer overlay covers content with proper z-indexing, responsive widths (80vw on sm, 55vw on md, 40vw on lg, max 720px), and touch interactions
- **Rapid menu toggling**: Debounce or disable button during animation to prevent state conflicts
- **Dark drawer styling**: Maintain text contrast and readability on #111827 background
- **Section spacing**: Ensure proper visual separation between drawer sections without overlap
- **Close button placement**: Keep X button far from first section content to prevent accidental clicks
- **Call History empty state**: Show helpful message when no records match filters
- **Call History date filters**: Handle timezone conversions correctly for ISO timestamps
- **Call History horizontal overflow**: Table gains horizontal scroll when columns exceed viewport width, scroll container has overflow-x-auto with thin scrollbars
- **Call History column visibility**: All columns toggleable via Columns menu, visibility persists to localStorage, gracefully handle empty visibility state (show all)
- **CSV export large datasets**: Only export currently filtered/paginated rows to prevent browser memory issues
- **localStorage quota**: Gracefully handle quota exceeded errors when persisting call history preferences
- **Missing call data fields**: Display "—" for undefined/null values (endAt, queueName, hungupBy, talkTimeSec, answeredAt, ringTimeSec, onHoldDurationSec)
- **Very long phone numbers**: Truncate with ellipsis using max-w constraints (16ch for phone numbers, 18ch for dates, 14ch for names)
- **Agent Performance empty filters**: Show all agents when no filters applied
- **Agent Performance date range**: Validate dateTo >= dateFrom, show error if invalid
- **Agent Performance no data**: Show helpful empty state message when no performance data matches filters
- **Agent Performance column visibility**: All 16 columns toggleable, persist to localStorage, gracefully handle empty state (show all)
- **Agent Performance filter persistence**: Load last used filters from localStorage on mount, gracefully fallback to Last 7 Days default
- **Agent Performance CSV large export**: Export all visible columns for filtered agents, handle datasets up to 1000 agents efficiently
- **Agent Performance duration formatting**: Handle edge cases for 0 seconds (show 00:00), very large durations (show full HH:MM:SS even if >24 hours)
- **Agent Performance missing metrics**: Display "—" for undefined/null metric values in table and KPI tiles

## Design Direction

The design should feel professional, trustworthy, and efficient - reminiscent of enterprise SaaS dashboards with a modern twist. It should project authority and reliability while remaining approachable. The interface should be minimal and functional, with every element serving a clear purpose, avoiding decorative clutter that might distract from critical call center operations.

## Color Selection

Analogous color scheme with grey deep blue as the dominant header color and Binance yellow as the accent color for energy and attention-grabbing elements.

- **Primary Color**: Grey Deep Blue (oklch(0.35 0.04 250)) - Conveys professionalism, stability, and trustworthiness for the header and primary UI elements
- **Secondary Colors**: Light grey backgrounds (oklch(0.98 0 0)) for main content areas, darker grey (oklch(0.25 0.02 250)) for text
- **Accent Color**: Binance Yellow (oklch(0.85 0.15 85)) - High-energy color for CTAs, active states, and important notifications
- **Foreground/Background Pairings**:
  - Background (Light Grey #FAFAFA): Dark text (oklch(0.25 0.02 250)) - Ratio 12.8:1 ✓
  - Header (Grey Deep Blue): White text (oklch(1 0 0)) - Ratio 8.2:1 ✓
  - Card (White #FFFFFF): Dark text (oklch(0.25 0.02 250)) - Ratio 14.5:1 ✓
  - Accent (Binance Yellow): Dark text (oklch(0.25 0.02 250)) - Ratio 9.1:1 ✓
  - Muted (Light Grey #F5F5F5): Medium grey text (oklch(0.50 0.01 250)) - Ratio 4.6:1 ✓

## Font Selection

Typography should convey clarity and modernity with excellent readability for data-heavy interfaces - Inter is ideal for its clean geometric forms and optimized screen rendering.

- **Typographic Hierarchy**:
  - H1 (Dashboard Title): Inter SemiBold/24px/tight letter spacing
  - H2 (Section Headers): Inter Medium/20px/normal letter spacing
  - Body (Primary Content): Inter Regular/14px/relaxed line height (1.6)
  - Small (Metadata): Inter Regular/12px/normal letter spacing
  - Button Text: Inter Medium/14px/wide letter spacing

## Animations

Animations should be subtle and purposeful, emphasizing state changes and providing smooth transitions that feel responsive without delaying user actions.

- **Purposeful Meaning**: Drawer slide animations communicate spatial relationships, hover states provide immediate feedback, and subtle scale transforms on buttons reinforce interactivity
- **Hierarchy of Movement**: Navigation drawer has prominent slide-in animation (300ms), search input has subtle focus expansion, avatar has gentle hover lift effect

## Component Selection

- **Components**:
  - **Card**: For agent status cards and KPI metric cards with rounded-2xl borders
  - **Avatar**: For agent profile pictures with initials fallback
  - **Badge**: For agent presence status indicators (offline, online, dialing, in_call, break, break_auto)
  - **Dialog**: For KPI card visibility settings modal and MUI dialogs for call actions
  - **Checkbox**: For toggling individual KPI card visibility and column visibility
  - **Sheet**: For the hamburger menu drawer with dark theme (#111827 background) and overlay backdrop (0.55 opacity)
  - **Input**: For the search bar with proper focus states, and Call History filters (search, date-range)
  - **GlobalSearch**: Custom phone search component with dropdown results, keyboard navigation, and route handling
  - **MUI CircularProgress**: For phone search loading state (16px size)
  - **Button**: For settings gear icon and hamburger menu trigger
  - **MUI Button**: For Call History "Columns" control with ViewColumnOutlined icon, Agent Performance filter actions, and CSV export
  - **MUI Menu**: For Call History column visibility picker with checkboxes, Agent Performance column picker
  - **MUI Select**: For Agent Performance filters (agents multi-select with avatars, groups multi-select, queues multi-select, date range preset)
  - **MUI TextField**: For Agent Performance date inputs (type="date")
  - **MUI Chip**: For Agent Performance multi-select filter values with avatar support
  - **MUI Avatar**: For Agent Performance agent cells and filter selections
  - **Select**: For Call History filters (direction, result, agent, page size)
  - **Table**: TanStack Table v8 for Call History and Agent Performance with manual sorting/pagination, column visibility state
  
- **Customizations**:
  - Agent cards with live-updating timers using tabular-nums for digit alignment
  - KPI cards with icon + title layout, responsive text sizing, and consistent heights
  - Custom header component with grey deep blue background
  - Dark drawer with sectioned layout: rounded-xl border-gray-700 bg-[#0f1623] sections
  - Close button positioned far from content with proper focus ring
  - Call History table with horizontal scroll container (min-w-[1400px]), sticky header (top-0 z-10), single-line cells (whitespace-nowrap), text truncation (overflow-hidden text-ellipsis with max-w constraints)
  - Modified Sheet overlay backdrop opacity (0.55) and drawer responsive widths
  - GlobalSearch dropdown: absolute positioned, white bg, border-slate-200, rounded-lg, shadow-lg, max-h-[400px], overflow-y-auto, z-50
  - Phone search results: list items with phone icon (rounded-md border bg-slate-50), display/number + name/label, last call time (tabular-nums)
  - Phone search hover: bg-slate-50, selected item: bg-slate-100
  - Phone search empty state: centered text "No matching numbers"
  - Phone search loading: centered spinner with "Searching..." text
  - Call History number chip: inline-flex with Phone icon, number text, and X button (bg-slate-100, rounded-lg, border-slate-200)
  - Search input with custom styling for header integration
  - Users page with empty state placeholder
  - Call History table: sticky header, zebra rows (odd:bg-white even:bg-slate-50), hover:bg-slate-50, shadow-sm hover:shadow-md
  - Call History direction pills: inbound (green-50/700), outbound (blue-50/700)
  - Call History result pills: answered (emerald-50/700), busy (amber-50/700), no_answer (slate-50/700), hungup (rose-50/700)
  - Call History mobile expander: collapsible "More" button shows hidden columns in grid layout
  - Agent Performance cards: white bg, rounded-2xl, border border-slate-200, shadow-sm, px-4 py-3
  - Agent Performance KPI tiles: grid responsive layout (grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7)
  - Agent Performance table: min-w-[1800px], sticky header, zebra rows (odd:bg-white even:bg-slate-50), hover:bg-slate-100
  - Agent Performance filters: bg-white rounded-2xl card with grid layout (md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4)
  - Agent Performance agent cells: avatar + name with extension subline
  - Agent Performance durations: HH:MM:SS format with tabular-nums
  - Agent Performance loading: skeleton for KPIs, spinner for table
  
- **States**:
  - Agent presence badges: offline (secondary), online (default), dialing (outline), in_call (default), break (secondary), break_auto (secondary)
  - KPI cards: Default (border + shadow), visible/hidden based on user preference, consistent height across all cards
  - Settings dialog: Closed, Open with scrollable checkbox list
  - Hamburger button: Default (grey deep blue bg), Hover (slightly lighter), Active (pressed state)
  - Search input: Default (subtle border), Focus (yellow accent border), Filled (maintains focus style)
  - Phone search dropdown: Closed (hidden), Open (visible with results)
  - Phone search results: Default (white bg), Hover (bg-slate-50), Selected via keyboard (bg-slate-100), aria-selected state
  - Phone search loading: Shows CircularProgress with "Searching..." text
  - Phone search empty: Shows "No matching numbers" text
  - Call History number filter: Active (chip visible with clear button), Cleared (chip removed, filter reset)
  - Drawer: Closed (off-screen left), Opening (sliding in), Open (visible), Closing (sliding out), dark theme with white/gray text
  - Navigation buttons in drawer: Default (gray-200), Hover (white text with gray-800 background)
  
- **Icon Selection**:
  - **Phosphor Icons** for all agent, KPI, and navigation visual indicators:
    - UserCircle: Current Agents Logged In
    - Phone: Current Agents On Call (also Call History navigation)
    - UserCheck: Current Agents Available
    - Coffee: Current Agents on Break
    - Users: Total Agents
    - PhoneX: Missed Calls Today
    - PhoneIncoming: Answered Today
    - PhoneOutgoing: Outbound Today
    - Clock: Total Outbound Talking
    - Timer: Total Inbound Talking
    - Gear: Settings configuration
    - List: Hamburger menu
    - MagnifyingGlass: Search functionality (header and Call History filters)
    - Phone: Phone search results icon, Call History navigation, number filter chip
    - XCircle: Clear search input button (filled variant)
    - User: Profile avatar fallback
    - House: Dashboard navigation
    - UsersThree: Users navigation
    - ChartBar: Agent Performance navigation (Analytics section)
    - X: Close drawer button, reset filters
    - Download: Export CSV
    - ArrowUp/ArrowDown: Call direction indicators in table, sort indicators
    - CaretUp/CaretDown: Mobile row expander toggle
    - CircleNotch: Loading spinner
    - ArrowCounterClockwise: Reset filters button
  
- **Spacing**:
  - Agent status grid: gap-4 md:gap-6
  - KPI grid: gap-3 md:gap-4
  - Agent card padding: p-3
  - KPI card header padding: standard, card content pb-4
  - Header padding: px-4 md:px-6 py-3 md:py-4
  - Drawer header padding: px-4 md:px-6 py-3
  - Drawer content padding: p-4 md:p-6
  - Drawer section spacing: space-y-4 md:space-y-5
  - Drawer section internal padding: p-4 md:p-5
  - Section margins: space-y-8
  
- **Mobile**:
  - Agent status: 1 column on mobile, 2 on md, 3 on lg
  - KPI cards: 2 columns on mobile, 3 on md, 5 on lg with consistent heights
  - Card text: smaller on mobile (text-xs → text-sm, text-2xl → text-3xl)
  - Header remains fixed at top with reduced padding
  - Drawer responsive widths: w-[80vw] sm:w-[80vw] md:w-[55vw] lg:w-[40vw] max-w-[720px]
  - Drawer rounded-2xl with proper overflow handling
  - Avatar and icon sizes adjust for mobile viewports
  - Users page responsive with proper padding and spacing
  - Call History table: show only direction, startAt, agentName, result, totalDurationSec columns on mobile
  - Call History expander: "More" button reveals remaining 9 columns in 2-column grid
  - Call History filters: stack vertically on mobile, 2 columns on md, 3 on lg, 4 on xl
  - Call History pagination: stack controls vertically on mobile with proper spacing
  - Agent Performance KPIs: 2 columns on mobile, 3 on md, 4 on lg, 7 on xl
  - Agent Performance table: horizontal scroll on all viewports, show priority columns on mobile (agent, extension, answeredCount, outboundCount, totalTalkingSec)
  - Agent Performance filters: stack vertically on mobile, 2 on md, 3 on lg, 4 on xl
