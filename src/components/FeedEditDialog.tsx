import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FeedEntry } from "@/data/mockData";

interface FeedEditDialogProps {
  entry: FeedEntry | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (entryId: string) => void;
}

interface EditConfig {
  title: string;
  description: string;
  fields: FieldConfig[];
}

interface FieldConfig {
  id: string;
  label: string;
  type: "input" | "select" | "textarea";
  defaultValue: string;
  options?: { label: string; value: string }[];
  prefix?: string;
  suffix?: string;
}

function getEditConfig(entry: FeedEntry): EditConfig {
  const action = entry.action.toLowerCase();

  if (action.includes("margin") && action.includes("paneer")) {
    return {
      title: "Edit Margin Alert — Paneer Butter Masala",
      description: "Current margin is 8%. Agent recommends raising price by ₹15 or switching supplier.",
      fields: [
        { id: "action_type", label: "Recommended Action", type: "select", defaultValue: "raise_price", options: [
          { label: "Raise menu price", value: "raise_price" },
          { label: "Switch supplier", value: "switch_supplier" },
          { label: "Reduce portion size", value: "reduce_portion" },
          { label: "Remove from menu", value: "remove" },
        ]},
        { id: "price_adjustment", label: "Price Adjustment", type: "input", defaultValue: "15", prefix: "₹" },
        { id: "target_margin", label: "Target Margin (%)", type: "input", defaultValue: "18" },
        { id: "notes", label: "Notes for Agent", type: "textarea", defaultValue: "Apply from tomorrow's menu update." },
      ],
    };
  }

  if (action.includes("campaign") || action.includes("biryani")) {
    return {
      title: "Edit Campaign — Weekend Biryani Blast",
      description: "Modify campaign parameters before the agent proceeds.",
      fields: [
        { id: "audience_radius", label: "Target Radius (km)", type: "input", defaultValue: "3" },
        { id: "audience_size", label: "Target Audience Size", type: "input", defaultValue: "800" },
        { id: "channel", label: "Channel", type: "select", defaultValue: "jio_bharatiq", options: [
          { label: "Jio Push + BharatIQ", value: "jio_bharatiq" },
          { label: "Jio Push Only", value: "jio" },
          { label: "WhatsApp Broadcast", value: "whatsapp" },
          { label: "All Channels", value: "all" },
        ]},
        { id: "budget", label: "Campaign Budget", type: "input", defaultValue: "2000", prefix: "₹" },
        { id: "notes", label: "Additional Instructions", type: "textarea", defaultValue: "" },
      ],
    };
  }

  if (action.includes("inventory") || action.includes("auto-ordered") || action.includes("rice")) {
    return {
      title: "Edit Procurement Order",
      description: "Modify the auto-procurement details before confirmation.",
      fields: [
        { id: "quantity", label: "Quantity (kg)", type: "input", defaultValue: "15" },
        { id: "supplier", label: "Supplier", type: "select", defaultValue: "reliance", options: [
          { label: "Reliance B2B", value: "reliance" },
          { label: "Local Wholesaler", value: "local" },
          { label: "BigBasket B2B", value: "bigbasket" },
        ]},
        { id: "max_price", label: "Max Price per kg", type: "input", defaultValue: "150", prefix: "₹" },
        { id: "delivery_date", label: "Delivery Date", type: "input", defaultValue: "Tomorrow, 6 AM" },
        { id: "notes", label: "Special Instructions", type: "textarea", defaultValue: "" },
      ],
    };
  }

  if (action.includes("loyalty") || action.includes("comeback")) {
    return {
      title: "Edit Loyalty Campaign",
      description: "Modify comeback offer parameters for at-risk customers.",
      fields: [
        { id: "offer_amount", label: "Offer Amount", type: "input", defaultValue: "100", prefix: "₹" },
        { id: "min_order", label: "Minimum Order Value", type: "input", defaultValue: "300", prefix: "₹" },
        { id: "validity", label: "Offer Validity", type: "select", defaultValue: "7", options: [
          { label: "3 days", value: "3" },
          { label: "7 days", value: "7" },
          { label: "14 days", value: "14" },
          { label: "30 days", value: "30" },
        ]},
        { id: "message", label: "Custom Message", type: "textarea", defaultValue: "We miss you at Ravi's Kitchen! Here's a special offer just for you." },
      ],
    };
  }

  // Generic fallback
  return {
    title: `Edit Agent Action`,
    description: entry.action,
    fields: [
      { id: "priority", label: "Priority", type: "select", defaultValue: "normal", options: [
        { label: "High", value: "high" },
        { label: "Normal", value: "normal" },
        { label: "Low", value: "low" },
      ]},
      { id: "notes", label: "Notes / Instructions", type: "textarea", defaultValue: "" },
    ],
  };
}

export function FeedEditDialog({ entry, open, onClose, onSubmit }: FeedEditDialogProps) {
  if (!entry) return null;

  const config = getEditConfig(entry);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(config.fields.map(f => [f.id, f.defaultValue]))
  );

  const handleChange = (id: string, value: string) => {
    setValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    onSubmit(entry.id);
    toast.success("Changes submitted", {
      description: `${config.title.replace("Edit ", "")} — updated parameters sent to agent.`,
    });
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
            <Badge variant="outline" className="text-xs">{entry.agent}</Badge>
            <span className="text-xs text-muted-foreground">{entry.time}</span>
          </div>

          {config.fields.map(field => (
            <div key={field.id} className="space-y-1.5">
              <Label htmlFor={field.id} className="text-xs">{field.label}</Label>

              {field.type === "input" && (
                <div className="relative">
                  {field.prefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{field.prefix}</span>
                  )}
                  <Input
                    id={field.id}
                    value={values[field.id]}
                    onChange={e => handleChange(field.id, e.target.value)}
                    className={`h-9 text-sm ${field.prefix ? "pl-7" : ""}`}
                  />
                </div>
              )}

              {field.type === "select" && (
                <Select value={values[field.id]} onValueChange={v => handleChange(field.id, v)}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === "textarea" && (
                <Textarea
                  id={field.id}
                  value={values[field.id]}
                  onChange={e => handleChange(field.id, e.target.value)}
                  className="text-sm min-h-[60px]"
                  rows={2}
                />
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
