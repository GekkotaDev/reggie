export const flatRecurse =
  <T>(init: T) =>
  <R>(map: (value: T, self: (value: T, ...parameters: any[]) => R) => R): R =>
    map(init, map);
