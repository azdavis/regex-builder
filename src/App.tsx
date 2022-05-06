import { useState, type ReactElement } from "react";
import { IdGen } from "./id";
import { Regex } from "./Regex";
import { choosing, showRegex, type RegexT } from "./RegexT";

const small = (g: IdGen): RegexT => ({
  t: "seq",
  rs: [
    { t: "begin", id: g.gen() },
    { t: "lit", s: "foo", id: g.gen() },
    {
      t: "set",
      mode: "anyOf",
      es: [{ t: "range", begin: "0", end: "9", id: g.gen() }],
      id: g.gen(),
    },
  ],
  id: g.gen(),
});

const big = (g: IdGen): RegexT => ({
  t: "seq",
  rs: [
    { t: "begin", id: g.gen() },
    { t: "opt", r: { t: "lit", s: "foo", id: g.gen() }, id: g.gen() },
    { t: "zeroOrMore", r: { t: "lit", s: "bar", id: g.gen() }, id: g.gen() },
    { t: "oneOrMore", r: { t: "lit", s: "quz", id: g.gen() }, id: g.gen() },
    {
      t: "set",
      mode: "anyOf",
      es: [
        { t: "char", c: "a", id: g.gen() },
        { t: "range", begin: "0", end: "9", id: g.gen() },
      ],
      id: g.gen(),
    },
    {
      t: "set",
      mode: "noneOf",
      es: [
        { t: "char", c: "3", id: g.gen() },
        { t: "range", begin: "A", end: "Z", id: g.gen() },
      ],
      id: g.gen(),
    },
    {
      t: "alt",
      rs: [
        { t: "lit", s: "ariel", id: g.gen() },
        { t: "lit", s: "vivian", id: g.gen() },
      ],
      id: g.gen(),
    },
    { t: "end", id: g.gen() },
  ],
  id: g.gen(),
});

export function App(): ReactElement {
  const [g] = useState(() => new IdGen());
  const [val, setVal] = useState(() => small(g));
  function onChange(x: RegexT | null) {
    if (x === null) {
      setVal(choosing(g));
    } else {
      setVal(x);
    }
  }
  const s = showRegex(val);
  return (
    <>
      <h1>Regex Builder</h1>
      <p>
        By <a href="https://azdavis.net">azdavis</a>.{" "}
        <a href="https://github.com/azdavis/regex-builder">Source</a> on GitHub.
      </p>
      <div className="round-box bg-red">
        Note: This is alpha quality software. See details for known issues.
        <details>
          <ul>
            <li>No effort to support Unicode</li>
            <li>
              Characters in literal strings or character sets are not escaped to
              avoid conflicts with regex syntax
            </li>
            <li>No effort is made to handle precedence for regex operators</li>
            <li>Character sets and ranges allow multiple or zero characters</li>
            <li>The UI is not very polished</li>
            <li>No dark mode</li>
            <li>No support for capture groups</li>
            <li>
              UI does not show how components in the builder map to components
              in the finished regex
            </li>
            <li>
              Components that have sub-components do not show an error state
              when containing no sub-components
            </li>
          </ul>
        </details>
      </div>
      <h2>Output</h2>
      {s === null ? (
        <div className="round-box bg-red">Error: Incomplete regex.</div>
      ) : (
        <div className="round-box overflow-wrap-anywhere">
          <code>{s}</code>
        </div>
      )}
      <h2>Builder</h2>
      <button onClick={() => onChange(small(g))}>Use a small sample</button>
      <button onClick={() => onChange(big(g))}>Use a big sample</button>
      <Regex g={g} val={val} onChange={onChange} />
    </>
  );
}
