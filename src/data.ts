import type { ActivityInfo, AgeBand, ActivityId } from './types';

export const AGE_BANDS: AgeBand[] = ['5–6', '7–8', '9–10'];

export const activities: ActivityInfo[] = [
  { id: 'patterns', title: 'Pattern Quarry', kicker: 'Notice & predict', description: 'Find what belongs next in a line of shapes.', ages: AGE_BANDS, symbol: '■ ● ▲', tone: 'moss' },
  { id: 'keys', title: 'Key Trail', kicker: 'Type with care', description: 'Follow short trails from single keys to full sentences.', ages: AGE_BANDS, symbol: 'A S D', tone: 'sky' },
  { id: 'logic', title: 'Logic Bridges', kicker: 'Plan a route', description: 'Use each clue to choose the safe next step.', ages: AGE_BANDS, symbol: '◇—◇', tone: 'lichen' },
  { id: 'spelling', title: 'Word Workshop', kicker: 'Build a word', description: 'Put mixed-up letters back into useful words.', ages: AGE_BANDS, symbol: 'M O S S', tone: 'clay' },
  { id: 'numbers', title: 'Number Stones', kicker: 'See quantity', description: 'Match groups, sums, and number relationships.', ages: AGE_BANDS, symbol: '7 + 5', tone: 'stone' },
  { id: 'drawing', title: 'Moss Sketchbook', kicker: 'Make & imagine', description: 'Draw freely with a small set of sturdy tools.', ages: AGE_BANDS, symbol: '⌁ ✦', tone: 'ink' },
];

export const patternRounds: Record<AgeBand, Array<{ sequence: string[]; options: string[]; answer: string }>> = {
  '5–6': [
    { sequence: ['●', '■', '●', '■'], options: ['●', '▲', '■'], answer: '●' },
    { sequence: ['▲', '▲', '●', '▲', '▲'], options: ['●', '■', '▲'], answer: '●' },
    { sequence: ['■', '●', '▲', '■', '●'], options: ['▲', '●', '■'], answer: '▲' },
  ],
  '7–8': [
    { sequence: ['●', '■', '■', '●', '■', '■'], options: ['●', '▲', '■'], answer: '●' },
    { sequence: ['▲', '●', '▲', '■', '▲', '●'], options: ['▲', '■', '●'], answer: '▲' },
    { sequence: ['■', '●', '●', '■', '■', '●'], options: ['●', '■', '▲'], answer: '●' },
  ],
  '9–10': [
    { sequence: ['2', '4', '8', '16'], options: ['18', '24', '32'], answer: '32' },
    { sequence: ['1', '4', '9', '16'], options: ['20', '25', '32'], answer: '25' },
    { sequence: ['3', '6', '5', '10', '9'], options: ['12', '18', '20'], answer: '18' },
  ],
};

export const keyPhrases: Record<AgeBand, string[]> = {
  '5–6': ['moss', 'red fox', 'sun and rain'],
  '7–8': ['quiet keys', 'plants need light', 'I can learn offline.'],
  '9–10': ['Accuracy comes before speed.', 'Small steps build strong skills.', 'A curious mind keeps exploring.'],
};

export const logicRounds: Record<AgeBand, Array<{ clue: string; options: string[]; answer: string }>> = {
  '5–6': [
    { clue: 'Mina is taller than Bo. Who is shorter?', options: ['Mina', 'Bo', 'Same'], answer: 'Bo' },
    { clue: 'The circle is inside the box. What is outside?', options: ['Circle', 'Box', 'Neither'], answer: 'Neither' },
    { clue: 'Take one step after 3.', options: ['2', '4', '5'], answer: '4' },
  ],
  '7–8': [
    { clue: 'All moss is green. This patch is moss. What must be true?', options: ['It is green', 'It is tall', 'It is dry'], answer: 'It is green' },
    { clue: 'Ada left before Ben. Ben left before Cy. Who left last?', options: ['Ada', 'Ben', 'Cy'], answer: 'Cy' },
    { clue: 'Only even stones are safe.', options: ['13', '18', '21'], answer: '18' },
  ],
  '9–10': [
    { clue: 'No red tiles are round. Tile A is round. What follows?', options: ['A is not red', 'A is red', 'Nothing'], answer: 'A is not red' },
    { clue: 'If it rains, the path is wet. The path is dry. What follows?', options: ['It did not rain', 'It rained', 'No conclusion'], answer: 'It did not rain' },
    { clue: 'Exactly one sign tells the truth. A says “B is true.” B says “Both are false.”', options: ['A is true', 'B is true', 'Both are true'], answer: 'A is true' },
  ],
};

export const spellingRounds: Record<AgeBand, Array<{ scramble: string; answer: string; clue: string }>> = {
  '5–6': [{ scramble: 'T A C', answer: 'cat', clue: 'A pet that purrs' }, { scramble: 'N U S', answer: 'sun', clue: 'Bright in the sky' }, { scramble: 'G U B', answer: 'bug', clue: 'A tiny crawler' }],
  '7–8': [{ scramble: 'T N A L P', answer: 'plant', clue: 'It grows toward light' }, { scramble: 'D G E R I B', answer: 'bridge', clue: 'It crosses over water' }, { scramble: 'K O O B', answer: 'book', clue: 'Pages you can read' }],
  '9–10': [{ scramble: 'S U O I R U C', answer: 'curious', clue: 'Eager to know more' }, { scramble: 'N T T A E R P', answer: 'pattern', clue: 'Something that repeats' }, { scramble: 'E G A R U O C', answer: 'courage', clue: 'Strength when something is hard' }],
};

export const numberRounds: Record<AgeBand, Array<{ question: string; options: string[]; answer: string }>> = {
  '5–6': [{ question: '● ● ● plus ● ● is…', options: ['4', '5', '6'], answer: '5' }, { question: 'Which is one less than 9?', options: ['7', '8', '10'], answer: '8' }, { question: 'Which group is greatest?', options: ['3 stones', '7 stones', '5 stones'], answer: '7 stones' }],
  '7–8': [{ question: '14 − 6 = ?', options: ['7', '8', '9'], answer: '8' }, { question: 'Which equals 24?', options: ['6 × 4', '8 × 2', '20 + 2'], answer: '6 × 4' }, { question: 'Half of 18 is…', options: ['8', '9', '10'], answer: '9' }],
  '9–10': [{ question: '3/4 of 20 is…', options: ['12', '15', '16'], answer: '15' }, { question: 'Which number is prime?', options: ['21', '23', '25'], answer: '23' }, { question: 'A 48-page book: 12 pages a day takes…', options: ['3 days', '4 days', '5 days'], answer: '4 days' }],
};

export function activityName(id: ActivityId): string {
  return activities.find((item) => item.id === id)?.title ?? id;
}
