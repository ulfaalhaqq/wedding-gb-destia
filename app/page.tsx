"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
  Calendar,
  MapPin,
  Music,
  VolumeX,
  MailOpen,
  Mail,
  Home,
  Users,
  Images,
  Gamepad2,
  CalendarPlus,
  Navigation,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Heart,
} from "lucide-react";

/* Foto diambil dari folder app/image (format JPG terkompresi).
   Isi folder: cover.jpg, groom.jpg, bride.jpg, thanks.jpg, galeri-1.jpg ... galeri-6.jpg */
import coverImg from "./image/cover.jpg";
import groomImg from "./image/groom.jpg";
import brideImg from "./image/bride.jpg";
import thanksImg from "./image/thanks.jpg";
import galeri1 from "./image/galeri-1.jpg";
import galeri2 from "./image/galeri-2.jpg";
import galeri3 from "./image/galeri-3.jpg";
import galeri4 from "./image/galeri-4.jpg";
import galeri5 from "./image/galeri-5.jpg";
import galeri6 from "./image/galeri-6.jpg";

/* ============================================================
   KONFIGURASI — ganti data & foto di sini saja
   ============================================================ */
const COUPLE = {
  short: "GB & Destia",
  groom: {
    name: "Bintang Aji Gavriel",
    short: "Bintang Aji G.",
    parents: "Putra dari Bpk. Joko Santoso & Ibu Winartunik",
  },
  bride: {
    name: "Destia Fitri Anggraini",
    short: "Destia Fitri A.",
    parents: "Putri dari Bpk. Warseto & Ibu Eni Lestari",
  },
  dateText: "21 . 11 . 2026",
};

/* Watermark pembuat web */
const BRAND = "@ulfa.dev";
const IG_URL = "https://www.instagram.com/ulfa.dev/";
const LINKEDIN_URL = "https://www.linkedin.com/in/ulfaalhaq/";

const PHOTOS = {
  cover: coverImg.src,
  groom: groomImg.src,
  bride: brideImg.src,
  thanks: thanksImg.src,
  gallery: [galeri1, galeri2, galeri3, galeri4, galeri5, galeri6].map(
    (g) => g.src,
  ),
};

/* Lokasi pernikahan */
const MAP_QUERY = "-7.850189,112.135450";
const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=18&output=embed`;
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;

const TARGET = new Date("2026-11-21T08:00:00+07:00").getTime();
const CALENDAR_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" +
  encodeURIComponent("Pernikahan GB & Destia") +
  "&dates=20261121T010000Z/20261121T050000Z&details=" +
  encodeURIComponent("Akad 08.00 WIB, Resepsi jam Relax") +
  "&location=" +
  encodeURIComponent("Kediaman Mempelai Wanita, Plosoklaten, Kediri");

const IMG = {
  gunungan: "/jawa/gunungan.png",
  cloud: "/jawa/megamendung.png",
  border: "/jawa/border-megamendung.png",
};

const CURTAIN_BG =
  "repeating-linear-gradient(90deg,#2a0007 0px,#5c0a1f 14px,#8a1a33 26px,#5c0a1f 38px,#2a0007 52px)";
const CURTAIN_FRINGE =
  "repeating-linear-gradient(90deg,#f6e3a8 0 3px,#b8893a 3px 7px)";

const TOP_BTN =
  "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#d8b46a] bg-[#6a0119] text-[#f6dede] shadow-xl transition active:scale-90 sm:h-11 sm:w-11";

const script = { fontFamily: "'Great Vibes', cursive" } as const;
const jv = { fontFamily: "'Noto Sans Javanese', serif" } as const;
const display = { fontFamily: "'Cormorant Garamond', serif" } as const;

const NAV = [
  { id: "home", icon: Home, label: "Beranda" },
  { id: "mempelai", icon: Users, label: "Mempelai" },
  { id: "acara", icon: Calendar, label: "Acara & Lokasi" },
  { id: "galeri", icon: Images, label: "Galeri" },
  { id: "game", icon: Gamepad2, label: "Game" },
];

type From = "up" | "left" | "right" | "zoom";
const OFFSETS: Record<From, object> = {
  up: { y: 40 },
  left: { x: -60 },
  right: { x: 60 },
  zoom: { scale: 0.85 },
};

/* REVISI: margin -120px -> -40px dan durasi 1.9s -> 1.3s
   supaya konten di layar HP tidak lama kosong / tidak terlewat. */
function Reveal({
  children,
  className = "",
  delay = 0,
  from = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: From;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, ...OFFSETS[from] }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.3, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Cloud({
  className = "",
  tone = "pink",
}: {
  className?: string;
  tone?: "pink" | "maroon";
}) {
  const seed = className.length % 5;
  return (
    <motion.img
      src={IMG.cloud}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      className={`pointer-events-none absolute select-none ${tone === "maroon" ? "opacity-90" : "opacity-75"} ${className}`}
      animate={{
        x: [0, 18, 0, -14, 0],
        y: [0, -8, 0, 7, 0],
        rotate: [0, 1.5, 0, -1.5, 0],
      }}
      transition={{
        duration: 12 + seed * 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function Gunungan({ className = "" }: { className?: string }) {
  return (
    <motion.img
      src={IMG.gunungan}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      className={`pointer-events-none select-none ${className}`}
      style={{ transformOrigin: "50% 100%" }}
      animate={{
        rotate: [-2.5, 2.5, -2.5],
        scale: [1, 1.035, 1],
        filter: [
          "drop-shadow(0 0 0px rgba(216,180,106,0))",
          "drop-shadow(0 0 14px rgba(216,180,106,.65))",
          "drop-shadow(0 0 0px rgba(216,180,106,0))",
        ],
      }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function CloudBorder({ className = "" }: { className?: string }) {
  return (
    <motion.img
      src={IMG.border}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      className={`pointer-events-none absolute inset-x-0 w-full select-none ${className}`}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function Sparkles({
  count = 14,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => {
        const size = 3 + (i % 3) * 2;
        return (
          <motion.span
            key={i}
            className="absolute bottom-0 rounded-full bg-[#d8b46a]"
            style={{
              left: `${(i * 37 + 11) % 100}%`,
              width: size,
              height: size,
              boxShadow: "0 0 8px 2px rgba(216,180,106,.7)",
            }}
            animate={{
              y: [0, -520],
              x: [0, i % 2 ? 22 : -22, 0],
              opacity: [0, 1, 0.8, 0],
            }}
            transition={{
              duration: 8 + (i % 5) * 1.7,
              delay: (i * 0.9) % 7,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}

function OvalPhoto({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative mx-auto aspect-[3/4] ${className}`}>
      <motion.div
        className="absolute -inset-2 rounded-[999px] border border-[#d8b46a]"
        animate={{ opacity: [0.25, 0.9, 0.25], scale: [1, 1.03, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 overflow-hidden rounded-[999px] border-[3px] border-white/90 shadow-xl ring-1 ring-black/10">
        <motion.img
          src={src}
          alt={alt}
          decoding="async"
          className="h-full w-full object-cover"
          animate={{ scale: [1, 1.09, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

function Flip({ value }: { value: number }) {
  return (
    <span className="relative block h-8 overflow-hidden sm:h-9">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="block text-2xl font-medium leading-8 sm:text-3xl sm:leading-9"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function IgIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function CornerOrnament({ className = "" }: { className?: string }) {
  const g = "#d8b46a";
  return (
    <motion.svg
      viewBox="0 0 84 84"
      fill="none"
      stroke={g}
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden
      className={`pointer-events-none absolute select-none ${className}`}
      animate={{
        opacity: [0.8, 1, 0.8],
        filter: [
          "drop-shadow(0 0 0px rgba(216,180,106,0))",
          "drop-shadow(0 0 5px rgba(216,180,106,.85))",
          "drop-shadow(0 0 0px rgba(216,180,106,0))",
        ],
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="M10 10 C28 4 48 8 58 22 C62 29 57 35 51 32" />
      <path d="M10 10 C24 18 34 32 32 48 C31 56 23 58 20 52" />
      <path d="M10 10 C22 10 36 18 41 30 C43 36 39 41 34 39" />
      <path d="M10 10 C16 4 26 2 34 4" />
      <path d="M10 10 C4 16 2 26 4 34" />
      <g fill={g} stroke="none">
        <circle cx="10" cy="10" r="3.6" />
        <circle cx="51" cy="32" r="2.6" />
        <circle cx="20" cy="52" r="2.6" />
        <circle cx="34" cy="39" r="2.2" />
        <circle cx="37" cy="4" r="2" />
        <circle cx="4" cy="37" r="2" />
        <circle cx="66" cy="14" r="2" />
        <circle cx="14" cy="66" r="2" />
      </g>
    </motion.svg>
  );
}

function Sheen() {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-white/40"
      initial={{ left: "-40%" }}
      animate={{ left: ["-40%", "140%"] }}
      transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2 }}
    />
  );
}

function EventBlock({
  title,
  dayName,
  month,
  day,
  time,
}: {
  title: string;
  dayName: string;
  month: string;
  day: string;
  time: string;
}) {
  return (
    <Reveal>
      <h3 style={display} className="text-4xl font-medium tracking-wide">
        {title}
      </h3>
      <p className="mt-4 text-lg font-medium uppercase tracking-widest">
        {month}
      </p>
      <div className="mx-auto mt-1 flex max-w-xs items-center justify-center gap-3">
        <div className="flex-1 border-y border-[#f6dede]/70 py-1 text-xs font-light uppercase tracking-wider">
          {dayName}
        </div>
        <motion.span
          initial={{ scale: 0.4, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 70,
            damping: 12,
            delay: 0.6,
          }}
          className="text-6xl font-semibold leading-none text-[#d8b46a]"
        >
          {day}
        </motion.span>
        <div className="flex-1 border-y border-[#f6dede]/70 py-1 text-xs font-light tracking-wider">
          2026
        </div>
      </div>
      <p className="mt-4 text-sm">{time}</p>
    </Reveal>
  );
}

function HeartBurst({
  burstKey,
  className = "",
}: {
  burstKey: number;
  className?: string;
}) {
  if (!burstKey) return null;
  return (
    <div
      key={burstKey}
      className={`pointer-events-none absolute z-20 ${className}`}
      aria-hidden
    >
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{
            left: 0,
            top: 0,
            color:
              i % 3 === 0 ? "#d8b46a" : i % 3 === 1 ? "#ff8fa3" : "#f6dede",
          }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0.4 }}
          animate={{
            opacity: [1, 1, 0],
            x: ((i % 8) - 3.5) * 22,
            y: -(70 + (i % 5) * 28),
            scale: 0.9 + (i % 3) * 0.3,
            rotate: (i % 2 ? 1 : -1) * (10 + i * 3),
          }}
          transition={{ duration: 1.7, delay: i * 0.04, ease: "easeOut" }}
        >
          <Heart className="h-5 w-5" fill="currentColor" strokeWidth={0} />
        </motion.span>
      ))}
    </div>
  );
}

const MAZE_N = 7;
type MazeDir = "up" | "down" | "left" | "right";
type MazeCell = { t: boolean; r: boolean; b: boolean; l: boolean };

function generateMaze(n: number): MazeCell[] {
  const cells: MazeCell[] = Array.from({ length: n * n }, () => ({
    t: true,
    r: true,
    b: true,
    l: true,
  }));
  const visited: boolean[] = new Array(n * n).fill(false);
  const stack: number[] = [0];
  visited[0] = true;
  while (stack.length) {
    const cur = stack[stack.length - 1];
    const r = Math.floor(cur / n);
    const c = cur % n;
    const opts: [number, "t" | "r" | "b" | "l", "t" | "r" | "b" | "l"][] = [];
    if (r > 0 && !visited[cur - n]) opts.push([cur - n, "t", "b"]);
    if (c < n - 1 && !visited[cur + 1]) opts.push([cur + 1, "r", "l"]);
    if (r < n - 1 && !visited[cur + n]) opts.push([cur + n, "b", "t"]);
    if (c > 0 && !visited[cur - 1]) opts.push([cur - 1, "l", "r"]);
    if (!opts.length) {
      stack.pop();
      continue;
    }
    const [next, w1, w2] = opts[Math.floor(Math.random() * opts.length)];
    cells[cur][w1] = false;
    cells[next][w2] = false;
    visited[next] = true;
    stack.push(next);
  }
  return cells;
}

let sfxCtx: AudioContext | null = null;

function tone(
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = "sine",
  vol = 0.08,
  attack = 0,
) {
  if (!sfxCtx) return;
  const t0 = sfxCtx.currentTime + start;
  const osc = sfxCtx.createOscillator();
  const gain = sfxCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  const peak = Math.min(vol * 4, 0.6);
  if (attack > 0) {
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(peak, t0 + attack);
  } else {
    gain.gain.setValueAtTime(peak, t0);
  }
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(sfxCtx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function gameFx(kind: "step" | "bump" | "win" | "click" | "open") {
  try {
    if (!sfxCtx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      sfxCtx = new AC();
    }
    if (sfxCtx.state === "suspended") sfxCtx.resume();

    if (kind === "open") {
    } else if (kind === "click") {
      tone(784, 0, 0.35, "sine", 0.035, 0.012);
      tone(1175, 0.03, 0.3, "sine", 0.015, 0.012);
    } else if (kind === "step") {
      const notes = [659, 740, 831, 880, 988];
      const f = notes[Math.floor(Math.random() * notes.length)];
      tone(f, 0, 0.4, "sine", 0.03, 0.01);
    } else if (kind === "bump") {
      tone(196, 0, 0.22, "sine", 0.06, 0.008);
      tone(147, 0.01, 0.25, "sine", 0.04, 0.008);
    } else {
      [523, 659, 784, 1047, 1319].forEach((f, i) => {
        tone(f, i * 0.14, 1.2, "sine", 0.045, 0.02);
        tone(f * 2, i * 0.14, 0.6, "sine", 0.012, 0.02);
      });
    }
  } catch {}
  try {
    if ("vibrate" in navigator) {
      if (kind === "open") navigator.vibrate([40, 50, 90]);
      else if (kind === "click") navigator.vibrate(15);
      else if (kind === "step") navigator.vibrate(15);
      else if (kind === "bump") navigator.vibrate([30, 25, 30]);
      else navigator.vibrate([70, 40, 70, 40, 160]);
    }
  } catch {}
}

function MazeGame() {
  const [cells, setCells] = useState<MazeCell[]>([]);
  const [pos, setPos] = useState(0);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [burst, setBurst] = useState(0);
  const posRef = useRef(0);
  const anchor = useRef<{ x: number; y: number } | null>(null);

  const GOAL = MAZE_N * MAZE_N - 1;

  useEffect(() => {
    setCells(generateMaze(MAZE_N));
  }, []);

  const move = (dir: MazeDir) => {
    if (won || !cells.length) return;
    const p = posRef.current;
    const cell = cells[p];
    const row = Math.floor(p / MAZE_N);
    const col = p % MAZE_N;
    let np = p;
    if (dir === "up" && !cell.t && row > 0) np = p - MAZE_N;
    if (dir === "down" && !cell.b && row < MAZE_N - 1) np = p + MAZE_N;
    if (dir === "left" && !cell.l && col > 0) np = p - 1;
    if (dir === "right" && !cell.r && col < MAZE_N - 1) np = p + 1;
    if (np === p) {
      gameFx("bump");
      return;
    }
    posRef.current = np;
    setPos(np);
    setMoves((m) => m + 1);
    if (np !== GOAL) gameFx("step");
    if (np === GOAL) {
      gameFx("win");
      setWon(true);
      setTimeout(() => setBurst((b) => b + 1), 700);
    }
  };

  const reset = () => {
    setCells(generateMaze(MAZE_N));
    posRef.current = 0;
    setPos(0);
    setMoves(0);
    setWon(false);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    anchor.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const a = anchor.current;
    if (!a) return;
    const dx = e.clientX - a.x;
    const dy = e.clientY - a.y;
    const step = (e.currentTarget.getBoundingClientRect().width / MAZE_N) * 0.7;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < step) return;
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? "right" : "left");
    else move(dy > 0 ? "down" : "up");
    anchor.current = { x: e.clientX, y: e.clientY };
  };
  const endDrag = () => {
    anchor.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, MazeDir> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
    };
    const d = map[e.key];
    if (d) {
      e.preventDefault();
      move(d);
    }
  };

  const row = Math.floor(pos / MAZE_N);
  const col = pos % MAZE_N;
  const cellPct = 100 / MAZE_N;
  const wall = "2px solid #d8b46a";

  const padBtn =
    "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#d8b46a] text-[#3a0009] shadow-md transition active:scale-90";

  return (
    <div>
      <div
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative mx-auto mt-5 aspect-square w-full max-w-[300px] touch-none select-none rounded-lg bg-[#6a0119]/60 outline-none focus-visible:ring-2 focus-visible:ring-[#d8b46a]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        aria-label="Labirin: antar mempelai pria ke mempelai wanita"
      >
        <div
          className="absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${MAZE_N}, 1fr)` }}
        >
          {cells.map((c, i) => {
            const r = Math.floor(i / MAZE_N);
            const cc = i % MAZE_N;
            return (
              <div
                key={i}
                style={{
                  borderTop: c.t ? wall : "none",
                  borderLeft: c.l ? wall : "none",
                  borderRight: cc === MAZE_N - 1 && c.r ? wall : "none",
                  borderBottom: r === MAZE_N - 1 && c.b ? wall : "none",
                  boxSizing: "border-box",
                }}
              />
            );
          })}
        </div>

        <motion.div
          animate={{ opacity: won ? 0 : 1 }}
          transition={{ delay: won ? 0.5 : 0, duration: 0.3 }}
          className="pointer-events-none absolute flex items-center justify-center"
          style={{
            width: `${cellPct}%`,
            height: `${cellPct}%`,
            left: `${(GOAL % MAZE_N) * cellPct}%`,
            top: `${Math.floor(GOAL / MAZE_N) * cellPct}%`,
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="relative h-[84%] w-[84%]"
          >
            <img
              src={PHOTOS.bride}
              alt="Mempelai wanita"
              className="h-full w-full rounded-full object-cover object-top shadow-[0_0_10px_2px_rgba(255,143,163,.7)] ring-2 ring-[#ff8fa3]"
            />
            <Heart
              className="absolute -right-1 -top-1 h-3.5 w-3.5 text-[#ff8fa3]"
              fill="currentColor"
              strokeWidth={0}
            />
          </motion.div>
        </motion.div>

        {cells.length > 0 && (
          <motion.div
            initial={false}
            animate={{
              left: `${col * cellPct}%`,
              top: `${row * cellPct}%`,
              opacity: won ? 0 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 34,
              opacity: { delay: won ? 0.5 : 0, duration: 0.3 },
            }}
            className="pointer-events-none absolute"
            style={{ width: `${cellPct}%`, height: `${cellPct}%` }}
          >
            <img
              src={PHOTOS.groom}
              alt="Mempelai pria"
              className="absolute inset-[8%] h-[84%] w-[84%] rounded-full object-cover object-top shadow-[0_0_10px_2px_rgba(216,180,106,.8)] ring-2 ring-[#d8b46a]"
            />
          </motion.div>
        )}

        {won && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-[#3a0009]/75">
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.6,
                type: "spring",
                stiffness: 120,
                damping: 14,
              }}
              className="aspect-[3/4] h-[88%] overflow-hidden rounded-[999px] border-[3px] border-[#d8b46a] shadow-[0_0_22px_4px_rgba(216,180,106,.6)]"
            >
              <img
                src={PHOTOS.cover}
                alt="Foto berdua"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        )}

        <div className="absolute left-1/2 top-1/2 z-20">
          <HeartBurst burstKey={burst} />
        </div>
      </div>

      <div data-nosfx className="mx-auto mt-4 grid w-fit grid-cols-3 gap-1.5">
        <span />
        <button
          type="button"
          onClick={() => move("up")}
          aria-label="Naik"
          className={padBtn}
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <span />
        <button
          type="button"
          onClick={() => move("left")}
          aria-label="Kiri"
          className={padBtn}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => move("down")}
          aria-label="Turun"
          className={padBtn}
        >
          <ChevronDown className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => move("right")}
          aria-label="Kanan"
          className={padBtn}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 min-h-[3.25rem]">
        {won ? (
          <p style={display} className="text-xl font-medium">
            Yeay! Mempelai bertemu dalam {moves} langkah
          </p>
        ) : (
          <p className="text-[11px] font-light opacity-80">
            Geser di dalam labirin (atau tekan panah) untuk mengantar mempelai
            pria ke mempelai wanita. Langkah: {moves}
          </p>
        )}
        <motion.button
          type="button"
          onClick={reset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative mt-3 inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-[#d8b46a] px-6 py-2.5 text-[11px] font-medium uppercase tracking-wider text-[#3a0009] [-webkit-text-stroke:0.35px_currentColor]"
        >
          {won ? "Main lagi" : "Acak labirin baru"}
          <Sheen />
        </motion.button>
      </div>
    </div>
  );
}

/* ============================================================
   HALAMAN UTAMA
   ============================================================ */
export default function WeddingInvitation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [active, setActive] = useState("home");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { scrollYProgress } = useScroll();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest("button, a");
      if (!el || el.closest("[data-nosfx]")) return;
      gameFx("click");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    const tick = () => {
      const diff = TARGET - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff / 3600000) % 24),
          minutes: Math.floor((diff / 60000) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.2;
    if (isPlaying) a.play().catch(() => setIsPlaying(false));
    else a.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (!isOpen) return;
    const onScroll = () => {
      const mid = window.innerHeight * 0.5;
      let cur = NAV[0].id;
      NAV.forEach((n) => {
        const el = document.getElementById(n.id);
        if (el && el.getBoundingClientRect().top <= mid) cur = n.id;
      });
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isOpen]);

  const backToCover = () => {
    window.scrollTo({ top: 0 });
    setIsPlaying(false);
    setActive("home");
    setIsOpen(false);
  };

  const goTo = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#3a0009] font-['Poppins',sans-serif] text-[#6a0119] lg:bg-[radial-gradient(ellipse_at_center,#8a1a33_0%,#6a0119_45%,#3a0009_100%)] lg:bg-fixed">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Great+Vibes&family=Noto+Sans+Javanese:wght@400;600&family=Poppins:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <audio ref={audioRef} src="/wedding-song.mp3" loop preload="auto" />

      {/* ================= COVER ================= */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="cover"
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: 1,
                transition: { duration: 1.6, ease: [0.65, 0, 0.35, 1] },
              }}
              exit={{
                scaleX: 0,
                transition: {
                  duration: 3.2,
                  delay: 0.7,
                  ease: [0.65, 0, 0.35, 1],
                },
              }}
              style={{
                transformOrigin: "0% 50%",
                backgroundImage: CURTAIN_BG,
              }}
              className="absolute inset-y-0 left-0 w-1/2"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/35 to-transparent" />
              <div
                className="absolute inset-x-0 bottom-0 h-5"
                style={{ backgroundImage: CURTAIN_FRINGE }}
              />
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: 1,
                transition: { duration: 1.6, ease: [0.65, 0, 0.35, 1] },
              }}
              exit={{
                scaleX: 0,
                transition: {
                  duration: 3.2,
                  delay: 0.7,
                  ease: [0.65, 0, 0.35, 1],
                },
              }}
              style={{
                transformOrigin: "100% 50%",
                backgroundImage: CURTAIN_BG,
              }}
              className="absolute inset-y-0 right-0 w-1/2"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/35 to-transparent" />
              <div
                className="absolute inset-x-0 bottom-0 h-5"
                style={{ backgroundImage: CURTAIN_FRINGE }}
              />
            </motion.div>

            <motion.div
              initial={{ y: "-110%" }}
              animate={{
                y: 0,
                transition: { duration: 1.2, ease: "easeOut" },
              }}
              exit={{
                y: "-110%",
                transition: { duration: 1.6, delay: 0.7, ease: "easeInOut" },
              }}
              className="absolute inset-x-0 top-0"
            >
              <div
                className="h-7 border-b-2 border-[#d8b46a]"
                style={{ backgroundImage: CURTAIN_BG }}
              />
              <div
                className="h-4"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 50% 0, #4a0716 0 12px, #d8b46a 12px 14px, transparent 14.5px)",
                  backgroundSize: "26px 16px",
                  backgroundRepeat: "repeat-x",
                }}
              />
            </motion.div>

            <motion.div
              exit={{ opacity: 0, scale: 1.25 }}
              transition={{ duration: 1.2, ease: "easeIn" }}
              className="absolute inset-0 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ y: 40, opacity: 0, scale: 0.94 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.9,
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative flex h-[min(92dvh,760px)] w-[min(92vw,400px)] flex-col items-center justify-center overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] border-2 border-[#d8b46a] bg-[#5c0a1f] px-6 pb-16 pt-12 text-center text-[#f6dede] shadow-2xl"
              >
                <div className="pointer-events-none absolute inset-1.5 rounded-t-[999px] rounded-b-[2rem] border border-[#d8b46a]/60" />
                <div className="absolute left-1/2 top-[10%] h-[70%] -translate-x-1/2 opacity-[0.22]">
                  <Gunungan className="h-full" />
                </div>
                <Sparkles count={12} />
                <CloudBorder className="bottom-0" />

                <div className="relative z-10 flex flex-col items-center">
                  <motion.p
                    initial={{ opacity: 0, letterSpacing: "0.8em" }}
                    animate={{ opacity: 1, letterSpacing: "0.3em" }}
                    transition={{ delay: 0.6, duration: 1.4 }}
                    className="text-[11px] uppercase text-[#d8b46a]"
                  >
                    <span style={jv}>꧁</span> Sugeng Rawuh{" "}
                    <span style={jv}>꧂</span>
                  </motion.p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.35em] sm:text-xs">
                    The Wedding Of
                  </p>
                  <OvalPhoto
                    src={PHOTOS.cover}
                    alt="Foto Prewedding"
                    className="my-5 w-[min(64%,31dvh,260px)]"
                  />
                  <h1
                    style={script}
                    className="text-[2.6rem] leading-tight text-[#d8b46a] sm:text-5xl"
                  >
                    {COUPLE.short}
                  </h1>
                  <p className="mt-1 text-sm tracking-[0.3em]">
                    {COUPLE.dateText}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    data-nosfx
                    onClick={() => {
                      gameFx("open");
                      setIsOpen(true);
                      setIsPlaying(true);
                      audioRef.current?.play().catch(() => {});
                    }}
                    className="relative mt-8 inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-[#d8b46a] px-7 py-3 text-xs font-semibold text-[#3a0009] shadow-lg"
                  >
                    <MailOpen className="h-4 w-4" />
                    Buka Undangan
                    <Sheen />
                  </motion.button>

                  <p className="mt-5 text-[9px] uppercase tracking-[0.3em] text-[#d8b46a]/70">
                    Web by{" "}
                    <span className="font-semibold normal-case tracking-[0.12em]">
                      {BRAND}
                    </span>
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= KONTEN ================= */}
      {isOpen && (
        <div className="relative lg:mx-auto lg:flex lg:max-w-[1000px] lg:items-start lg:justify-center lg:gap-10 lg:px-6">
          <div
            className="pointer-events-none fixed inset-0 hidden overflow-hidden lg:block"
            aria-hidden
          >
            <Cloud className="-left-16 top-10 w-80" tone="maroon" />
            <Cloud className="-right-16 bottom-16 w-80" tone="maroon" />
            <Cloud className="left-[6%] bottom-6 w-56" />
            <Cloud className="right-[6%] top-6 w-56" />
            <div className="absolute left-[3%] top-1/2 h-[55%] -translate-y-1/2 opacity-[0.12]">
              <Gunungan className="h-full" />
            </div>
            <div className="absolute right-[3%] top-1/2 h-[55%] -translate-y-1/2 opacity-[0.12]">
              <Gunungan className="h-full" />
            </div>
            <Sparkles count={16} />
          </div>

          <aside className="relative hidden overflow-hidden rounded-t-[999px] rounded-b-3xl border-2 border-[#d8b46a]/70 shadow-2xl lg:sticky lg:top-6 lg:my-6 lg:block lg:h-[calc(100vh-3rem)] lg:max-h-[820px] lg:w-[380px] lg:shrink-0">
            <img
              src={PHOTOS.cover}
              alt="Foto Prewedding"
              className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3a0009]/95 via-[#3a0009]/15 to-transparent" />
            <Sparkles count={12} />
            <div className="relative z-10 flex h-full flex-col items-center justify-end px-4 pb-12 text-center text-[#f6dede]">
              <p className="text-[11px] uppercase tracking-[0.45em]">
                The Wedding Of
              </p>
              <h1 style={script} className="mt-2 text-5xl text-[#d8b46a]">
                {COUPLE.short}
              </h1>
              <p className="mt-2 text-sm tracking-[0.35em]">
                {COUPLE.dateText}
              </p>
            </div>
          </aside>

          <div className="relative w-full bg-white lg:my-6 lg:w-[480px] lg:shrink-0 lg:overflow-clip lg:rounded-3xl lg:shadow-2xl lg:ring-1 lg:ring-[#d8b46a]/60">
            <div className="sticky top-0 z-40 h-0">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="h-[3px] origin-left bg-[#d8b46a]"
              />
            </div>

            <div className="pointer-events-none sticky top-0 z-40 h-0">
              <div
                className="pointer-events-auto absolute left-3 flex items-center gap-2"
                style={{ top: "max(0.75rem, env(safe-area-inset-top))" }}
              >
                <button
                  onClick={backToCover}
                  aria-label="Kembali ke cover"
                  className={TOP_BTN}
                >
                  <Mail className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                </button>
                <button
                  onClick={() => setIsPlaying((p) => !p)}
                  aria-label="Musik"
                  className={TOP_BTN}
                >
                  {isPlaying ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Music className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                    </motion.span>
                  ) : (
                    <VolumeX className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  )}
                </button>
              </div>
            </div>

            <div className="pointer-events-none sticky top-[calc(100dvh-84px)] z-40 h-0">
              <motion.nav
                initial={{ y: 90, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 16,
                  delay: 1,
                }}
                className="pointer-events-auto mx-auto flex w-fit max-w-[94%] items-center gap-2 rounded-full bg-[#f3e6e6] p-2 shadow-[0_6px_24px_rgba(0,0,0,.35)] sm:gap-3"
              >
                {NAV.map(({ id, icon: Icon, label }) => (
                  <motion.button
                    key={id}
                    onClick={() => goTo(id)}
                    aria-label={label}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.88 }}
                    className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#6a0119] text-[#f6dede] sm:h-11 sm:w-11"
                  >
                    {active === id && (
                      <motion.span
                        layoutId="dockActive"
                        className="absolute inset-0 rounded-full bg-[#a30f2b] ring-2 ring-[#d8b46a]"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 28,
                        }}
                      />
                    )}
                    <Icon className="relative z-10 h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </motion.button>
                ))}
              </motion.nav>
            </div>

            {/* ---------- HOME ---------- */}
            <section
              id="home"
              className="relative overflow-hidden bg-[#fdf3f3] px-6 pb-20 pt-16 text-center"
            >
              <CornerOrnament className="left-2 top-2 w-16 sm:w-20" />
              <CornerOrnament className="right-2 top-2 w-16 -scale-x-100 sm:w-20" />
              <Cloud className="-left-10 top-64 w-28" tone="maroon" />
              <Sparkles count={10} />
              <CloudBorder className="bottom-0" />

              <div className="relative flex flex-col items-center">
                <Reveal className="flex flex-col items-center">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.3em]">
                    Kepada Yth. Bapak/Ibu/Saudara/i
                  </span>
                  <div className="my-3 inline-block border-y border-[#6a0119]/30 px-6 py-1.5">
                    <h2 className="text-lg font-medium">Tamu Undangan</h2>
                  </div>
                </Reveal>

                {/* Bagian Foto & Judul Utama (Aktif di HP & Desktop) */}
                <Reveal from="zoom" className="mb-6 mt-6 w-full">
                  <p className="mb-4 text-[11px] uppercase tracking-[0.4em]">
                    The Wedding Of
                  </p>
                  <OvalPhoto
                    src={PHOTOS.cover}
                    alt="Foto Prewedding"
                    className="w-[56%] max-w-[220px]"
                  />
                </Reveal>

                {/* REVISI: pakai `animate` (bukan `whileInView`) agar nama
                    mempelai selalu muncul di HP. Section home sudah terlihat
                    begitu undangan dibuka, jadi tidak perlu IntersectionObserver. */}
                <motion.h1
                  style={script}
                  initial={{ clipPath: "inset(-25% 100% -25% -5%)" }}
                  animate={{ clipPath: "inset(-25% -5% -25% -5%)" }}
                  transition={{ duration: 3.4, ease: "easeInOut", delay: 0.8 }}
                  className="mb-6 mt-2 leading-tight"
                >
                  <span className="block text-[2.5rem] leading-[1.2] sm:text-5xl">
                    {COUPLE.groom.short}
                  </span>
                  <span className="block text-3xl leading-none text-[#a30f2b] sm:text-4xl">
                    &
                  </span>
                  <span className="block text-[2.5rem] leading-[1.2] sm:text-5xl">
                    {COUPLE.bride.short}
                  </span>
                </motion.h1>

                <Reveal delay={0.1} className="mt-4 w-full">
                  <p className="mx-auto mb-4 max-w-xs text-xs font-light italic leading-relaxed tracking-wide sm:text-sm">
                    Dengan penuh sukacita, kami mengundang Bapak/Ibu/Saudara/i
                    untuk turut hadir dan menjadi bagian dari hari bahagia kami.
                  </p>
                  <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.25em]">
                    Menghitung Hari Menuju Acara Pernikahan
                  </p>
                  <div className="mx-auto grid max-w-sm grid-cols-4 gap-2.5">
                    {[
                      ["Hari", timeLeft.days],
                      ["Jam", timeLeft.hours],
                      ["Menit", timeLeft.minutes],
                      ["Detik", timeLeft.seconds],
                    ].map(([l, v]) => (
                      <div
                        key={l as string}
                        className="rounded-md bg-[#6a0119] py-3 text-[#f6dede] shadow-md"
                      >
                        <Flip value={v as number} />
                        <span className="text-[11px] font-light">{l}</span>
                      </div>
                    ))}
                  </div>
                </Reveal>

                <Reveal delay={0.2} className="mt-6">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={CALENDAR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#d8b46a] px-6 py-2.5 text-[11px] font-medium uppercase tracking-wider text-[#3a0009] [-webkit-text-stroke:0.35px_currentColor]"
                  >
                    <CalendarPlus className="h-3.5 w-3.5" /> Save The Date
                    <Sheen />
                  </motion.a>
                </Reveal>
              </div>
            </section>

            {/* ---------- MEMPELAI ---------- */}
            <section
              id="mempelai"
              className="relative overflow-hidden bg-[#3a0009] px-3 py-10"
            >
              <Sparkles count={8} />
              <div className="relative mx-auto w-full max-w-[26.5rem] rounded-t-[999px] rounded-b-[2.25rem] border-2 border-[#d8b46a] p-2">
                <div className="relative rounded-t-[999px] rounded-b-[1.75rem] border border-[#d8b46a]/70 bg-white px-6 pb-14 pt-24 text-center sm:px-8">
                  <Reveal>
                    <h3 style={display} className="text-xl font-semibold">
                      Assalamu'alaikum Wr. Wb.
                    </h3>
                    <div className="mx-auto mt-5 max-w-md">
                      <p style={jv} className="text-lg text-[#c9a45c]">
                        ꧁ ꧂
                      </p>
                      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#a30f2b]">
                        Doa &amp; Ayat Suci
                      </h2>
                      <p
                        className="mb-4 text-xl leading-loose sm:text-2xl"
                        dir="rtl"
                        style={display}
                      >
                        وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ
                        أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم
                        مَّوَدَّةً وَرَحْمَةً
                      </p>
                      <p className="text-xs font-light italic leading-relaxed sm:text-sm">
                        "Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia
                        menciptakan pasangan-pasangan untukmu dari jenismu
                        sendiri, agar kamu cenderung dan merasa tenteram
                        kepadanya, dan Dia menjadikan di antaramu rasa kasih dan
                        sayang."
                      </p>
                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest">
                        (QS. Ar-Rum: 21)
                      </p>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.8, delay: 0.6 }}
                        className="mx-auto my-5 h-px w-20 bg-[#6a0119]/40"
                      />
                      <p className="text-xs font-light italic leading-relaxed tracking-wide sm:text-sm">
                        Maha Suci Allah yang telah mempertemukan kami. Mohon doa
                        dan restu menuju hari bahagia kami.
                      </p>
                    </div>
                    <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed">
                      Tanpa mengurangi rasa hormat kami mengundang
                      Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan
                      kami...
                    </p>
                  </Reveal>

                  {[
                    {
                      p: COUPLE.groom,
                      img: PHOTOS.groom,
                      from: "left" as From,
                    },
                    {
                      p: COUPLE.bride,
                      img: PHOTOS.bride,
                      from: "right" as From,
                    },
                  ].map(({ p, img, from }, i) => (
                    <Reveal key={p.name} from={from} className="relative mt-12">
                      <Cloud
                        className={`${i ? "-left-6" : "-right-6"} top-10 w-24`}
                        tone={i ? "pink" : "maroon"}
                      />
                      <OvalPhoto
                        src={img}
                        alt={p.name}
                        className="w-[58%] max-w-[210px]"
                      />
                      <h3
                        style={display}
                        className="mt-6 text-3xl font-medium tracking-wide"
                      >
                        {p.name}
                      </h3>
                      <p className="mx-auto mt-2 max-w-[18rem] text-[13px] font-light leading-relaxed sm:text-sm">
                        {p.parents}
                      </p>
                      {i === 0 && (
                        <motion.p
                          style={script}
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 2.5, repeat: Infinity }}
                          className="mt-8 text-5xl text-[#a30f2b]"
                        >
                          &
                        </motion.p>
                      )}
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* ---------- ACARA & LOKASI ---------- */}
            <section
              id="acara"
              className="relative overflow-hidden bg-[#3a0009] px-4 pb-14 pt-4 text-center text-[#f6dede]"
            >
              <Cloud className="-left-8 top-2 w-28" />
              <Sparkles count={10} />
              <div className="relative rounded-t-[999px] rounded-b-3xl border-2 border-[#f6dede]/70 px-5 pb-14 pt-24">
                <EventBlock
                  title="Akad Nikah"
                  dayName="Sabtu"
                  month="November"
                  day="21"
                  time="Pukul 08.00 WIB - Selesai"
                />

                <div className="mx-auto my-6 h-px w-24 bg-[#d8b46a]/60" />

                <EventBlock
                  title="Resepsi Panggih"
                  dayName="Sabtu"
                  month="November"
                  day="21"
                  time="Jam Relax"
                />

                <div className="mx-auto my-6 flex items-center gap-3">
                  <span className="h-px flex-1 bg-[#f6dede]/60" />
                  <MapPin className="h-4 w-4" />
                  <span className="h-px flex-1 bg-[#f6dede]/60" />
                </div>
                <h4 className="text-sm font-semibold uppercase tracking-wider">
                  Kediaman Mempelai Wanita
                </h4>
                <p className="mx-auto mt-2 max-w-xs text-xs font-light leading-relaxed">
                  Jl. Gang Impres RT 04 RW 09, Desa Brenggolo, Kec. Plosoklaten,
                  Kab. Kediri, Jawa Timur
                </p>
              </div>

              {/* FIX PETA: Reveal (animasi scale) hanya membungkus judul.
                  Iframe tidak lagi di dalam elemen yang di-animate, tanpa
                  CSS filter berat, dan tanpa loading="lazy" supaya tidak
                  crash/reload saat scroll di HP. */}
              <div className="relative mt-8">
                <Reveal from="zoom">
                  <h3
                    style={{
                      ...display,
                      textShadow: "0 2px 8px rgba(0,0,0,.45)",
                    }}
                    className="text-2xl font-bold uppercase tracking-[0.1em] text-[#f3d98b] sm:text-3xl"
                  >
                    Lokasi Pernikahan
                  </h3>
                </Reveal>
                <div className="mt-4 rounded-[1.75rem] border-2 border-[#d8b46a] p-1.5 shadow-2xl">
                  <div className="relative overflow-hidden rounded-[1.25rem] border border-[#d8b46a]/70 bg-[#3a0009]">
                    <iframe
                      title="Peta lokasi pernikahan"
                      src={MAP_EMBED}
                      className="h-72 w-full sm:h-80"
                      style={{ border: 0 }}
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[#8a1a33]/25" />
                  </div>
                </div>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative mt-5 inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#d8b46a] px-6 py-2.5 text-[11px] font-medium uppercase tracking-wider text-[#3a0009] [-webkit-text-stroke:0.35px_currentColor]"
                >
                  <Navigation className="h-3.5 w-3.5" /> Buka di Google Maps
                  <Sheen />
                </motion.a>
              </div>
            </section>

            {/* ---------- GALERI ---------- */}
            <section
              id="galeri"
              className="relative bg-[#3a0009] px-4 pb-14 pt-8 text-center text-[#f6dede]"
            >
              <Reveal>
                <h2
                  style={display}
                  className="text-4xl font-semibold uppercase tracking-wide sm:text-5xl"
                >
                  Best{" "}
                  <span
                    style={script}
                    className="text-5xl normal-case text-[#d8b46a] sm:text-6xl"
                  >
                    Moment
                  </span>
                </h2>
              </Reveal>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                {PHOTOS.gallery.map((src, i) => (
                  <motion.div
                    key={src}
                    initial={{ opacity: 0, scale: 0.8, rotate: i % 2 ? 4 : -4 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 1.2,
                      delay: (i % 2) * 0.25,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="rounded-[1.75rem] border-2 border-[#d8b46a] p-1"
                  >
                    <div className="overflow-hidden rounded-[1.35rem]">
                      <motion.img
                        src={src}
                        alt={`Galeri ${i + 1}`}
                        loading="lazy"
                        decoding="async"
                        whileHover={{ scale: 1.12 }}
                        transition={{ duration: 0.6 }}
                        className="aspect-[3/4] w-full object-cover"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ---------- GAME ---------- */}
            <section
              id="game"
              className="relative overflow-hidden bg-[#3a0009] px-4 pb-14 pt-6 text-center text-[#f6dede]"
            >
              <Sparkles count={8} />
              <Reveal className="relative">
                <h2
                  style={display}
                  className="text-4xl font-semibold uppercase tracking-wide sm:text-5xl"
                >
                  Main{" "}
                  <span
                    style={script}
                    className="text-5xl normal-case text-[#d8b46a] sm:text-6xl"
                  >
                    Yuk
                  </span>
                </h2>
                <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed">
                  Satu permainan kecil untuk menemani kamu sambil menunggu hari
                  bahagia kami.
                </p>
              </Reveal>

              <Reveal className="relative mt-8 rounded-[1.75rem] border-2 border-[#d8b46a] px-5 py-7">
                <h3
                  style={display}
                  className="text-2xl font-semibold uppercase tracking-wide text-[#d8b46a]"
                >
                  Antar Pengantin
                </h3>
                <MazeGame />
              </Reveal>
            </section>

            {/* ---------- TERIMA KASIH ---------- */}
            <section className="relative overflow-hidden bg-[#fdf3f3] px-6 pb-28 pt-16 text-center">
              <Cloud className="-left-8 -top-6 w-32" />
              <Sparkles count={10} />
              <CloudBorder className="bottom-0" />
              <Reveal from="zoom">
                <OvalPhoto
                  src={PHOTOS.thanks}
                  alt="Terima kasih"
                  className="w-[50%] max-w-[190px]"
                />
                <p style={jv} className="mt-6 text-lg text-[#c9a45c]">
                  ꧁ ꧂
                </p>
                <h2 style={script} className="text-5xl">
                  Matur Nuwun
                </h2>
                <p className="mt-1 text-[11px] uppercase tracking-[0.3em]">
                  Terima Kasih
                </p>
                <p className="mx-auto mt-4 max-w-xs text-xs leading-relaxed">
                  Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila
                  Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu
                  kepada kedua mempelai.
                </p>
                <p className="mt-5 text-sm font-semibold">
                  Wassalamu'alaikum Wr. Wb.
                </p>
                <p className="mt-8 text-xs">Kami yang berbahagia,</p>
                <p style={script} className="mt-5 text-5xl leading-[1.4]">
                  {COUPLE.short}
                </p>
              </Reveal>
            </section>

            {/* ---------- FOOTER ---------- */}
            <footer className="relative overflow-hidden bg-[#3a0009] px-6 pb-32 pt-10 text-center text-[#f6dede]">
              <Sparkles count={8} />
              <Reveal className="relative flex flex-col items-center">
                <p style={display} className="text-xl font-medium">
                  Mau undangan digital seperti ini?
                </p>
                <p className="mx-auto mt-2 max-w-[17rem] text-xs font-light leading-relaxed opacity-90">
                  Chat kami lewat Instagram atau LinkedIn untuk pemesanan.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={IG_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#d8b46a] px-6 py-2.5 text-[11px] font-medium uppercase tracking-wider text-[#3a0009] [-webkit-text-stroke:0.35px_currentColor]"
                  >
                    <IgIcon className="h-3.5 w-3.5" /> Instagram
                    <Sheen />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#d8b46a] px-6 py-2.5 text-[11px] font-medium uppercase tracking-wider text-[#3a0009] [-webkit-text-stroke:0.35px_currentColor]"
                  >
                    <LinkedinIcon className="h-3.5 w-3.5" /> LinkedIn
                    <Sheen />
                  </motion.a>
                </div>
              </Reveal>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
}