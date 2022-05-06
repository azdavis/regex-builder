export function classNames(...xs: (string | null)[]): string {
  const toJoin = [];
  for (const x of xs) {
    if (typeof x === "string") {
      toJoin.push(x);
    }
  }
  return toJoin.join(" ");
}
