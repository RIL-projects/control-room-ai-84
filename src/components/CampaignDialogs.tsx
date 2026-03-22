import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Campaign {
  name: string;
  channel: string;
  target: string;
  status: string;
  reached: number;
  clicked: number;
  ordered: number;
  roi: number;
}

// ── Edit Audience Dialog ──
interface EditAudienceDialogProps {
  campaign: Campaign | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export function EditAudienceDialog({ campaign, open, onClose, onSubmit }: EditAudienceDialogProps) {
  const [radius, setRadius] = useState("3");
  const [ageGroup, setAgeGroup] = useState("all");
  const [audienceType, setAudienceType] = useState("families");
  const [minSpend, setMinSpend] = useState("200");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (campaign && open) {
      const isFamilyCampaign = campaign.name.toLowerCase().includes("family") || campaign.name.toLowerCase().includes("thali");
      setRadius(campaign.target.includes("3km") ? "3" : "5");
      setAudienceType(isFamilyCampaign ? "families" : "all");
      setAgeGroup("all");
      setMinSpend("200");
      setNotes("");
    }
  }, [campaign?.name, open]);

  if (!campaign) return null;

  const estAudience = Math.round(parseInt(radius) * 400 * (audienceType === "all" ? 1 : 0.6));

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-base">Edit Audience — {campaign.name}</DialogTitle>
          <DialogDescription className="text-xs">
            Refine targeting parameters. Agent will re-optimize delivery within 30 minutes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{campaign.channel}</Badge>
            <Badge variant="outline" className="text-xs">{campaign.status}</Badge>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Target Radius: {radius} km</Label>
            <Slider
              value={[parseInt(radius)]}
              min={1}
              max={10}
              step={1}
              onValueChange={v => setRadius(String(v[0]))}
            />
            <p className="text-xs text-muted-foreground">Estimated audience: ~{estAudience.toLocaleString()} users</p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Audience Segment</Label>
            <Select value={audienceType} onValueChange={setAudienceType}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="families">Families</SelectItem>
                <SelectItem value="office">Office Goers</SelectItem>
                <SelectItem value="students">Students & Young Adults</SelectItem>
                <SelectItem value="premium">Premium Diners</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Age Group</Label>
            <Select value={ageGroup} onValueChange={setAgeGroup}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="18-25">18–25</SelectItem>
                <SelectItem value="25-35">25–35</SelectItem>
                <SelectItem value="35-50">35–50</SelectItem>
                <SelectItem value="50+">50+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Minimum Past Spend (₹)</Label>
            <Input value={minSpend} onChange={e => setMinSpend(e.target.value)} className="h-9 text-sm" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Additional Targeting Notes</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="text-sm min-h-[60px]" rows={2} placeholder="e.g. Exclude users who ordered in last 48hrs" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={() => {
            onSubmit(campaign.name);
            toast.success("Audience updated", {
              description: `"${campaign.name}" will target ~${estAudience.toLocaleString()} ${audienceType} users within ${radius}km. Re-optimizing...`,
            });
            onClose();
          }}>Save Audience</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Boost Budget Dialog ──
interface BoostBudgetDialogProps {
  campaign: Campaign | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export function BoostBudgetDialog({ campaign, open, onClose, onSubmit }: BoostBudgetDialogProps) {
  const [boostPct, setBoostPct] = useState(50);
  const [duration, setDuration] = useState("remaining");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setBoostPct(50);
      setDuration("remaining");
      setNotes("");
    }
  }, [open]);

  if (!campaign) return null;

  const baseBudget = campaign.name.includes("Family Thali") ? 3200 : 2400;
  const newBudget = Math.round(baseBudget * (1 + boostPct / 100));
  const extraReach = Math.round(campaign.reached * (boostPct / 100) * 0.8);

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-base">Boost Budget — {campaign.name}</DialogTitle>
          <DialogDescription className="text-xs">
            Increase campaign spend to reach more users. Current ROI: {campaign.roi}x
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Current Budget: ₹{baseBudget.toLocaleString()}</Badge>
            <Badge className="bg-success/10 text-success border-0 text-xs">ROI: {campaign.roi}x</Badge>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Boost Amount: +{boostPct}%</Label>
            <Slider
              value={[boostPct]}
              min={10}
              max={200}
              step={10}
              onValueChange={v => setBoostPct(v[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>New Budget: ₹{newBudget.toLocaleString()}</span>
              <span>+₹{(newBudget - baseBudget).toLocaleString()}</span>
            </div>
          </div>

          <Card className="bg-muted/50 border-border">
            <CardContent className="p-3 space-y-1">
              <p className="text-xs font-medium text-foreground">Projected Impact</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span>Additional Reach:</span>
                <span className="text-foreground font-medium">+{extraReach.toLocaleString()} users</span>
                <span>Est. Additional Orders:</span>
                <span className="text-foreground font-medium">+{Math.round(extraReach * 0.04)}</span>
                <span>Est. Additional Revenue:</span>
                <span className="text-foreground font-medium">₹{(Math.round(extraReach * 0.04) * 400).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-1.5">
            <Label className="text-xs">Boost Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="remaining">Rest of Campaign</SelectItem>
                <SelectItem value="24h">Next 24 Hours</SelectItem>
                <SelectItem value="48h">Next 48 Hours</SelectItem>
                <SelectItem value="weekend">This Weekend Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Notes (optional)</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="text-sm min-h-[50px]" rows={2} placeholder="e.g. Focus on dinner hours only" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={() => {
            onSubmit(campaign.name);
            toast.success(`Budget boosted +${boostPct}%`, {
              description: `"${campaign.name}" budget: ₹${baseBudget.toLocaleString()} → ₹${newBudget.toLocaleString()}. Expected +${extraReach.toLocaleString()} reach.`,
            });
            onClose();
          }}>Confirm Boost</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
