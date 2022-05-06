import { absurd } from "./absurd";

// `null` and `choosing` are just because we're making a UI, they're not really
// part of a pure mathematical regex.

export type SetItemT =
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

export type RegexT =
  | { t: "begin" }
  | { t: "end" }
  | { t: "lit"; s: string }
  | { t: "alt"; rs: RegexT[] }
  | { t: "seq"; rs: RegexT[] }
  | { t: "opt"; r: RegexT | null }
  | { t: "zeroOrMore"; r: RegexT | null }
  | { t: "oneOrMore"; r: RegexT | null }
  | { t: "set"; mode: SetModeT; items: SetItemT[] }
  | { t: "choosing"; mode: RegexMode };

function allOrNone<T>(xs: (T | null)[]): T[] | null {
  const ret = [];
  for (const x of xs) {
    if (x) {
      ret.push(x);
    } else {
      return null;
    }
  }
  return ret;
}

export function showRegex(re: RegexT | null): string | null {
  if (!re) {
    return null;
  }
  switch (re.t) {
    case "begin":
      return "^";
    case "end":
      return "$";
    case "lit":
      return re.s;
    case "alt": {
      const res = allOrNone(re.rs.map(showRegex));
      return res ? res.join("|") : null;
    }
    case "seq": {
      const res = allOrNone(re.rs.map(showRegex));
      return res ? res.join("") : null;
    }
    case "opt": {
      const res = showRegex(re.r);
      return res ? res + "?" : null;
    }
    case "zeroOrMore": {
      const res = showRegex(re.r);
      return res ? res + "*" : null;
    }
    case "oneOrMore": {
      const res = showRegex(re.r);
      return res ? res + "+" : null;
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
