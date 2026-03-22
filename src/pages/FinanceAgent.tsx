import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { PulseDot } from "@/components/PulseDot";
import { financeData } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Shield, CreditCard, TrendingUp, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function FinanceAgent() {
  const [fixApplied, setFixApplied] = useState<Set<string>>(new Set());
  const [creditApplied, setCreditApplied] = useState(false);
  const [activeAlert, setActiveAlert] = useState<typeof financeData.alerts[0] | null>(null);

  const plData = [
    { name: "Revenue", current: financeData.revenue.current / 1000, last: financeData.revenue.last / 1000, preNam: financeData.revenue.preNam / 1000 },
    { name: "COGS", current: financeData.cogs.current / 1000, last: financeData.cogs.last / 1000, preNam: financeData.cogs.preNam / 1000 },
    { name: "Gross Margin", current: financeData.grossMargin.current / 1000, last: financeData.grossMargin.last / 1000, preNam: financeData.grossMargin.preNam / 1000 },
    { name: "OpEx", current: financeData.opex.current / 1000, last: financeData.opex.last / 1000, preNam: financeData.opex.preNam / 1000 },
  ];

  const handleFixAlert = (alertId: string, alertTitle: string, alertAction: string) => {
    setFixApplied(prev => new Set(prev).add(alertId));
    toast.success(`${alertAction}`, {
      description: `"${alertTitle}" — fix has been applied. Agent will monitor impact over the next 48 hours.`,
    });
  };

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
            <Card key={a.id} className={`bg-card border-border ${fixApplied.has(a.id) ? "opacity-60" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <PulseDot color={fixApplied.has(a.id) ? "success" : a.level} size="sm" />
                  <h3 className="text-sm font-semibold text-foreground">{a.title}</h3>
                  {fixApplied.has(a.id) && <Badge className="bg-success/10 text-success border-0 text-xs">✓ Resolved</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{a.desc}</p>
                {a.action && (
                  <Button
                    size="sm"
                    variant={a.level === "destructive" ? "default" : "outline"}
                    className="h-6 text-xs"
                    disabled={fixApplied.has(a.id)}
                    onClick={() => setActiveAlert(a)}
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
            <Button
              size="sm"
              className="h-8 text-xs w-full"
              disabled={creditApplied}
              onClick={() => {
                setCreditApplied(true);
                toast.success("Credit application submitted!", {
                  description: `₹${financeData.credit.approved.toLocaleString()} credit line at ${financeData.credit.rate}% — approval expected within 24 hours.`,
                });
              }}
            >
              {creditApplied ? "✓ Application Submitted" : "Apply in 1 tap — no paperwork"}
            </Button>
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
      <MarginAlertDialog
        alert={activeAlert}
        open={!!activeAlert}
        onClose={() => setActiveAlert(null)}
        onSubmit={(id) => {
          setFixApplied(prev => new Set(prev).add(id));
          setActiveAlert(null);
        }}
      />
    </div>
  );
}

// ── Margin Alert Dialog ──
function MarginAlertDialog({ alert, open, onClose, onSubmit }: {
  alert: typeof financeData.alerts[0] | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (id: string) => void;
}) {
  const [priceIncrease, setPriceIncrease] = useState(15);
  const [supplier, setSupplier] = useState("current");
  const [qty, setQty] = useState("50");
  const [vendor, setVendor] = useState("reliance");

  if (!alert) return null;

  // View Fix Options — for paneer cost alert
  if (alert.action === "View Fix Options") {
    const affectedDishes = [
      { dish: "Paneer Butter Masala", currentMargin: 8, newMargin: 8 + Math.round(priceIncrease * 0.6) },
      { dish: "Shahi Paneer", currentMargin: 12, newMargin: 12 + Math.round(priceIncrease * 0.5) },
      { dish: "Paneer Tikka", currentMargin: 15, newMargin: 15 + Math.round(priceIncrease * 0.4) },
      { dish: "Kadai Paneer", currentMargin: 10, newMargin: 10 + Math.round(priceIncrease * 0.5) },
    ];

    return (
      <Dialog open={open} onOpenChange={v => !v && onClose()}>
        <DialogContent className="sm:max-w-[520px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">Fix Options — Paneer Cost Increase</DialogTitle>
            <DialogDescription className="text-xs">
              Paneer wholesale cost up 18% (₹320 → ₹378/kg). Choose a fix strategy below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-2">
              <PulseDot color="destructive" size="sm" />
              <Badge variant="outline" className="text-xs text-destructive">4 dishes affected</Badge>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Option 1: Raise Menu Prices</p>
              <div className="space-y-2">
                <Label className="text-xs">Price Increase: ₹{priceIncrease}</Label>
                <Slider value={[priceIncrease]} min={5} max={30} step={5} onValueChange={v => setPriceIncrease(v[0])} />
                <div className="space-y-1">
                  {affectedDishes.map(d => (
                    <div key={d.dish} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{d.dish}</span>
                      <span>
                        <span className="text-destructive">{d.currentMargin}%</span>
                        <span className="text-muted-foreground mx-1">→</span>
                        <span className="text-success">{d.newMargin}%</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-3">
              <p className="text-xs font-semibold text-foreground mb-2">Option 2: Switch Supplier</p>
              <Select value={supplier} onValueChange={setSupplier}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Supplier — ₹378/kg (quality: 4.6/5)</SelectItem>
                  <SelectItem value="krishna">Krishna Dairy — ₹340/kg (quality: 4.5/5)</SelectItem>
                  <SelectItem value="amul">Amul B2B — ₹355/kg (quality: 4.7/5)</SelectItem>
                  <SelectItem value="local">Local Wholesaler — ₹330/kg (quality: 4.2/5)</SelectItem>
                </SelectContent>
              </Select>
              {supplier !== "current" && (
                <p className="text-xs text-success mt-1">
                  Switching saves ₹{supplier === "krishna" ? "38" : supplier === "amul" ? "23" : "48"}/kg — restores margins by {supplier === "krishna" ? "5-7" : supplier === "amul" ? "3-4" : "6-9"}pp
                </p>
              )}
            </div>

            <div className="border-t border-border pt-3">
              <p className="text-xs font-semibold text-foreground mb-2">Option 3: Combination</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="combo-price" defaultChecked />
                  <Label htmlFor="combo-price" className="text-xs cursor-pointer">Raise price by ₹10</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="combo-supplier" />
                  <Label htmlFor="combo-supplier" className="text-xs cursor-pointer">Switch to Krishna Dairy (₹340/kg)</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="combo-portion" />
                  <Label htmlFor="combo-portion" className="text-xs cursor-pointer">Reduce portion by 5%</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" className="gap-1" onClick={() => {
              onSubmit(alert.id);
              toast.success("Fix applied", { description: "Paneer cost fix strategy submitted. Agent will monitor margins for 48 hours." });
            }}>
              <Check className="w-3 h-3" /> Apply Fix
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Auto-Order — for packaging cost alert
  if (alert.action === "Auto-Order") {
    const unitPrice = vendor === "reliance" ? 8.5 : vendor === "swiggy_pack" ? 9.2 : 7.8;
    const total = Math.round(parseInt(qty || "0") * unitPrice * 100) / 100;
    const savings = Math.round((11.5 - unitPrice) * parseInt(qty || "0") * 100) / 100;

    return (
      <Dialog open={open} onOpenChange={v => !v && onClose()}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle className="text-base">Auto-Order — Delivery Packaging</DialogTitle>
            <DialogDescription className="text-xs">
              Packaging cost has risen 12% over the last month. Bulk ordering can bring it back down.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-2">
              <PulseDot color="warning" size="sm" />
              <Badge variant="outline" className="text-xs">Current cost: ₹11.5/unit</Badge>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Supplier</Label>
              <Select value={vendor} onValueChange={setVendor}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="reliance">Reliance B2B — ₹8.50/unit (MOQ: 500)</SelectItem>
                  <SelectItem value="swiggy_pack">SwiggyPack Wholesale — ₹9.20/unit (MOQ: 200)</SelectItem>
                  <SelectItem value="local">Local Supplier — ₹7.80/unit (MOQ: 1000)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Quantity (units)</Label>
              <Input value={qty} onChange={e => setQty(e.target.value)} className="h-9 text-sm" />
            </div>

            <Card className="bg-muted/50 border-border">
              <CardContent className="p-3">
                <p className="text-xs font-medium text-foreground mb-1">Order Summary</p>
                <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                  <span>Unit Price:</span><span className="text-foreground">₹{unitPrice}/unit</span>
                  <span>Total Cost:</span><span className="text-foreground font-medium">₹{total.toLocaleString()}</span>
                  <span>Savings vs Current:</span><span className="text-success font-medium">₹{savings.toLocaleString()}</span>
                  <span>Est. Duration:</span><span className="text-foreground">{Math.round(parseInt(qty || "0") / 25)} days</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" className="gap-1" onClick={() => {
              onSubmit(alert.id);
              toast.success("Bulk order placed", { description: `${qty} packaging units ordered from ${vendor === "reliance" ? "Reliance B2B" : vendor === "swiggy_pack" ? "SwiggyPack" : "Local Supplier"} — saving ₹${savings.toLocaleString()}.` });
            }}>
              <Check className="w-3 h-3" /> Place Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
