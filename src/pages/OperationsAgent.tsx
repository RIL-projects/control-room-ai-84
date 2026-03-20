import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { PulseDot } from "@/components/PulseDot";
import { opsData } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Package, ChefHat, Clock, Users } from "lucide-react";

export default function OperationsAgent() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center gap-3">
        <PulseDot color="success" size="md" />
        <div>
          <h1 className="text-xl font-semibold text-foreground">Operations Agent</h1>
          <p className="text-sm text-muted-foreground">The operational brain of your restaurant</p>
        </div>
      </div>

      {/* Overview counters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: Clock, label: "Live", value: opsData.ordersLive, color: "text-primary" },
          { icon: ChefHat, label: "Preparing", value: opsData.ordersPreparing, color: "text-warning" },
          { icon: Package, label: "Dispatched", value: opsData.ordersDispatched, color: "text-success" },
          { icon: Package, label: "Completed", value: opsData.ordersCompleted, color: "text-muted-foreground" },
          { icon: Users, label: "Staff on Duty", value: `${opsData.staffOnDuty}/${opsData.staffTotal}`, color: "text-foreground" },
        ].map(s => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-semibold text-foreground">{typeof s.value === "number" ? <AnimatedCounter value={s.value} /> : s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kitchen capacity */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-foreground">Kitchen Load</p>
            <span className="text-xs text-muted-foreground">Peak: {opsData.kitchenPeak}% at {opsData.peakTime}</span>
          </div>
          <Progress value={opsData.kitchenLoad} className="h-3" />
          <p className="text-xs text-muted-foreground mt-1"><AnimatedCounter value={opsData.kitchenLoad} suffix="%" /> current capacity</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demand Forecast */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Demand Forecast (Today)</h2>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={opsData.hourlyForecast}>
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "white", border: "1px solid hsl(220, 13%, 87%)", borderRadius: 8, fontSize: 12 }}
                    itemStyle={{ color: "hsl(222, 47%, 11%)" }}
                  />
                  <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
                    {opsData.hourlyForecast.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.orders > 40 ? "hsl(0, 84%, 60%)" : entry.orders > 25 ? "hsl(38, 92%, 50%)" : "hsl(213, 58%, 45%)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs border-destructive text-destructive">Saturday Surge: +40%</Badge>
                <span className="text-xs text-muted-foreground">Prep advisory generated</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Smart Procurement */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Smart Procurement</h2>
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-3">
              {opsData.procurement.map(p => (
                <div key={p.item} className="flex items-center justify-between text-xs border-b border-border pb-2 last:border-0">
                  <div>
                    <p className="text-foreground font-medium">{p.item}</p>
                    <p className="text-muted-foreground">{p.supplier}{p.price ? ` · ₹${p.price}/kg` : ""}</p>
                  </div>
                  <Badge className="bg-success/10 text-success border-0">Saved ₹{p.saved}</Badge>
                </div>
              ))}
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">Total Savings This Month</p>
                <p className="text-lg font-bold text-success">₹<AnimatedCounter value={opsData.totalSavings} /></p>
                <p className="text-xs text-muted-foreground">12% below market prices</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Menu Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Top Profitable Dishes</h3>
            {opsData.topProfitable.map(d => (
              <div key={d.dish} className="flex items-center justify-between text-xs py-1.5 border-b border-border last:border-0">
                <span className="text-foreground">{d.dish}</span>
                <div className="flex items-center gap-4">
                  <span className="text-success">{d.margin}% margin</span>
                  <span className="text-muted-foreground">{d.orders} orders/mo</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="bg-card border-border border-warning/30">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">⚠ Agent Recommendation</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Retire <span className="text-destructive font-medium">"Mushroom Do Pyaza"</span> (ordered 3x this month, 4% margin).
              Replace with <span className="text-success font-medium">"Mini Thali" category</span> — 340+ weekly searches, est. 15% margin.
            </p>
            <div className="mt-3 space-y-1">
              {opsData.bottomDishes.map(d => (
                <div key={d.dish} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{d.dish}</span>
                  <span className="text-destructive">{d.margin}% margin · {d.orders} orders</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
