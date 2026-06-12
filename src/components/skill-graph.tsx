'use client';

import { motion } from 'framer-motion';
import { Network } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

/**
 * Obsidian-style node graph of hard skills / tools.
 * Big nodes = categories, small nodes = tools. Shared tools (Python, SQL,
 * Miro, A/B Testing) link to several categories.
 *
 * Interaction:
 *  - hover/tap a node → it and its neighbours stay lit, the rest fades out
 *  - grab any node with the mouse/finger and drag it around freely; connected
 *    nodes trail behind elastically, and everything springs back home on release
 *
 * Geometry is driven imperatively by a requestAnimationFrame physics loop
 * (positions written straight to the SVG elements), while React only owns the
 * appearance bits (opacity / fill / radius) so the two never fight.
 */

const categories = [
  {
    id: 'product',
    label: 'Product & Program',
    color: '#2F77B5',
    tools: ['Jira', 'Confluence', 'Notion', 'Asana', 'Miro', 'A/B Testing'],
  },
  {
    id: 'data',
    label: 'Data & Analytics',
    color: '#3E9858',
    tools: ['SQL', 'Python', 'R (dplyr, ggplot2)', 'Excel / Sheets', 'A/B Testing'],
  },
  {
    id: 'ai',
    label: 'AI & LLM',
    color: '#856ED9',
    tools: ['RAG Pipelines', 'Prompt Engineering', 'LLM APIs', 'Cursor', 'Claude Code', 'Python'],
  },
  {
    id: 'design',
    label: 'Design & Research',
    color: '#B95F9D',
    tools: ['Figma', 'Blender', 'Usability Testing', 'Miro'],
  },
  {
    id: 'eng',
    label: 'Engineering',
    color: '#C19433',
    tools: ['Git / GitHub', 'Django', 'C++ / Java', 'Python', 'SQL'],
  },
];

interface GraphNode {
  id: string;
  label: string;
  isHub: boolean;
  color: string;
  degree: number;
}

interface SimNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface PhysNode extends SimNode {
  hx: number; // home position
  hy: number;
  tx: number; // drag target
  ty: number;
  phase: number;
  ampX: number;
  ampY: number;
  spdX: number;
  spdY: number;
}

function buildGraph() {
  const nodes: GraphNode[] = [];
  const edges: Array<[string, string]> = [];
  const toolIndex = new Map<string, GraphNode>();

  for (const cat of categories) {
    nodes.push({ id: cat.id, label: cat.label, isHub: true, color: cat.color, degree: 0 });
  }
  for (const cat of categories) {
    for (const tool of cat.tools) {
      let node = toolIndex.get(tool);
      if (!node) {
        node = { id: `tool:${tool}`, label: tool, isHub: false, color: cat.color, degree: 0 };
        toolIndex.set(tool, node);
        nodes.push(node);
      }
      node.degree += 1;
      edges.push([cat.id, node.id]);
    }
  }
  return { nodes, edges };
}

// Deterministic pseudo-random so the layout is stable across renders.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function runSimulation(width: number, height: number): { nodes: SimNode[]; edges: Array<[string, string]> } {
  const { nodes: rawNodes, edges } = buildGraph();
  const rand = mulberry32(42);
  const cx = width / 2;
  const cy = height / 2;
  const portrait = height > width;
  const scale = Math.min(width, height) / 520;

  const hubR = Math.max(20, 26 * Math.max(scale, 0.85));
  const toolR = 6.5;
  const springLen = portrait ? 78 : 95;

  const hubs = rawNodes.filter((n) => n.isHub);
  const sim: SimNode[] = rawNodes.map((n) => ({ ...n, x: cx, y: cy, vx: 0, vy: 0, r: n.isHub ? hubR : toolR + (n.degree > 1 ? 2 : 0) }));
  const byId = new Map(sim.map((n) => [n.id, n]));

  // Initial placement: hubs on an ellipse, tools jittered around their hub.
  hubs.forEach((hub, i) => {
    const angle = (i / hubs.length) * Math.PI * 2 - Math.PI / 2;
    const n = byId.get(hub.id)!;
    n.x = cx + Math.cos(angle) * width * 0.27;
    n.y = cy + Math.sin(angle) * height * 0.27;
  });
  for (const [hubId, toolId] of edges) {
    const hub = byId.get(hubId)!;
    const tool = byId.get(toolId)!;
    if (tool.x === cx && tool.y === cy) {
      const a = rand() * Math.PI * 2;
      tool.x = hub.x + Math.cos(a) * springLen * (0.7 + rand() * 0.5);
      tool.y = hub.y + Math.sin(a) * springLen * (0.7 + rand() * 0.5);
    }
  }

  const pad = 58;
  const repulse = (portrait ? 14000 : 23000) * scale;
  for (let tick = 0; tick < 420; tick++) {
    // pairwise repulsion
    for (let i = 0; i < sim.length; i++) {
      for (let j = i + 1; j < sim.length; j++) {
        const a = sim[i];
        const b = sim[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let d2 = dx * dx + dy * dy;
        if (d2 < 1) {
          dx = rand() - 0.5;
          dy = rand() - 0.5;
          d2 = 1;
        }
        const d = Math.sqrt(d2);
        let f = repulse / d2;
        if (a.isHub && b.isHub) f *= 5; // keep categories well apart
        f = Math.min(f, 14);
        const fx = (dx / d) * f;
        const fy = (dy / d) * f;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }
    }
    // edge springs
    for (const [s, t] of edges) {
      const a = byId.get(s)!;
      const b = byId.get(t)!;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      const f = (d - springLen) * 0.05;
      const fx = (dx / d) * f;
      const fy = (dy / d) * f;
      a.vx += fx;
      a.vy += fy;
      b.vx -= fx;
      b.vy -= fy;
    }
    // gravity toward center
    for (const n of sim) {
      n.vx += (cx - n.x) * 0.012;
      n.vy += (cy - n.y) * 0.012;
      n.vx *= 0.8;
      n.vy *= 0.8;
      n.x = Math.min(Math.max(n.x + n.vx, pad), width - pad);
      n.y = Math.min(Math.max(n.y + n.vy, pad), height - pad);
    }
  }

  return { nodes: sim, edges };
}

interface NodeEls {
  glow: SVGCircleElement | null;
  dot: SVGCircleElement | null;
  text: SVGTextElement | null;
}

export function SkillGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isNarrow, setIsNarrow] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 800;
      setIsNarrow(w < 480);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const width = isNarrow ? 430 : 760;
  const height = isNarrow ? 620 : 520;

  const { nodes: simNodes, edges } = useMemo(() => runSimulation(width, height), [width, height]);

  const neighbours = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const n of simNodes) map.set(n.id, new Set([n.id]));
    for (const [s, t] of edges) {
      map.get(s)!.add(t);
      map.get(t)!.add(s);
    }
    return map;
  }, [simNodes, edges]);

  // --- physics state (refs so the RAF loop owns geometry, not React) ---
  const physRef = useRef<PhysNode[]>([]);
  const nodeElsRef = useRef<Map<string, NodeEls>>(new Map());
  const edgeElsRef = useRef<Array<SVGLineElement | null>>([]);
  const dragRef = useRef<{ id: string | null; dx: number; dy: number }>({ id: null, dx: 0, dy: 0 });

  // (re)build physics whenever the layout changes
  useMemo(() => {
    const rand = mulberry32(7);
    physRef.current = simNodes.map((n, i) => ({
      ...n,
      hx: n.x,
      hy: n.y,
      tx: n.x,
      ty: n.y,
      phase: rand() * Math.PI * 2,
      ampX: n.isHub ? 1.8 : 3.6 + rand() * 1.4,
      ampY: n.isHub ? 1.8 : 3.6 + rand() * 1.4,
      spdX: 0.0004 + rand() * 0.0003,
      spdY: 0.0004 + rand() * 0.0003,
      // start a touch offset so the settle-in reads as motion
      x: n.x + (rand() - 0.5) * 10,
      y: n.y + (rand() - 0.5) * 10,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simNodes]);

  // write initial positions synchronously to avoid a 1-frame flash at (0,0)
  useLayoutEffect(() => {
    writePositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simNodes]);

  function writePositions() {
    const phys = physRef.current;
    const byId = new Map(phys.map((n) => [n.id, n]));
    for (const n of phys) {
      const els = nodeElsRef.current.get(n.id);
      if (!els) continue;
      const xs = n.x.toFixed(2);
      const ys = n.y.toFixed(2);
      els.dot?.setAttribute('cx', xs);
      els.dot?.setAttribute('cy', ys);
      els.glow?.setAttribute('cx', xs);
      els.glow?.setAttribute('cy', ys);
      if (els.text) {
        els.text.setAttribute('x', xs);
        els.text.setAttribute('y', (n.y + n.r + (n.isHub ? 18 : 15)).toFixed(2));
      }
    }
    edges.forEach(([s, t], i) => {
      const a = byId.get(s);
      const b = byId.get(t);
      const line = edgeElsRef.current[i];
      if (line && a && b) {
        line.setAttribute('x1', a.x.toFixed(2));
        line.setAttribute('y1', a.y.toFixed(2));
        line.setAttribute('x2', b.x.toFixed(2));
        line.setAttribute('y2', b.y.toFixed(2));
      }
    });
  }

  // continuous physics loop
  useEffect(() => {
    let raf = 0;
    const loop = (t: number) => {
      const phys = physRef.current;
      const byId = new Map(phys.map((n) => [n.id, n]));
      const dragId = dragRef.current.id;
      const dragNode = dragId ? byId.get(dragId) : null;
      const linked = dragId ? neighbours.get(dragId) : null;

      for (const n of phys) {
        if (n.id === dragId) {
          // follow the cursor with a hair of smoothing → "move freely"
          n.x += (n.tx - n.x) * 0.6;
          n.y += (n.ty - n.y) * 0.6;
          n.vx = 0;
          n.vy = 0;
          continue;
        }

        // gentle idle drift around home → always feels alive
        let targetX = n.hx + Math.sin(t * n.spdX + n.phase) * n.ampX;
        let targetY = n.hy + Math.cos(t * n.spdY + n.phase * 1.3) * n.ampY;

        // neighbours of the dragged node trail toward it elastically
        if (dragNode && linked?.has(n.id)) {
          targetX = targetX * 0.68 + dragNode.x * 0.32;
          targetY = targetY * 0.68 + dragNode.y * 0.32;
        }

        const ax = (targetX - n.x) * 0.055;
        const ay = (targetY - n.y) * 0.055;
        n.vx = (n.vx + ax) * 0.88;
        n.vy = (n.vy + ay) * 0.88;
        n.x += n.vx;
        n.y += n.vy;
      }

      writePositions();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simNodes, edges, neighbours]);

  // --- pointer / drag handling ---
  const toSvg = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: clientX, y: clientY };
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: clientX, y: clientY };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  };

  const onNodePointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    const svg = svgRef.current;
    if (svg) {
      try {
        svg.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    const p = toSvg(e.clientX, e.clientY);
    const n = physRef.current.find((x) => x.id === id);
    dragRef.current = { id, dx: n ? n.x - p.x : 0, dy: n ? n.y - p.y : 0 };
    if (n) {
      n.tx = p.x + dragRef.current.dx;
      n.ty = p.y + dragRef.current.dy;
    }
    setActiveId(id);
    setDraggingId(id);
  };

  const onSvgPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.id) return;
    const p = toSvg(e.clientX, e.clientY);
    const n = physRef.current.find((x) => x.id === d.id);
    if (n) {
      n.tx = p.x + d.dx;
      n.ty = p.y + d.dy;
    }
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!dragRef.current.id) return;
    const svg = svgRef.current;
    if (svg) {
      try {
        svg.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    dragRef.current = { id: null, dx: 0, dy: 0 };
    setDraggingId(null);
    // keep activeId so it stays highlighted until the pointer leaves
  };

  const isLit = (id: string) => !activeId || neighbours.get(activeId)?.has(id);
  const edgeLit = (s: string, t: string) => !activeId || s === activeId || t === activeId;

  const hubFont = isNarrow ? 13 : 13.5;
  const toolFont = 11;

  return (
    <div className="mx-auto w-full max-w-5xl py-6 font-sans">
      {/* Header */}
      <div className="mb-2 flex items-center gap-3">
        <div className="bg-accent flex h-10 w-10 items-center justify-center rounded-full">
          <Network className="text-foreground h-5 w-5" />
        </div>
        <div>
          <h2 className="text-foreground text-xl font-semibold md:text-2xl">Skills</h2>
          <p className="text-muted-foreground text-sm">
            My toolbox as a graph — hover to explore, or drag a node around
          </p>
        </div>
      </div>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full"
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full touch-none select-none"
          style={{ cursor: draggingId ? 'grabbing' : 'default' }}
          onPointerMove={onSvgPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={(e) => {
            endDrag(e);
            setActiveId(null);
          }}
        >
          {/* click empty space to clear the selection (mobile) */}
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="transparent"
            onPointerDown={() => setActiveId(null)}
          />

          {/* Edges */}
          {edges.map(([s, t], i) => {
            const a = simNodes.find((n) => n.id === s)!;
            const lit = edgeLit(s, t);
            return (
              <line
                key={`${s}-${t}-${i}`}
                ref={(el) => {
                  edgeElsRef.current[i] = el;
                }}
                stroke={lit && activeId ? a.color : 'var(--muted-foreground)'}
                strokeWidth={lit && activeId ? 1.6 : 1}
                opacity={lit ? (activeId ? 0.55 : 0.22) : 0.06}
                style={{ transition: 'opacity 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease' }}
              />
            );
          })}

          {/* Nodes */}
          {simNodes.map((n) => {
            const lit = isLit(n.id);
            const isActive = activeId === n.id;
            const isDragging = draggingId === n.id;
            const els: NodeEls = nodeElsRef.current.get(n.id) ?? { glow: null, dot: null, text: null };
            nodeElsRef.current.set(n.id, els);
            return (
              <g
                key={n.id}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                onPointerDown={(e) => onNodePointerDown(e, n.id)}
                onPointerEnter={() => {
                  if (!dragRef.current.id) setActiveId(n.id);
                }}
              >
                {n.isHub && (
                  <circle
                    ref={(el) => {
                      els.glow = el;
                    }}
                    r={n.r + 6}
                    fill={n.color}
                    opacity={lit ? (isActive ? 0.25 : 0.14) : 0.04}
                    style={{ transition: 'opacity 0.3s ease' }}
                  />
                )}
                <circle
                  ref={(el) => {
                    els.dot = el;
                  }}
                  r={isActive || isDragging ? n.r * 1.12 : n.r}
                  fill={lit ? n.color : 'var(--muted-foreground)'}
                  opacity={lit ? (n.isHub ? 0.95 : 0.85) : 0.15}
                  style={{ transition: 'opacity 0.3s ease, fill 0.3s ease, r 0.2s ease' }}
                />
                <text
                  ref={(el) => {
                    els.text = el;
                  }}
                  textAnchor="middle"
                  fontSize={n.isHub ? hubFont : toolFont}
                  fontWeight={n.isHub ? 600 : 400}
                  fill={lit ? (n.isHub || isActive ? 'var(--foreground)' : 'var(--muted-foreground)') : 'var(--muted-foreground)'}
                  opacity={lit ? 1 : 0.18}
                  style={{ transition: 'opacity 0.3s ease, fill 0.3s ease', pointerEvents: 'none' }}
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </motion.div>
    </div>
  );
}

export default SkillGraph;
