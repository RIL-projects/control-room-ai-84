import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { PulseDot } from "@/components/PulseDot";
import { financeData } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Shield, CreditCard, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function FinanceAgent() {
  const [fixApplied, setFixApplied] = useState<Set<string>>(new Set());

  const plData = [
    { name: "Revenue", current: financeData.revenue.current / 1000, last: financeData.revenue.last / 1000, preNam: financeData.revenue.preNam / 1000 },
    { name: "COGS", current: financeData.cogs.current / 1000, last: financeData.cogs.last / 1000, preNam: financeData.cogs.preNam / 1000 },
    { name: "Gross Margin", current: financeData.grossMargin.current / 1000, last: financeData.grossMargin.last / 1000, preNam: financeData.grossMargin.preNam / 1000 },
    { name: "OpEx", current: financeData.opex.current / 1000, last: financeData.opex.last / 1000, preNam: financeData.opex.preNam / 1000 },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center gap-3">
        <PulseDot color="warning" size="md" />
        <div>
          <h1 className="text-xl font-semibold text-foreground">Financial Intelligence Agent</h1>
          <p className="text-sm text-muted-foreground">Your financial guardian</p>
        </div>
      </div>

      {/* P&L Summary */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">P&L Summary (₹ in thousands)</h3>
            <Badge className="bg-success/10 text-success border-0">
              Net Margin: {financeData.netMargin.current}% ↑ from {financeData.netMargin.preNam}%
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={plData}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "white", border: "1px solid hsl(220, 13%, 87%)", borderRadius: 8, fontSize: 12 }}
                itemStyle={{ color: "hsl(222, 47%, 11%)" }}
                formatter={(v: number) => `₹${v}K`}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="current" name="This Month" fill="hsl(213, 58%, 45%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="last" name="Last Month" fill="hsl(213, 58%, 35%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="preNam" name="Pre-NAM" fill="hsl(217, 33%, 25%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dish Profitability */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Per-Dish Profitability</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left pb-2">Dish</th>
                    <th className="text-right pb-2">Revenue</th>
                    <th className="text-right pb-2">Food Cost</th>
                    <th className="text-right pb-2">Margin</th>
                    <th className="text-right pb-2">Orders/wk</th>
                  </tr>
                </thead>
                <tbody>
                  {financeData.dishProfitability.map(d => (
                    <tr key={d.dish} className={`border-b border-border/50 ${d.status === "critical" ? "bg-destructive/5" : ""}`}>
                      <td className="py-2 text-foreground font-medium">
                        {d.dish}
                        {d.status === "critical" && <span className="text-destructive ml-1">⚠</span>}
                      </td>
                      <td className="text-right text-muted-foreground">₹{(d.revenue / 1000).toFixed(0)}K</td>
                      <td className="text-right text-muted-foreground">{d.foodCost}%</td>
                      <td className={`text-right font-medium ${d.margin < 10 ? "text-destructive" : d.margin < 20 ? "text-warning" : "text-success"}`}>
                        {d.margin}%
                      </td>
                      <td className="text-right text-muted-foreground">{d.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Margin Alerts */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Margin Alert Center</h2>
          {financeData.alerts.map(a => (
            <Card key={a.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <PulseDot color={a.level} size="sm" />
                  <h3 className="text-sm font-semibold text-foreground">{a.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{a.desc}</p>
                {a.action && (
                  <Button
                    size="sm"
                    variant={a.level === "destructive" ? "default" : "outline"}
                    className="h-6 text-xs"
                    disabled={fixApplied.has(a.id)}
                    onClick={() => setFixApplied(prev => new Set(prev).add(a.id))}
                  >
                    {fixApplied.has(a.id) ? "✓ Applied" : a.action}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Working Capital + Commission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border border-primary/30">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">JFS Pre-approved Credit</h3>
            </div>
            <p className="text-2xl font-bold text-foreground">₹<AnimatedCounter value={financeData.credit.approved} /></p>
            <p className="text-xs text-muted-foreground">
              at {financeData.credit.rate}% annual <span className="text-success">(vs {financeData.credit.marketRate}% market)</span>
            </p>
            <Button size="sm" className="h-8 text-xs w-full">Apply in 1 tap — no paperwork</Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border border-success/30">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-success" />
              <h3 className="text-sm font-semibold text-foreground">Commission Savings</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Zomato/Swiggy ({financeData.commissions.zomatoRate}%)</p>
                <p className="text-lg font-semibold text-destructive line-through">₹{(financeData.commissions.zomato / 1000).toFixed(0)}K</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">NAM ({financeData.commissions.namRate}%)</p>
                <p className="text-lg font-semibold text-success">₹{(financeData.commissions.nam / 1000).toFixed(0)}K</p>
              </div>
            </div>
            <div className="bg-success/10 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">You Saved This Month</p>
              <p className="text-2xl font-bold text-success">₹<AnimatedCounter value={financeData.commissions.saved} /></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
