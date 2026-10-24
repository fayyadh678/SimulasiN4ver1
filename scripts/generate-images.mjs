// Generates the 25 vector illustrations required by the V2 spec:
//   public/images/stories/s1.svg ... s5.svg   (4 panels each)
//   public/images/matching/m1-a.svg ... m5-d.svg
// Run: node scripts/generate-images.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT_STORIES = join("public", "images", "stories");
const OUT_MATCHING = join("public", "images", "matching");
mkdirSync(OUT_STORIES, { recursive: true });
mkdirSync(OUT_MATCHING, { recursive: true });

const C = {
  ink: "#0F172A",
  skin: "#F3C9A8",
  skinAlt: "#E8B48D",
  hair: "#1F2937",
  blue: "#2563EB",
  blueMid: "#60A5FA",
  blueLight: "#DBEAFE",
  bluePale: "#EFF6FF",
  green: "#16A34A",
  greenLight: "#BBF7D0",
  greenMid: "#86EFAC",
  red: "#DC2626",
  redLight: "#FECACA",
  yellow: "#F59E0B",
  yellowLight: "#FDE68A",
  gray: "#E2E8F0",
  grayMid: "#94A3B8",
  grayDark: "#475569",
  white: "#FFFFFF",
  floor: "#E2E8F0",
};

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">\n${body}\n</svg>\n`;

const panel = (index, inner, w = 240) => `
  <g transform="translate(${index * w} 0)">
    <rect x="6" y="6" width="${w - 12}" height="288" rx="10" fill="#FFFFFF" stroke="${C.gray}" stroke-width="1.5"/>
    <text x="20" y="32" font-family="Inter, system-ui, sans-serif" font-size="13" font-weight="700" fill="${C.grayMid}">${index + 1}</text>
    ${inner}
  </g>`;

const floor = (x1 = 14, x2 = 226, y = 252) =>
  `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${C.floor}" stroke-width="2.5" stroke-linecap="round"/>`;

/**
 * Simple, consistent vector person.
 * Local origin = point between the feet.
 */
const figure = ({
  x,
  feet = 250,
  s = 1,
  shirt = C.blueLight,
  shirtStroke = C.ink,
  pants = "#334155",
  skin = C.skin,
  hair = C.hair,
  hairStyle = "short",
  skirt = null,
  hat = null,
  cap = null,
  leftHand = [-26, -72],
  rightHand = [26, -72],
  legs = "stand",
  smile = true,
  sleeves = true,
}) => {
  const armStrokes = sleeves ? shirt : skin;
  const legStrokes = skirt ? skin : pants;
  const legPaths = {
    stand: [
      [-9, -64, -11, -8],
      [9, -64, 11, -8],
    ],
    walk: [
          [-9, -64, -16, -8],
          [9, -64, 15, -8],
    ],
    run: [
      [-9, -64, -30, -16],
      [9, -64, 26, -8],
    ],
    sit: [
      [-9, -64, -16, -36],
      [9, -64, 16, -36],
    ],
  }[legs];

  const headY = -132;
  const hairCap = `<path d="M -18.5 -132 a 18.5 18.5 0 0 1 37 0 z" fill="${hair}"/>`;
  const hairLong = `${hairCap}<path d="M -18 -132 q -7 34 -9 48 l 11 0 q 3 -24 7 -42 z" fill="${hair}"/><path d="M 18 -132 q 7 34 9 48 l -11 0 q -3 -24 -7 -42 z" fill="${hair}"/>`;
  const hairPonytail = `${hairCap}<circle cx="18" cy="-136" r="7" fill="${hair}"/><path d="M 20 -134 q 16 6 14 30 q -6 -12 -16 -16 z" fill="${hair}"/>`;
  const hairBun = `${hairCap}<circle cx="0" cy="-154" r="8" fill="${hair}"/>`;
  const hairStyles = { short: hairCap, long: hairLong, ponytail: hairPonytail, bun: hairBun, none: "" };
  const hatMarkup = hat
    ? `<path d="M -19 -138 a 19 19 0 0 1 38 0 z" fill="${hat}"/><rect x="-25" y="-141" width="50" height="6" rx="3" fill="${hat}"/>`
      : cap
        ? `<path d="M -18.5 -136 a 18.5 18.5 0 0 1 37 0 z" fill="${cap}"/><path d="M 10 -136 q 22 2 22 8 l -24 0 z" fill="${cap}"/>`
        : "";

  return `
  <g transform="translate(${x} ${feet}) scale(${s})">
    <g stroke="${C.ink}" stroke-width="9" stroke-linecap="round" fill="none">
      <line x1="${legPaths[0][0]}" y1="${legPaths[0][1]}" x2="${legPaths[0][2]}" y2="${legPaths[0][3]}" stroke="${legStrokes}"/>
      <line x1="${legPaths[1][0]}" y1="${legPaths[1][1]}" x2="${legPaths[1][2]}" y2="${legPaths[1][3]}" stroke="${legStrokes}"/>
    </g>
    <g stroke="${C.ink}" stroke-width="2" stroke-linecap="round">
      <line x1="${legPaths[0][2] - 7}" y1="-6" x2="${legPaths[0][2] + 4}" y2="-6" stroke="${legStrokes}" stroke-width="8"/>
      <line x1="${legPaths[1][2] - 4}" y1="-6" x2="${legPaths[1][2] + 7}" y2="-6" stroke="${legStrokes}" stroke-width="8"/>
    </g>
    <g stroke="${armStrokes}" stroke-width="9" stroke-linecap="round" fill="none">
      <line x1="-18" y1="-110" x2="${leftHand[0]}" y2="${leftHand[1]}"/>
      <line x1="18" y1="-110" x2="${rightHand[0]}" y2="${rightHand[1]}"/>
    </g>
    <circle cx="${leftHand[0]}" cy="${leftHand[1]}" r="5" fill="${skin}" stroke="${C.ink}" stroke-width="1.5"/>
    <circle cx="${rightHand[0]}" cy="${rightHand[1]}" r="5" fill="${skin}" stroke="${C.ink}" stroke-width="1.5"/>
    <rect x="-20" y="-116" width="40" height="54" rx="14" fill="${shirt}" stroke="${shirtStroke}" stroke-width="2"/>
    ${skirt ? `<path d="M -20 -72 L 20 -72 L 29 -36 L -29 -36 Z" fill="${skirt}" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/>` : ""}
    <circle cx="0" cy="${headY}" r="18" fill="${skin}" stroke="${C.ink}" stroke-width="2"/>
    ${hairStyles[hairStyle] ?? hairCap}
    ${hatMarkup}
    <circle cx="-6" cy="${headY + 2}" r="2" fill="${C.ink}"/>
    <circle cx="6" cy="${headY + 2}" r="2" fill="${C.ink}"/>
    ${smile ? `<path d="M -5 -125 q 5 5 10 0" fill="none" stroke="${C.ink}" stroke-width="1.8" stroke-linecap="round"/>` : ""}
  </g>`;
};

const dog = ({ x, y, s = 1, running = false, flip = false }) => `
  <g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
    <g stroke="${C.ink}" stroke-width="2" fill="none" stroke-linecap="round">
      ${
        running
          ? `<path d="M -20 6 L -34 28 M -6 8 L -6 30 M 12 8 L 12 30 M 26 4 L 40 26" stroke="#B45309" stroke-width="7"/>`
          : `<path d="M -20 8 L -22 30 M -6 10 L -6 30 M 12 10 L 12 30 M 24 8 L 26 30" stroke="#B45309" stroke-width="7"/>`
      }
      <ellipse cx="0" cy="0" rx="30" ry="17" fill="#FCD9A5"/>
      <circle cx="30" cy="-8" r="15" fill="#FCD9A5"/>
      <path d="M 40 -2 q 10 2 8 6 q -6 2 -9 -1 z" fill="#FCD9A5"/>
      <path d="M 22 -20 l 2 -14 l 9 10 z" fill="#E8B48D"/>
      <path d="M 0 -14 q -26 2 -32 16" fill="none" stroke="#B45309" stroke-width="7" stroke-linecap="round"/>
      <circle cx="34" cy="-11" r="2" fill="${C.ink}" stroke="none"/>
      <circle cx="47" cy="-6" r="2.4" fill="${C.ink}" stroke="none"/>
    </g>
  </g>`;

const clockFace = (hour, minute) => {
  const cx = 120;
  const cy = 92;
  const r = 58;
  const angle = (deg) => ((deg - 90) * Math.PI) / 180;
  const hand = (deg, len, width, color) => {
    const a = angle(deg);
    return `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(a) * len).toFixed(1)}" y2="${(cy + Math.sin(a) * len).toFixed(1)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
  };
  const minuteDeg = minute * 6;
  const hourDeg = (hour % 12) * 30 + minute * 0.5;
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = angle(i * 30);
    const inner = r - (i % 3 === 0 ? 11 : 6);
    const x1 = cx + Math.cos(a) * inner;
    const y1 = cy + Math.sin(a) * inner;
    const x2 = cx + Math.cos(a) * r;
    const y2 = cy + Math.sin(a) * r;
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${C.grayDark}" stroke-width="${i % 3 === 0 ? 3 : 1.5}" stroke-linecap="round"/>`;
  }).join("");
  return `
    <circle cx="${cx}" cy="${cy}" r="${r + 8}" fill="${C.gray}" stroke="${C.ink}" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" stroke="${C.ink}" stroke-width="2.5"/>
    ${ticks}
    <text x="${cx}" y="${cy - r + 22}" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="15" font-weight="700" fill="${C.ink}">12</text>
    <text x="${cx + r - 16}" y="${cy + 6}" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="15" font-weight="700" fill="${C.ink}">3</text>
    <text x="${cx}" y="${cy + r - 8}" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="15" font-weight="700" fill="${C.ink}">6</text>
    <text x="${cx - r + 16}" y="${cy + 6}" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="15" font-weight="700" fill="${C.ink}">9</text>
    ${hand(hourDeg, 32, 7, C.ink)}
    ${hand(minuteDeg, 46, 4.5, C.blue)}
    <circle cx="${cx}" cy="${cy}" r="4.5" fill="${C.ink}"/>`;
};

const snow = (count = 14) => {
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = 66 + ((i * 37) % 132);
    const y = 38 + ((i * 53) % 84);
    out += `<g stroke="${C.blueMid}" stroke-width="1.6" stroke-linecap="round"><line x1="${x - 4}" y1="${y}" x2="${x + 4}" y2="${y}"/><line x1="${x}" y1="${y - 4}" x2="${x}" y2="${y + 4}"/><line x1="${x - 2.8}" y1="${y - 2.8}" x2="${x + 2.8}" y2="${y + 2.8}"/><line x1="${x - 2.8}" y1="${y + 2.8}" x2="${x + 2.8}" y2="${y - 2.8}"/></g>`;
  }
  return out;
};

const rain = (count = 14) => {
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = 66 + ((i * 37) % 126);
    const y = 38 + ((i * 47) % 76);
    out += `<line x1="${x}" y1="${y}" x2="${x - 5}" y2="${y + 13}" stroke="${C.blueMid}" stroke-width="2" stroke-linecap="round"/>`;
  }
  return out;
};

const plantPot = (x, y, { flower = false, soil = true, w = 44 } = {}) => `
  <g transform="translate(${x} ${y})">
    <path d="M ${-w / 2} 0 L ${w / 2} 0 L ${w / 2 - 6} 34 L ${-w / 2 + 6} 34 Z" fill="#D97757" stroke="${C.ink}" stroke-width="2"/>
    <ellipse cx="0" cy="0" rx="${w / 2}" ry="5" fill="${soil ? "#7C4A2D" : "#D97757"}" stroke="${C.ink}" stroke-width="2"/>
    ${
      flower
        ? `<path d="M 0 -2 L 0 -38" stroke="${C.green}" stroke-width="4"/>
           <path d="M 0 -18 q -14 -4 -16 -16 q 14 0 16 16" fill="${C.greenMid}" stroke="${C.green}" stroke-width="1.5"/>
           <path d="M 0 -26 q 14 -4 16 -16 q -14 0 -16 16" fill="${C.greenMid}" stroke="${C.green}" stroke-width="1.5"/>
           <g fill="#F472B6" stroke="${C.ink}" stroke-width="1.5">
             <circle cx="0" cy="-48" r="7"/><circle cx="-9" cy="-41" r="6"/><circle cx="9" cy="-41" r="6"/><circle cx="-6" cy="-54" r="6"/><circle cx="6" cy="-54" r="6"/>
           </g>
           <circle cx="0" cy="-46" r="4" fill="${C.yellowLight}" stroke="${C.ink}" stroke-width="1.5"/>`
        : soil
          ? `<ellipse cx="-6" cy="4" rx="4" ry="2.5" fill="#5B3620"/><circle cx="4" cy="3" r="1.6" fill="#5B3620"/><circle cx="10" cy="6" r="1.6" fill="#5B3620"/>`
          : ""
    }
  </g>`;

const story1 = svg(
  960,
  300,
  [
    panel(
      0,
      `${floor()}
      ${figure({ x: 68, shirt: "#C7D2FE", hairStyle: "bun", skirt: "#6366F1", rightHand: [30, -70] })}
      <g stroke="${C.ink}" stroke-width="2.5">
        <rect x="148" y="172" width="76" height="78" rx="10" fill="${C.gray}"/>
        <circle cx="186" cy="212" r="24" fill="${C.white}"/>
        <circle cx="186" cy="212" r="16" fill="${C.bluePale}" stroke="${C.grayDark}" stroke-width="1.5"/>
        <rect x="154" y="180" width="24" height="8" rx="3" fill="${C.grayDark}"/>
        <circle cx="212" cy="184" r="3.5" fill="${C.blue}"/>
      </g>
      <g stroke="${C.ink}" stroke-width="2">
        <rect x="26" y="180" width="56" height="34" rx="5" fill="#E9D5C3"/>
        <path d="M 40 180 q 4 -14 14 -14 q 10 0 14 14" fill="${C.white}"/>
        <path d="M 58 180 q 4 -10 12 -10 q 8 0 10 10" fill="${C.blueLight}"/>
      </g>`
    ),
    panel(
      1,
      `${floor()}
      <g stroke="${C.ink}" stroke-width="2.5">
        <rect x="30" y="172" width="76" height="78" rx="10" fill="${C.gray}"/>
        <circle cx="68" cy="212" r="26" fill="${C.white}"/>
        <g stroke="${C.blueMid}" stroke-width="3" fill="none" stroke-linecap="round">
          <path d="M 52 204 q 10 -8 20 0"/><path d="M 52 214 q 10 -8 20 0"/><path d="M 52 224 q 10 -8 20 0"/>
        </g>
        <rect x="36" y="180" width="26" height="8" rx="3" fill="${C.grayDark}"/>
      </g>
      ${figure({ x: 146, shirt: "#C7D2FE", hairStyle: "bun", skirt: "#6366F1", rightHand: [22, -86], leftHand: [-24, -74] })}
      <circle cx="176" cy="166" r="5" fill="${C.blue}" stroke="${C.ink}" stroke-width="1.5"/>
      <path d="M 168 158 q 8 -10 16 0" fill="none" stroke="${C.green}" stroke-width="2.5" stroke-linecap="round"/>`
    ),
    panel(
      2,
      `${floor()}
      ${figure({ x: 112, shirt: "#C7D2FE", hairStyle: "bun", skirt: "#6366F1", leftHand: [-18, -78], rightHand: [24, -132] })}
      <g stroke="${C.ink}" stroke-width="2">
        <rect x="30" y="192" width="60" height="42" rx="6" fill="#E9D5C3"/>
        <path d="M 40 196 q 6 -12 16 -10 q 4 6 14 4 q 8 4 12 12 q -18 8 -42 2 z" fill="${C.white}"/>
        <path d="M 48 210 q 10 -6 24 0" fill="none" stroke="${C.grayMid}" stroke-width="2"/>
      </g>
      <g stroke="${C.ink}" stroke-width="2">
        <path d="M 140 108 q 6 -8 14 -4 l 2 6 q 6 10 -2 22 l -14 -2 q -4 -12 0 -22 z" fill="${C.blueLight}"/>
        <path d="M 136 118 q -12 0 -14 12 l 30 0 q 0 -8 -6 -12" fill="${C.blueLight}"/>
      </g>`
    ),
    panel(
      3,
      `<rect x="14" y="120" width="212" height="130" fill="${C.bluePale}"/>
      <g fill="${C.grayMid}" opacity="0.55">
        <rect x="24" y="86" width="26" height="42"/><rect x="58" y="70" width="30" height="58"/><rect x="96" y="92" width="22" height="36"/><rect x="186" y="78" width="30" height="50"/>
      </g>
      <g stroke="${C.ink}" stroke-width="2" fill="#FFFFFF">
        <rect x="16" y="120" width="70" height="90" fill="${C.blueLight}"/>
        <line x1="51" y1="120" x2="51" y2="210"/>
        <line x1="16" y1="165" x2="86" y2="165"/>
      </g>
      <g stroke="${C.grayDark}" stroke-width="3.5" stroke-linecap="round">
        <line x1="10" y1="222" x2="230" y2="222"/>
        <line x1="10" y1="256" x2="230" y2="256"/>
        ${Array.from({ length: 11 }, (_, i) => `<line x1="${14 + i * 21}" y1="222" x2="${14 + i * 21}" y2="256" stroke-width="2.5"/>`).join("")}
      </g>
      <line x1="14" y1="64" x2="226" y2="64" stroke="${C.grayDark}" stroke-width="2.5" stroke-linecap="round"/>
      <g stroke="${C.ink}" stroke-width="2">
        <path d="M 74 64 l 12 0 l 2 22 l -18 2 z" fill="${C.yellowLight}"/>
        <path d="M 120 64 l 10 0 l 0 26 l -16 0 z" fill="${C.white}"/>
        <path d="M 152 64 l 12 0 l 4 20 l -10 6 l -10 -8 z" fill="${C.blueLight}"/>
      </g>
      ${figure({ x: 196, feet: 258, shirt: "#C7D2FE", hairStyle: "bun", skirt: "#6366F1", rightHand: [12, -186], leftHand: [-22, -70] })}
      <circle cx="210" cy="66" r="3" fill="${C.red}"/>`
    ),
  ].join("")
);

const story2 = svg(
  960,
  300,
  [
    panel(
      0,
      `${floor()}
      ${figure({ x: 74, s: 0.8, feet: 250, shirt: "#BFDBFE", pants: "#1E40AF", hairStyle: "short", leftHand: [-34, -58], rightHand: [40, -92] })}
      ${plantPot(112, 212, { flower: false })}
            <g transform="translate(96 158)" stroke="${C.ink}" stroke-width="2">
              <rect x="0" y="0" width="22" height="30" rx="3" fill="${C.greenLight}"/>
              <circle cx="7" cy="10" r="2" fill="#5B3620"/><circle cx="15" cy="10" r="2" fill="#5B3620"/>
              <circle cx="11" cy="19" r="2" fill="#5B3620"/>
      </g>`
    ),
    panel(
      1,
      `${floor()}
      ${figure({ x: 70, s: 0.8, feet: 250, shirt: "#BFDBFE", pants: "#1E40AF", rightHand: [54, -84], leftHand: [-22, -60] })}
      <g stroke="${C.ink}" stroke-width="2">
        <rect x="110" y="212" width="60" height="8" rx="3" fill="#C69C6D"/>
        <line x1="118" y1="220" x2="118" y2="250" stroke-width="6" stroke="#A97B4F"/>
        <line x1="160" y1="220" x2="160" y2="250" stroke-width="6" stroke="#A97B4F"/>
      </g>
      ${plantPot(140, 178, { flower: false })}
      <circle cx="124" cy="150" r="3" fill="#5B3620" stroke="${C.ink}"/>
      <circle cx="132" cy="164" r="3" fill="#5B3620" stroke="${C.ink}"/>
      <circle cx="126" cy="172" r="2.4" fill="#5B3620" stroke="${C.ink}"/>`
    ),
    panel(
      2,
      `${floor()}
      ${figure({ x: 66, s: 0.8, feet: 250, shirt: "#BFDBFE", pants: "#1E40AF", rightHand: [56, -90], leftHand: [-20, -56] })}
      <g transform="translate(120 150) rotate(18)" stroke="${C.ink}" stroke-width="2.5">
        <rect x="0" y="0" width="44" height="30" rx="6" fill="${C.greenMid}"/>
        <path d="M 44 8 l 16 -10 l 4 6 l -14 12 z" fill="${C.greenMid}"/>
        <path d="M 4 0 q 10 -12 22 0" fill="none" stroke-width="3"/>
        <path d="M 10 30 q 10 8 24 0" fill="none" stroke-width="2"/>
      </g>
      <g stroke="${C.blueMid}" stroke-width="2.5" stroke-linecap="round">
        <line x1="156" y1="166" x2="150" y2="186"/>
        <line x1="164" y1="168" x2="159" y2="190"/>
        <line x1="172" y1="170" x2="168" y2="194"/>
      </g>
      ${plantPot(146, 206, { flower: false })}`
    ),
    panel(
      3,
      `${floor()}
      <g transform="translate(190 46)" stroke="${C.yellow}" stroke-width="2.2" stroke-linecap="round">
        <circle cx="0" cy="0" r="12" fill="${C.yellowLight}"/>
        ${Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          return `<line x1="${(Math.cos(a) * 16).toFixed(1)}" y1="${(Math.sin(a) * 16).toFixed(1)}" x2="${(Math.cos(a) * 22).toFixed(1)}" y2="${(Math.sin(a) * 22).toFixed(1)}"/>`;
        }).join("")}
      </g>
      ${figure({ x: 58, s: 0.8, feet: 250, shirt: "#BFDBFE", pants: "#1E40AF", rightHand: [28, -68], leftHand: [-28, -68] })}
      ${plantPot(140, 200, { flower: true })}
      <path d="M 96 148 q 10 10 20 0" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/>`
    ),
  ].join("")
);

const stationSign = (x, y) => `
  <g transform="translate(${x} ${y})" stroke="${C.ink}" stroke-width="2">
    <rect x="-24" y="-18" width="48" height="34" rx="5" fill="${C.blueLight}"/>
    <rect x="-14" y="-11" width="28" height="16" rx="3" fill="${C.white}"/>
    <rect x="-9" y="-7" width="8" height="7" rx="1" fill="${C.blue}"/>
    <rect x="1" y="-7" width="8" height="7" rx="1" fill="${C.blue}"/>
    <circle cx="-8" cy="8" r="2.4" fill="${C.grayDark}" stroke="none"/>
    <circle cx="8" cy="8" r="2.4" fill="${C.grayDark}" stroke="none"/>
  </g>`;

const story3 = svg(
  960,
  300,
  [
    panel(
      0,
      `${floor()}
      <rect x="14" y="238" width="212" height="8" fill="${C.yellowLight}" stroke="${C.ink}" stroke-width="1.5"/>
            ${stationSign(178, 48)}
      <g stroke="${C.ink}" stroke-width="2.5" fill="#C69C6D">
        <rect x="118" y="196" width="96" height="10" rx="3"/>
        <rect x="124" y="206" width="8" height="44" fill="#A97B4F"/>
        <rect x="200" y="206" width="8" height="44" fill="#A97B4F"/>
        <rect x="118" y="160" width="96" height="8" rx="3"/>
        <rect x="124" y="160" width="7" height="38" fill="#A97B4F"/>
      </g>
      <path d="M 132 196 q 10 -18 22 -2 q 8 12 22 2 q 14 -10 24 2 l 0 6 l -70 0 z" fill="${C.redLight}" stroke="${C.red}" stroke-width="2.5"/>
      ${figure({ x: 62, shirt: "#CBD5E1", pants: "#334155", rightHand: [24, -70], leftHand: [-24, -70] })}`
    ),
    panel(
      1,
      `${floor()}
      <rect x="14" y="238" width="212" height="8" fill="${C.yellowLight}" stroke="${C.ink}" stroke-width="1.5"/>
      <g stroke="${C.ink}" stroke-width="2.5" fill="#C69C6D">
        <rect x="122" y="196" width="94" height="10" rx="3"/>
        <rect x="128" y="206" width="8" height="44" fill="#A97B4F"/>
        <rect x="202" y="206" width="8" height="44" fill="#A97B4F"/>
      </g>
      ${figure({ x: 72, shirt: "#CBD5E1", pants: "#334155", rightHand: [44, -96], leftHand: [-24, -70] })}
      <path d="M 112 142 q 10 -16 20 -2 q 6 10 16 0 q 10 -8 16 2 l 0 8 l -52 0 z" fill="${C.redLight}" stroke="${C.red}" stroke-width="2.5"/>`
    ),
    panel(
      2,
      `${floor()}
      ${stationSign(178, 74)}
      <g stroke="${C.ink}" stroke-width="2.5">
        <rect x="120" y="180" width="108" height="14" rx="4" fill="#C69C6D"/>
        <rect x="128" y="194" width="96" height="58" fill="#E7D3BE"/>
      </g>
      ${figure({ x: 168, feet: 250, shirt: "#BFDBFE", hairStyle: "short", rightHand: [6, -92], leftHand: [-22, -92] })}
      ${figure({ x: 62, shirt: "#CBD5E1", pants: "#334155", rightHand: [46, -96], leftHand: [-24, -70] })}
      <path d="M 106 138 q 10 -16 20 -2 q 6 10 16 0 q 10 -8 16 2 l 0 8 l -52 0 z" fill="${C.redLight}" stroke="${C.red}" stroke-width="2.5"/>`
    ),
    panel(
      3,
      `${floor()}
      <g stroke="${C.ink}" stroke-width="2.5">
            <rect x="96" y="180" width="124" height="14" rx="4" fill="#C69C6D"/>
            <rect x="104" y="194" width="108" height="60" fill="#E7D3BE"/>
            <line x1="104" y1="216" x2="212" y2="216"/>
          </g>
          ${figure({ x: 176, feet: 250, shirt: "#BFDBFE", hairStyle: "short", rightHand: [26, -100], leftHand: [12, -84] })}
          <g stroke="${C.ink}" stroke-width="2">
            <rect x="128" y="150" width="66" height="30" rx="4" fill="#F1E4CF"/>
            <path d="M 134 150 q 10 -14 20 -2 q 8 10 16 -2 q 10 -8 18 2 l 0 8 l -54 0 z" fill="${C.redLight}" stroke="${C.red}" stroke-width="2.5"/>
          </g>
          ${figure({ x: 52, feet: 250, shirt: "#CBD5E1", pants: "#334155", rightHand: [34, -80], leftHand: [-24, -70] })}
          <g stroke="${C.ink}" stroke-width="2">
            <rect x="96" y="150" width="26" height="30" rx="3" fill="${C.white}"/>
            <path d="M 100 156 l 18 0 M 100 162 l 18 0 M 100 168 l 12 0" stroke="${C.grayMid}" stroke-width="1.5"/>
          </g>`
        ),
  ].join("")
);

const story4 = svg(
  960,
  300,
  [
    panel(
      0,
      `${floor()}
      <g stroke="${C.ink}" stroke-width="2">
        <rect x="94" y="196" width="124" height="10" rx="4" fill="#C69C6D"/>
        <rect x="104" y="206" width="8" height="44" fill="#A97B4F"/>
        <rect x="200" y="206" width="8" height="44" fill="#A97B4F"/>
      </g>
          ${figure({ x: 58, shirt: "#BFDBFE", pants: "#475569", rightHand: [52, -92], leftHand: [-24, -70] })}
      <g stroke="${C.ink}" stroke-width="2">
            <rect x="148" y="168" width="68" height="28" rx="4" fill="${C.red}"/>
            <rect x="152" y="172" width="60" height="20" rx="2" fill="#FFF7ED"/>
            <path d="M 156 192 q 12 -16 28 -16 q 16 0 24 16 z" fill="${C.white}"/>
          </g>
          <g stroke="${C.ink}" stroke-width="2" transform="translate(120 142) rotate(-22)">
            <ellipse cx="0" cy="0" rx="20" ry="7" fill="${C.white}"/>
            <path d="M -20 0 a 20 7 0 0 0 40 0 l 0 9 a 20 7 0 0 1 -40 0 z" fill="${C.gray}"/>
            <ellipse cx="0" cy="0" rx="16" ry="5" fill="${C.white}"/>
          </g>
          <g fill="${C.white}" stroke="${C.grayDark}" stroke-width="1">
            <ellipse cx="140" cy="160" rx="3" ry="1.6"/>
            <ellipse cx="146" cy="170" rx="3" ry="1.6"/>
            <ellipse cx="138" cy="176" rx="2.6" ry="1.4"/>
          </g>`
        ),
    panel(
      1,
      `${floor()}
      <g stroke="${C.ink}" stroke-width="2">
        <rect x="96" y="196" width="126" height="10" rx="4" fill="#C69C6D"/>
        <rect x="106" y="206" width="8" height="44" fill="#A97B4F"/>
        <rect x="204" y="206" width="8" height="44" fill="#A97B4F"/>
        <rect x="132" y="182" width="76" height="14" rx="3" fill="${C.grayDark}"/>
        <ellipse cx="170" cy="176" rx="40" ry="9" fill="${C.gray}"/>
        <path d="M 206 174 l 14 -4" stroke="${C.grayDark}" stroke-width="6" stroke-linecap="round"/>
        <rect x="142" y="164" width="46" height="12" rx="6" fill="${C.yellowLight}"/>
        <rect x="146" y="156" width="38" height="10" rx="5" fill="#FCD34D"/>
      </g>
      ${figure({ x: 56, shirt: "#BFDBFE", pants: "#475569", rightHand: [74, -74], leftHand: [-24, -70] })}
      <line x1="124" y1="176" x2="132" y2="166" stroke="${C.grayDark}" stroke-width="3.5" stroke-linecap="round"/>
      <g stroke="${C.orange || C.yellow}" stroke-width="2" stroke-linecap="round">
        <path d="M 156 150 q 4 -12 12 -6" fill="none"/><path d="M 170 148 q 0 -12 8 -10" fill="none"/>
      </g>`
    ),
    panel(
      2,
      `${floor()}
      <g stroke="${C.ink}" stroke-width="2">
        <rect x="76" y="192" width="132" height="10" rx="4" fill="#C69C6D"/>
        <rect x="88" y="202" width="8" height="48" fill="#A97B4F"/>
        <rect x="188" y="202" width="8" height="48" fill="#A97B4F"/>
        <rect x="96" y="150" width="92" height="42" rx="8" fill="${C.red}"/>
        <rect x="104" y="156" width="76" height="30" rx="4" fill="#FFF7ED"/>
        <line x1="142" y1="156" x2="142" y2="186" stroke-width="2"/>
        <path d="M 108 180 q 8 -18 15 0 q 5 -12 12 0 q 4 -12 12 0 l 0 6 l -39 0 z" fill="${C.white}"/>
        <g fill="${C.yellowLight}" stroke="${C.ink}" stroke-width="1.5">
          <ellipse cx="152" cy="172" rx="10" ry="8"/><ellipse cx="166" cy="174" rx="9" ry="7"/><ellipse cx="160" cy="162" rx="9" ry="6"/>
        </g>
      </g>
      ${figure({ x: 52, shirt: "#BFDBFE", pants: "#475569", rightHand: [42, -78], leftHand: [-24, -70] })}`
    ),
    panel(
      3,
      `${floor()}
      <g stroke="${C.ink}" stroke-width="2" fill="${C.gray}">
        <rect x="128" y="60" width="90" height="190" rx="4" fill="#F8FAFC"/>
        <rect x="136" y="70" width="74" height="170" rx="3" fill="${C.bluePale}"/>
        <circle cx="198" cy="156" r="4" fill="${C.grayDark}"/>
      </g>
      ${figure({ x: 62, shirt: "#BFDBFE", pants: "#475569", rightHand: [46, -84], leftHand: [-24, -70] })}
      <g transform="translate(104 150)" stroke="${C.ink}" stroke-width="2">
        <rect x="0" y="0" width="34" height="24" rx="4" fill="${C.red}"/>
        <rect x="4" y="4" width="26" height="16" rx="2" fill="#FFF7ED"/>
        <path d="M 6 16 q 6 -10 11 0 l 8 0 l 0 2 l -21 0 z" fill="${C.white}"/>
        <ellipse cx="24" cy="11" rx="5" ry="4" fill="${C.yellowLight}"/>
      </g>
      ${figure({ x: 176, s: 0.9, shirt: "#FBCFE8", hairStyle: "ponytail", skirt: "#DB2777", rightHand: [20, -74], leftHand: [-24, -70] })}
      <g transform="translate(198 186)" stroke="${C.ink}" stroke-width="2">
        <rect x="0" y="0" width="30" height="38" rx="7" fill="#1E3A8A"/>
        <rect x="4" y="8" width="22" height="14" rx="3" fill="#60A5FA"/>
        <path d="M 0 8 q 15 8 30 0" fill="none"/>
      </g>`
    ),
  ].join("")
);

const aquariumFishIcon = (x, y, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})" stroke="${C.ink}" stroke-width="2">
    <ellipse cx="0" cy="0" rx="18" ry="11" fill="${C.blueMid}"/>
    <path d="M 16 0 l 12 -8 l 0 16 z" fill="${C.blueMid}"/>
    <circle cx="-8" cy="-2" r="2" fill="${C.ink}" stroke="none"/>
  </g>`;

const tank = (withDolphin = true, camera = false) => `
  <rect x="18" y="26" width="204" height="160" rx="8" fill="${C.bluePale}" stroke="${C.grayDark}" stroke-width="4"/>
  <rect x="22" y="30" width="196" height="152" rx="6" fill="#DBEAFE"/>
  <path d="M 22 118 q 40 -16 78 0 q 40 14 78 -4 q 26 -8 40 4 l 0 64 l -196 0 z" fill="#BFDBFE"/>
  <g stroke="${C.grayMid}" stroke-width="2" fill="none">
    <path d="M 40 60 q 16 -10 32 0"/><path d="M 164 52 q 14 -8 28 0"/>
  </g>
  ${
    withDolphin
      ? `<g stroke="${C.ink}" stroke-width="2">
      <path d="M 64 112 q 26 -32 64 -26 q 34 6 52 28 q -20 20 -52 20 q -40 0 -64 -22 z" fill="#A5B4CB"/>
      <path d="M 104 88 q 2 -18 14 -22 q 2 12 -4 22 z" fill="#A5B4CB"/>
      <path d="M 128 112 q 20 12 10 30 q -16 -6 -18 -22 z" fill="#A5B4CB"/>
      <path d="M 64 112 q -16 4 -24 12 q 14 8 26 2 z" fill="#A5B4CB"/>
      <path d="M 140 116 q 18 10 12 22 q -14 -6 -16 -18 z" fill="#BFD0E4"/>
      <circle cx="82" cy="100" r="2.6" fill="${C.ink}"/>
      <path d="M 54 114 q 8 -2 14 2" fill="none" stroke-width="1.5"/>
      <path d="M 100 126 q 18 6 34 2" fill="none" stroke="#6B7280" stroke-width="2"/>
        </g>`
      : ""
  }
  <g stroke="${C.ink}" stroke-width="2">
    <ellipse cx="60" cy="170" rx="20" ry="7" fill="#CBD5E1"/>
    <ellipse cx="132" cy="174" rx="16" ry="6" fill="#CBD5E1"/>
    <path d="M 96 176 q 10 -14 20 0" fill="#94A3B8"/>
  </g>
  <g stroke="${C.green}" stroke-width="3" stroke-linecap="round">
    <path d="M 186 170 q -6 -22 4 -34" fill="none"/><path d="M 196 172 q 8 -18 2 -30" fill="none"/>
  </g>
  ${camera ? `<g transform="translate(62 158)" stroke="${C.ink}" stroke-width="2"><rect x="0" y="0" width="22" height="16" rx="3" fill="${C.grayDark}"/><circle cx="11" cy="8" r="5" fill="${C.blueLight}"/><rect x="6" y="-4" width="8" height="4" rx="1" fill="${C.grayDark}"/></g>` : ""}`;

const story5 = svg(
  960,
  300,
  [
    panel(
      0,
      `${floor()}
      <g stroke="${C.ink}" stroke-width="2.5">
        <rect x="24" y="46" width="196" height="204" rx="6" fill="#E0F2FE"/>
        <rect x="24" y="46" width="196" height="34" rx="6" fill="${C.blueMid}"/>
        <rect x="118" y="150" width="86" height="60" rx="4" fill="${C.white}"/>
        <line x1="118" y1="170" x2="204" y2="170"/>
        <rect x="40" y="150" width="52" height="100" rx="3" fill="${C.blueLight}"/>
      </g>
      ${aquariumFishIcon(56, 64, 0.9)}
      <g transform="translate(58 186)" stroke="${C.ink}" stroke-width="2">
        <rect x="0" y="0" width="20" height="28" rx="3" fill="${C.white}"/>
        <rect x="5" y="4" width="10" height="12" rx="2" fill="${C.blueLight}"/>
        <rect x="8" y="20" width="4" height="4" fill="${C.blueMid}"/>
      </g>
      ${figure({ x: 60, s: 0.62, feet: 252, hairStyle: "long", shirt: "#FBCFE8", skirt: "#DB2777", leftHand: [-26, -70], rightHand: [26, -78] })}
      ${figure({ x: 96, s: 0.62, feet: 252, hairStyle: "short", shirt: "#BFDBFE", pants: "#1E40AF", leftHand: [-26, -70], rightHand: [30, -80] })}
      <g stroke="${C.ink}" stroke-width="1.6" fill="${C.yellowLight}">
        <rect x="118" y="196" width="16" height="10" rx="2"/>
        <rect x="118" y="208" width="16" height="10" rx="2"/>
      </g>`
    ),
    panel(
          1,
          `<rect x="14" y="6" width="212" height="288" rx="10" fill="#FFFFFF"/>
          ${tank(true)}
          ${figure({ x: 66, feet: 292, s: 0.72, hairStyle: "long", shirt: "#FBCFE8", skirt: "#DB2777", leftHand: [-22, -64], rightHand: [18, -64] })}
          ${figure({ x: 112, feet: 292, s: 0.72, hairStyle: "short", shirt: "#BFDBFE", pants: "#1E40AF", leftHand: [-20, -64], rightHand: [20, -64] })}`
        ),
        panel(
          2,
          `<rect x="14" y="6" width="212" height="288" rx="10" fill="#FFFFFF"/>
          ${tank(true, true)}
          ${figure({ x: 66, feet: 292, s: 0.72, hairStyle: "long", shirt: "#FBCFE8", skirt: "#DB2777", leftHand: [-22, -64], rightHand: [18, -64] })}
          ${figure({ x: 112, feet: 292, s: 0.72, hairStyle: "short", shirt: "#BFDBFE", pants: "#1E40AF", leftHand: [-20, -64], rightHand: [20, -64] })}`
        ),
    panel(
      3,
      `${floor()}
          <g stroke="${C.ink}" stroke-width="2.5" opacity="0.55">
        <rect x="24" y="60" width="86" height="190" rx="6" fill="#E0F2FE"/>
      </g>
          ${figure({ x: 76, feet: 252, hairStyle: "long", shirt: "#FBCFE8", skirt: "#DB2777", rightHand: [30, -60], leftHand: [-24, -70] })}
          ${figure({ x: 128, feet: 252, hairStyle: "short", shirt: "#BFDBFE", pants: "#1E40AF", rightHand: [36, -60], leftHand: [-24, -70] })}
          <g stroke="${C.ink}" stroke-width="1.8">
            <rect x="98" y="188" width="20" height="26" rx="2" fill="${C.blueMid}"/>
            <rect x="152" y="186" width="20" height="26" rx="2" fill="${C.blueMid}"/>
            <line x1="102" y1="194" x2="114" y2="194" stroke="${C.white}"/>
            <line x1="156" y1="192" x2="168" y2="192" stroke="${C.white}"/>
      </g>`
    ),
  ].join("")
);

// ---------------------------------------------------------------- matching

const chair = `
  <g stroke="${C.ink}" stroke-width="3" fill="#CBD5E1">
    <rect x="96" y="86" width="48" height="58" rx="6" fill="#E2E8F0"/>
    <line x1="108" y1="94" x2="108" y2="136" stroke-width="2"/>
    <line x1="132" y1="94" x2="132" y2="136" stroke-width="2"/>
    <rect x="92" y="142" width="56" height="12" rx="4" fill="#94A3B8"/>
    <line x1="100" y1="154" x2="100" y2="186" stroke-width="5"/>
    <line x1="140" y1="154" x2="140" y2="186" stroke-width="5"/>
    <line x1="96" y1="186" x2="106" y2="186" stroke-width="5"/>
    <line x1="134" y1="186" x2="144" y2="186" stroke-width="5"/>
  </g>`;

const bag = (x, y, w, h, color, stroke) => `
  <g stroke="${stroke}" stroke-width="2.5">
    <path d="M ${x + w * 0.28} ${y} q 0 -16 ${w * 0.44} 0" fill="none" stroke-width="3.5"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${color}"/>
    <line x1="${x + 4}" y1="${y + h * 0.55}" x2="${x + w - 4}" y2="${y + h * 0.55}" stroke-width="2" opacity="0.5"/>
  </g>`;

const m1 = (variant) => {
  const bagSpec = {
    A: { x: 26, w: 58, h: 60, color: C.greenMid, stroke: "#15803D" },
    B: { x: 156, w: 58, h: 60, color: C.greenMid, stroke: "#15803D" },
    C: { x: 156, w: 58, h: 60, color: "#FCA5A5", stroke: "#B91C1C" },
    D: { x: 168, w: 42, h: 42, color: C.greenMid, stroke: "#15803D" },
  }[variant];
  const y = 186 - bagSpec.h;
  return svg(240, 200, `${chair}${bag(bagSpec.x, y, bagSpec.w, bagSpec.h, bagSpec.color, bagSpec.stroke)}`);
};

const girlWithDog = (hatColor, isBoy, walking) => svg(
  240,
  200,
  `<rect x="0" y="0" width="240" height="200" fill="#FFFFFF"/>
  <line x1="10" y1="186" x2="230" y2="186" stroke="${C.floor}" stroke-width="3" stroke-linecap="round"/>
  ${!walking ? `<g stroke="${C.grayMid}" stroke-width="2.5" stroke-linecap="round"><line x1="26" y1="140" x2="40" y2="140"/><line x1="20" y1="152" x2="38" y2="152"/></g>` : ""}
  ${figure({
    x: 92,
    feet: 186,
    s: 0.86,
    shirt: isBoy ? "#BFDBFE" : "#FBCFE8",
    pants: isBoy ? "#1E40AF" : undefined,
    skirt: isBoy ? null : "#DB2777",
    hairStyle: isBoy ? "short" : "ponytail",
    hat: hatColor,
    legs: walking ? "walk" : "run",
    rightHand: [38, -84],
    leftHand: walking ? [-20, -70] : [-34, -96],
  })}
  ${dog({ x: 182, y: 168, s: 0.82, running: !walking })}
  <path d="M 122 118 q 18 8 34 14" stroke="${C.grayDark}" stroke-width="2" fill="none"/>`
);

const shelf = (level, count, color, stroke) => {
  const boardY = [74, 108, 142, 176][level];
  const boxW = 30;
  const gap = 8;
  const total = count * boxW + (count - 1) * gap;
  const start = 120 - total / 2;
  const boxes = Array.from({ length: count }, (_, i) =>
    `<rect x="${start + i * (boxW + gap)}" y="${boardY - 26}" width="${boxW}" height="26" rx="3" fill="${color}" stroke="${stroke}" stroke-width="2"/>`
  ).join("");
  return `
  <g stroke="${C.ink}" stroke-width="2.5">
    <rect x="34" y="30" width="172" height="156" rx="4" fill="#F8FAFC"/>
    <line x1="34" y1="74" x2="206" y2="74"/>
    <line x1="34" y1="108" x2="206" y2="108"/>
    <line x1="34" y1="142" x2="206" y2="142"/>
    <line x1="34" y1="176" x2="206" y2="176"/>
    <line x1="34" y1="30" x2="34" y2="186"/>
    <line x1="206" y1="30" x2="206" y2="186"/>
  </g>
  ${boxes}`;
};

const m3 = (variant) => {
  const spec = {
    A: [0, 2, C.blueMid, "#1D4ED8"],
    B: [0, 3, "#FCA5A5", "#B91C1C"],
    C: [0, 3, C.blueMid, "#1D4ED8"],
    D: [3, 3, C.blueMid, "#1D4ED8"],
  }[variant];
  return svg(240, 200, shelf(spec[0], spec[1], spec[2], spec[3]));
};

const m4 = (variant) => {
  const times = { A: [3, 30], B: [3, 0], C: [2, 30], D: [6, 15] }[variant];
  return svg(240, 200, `<rect x="0" y="0" width="240" height="200" fill="#FFFFFF"/>${clockFace(times[0], times[1])}`);
};

const windowScene = ({ open, snowing, woman }) => {
  const weather = snowing ? snow(22) : rain(22);
  const sash = open
      ? `<g stroke="${C.grayDark}" stroke-width="3" stroke-linejoin="round">
           <rect x="134" y="36" width="65" height="92" fill="none"/>
           <line x1="167" y1="36" x2="167" y2="128" stroke-width="2"/>
           <line x1="134" y1="82" x2="199" y2="82" stroke-width="2"/>
           <polygon points="66,36 26,18 26,110 66,128" fill="#EAF3FE"/>
           <line x1="46" y1="27" x2="46" y2="119" stroke-width="2"/>
           <line x1="66" y1="36" x2="66" y2="128"/>
           <line x1="26" y1="18" x2="66" y2="36" stroke-width="2"/>
           <line x1="26" y1="110" x2="66" y2="128" stroke-width="2"/>
         </g>`
      : `<g stroke="${C.grayDark}" stroke-width="3" fill="none">
           <rect x="66" y="36" width="65" height="92"/>
           <rect x="134" y="36" width="65" height="92"/>
           <line x1="99" y1="36" x2="99" y2="128"/>
           <line x1="167" y1="36" x2="167" y2="128"/>
           <line x1="66" y1="82" x2="199" y2="82"/>
         </g>`;
  return svg(
    240,
    200,
    `<rect x="0" y="0" width="240" height="200" fill="#F8FAFC"/>
    <rect x="56" y="26" width="153" height="108" rx="3" fill="${C.bluePale}" stroke="${C.ink}" stroke-width="4"/>
    <rect x="66" y="36" width="133" height="92" fill="${snowing ? '#E8F2FC' : '#DCE9F7'}"/>
    <clipPath id="glass"><rect x="66" y="36" width="133" height="92"/></clipPath>
    <g clip-path="url(#glass)">${weather}${
      snowing
        ? `<rect x="66" y="112" width="133" height="16" fill="#FFFFFF" opacity="0.85"/>`
        : `<g stroke="${C.blueMid}" stroke-width="2" opacity="0.5"><line x1="66" y1="118" x2="199" y2="112"/><line x1="66" y1="126" x2="199" y2="120"/></g>`
    }</g>
    ${sash}
    <rect x="56" y="132" width="153" height="8" rx="2" fill="${C.gray}" stroke="${C.grayDark}" stroke-width="2"/>
    <line x1="8" y1="192" x2="232" y2="192" stroke="${C.floor}" stroke-width="3"/>
    ${
      woman
        ? figure({ x: 34, feet: 196, s: 0.8, hairStyle: "ponytail", shirt: "#FBCFE8", skirt: "#DB2777", rightHand: [64, -118], leftHand: [-18, -66] })
        : figure({ x: 34, feet: 196, s: 0.8, shirt: "#BFDBFE", pants: "#334155", rightHand: [64, -118], leftHand: [-18, -66] })
    }`
  );
};

const images = {
  "s1.svg": story1,
  "s2.svg": story2,
  "s3.svg": story3,
  "s4.svg": story4,
  "s5.svg": story5,
  "m1-a.svg": m1("A"),
  "m1-b.svg": m1("B"),
  "m1-c.svg": m1("C"),
  "m1-d.svg": m1("D"),
  "m2-a.svg": girlWithDog("#F87171", false, false),
  "m2-b.svg": girlWithDog(C.yellowLight, true, false),
  "m2-c.svg": girlWithDog(C.yellowLight, false, true),
  "m2-d.svg": girlWithDog(C.yellowLight, false, false),
  "m3-a.svg": m3("A"),
  "m3-b.svg": m3("B"),
  "m3-c.svg": m3("C"),
  "m3-d.svg": m3("D"),
  "m4-a.svg": m4("A"),
  "m4-b.svg": m4("B"),
  "m4-c.svg": m4("C"),
  "m4-d.svg": m4("D"),
  "m5-a.svg": windowScene({ open: true, snowing: true, woman: false }),
  "m5-b.svg": windowScene({ open: false, snowing: true, woman: false }),
  "m5-c.svg": windowScene({ open: false, snowing: true, woman: true }),
  "m5-d.svg": windowScene({ open: false, snowing: false, woman: false }),
};

for (const [name, markup] of Object.entries(images)) {
  const dir = name.startsWith("s") ? OUT_STORIES : OUT_MATCHING;
  writeFileSync(join(dir, name), markup, "utf8");
}
console.log(`Wrote ${Object.keys(images).length} SVG files.`);