import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { PulseDot } from "@/components/PulseDot";
import { orchestrationNodes, decisionLog } from "@/data/mockData";
import { Pause, Play, RotateCcw, ChevronRight } from "lucide-react";

type NodeStatus = "active" | "monitoring" | "queued";

interface SubagentNode {
  id: string;
  name: string;
  status: NodeStatus;
  task: string;
  x: number;
  y: number;
}

interface PrimaryNode {
  id: string;
  name: string;
  status: NodeStatus;
  x: number;
  y: number;
  subagents: SubagentNode[];
}

const statusColor = (s: NodeStatus) =>
  s === "active" ? "success" : s === "monitoring" ? "warning" : "primary";

const statusBorder = (s: NodeStatus) =>
  s === "active" ? "border-success" : s === "monitoring" ? "border-warning" : "border-primary";

export default function AgentOrchestration() {
  const [selected, setSelected] = useState<string | null>(null);
  const [autonomy, setAutonomy] = useState<Record<string, number>>({});
  const [spawning, setSpawning] = useState(false);
  const [spawnedNode, setSpawnedNode] = useState<SubagentNode | null>(null);
  const [spawnPhase, setSpawnPhase] = useState("");

  const allNodes = orchestrationNodes.primary;
  const allSubagents = allNodes.flatMap(n => n.subagents);
  const selectedNode = allNodes.find(n => n.id === selected) || allSubagents.find(n => n.id === selected);

  const handleSpawn = useCallback(() => {
    setSpawning(true);
    setSpawnPhase("Initializing...");
    setTimeout(() => setSpawnPhase("Analyzing audience..."), 1200);
    setTimeout(() => setSpawnPhase("Creating campaign..."), 2400);
    setTimeout(() => {
      setSpawnPhase("Live!");
      setSpawnedNode({
        id: "new-campaign",
        name: "New Campaign Subagent",
        status: "active",
        task: "Running new campaign",
        x: 150,
        y: 160,
      });
    }, 3600);
    setTimeout(() => setSpawning(false), 5000);
  }, []);

  const autonomyLabel = (v: number) => v < 33 ? "Manual" : v < 66 ? "Suggest" : "Full Auto";

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Agent Orchestration Center</h1>
          <p className="text-sm text-muted-foreground">Visualize and control your AI agent ecosystem</p>
        </div>
        <Button onClick={handleSpawn} disabled={spawning} className="gap-2">
          {spawning ? spawnPhase : "Launch New Campaign"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Canvas */}
        <div className="lg:col-span-7">
          <Card className="bg-card border-border overflow-hidden">
            <CardContent className="p-0">
              <svg viewBox="0 0 800 650" className="w-full h-auto" style={{ minHeight: 400 }}>
                {/* Connection lines */}
                {allNodes.map(primary =>
                  primary.subagents.map(sub => (
                    <g key={`line-${primary.id}-${sub.id}`}>
                      <line
                        x1={primary.x} y1={primary.y + 30}
                        x2={sub.x} y2={sub.y - 20}
                        stroke="hsl(213, 58%, 30%)"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                      />
                      {/* Flowing dot */}
                      <circle r="3" fill="hsl(213, 58%, 45%)">
                        <animateMotion
                          dur="3s"
                          repeatCount="indefinite"
                          path={`M${primary.x},${primary.y + 30} L${sub.x},${sub.y - 20}`}
                        />
                      </circle>
                    </g>
                  ))
                )}

                {/* Spawned node connection */}
                {spawnedNode && (
                  <g>
                    <line
                      x1={allNodes[0].x} y1={allNodes[0].y + 30}
                      x2={spawnedNode.x} y2={spawnedNode.y - 20}
                      stroke="hsl(213, 58%, 30%)"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                    />
                  </g>
                )}

                {/* Primary nodes */}
                {allNodes.map(node => (
                  <g
                    key={node.id}
                    className="cursor-pointer"
                    onClick={() => setSelected(node.id)}
                  >
                    <circle
                      cx={node.x} cy={node.y}
                      r={40}
                      fill="hsl(0, 0%, 100%)"
                      stroke={node.status === "active" ? "hsl(160, 84%, 39%)" : "hsl(38, 92%, 50%)"} className="drop-shadow-sm"
                      strokeWidth={selected === node.id ? 3 : 2}
                    >
                      <animate
                        attributeName="stroke-opacity"
                        values="1;0.4;1"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <text
                      x={node.x} y={node.y - 4}
                      textAnchor="middle"
                        fill="hsl(0, 0%, 100%)"
                      fontSize={9}
                      fontWeight="600"
                    >
                      {node.name.split(" ").slice(0, 2).join(" ")}
                    </text>
                    <text
                      x={node.x} y={node.y + 10}
                      textAnchor="middle"
                        fill="hsl(0, 0%, 100%)"
                      fontSize={9}
                      fontWeight="600"
                    >
                      {node.name.split(" ").slice(2).join(" ")}
                    </text>
                  </g>
                ))}

                {/* Subagent nodes */}
                {allNodes.map(primary =>
                  primary.subagents.map(sub => (
                    <g
                      key={sub.id}
                      className="cursor-pointer"
                      onClick={() => setSelected(sub.id)}
                    >
                      <rect
                        x={sub.x - 60} y={sub.y - 25}
                        width={120} height={50}
                        rx={8}
                        fill="hsl(222, 47%, 11%)"
                        stroke={sub.status === "active" ? "hsl(160, 84%, 39%)" : sub.status === "queued" ? "hsl(213, 58%, 45%)" : "hsl(38, 92%, 50%)"}
                        strokeWidth={selected === sub.id ? 2 : 1}
                      />
                      <text x={sub.x} y={sub.y - 8} textAnchor="middle" fill="hsl(222, 47%, 11%)" fontSize={8} fontWeight="500">
                        {sub.name}
                      </text>
                      <text x={sub.x} y={sub.y + 6} textAnchor="middle" fill="hsl(215, 20%, 55%)" fontSize={7}>
                        {sub.status === "active" ? "🟢" : sub.status === "queued" ? "🔵" : "🟡"} {sub.status}
                      </text>
                    </g>
                  ))
                )}

                {/* Spawned node */}
                <AnimatePresence>
                  {spawnedNode && (
                    <motion.g
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, type: "spring" }}
                    >
                      <rect
                        x={spawnedNode.x - 60} y={spawnedNode.y - 25}
                        width={120} height={50}
                        rx={8}
                        fill="hsl(222, 47%, 11%)"
                        stroke="hsl(160, 84%, 39%)"
                        strokeWidth={2}
                      />
                      <text x={spawnedNode.x} y={spawnedNode.y - 8} textAnchor="middle" fill="hsl(210, 40%, 98%)" fontSize={8} fontWeight="500">
                        {spawnedNode.name}
                      </text>
                      <text x={spawnedNode.x} y={spawnedNode.y + 6} textAnchor="middle" fill="hsl(160, 84%, 39%)" fontSize={7}>
                        🟢 {spawnPhase || "active"}
                      </text>
                    </motion.g>
                  )}
                </AnimatePresence>
              </svg>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-4">
              {selectedNode ? (
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <PulseDot color={statusColor(selectedNode.status)} />
                      <h3 className="text-sm font-semibold text-foreground">{selectedNode.name}</h3>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">{selectedNode.status}</Badge>
                  </div>

                  {"task" in selectedNode && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Current Task</p>
                      <p className="text-xs text-foreground">{(selectedNode as SubagentNode).task}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Autonomy Level</p>
                    <Slider
                      value={[autonomy[selectedNode.id] ?? 80]}
                      onValueChange={([v]) => setAutonomy(prev => ({ ...prev, [selectedNode.id]: v }))}
                      max={100}
                      step={1}
                    />
                    <p className="text-xs text-primary mt-1">{autonomyLabel(autonomy[selectedNode.id] ?? 80)}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Recent Decisions</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {decisionLog.map((d, i) => (
                        <div key={i} className="text-xs border-l-2 border-primary/30 pl-2">
                          <p className="text-muted-foreground">{d.time}</p>
                          <p className="text-foreground">{d.decision}</p>
                          <p className="text-muted-foreground/60 italic">{d.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Pause className="w-3 h-3" /> Pause</Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><RotateCcw className="w-3 h-3" /> Restart</Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Click any agent node to view details</p>
                  <ChevronRight className="w-6 h-6 text-muted-foreground/40 mx-auto mt-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "Active Agents", value: "3" },
          { label: "Subagents Running", value: spawnedNode ? "8" : "7" },
          { label: "Actions Today", value: "34" },
          { label: "Value Created", value: "₹12,400" },
          { label: "Pending Approvals", value: "2" },
        ].map(s => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-semibold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
