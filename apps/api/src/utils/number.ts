export function toNumberLike(s: string): number | null {
  const t = s.trim();
  const mixed = /^([+-]?\d+)\s+(\d+)\s*\/\s*(\d+)$/;
  const frac  = /^([+-]?\d+)\s*\/\s*(\d+)$/;
  const num   = /^[+-]?\d+(?:\.\d+)?$/;

  if (mixed.test(t)) {
    const [, A, B, C] = t.match(mixed)!;
    const a = Number(A), b = Number(B), c = Number(C);
    if (c === 0) return null;
    const sign = Math.sign(a) === 0 ? 1 : Math.sign(a);
    return a + sign * (b / c);
  }
  if (frac.test(t)) {
    const [, N, D] = t.match(frac)!;
    const a = Number(N), b = Number(D);
    if (b === 0) return null;
    return a / b;
  }
  if (num.test(t)) return Number(t);
  return null;
}

export const equalsWithin = (a: number, b: number, tol = 0) =>
  Math.abs(a - b) <= (Number.isFinite(tol) && tol >= 0 ? tol : 0);
