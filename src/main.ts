import "./style.css";
import { NODES, TIERS, type Parent } from "./data";

/* ── error bar ─────────────────────────────────────────── */
window.addEventListener("error", (ev) => {
  const b = document.getElementById("err")!;
  b.textContent = "script error: " + (ev.message || "") + "  @" + (ev.lineno || "?");
  b.style.display = "block";
});

interface Child {
  id: string;
  why: string;
  primary: boolean;
}
interface Concept {
  id: string;
  name: string;
  tier: number;
  blurb: string;
  parents: Parent[];
  children: Child[];
  d: number;
  x: number;
  y: number;
  el: HTMLButtonElement;
}
interface EdgeEl {
  p: string;
  c: string;
  path: SVGPathElement;
  head: SVGPathElement;
}

/* ── index ─────────────────────────────────────────────── */
const byId: Record<string, Concept> = {};
NODES.forEach(([id, name, tier, blurb, parents]) => {
  byId[id] = { id, name, tier, blurb, parents, children: [] } as unknown as Concept;
});
Object.values(byId).forEach((n) =>
  n.parents.forEach(([pid, why], i) => {
    if (byId[pid]) byId[pid].children.push({ id: n.id, why, primary: i === 0 });
  }),
);
const ALL = Object.values(byId);
const maxLoad = Math.max(...ALL.map((n) => n.children.length));

document.getElementById("q")!.setAttribute("placeholder", `search ${ALL.length} concepts…`);

/* ── tidy tree layout (primary spine, left→right, zero crossings) ── */
const NW = 196,
  NH = 44,
  GX = 64,
  ROW = 54,
  PAD = 40;
const collapsed = new Set<string>();
const kidsOf = (n: Concept): Concept[] =>
  n.children.filter((c) => c.primary).map((c) => byId[c.id]);
let width = 0,
  height = 0;
function layout() {
  let cursor = 0;
  width = 0;
  const place = (n: Concept, d: number) => {
    n.d = d;
    n.x = PAD + d * (NW + GX);
    width = Math.max(width, n.x + NW + PAD);
    const k = kidsOf(n);
    if (!k.length || collapsed.has(n.id)) {
      n.y = PAD + cursor * ROW;
      cursor++;
      return;
    }
    k.forEach((c) => place(c, d + 1));
    n.y = (k[0].y + k[k.length - 1].y) / 2;
  };
  ALL.filter((n) => !n.parents.length).forEach((r) => {
    place(r, 0);
    cursor++;
  });
  height = PAD * 2 + cursor * ROW;
}
function visible(n: Concept): boolean {
  // node shown if no collapsed ancestor on its spine
  let c = n;
  while (c.parents.length) {
    c = byId[c.parents[0][0]];
    if (collapsed.has(c.id)) return false;
  }
  return true;
}

/* ── render ─────────────────────────────────────────────── */
const canvas = document.getElementById("canvas")!;
const svg = document.getElementById("edges") as unknown as SVGSVGElement;
const NS = "http://www.w3.org/2000/svg";
ALL.forEach((n) => {
  const b = document.createElement("button");
  b.className = "node";
  b.dataset.id = n.id;
  const k = kidsOf(n).length;
  b.innerHTML = `<span class="nm">${n.name}</span>
    <span class="meta"><span class="load"><i style="width:${Math.round((100 * n.children.length) / maxLoad)}%"></i></span>
    <span class="t">T${n.tier}</span>${k ? `<span class="cx" title="collapse">${k}</span>` : ""}</span>`;
  b.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).classList.contains("cx")) {
      collapsed.has(n.id) ? collapsed.delete(n.id) : collapsed.add(n.id);
      draw();
      return;
    }
    select(n.id, true);
  });
  canvas.appendChild(b);
  n.el = b;
});
let edgeEls: EdgeEl[] = [];
function draw() {
  layout();
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  edgeEls = [];
  ALL.forEach((n) => {
    const vis = visible(n);
    n.el.style.display = vis ? "block" : "none";
    if (!vis) return;
    n.el.style.left = n.x + "px";
    n.el.style.top = n.y + "px";
    n.el.classList.toggle("col", collapsed.has(n.id));
    const p = n.parents.length ? byId[n.parents[0][0]] : null;
    if (!p || !visible(p)) return;
    const x1 = p.x + NW,
      y1 = p.y + NH / 2,
      x2 = n.x - 8,
      y2 = n.y + NH / 2,
      dx = Math.max(28, (x2 - x1) * 0.55);
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`);
    path.setAttribute("class", "link");
    const head = document.createElementNS(NS, "path");
    head.setAttribute("d", `M${x2 - 1},${y2 - 4} L${x2 - 1},${y2 + 4} L${x2 + 6},${y2} Z`);
    head.setAttribute("class", "head");
    svg.appendChild(path);
    svg.appendChild(head);
    edgeEls.push({ p: p.id, c: n.id, path, head });
  });
  if (sel) paint(sel);
}

/* ── pan / zoom ─────────────────────────────────────────── */
const vp = document.getElementById("viewport")!;
let z = 1,
  tx = 0,
  ty = 0;
const apply = () => (canvas.style.transform = `translate(${tx}px,${ty}px) scale(${z})`);
function fit() {
  const r = vp.getBoundingClientRect();
  const w = window.innerWidth >= 900 ? r.width - 404 : r.width;
  z = Math.max(0.12, Math.min(w / width, r.height / height, 1));
  tx = Math.max(8, (w - width * z) / 2);
  ty = Math.max(8, (r.height - height * z) / 2);
  apply();
}
function zoomAt(f: number, cx: number, cy: number) {
  const nz = Math.min(2.2, Math.max(0.1, z * f));
  tx = cx - (cx - tx) * (nz / z);
  ty = cy - (cy - ty) * (nz / z);
  z = nz;
  apply();
}
vp.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    const r = vp.getBoundingClientRect();
    zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX - r.left, e.clientY - r.top);
  },
  { passive: false },
);
const pts = new Map<number, PointerEvent>();
let last: { x: number; y: number } | null = null,
  pd = 0,
  moved = 0;
vp.addEventListener("pointerdown", (e) => {
  pts.set(e.pointerId, e);
  try {
    vp.setPointerCapture(e.pointerId);
  } catch (_) {
    /* ignore */
  }
  vp.classList.add("drag");
  last = { x: e.clientX, y: e.clientY };
  moved = 0;
});
vp.addEventListener("pointermove", (e) => {
  if (!pts.has(e.pointerId)) return;
  pts.set(e.pointerId, e);
  const a = [...pts.values()];
  if (a.length === 2) {
    const d = Math.hypot(a[0].clientX - a[1].clientX, a[0].clientY - a[1].clientY);
    if (pd) {
      const r = vp.getBoundingClientRect();
      zoomAt(
        d / pd,
        (a[0].clientX + a[1].clientX) / 2 - r.left,
        (a[0].clientY + a[1].clientY) / 2 - r.top,
      );
    }
    pd = d;
    return;
  }
  if (last) {
    const dx = e.clientX - last.x,
      dy = e.clientY - last.y;
    moved += Math.abs(dx) + Math.abs(dy);
    tx += dx;
    ty += dy;
    last = { x: e.clientX, y: e.clientY };
    apply();
  }
});
const up = (e: PointerEvent) => {
  pts.delete(e.pointerId);
  if (pts.size < 2) pd = 0;
  if (!pts.size) {
    last = null;
    vp.classList.remove("drag");
  }
};
vp.addEventListener("pointerup", up);
vp.addEventListener("pointercancel", up);
document.getElementById("zIn")!.onclick = () => {
  const r = vp.getBoundingClientRect();
  zoomAt(1.25, r.width / 2, r.height / 2);
};
document.getElementById("zOut")!.onclick = () => {
  const r = vp.getBoundingClientRect();
  zoomAt(0.8, r.width / 2, r.height / 2);
};
document.getElementById("fit")!.onclick = fit;

/* ── selection ──────────────────────────────────────────── */
let sel: string | null = null;
const panel = document.getElementById("panel")!;
const spineOf = (id: string): Concept[] => {
  const p: Concept[] = [];
  let c: Concept | null = byId[id];
  while (c) {
    p.unshift(c);
    c = c.parents.length ? byId[c.parents[0][0]] : null;
  }
  return p;
};
function paint(id: string) {
  const n = byId[id];
  const kin = new Set([id, ...n.parents.map((p) => p[0]), ...n.children.map((c) => c.id)]);
  ALL.forEach((m) => {
    m.el.classList.toggle("sel", m.id === id);
    m.el.classList.toggle("kin", kin.has(m.id) && m.id !== id);
    m.el.classList.toggle("fade", !kin.has(m.id));
  });
  edgeEls.forEach((e) => {
    const on = e.p === id || e.c === id;
    e.path.classList.toggle("on", on);
    e.head.classList.toggle("on", on);
    e.path.style.opacity = on ? "1" : ".3";
    e.head.style.opacity = on ? "1" : ".3";
  });
  svg.querySelectorAll(".xlink").forEach((el) => el.remove());
  const arc = (a: Concept, b: Concept) => {
    if (!visible(a) || !visible(b)) return;
    const x1 = a.x + NW / 2,
      y1 = a.y + NH,
      x2 = b.x + NW / 2,
      y2 = b.y + NH;
    const mx = (x1 + x2) / 2,
      my = Math.max(y1, y2) + Math.min(120, Math.abs(x2 - x1) * 0.28) + 26;
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", `M${x1},${y1} Q${mx},${my} ${x2},${y2}`);
    p.setAttribute("class", "xlink");
    svg.appendChild(p);
  };
  n.parents.slice(1).forEach(([pid]) => byId[pid] && arc(byId[pid], n));
  n.children.filter((c) => !c.primary).forEach((c) => byId[c.id] && arc(n, byId[c.id]));
  document
    .querySelectorAll<HTMLElement>("#outline .row")
    .forEach((r) => r.classList.toggle("sel", r.dataset.id === id));
}
function select(id: string, center: boolean) {
  sel = id;
  const n = byId[id];
  spineOf(id).forEach((a) => collapsed.delete(a.id));
  draw();
  const ups = n.parents.map(([p, w]) => ({ n: byId[p], w })).filter((x) => x.n);
  const dns = n.children
    .map((c) => ({ n: byId[c.id], w: c.why }))
    .filter((x) => x.n)
    .sort((a, b) => a.n.tier - b.n.tier);
  const sp = spineOf(id)
    .map((p) =>
      p.id === id
        ? `<b style="color:var(--text-primary)">${p.name}</b>`
        : `<button data-go="${p.id}">${p.name}</button>`,
    )
    .join(" → ");
  panel.innerHTML = `<div class="scroll">
    <div class="ph"><button class="x" aria-label="Close">✕</button>
      <div class="eyebrow">Tier ${n.tier} · ${TIERS[n.tier - 1].name} · ${n.children.length} dependents</div>
      <h2>${n.name}</h2><p>${n.blurb}</p></div>
    ${
      ups.length
        ? `<div class="sec"><div class="sh">↑ rests on · ${ups.length}</div>${ups
            .map((u) => `<div class="edge"><b data-go="${u.n.id}">${u.n.name}</b><span>${u.w}</span></div>`)
            .join("")}</div>`
        : ""
    }
    ${
      dns.length
        ? `<div class="sec"><div class="sh">↓ makes possible · ${dns.length}</div>${dns
            .map((d) => `<div class="edge dn"><b data-go="${d.n.id}">${d.n.name}</b><span>${d.w}</span></div>`)
            .join("")}</div>`
        : ""
    }
    <div class="sec"><div class="sh">spine</div><div class="spine">${sp}</div></div></div>`;
  panel.classList.add("open");
  panel
    .querySelectorAll<HTMLElement>("[data-go]")
    .forEach((b) => (b.onclick = () => select(b.dataset.go!, true)));
  (panel.querySelector(".x") as HTMLElement).onclick = () => panel.classList.remove("open");
  if (center && !document.body.classList.contains("list")) {
    const r = vp.getBoundingClientRect();
    const px = window.innerWidth >= 900 ? (r.width - 390) / 2 : r.width / 2;
    tx = px - (n.x + NW / 2) * z;
    ty = r.height / 2 - (n.y + NH / 2) * z;
    apply();
  }
}
vp.addEventListener("click", () => {
  if (moved < 6 && window.innerWidth < 900) panel.classList.remove("open");
});

/* ── outline ────────────────────────────────────────────── */
const out = document.getElementById("outline")!;
function buildOutline() {
  out.innerHTML = `<div class="legend">${TIERS.map(
    (t) => `T${t.n} · ${t.name} — ${t.note}`,
  ).join("<br>")}</div>`;
  const kids = (n: Concept) => n.children.filter((c) => c.primary).map((c) => byId[c.id]);
  const walk = (n: Concept, pre: string, last: boolean, d: number, box: HTMLElement) => {
    const k = kids(n);
    const r = document.createElement("button");
    r.className = "row";
    r.dataset.id = n.id;
    r.innerHTML = `<span class="gl">${pre}${d ? (last ? "└─ " : "├─ ") : ""}</span>
      <span class="lb"><span class="nm2">${n.name}</span><span class="c">T${n.tier}${n.parents.length > 1 ? " ·" + n.parents.length + "dep" : ""}</span></span>`;
    r.onclick = () => select(n.id, false);
    box.appendChild(r);
    k.forEach((c, i) => walk(c, d ? pre + (last ? "   " : "│  ") : "", i === k.length - 1, d + 1, box));
  };
  const box = document.createElement("div");
  ALL.filter((n) => !n.parents.length).forEach((r) => walk(r, "", true, 0, box));
  out.appendChild(box);
}
buildOutline();
const vg = document.getElementById("vGraph")!;
const vl = document.getElementById("vList")!;
vg.onclick = () => {
  document.body.classList.remove("list");
  vg.setAttribute("aria-pressed", "true");
  vl.setAttribute("aria-pressed", "false");
  draw();
  fit();
};
vl.onclick = () => {
  document.body.classList.add("list");
  vl.setAttribute("aria-pressed", "true");
  vg.setAttribute("aria-pressed", "false");
};

/* ── search ─────────────────────────────────────────────── */
document.getElementById("q")!.addEventListener("input", (e) => {
  const q = (e.target as HTMLInputElement).value.trim().toLowerCase();
  const rows = document.querySelectorAll<HTMLElement>("#outline .row");
  if (!q) {
    ALL.forEach((n) => n.el.classList.remove("hit", "fade"));
    rows.forEach((r) => r.classList.remove("hit", "fade"));
    if (sel) select(sel, false);
    return;
  }
  const test = (n: Concept) =>
    n.name.toLowerCase().includes(q) || n.blurb.toLowerCase().includes(q);
  ALL.forEach((n) => {
    const h = test(n);
    n.el.classList.remove("sel", "kin");
    n.el.classList.toggle("hit", h);
    n.el.classList.toggle("fade", !h);
  });
  rows.forEach((r) => {
    const h = test(byId[r.dataset.id!]);
    r.classList.toggle("hit", h);
    r.classList.toggle("fade", !h);
  });
  edgeEls.forEach((e) => {
    e.path.style.opacity = ".12";
    e.head.style.opacity = ".12";
    e.path.classList.remove("on");
    e.head.classList.remove("on");
  });
  svg.querySelectorAll(".xlink").forEach((el) => el.remove());
});

draw();
fit();
