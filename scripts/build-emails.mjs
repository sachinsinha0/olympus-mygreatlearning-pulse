#!/usr/bin/env node
/**
 * Builds the AI Pulse email gallery.
 *
 *   1. Reads every template in emails/, pulling its <title> and preheader.
 *   2. Writes emails/index.html, the gallery page.
 *   3. Copies emails/*.html into dist/emails/ so Vercel serves them.
 *
 * The gallery is generated rather than hand-maintained so a new template shows
 * up by dropping the file into emails/. Nothing to register by hand.
 *
 * Run directly (node scripts/build-emails.mjs) to refresh the gallery locally,
 * or let `npm run build` do it.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const EMAILS = join(ROOT, "emails");
const DIST = join(ROOT, "dist", "emails");

/** Lifecycle order. Anything not listed is appended alphabetically. */
const ORDER = [
  "product-launch",
  "biweekly-release",
  "module-feedback",
  "re-engagement",
  "trial-expiring-10-days",
  "trial-expiring-3-days",
  "trial-expired",
  "trial-expired-day-3",
  "trial-expired-reminder",
  "guru-dashboard-default",
];

/** Grouping. `overview` files are web reading pages, not emails, so they are kept apart. */
const GROUPS = [
  {
    id: "lifecycle",
    label: "Trial lifecycle",
    note: "Sent as a learner moves through the 30 day trial and past its end.",
    match: (s) => s.startsWith("trial-"),
  },
  {
    id: "programme",
    label: "Programme",
    note: "Launch, release cadence, feedback and re-engagement.",
    match: (s) => ["product-launch", "biweekly-release", "module-feedback", "re-engagement"].includes(s),
  },
  {
    id: "internal",
    label: "Guru",
    note: "Addressed to Gurus rather than learners.",
    match: (s) => s.startsWith("guru-"),
  },
  {
    id: "pages",
    label: "Module overview pages",
    note: "Web reading pages, not emails. Grouped here because they live alongside the templates.",
    match: (s) => s.includes("-overview"),
  },
];

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function readTemplate(file) {
  const slug = file.replace(/\.html$/, "");
  const html = readFileSync(join(EMAILS, file), "utf8");

  const title = (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? slug).trim();

  // Preheader lives in the hidden div right after <body>.
  let preheader = "";
  const hidden = html.match(/<div[^>]*display:none[^>]*>([\s\S]*?)<\/div>/i);
  if (hidden) preheader = hidden[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  const personalised = /\{first_name\}/.test(html);
  const templated = /\{module_title\}|\{module_description\}/.test(html);

  return { slug, file, title, preheader, personalised, templated };
}

const files = readdirSync(EMAILS).filter((f) => f.endsWith(".html") && f !== "index.html");
const items = files.map(readTemplate).sort((a, b) => {
  const ia = ORDER.indexOf(a.slug);
  const ib = ORDER.indexOf(b.slug);
  if (ia !== -1 && ib !== -1) return ia - ib;
  if (ia !== -1) return -1;
  if (ib !== -1) return 1;
  return a.slug.localeCompare(b.slug);
});

function card(item, featured) {
  const tags = [
    item.personalised ? "personalised" : null,
    item.templated ? "templated" : null,
  ].filter(Boolean);

  return `        <a class="card${featured ? " card--featured" : ""}" href="./${esc(item.file)}" target="_blank" rel="noopener">
          <div class="card__stage">
            <div class="card__frame">
              <iframe src="./${esc(item.file)}" title="${esc(item.title)}" loading="lazy" scrolling="no" tabindex="-1" aria-hidden="true"></iframe>
            </div>
          </div>
          <div class="card__body">
            <p class="card__file">${esc(item.file)}</p>
            <h3 class="card__title">${esc(item.title)}</h3>
            ${item.preheader ? `<p class="card__pre">${esc(item.preheader)}</p>` : ""}
            <div class="card__meta">
              ${tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}
              <span class="card__open">Open<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3h8v8M13 3 3 13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            </div>
          </div>
        </a>`;
}

const used = new Set();
const sections = GROUPS.map((g) => {
  const list = items.filter((i) => !used.has(i.slug) && g.match(i.slug));
  list.forEach((i) => used.add(i.slug));
  if (!list.length) return "";
  return `      <section class="group" id="${g.id}">
        <div class="group__head">
          <h2 class="group__label">${esc(g.label)}</h2>
          <p class="group__note">${esc(g.note)}</p>
          <span class="group__count">${list.length}</span>
        </div>
        <div class="grid">
${list.map((i) => card(i, false)).join("\n")}
        </div>
      </section>`;
}).filter(Boolean).join("\n");

const emailCount = items.filter((i) => !i.slug.includes("-overview")).length;

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AI Pulse / Email Library</title>
<meta name="description" content="Every AI Pulse email template, previewed live.">
<link rel="icon" href="/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root{
    --ink:#f2f5fb;
    --ink-dim:#8b95ac;
    --ink-faint:#5b6479;
    --bg:#07090f;
    --surface:#0f131c;
    --surface-2:#141926;
    --line:rgba(255,255,255,.075);
    --line-strong:rgba(255,255,255,.16);
    --blue:#2e9afb;
    --blue-deep:#004fce;
    --serif:"Instrument Serif",Georgia,"Times New Roman",serif;
    --mono:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace;
    --stage-h:280px;
  }
  *{box-sizing:border-box}
  html{-webkit-text-size-adjust:100%}
  body{
    margin:0;background:var(--bg);color:var(--ink);
    font-family:var(--mono);font-size:13px;line-height:1.6;
    -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
  }
  /* Grain + a single deep glow so the canvas is not flat black. */
  body::before{
    content:"";position:fixed;inset:0;pointer-events:none;z-index:0;
    background:
      radial-gradient(900px 520px at 12% -8%,rgba(0,79,206,.28),transparent 62%),
      radial-gradient(760px 460px at 92% 4%,rgba(46,154,251,.13),transparent 60%);
  }
  body::after{
    content:"";position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.16;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");
  }
  .wrap{position:relative;z-index:1;max-width:1320px;margin:0 auto;padding:0 28px 120px}

  /* ---- masthead ---- */
  header{padding:76px 0 0}
  .kicker{
    display:flex;align-items:center;gap:10px;
    font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-faint);margin:0 0 26px;
  }
  .kicker .dot{width:6px;height:6px;border-radius:50%;background:var(--blue);box-shadow:0 0 14px 2px rgba(46,154,251,.7)}
  h1{
    font-family:var(--serif);font-weight:400;
    font-size:clamp(46px,8.2vw,104px);line-height:.94;letter-spacing:-.02em;
    margin:0;color:var(--ink);
  }
  h1 em{
    font-style:italic;
    background:linear-gradient(96deg,var(--blue-deep),var(--blue));
    -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
  }
  .lede{
    max-width:60ch;margin:26px 0 0;color:var(--ink-dim);font-size:14px;line-height:1.75;
  }
  .stats{
    display:flex;flex-wrap:wrap;gap:34px;margin:44px 0 0;
    padding:22px 0 0;border-top:1px solid var(--line);
  }
  .stat b{
    display:block;font-family:var(--serif);font-size:34px;font-weight:400;line-height:1;color:var(--ink);
  }
  .stat span{display:block;margin-top:8px;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-faint)}

  /* ---- viewport toggle ---- */
  .toolbar{
    position:sticky;top:0;z-index:5;margin:54px 0 0;padding:14px 0;
    display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap;
    background:linear-gradient(180deg,var(--bg) 68%,rgba(7,9,15,0));
  }
  .toolbar__label{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-faint)}
  .seg{display:inline-flex;border:1px solid var(--line-strong);border-radius:999px;overflow:hidden;background:var(--surface)}
  .seg button{
    appearance:none;border:0;background:transparent;color:var(--ink-dim);cursor:pointer;
    font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;
    padding:9px 18px;transition:color .18s ease,background .18s ease;
  }
  .seg button[aria-pressed="true"]{background:var(--ink);color:#05070c}
  .seg button:not([aria-pressed="true"]):hover{color:var(--ink)}

  /* ---- groups ---- */
  .group{margin:64px 0 0}
  .group__head{
    display:grid;grid-template-columns:auto 1fr auto;align-items:baseline;gap:18px;
    padding-bottom:16px;border-bottom:1px solid var(--line);margin-bottom:26px;
  }
  .group__label{
    font-family:var(--serif);font-weight:400;font-size:27px;letter-spacing:-.01em;margin:0;color:var(--ink);
  }
  .group__note{margin:0;color:var(--ink-faint);font-size:11.5px}
  .group__count{
    font-size:11px;color:var(--ink-faint);border:1px solid var(--line-strong);
    border-radius:999px;padding:3px 11px;
  }
  @media (max-width:720px){
    .group__head{grid-template-columns:1fr auto}
    .group__note{grid-column:1/-1;order:3}
  }

  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:22px}

  /* ---- card ---- */
  .card{
    position:relative;display:flex;flex-direction:column;text-decoration:none;color:inherit;
    background:var(--surface);border:1px solid var(--line);border-radius:14px;overflow:hidden;
    opacity:0;transform:translateY(14px);
    animation:rise .62s cubic-bezier(.22,.68,.36,1) forwards;
    transition:border-color .22s ease,transform .22s ease,box-shadow .22s ease;
  }
  @keyframes rise{to{opacity:1;transform:none}}
  @media (prefers-reduced-motion:reduce){
    .card{animation:none;opacity:1;transform:none}
  }
  .card:hover{
    border-color:var(--line-strong);transform:translateY(-3px);
    box-shadow:0 18px 44px -22px rgba(0,0,0,.9),0 0 0 1px rgba(46,154,251,.16);
  }
  .card:focus-visible{outline:2px solid var(--blue);outline-offset:3px}

  /* Live preview, clipped to a fixed stage and scaled to fit. */
  .card__stage{
    position:relative;height:var(--stage-h);overflow:hidden;
    background:#f5f5f7;border-bottom:1px solid var(--line);
  }
  .card__frame{position:absolute;inset:0;transform-origin:top left}
  .card__stage iframe{width:680px;height:1600px;border:0;display:block;background:#f5f5f7}
  .card__stage::after{
    content:"";position:absolute;left:0;right:0;bottom:0;height:88px;pointer-events:none;
    background:linear-gradient(180deg,rgba(15,19,28,0),rgba(15,19,28,.92));
  }

  .card__body{padding:18px 19px 19px;display:flex;flex-direction:column;gap:9px;flex:1}
  .card__file{
    margin:0;font-size:10.5px;letter-spacing:.06em;color:var(--blue);
    overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
  }
  .card__title{
    font-family:var(--serif);font-weight:400;font-size:21px;line-height:1.24;letter-spacing:-.01em;
    margin:0;color:var(--ink);
  }
  .card__pre{
    margin:0;color:var(--ink-dim);font-size:11.5px;line-height:1.6;
    display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
  }
  .card__meta{display:flex;align-items:center;gap:7px;margin-top:auto;padding-top:12px;flex-wrap:wrap}
  .tag{
    font-size:9.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--ink-faint);
    border:1px solid var(--line-strong);border-radius:999px;padding:3px 9px;
  }
  .card__open{
    margin-left:auto;display:inline-flex;align-items:center;gap:6px;
    font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--ink-faint);
    transition:color .2s ease;
  }
  .card__open svg{width:11px;height:11px}
  .card:hover .card__open{color:var(--blue)}

  footer{
    margin:96px 0 0;padding-top:24px;border-top:1px solid var(--line);
    display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;
    color:var(--ink-faint);font-size:11px;
  }
  footer a{color:var(--ink-dim);text-decoration:none;border-bottom:1px solid var(--line-strong)}
  footer a:hover{color:var(--blue)}
</style>
</head>
<body>
  <div class="wrap">

    <header>
      <p class="kicker"><span class="dot"></span> Great Learning / AI Pulse</p>
      <h1>The email<br><em>library</em></h1>
      <p class="lede">
        Every AI Pulse template, rendered live from source. Each tile below is the real
        HTML in an iframe, not a screenshot, so what you see is what lands in the inbox.
        Open any tile for the full email.
      </p>
      <div class="stats">
        <div class="stat"><b>${emailCount}</b><span>Email templates</span></div>
        <div class="stat"><b>${items.length - emailCount}</b><span>Overview pages</span></div>
        <div class="stat"><b>680</b><span>Canvas width, px</span></div>
      </div>
    </header>

    <div class="toolbar">
      <span class="toolbar__label">Preview width</span>
      <div class="seg" role="group" aria-label="Preview width">
        <button type="button" data-w="680" aria-pressed="true">Desktop</button>
        <button type="button" data-w="390" aria-pressed="false">Mobile</button>
      </div>
    </div>

${sections}

    <footer>
      <span>Generated from /emails by scripts/build-emails.mjs</span>
      <span><a href="https://olympus.mygreatlearning.com/pulse">AI Pulse</a></span>
    </footer>

  </div>

<script>
  // Scale each live preview so a 680px (or 390px) email fits its tile.
  var width = 680;

  function fit() {
    document.querySelectorAll('.card__stage').forEach(function (stage) {
      var frame = stage.querySelector('.card__frame');
      var iframe = stage.querySelector('iframe');
      if (!frame || !iframe) return;
      iframe.style.width = width + 'px';
      // Never upscale. A 390px mobile email in a wider tile renders 1:1, centred,
      // rather than being blown up and going soft.
      var scale = Math.min(stage.clientWidth / width, 1);
      var offset = Math.max((stage.clientWidth - width * scale) / 2, 0);
      frame.style.transform = 'translateX(' + offset + 'px) scale(' + scale + ')';
      // Counter the scale so the clipped stage still shows a full-height crop.
      frame.style.width = width + 'px';
      frame.style.height = (stage.clientHeight / scale) + 'px';
    });
  }

  document.querySelectorAll('.seg button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      width = Number(btn.dataset.w);
      document.querySelectorAll('.seg button').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      fit();
    });
  });

  // Stagger the reveal without hand-writing a delay per card.
  document.querySelectorAll('.card').forEach(function (card, i) {
    card.style.animationDelay = Math.min(i * 55, 700) + 'ms';
  });

  window.addEventListener('resize', fit);
  window.addEventListener('load', fit);
  fit();
</script>
</body>
</html>
`;

writeFileSync(join(EMAILS, "index.html"), page);
console.log(`gallery: emails/index.html (${items.length} templates)`);

// Copy templates + gallery into the Vercel output.
if (existsSync(join(ROOT, "dist"))) {
  mkdirSync(DIST, { recursive: true });
  for (const f of [...files, "index.html"]) copyFileSync(join(EMAILS, f), join(DIST, f));
  console.log(`copied ${files.length + 1} files to dist/emails/`);
} else {
  console.log("dist/ not present, skipped copy (run after vite build)");
}
