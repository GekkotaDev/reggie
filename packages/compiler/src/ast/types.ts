export type Nodes = //
  Union | Group | Match;

export type Union = {
  readonly closure?: boolean;
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
