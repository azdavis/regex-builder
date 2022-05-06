import { useState, type ReactElement } from "react";
import { Regex } from "./Regex";
import { choosing, showRegex, type RegexT } from "./RegexT";

const small: RegexT = {
  t: "seq",
  rs: [
    { t: "begin" },
    { t: "lit", s: "foo" },
    { t: "set", mode: "anyOf", items: [{ t: "range", begin: "0", end: "9" }] },
  ],
};

const big: RegexT = {
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
  const [val, setVal] = useState(small);
  function onChange(x: RegexT | null) {
    if (x === null) {
      setVal(choosing);
    } else {
      setVal(x);
    }
  }
  const s = showRegex(val);
  return (
    <>
      <h1>Regex Builder</h1>
      <p>
        By <a href="https://azdavis.net">azdavis</a>
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
            <li>React keys for mapping are not set</li>
            <li>No support for capture groups</li>
            <li>
              UI does not show how components in the builder map to components
              in the finished regex
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
      <button onClick={() => onChange(small)}>Use a small sample</button>
      <button onClick={() => onChange(big)}>Use a big sample</button>
      <Regex val={val} onChange={onChange} />
    </>
  );
}
