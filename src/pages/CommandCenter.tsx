import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { PulseDot } from "@/components/PulseDot";
import { MiniSparkline } from "@/components/MiniSparkline";
import { FeedEditDialog } from "@/components/FeedEditDialog";
import { businessPulse, agents, activityFeed, priorities, snapshotMetrics, FeedEntry } from "@/data/mockData";
import { Star, MapPin, Activity, Check, X, Pencil } from "lucide-react";
import { toast } from "sonner";

export default function CommandCenter() {
  const navigate = useNavigate();
  const [visibleFeed, setVisibleFeed] = useState<FeedEntry[]>([]);
  const [feedIdx, setFeedIdx] = useState(0);
  const [approvedPriorities, setApprovedPriorities] = useState<Set<string>>(new Set());
  const [dismissedPriorities, setDismissedPriorities] = useState<Set<string>>(new Set());
  const [feedActions, setFeedActions] = useState<Record<string, string>>({});
  const [editingEntry, setEditingEntry] = useState<FeedEntry | null>(null);

  useEffect(() => {
    setVisibleFeed(activityFeed.slice(0, 3));
    setFeedIdx(3);
  }, []);

  useEffect(() => {
    if (feedIdx >= activityFeed.length) return;
    const timer = setTimeout(() => {
      setVisibleFeed(prev => [activityFeed[feedIdx], ...prev]);
      setFeedIdx(prev => prev + 1);
    }, 8000);
    return () => clearTimeout(timer);
  }, [feedIdx]);

  const agentRoute: Record<string, string> = { growth: "/growth", ops: "/operations", finance: "/finance" };

  const handleFeedAction = (entryId: string, action: string, entry?: FeedEntry) => {
    if (action === "edit" && entry) {
      setEditingEntry(entry);
      return;
    }
    setFeedActions(prev => ({ ...prev, [entryId]: action }));
    if (action === "approve") {
      toast.success("Action approved", { description: "The agent will proceed with execution." });
    } else if (action === "dismiss") {
      toast("Action dismissed", { description: "This item has been removed from the queue." });
    }
  };

  const handlePriorityAction = (priorityId: string, action: string) => {
    if (action === "Approve") {
      setApprovedPriorities(prev => new Set(prev).add(priorityId));
      toast.success("Priority approved", { description: "Agent will execute this action now." });
    } else if (action === "Snooze") {
      setDismissedPriorities(prev => new Set(prev).add(priorityId));
      toast("Priority snoozed", { description: "This will reappear in 2 hours." });
    } else if (action === "Dismiss") {
      setDismissedPriorities(prev => new Set(prev).add(priorityId));
      toast("Priority dismissed", { description: "Removed from today's list." });
    } else if (action === "View") {
      const priority = priorities.find(p => p.id === priorityId);
      if (priority?.label.includes("Growth") || priority?.label.includes("Customer")) {
        navigate("/growth");
      } else if (priority?.label.includes("Ops") || priority?.label.includes("Operation")) {
        navigate("/operations");
      } else if (priority?.label.includes("Finance") || priority?.label.includes("Margin")) {
        navigate("/finance");
      } else {
        navigate("/orchestration");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Section A: Business Pulse */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Command Center</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <MapPin className="w-3 h-3" /> {businessPulse.restaurant} · {businessPulse.date}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <Metric label="Revenue" value={<AnimatedCounter value={businessPulse.revenue} prefix="₹" />} />
          <Metric label="Orders" value={<AnimatedCounter value={businessPulse.orders} />} />
          <Metric label="Rating" value={<span className="flex items-center gap-1"><AnimatedCounter value={businessPulse.rating} decimals={1} /><Star className="w-3 h-3 text-warning" /></span>} />
          <Metric label="Capacity" value={<AnimatedCounter value={businessPulse.capacity} suffix="%" />} />
          <Activity className="w-4 h-4 text-success animate-heartbeat" />
        </div>
      </div>

      {/* Section B: Agent Status Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map(agent => (
          <Card
            key={agent.id}
            className="cursor-pointer hover:border-primary/50 transition-colors bg-card border-border"
            onClick={() => navigate(agentRoute[agent.id])}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <PulseDot color={agent.color} />
                <span className="text-sm font-medium text-foreground">{agent.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{agent.summary}</p>
              <Badge variant="outline" className="mt-2 text-xs capitalize">{agent.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sections C & D: Feed + Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Live Feed */}
        <div className="lg:col-span-3 space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Live Agent Activity</h2>
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
            <AnimatePresence initial={false}>
              {visibleFeed.map(entry => {
                const entryAction = feedActions[entry.id];
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: entryAction === "dismiss" ? 0.4 : 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className={`bg-card border-border ${entryAction === "dismiss" ? "opacity-50" : ""}`}>
                      <CardContent className="p-3 flex gap-3">
                        <span className="text-xs text-muted-foreground shrink-0 w-16 pt-0.5">{entry.time}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <PulseDot color={entry.agentColor} size="sm" />
                            <span className="text-xs font-semibold text-foreground">{entry.agent}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{entry.action}</p>
                          {!entryAction && (
                            <div className="flex gap-2 mt-2">
                              {entry.hasActions && (
                                <>
                                  <Button size="sm" variant="default" className="h-6 text-xs gap-1" onClick={() => handleFeedAction(entry.id, "approve")}>
                                    <Check className="w-3 h-3" /> Approve
                                  </Button>
                                  <Button size="sm" variant="outline" className="h-6 text-xs gap-1" onClick={() => handleFeedAction(entry.id, "dismiss")}>
                                    <X className="w-3 h-3" /> Dismiss
                                  </Button>
                                </>
                              )}
                              <Button size="sm" variant="outline" className="h-6 text-xs gap-1" onClick={() => handleFeedAction(entry.id, "edit", entry)}>
                                <Pencil className="w-3 h-3" /> Edit
                              </Button>
                            </div>
                          )}
                          {entryAction && (
                            <Badge variant="outline" className="mt-2 text-xs capitalize">
                              {entryAction === "approve" ? "✓ Approved" : entryAction === "dismiss" ? "Dismissed" : "✏ Updated"}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Priorities */}
        <div className="lg:col-span-2 space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Today's Priorities</h2>
          <div className="space-y-2">
            {priorities.map(p => {
              const isDone = approvedPriorities.has(p.id) || dismissedPriorities.has(p.id);
              return (
                <Card key={p.id} className={`bg-card border-border transition-opacity ${dismissedPriorities.has(p.id) ? "opacity-40" : ""}`}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <PulseDot color={p.level} size="sm" />
                      <Badge variant="outline" className="text-xs">{p.label}</Badge>
                      {approvedPriorities.has(p.id) && <Badge className="bg-success/10 text-success border-0 text-xs">✓ Done</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{p.text}</p>
                    {!isDone && (
                      <div className="flex gap-2">
                        {p.actions.map(action => (
                          <Button
                            key={action}
                            size="sm"
                            variant={action === "Approve" ? "default" : "outline"}
                            className="h-6 text-xs"
                            onClick={() => handlePriorityAction(p.id, action)}
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section E: Business Snapshot */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {snapshotMetrics.map(m => (
          <Card key={m.label} className="bg-card border-border">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-lg font-semibold text-foreground">
                    <AnimatedCounter value={m.value} decimals={m.suffix === "%" && m.value % 1 !== 0 ? 1 : 0} suffix={m.suffix} />
                  </span>
                  <span className="text-xs text-success ml-2">{m.change}</span>
                </div>
                <MiniSparkline data={m.trend} />
              </div>
              {m.subtext && <p className="text-xs text-muted-foreground mt-1">{m.subtext}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
