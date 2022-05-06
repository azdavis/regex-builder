import type { ReactElement } from "react";
import { absurd } from "./absurd";
import { classNames } from "./classNames";
import type { RegexMode, RegexT, SetItemT, SetModeT } from "./RegexT";

interface RegexProps {
  val: RegexT | null;
  onChange: (val: RegexT | null) => void;
}

export function Regex({ val, onChange }: RegexProps): ReactElement {
  const innards = val ? (
    <>
      {regexImpl(val, onChange)}
      <button onClick={() => onChange(null)}>Delete</button>
    </>
  ) : (
    "No regex selected."
  );
  return (
    <div
      className={classNames(
        "round-box",
        val && val.t !== "choosing" ? null : "bg-red",
      )}
    >
      {innards}
    </div>
  );
}

function regexImpl(
  val: RegexT,
  onChange: (val: RegexT | null) => void,
): ReactElement {
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
            onChange={(ev) => {
              console.log("hi");
              onChange({ t: "lit", s: ev.target.value });
            }}
          />
        </>
      );
    case "alt":
      return (
        <>
          Any of the following:{" "}
          {val.rs.map((r, idx) => {
            return (
              <Regex
                val={r}
                onChange={(r) => {
                  const rs = [...val.rs];
                  if (r) {
                    rs[idx] = r;
                  } else {
                    rs.splice(idx, 1);
                  }
                  onChange({ t: "alt", rs });
                }}
              />
            );
          })}
          <button
            onClick={() =>
              onChange({
                t: "alt",
                rs: [...val.rs, { t: "choosing", mode: "lit" }],
              })
            }
          >
            Add new
          </button>
        </>
      );
    case "seq":
      return (
        <>
          All of the following, in sequential order:{" "}
          {val.rs.map((r, idx) => {
            return (
              <Regex
                val={r}
                onChange={(r) => {
                  const rs = [...val.rs];
                  if (r) {
                    rs[idx] = r;
                  } else {
                    rs.splice(idx, 1);
                  }
                  onChange({ t: "seq", rs });
                }}
              />
            );
          })}
          <button
            onClick={() =>
              onChange({
                t: "seq",
                rs: [...val.rs, { t: "choosing", mode: "lit" }],
              })
            }
          >
            Add new
          </button>
        </>
      );
    case "opt":
      return (
        <>
          Optionally:{" "}
          <Regex val={val.r} onChange={(r) => onChange({ t: "opt", r })} />
        </>
      );
    case "zeroOrMore":
      return (
        <>
          Zero or more of:{" "}
          <Regex
            val={val.r}
            onChange={(r) => onChange({ t: "zeroOrMore", r })}
          />
        </>
      );
    case "oneOrMore":
      return (
        <>
          One or more of:{" "}
          <Regex
            val={val.r}
            onChange={(r) => onChange({ t: "oneOrMore", r })}
          />
        </>
      );
    case "set": {
      return (
        <>
          <SetMode
            val={val.mode}
            onChange={(mode) => onChange({ t: "set", mode, items: val.items })}
          />
          {val.items.map((si, idx) => (
            <SetItem
              val={si}
              onChange={(newSI) => {
                const items = [...val.items];
                if (newSI) {
                  items[idx] = newSI;
                } else {
                  items.splice(idx, 1);
                }
                onChange({ t: "set", mode: val.mode, items });
              }}
            />
          ))}
          <button
            onClick={() =>
              onChange({
                t: "set",
                mode: val.mode,
                items: [...val.items, { t: "char", c: "a" }],
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
                items: [...val.items, { t: "range", begin: "a", end: "z" }],
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
              onChange({ t: "choosing", mode: toRegexMode(ev.target.value) });
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
          <button onClick={() => onChange(mkDefaultRegex(val.mode))}>
            Choose
          </button>
        </>
      );
    default:
      return absurd(val);
  }
}

type SetItemChange = (val: SetItemT | null) => void;

interface SetItemProps {
  val: SetItemT;
  onChange: SetItemChange;
}

function SetItem({ val, onChange }: SetItemProps): ReactElement {
  return (
    <div className="round-box">
      {setItemImpl(val, onChange)}
      <button onClick={() => onChange(null)}>Delete</button>
    </div>
  );
}

function setItemImpl(val: SetItemT, onChange: SetItemChange): ReactElement {
  switch (val.t) {
    case "char":
      return (
        <>
          Exactly{" "}
          <input
            type="text"
            value={val.c}
            onChange={(ev) => onChange({ t: "char", c: ev.target.value })}
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
              onChange({ t: "range", begin: ev.target.value, end: val.end })
            }
          />{" "}
          to{" "}
          <input
            type="text"
            value={val.end}
            onChange={(ev) =>
              onChange({ t: "range", begin: val.begin, end: ev.target.value })
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

function mkDefaultRegex(mode: RegexMode): RegexT {
  switch (mode) {
    case "begin":
      return { t: "begin" };
    case "end":
      return { t: "end" };
    case "lit":
      return { t: "lit", s: "foo" };
    case "alt":
      return {
        t: "alt",
        rs: [
          { t: "lit", s: "foo" },
          { t: "lit", s: "bar" },
        ],
      };
    case "seq":
      return {
        t: "seq",
        rs: [
          { t: "lit", s: "foo" },
          { t: "lit", s: "bar" },
        ],
      };
    case "opt":
      return { t: "opt", r: { t: "lit", s: "foo" } };
    case "zeroOrMore":
      return { t: "zeroOrMore", r: { t: "lit", s: "foo" } };
    case "oneOrMore":
      return { t: "oneOrMore", r: { t: "lit", s: "foo" } };
    case "set":
      return {
        t: "set",
        mode: "anyOf",
        items: [{ t: "range", begin: "a", end: "z" }],
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
