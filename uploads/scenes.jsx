// scenes.jsx
// Scene components for the Warung Menu MBG special-menu video.
// Composed inside <Stage> from animations.jsx.
// 9:16 canvas = 1080 × 1920.

const W = 1080;
const H = 1920;

// ── Palette ─────────────────────────────────────────────────────────────────
const PALETTE = {
  navy:      '#0d1b3d',
  navyDeep:  '#081430',
  navyMid:   '#14285a',
  gold:      '#d4a24a',
  goldLight: '#e8c572',
  goldSoft:  'rgba(212, 162, 74, 0.35)',
  cream:     '#f4ecd8',
  creamDim:  'rgba(244, 236, 216, 0.72)',
};

// ── Typography ─────────────────────────────────────────────────────────────
const FONT_DISPLAY = '"Cormorant Garamond", "Playfair Display", serif'; // serif elegan (italic)
const FONT_SERIF   = '"Cormorant Garamond", "EB Garamond", Georgia, serif';
const FONT_SANS    = '"Jost", "Inter", system-ui, sans-serif';
const FONT_MONO    = '"JetBrains Mono", ui-monospace, monospace';

// ── Reusable: Batik-inspired ornament ──────────────────────────────────────
function BatikOrnament({ opacity = 1, y = 1620, scale = 1 }) {
  // Diamond-motif line-art inspired by RASA Bhayangkara cover
  const color = PALETTE.gold;
  const diamond = (cx) => (
    <g key={cx} transform={`translate(${cx} 0)`}>
      <path d={`M 0 0 L 60 60 L 0 120 L -60 60 Z`} fill="none" stroke={color} strokeWidth="1.2"/>
      <path d={`M -30 40 L 0 10 L 30 40 L 0 70 Z`} fill="none" stroke={color} strokeWidth="1"/>
      <path d={`M -30 80 L 0 50 L 30 80 L 0 110 Z`} fill="none" stroke={color} strokeWidth="1"/>
      <circle cx="0" cy="40" r="5" fill="none" stroke={color} strokeWidth="0.8"/>
      <circle cx="0" cy="80" r="5" fill="none" stroke={color} strokeWidth="0.8"/>
    </g>
  );
  const cols = [];
  for (let i = -1; i < 10; i++) cols.push(90 + i * 110);
  return (
    <svg
      viewBox="0 0 1080 220"
      width={1080 * scale}
      height={220 * scale}
      style={{
        position: 'absolute', left: 0, top: y, opacity,
        pointerEvents: 'none',
      }}
    >
      <g transform="translate(0 40)">
        {cols.map(cx => diamond(cx))}
      </g>
      <g transform="translate(55 160)" opacity="0.55">
        {cols.map(cx => diamond(cx))}
      </g>
    </svg>
  );
}

// ── Background layer ───────────────────────────────────────────────────────
function BackgroundLayer() {
  const t = useTime();
  // Subtle drift on the ornament
  const driftY = 1600 + Math.sin(t * 0.22) * 6;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(ellipse 90% 70% at 50% 35%, ${PALETTE.navyMid} 0%, ${PALETTE.navy} 45%, ${PALETTE.navyDeep} 100%)`,
    }}>
      {/* Fine noise overlay via SVG turbulence */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18, mixBlendMode: 'overlay' }}>
        <filter id="n">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix values="0 0 0 0 0.95  0 0 0 0 0.85  0 0 0 0 0.6  0 0 0 0.7 0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#n)"/>
      </svg>
      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 120% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)',
        pointerEvents: 'none',
      }}/>
      {/* Top ornament (flipped) */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: 'scaleY(-1)', opacity: 0.5 }}>
        <BatikOrnament opacity={0.4} y={0} scale={1} />
      </div>
      {/* Bottom ornament */}
      <BatikOrnament opacity={0.55} y={driftY} />
    </div>
  );
}

// ── Gold hairline divider with flourish ────────────────────────────────────
function GoldDivider({ x, y, width = 180, progress = 1 }) {
  const w = width * progress;
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width, height: 14, pointerEvents: 'none',
    }}>
      <svg width={width} height="14" viewBox={`0 0 ${width} 14`}>
        <line x1="0" y1="7" x2={w} y2="7" stroke={PALETTE.gold} strokeWidth="1" opacity="0.9"/>
        <circle cx={w/2} cy="7" r="2.2" fill={PALETTE.gold} opacity={progress}/>
        <circle cx={w/2 - 14} cy="7" r="1" fill={PALETTE.gold} opacity={progress * 0.7}/>
        <circle cx={w/2 + 14} cy="7" r="1" fill={PALETTE.gold} opacity={progress * 0.7}/>
      </svg>
    </div>
  );
}

// ── Brand mark (WM monogram + wordmark) ────────────────────────────────────
function BrandMark({ scale = 1, color = PALETTE.gold }) {
  const s = scale;
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 18 * s }}>
      <svg width={110 * s} height={110 * s} viewBox="0 0 110 110">
        {/* Outer diamond */}
        <path d="M 55 8 L 102 55 L 55 102 L 8 55 Z" fill="none" stroke={color} strokeWidth="1.2"/>
        {/* Inner diamond */}
        <path d="M 55 22 L 88 55 L 55 88 L 22 55 Z" fill="none" stroke={color} strokeWidth="1"/>
        {/* Tiny diamond dots */}
        <path d="M 55 38 L 72 55 L 55 72 L 38 55 Z" fill="none" stroke={color} strokeWidth="0.8"/>
        <circle cx="55" cy="55" r="3" fill={color}/>
        {/* M W letters */}
        <text x="55" y="60" textAnchor="middle" fontFamily={FONT_DISPLAY} fontStyle="italic" fontSize="22" fill={color} fontWeight="500" dy=".35em" opacity="0">MBG</text>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 1 — INTRO (0 → 3s)
// ═══════════════════════════════════════════════════════════════════════════
function IntroScene() {
  const { localTime, duration } = useSprite();

  // Mark progress
  const markProg = clamp(localTime / 0.9, 0, 1);
  const markEased = Easing.easeOutCubic(markProg);
  const markScale = 0.82 + markEased * 0.18;
  const markOpacity = markEased;

  // Divider progress
  const dvProg = clamp((localTime - 0.6) / 0.7, 0, 1);
  const dvEased = Easing.easeOutQuart(dvProg);

  // Wordmark
  const wmProg = clamp((localTime - 0.9) / 0.8, 0, 1);
  const wmEased = Easing.easeOutCubic(wmProg);
  const wmOpacity = wmEased;
  const wmTy = (1 - wmEased) * 18;

  // Tagline
  const tgProg = clamp((localTime - 1.4) / 0.7, 0, 1);
  const tgOpacity = Easing.easeOutCubic(tgProg);

  // Whole scene exits
  const exitStart = duration - 0.6;
  const exitT = localTime > exitStart ? Easing.easeInCubic(clamp((localTime - exitStart)/0.6, 0, 1)) : 0;
  const exitOp = 1 - exitT;
  const exitScale = 1 + exitT * 0.04;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: exitOp,
      transform: `scale(${exitScale})`,
      transformOrigin: '50% 50%',
    }}>
      {/* Diamond mark */}
      <div style={{
        opacity: markOpacity,
        transform: `scale(${markScale})`,
        transformOrigin: 'center',
        marginBottom: 40,
      }}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <path d="M 90 14 L 166 90 L 90 166 L 14 90 Z" fill="none" stroke={PALETTE.gold} strokeWidth="1.4"/>
          <path d="M 90 34 L 146 90 L 90 146 L 34 90 Z" fill="none" stroke={PALETTE.gold} strokeWidth="1.1" opacity="0.85"/>
          <path d="M 90 54 L 126 90 L 90 126 L 54 90 Z" fill="none" stroke={PALETTE.gold} strokeWidth="0.9" opacity="0.7"/>
          <circle cx="90" cy="90" r="4" fill={PALETTE.gold}/>
          {/* small corner flourishes */}
          <circle cx="90" cy="14" r="2" fill={PALETTE.gold}/>
          <circle cx="166" cy="90" r="2" fill={PALETTE.gold}/>
          <circle cx="90" cy="166" r="2" fill={PALETTE.gold}/>
          <circle cx="14" cy="90" r="2" fill={PALETTE.gold}/>
        </svg>
      </div>

      {/* Divider */}
      <div style={{ height: 14, marginBottom: 22, opacity: dvEased }}>
        <svg width="220" height="14" viewBox="0 0 220 14">
          <line x1="0" y1="7" x2={220 * dvEased} y2="7" stroke={PALETTE.gold} strokeWidth="1"/>
          <circle cx="110" cy="7" r="2.4" fill={PALETTE.gold} opacity={dvEased}/>
        </svg>
      </div>

      {/* Wordmark */}
      <div style={{
        opacity: wmOpacity,
        transform: `translateY(${wmTy}px)`,
        textAlign: 'center',
        color: PALETTE.cream,
      }}>
        <div style={{
          fontFamily: FONT_SANS,
          fontSize: 22,
          letterSpacing: '0.48em',
          fontWeight: 400,
          color: PALETTE.goldLight,
          textTransform: 'uppercase',
          marginBottom: 16,
          paddingLeft: '0.48em',
        }}>
          Warung
        </div>
        <div style={{
          fontFamily: FONT_DISPLAY,
          fontStyle: 'italic',
          fontSize: 128,
          fontWeight: 500,
          color: PALETTE.cream,
          letterSpacing: '0.005em',
          lineHeight: 1,
          marginBottom: 18,
          whiteSpace: 'nowrap',
        }}>
          Menu MBG
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        opacity: tgOpacity,
        fontFamily: FONT_SANS,
        fontSize: 18,
        letterSpacing: '0.38em',
        color: PALETTE.goldLight,
        textTransform: 'uppercase',
        marginTop: 6,
        paddingLeft: '0.38em',
      }}>
        Menu Pilihan Hari Ini
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SCENE — MENU SEQUENCE (one per menu, ~13s)
// ═══════════════════════════════════════════════════════════════════════════
//
// Sub-beats (relative to sequence start):
//   0.0 – 3.2s  HERO: photo ken-burns + menu name fades in
//   3.2 – 6.2s  DESCRIPTION: name stays, description fades in below
//   6.2 – 9.4s  KOMPONEN: 4 items (karbo/protein/sayur/buah) with icons
//   9.4 – 13.0s GIZI: 4 items (energi/protein/lemak/karbo) with icons
//
function MenuSequence({ menu, index }) {
  const { localTime, duration } = useSprite();

  // ── Camera / hero image: ken burns throughout
  const heroScale = 1.04 + Math.min(localTime / duration, 1) * 0.12;
  const heroTx = Math.sin(localTime * 0.18) * 10;
  const heroTy = -Math.min(localTime / duration, 1) * 30;

  // Global entry fade-in for whole sequence
  const seqIn = Easing.easeOutCubic(clamp(localTime / 0.7, 0, 1));
  const seqOut = localTime > duration - 0.7
    ? Easing.easeInCubic(clamp((localTime - (duration - 0.7)) / 0.7, 0, 1))
    : 0;
  const seqOpacity = seqIn * (1 - seqOut);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      opacity: seqOpacity,
    }}>
      {/* Hero photo, upper half */}
      <HeroPhoto
        src={menu.image}
        scale={heroScale}
        tx={heroTx}
        ty={heroTy}
        localTime={localTime}
      />

      {/* Menu number tag — top right */}
      <MenuNumberTag index={index} localTime={localTime} />

      {/* Menu name + cursive label — appears early, persists */}
      <MenuNameBlock
        menu={menu}
        localTime={localTime}
      />

      {/* Description — 3.2s..6.2s  (stays visible afterwards too) */}
      <Sprite start={3.0} end={duration - 0.2}>
        <DescriptionBlock menu={menu} />
      </Sprite>

      {/* Komponen list — 6.2s..9.4s */}
      <Sprite start={6.0} end={duration - 0.2}>
        <KomponenBlock menu={menu} />
      </Sprite>

      {/* Gizi list — 9.4s..end */}
      <Sprite start={9.4} end={duration - 0.2}>
        <GiziBlock menu={menu} />
      </Sprite>
    </div>
  );
}

// ── Hero photo (upper ~55% of frame, feathered bottom) ─────────────────────
function HeroPhoto({ src, scale, tx, ty, localTime }) {
  const entryT = Easing.easeOutCubic(clamp(localTime / 1.0, 0, 1));
  const opacity = entryT;
  return (
    <div style={{
      position: 'absolute',
      left: 0, top: 0,
      width: W, height: 1080,
      overflow: 'hidden',
      opacity,
    }}>
      <img
        src={src}
        alt=""
        style={{
          position: 'absolute', left: '50%', top: '50%',
          width: W * 1.1,
          height: 1080 * 1.15,
          objectFit: 'cover',
          transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${scale})`,
          transformOrigin: 'center',
          filter: 'saturate(1.05) contrast(1.02)',
        }}
      />
      {/* Top gradient for legibility of number tag */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to bottom,
          rgba(8, 20, 48, 0.55) 0%,
          rgba(8, 20, 48, 0.0) 22%,
          rgba(8, 20, 48, 0.0) 55%,
          rgba(8, 20, 48, 0.72) 82%,
          rgba(8, 20, 48, 1) 100%)`,
        pointerEvents: 'none',
      }}/>
      {/* Soft side gradients */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(8,20,48,0.35) 0%, transparent 15%, transparent 85%, rgba(8,20,48,0.35) 100%)',
      }}/>
    </div>
  );
}

// ── Menu number "01 / 02" tag in top-right ─────────────────────────────────
function MenuNumberTag({ index, localTime }) {
  const p = Easing.easeOutCubic(clamp((localTime - 0.4) / 0.8, 0, 1));
  return (
    <div style={{
      position: 'absolute', right: 60, top: 90,
      opacity: p,
      transform: `translateY(${(1 - p) * -12}px)`,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
      color: PALETTE.goldLight,
    }}>
      <div style={{
        fontFamily: FONT_SANS,
        fontSize: 13,
        letterSpacing: '0.4em',
        textTransform: 'uppercase',
        opacity: 0.8,
        paddingLeft: '0.4em',
      }}>
        Menu Spesial
      </div>
      <div style={{ height: 1, width: 70, background: PALETTE.gold, opacity: 0.5, margin: '10px 0 8px' }}/>
      <div style={{
        fontFamily: FONT_DISPLAY,
        fontStyle: 'italic',
        fontSize: 56,
        fontWeight: 500,
        lineHeight: 1,
        color: PALETTE.goldLight,
      }}>
        {String(index + 1).padStart(2, '0')}<span style={{ opacity: 0.4, fontSize: 36 }}> / 02</span>
      </div>
    </div>
  );
}

// ── Corner logo (circular placeholder, top-left, persistent) ───────────────
// Meant to house a brand circle — shows a gold ring with an initial monogram
// and a small "WMM" wordmark arc, giving a logo-pill vibe you can swap later.
function CornerLogo({ brand = 'Warung Menu MBG', monogram = 'WM' }) {
  const t = useTime();
  // Slow, subtle breathing so it feels alive
  const pulse = 1 + Math.sin(t * 0.8) * 0.015;
  return (
    <div style={{
      position: 'absolute',
      left: 50, top: 60,
      width: 140, height: 140,
      zIndex: 20,
      pointerEvents: 'none',
    }}>
      <div style={{
        width: '100%', height: '100%',
        transform: `scale(${pulse})`,
        transformOrigin: 'center',
        borderRadius: '50%',
        background: 'rgba(8, 20, 48, 0.55)',
        border: `1px solid ${PALETTE.goldSoft}`,
        boxShadow: `0 0 0 6px rgba(13, 27, 61, 0.35),
                    0 8px 32px rgba(0, 0, 0, 0.4),
                    inset 0 0 0 1px rgba(212, 162, 74, 0.18)`,
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        {/* Inner decorative ring */}
        <svg width="140" height="140" viewBox="0 0 140 140" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <path id="cornerArc" d="M 30 70 A 40 40 0 0 1 110 70" fill="none"/>
            <path id="cornerArcBottom" d="M 30 70 A 40 40 0 0 0 110 70" fill="none"/>
          </defs>
          {/* Outer dashed ring */}
          <circle cx="70" cy="70" r="56" fill="none" stroke={PALETTE.gold} strokeWidth="0.8" strokeDasharray="2 3" opacity="0.55"/>
          {/* Inner thin ring */}
          <circle cx="70" cy="70" r="46" fill="none" stroke={PALETTE.gold} strokeWidth="0.6" opacity="0.65"/>
          {/* Top arc text */}
          <text fill={PALETTE.goldLight} fontFamily={FONT_SANS} fontSize="8" letterSpacing="4">
            <textPath href="#cornerArc" startOffset="50%" textAnchor="middle">WARUNG · MBG</textPath>
          </text>
          {/* Bottom arc text */}
          <text fill={PALETTE.goldLight} fontFamily={FONT_SANS} fontSize="7" letterSpacing="3" opacity="0.7">
            <textPath href="#cornerArcBottom" startOffset="50%" textAnchor="middle">· EST · NUSANTARA ·</textPath>
          </text>
          {/* Diamond centerpiece */}
          <g transform="translate(70 70)">
            <path d="M 0 -16 L 16 0 L 0 16 L -16 0 Z" fill="none" stroke={PALETTE.gold} strokeWidth="1"/>
            <path d="M 0 -9 L 9 0 L 0 9 L -9 0 Z" fill="none" stroke={PALETTE.gold} strokeWidth="0.7" opacity="0.7"/>
            <circle cx="0" cy="0" r="1.5" fill={PALETTE.gold}/>
          </g>
        </svg>

        {/* Monogram overlay — italic script initials below the diamond */}
        <div style={{
          position: 'absolute',
          bottom: 22,
          left: 0, right: 0,
          textAlign: 'center',
          fontFamily: FONT_DISPLAY,
          fontStyle: 'italic',
          fontSize: 16,
          color: PALETTE.cream,
          fontWeight: 500,
          letterSpacing: '0.02em',
        }}>
          {monogram}
        </div>
      </div>
    </div>
  );
}

// ── Menu name block — "Special Menu" label + large italic name ─────────────
function MenuNameBlock({ menu, localTime }) {
  // Fade in around 1.4s
  const labelP = Easing.easeOutCubic(clamp((localTime - 1.0) / 0.6, 0, 1));
  const divP   = Easing.easeOutQuart(clamp((localTime - 1.3) / 0.8, 0, 1));
  const nameP  = Easing.easeOutCubic(clamp((localTime - 1.6) / 0.9, 0, 1));
  const subP   = Easing.easeOutCubic(clamp((localTime - 2.0) / 0.7, 0, 1));

  const kicker = menu.origin ? `Khas ${menu.origin}` : 'Hidangan';

  return (
    <div style={{
      position: 'absolute',
      left: 0, right: 0,
      top: 940,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center',
      padding: '0 70px',
    }}>
      {/* Kicker — "Khas [Daerah]" */}
      <div style={{
        opacity: labelP,
        transform: `translateY(${(1 - labelP) * 8}px)`,
        fontFamily: FONT_SANS,
        fontSize: 14,
        letterSpacing: '0.48em',
        color: PALETTE.goldLight,
        textTransform: 'uppercase',
        paddingLeft: '0.48em',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        {/* Small pin-marker icon */}
        <svg width="12" height="14" viewBox="0 0 12 14" style={{ opacity: 0.8 }}>
          <path d="M6 1 C 3 1 1 3 1 5.5 C 1 8.5 6 13 6 13 C 6 13 11 8.5 11 5.5 C 11 3 9 1 6 1 Z" fill="none" stroke={PALETTE.goldLight} strokeWidth="0.8"/>
          <circle cx="6" cy="5.5" r="1.5" fill={PALETTE.goldLight}/>
        </svg>
        <span>{kicker}</span>
      </div>

      {/* Divider flourish */}
      <div style={{ height: 16, margin: '18px 0 14px', opacity: divP }}>
        <svg width="160" height="16" viewBox="0 0 160 16">
          <line x1="0" y1="8" x2={160 * divP} y2="8" stroke={PALETTE.gold} strokeWidth="1"/>
          <circle cx="80" cy="8" r="2.2" fill={PALETTE.gold} opacity={divP}/>
          <circle cx="60" cy="8" r="1" fill={PALETTE.gold} opacity={divP * 0.6}/>
          <circle cx="100" cy="8" r="1" fill={PALETTE.gold} opacity={divP * 0.6}/>
        </svg>
      </div>

      {/* Big italic name */}
      <div style={{
        opacity: nameP,
        transform: `translateY(${(1 - nameP) * 16}px)`,
        fontFamily: FONT_DISPLAY,
        fontStyle: 'italic',
        fontSize: menu.name.length > 22 ? 88 : 108,
        lineHeight: 1.02,
        fontWeight: 500,
        color: PALETTE.cream,
        letterSpacing: '0.002em',
        textWrap: 'balance',
        maxWidth: 940,
      }}>
        {menu.name}
      </div>

      {/* Indonesian subtitle */}
      {menu.subtitle && (
        <div style={{
          opacity: subP,
          transform: `translateY(${(1 - subP) * 10}px)`,
          marginTop: 22,
          fontFamily: FONT_SANS,
          fontSize: 18,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: PALETTE.goldLight,
          paddingLeft: '0.32em',
        }}>
          {menu.subtitle}
        </div>
      )}
    </div>
  );
}

// ── Description block — serif italic description under menu name ───────────
function DescriptionBlock({ menu }) {
  const { localTime } = useSprite();
  const p = Easing.easeOutCubic(clamp(localTime / 0.9, 0, 1));
  return (
    <div style={{
      position: 'absolute',
      left: 120, right: 120, top: 1310,
      textAlign: 'center',
      opacity: p,
      transform: `translateY(${(1 - p) * 18}px)`,
      fontFamily: FONT_SERIF,
      fontStyle: 'italic',
      fontSize: 30,
      lineHeight: 1.4,
      color: PALETTE.creamDim,
      letterSpacing: '0.005em',
    }}>
      <span style={{ color: PALETTE.gold, fontSize: 40, lineHeight: 0, verticalAlign: '-0.3em', marginRight: 4 }}>“</span>
      {menu.description}
      <span style={{ color: PALETTE.gold, fontSize: 40, lineHeight: 0, verticalAlign: '-0.3em', marginLeft: 4 }}>”</span>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────
// Single-weight line icons in gold. 64×64 viewBox.

const ICON_STROKE = { fill: 'none', stroke: PALETTE.gold, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

function Icon({ name, size = 56 }) {
  const P = { ...ICON_STROKE, stroke: PALETTE.goldLight };
  switch (name) {
    case 'karbo': // rice bowl
      return (
        <svg width={size} height={size} viewBox="0 0 64 64">
          <path d="M10 30 h44 a4 4 0 0 1 -1 3 l-5 18 a4 4 0 0 1 -4 3 H20 a4 4 0 0 1 -4 -3 l-5 -18 a4 4 0 0 1 -1 -3 z" {...P}/>
          <path d="M18 30 q3 -6 8 -6 q2 -5 8 -5 q6 0 8 5 q5 0 8 6" {...P}/>
          <circle cx="24" cy="26" r="1.2" fill={PALETTE.goldLight}/>
          <circle cx="32" cy="23" r="1.2" fill={PALETTE.goldLight}/>
          <circle cx="40" cy="26" r="1.2" fill={PALETTE.goldLight}/>
        </svg>
      );
    case 'protein': // drumstick
      return (
        <svg width={size} height={size} viewBox="0 0 64 64">
          <path d="M20 20 a12 12 0 1 1 14 14 l-4 4 l-6 -2 l-2 -6 l4 -4 a12 12 0 0 1 -6 -6 z" {...P}/>
          <path d="M26 34 l-10 10" {...P}/>
          <path d="M22 38 l-6 0 l0 6" {...P}/>
        </svg>
      );
    case 'sayur': // leaf
      return (
        <svg width={size} height={size} viewBox="0 0 64 64">
          <path d="M12 52 C 12 32 24 14 52 12 C 52 36 40 52 12 52 z" {...P}/>
          <path d="M12 52 L 42 22" {...P}/>
          <path d="M22 42 L 30 38" {...P}/>
          <path d="M26 46 L 34 42" {...P}/>
        </svg>
      );
    case 'buah': // apple/fruit
      return (
        <svg width={size} height={size} viewBox="0 0 64 64">
          <path d="M32 20 C 22 18 12 24 14 38 C 16 50 26 54 32 54 C 38 54 48 50 50 38 C 52 24 42 18 32 20 z" {...P}/>
          <path d="M32 20 q -2 -6 -6 -8" {...P}/>
          <path d="M34 16 q 4 -4 10 -4 q -2 6 -8 8" {...P}/>
        </svg>
      );

    // Gizi icons
    case 'energi': // flame/spark
      return (
        <svg width={size} height={size} viewBox="0 0 64 64">
          <path d="M32 10 q 4 10 10 14 q 8 5 8 16 a 18 18 0 1 1 -36 0 q 0 -10 6 -14 q 6 -4 6 -10 q 0 4 3 4 q 3 0 3 -10 z" {...P}/>
          <path d="M32 36 q -4 4 -4 10 a 4 4 0 0 0 8 0 q 0 -6 -4 -10 z" {...P}/>
        </svg>
      );
    case 'protein-gizi': // atom / dna
      return (
        <svg width={size} height={size} viewBox="0 0 64 64">
          <ellipse cx="32" cy="32" rx="22" ry="10" {...P}/>
          <ellipse cx="32" cy="32" rx="22" ry="10" transform="rotate(60 32 32)" {...P}/>
          <ellipse cx="32" cy="32" rx="22" ry="10" transform="rotate(-60 32 32)" {...P}/>
          <circle cx="32" cy="32" r="3" fill={PALETTE.goldLight}/>
        </svg>
      );
    case 'lemak': // droplet
      return (
        <svg width={size} height={size} viewBox="0 0 64 64">
          <path d="M32 10 C 44 24 52 34 52 42 a 20 20 0 1 1 -40 0 C 12 34 20 24 32 10 z" {...P}/>
          <path d="M24 42 a 8 8 0 0 0 8 8" {...P}/>
        </svg>
      );
    case 'karbo-gizi': // wheat
      return (
        <svg width={size} height={size} viewBox="0 0 64 64">
          <path d="M32 10 L 32 54" {...P}/>
          <path d="M32 16 q -8 2 -10 8 q 8 -2 10 -8 z" {...P}/>
          <path d="M32 16 q 8 2 10 8 q -8 -2 -10 -8 z" {...P}/>
          <path d="M32 26 q -8 2 -10 8 q 8 -2 10 -8 z" {...P}/>
          <path d="M32 26 q 8 2 10 8 q -8 -2 -10 -8 z" {...P}/>
          <path d="M32 36 q -8 2 -10 8 q 8 -2 10 -8 z" {...P}/>
          <path d="M32 36 q 8 2 10 8 q -8 -2 -10 -8 z" {...P}/>
        </svg>
      );
    default:
      return null;
  }
}

// ── Komponen block ─────────────────────────────────────────────────────────
function KomponenBlock({ menu }) {
  const { localTime } = useSprite();
  const items = menu.komponen; // [{icon, label, value}]

  // Container fade
  const frameP = Easing.easeOutCubic(clamp(localTime / 0.6, 0, 1));

  return (
    <div style={{
      position: 'absolute',
      left: 90, right: 90, top: 1500,
      opacity: frameP,
      transform: `translateY(${(1 - frameP) * 14}px)`,
    }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 24 }}>
        <div style={{ flex: 1, height: 1, background: PALETTE.goldSoft }}/>
        <div style={{
          fontFamily: FONT_SANS, fontSize: 14, letterSpacing: '0.45em', textTransform: 'uppercase',
          color: PALETTE.goldLight, whiteSpace: 'nowrap', paddingLeft: '0.45em',
        }}>
          Komponen Menu
        </div>
        <div style={{ flex: 1, height: 1, background: PALETTE.goldSoft }}/>
      </div>

      {/* 4-column row of items */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 6,
      }}>
        {items.map((it, i) => {
          const start = 0.6 + i * 0.18;
          const p = Easing.easeOutCubic(clamp((localTime - start) / 0.55, 0, 1));
          return (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
              opacity: p,
              transform: `translateY(${(1 - p) * 16}px)`,
            }}>
              <div style={{ marginBottom: 14 }}>
                <Icon name={it.icon} size={60} />
              </div>
              <div style={{
                fontFamily: FONT_SANS, fontSize: 11, letterSpacing: '0.3em',
                textTransform: 'uppercase', color: PALETTE.goldLight, opacity: 0.85,
                marginBottom: 8, paddingLeft: '0.3em',
              }}>
                {it.label}
              </div>
              <div style={{
                fontFamily: FONT_SERIF, fontStyle: 'italic', fontSize: 22,
                color: PALETTE.cream, lineHeight: 1.2, textWrap: 'balance',
              }}>
                {it.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Gizi block ─────────────────────────────────────────────────────────────
function GiziBlock({ menu }) {
  const { localTime } = useSprite();
  const items = menu.gizi; // [{icon, label, value, unit}]

  const frameP = Easing.easeOutCubic(clamp(localTime / 0.6, 0, 1));

  return (
    <div style={{
      position: 'absolute',
      left: 90, right: 90, top: 1750,
      opacity: frameP,
      transform: `translateY(${(1 - frameP) * 14}px)`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 6 }}>
        <div style={{ flex: 1, height: 1, background: PALETTE.goldSoft }}/>
        <div style={{
          fontFamily: FONT_SANS, fontSize: 14, letterSpacing: '0.45em', textTransform: 'uppercase',
          color: PALETTE.goldLight, whiteSpace: 'nowrap', paddingLeft: '0.45em',
        }}>
          Kandungan Gizi / Sajian
        </div>
        <div style={{ flex: 1, height: 1, background: PALETTE.goldSoft }}/>
      </div>
    </div>
  );
}

// The Gizi row is actually placed below Komponen — rebuild as a bigger combined
// block that fits within canvas H=1920. We actually use the version below:

function GiziRow({ menu }) {
  const { localTime } = useSprite();
  const items = menu.gizi;
  const frameP = Easing.easeOutCubic(clamp(localTime / 0.5, 0, 1));

  return (
    <div style={{
      position: 'absolute',
      left: 90, right: 90, top: 1730,
      opacity: frameP,
      transform: `translateY(${(1 - frameP) * 12}px)`,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: PALETTE.goldSoft }}/>
        <div style={{
          fontFamily: FONT_SANS, fontSize: 13, letterSpacing: '0.45em', textTransform: 'uppercase',
          color: PALETTE.goldLight, whiteSpace: 'nowrap', paddingLeft: '0.45em',
        }}>
          Kandungan Gizi per Sajian
        </div>
        <div style={{ flex: 1, height: 1, background: PALETTE.goldSoft }}/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {items.map((it, i) => {
          const start = 0.45 + i * 0.15;
          const p = Easing.easeOutCubic(clamp((localTime - start) / 0.5, 0, 1));
          return (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
              opacity: p,
              transform: `translateY(${(1 - p) * 12}px)`,
              padding: '4px 0',
            }}>
              <div style={{ marginBottom: 10 }}>
                <Icon name={it.icon} size={46} />
              </div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontSize: 38, fontWeight: 500,
                color: PALETTE.cream, lineHeight: 1, marginBottom: 4,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {it.value}
              </div>
              <div style={{
                fontFamily: FONT_SANS, fontSize: 10, letterSpacing: '0.02em',
                color: PALETTE.creamDim, marginBottom: 6,
              }}>
                {it.unit}
              </div>
              <div style={{
                fontFamily: FONT_SANS, fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase',
                color: PALETTE.goldLight, paddingLeft: '0.28em',
              }}>
                {it.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── LocalSprite: re-emits a SpriteContext with custom localTime/duration ───
// Useful when you want child components that use useSprite() to see a
// nested/relative time (e.g. inside an outer MenuSequence sprite).
function LocalSprite({ localTime, duration, children }) {
  const progress = duration > 0 ? clamp(localTime / duration, 0, 1) : 0;
  const value = React.useMemo(
    () => ({ localTime, duration, progress, visible: true }),
    [localTime, duration, progress]
  );
  return (
    <SpriteContext.Provider value={value}>
      {children}
    </SpriteContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Replacement MenuSequence that uses GiziRow (cleaner layout)
// ═══════════════════════════════════════════════════════════════════════════
function MenuSequenceV2({ menu, index }) {
  const { localTime, duration } = useSprite();

  const heroScale = 1.04 + Math.min(localTime / duration, 1) * 0.12;
  const heroTx = Math.sin(localTime * 0.18) * 8;
  const heroTy = -Math.min(localTime / duration, 1) * 22;

  const seqIn = Easing.easeOutCubic(clamp(localTime / 0.7, 0, 1));
  const seqOut = localTime > duration - 0.7
    ? Easing.easeInCubic(clamp((localTime - (duration - 0.7)) / 0.7, 0, 1))
    : 0;
  const seqOpacity = seqIn * (1 - seqOut);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      opacity: seqOpacity,
    }}>
      <HeroPhoto src={menu.image} scale={heroScale} tx={heroTx} ty={heroTy} localTime={localTime} />
      <MenuNumberTag index={index} localTime={localTime} />
      <MenuNameBlock menu={menu} localTime={localTime} />

      {localTime >= 3.2 && localTime <= duration - 0.2 && (
        <LocalSprite localTime={localTime - 3.2} duration={(duration - 0.2) - 3.2}>
          <DescriptionBlock menu={menu} />
        </LocalSprite>
      )}

      {localTime >= 6.0 && localTime <= duration - 0.2 && (
        <LocalSprite localTime={localTime - 6.0} duration={(duration - 0.2) - 6.0}>
          <KomponenBlock menu={menu} />
        </LocalSprite>
      )}

      {localTime >= 9.2 && localTime <= duration - 0.2 && (
        <LocalSprite localTime={localTime - 9.2} duration={(duration - 0.2) - 9.2}>
          <GiziRow menu={menu} />
        </LocalSprite>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// OUTRO (final 3s)
// ═══════════════════════════════════════════════════════════════════════════
function OutroScene() {
  const { localTime, duration } = useSprite();

  const inP = Easing.easeOutCubic(clamp(localTime / 0.7, 0, 1));
  const dvP = Easing.easeOutQuart(clamp((localTime - 0.4) / 0.6, 0, 1));
  const wmP = Easing.easeOutCubic(clamp((localTime - 0.6) / 0.7, 0, 1));
  const tgP = Easing.easeOutCubic(clamp((localTime - 1.0) / 0.8, 0, 1));

  const exitStart = duration - 0.5;
  const exitT = localTime > exitStart ? Easing.easeInCubic(clamp((localTime - exitStart)/0.5, 0, 1)) : 0;
  const exitOp = 1 - exitT;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: exitOp,
      padding: '0 90px',
      textAlign: 'center',
    }}>
      {/* Mark */}
      <div style={{ opacity: inP, marginBottom: 44, transform: `scale(${0.88 + inP * 0.12})` }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          <path d="M 70 10 L 130 70 L 70 130 L 10 70 Z" fill="none" stroke={PALETTE.gold} strokeWidth="1.2"/>
          <path d="M 70 30 L 110 70 L 70 110 L 30 70 Z" fill="none" stroke={PALETTE.gold} strokeWidth="1" opacity="0.75"/>
          <circle cx="70" cy="70" r="3" fill={PALETTE.gold}/>
        </svg>
      </div>

      {/* Wordmark */}
      <div style={{
        opacity: wmP,
        transform: `translateY(${(1 - wmP) * 14}px)`,
        textAlign: 'center',
        marginBottom: 30,
      }}>
        <div style={{
          fontFamily: FONT_SANS, fontSize: 18, letterSpacing: '0.48em',
          color: PALETTE.goldLight, textTransform: 'uppercase', marginBottom: 14,
          paddingLeft: '0.48em',
        }}>
          Warung
        </div>
        <div style={{
          fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: 104,
          color: PALETTE.cream, fontWeight: 500, lineHeight: 1,
          whiteSpace: 'nowrap',
        }}>
          Menu MBG
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 16, marginBottom: 30, opacity: dvP }}>
        <svg width="220" height="16" viewBox="0 0 220 16">
          <line x1="0" y1="8" x2={220 * dvP} y2="8" stroke={PALETTE.gold} strokeWidth="1"/>
          <circle cx="110" cy="8" r="2.4" fill={PALETTE.gold} opacity={dvP}/>
          <circle cx="90" cy="8" r="1" fill={PALETTE.gold} opacity={dvP * 0.6}/>
          <circle cx="130" cy="8" r="1" fill={PALETTE.gold} opacity={dvP * 0.6}/>
        </svg>
      </div>

      {/* Italic tagline */}
      <div style={{
        opacity: tgP,
        transform: `translateY(${(1 - tgP) * 12}px)`,
        fontFamily: FONT_DISPLAY,
        fontStyle: 'italic',
        fontSize: 52,
        fontWeight: 500,
        color: PALETTE.goldLight,
        lineHeight: 1.25,
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}>
        Gizi Seimbang,<br/>Rasa Nusantara.
      </div>
    </div>
  );
}

// Expose
Object.assign(window, {
  PALETTE, W, H,
  FONT_DISPLAY, FONT_SERIF, FONT_SANS, FONT_MONO,
  BackgroundLayer, IntroScene, OutroScene,
  MenuSequence: MenuSequenceV2,
  HeroPhoto, MenuNameBlock, DescriptionBlock, KomponenBlock, GiziRow,
  MenuNumberTag, BrandMark, Icon, BatikOrnament, CornerLogo, LocalSprite,
});
