export const businessPulse = {
  date: "Thursday, March 20, 2026",
  restaurant: "Ravi's Kitchen",
  outlets: ["Powai", "Vashi", "All"],
  revenue: 48200,
  orders: 67,
  rating: 4.6,
  capacity: 72,
};

export type AgentStatus = "active" | "monitoring" | "idle";

export const agents = [
  {
    id: "growth",
    name: "Customer Growth Agent",
    status: "active" as AgentStatus,
    summary: "Running Tuesday Family Campaign to 1,200 Jio users",
    color: "success" as const,
  },
  {
    id: "ops",
    name: "Operations Agent",
    status: "active" as AgentStatus,
    summary: "Forecasting tomorrow's demand, auto-ordering ingredients",
    color: "success" as const,
  },
  {
    id: "finance",
    name: "Financial Agent",
    status: "monitoring" as AgentStatus,
    summary: "All margins healthy. Paneer cost flagged for review",
    color: "warning" as const,
  },
];

export interface FeedEntry {
  id: string;
  time: string;
  agent: string;
  agentColor: "success" | "warning" | "destructive";
  action: string;
  hasActions?: boolean;
}

export const activityFeed: FeedEntry[] = [
  { id: "1", time: "2:34 PM", agent: "Growth Agent", agentColor: "success", action: "Spawned Campaign Subagent → \"Weekend Biryani Blast\" campaign created targeting 800 users within 3km" },
  { id: "2", time: "2:31 PM", agent: "Ops Agent", agentColor: "success", action: "Spawned Inventory Subagent → Auto-ordered 15kg Basmati Rice from Reliance B2B at ₹142/kg (saved ₹390 vs market)" },
  { id: "3", time: "2:28 PM", agent: "Finance Agent", agentColor: "warning", action: "Margin Alert → Paneer Butter Masala margin dropped to 8%. Recommends: raise price by ₹15 or switch supplier.", hasActions: true },
  { id: "4", time: "2:15 PM", agent: "Growth Agent", agentColor: "success", action: "Spawned Loyalty Subagent → Identified 12 at-risk regulars (no visit in 3 weeks). Sent personalized ₹100 comeback offers." },
  { id: "5", time: "2:02 PM", agent: "Ops Agent", agentColor: "success", action: "Spawned Demand Forecast Subagent → Saturday demand predicted: +40% vs normal. Prep advisory generated for kitchen team." },
  { id: "6", time: "1:45 PM", agent: "Growth Agent", agentColor: "success", action: "New Customer Alert → 23 new customers acquired today from BharatIQ natural language matching" },
  { id: "7", time: "1:30 PM", agent: "Finance Agent", agentColor: "success", action: "Daily P&L report generated. Net margin: 14.2% — above target." },
  { id: "8", time: "1:12 PM", agent: "Ops Agent", agentColor: "success", action: "Staff scheduling optimized for evening rush. 2 additional staff called in." },
];

export const priorities = [
  { id: "p1", level: "destructive" as const, label: "Approval Needed", text: "Finance Agent wants to adjust Paneer dish pricing", actions: ["Approve", "Modify", "Dismiss"] },
  { id: "p2", level: "warning" as const, label: "Review Recommended", text: "Ops Agent suggests adding \"Mini Meals\" to menu", actions: ["Approve", "Dismiss", "View Details"] },
  { id: "p3", level: "success" as const, label: "Completed", text: "Growth Agent launched Tuesday campaign (results coming in)", actions: ["View Details"] },
  { id: "p4", level: "success" as const, label: "Completed", text: "Auto-procurement for tomorrow executed (3 items, ₹4,200 saved)", actions: ["View Details"] },
];

export const snapshotMetrics = [
  { label: "Unique Customers", value: 847, change: "+32%", trend: [580, 620, 670, 710, 760, 800, 847] },
  { label: "Repeat Rate", value: 38, suffix: "%", change: "+18pp", trend: [20, 22, 25, 28, 32, 35, 38] },
  { label: "Net Margin", value: 14.2, suffix: "%", change: "+8.6pp", trend: [5.6, 7.2, 8.8, 10.5, 12.1, 13.4, 14.2] },
  { label: "Agent Actions Today", value: 34, subtext: "28 auto, 6 review", trend: [18, 22, 28, 30, 26, 32, 34] },
];

// Orchestration data
export const orchestrationNodes = {
  primary: [
    {
      id: "growth-main",
      name: "Customer Growth Agent",
      status: "active" as const,
      x: 400, y: 80,
      subagents: [
        { id: "campaign-sub", name: "Campaign Subagent", status: "active" as const, task: "Running \"Weekend Biryani Blast\"", x: 200, y: 220 },
        { id: "loyalty-sub", name: "Loyalty Subagent", status: "active" as const, task: "Analyzing at-risk regulars", x: 400, y: 240 },
        { id: "discovery-sub", name: "Discovery Optimization", status: "queued" as const, task: "Next: optimize menu tags for BharatIQ", x: 600, y: 220 },
      ],
    },
    {
      id: "ops-main",
      name: "Operations Agent",
      status: "active" as const,
      x: 200, y: 400,
      subagents: [
        { id: "inventory-sub", name: "Inventory Subagent", status: "active" as const, task: "Processing tomorrow's orders", x: 80, y: 540 },
        { id: "forecast-sub", name: "Demand Forecast", status: "active" as const, task: "Computing Saturday projections", x: 280, y: 560 },
      ],
    },
    {
      id: "finance-main",
      name: "Financial Agent",
      status: "monitoring" as const,
      x: 600, y: 400,
      subagents: [
        { id: "margin-sub", name: "Margin Monitor", status: "active" as const, task: "Tracking paneer cost impact", x: 520, y: 540 },
        { id: "reconcile-sub", name: "Reconciliation", status: "active" as const, task: "Daily payment matching", x: 720, y: 560 },
      ],
    },
  ],
};

export const decisionLog = [
  { time: "2:31 PM", decision: "Chose Reliance B2B supplier #RR-4821 over local wholesaler", reason: "₹12/kg cheaper, same-day delivery, quality score 4.8/5" },
  { time: "2:28 PM", decision: "Flagged Paneer Butter Masala margin", reason: "Margin dropped below 10% threshold (currently 8%)" },
  { time: "2:15 PM", decision: "Selected 12 customers for comeback offers", reason: "Last visit >21 days, avg order value >₹350, >5 lifetime visits" },
  { time: "2:02 PM", decision: "Predicted Saturday surge at +40%", reason: "Historical pattern + nearby event (college fest) + weather forecast (clear)" },
];

// Growth data
export const growthData = {
  newCustomers: 203,
  target: 150,
  acquisitionSources: [
    { name: "BharatIQ", value: 45, color: "hsl(213, 58%, 45%)" },
    { name: "Jio Campaigns", value: 30, color: "hsl(160, 84%, 39%)" },
    { name: "JustDial", value: 15, color: "hsl(38, 92%, 50%)" },
    { name: "WhatsApp Referral", value: 10, color: "hsl(280, 60%, 50%)" },
  ],
  repeatRate: 38,
  campaigns: [
    { name: "Weekend Family Thali Special", channel: "Jio Push + BharatIQ Discovery", target: "1,200 users within 3km", status: "Active since Mar 18", reached: 840, clicked: 156, ordered: 34, roi: 4.2 },
    { name: "Tuesday Family Campaign", channel: "Jio Push Notification", target: "800 families, Powai area", status: "Active since Mar 15", reached: 620, clicked: 98, ordered: 22, roi: 3.8 },
  ],
  atRiskCustomers: 12,
  comebackRedeemed: 4,
  segments: [
    { name: "Families", pct: 38 },
    { name: "Office lunch", pct: 28 },
    { name: "Delivery-only", pct: 22 },
    { name: "Premium dine-in", pct: 12 },
  ],
  bharatiqRankings: [
    { intent: "family dinner near Powai", rank: 1, match: 98 },
    { intent: "north indian delivery", rank: 3, match: 82 },
    { intent: "budget lunch under 200", rank: null, match: 0 },
  ],
  bharatiqMatches: 420,
  bharatiqConverted: 67,
};

// Operations data
export const opsData = {
  ordersLive: 8,
  ordersPreparing: 12,
  ordersDispatched: 5,
  ordersCompleted: 42,
  kitchenLoad: 72,
  kitchenPeak: 95,
  peakTime: "7:30 PM",
  staffOnDuty: 8,
  staffTotal: 15,
  hourlyForecast: [
    { hour: "12 PM", orders: 12 }, { hour: "1 PM", orders: 28 }, { hour: "2 PM", orders: 18 },
    { hour: "3 PM", orders: 8 }, { hour: "4 PM", orders: 6 }, { hour: "5 PM", orders: 14 },
    { hour: "6 PM", orders: 32 }, { hour: "7 PM", orders: 45 }, { hour: "8 PM", orders: 52 },
    { hour: "9 PM", orders: 38 }, { hour: "10 PM", orders: 20 },
  ],
  procurement: [
    { item: "Basmati Rice 25kg", supplier: "Reliance B2B", price: 142, market: 168, saved: 650 },
    { item: "Cooking Oil 10L", supplier: "Reliance B2B", price: 165, market: 178, saved: 130 },
    { item: "Fresh Vegetables", supplier: "Local (negotiated)", price: 0, market: 0, saved: 280 },
  ],
  totalSavings: 18400,
  topProfitable: [
    { dish: "Dal Makhani", margin: 42, orders: 180 },
    { dish: "Butter Chicken", margin: 38, orders: 220 },
    { dish: "Veg Biryani", margin: 35, orders: 160 },
    { dish: "Tandoori Roti", margin: 55, orders: 340 },
    { dish: "Gulab Jamun", margin: 60, orders: 120 },
  ],
  bottomDishes: [
    { dish: "Mushroom Do Pyaza", margin: 4, orders: 3 },
    { dish: "Aloo Gobi Special", margin: 8, orders: 12 },
    { dish: "Plain Rice", margin: 10, orders: 45 },
  ],
};

// Finance data
export const financeData = {
  revenue: { current: 920000, last: 840000, preNam: 740000 },
  cogs: { current: 380000, last: 370000, preNam: 420000 },
  grossMargin: { current: 540000, last: 470000, preNam: 320000 },
  opex: { current: 410000, last: 400000, preNam: 278000 },
  netMargin: { current: 14.2, last: 8.3, preNam: 5.6 },
  dishProfitability: [
    { dish: "Butter Chicken", revenue: 88000, foodCost: 32, margin: 38, orders: 220, status: "healthy" },
    { dish: "Dal Makhani", revenue: 54000, foodCost: 28, margin: 42, orders: 180, status: "healthy" },
    { dish: "Paneer Butter Masala", revenue: 72000, foodCost: 52, margin: 8, orders: 200, status: "critical" },
    { dish: "Veg Biryani", revenue: 48000, foodCost: 35, margin: 35, orders: 160, status: "healthy" },
    { dish: "Tandoori Roti", revenue: 34000, foodCost: 15, margin: 55, orders: 340, status: "healthy" },
    { dish: "Mushroom Do Pyaza", revenue: 3600, foodCost: 56, margin: 4, orders: 3, status: "critical" },
    { dish: "Gulab Jamun", revenue: 18000, foodCost: 20, margin: 60, orders: 120, status: "healthy" },
  ],
  alerts: [
    { id: "a1", level: "destructive" as const, title: "Paneer cost up 18%", desc: "Margin on 4 dishes affected", action: "View Fix Options" },
    { id: "a2", level: "warning" as const, title: "Delivery packaging cost creeping up", desc: "Suggest bulk purchase", action: "Auto-Order" },
    { id: "a3", level: "success" as const, title: "Cooking oil price stabilized", desc: "Previous alert resolved", action: null },
  ],
  credit: { approved: 200000, rate: 12, marketRate: 24 },
  commissions: { zomato: 185000, nam: 69000, saved: 116000, zomatoRate: 25, namRate: 7.5 },
};
