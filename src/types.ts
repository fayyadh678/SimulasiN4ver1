export type Choice = 'A' | 'B' | 'C' | 'D';

export type QuestionType =
  | 'vocabulary'
  | 'grammar'
  | 'reading'
  | 'story_image'
  | 'match_image'
  | 'listening';

export type Question = {
  id: number;
  type: QuestionType;
  prompt: string;
  options: Record<Choice, string>;
  answer: Choice;
  explanation: string;
  passageId?: string;
  sceneId?: string;
  matchingId?: string;
  audioId?: string;
};

export type Passage = {
  id: string;
  title: string;
  text: string;
};

export type StoryScene = {
  id: string;
  path: string;
  name: string;
  panels: string[];
  visualQuestion: string;
};

export type MatchingScene = {
  id: string;
  prompt: string;
  images: Record<Choice, string>;
};

export type ListeningScript = {
  id: string;
  file: string;
  task: string;
  script: string;
  speakerNotes: string;
};

export type Answers = Partial<Record<number, Choice>>;

export type AudioPlayCounts = Partial<Record<number, number>>;

export type SessionStatus = 'in_progress' | 'completed';

export type SessionState = {
  schemaVersion: 2;
  status: SessionStatus;
  answers: Answers;
  startedAt: number;
  deadlineAt: number;
  audioPlayCount: AudioPlayCounts;
  completedAt: number | null;
};

export type CategoryScore = {
  type: QuestionType;
  label: string;
  correct: number;
  total: number;
};

export type ScoreSummary = {
  total: number;
  correct: number;
  wrong: number;
  answered: number;
  unanswered: number;
  percent: number;
  byCategory: CategoryScore[];
};