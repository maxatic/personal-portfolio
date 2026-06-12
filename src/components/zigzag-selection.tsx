"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Custom zig-zag text-selection highlight, scoped to elements (or their
 * descendants) carrying `data-zigzag-selection`. Native ::selection is made
 * transparent inside that region (see styles.css); this overlay redraws the
 * selected line boxes as sawtooth "zip-zap" shapes in the portfolio teal.
 *
 * The rest of the site keeps the normal rectangular teal selection.
 */

const TOOTH = 8; // px between zig-zag points
const MAX_AMP = 5; // px peak height

function buildZigzag(r: DOMRect): string {
  const amp = Math.min(MAX_AMP, r.height * 0.12);
  const { left: x0, top: y0, width: w, height: h } = r;
  const pts: string[] = [];

  // top edge, left -> right
  let up = true;
  for (let x = x0; x < x0 + w; x += TOOTH) {
    pts.push(`${x.toFixed(1)},${(up ? y0 - amp : y0).toFixed(1)}`);
    up = !up;
  }
  pts.push(`${(x0 + w).toFixed(1)},${y0.toFixed(1)}`);

  // bottom edge, right -> left
  up = true;
  for (let x = x0 + w; x > x0; x -= TOOTH) {
    pts.push(`${x.toFixed(1)},${(up ? y0 + h + amp : y0 + h).toFixed(1)}`);
    up = !up;
  }
  pts.push(`${x0.toFixed(1)},${(y0 + h).toFixed(1)}`);

  return pts.join(" ");
}

export default function ZigzagSelection() {
  const [rects, setRects] = useState<DOMRect[]>([]);
  const [dark, setDark] = useState(false);

  const update = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      setRects([]);
      return;
    }

    const range = sel.getRangeAt(0);
    const node = range.commonAncestorContainer;
    const el = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
    if (!el || !el.closest("[data-zigzag-selection]")) {
      setRects([]);
      return;
    }

    const list = Array.from(range.getClientRects()).filter(
      (r) => r.width > 1 && r.height > 1,
    );
    setDark(document.documentElement.classList.contains("dark"));
    setRects(list);
  }, []);

  useEffect(() => {
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    document.addEventListener("selectionchange", schedule);
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("selectionchange", schedule);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
    };
  }, [update]);

  if (rects.length === 0) return null;

  const fill = dark ? "rgba(93,202,165,0.45)" : "rgba(29,158,117,0.40)";

  return (
    <svg
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 60,
      }}
    >
      {rects.map((r, i) => (
        <polygon key={i} points={buildZigzag(r)} fill={fill} />
      ))}
    </svg>
  );
}
