import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect } from "react";

/**
 * Decorative 3D stickers around the landing hero.
 *
 * Motion design:
 *  - Entry: each sticker is "thrown" in from its side of the screen with a
 *    springy overshoot and a spin, landing at a casual resting tilt —
 *    staggered so they tumble in one after another.
 *  - Idle: every object gets its own signature move (the disco ball slowly
 *    revolves, the joystick waggles, the money see-saws, ...) with unique
 *    timing so nothing ever looks synchronized.
 *  - Parallax: the whole layer subtly tracks the cursor; each sticker has a
 *    different depth, so moving the mouse creates a gentle 3D drift.
 *
 * Purely cosmetic: pointer-events are disabled and the layer hides below lg.
 */

type Sticker = {
  src: string;
  alt: string;
  side: "left" | "right";
  edge: string;
  top: string;
  size: number;
  /** resting tilt in degrees */
  rotate: number;
  /** extra spin applied during the entry throw, degrees */
  spin: number;
  /** entry stagger, seconds */
  delay: number;
  /** parallax depth: px of drift at full cursor deflection */
  depth: number;
  /** idle animation signature */
  idle: "bob" | "sway" | "revolve" | "waggle" | "seesaw" | "pulse";
  /** idle cycle duration, seconds */
  period: number;
};

const stickers: Sticker[] = [
  // ---- left side ----
  { src: "/noise-1.png", alt: "Laptop", side: "left", edge: "2%", top: "10%", size: 200, rotate: -12, spin: -200, delay: 0.1, depth: 26, idle: "sway", period: 7 },
  { src: "/noise-4.png", alt: "Joystick", side: "left", edge: "9%", top: "40%", size: 150, rotate: 9, spin: 160, delay: 0.5, depth: 42, idle: "waggle", period: 5.2 },
  { src: "/noise-7.png", alt: "Gold medal", side: "left", edge: "3%", top: "64%", size: 150, rotate: -8, spin: -240, delay: 0.9, depth: 34, idle: "seesaw", period: 6.4 },
  { src: "/noise-2.png", alt: "Keyboard", side: "left", edge: "10%", top: "84%", size: 170, rotate: 6, spin: 120, delay: 0.34, depth: 20, idle: "bob", period: 8 },

  // ---- right side ----
  { src: "/noise-6.png", alt: "Diamond", side: "right", edge: "3%", top: "9%", size: 170, rotate: 11, spin: 220, delay: 0.26, depth: 38, idle: "pulse", period: 5.6 },
  { src: "/noise-5.png", alt: "Money", side: "right", edge: "10%", top: "38%", size: 180, rotate: -10, spin: -150, delay: 0.66, depth: 24, idle: "seesaw", period: 7.4 },
  { src: "/noise-8.png", alt: "Disco ball", side: "right", edge: "2%", top: "62%", size: 160, rotate: 0, spin: 280, delay: 1.0, depth: 46, idle: "revolve", period: 10 },
  { src: "/noise-3.png", alt: "Mouse", side: "right", edge: "11%", top: "84%", size: 130, rotate: -7, spin: 130, delay: 0.42, depth: 30, idle: "waggle", period: 6 },
];

/** per-signature keyframes for the endless idle loop */
function idleProps(s: Sticker) {
  switch (s.idle) {
    case "bob":
      return { animate: { y: [0, -18, 0] } };
    case "sway":
      return { animate: { y: [0, -12, 0], rotate: [0, 5, 0, -5, 0] } };
    case "revolve":
      // disco ball: full slow turn, forever
      return {
        animate: { rotate: 360 },
        transition: { duration: s.period, repeat: Infinity, ease: "linear" as const },
      };
    case "waggle":
      return { animate: { rotate: [0, -9, 7, -5, 0], y: [0, -8, 0] } };
    case "seesaw":
      return { animate: { rotate: [0, 8, 0, -8, 0] } };
    case "pulse":
      return { animate: { scale: [1, 1.08, 1], y: [0, -10, 0] } };
  }
}

function StickerItem({
  s,
  mx,
  my,
}: {
  s: Sticker;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  // each sticker drifts by its own depth as the cursor moves
  const px = useTransform(mx, (v) => v * s.depth);
  const py = useTransform(my, (v) => v * s.depth * 0.6);

  const offX = s.side === "left" ? "-150%" : "150%";
  const idle = idleProps(s);

  return (
    <motion.div
      className="absolute transform-gpu will-change-transform"
      style={{ top: s.top, [s.side]: s.edge, width: s.size, x: px, y: py }}
    >
      {/* entry: thrown in from the edge with spin + overshoot */}
      <motion.div
        className="transform-gpu will-change-transform"
        initial={{ x: offX, rotate: s.rotate + s.spin, scale: 0.4, opacity: 0 }}
        animate={{ x: 0, rotate: s.rotate, scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 70,
          damping: 11,
          mass: 1.1,
          delay: s.delay,
          opacity: { duration: 0.25, delay: s.delay },
        }}
      >
        {/* idle: per-object signature loop */}
        <motion.img
          src={s.src}
          alt={s.alt}
          width={s.size}
          height={s.size}
          className="h-auto w-full transform-gpu select-none drop-shadow-2xl will-change-transform [backface-visibility:hidden]"
          draggable={false}
          animate={idle.animate}
          transition={
            idle.transition ?? {
              duration: s.period,
              repeat: Infinity,
              ease: "easeInOut",
              delay: s.delay + 1.1,
            }
          }
        />
      </motion.div>
    </motion.div>
  );
}

export default function FloatingElements() {
  // cursor position normalized to [-1, 1], smoothed with springs so the
  // parallax lags pleasantly behind the mouse
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 50, damping: 20 });
  const my = useSpring(rawY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    // Coalesce mousemove to at most one update per animation frame. High-poll
    // mice fire hundreds of events/sec; without this the parallax springs would
    // recompute far more often than 60fps and starve the WebGL fluid cursor.
    let frame = 0;
    let nx = 0;
    let ny = 0;
    const onMove = (e: MouseEvent) => {
      nx = (e.clientX / window.innerWidth) * 2 - 1;
      ny = (e.clientY / window.innerHeight) * 2 - 1;
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          rawX.set(nx);
          rawY.set(ny);
        });
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [rawX, rawY]);

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden lg:block">
      {stickers.map((s) => (
        <StickerItem key={s.src} s={s} mx={mx} my={my} />
      ))}
    </div>
  );
}
