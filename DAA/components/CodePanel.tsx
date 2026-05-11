"use client";

import React, { useEffect, useMemo, useState } from "react";

type TokenType = "keyword" | "comment" | "string" | "number" | "plain";

interface Token {
  text: string;
  type: TokenType;
}

interface CodePanelProps {
  code: string;
  currentLine?: number;
}

const KEYWORDS = new Set([
  "const",
  "let",
  "for",
  "while",
  "if",
  "else",
  "return",
  "function",
  "export",
  "interface",
  "type",
  "import",
  "from"
]);

const COLOR_MAP: Record<TokenType, string> = {
  keyword: "#0A84FF",
  comment: "#8E8E93",
  string: "#FF9F0A",
  number: "#BF5AF2",
  plain: "#E5E5EA"
};

function findCommentIndex(line: string): number {
  let inString: string | null = null;
  for (let i = 0; i < line.length - 1; i += 1) {
    const char = line[i];
    if (inString) {
      if (char === inString && line[i - 1] !== "\\") {
        inString = null;
      }
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") {
      inString = char;
      continue;
    }
    if (char === "/" && line[i + 1] === "/") {
      return i;
    }
  }
  return -1;
}

function tokenizeLine(line: string): Token[] {
  const commentIndex = findCommentIndex(line);
  const active = commentIndex >= 0 ? line.slice(0, commentIndex) : line;
  const comment = commentIndex >= 0 ? line.slice(commentIndex) : "";

  const tokens: Token[] = [];
  const tokenRegex =
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b|\s+|[^\sA-Za-z0-9_]+)/g;

  for (const match of active.matchAll(tokenRegex)) {
    const value = match[0];
    if (/^\s+$/.test(value)) {
      tokens.push({ text: value, type: "plain" });
    } else if (/^`|^\"|^'/.test(value)) {
      tokens.push({ text: value, type: "string" });
    } else if (/^\d/.test(value)) {
      tokens.push({ text: value, type: "number" });
    } else if (KEYWORDS.has(value)) {
      tokens.push({ text: value, type: "keyword" });
    } else {
      tokens.push({ text: value, type: "plain" });
    }
  }

  if (comment) {
    tokens.push({ text: comment, type: "comment" });
  }

  return tokens;
}

export default function CodePanel({ code, currentLine }: CodePanelProps) {
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => code.split("\n"), [code]);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    if (!navigator.clipboard) {
      return;
    }
    await navigator.clipboard.writeText(code);
    setCopied(true);
  };

  return (
    <div className="flex h-full flex-col rounded-[20px] border border-[var(--color-border)] bg-[#1C1C1E] shadow-card">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="text-sm font-medium text-white/80">TypeScript</div>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 hover:bg-white/20"
        >
          {copied ? (
            <span className="inline-flex items-center gap-1">
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Copied
            </span>
          ) : (
            "Copy"
          )}
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <pre className="text-sm leading-6 text-white/90">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const tokens = tokenizeLine(line);
            const isActive = currentLine === lineNumber;

            return (
              <div
                key={`${line}-${lineNumber}`}
                className={`flex gap-4 px-4 py-0.5 ${
                  isActive
                    ? "border-l-4 border-[#0A84FF] bg-[rgba(10,132,255,0.1)]"
                    : "border-l-4 border-transparent"
                }`}
              >
                <span className="w-8 text-xs text-white/40">{lineNumber}</span>
                <code className="whitespace-pre">
                  {tokens.map((token, tokenIndex) => (
                    <span
                      key={`${tokenIndex}-${token.text}`}
                      style={{ color: COLOR_MAP[token.type] }}
                    >
                      {token.text}
                    </span>
                  ))}
                </code>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
