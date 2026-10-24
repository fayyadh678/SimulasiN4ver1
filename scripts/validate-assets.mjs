// Standalone asset check used by `npm run validate:assets`.
// Verifies the 25 SVGs and 10 MP3s referenced by the datasets exist and are non-trivial.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const errors = [];
const read = (path) => JSON.parse(readFileSync(join(root, path), "utf8"));

const questions = read("src/data/questions.json");
const stories = read("src/data/storyScenes.json");
const matching = read("src/data/matchingScenes.json");
const scripts = read("src/data/listeningScripts.json");

if (questions.length !== 70) errors.push(`Expected 70 questions, found ${questions.length}`);

for (const scene of stories) {
  const file = join(root, "public", scene.path);
  if (!existsSync(file)) errors.push(`Missing story SVG: ${scene.path}`);
  else if (statSync(file).size < 2000) errors.push(`Story SVG too small: ${scene.path}`);
}

for (const scene of matching) {
  for (const choice of ["A", "B", "C", "D"]) {
    const rel = `images/matching/${scene.id.toLowerCase()}-${choice.toLowerCase()}.svg`;
    const file = join(root, "public", rel);
    if (!existsSync(file)) errors.push(`Missing matching SVG: ${rel}`);
    else if (statSync(file).size < 500) errors.push(`Matching SVG too small: ${rel}`);
  }
}

for (const script of scripts) {
  const file = join(root, "public", script.file);
  if (!existsSync(file)) errors.push(`Missing audio: ${script.file}`);
  else if (statSync(file).size < 5000) errors.push(`Audio too small: ${script.file}`);
}

const storyCount = readdirSync(join(root, "public/images/stories")).filter((f) => f.endsWith(".svg")).length;
const matchCount = readdirSync(join(root, "public/images/matching")).filter((f) => f.endsWith(".svg")).length;
const audioCount = readdirSync(join(root, "public/audio")).filter((f) => f.endsWith(".mp3")).length;

if (storyCount !== 5) errors.push(`Expected 5 story SVGs, found ${storyCount}`);
if (matchCount !== 20) errors.push(`Expected 20 matching SVGs, found ${matchCount}`);
if (audioCount !== 10) errors.push(`Expected 10 MP3 files, found ${audioCount}`);

if (errors.length) {
  console.error("Asset validation failed:");
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log("Asset validation passed: 70 questions, 25 SVGs, 10 MP3 files.");