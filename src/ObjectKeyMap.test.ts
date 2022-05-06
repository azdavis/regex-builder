import { ObjectKeyMap } from "./ObjectKeyMap";

it("works", () => {
  const m = new ObjectKeyMap();
  const a = {};
  const b = {};
  expect(m.get(a)).toBe(m.get(a));
  expect(m.get(b)).toBe(m.get(b));
  expect(m.get(a)).not.toBe(m.get(b));
});
