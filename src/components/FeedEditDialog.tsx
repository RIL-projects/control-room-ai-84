import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FeedEntry } from "@/data/mockData";

// ... keep existing code (interfaces and getEditConfig function stay the same)

export function FeedEditDialog({ entry, open, onClose, onSubmit }: FeedEditDialogProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (entry && open) {
      const config = getEditConfig(entry);
      setValues(Object.fromEntries(config.fields.map(f => [f.id, f.defaultValue])));
    }
  }, [entry?.id, open]);

  if (!entry) return null;
  const config = getEditConfig(entry);

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
