

# NAM Shop OS — Restaurant Owner Prototype

## Overview
Build a demo-ready interactive prototype of the NAM Shop Operating System — a dark-mode "Mission Control" experience for restaurant owner Ravi, featuring 3 autonomous AI agents, live activity feeds, an agent orchestration canvas, and deep-dive screens for Growth, Operations, and Finance.

## Screen 1: Command Center (Home)
- **Top bar**: Date, "Ravi's Kitchen" branding, outlet selector (Powai/Vashi/All), health indicators (Revenue ₹48,200, Orders 67, Rating 4.6★, Capacity 72%) with subtle heartbeat animation
- **Agent Status Strip**: 3 horizontal cards for Customer Growth, Operations, and Financial agents with green/amber pulse dots, current status text, clickable to navigate to deep-dive
- **Live Agent Activity Feed (left 60%)**: Auto-scrolling feed with timestamped entries appearing one-by-one every 8-10 seconds. Each shows agent icon, action description, outcome, and "View Details" link. Includes actionable items with [Approve/Dismiss/Edit] buttons
- **Today's Priorities (right 40%)**: Curated list with red/amber/green indicators and action buttons
- **Business Snapshot (bottom)**: Sparkline mini-charts for Unique Customers, Repeat Rate, Net Margin, Agent Actions

## Screen 2: Agent Orchestration Center
- **Agent Canvas (70%)**: Visual node graph with 3 large primary agent nodes and smaller subagent nodes. Pulsing borders (green/amber/blue), animated connecting lines with flowing dots. New subagent spawning animation on button click ("Launch New Campaign" triggers budding animation with status progression)
- **Agent Control Panel (right 30%)**: Clicking any node reveals identity, current task with progress, decision log with reasoning, **Autonomy Slider** (Full Auto → Suggest → Manual), performance metrics, and control buttons
- **Summary Bar (bottom)**: Total active agents, subagents running, actions today, value created, pending approvals

## Screen 3: Customer Growth Agent Deep Dive
- **Growth Dashboard**: Animated progress ring for new customers (203/150), acquisition source pie chart, repeat rate trend
- **Active Campaigns**: Campaign cards with performance metrics (reach, clicks, orders, ROI) and action buttons
- **Customer Intelligence**: At-risk customers, top segments, demand gap detection with approval button
- **BharatIQ Discovery**: Intent ranking table with match scores and conversion rates

## Screen 4: Operations Agent Deep Dive
- **Operations Overview**: Live order counters, kitchen capacity meter, staff tracker
- **Demand Forecast**: 48-hour timeline with hourly breakdown, surge alerts
- **Smart Procurement**: Auto-procurement log with savings, upcoming orders
- **Menu Intelligence**: Per-dish profitability, agent recommendations for menu changes
- **Multi-Outlet View**: Comparative performance between Powai and Vashi

## Screen 5: Financial Intelligence Deep Dive
- **P&L Summary**: Revenue/COGS/Margin breakdown with month-over-month and pre-NAM comparison
- **Per-Dish Profitability Matrix**: Heat map with color-coded margins
- **Margin Alert Center**: Active alerts with fix options
- **Working Capital**: Cash flow visualization, JFS credit offer, settlement tracker
- **Commission Savings Calculator**: Side-by-side NAM vs Zomato/Swiggy comparison showing ₹1,16,000 monthly savings

## Interactive Demo Elements
- Auto-appearing activity feed entries every 8-10 seconds
- Subagent spawning animation on the orchestration canvas
- Approval flow with reasoning → approve → success animation
- Smooth counting animations on key metrics
- Draggable autonomy slider per agent

## Design System
- **Dark mode**: Deep navy/charcoal background
- **Accent colors**: Electric blue (#2e75b6), amber (#f59e0b), green (#10b981), red (#ef4444)
- **Left sidebar navigation**: 5 icons (Command Center, Agent Canvas, Growth, Operations, Finance) with active highlight
- **Typography**: Inter, clean and modern
- **Animations**: Pulsing nodes, flowing data lines, smooth number transitions, fade-in feed entries

## Technical Approach
- All data is hardcoded/mock — no backend needed
- React Router for 5 screens
- Custom animated components for the agent canvas (CSS/SVG animations)
- Tailwind dark mode with custom color tokens
- Framer Motion or CSS animations for live feel

