import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { PulseDot } from "@/components/PulseDot";
import { growthData } from "@/data/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Users, Target, TrendingUp, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function GrowthAgent() {
  const [menuApproved, setMenuApproved] = useState(false);

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center gap-3">
        <PulseDot color="success" size="md" />
        <div>
          <h1 className="text-xl font-semibold text-foreground">Customer Growth Agent</h1>
          <p className="text-sm text-muted-foreground">Growing your customer base 24/7</p>
        </div>
      </div>

      {/* Growth Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="16" fill="none"
                  stroke="hsl(var(--success))"
                  strokeWidth="3"
                  strokeDasharray={`${(growthData.newCustomers / growthData.target) * 100} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-foreground">{Math.round((growthData.newCustomers / growthData.target) * 100)}%</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">New Customers</p>
              <p className="text-2xl font-bold text-foreground"><AnimatedCounter value={growthData.newCustomers} /></p>
              <p className="text-xs text-muted-foreground">Target: {growthData.target}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-2">Acquisition Sources</p>
            <ResponsiveContainer width="100%" height={100}>
              <PieChart>
                <Pie data={growthData.acquisitionSources} dataKey="value" cx="50%" cy="50%" innerRadius={25} outerRadius={40}>
                  {growthData.acquisitionSources.map((s, i) => (
                    <Cell key={i} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(222, 47%, 14%)", border: "1px solid hsl(217, 33%, 22%)", borderRadius: 8, fontSize: 12 }}
                  itemStyle={{ color: "hsl(210, 40%, 98%)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-1">
              {growthData.acquisitionSources.map(s => (
                <span key={s.name} className="text-xs text-muted-foreground">{s.name} {s.value}%</span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 flex flex-col justify-center">
            <p className="text-xs text-muted-foreground">Repeat Rate</p>
            <p className="text-3xl font-bold text-foreground"><AnimatedCounter value={growthData.repeatRate} suffix="%" /></p>
            <p className="text-xs text-success">↑ 18pp vs last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns + Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Campaigns</h2>
          {growthData.campaigns.map(c => (
            <Card key={c.name} className="bg-card border-border">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                  <Badge variant="outline" className="text-xs">{c.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{c.channel} · {c.target}</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { l: "Reached", v: c.reached },
                    { l: "Clicked", v: c.clicked },
                    { l: "Ordered", v: c.ordered },
                    { l: "ROI", v: `${c.roi}x` },
                  ].map(m => (
                    <div key={m.l}>
                      <p className="text-xs text-muted-foreground">{m.l}</p>
                      <p className="text-sm font-semibold text-foreground">{m.v}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-6 text-xs">Pause</Button>
                  <Button size="sm" variant="outline" className="h-6 text-xs">Edit Audience</Button>
                  <Button size="sm" variant="default" className="h-6 text-xs">Boost Budget</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Customer Intelligence</h2>
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <h3 className="text-sm font-semibold text-foreground">At-Risk Customers</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                {growthData.atRiskCustomers} regulars haven't visited in 3+ weeks. Agent auto-sent ₹100 comeback offers.
                <span className="text-success"> {growthData.comebackRedeemed} already redeemed.</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Top Segments</h3>
              {growthData.segments.map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.name}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={s.pct} className="w-20 h-1.5" />
                    <span className="text-xs text-foreground w-8 text-right">{s.pct}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card border-border border-warning/30">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-warning" />
                <h3 className="text-sm font-semibold text-foreground">Demand Gap Detected</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                340+ weekly searches for "quick lunch under ₹200" — no local restaurant offers this. Recommends adding "Mini Meals" category.
              </p>
              <Button
                size="sm"
                disabled={menuApproved}
                onClick={() => setMenuApproved(true)}
                className="h-7 text-xs"
              >
                {menuApproved ? "✓ Approved" : "Approve Menu Addition"}
              </Button>
            </CardContent>
          </Card>

          {/* BharatIQ */}
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-2">
              <h3 className="text-sm font-semibold text-foreground">BharatIQ Discovery</h3>
              <div className="space-y-1">
                {growthData.bharatiqRankings.map(r => (
                  <div key={r.intent} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">"{r.intent}"</span>
                    <span className={r.rank ? "text-foreground" : "text-destructive"}>
                      {r.rank ? `Rank #${r.rank} (${r.match}%)` : "Not ranked ⚠"}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                Matches this week: <span className="text-foreground font-medium">{growthData.bharatiqMatches}</span>
                {" · "}Converted: <span className="text-foreground font-medium">{growthData.bharatiqConverted}</span> ({Math.round(growthData.bharatiqConverted / growthData.bharatiqMatches * 100)}%)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
