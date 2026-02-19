import type { Tokens } from "~/lexer/types";

type Graph = {
  [key: string]: string[];
};

export const parse = Object.assign(
  (tokens: Tokens, graph: Graph): Graph =>
    match(tokens)
      .with({ "~kind": "GroupBegin" }, ({}) => ({
        ...(tokens?.next ? parse.grouping({ tokens: tokens.next, graph }) : {}),
      }))
      .with({ "~kind": "GroupEnd" }, () => ({}))
      .with({ "~kind": "Closure" }, () => ({}))
      .with({ "~kind": "Choice" }, () => ({}))
      .with({ "~kind": "Symbol" }, () => ({}))
      .exhaustive(),
  {
    grouping: ({ tokens, graph }: { tokens: Tokens; graph: Graph }): Graph =>
      match(tokens)
        .with({ "~kind": "GroupBegin" }, (token) => parse(token, graph))
        .with({ "~kind": "GroupEnd" }, () => ({}))
        .with({ "~kind": "Choice" }, () => ({}))
        .otherwise((token) => ({
          edges: [],
        })),
  },
);

/*
  (aa + bb + b)
  (+ + aa bb a)
 */
