import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import listeningScripts from '../data/listeningScripts.json';
import storyScenes from '../data/storyScenes.json';
import matchingScenes from '../data/matchingScenes.json';

const readJson = <T,>(path: string): T => JSON.parse(readFileSync(path, 'utf8')) as T;

describe('V2 content integrity', () => {
  it('does not leak transcripts or answers into the exam bundle entry points', () => {
    const examSource = readFileSync(join(process.cwd(), 'src', 'pages', 'Exam.tsx'), 'utf8');
    expect(examSource).not.toContain('transcript__text');
    expect(examSource).not.toContain('question.explanation');
    expect(examSource).not.toContain('question.answer');
    expect(examSource).toContain('getListeningScript');
  });

  it('strips speaker labels before synthesis so they are never narrated', () => {
      const generator = readFileSync(
        join(process.cwd(), 'scripts', 'generate-audio.mjs'),
        'utf8'
      );
      // Labels are captured as the speaker, and only the captured text is synthesized.
      expect(generator).toContain('/^([^：]{1,10})：(.+)$/');
      expect(generator).toContain('segments.push({ speaker: currentSpeaker, text: match[2] })');

      for (const script of listeningScripts) {
        expect(script.file).toMatch(/^audio\/q\d{2}\.mp3$/);
        expect(script.script.trim().length).toBeGreaterThan(10);
        // Every script must contain Japanese text after the speaker label.
        expect(script.script.replace(/^[^：]+：/gm, '')).toMatch(/[\u3040-\u30ff\u4e00-\u9faf]/);
      }
    });

  it('has 5 story scenes with 4 panel directions each', () => {
    expect(storyScenes).toHaveLength(5);
    for (const scene of storyScenes) {
      expect(scene.panels).toHaveLength(4);
      expect(scene.path).toMatch(/^images\/stories\/s\d\.svg$/);
    }
  });

  it('documents 5 matching scenes with 4 image descriptions', () => {
    expect(matchingScenes).toHaveLength(5);
    for (const scene of matchingScenes) {
      expect(Object.keys(scene.images).sort()).toEqual(['A', 'B', 'C', 'D']);
    }
  });

  it('has exactly 25 public SVG assets and 10 MP3 files', () => {
    const imageRoot = join(process.cwd(), 'public', 'images');
    const stories = readdirSync(join(imageRoot, 'stories')).filter((name) => name.endsWith('.svg'));
    const matching = readdirSync(join(imageRoot, 'matching')).filter((name) => name.endsWith('.svg'));
    const audio = readdirSync(join(process.cwd(), 'public', 'audio')).filter((name) =>
      name.endsWith('.mp3')
    );
    expect(stories).toHaveLength(5);
    expect(matching).toHaveLength(20);
    expect(audio).toHaveLength(10);
  });

  it('keeps the V1/V2 separation explicit in the UI copy', () => {
    const landing = readFileSync(join(process.cwd(), 'src', 'pages', 'Landing.tsx'), 'utf8');
    expect(landing).toContain('Version 2 / Set 2');
    expect(landing).toContain('Simulasi tidak resmi');
  });

  it('uses BASE_URL for asset resolution instead of absolute root paths', () => {
    const assetsSource = readFileSync(join(process.cwd(), 'src', 'lib', 'assets.ts'), 'utf8');
    expect(assetsSource).toContain('import.meta.env.BASE_URL');
    const examSource = readFileSync(join(process.cwd(), 'src', 'pages', 'Exam.tsx'), 'utf8');
    expect(examSource).not.toMatch(/src="\/audio/);
  });

  it('parses the extracted datasets as JSON (not JS literals)', () => {
    const raw = readFileSync(join(process.cwd(), 'src', 'data', 'questions.json'), 'utf8');
    expect(() => JSON.parse(raw)).not.toThrow();
    const parsed = readJson<unknown[]>(join(process.cwd(), 'src', 'data', 'questions.json'));
    expect(parsed).toHaveLength(70);
  });
});