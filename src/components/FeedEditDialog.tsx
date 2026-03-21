import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  type: "text" | "number" | "select" | "textarea";
  defaultValue: string;
  options?: { label: string; value: string }[];
  prefix?: string;
  suffix?: string;
}

function getEditConfig(entry: FeedEntry): EditConfig {
  const action = entry.action.toLowerCase();

  // Finance Agent — Margin Alert (Paneer Butter Masala)
  if (entry.agent.includes("Finance") && action.includes("margin")) {
    return {
      title: "Edit Margin Alert Action",
      description: "Paneer Butter Masala margin dropped to 8%. Adjust pricing or supplier strategy.",
      fields: [
        { id: "dish", label: "Dish Name", type: "text", defaultValue: "Paneer Butter Masala" },
        { id: "currentPrice", label: "Current Price", type: "number", defaultValue: "320", prefix: "₹" },
        { id: "newPrice", label: "New Price", type: "number", defaultValue: "335", prefix: "₹" },
        { id: "action", label: "Recommended Action", type: "select", defaultValue: "raise_price", options: [
          { label: "Raise price by ₹15", value: "raise_price" },
          { label: "Switch to alternate supplier", value: "switch_supplier" },
          { label: "Reduce portion size slightly", value: "reduce_portion" },
          { label: "Remove from menu temporarily", value: "remove_menu" },
        ]},
        { id: "notes", label: "Notes for Agent", type: "textarea", defaultValue: "" },
      ],
    };
  }

  // Growth Agent — Campaign
  if (entry.agent.includes("Growth") && action.includes("campaign")) {
    return {
      title: "Edit Campaign Parameters",
      description: "Modify the campaign targeting, budget, or messaging.",
      fields: [
        { id: "campaignName", label: "Campaign Name", type: "text", defaultValue: action.includes("Biryani") ? "Weekend Biryani Blast" : "Tuesday Family Campaign" },
        { id: "targetRadius", label: "Target Radius (km)", type: "number", defaultValue: "3" },
        { id: "targetUsers", label: "Target Audience Size", type: "number", defaultValue: action.includes("800") ? "800" : "1200" },
        { id: "channel", label: "Channel", type: "select", defaultValue: "jio_push", options: [
          { label: "Jio Push + BharatIQ", value: "jio_bharatiq" },
          { label: "Jio Push Only", value: "jio_push" },
          { label: "WhatsApp Broadcast", value: "whatsapp" },
          { label: "All Channels", value: "all" },
        ]},
        { id: "notes", label: "Additional Instructions", type: "textarea", defaultValue: "" },
      ],
    };
  }

  // Ops Agent — Inventory / Procurement
  if (entry.agent.includes("Ops") && (action.includes("ordered") || action.includes("inventory"))) {
    return {
      title: "Edit Procurement Order",
      description: "Modify the auto-procurement order before it's finalized.",
      fields: [
        { id: "item", label: "Item", type: "text", defaultValue: "Basmati Rice" },
        { id: "quantity", label: "Quantity (kg)", type: "number", defaultValue: "15" },
        { id: "supplier", label: "Supplier", type: "select", defaultValue: "reliance", options: [
          { label: "Reliance B2B", value: "reliance" },
          { label: "Local Wholesaler", value: "local" },
          { label: "BigBasket Business", value: "bigbasket" },
        ]},
        { id: "maxPrice", label: "Max Price per kg", type: "number", defaultValue: "150", prefix: "₹" },
        { id: "notes", label: "Special Instructions", type: "textarea", defaultValue: "" },
      ],
    };
  }

  // Growth Agent — Loyalty / At-risk
  if (entry.agent.includes("Growth") && (action.includes("loyalty") || action.includes("at-risk") || action.includes("comeback"))) {
    return {
      title: "Edit Loyalty Campaign",
      description: "Adjust the comeback offer for at-risk regular customers.",
      fields: [
        { id: "offerAmount", label: "Offer Amount", type: "number", defaultValue: "100", prefix: "₹" },
        { id: "minOrder", label: "Minimum Order Value", type: "number", defaultValue: "300", prefix: "₹" },
        { id: "validity", label: "Offer Validity (days)", type: "number", defaultValue: "7" },
        { id: "channel", label: "Delivery Channel", type: "select", defaultValue: "whatsapp", options: [
          { label: "WhatsApp", value: "whatsapp" },
          { label: "SMS", value: "sms" },
          { label: "Push Notification", value: "push" },
        ]},
        { id: "notes", label: "Custom Message", type: "textarea", defaultValue: "" },
      ],
    };
  }

  // Ops Agent — Demand Forecast
  if (entry.agent.includes("Ops") && action.includes("forecast")) {
    return {
      title: "Edit Prep Advisory",
      description: "Saturday demand predicted +40%. Adjust the kitchen prep plan.",
      fields: [
        { id: "extraStaff", label: "Additional Staff to Call", type: "number", defaultValue: "2" },
        { id: "prepMultiplier", label: "Prep Quantity Multiplier", type: "select", defaultValue: "1.4", options: [
          { label: "1.2x (slight increase)", value: "1.2" },
          { label: "1.4x (recommended)", value: "1.4" },
          { label: "1.6x (aggressive)", value: "1.6" },
        ]},
        { id: "notes", label: "Kitchen Notes", type: "textarea", defaultValue: "" },
      ],
    };
  }

  // Generic fallback
  return {
    title: "Edit Agent Action",
    description: entry.action,
    fields: [
      { id: "instruction", label: "Updated Instructions", type: "textarea", defaultValue: "" },
      { id: "priority", label: "Priority", type: "select", defaultValue: "normal", options: [
        { label: "Low", value: "low" },
        { label: "Normal", value: "normal" },
        { label: "High", value: "high" },
        { label: "Urgent", value: "urgent" },
      ]},
    ],
  };
}

export function FeedEditDialog({ entry, open, onClose, onSubmit }: FeedEditDialogProps) {
  const config = entry ? getEditConfig(entry) : null;
  const [values, setValues] = useState<Record<string, string>>({});

  const handleOpen = () => {
    if (config) {
      const defaults: Record<string, string> = {};
      config.fields.forEach(f => { defaults[f.id] = f.defaultValue; });
      setValues(defaults);
    }
  };

  const handleSubmit = () => {
    if (!entry) return;
    toast.success("Changes submitted", { description: `Updated instructions sent to ${entry.agent}. Agent will re-execute with new parameters.` });
    onSubmit(entry.id);
    onClose();
  };

  if (!config || !entry) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); else handleOpen(); }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-base">{config.title}</DialogTitle>
          <DialogDescription className="text-xs">{config.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {config.fields.map(field => (
            <div key={field.id} className="space-y-1.5">
              <Label htmlFor={field.id} className="text-xs font-medium">{field.label}</Label>
              {field.type === "text" && (
                <Input
                  id={field.id}
                  value={values[field.id] ?? field.defaultValue}
                  onChange={e => setValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                  className="h-9 text-sm"
                />
              )}
              {field.type === "number" && (
                <div className="relative">
                  {field.prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{field.prefix}</span>}
                  <Input
                    id={field.id}
                    type="number"
                    value={values[field.id] ?? field.defaultValue}
                    onChange={e => setValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                    className={`h-9 text-sm ${field.prefix ? "pl-7" : ""}`}
                  />
                </div>
              )}
              {field.type === "select" && (
                <Select
                  value={values[field.id] ?? field.defaultValue}
                  onValueChange={v => setValues(prev => ({ ...prev, [field.id]: v }))}
                >
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
                  value={values[field.id] ?? field.defaultValue}
                  onChange={e => setValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                  placeholder="Optional notes..."
                  className="text-sm min-h-[60px]"
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
