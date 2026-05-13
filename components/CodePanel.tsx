"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type TokenType = "keyword" | "comment" | "string" | "number" | "plain" | "function";

interface Token {
  text: string;
  type: TokenType;
}

interface CodePanelProps {
  code: string;
  activeLine?: number;
  fileName?: string;
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
  "from",
  "new",
  "this",
  "class"
]);

const COLOR_MAP: Record<TokenType, string> = {
  keyword: "#0A84FF",
  comment: "#8E8E93",
  string: "#FF9F0A",
  number: "#BF5AF2",
  plain: "#E5E5EA",
  function: "#5AC8FA"
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
    if (char === '"' || char === "'" || char === "`") {
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

export default function CodePanel({ code, activeLine, fileName = "Algorithm.ts" }: CodePanelProps) {
  const [copied, setCopied] = useState(false);
  const linesArray = useMemo(() => code.split("\n"), [code]);
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  useEffect(() => {
    if (activeLine && activeLineRef.current) {
      const container = scrollContainerRef.current;
      if (container) {
        const offsetTop = activeLineRef.current.offsetTop;
        const containerHeight = container.clientHeight;
        const lineHeight = activeLineRef.current.clientHeight;

        if (offsetTop < container.scrollTop || offsetTop > container.scrollTop + containerHeight - lineHeight) {
          container.scrollTo({
            top: offsetTop - containerHeight / 2 + lineHeight / 2,
            behavior: "smooth"
          });
        }
      }
    }
  }, [activeLine]);

  const handleCopy = async () => {
    if (!navigator.clipboard) {
      return;
    }
    await navigator.clipboard.writeText(code);
    setCopied(true);
  };

  return (
    <div className="flex h-full min-h-0 min-w-0 w-full flex-col overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-[#1C1C1E] shadow-card backdrop-blur">
      <div className="flex items-center justify-between border-b border-[#2C2C2E] bg-[#1C1C1E] px-4 py-3 flex-shrink-0">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
          <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
          <div className="h-3 w-3 rounded-full bg-[#27C93F]"></div>
        </div>
        <div className="text-xs font-medium text-white/50 font-mono">{fileName}</div>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 hover:bg-white/20 transition-colors"
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
      <div
        ref={scrollContainerRef}
        className="min-h-0 flex-1 overflow-x-auto overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-[#3A3A3C] scrollbar-track-[#2C2C2E]"
      >
        <pre className="m-0 w-max min-w-full text-xs leading-6 text-white/90 font-mono">
          {linesArray.map((line, index) => {
            const lineNumber = index + 1;
            const tokens = tokenizeLine(line);
            const isActive = activeLine === lineNumber;

            return (
              <div
                key={`${lineNumber}`}
                ref={isActive ? activeLineRef : null}
                className={`flex gap-3 px-4 py-1 ${
                  isActive
                    ? "border-l-3 border-[#0A84FF] bg-[rgba(10,132,255,0.15)]"
                    : "border-l-3 border-transparent"
                }`}
              >
                <span className="w-8 text-right text-white/40 flex-shrink-0">{lineNumber}</span>
                <code className="whitespace-pre flex-1 min-w-max">
                  {tokens.map((token, tokenIndex) => (
                    <span
                      key={`${lineNumber}-${tokenIndex}`}
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
