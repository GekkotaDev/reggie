import { type Node } from "$lib/cfg";
import { match } from "ts-pattern";

const alphabet: readonly string[] = "abcdefghijklmnopqrstuvwxyz"
  .toLocaleUpperCase()
  .split("")
  .filter((letter) => letter !== "S");

const fromAst = (ast: Node[]) => {
  const variables = alphabet.toReversed();

  const map: [string, string][] = ast.map((node) =>
    match(node)
      .with({ type: "Closure" }, ({ union }): [string, string] => {
        const variable = variables.pop();
        if (variable === undefined) return ["", ""];

        return [
          variable,
          union.choices
            .map((choice) =>
              match(choice)
                .with(
                  { type: "Group" },
                  ({ matches }) =>
                    matches.map(({ letter }) => `${letter}`).join("") +
                    variable,
                )
                .otherwise(() => ""),
            )
            .filter((choice) => choice !== "")
            .join("|") +
            `|${variable}` +
            "|ʌ",
        ];
      })
      .with({ type: "Union" }, ({ choices }): [string, string] => {
        const variable = variables.pop();
        if (variable === undefined) return ["", ""];

        return [
          variable,
          choices
            .map((choice) =>
              match(choice)
                .with({ type: "Group" }, ({ matches }) =>
                  matches.map(({ letter }) => letter).join(""),
                )
                .otherwise(() => ""),
            )
            .filter((choice) => choice !== "")
            .join("|"),
        ];
      })
      .otherwise(() => ["", ""]),
  );

  const latex = [
    `•\tS → ${map.map(([variable]) => variable).join("")}`,
    ...map.map(([variable, string]) =>
      string
        .split("|")
        .map((choice) => `•\t${variable} → ${choice}`)
        .join("\n"),
    ),
  ];

  return latex.join("\n");
};

const toLatex = () => {};

export const createCfg = {
  fromAst,
  toLatex,
};
