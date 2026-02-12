import type { Tokens } from "~/lexer/types";

export const parse = Object.assign(
  (tokens: Tokens) =>
    match(tokens)
      .with({ "~kind": "GroupBegin" }, () => ({
        edges: new Map([]),
      }))
      .with({ "~kind": "GroupEnd" }, () => {})
      .with({ "~kind": "Closure" }, () => {})
      .with({ "~kind": "Choice" }, () => {})
      .with({ "~kind": "Symbol" }, () => {})
      .exhaustive(),
  {
    grouping: (tokens: Tokens) =>
      match(tokens)
        .with({ "~kind": "GroupBegin" }, (token) => parse(token))
        .with({ "~kind": "GroupEnd" }, () => {})
        .with({ "~kind": "Choice" }, () => {})
        .otherwise(() => ({
          edges: [],
        })),
  },
);

/*
  (aa + bb + b)
  (+ + aa bb a)
 */
