/**
 * Pushdown Automata
 *
 * In converting a Definite Finite Automaton (DFA) into a PDA, there are some
 * rules one could presume based on observed patterns. It may perhaps not be
 * the most accurate implementation but it should be a good enough guide.
 *
 * Observed properties.
 *
 * 1. All PDAs begin with a START instruction followed by the READ instruction.
 *
 * 2. The first READ instruction maps to the (-) node in a DFA.
 *
 * 3. Each READ instruction is followed by a PUSH or POP.
 *
 * 4. Every time that delta is read, POP.
 *
 * 5. The language of a PDA only has two tokens {x, y}
 *    a. PUSH on x.
 *    b. POP on y.
 *
 * 6. (+) = ACCEPT
 *
 * 7. Trap states = REJECT; in other words, default to REJECT for transitions
 *    where it is not an accepted READ.
 */
import type { Char } from "refa";
import { CharSet, DFA, Words } from "refa";

import type { DFAMeta, DFAMap } from "$lib/utils/automata/dfa";

export type PDATransitionInstruction = {
  stack: string[];
  createTransition: () => string;
  meta: DFAMeta;
};

const fromPDA = (dfa: DFAMap) => {};

const toMermaid = (
  dfa: DFA,
  map: DFAMap,
  options: {
    characters: {
      push: string;
      pop: string;
    };
  },
): string => {
  const stack: string[] = [];

  console.log(typeof map.entries());

  const flowchartNodes = map
    .entries()
    .map(([, { id }]) => `n${id}@{ shape: diamond, label: "READ" }`)
    .toArray();

  const startNodes = map
    .entries()
    .toArray()
    .flatMap(([, { type, id }]) =>
      type === "initial" ? `n-start-${id}((START)) --> n${id}` : "",
    )
    .filter((string) => string !== "");

  const transitions = map
    .entries()
    .toArray()
    .flatMap(([, { id, transitions }]) =>
      transitions.flatMap(({ strings, node }) => {
        return strings.split("").map((character) => {
          if (character.startsWith(options.characters.push)) {
            stack.push(character);
            return [
              `n${id} -->|"${character}"| npush-${id}-${map.get(node)!.id}[PUSH] --> n${map.get(node)!.id}`,
            ];
          }

          if (character.startsWith(options.characters.pop) && stack.length) {
            stack.pop();
            return [
              `n${id} -->|"${character}"| npop-${id}-${map.get(node)!.id}[POP] --> n${map.get(node)!.id}`,
            ];
          }

          if (character.startsWith(options.characters.pop)) {
            return [
              `n${id} -->|"Δ"| npop-${id}-Δ[POP] --> n${map.get(node)!.id}`,
              `n${id} -->|"${character}"| npop-${id}-${map.get(node)!.id}[POP] --> n${map.get(node)!.id}`,
            ];
          }

          return [
            `n${id} -->|"${character}"| npop-${id}-${map.get(node)!.id}[POP] --> n${map.get(node)!.id}`,
          ];
        });
      }),
    );

  const endNodes = map
    .entries()
    .toArray()
    .flatMap(([, { type, id }]) =>
      type === "final"
        ? `n${id} -->|"Δ"| n${id}-cleanup[POP] --> n${id}-accept((ACCEPTED))`
        : "",
    )
    .filter((string) => string !== "");

  return /* mermaid */ `
%% Nodes
${flowchartNodes.join("\n")}

%% Transitions
${startNodes.join("\n")}
${transitions.join("\n")}
${endNodes.join("\n")}
  `;
};

export const toAnimationStack =
  (
    initial: DFA.Node,
    map: DFAMap,
    options: {
      characters: {
        push: string;
        pop: string;
      };
    },
  ) =>
  (input: string, stack: string[] = []): PDATransitionInstruction[] => {
    const query = input.split("");
    const currentWord = query.shift();
    const node = map.get(initial);

    if (node === undefined) return [];

    const animationStack: PDATransitionInstruction[] = [
      // {
      //   createTransition: () => `class active-edge-${node.id} active-edge`,
      //   meta: node,
      // },
      // * READ instruction
      {
        stack: [...stack],
        createTransition: () =>
          `style n${node.id} fill:#f00,color:white,font-weight:bold,stroke-width:2px,stroke:yellow`,
        meta: node,
      },
    ];

    if (currentWord === undefined) return animationStack;

    const transition = node.transitions.find(({ charSet }) =>
      charSet.has(Words.fromStringToUnicode(currentWord).at(0)!),
    );

    if (transition === undefined) return animationStack;

    if (currentWord === options.characters.push) {
      stack.push(currentWord);

      animationStack.push({
        stack: [...stack],
        createTransition: () =>
          `style npush-${node.id}-${map.get(transition.node)!.id} fill:#f00,color:white,font-weight:bold,stroke-width:2px,stroke:yellow`,
        meta: map.get(transition.node)!,
      });
    }

    if (currentWord === options.characters.pop) {
      stack.pop();
      animationStack.push({
        stack: [...stack],
        createTransition: () =>
          `style npop-${node.id}-${map.get(transition.node)!.id} fill:#f00,color:white,font-weight:bold,stroke-width:2px,stroke:yellow`,
        meta: map.get(transition.node)!,
      });
    }

    return [
      ...animationStack,
      ...toAnimationStack(
        transition.node,
        map,
        options,
      )(query.join(""), [...stack]),
    ];
  };

export const createPDA = {
  toMermaid,
  toAnimationStack,
};
