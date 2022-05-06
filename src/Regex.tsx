import type { ReactElement } from "react";
import { absurd } from "./absurd";
import { classNames } from "./classNames";
import type { IdGen } from "./id";
import {
  choosing,
  type RegexMode,
  type RegexT,
  type SetElemT,
  type SetModeT,
} from "./RegexT";

type RegexChange = (val: RegexT | null) => void;

interface RegexProps {
  g: IdGen;
  val: RegexT;
  onChange: RegexChange;
}

export function Regex({ g, val, onChange }: RegexProps): ReactElement {
  const cn = classNames("round-box", val.t === "choosing" ? "bg-red" : null);
  return (
    <div className={cn}>
      {regexImpl(g, val, onChange)}
      <button onClick={() => onChange(null)}>Delete</button>
    </div>
  );
}

function regexImpl(g: IdGen, val: RegexT, onChange: RegexChange): ReactElement {
  switch (val.t) {
    case "begin":
      return <>The beginning of the string</>;
    case "end":
      return <>The end of the string</>;
    case "lit":
      return (
        <>
          The exact text{" "}
          <input
            type="text"
            value={val.s}
            onChange={(ev) =>
              onChange({ t: "lit", s: ev.target.value, id: val.id })
            }
          />
        </>
      );
    case "alt":
      return (
        <>
          Any of the following:{" "}
          {val.rs.map((r, idx) => (
            <Regex
              key={r.id.toNumber()}
              g={g}
              val={r}
              onChange={(r) => {
                const rs = [...val.rs];
                if (r === null) {
                  rs.splice(idx, 1);
                } else {
                  rs[idx] = r;
                }
                onChange({ t: "alt", rs, id: val.id });
              }}
            />
          ))}
          <button
            onClick={() =>
              onChange({
                t: "alt",
                rs: [...val.rs, choosing(g)],
                id: g.gen(),
              })
            }
          >
            Add another regex
          </button>
        </>
      );
    case "seq":
      return (
        <>
          All of the following, in sequential order:{" "}
          {val.rs.map((r, idx) => (
            <Regex
              key={r.id.toNumber()}
              g={g}
              val={r}
              onChange={(r) => {
                const rs = [...val.rs];
                if (r === null) {
                  rs.splice(idx, 1);
                } else {
                  rs[idx] = r;
                }
                onChange({ t: "seq", rs, id: val.id });
              }}
            />
          ))}
          <button
            onClick={() =>
              onChange({ t: "seq", rs: [...val.rs, choosing(g)], id: g.gen() })
            }
          >
            Add another regex
          </button>
        </>
      );
    case "opt":
      return (
        <>
          Optionally:{" "}
          <Regex
            g={g}
            val={val.r}
            onChange={(r) =>
              onChange({ t: "opt", r: r ?? choosing(g), id: g.gen() })
            }
          />
        </>
      );
    case "zeroOrMore":
      return (
        <>
          Zero or more of:{" "}
          <Regex
            g={g}
            val={val.r}
            onChange={(r) =>
              onChange({ t: "zeroOrMore", r: r ?? choosing(g), id: g.gen() })
            }
          />
        </>
      );
    case "oneOrMore":
      return (
        <>
          One or more of:{" "}
          <Regex
            g={g}
            val={val.r}
            onChange={(r) =>
              onChange({ t: "oneOrMore", r: r ?? choosing(g), id: g.gen() })
            }
          />
        </>
      );
    case "set": {
      return (
        <>
          <SetMode
            val={val.mode}
            onChange={(mode) =>
              onChange({ t: "set", mode, es: val.es, id: g.gen() })
            }
          />
          {val.es.map((se, idx) => (
            <SetElem
              g={g}
              key={se.id.toNumber()}
              val={se}
              onChange={(newSI) => {
                const es = [...val.es];
                if (newSI === null) {
                  es.splice(idx, 1);
                } else {
                  es[idx] = newSI;
                }
                onChange({ t: "set", mode: val.mode, es, id: g.gen() });
              }}
            />
          ))}
          <button
            onClick={() =>
              onChange({
                t: "set",
                mode: val.mode,
                es: [...val.es, { t: "char", c: "a", id: g.gen() }],
                id: val.id,
              })
            }
          >
            Add single character
          </button>
          <button
            onClick={() =>
              onChange({
                t: "set",
                mode: val.mode,
                es: [
                  ...val.es,
                  { t: "range", begin: "a", end: "z", id: g.gen() },
                ],
                id: val.id,
              })
            }
          >
            Add range of characters
          </button>
        </>
      );
    }
    case "choosing":
      return (
        <>
          <select
            value={val.mode}
            onChange={(ev) => {
              onChange({
                t: "choosing",
                mode: toRegexMode(ev.target.value),
                id: g.gen(),
              });
            }}
          >
            <option value="begin">The beginning of the string</option>
            <option value="end">The end of the string</option>
            <option value="lit">Exact text</option>
            <option value="alt">Any of the given regexes</option>
            <option value="seq">All of the given regexes in order</option>
            <option value="opt">An optional regex</option>
            <option value="zeroOrMore">Zero or more of a regex</option>
            <option value="oneOrMore">One or more of a regex</option>
            <option value="set">
              A set of allowed or disallowed characters
            </option>
          </select>
          <button onClick={() => onChange(mkDefaultRegex(g, val.mode))}>
            Choose
          </button>
        </>
      );
    default:
      return absurd(val);
  }
}

type SetElemChange = (val: SetElemT | null) => void;

interface SetElemProps {
  g: IdGen;
  val: SetElemT;
  onChange: SetElemChange;
}

function SetElem({ g, val, onChange }: SetElemProps): ReactElement {
  return (
    <div className="round-box">
      {SetElemImpl(g, val, onChange)}
      <button onClick={() => onChange(null)}>Delete</button>
    </div>
  );
}

function SetElemImpl(
  g: IdGen,
  val: SetElemT,
  onChange: SetElemChange,
): ReactElement {
  switch (val.t) {
    case "char":
      return (
        <>
          Exactly{" "}
          <input
            type="text"
            value={val.c}
            onChange={(ev) =>
              onChange({ t: "char", c: ev.target.value, id: g.gen() })
            }
          />
        </>
      );
    case "range":
      return (
        <>
          In the range from{" "}
          <input
            type="text"
            value={val.begin}
            onChange={(ev) =>
              onChange({
                t: "range",
                begin: ev.target.value,
                end: val.end,
                id: g.gen(),
              })
            }
          />{" "}
          to{" "}
          <input
            type="text"
            value={val.end}
            onChange={(ev) =>
              onChange({
                t: "range",
                begin: val.begin,
                end: ev.target.value,
                id: g.gen(),
              })
            }
          />
        </>
      );
    default:
      return absurd(val);
  }
}

interface SetModeProps {
  val: SetModeT;
  onChange: (val: SetModeT) => void;
}

function SetMode({ val, onChange }: SetModeProps): ReactElement {
  switch (val) {
    case "anyOf":
      return (
        <>
          Any character that is:
          <button onClick={() => onChange("noneOf")}>Switch mode</button>
        </>
      );
    case "noneOf":
      return (
        <>
          Any character except those that are:
          <button onClick={() => onChange("anyOf")}>Switch mode</button>
        </>
      );
    default:
      return absurd(val);
  }
}

function mkDefaultRegex(g: IdGen, mode: RegexMode): RegexT {
  switch (mode) {
    case "begin":
      return { t: "begin", id: g.gen() };
    case "end":
      return { t: "end", id: g.gen() };
    case "lit":
      return { t: "lit", s: "foo", id: g.gen() };
    case "alt":
      return {
        t: "alt",
        rs: [
          { t: "lit", s: "foo", id: g.gen() },
          { t: "lit", s: "bar", id: g.gen() },
        ],
        id: g.gen(),
      };
    case "seq":
      return {
        t: "seq",
        rs: [
          { t: "lit", s: "foo", id: g.gen() },
          { t: "lit", s: "bar", id: g.gen() },
        ],
        id: g.gen(),
      };
    case "opt":
      return { t: "opt", r: { t: "lit", s: "foo", id: g.gen() }, id: g.gen() };
    case "zeroOrMore":
      return {
        t: "zeroOrMore",
        r: { t: "lit", s: "foo", id: g.gen() },
        id: g.gen(),
      };
    case "oneOrMore":
      return {
        t: "oneOrMore",
        r: { t: "lit", s: "foo", id: g.gen() },
        id: g.gen(),
      };
    case "set":
      return {
        t: "set",
        mode: "anyOf",
        es: [{ t: "range", begin: "a", end: "z", id: g.gen() }],
        id: g.gen(),
      };
    default:
      return absurd(mode);
  }
}

function toRegexMode(s: string): RegexMode {
  switch (s) {
    case "begin":
    case "end":
    case "lit":
    case "alt":
    case "seq":
    case "opt":
    case "zeroOrMore":
    case "oneOrMore":
    case "set":
      return s;
    default:
      throw new TypeError("how could this happen");
  }
}
