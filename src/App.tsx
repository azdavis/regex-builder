import { useState, type ReactElement } from "react";
import { Regex } from "./Regex";
import { showRegex, type RegexT } from "./RegexT";

const init: RegexT | null = {
  t: "seq",
  rs: [
    { t: "begin" },
    { t: "opt", r: { t: "lit", s: "foo" } },
    { t: "zeroOrMore", r: { t: "lit", s: "bar" } },
    { t: "oneOrMore", r: { t: "lit", s: "quz" } },
    {
      t: "set",
      mode: "anyOf",
      items: [
        { t: "char", c: "a" },
        { t: "range", begin: "0", end: "9" },
      ],
    },
    {
      t: "set",
      mode: "noneOf",
      items: [
        { t: "char", c: "3" },
        { t: "range", begin: "A", end: "Z" },
      ],
    },
    {
      t: "alt",
      rs: [
        { t: "lit", s: "ariel" },
        { t: "lit", s: "vivian" },
      ],
    },
    { t: "end" },
  ],
};

export function App(): ReactElement {
  const [val, setVal] = useState(init);
  const s = showRegex(val);
  return (
    <>
      <h1>Regex Builder</h1>
      <p>
        Note: This is alpha quality software. The following don't have great
        support:{" "}
        <ul>
          <li>Unicode</li>
          <li>
            Escaping characters in character sets or literal strings to avoid
            conflicts with regex syntax
          </li>
          <li>Handling precedence between regex operators</li>
          <li>A super polished UI</li>
        </ul>
      </p>
      <h2>Output</h2>
      {s ? (
        <pre className="round-box">{s}</pre>
      ) : (
        <div className="round-box bg-red">Error: Incomplete regex.</div>
      )}
      <h2>Builder</h2>
      <Regex val={val} onChange={setVal} />
    </>
  );
}
