export class RadixLetterTree {}

export class RadixLetterNode {
  edges: Map<string, RadixLetterNode> = new Map();
  letter: string = "";

  constructor({ letters }: { letters: string[] }) {
    const letter = letters.shift();
    if (letter === undefined) return;
    this.letter = letter;

    const next = letters.shift();
    if (next === undefined) return;
    if (this.edges.has(letter))
  }
}
