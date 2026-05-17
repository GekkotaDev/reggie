import type { Char } from "refa";
import { CharSet, DFA, Words } from "refa";

type Transition = {
  strings: string;
  charSet: Set<Char>;
  node: DFA.Node;
};

export type DFAMeta = {
  id: number;
  type: "initial" | "final" | "node";
  transitions: Transition[];
};

export type DFAMap = Map<DFA.Node, DFAMeta>;

export type DFATransitionInstruction = {
  createTransition: () => string;
  meta: DFAMeta;
};

const createDFAMap = (dfa: DFA): DFAMap => {
  const map = new Map<DFA.Node, DFAMeta>();

  for (const node of dfa.nodes()) {
    const type =
      node === dfa.initial
        ? ("initial" as const)
        : dfa.finals.has(node)
          ? ("final" as const)
          : ("node" as const);

    const transitions = [...node.out.entries()].map(([word, node]) => ({
      strings: Words.fromUnicodeToString([
        ...CharSet.fromRange(word.max, word).characters(),
      ]),
      charSet: new Set(CharSet.fromRange(word.max, word).characters()),
      node,
    }));

    map.set(node, { id: map.size, type, transitions });
  }

  return map;
};

const toMermaid = (dfa: DFA, map: Map<DFA.Node, DFAMeta>): string => {
  const flowchartNodes = [...map.entries()].map(([node, { id }]) =>
    node === dfa.initial
      ? `n${id}(("-"))`
      : dfa.finals.has(node)
        ? `n${id}(("+"))`
        : `n${id}((${id}))`,
  );

  const edgeNodes = [...map.entries()].flatMap(([, { id, transitions }]) =>
    transitions.map(
      ({ strings, node }) =>
        `n${id} active-edge-${map.get(node)!.id}@-->|"${strings}"| n${map.get(node)!.id}`,
    ),
  );

  return /* mermaid */ `
classDef active-edge stroke: red;

%% Nodes
${flowchartNodes.join("\n")}

%% Edges
${edgeNodes.join("\n")}
  `;
};

export const toAnimationStack =
  (initial: DFA.Node, map: DFAMap) =>
  (input: string): DFATransitionInstruction[] => {
    const query = input.split("");
    const currentWord = query.shift();
    const node = map.get(initial);

    if (node === undefined) return [];

    const animationStack: DFATransitionInstruction[] = [
      // {
      //   createTransition: () => `class active-edge-${node.id} active-edge`,
      //   meta: node,
      // },
      {
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

    return [
      ...animationStack,
      ...toAnimationStack(transition.node, map)(query.join("")),
    ];
  };

export const createDFA = {
  map: createDFAMap,

  toMermaid,
  toAnimationStack,
};
