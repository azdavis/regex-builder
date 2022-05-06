import { useState, type ReactElement } from "react";
import { Regex } from "./Regex";
import { showRegex, type RegexT } from "./RegexT";

const init: RegexT = {
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
  function onChange(x: RegexT | null) {
    if (x) {
      setVal(x);
    } else {
      setVal({ t: "choosing", mode: "lit" });
    }
  }
  const s = showRegex(val);
  return (
    <>
      <h1>Regex Builder</h1>
      <p>
        Note: This is alpha quality software. Known issues:{" "}
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
        </ul>
      </p>
      <h2>Output</h2>
      {s ? (
        <pre className="round-box">{s}</pre>
      ) : (
        <div className="round-box bg-red">Error: Incomplete regex.</div>
      )}
      <h2>Builder</h2>
      <Regex val={val} onChange={onChange} />
    </>
  );
}
