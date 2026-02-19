export const declare =
  <T extends object>(declaration: (constants: Partial<T>) => T) =>
  () =>
    declaration({});
