// Floating texts (Hindi/Sanskrit only, per approved design)
export const RAM_FLOAT_TEXTS = ['राम', 'जय राम', 'ॐ राम', 'श्री राम', 'जय सियाराम'];

// ALL names of Shri Ram recognised in वाणी जप — longest first matters for counting
export const RAM_TRIGGERS = [
  // multi-word Hindi
  'जय श्री राम', 'जय सिया राम', 'जय सियाराम', 'श्री राम', 'जय राम', 'हरे राम', 'हे राम', 'सीता राम',
  // single-word Hindi
  'सियाराम', 'सीताराम', 'रघुपति', 'रघुवर', 'राघव', 'रघुनाथ', 'रामचंद्र', 'राम',
  // multi-word Roman
  'jai shri ram', 'jai shree ram', 'jai siya ram', 'jai siyaram', 'shri ram', 'shree ram',
  'jai ram', 'jai raam', 'hare ram', 'hare rama', 'hey ram', 'he ram', 'sita ram', 'seeta ram',
  // single-word Roman
  'siyaram', 'sitaram', 'seetaram', 'raghupati', 'raghuvar', 'raghav', 'raghunath',
  'ramchandra', 'ramachandra', 'raam', 'rama', 'ram',
];

export const getRandomRamText = () =>
  RAM_FLOAT_TEXTS[Math.floor(Math.random() * RAM_FLOAT_TEXTS.length)];

// Count Ram occurrences in a transcript — longest match first, no double counting
export function countRamOccurrences(transcript: string): number {
  let text = ' ' + transcript.toLowerCase().trim().replace(/[.,!?]/g, '') + ' ';
  const sorted = [...RAM_TRIGGERS].sort((a, b) => b.length - a.length);
  let count = 0;
  for (const trigger of sorted) {
    const t = ' ' + trigger + ' ';
    let idx = text.indexOf(t);
    while (idx !== -1) {
      count++;
      text = text.slice(0, idx) + ' '.repeat(t.length) + text.slice(idx + t.length);
      idx = text.indexOf(t);
    }
  }
  return count;
}
