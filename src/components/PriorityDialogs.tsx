import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PulseDot } from "@/components/PulseDot";
import { toast } from "sonner";

interface Priority {
  id: string;
  level: "destructive" | "warning" | "success";
  label: string;
  text: string;
  actions: string[];
}

// ── Modify Dialog ──
interface ModifyDialogProps {
  priority: Priority | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (id: string) => void;
}

function getModifyFields(p: Priority) {
  if (p.text.toLowerCase().includes("paneer") || p.text.toLowerCase().includes("pricing")) {
    return {
      title: "Modify Pricing Recommendation",
      description: "The Finance Agent recommends adjusting Paneer dish pricing due to rising ingredient costs. Current margin: 8%.",
      fields: [
        { id: "action", label: "Pricing Strategy", type: "select" as const, defaultValue: "raise_price", options: [
          { label: "Raise menu price by ₹15", value: "raise_price" },
          { label: "Raise menu price by ₹10", value: "raise_small" },
          { label: "Switch to cheaper supplier", value: "switch_supplier" },
          { label: "Reduce portion by 10%", value: "reduce_portion" },
        ]},
        { id: "apply_to", label: "Apply To", type: "select" as const, defaultValue: "pbm_only", options: [
          { label: "Paneer Butter Masala only", value: "pbm_only" },
          { label: "All paneer dishes (4 items)", value: "all_paneer" },
          { label: "All affected dishes", value: "all_affected" },
        ]},
        { id: "effective", label: "Effective From", type: "input" as const, defaultValue: "Tomorrow" },
        { id: "notes", label: "Additional Instructions", type: "textarea" as const, defaultValue: "" },
      ],
    };
  }
  if (p.text.toLowerCase().includes("mini meals") || p.text.toLowerCase().includes("menu")) {
    return {
      title: "Modify Menu Suggestion",
      description: "Ops Agent detected 340+ weekly searches for 'quick lunch under ₹200' and suggests adding Mini Meals.",
      fields: [
        { id: "category_name", label: "Category Name", type: "input" as const, defaultValue: "Mini Meals" },
        { id: "price_range", label: "Target Price Range", type: "select" as const, defaultValue: "150-200", options: [
          { label: "₹99 – ₹149", value: "99-149" },
          { label: "₹150 – ₹199", value: "150-200" },
          { label: "₹200 – ₹249", value: "200-249" },
        ]},
        { id: "items_count", label: "Number of Items to Add", type: "input" as const, defaultValue: "4" },
        { id: "notes", label: "Menu Items / Notes", type: "textarea" as const, defaultValue: "Mini Dal + Rice, Mini Thali, Quick Biryani Bowl" },
      ],
    };
  }
  return {
    title: "Modify Priority",
    description: p.text,
    fields: [
      { id: "notes", label: "Instructions", type: "textarea" as const, defaultValue: "" },
    ],
  };
}

export function PriorityModifyDialog({ priority, open, onClose, onSubmit }: ModifyDialogProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (priority && open) {
      const config = getModifyFields(priority);
      setValues(Object.fromEntries(config.fields.map(f => [f.id, f.defaultValue])));
    }
  }, [priority?.id, open]);

  if (!priority) return null;
  const config = getModifyFields(priority);

  const handleSubmit = () => {
    onSubmit(priority.id);
    toast.success("Modification submitted", { description: "Agent will apply your changes." });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-base">{config.title}</DialogTitle>
          <DialogDescription className="text-xs">{config.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-2">
            <PulseDot color={priority.level} size="sm" />
            <Badge variant="outline" className="text-xs">{priority.label}</Badge>
          </div>
          {config.fields.map(field => (
            <div key={field.id} className="space-y-1.5">
              <Label htmlFor={field.id} className="text-xs">{field.label}</Label>
              {field.type === "input" && (
                <Input id={field.id} value={values[field.id] ?? ""} onChange={e => setValues(prev => ({ ...prev, [field.id]: e.target.value }))} className="h-9 text-sm" />
              )}
              {field.type === "select" && (
                <Select value={values[field.id]} onValueChange={v => setValues(prev => ({ ...prev, [field.id]: v }))}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {field.options?.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
              {field.type === "textarea" && (
                <Textarea id={field.id} value={values[field.id] ?? ""} onChange={e => setValues(prev => ({ ...prev, [field.id]: e.target.value }))} className="text-sm min-h-[60px]" rows={2} />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit}>Submit Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── View Details Dialog ──
interface ViewDetailsDialogProps {
  priority: Priority | null;
  open: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

function getDetailsContent(p: Priority) {
  if (p.text.toLowerCase().includes("paneer") || p.text.toLowerCase().includes("pricing")) {
    return {
      title: "Pricing Adjustment Details",
      sections: [
        { heading: "Issue", content: "Paneer wholesale cost increased 18% (₹320→₹378/kg) over the last 2 weeks, reducing margin on Paneer Butter Masala from 22% to 8%." },
        { heading: "Affected Dishes", items: ["Paneer Butter Masala — margin 8% (was 22%)", "Shahi Paneer — margin 12% (was 26%)", "Paneer Tikka — margin 15% (was 28%)", "Kadai Paneer — margin 10% (was 24%)"] },
        { heading: "Agent Recommendation", content: "Raise Paneer Butter Masala price by ₹15 (₹285 → ₹300). This restores margin to ~18% while keeping price competitive (area avg: ₹310)." },
        { heading: "Alternative Options", items: ["Switch supplier to Krishna Dairy (₹340/kg, quality score 4.5/5)", "Reduce portion size by 10% (saves ₹6/plate)", "Combo bundle with naan to increase perceived value"] },
      ],
    };
  }
  if (p.text.toLowerCase().includes("mini meals") || p.text.toLowerCase().includes("menu")) {
    return {
      title: "Menu Addition — Mini Meals",
      sections: [
        { heading: "Opportunity", content: "340+ weekly BharatIQ searches for 'quick lunch under ₹200' in Powai area with no strong local match." },
        { heading: "Suggested Items", items: ["Mini Dal Makhani + Rice — est. cost ₹65, price ₹149, margin 56%", "Quick Biryani Bowl — est. cost ₹80, price ₹179, margin 55%", "Mini Thali (3 items) — est. cost ₹90, price ₹199, margin 55%", "Roti + Sabzi Combo — est. cost ₹50, price ₹129, margin 61%"] },
        { heading: "Projected Impact", content: "Estimated 15-25 additional orders/day at avg ₹165 = ₹2,475–₹4,125 daily revenue. Minimal kitchen overhead as items use existing ingredients." },
      ],
    };
  }
  if (p.text.toLowerCase().includes("campaign") || p.text.toLowerCase().includes("tuesday")) {
    return {
      title: "Tuesday Campaign — Live Results",
      sections: [
        { heading: "Campaign", content: "Tuesday Family Campaign targeting 1,200 Jio users within 3km of Powai outlet." },
        { heading: "Performance (so far)", items: ["Reached: 840 / 1,200 (70%)", "Clicked: 156 (18.6% CTR)", "Ordered: 34 (21.8% conversion)", "Revenue generated: ₹13,600", "ROI: 4.2x on ₹3,200 spend"] },
        { heading: "Status", content: "Campaign is active and performing above benchmarks. Growth Agent recommends extending to Vashi outlet." },
      ],
    };
  }
  if (p.text.toLowerCase().includes("procurement") || p.text.toLowerCase().includes("auto-procurement")) {
    return {
      title: "Auto-Procurement Summary",
      sections: [
        { heading: "Today's Orders", items: ["Basmati Rice 25kg — Reliance B2B — ₹142/kg (saved ₹650)", "Cooking Oil 10L — Reliance B2B — ₹165/L (saved ₹130)", "Fresh Vegetables — Local Supplier — (saved ₹280)"] },
        { heading: "Total Savings", content: "₹4,200 saved on today's procurement. Monthly savings so far: ₹18,400 (12% below market average)." },
        { heading: "Quality Scores", items: ["Reliance B2B: 4.8/5 (23 orders)", "Local Vegetable Supplier: 4.5/5 (45 orders)"] },
      ],
    };
  }
  return {
    title: "Priority Details",
    sections: [{ heading: "Description", content: p.text }],
  };
}

export function PriorityViewDialog({ priority, open, onClose, onNavigate }: ViewDetailsDialogProps) {
  if (!priority) return null;
  const details = getDetailsContent(priority);

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-[520px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">{details.title}</DialogTitle>
          <DialogDescription className="text-xs flex items-center gap-2">
            <PulseDot color={priority.level} size="sm" />
            {priority.label} · {priority.text}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {details.sections.map((section, i) => (
            <div key={i}>
              <p className="text-xs font-semibold text-foreground mb-1">{section.heading}</p>
              {section.content && <p className="text-xs text-muted-foreground leading-relaxed">{section.content}</p>}
              {section.items && (
                <ul className="space-y-1 mt-1">
                  {section.items.map((item, j) => (
                    <li key={j} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>{item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          <Button size="sm" onClick={() => { onNavigate(priority.id); onClose(); }}>Go to Agent</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Dismiss Confirmation ──
interface DismissDialogProps {
  priority: Priority | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export function PriorityDismissDialog({ priority, open, onClose, onConfirm }: DismissDialogProps) {
  if (!priority) return null;

  return (
    <AlertDialog open={open} onOpenChange={v => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base">Dismiss Priority</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            Are you sure you want to dismiss "<span className="font-medium">{priority.text}</span>"? This will remove it from today's list. You can find it later in the agent's history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => { onConfirm(priority.id); onClose(); }}>
            Dismiss
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
