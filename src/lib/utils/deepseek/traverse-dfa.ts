import { type Word, DFA, NFA, Words, JS } from "refa";

  function toNFA(regex: RegExp): NFA {
    const { expression, maxCharacter } = JS.Parser.fromLiteral(regex).parse();
    return NFA.fromRegex(expression, { maxCharacter });
  }

  function toDFA(regex: RegExp): DFA {
    return DFA.fromFA(toNFA(regex));
  }

function traverseDFA(dfa: DFA, word: Word) {
    let currentNode = dfa.initial;
    console.log("Initial state:", currentNode);

    for (const char of word) {
        // 'out' is a CharMap that maps a character to the next DFA.Node
        const nextNode = currentNode.out.get(char);
        if (!nextNode) {
            // This should not happen in a valid DFA, but it's safe to check
            console.log(`No transition for character '${String.fromCodePoint(char)}'`);
            return false;
        }
        console.log(`[${String.fromCodePoint(char)}] →`, nextNode);
        currentNode = nextNode;
    }

    // After processing all characters, check if the final node is an accepting state
    const isAccepted = dfa.finals.has(currentNode);
    console.log("Final state:", currentNode, "Accepted:", isAccepted);
    return isAccepted;
}

const dfa = toDFA(/ab/);
const word = Words.fromStringToUTF16("ab");
traverseDFA(dfa, word); // true
