import questionsData from '../data/questions.json';
import passagesData from '../data/passages.json';
import storyScenesData from '../data/storyScenes.json';
import matchingScenesData from '../data/matchingScenes.json';
import listeningScriptsData from '../data/listeningScripts.json';
import type {
  ListeningScript,
  MatchingScene,
  Passage,
  Question,
  QuestionType,
  StoryScene,
} from '../types';

export const questions = questionsData as Question[];
export const passages = passagesData as Passage[];
export const storyScenes = storyScenesData as StoryScene[];
export const matchingScenes = matchingScenesData as MatchingScene[];
export const listeningScripts = listeningScriptsData as ListeningScript[];

export const TOTAL_QUESTIONS = questions.length;
export const EXAM_DURATION_SECONDS = 115 * 60;
export const MAX_AUDIO_PLAYS = 2;

export const CATEGORY_LABELS: Record<QuestionType, string> = {
  vocabulary: 'Kosakata',
  grammar: 'Grammar',
  reading: 'Reading',
  story_image: 'Gambar',
  match_image: 'Gambar',
  listening: 'Listening',
};

/** Distinct labels for summaries, where two "Gambar" cards would be ambiguous. */
export const CATEGORY_DETAIL_LABELS: Record<QuestionType, string> = {
  vocabulary: 'Kosakata',
  grammar: 'Grammar',
  reading: 'Reading',
  story_image: 'Cerita bergambar',
  match_image: 'Cocokkan gambar',
  listening: 'Listening',
};

export const CATEGORY_ORDER: QuestionType[] = [
  'vocabulary',
  'grammar',
  'reading',
  'story_image',
  'match_image',
  'listening',
];

export const CATEGORY_COUNTS: Record<QuestionType, number> = {
  vocabulary: 20,
  grammar: 15,
  reading: 15,
  story_image: 5,
  match_image: 5,
  listening: 10,
};

export const getPassage = (id: string | undefined) =>
  passages.find((passage) => passage.id === id);

export const getStoryScene = (id: string | undefined) =>
  storyScenes.find((scene) => scene.id === id);

export const getMatchingScene = (id: string | undefined) =>
  matchingScenes.find((scene) => scene.id === id);

export const getListeningScript = (id: string | undefined) =>
  listeningScripts.find((script) => script.id === id);

export const getQuestion = (id: number) => questions.find((question) => question.id === id);