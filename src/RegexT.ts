import { absurd } from "./absurd";
import { Id, IdGen } from "./id";

export type SetItemT = SetItemBase & { id: Id };

export type SetItemBase =
  | { t: "char"; c: string }
  | { t: "range"; begin: string; end: string };

function showSetItem(si: SetItemT): string {
  switch (si.t) {
    case "char":
      return si.c;
    case "range":
      return `${si.begin}-${si.end}`;
    default:
      return absurd(si);
  }
}

export type SetModeT = "anyOf" | "noneOf";

function showSetMode(sm: SetModeT): string {
  switch (sm) {
    case "anyOf":
      return "";
    case "noneOf":
      return "^";
    default:
      return absurd(sm);
  }
}

export type RegexMode =
  | "begin"
  | "end"
  | "lit"
  | "alt"
  | "seq"
  | "opt"
  | "zeroOrMore"
  | "oneOrMore"
  | "set";

// `choosing` is just because we're making a UI, it's not really part of a pure
// mathematical regex.

export type RegexT = RegexBase & { id: Id };

export type RegexBase =
  | { t: "begin" }
  | { t: "end" }
  | { t: "lit"; s: string }
  | { t: "alt"; rs: RegexT[] }
  | { t: "seq"; rs: RegexT[] }
  | { t: "opt"; r: RegexT }
  | { t: "zeroOrMore"; r: RegexT }
  | { t: "oneOrMore"; r: RegexT }
  | { t: "set"; mode: SetModeT; items: SetItemT[] }
  | { t: "choosing"; mode: RegexMode };

function allOrNone<T>(xs: (T | null)[]): T[] | null {
  const ret = [];
  for (const x of xs) {
    if (x === null) {
      return null;
    } else {
      ret.push(x);
    }
  }
  return ret;
}

export function showRegex(re: RegexT): string | null {
  switch (re.t) {
    case "begin":
      return "^";
    case "end":
      return "$";
    case "lit":
      return re.s;
    case "alt": {
      const res = allOrNone(re.rs.map(showRegex));
      return res === null ? null : res.join("|");
    }
    case "seq": {
      const res = allOrNone(re.rs.map(showRegex));
      return res === null ? null : res.join("");
    }
    case "opt": {
      const res = showRegex(re.r);
      return res === null ? null : res + "?";
    }
    case "zeroOrMore": {
      const res = showRegex(re.r);
      return res === null ? null : res + "*";
    }
    case "oneOrMore": {
      const res = showRegex(re.r);
      return res === null ? null : res + "+";
    }
    case "set": {
      const mode = showSetMode(re.mode);
      const items = re.items.map(showSetItem).join("");
      return `[${mode}${items}]`;
    }
    case "choosing":
      return null;
    default:
      return absurd(re);
  }
}

export const choosing = (g: IdGen): RegexT => ({
  t: "choosing",
  mode: "lit",
  id: g.gen(),
});
