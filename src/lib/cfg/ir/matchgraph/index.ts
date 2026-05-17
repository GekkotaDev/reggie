import type { Node } from "~/ast/types";

export const compile = (nodes: Node[]) =>
  nodes.map((node) =>
    match(node)
      .with(
        { type: "Closure" },
        ({ union: { choices, ...union }, ...closure }) =>
          ({
            ...closure,
            union: {
              ...union,
              choices: flow((choices: Node[]) => ({
                choices,
              }))(choices),
            },
          }) as const,
      )
      .with({ type: "Union" }, ({ choices }) => {})
      .otherwise((node) => node),
  );
