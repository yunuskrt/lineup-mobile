export type RuntimeCheck = {
  label: string;
  // What Node gives; Hermes must match it
  expected: string;
  run: () => string;
};

export type RuntimeResult = {
  label: string;
  expected: string;
  actual: string;
  ok: boolean;
};
