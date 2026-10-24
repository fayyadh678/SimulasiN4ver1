// Generates the 10 Japanese listening MP3s from the V2 scripts using Edge TTS.
// Run: node scripts/generate-audio.mjs
import { EdgeTTS } from "@andresaya/edge-tts";
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

const ROOT = process.cwd();
const TMP = join(ROOT, "tmp-audio");
const scripts = JSON.parse(readFileSync(join(ROOT, "src/data/listeningScripts.json"), "utf8"));

const VOICE_FEMALE = "ja-JP-NanamiNeural";
const VOICE_MALE = "ja-JP-KeitaNeural";
const PAUSE_SECONDS = 0.7;

const speakerVoice = (label) => (label.includes("女") ? VOICE_FEMALE : VOICE_MALE);

const parseSegments = (script) => {
  const segments = [];
  let currentSpeaker = VOICE_FEMALE;
  for (const rawLine of script.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const match = line.match(/^([^：]{1,10})：(.+)$/);
    if (match) {
      currentSpeaker = speakerVoice(match[1]);
      segments.push({ speaker: currentSpeaker, text: match[2] });
    } else {
      segments.push({ speaker: currentSpeaker, text: line });
    }
  }
  return segments;
};

const synthesize = async (tts, text, voice) => {
  await tts.synthesize(text, voice, { rate: "-10%" });
  const buffer = await tts.toBuffer();
  if (!buffer || buffer.length < 1000) throw new Error(`Audio too small: ${buffer ? buffer.length : 0}`);
  return buffer;
};

const concatWithGaps = (files, outPath) => {
  const silencePath = join(TMP, "silence.mp3");
  if (!existsSync(silencePath)) {
    execFileSync(ffmpegPath, [
      "-hide_banner", "-loglevel", "error", "-y",
      "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono",
      "-t", String(PAUSE_SECONDS), "-c:a", "libmp3lame", "-b:a", "48k", silencePath,
    ]);
  }
  const listPath = join(TMP, "concat.txt");
  const lines = [];
  files.forEach((file, i) => {
    lines.push(`file '${file.replace(/\\/g, "/").replace(/'/g, "'\\''")}'`);
    if (i < files.length - 1) lines.push(`file '${silencePath.replace(/\\/g, "/")}'`);
  });
  writeFileSync(listPath, lines.join("\n"), "utf8");
  execFileSync(ffmpegPath, [
    "-hide_banner", "-loglevel", "error", "-y",
    "-f", "concat", "-safe", "0", "-i", listPath,
    "-c:a", "libmp3lame", "-b:a", "48k", "-ar", "24000", "-ac", "1", outPath,
  ]);
};

mkdirSync(join(ROOT, "public/audio"), { recursive: true });
mkdirSync(TMP, { recursive: true });

for (const item of scripts) {
  const outPath = join(ROOT, "public", item.file);
  const segments = parseSegments(item.script);
  let ok = false;
  for (let attempt = 1; attempt <= 4 && !ok; attempt++) {
    const tts = new EdgeTTS();
    try {
      const files = [];
      for (let i = 0; i < segments.length; i++) {
        const partPath = join(TMP, `${item.id}-${i}.mp3`);
        const buffer = await synthesize(tts, segments[i].text, segments[i].speaker);
        writeFileSync(partPath, buffer);
        files.push(partPath);
      }
      if (files.length === 1) {
        writeFileSync(outPath, readFileSync(files[0]));
      } else {
        concatWithGaps(files, outPath);
      }
      const size = readFileSync(outPath).length;
      console.log(`OK ${item.file} (${size} bytes, ${segments.length} segment(s), attempt ${attempt})`);
      ok = true;
    } catch (error) {
      console.log(`WARN ${item.file} attempt ${attempt} failed: ${error?.message ?? error}`);
      await new Promise((r) => setTimeout(r, 2500));
    }
  }
  if (!ok) {
    console.log(`FAIL ${item.file}`);
    process.exitCode = 1;
  }
  await new Promise((r) => setTimeout(r, 600));
}

rmSync(TMP, { recursive: true, force: true });
console.log("Audio generation finished.");