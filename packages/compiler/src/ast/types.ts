export type Nodes = //
  Closure | Union | Group | Match;

export type Closure = {
  readonly type: "Closure";
  readonly union: Union;
};

export type Union = {
  readonly type: "Union";
  readonly choices: Nodes[];
};

export type Group = {
  readonly type: "Group";
  readonly matches: Match[];
};

export type Match = {
  readonly type: "Match";
  readonly letter: string;
};
