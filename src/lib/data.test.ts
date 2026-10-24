import { describe, expect, it } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import questions from '../data/questions.json';
import passages from '../data/passages.json';
import storyScenes from '../data/storyScenes.json';
import matchingScenes from '../data/matchingScenes.json';
import listeningScripts from '../data/listeningScripts.json';
import type { Choice, Question, QuestionType } from '../types';

const CHOICES: Choice[] = ['A', 'B', 'C', 'D'];
const TYPES: QuestionType[] = [
  'vocabulary',
  'grammar',
  'reading',
  'story_image',
  'match_image',
  'listening',
];

const typedQuestions = questions as Question[];
const publicDir = join(process.cwd(), 'public');

describe('question bank', () => {
  it('contains exactly 70 questions with sequential unique IDs', () => {
    expect(typedQuestions).toHaveLength(70);
    const ids = typedQuestions.map((question) => question.id);
    expect(new Set(ids).size).toBe(70);
    expect(ids).toEqual(Array.from({ length: 70 }, (_, index) => index + 1));
  });

  it('keeps the required category distribution and order', () => {
    const counts = TYPES.map((type) => typedQuestions.filter((q) => q.type === type).length);
    expect(counts).toEqual([20, 15, 15, 5, 5, 10]);

    const order = typedQuestions.map((question) => question.type);
    const ranges: [QuestionType, number, number][] = [
      ['vocabulary', 0, 20],
      ['grammar', 20, 35],
      ['reading', 35, 50],
      ['story_image', 50, 55],
      ['match_image', 55, 60],
      ['listening', 60, 70],
    ];
    for (const [type, start, end] of ranges) {
      expect(order.slice(start, end).every((value) => value === type)).toBe(true);
    }
  });

  it('gives every question four non-empty, unique options and a valid key', () => {
    for (const question of typedQuestions) {
      expect(Object.keys(question.options).sort()).toEqual(['A', 'B', 'C', 'D']);
      const values = CHOICES.map((choice) => question.options[choice]);
      for (const value of values) {
        expect(typeof value).toBe('string');
        expect(value.trim().length).toBeGreaterThan(0);
      }
      expect(new Set(values).size).toBe(4);
      expect(CHOICES).toContain(question.answer);
      expect(question.prompt.trim().length).toBeGreaterThan(0);
      expect(question.explanation.trim().length).toBeGreaterThan(0);
    }
  });

  it('links every reading question to a valid passage, three per passage', () => {
    const passageIds = passages.map((passage) => passage.id);
    const reading = typedQuestions.filter((question) => question.type === 'reading');
    expect(reading).toHaveLength(15);
    for (const question of reading) {
      expect(passageIds).toContain(question.passageId);
    }
    for (const id of passageIds) {
      expect(reading.filter((question) => question.passageId === id)).toHaveLength(3);
    }
  });

  it('resolves every image/audio reference and referenced file exists', () => {
    const sceneIds = storyScenes.map((scene) => scene.id);
    const matchingIds = matchingScenes.map((scene) => scene.id);
    const audioIds = listeningScripts.map((script) => script.id);

    for (const question of typedQuestions) {
      if (question.type === 'story_image') {
        expect(sceneIds).toContain(question.sceneId);
      }
      if (question.type === 'match_image') {
        expect(matchingIds).toContain(question.matchingId);
        const scene = matchingScenes.find((item) => item.id === question.matchingId)!;
        for (const choice of CHOICES) {
          const file = join(
            publicDir,
            'images',
            'matching',
            `${scene.id.toLowerCase()}-${choice.toLowerCase()}.svg`
          );
          expect(existsSync(file), `missing ${file}`).toBe(true);
          expect(statSync(file).size).toBeGreaterThan(500);
        }
      }
      if (question.type === 'listening') {
        expect(audioIds).toContain(question.audioId);
      }
    }

    for (const scene of storyScenes) {
      const file = join(publicDir, scene.path);
      expect(existsSync(file), `missing ${file}`).toBe(true);
      expect(statSync(file).size).toBeGreaterThan(2000);
      expect(scene.panels).toHaveLength(4);
    }
  });

  it('ships exactly ten playable MP3 files referenced by the scripts', () => {
    const files = listeningScripts.map((script) => join(publicDir, script.file));
    expect(files).toHaveLength(10);
    for (const file of files) {
      expect(existsSync(file), `missing ${file}`).toBe(true);
      const size = statSync(file).size;
      expect(size).toBeGreaterThan(5000);
      expect(file.toLowerCase().endsWith('.mp3')).toBe(true);
    }
  });

  it('has different visuals for each option within a matching set', () => {
    for (const scene of matchingScenes) {
      const descriptions = CHOICES.map((choice) => scene.images[choice]);
      expect(new Set(descriptions).size).toBe(4);
      const bytes = CHOICES.map((choice) => {
        const file = join(publicDir, 'images', 'matching', `${scene.id.toLowerCase()}-${choice.toLowerCase()}.svg`);
        return statSync(file).size;
      });
      expect(new Set(bytes).size).toBeGreaterThan(1);
    }
  });

  it('does not duplicate a question prompt + option set', () => {
      // matching questions share the generic "choose the picture" prompt by design,
      // so their identity comes from the matchingId instead of the prompt.
      const signatures = typedQuestions.map((question) =>
        question.type === 'match_image'
          ? `match:${question.matchingId}`
          : `${question.prompt}::${CHOICES.map((choice) => question.options[choice]).join('|')}`
      );
      expect(new Set(signatures).size).toBe(typedQuestions.length);
    });
});