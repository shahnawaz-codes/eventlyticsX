"use client";

import React, { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    async function highlight() {
      try {
        // Asynchronously highlight using Shiki library in the browser
        const highlighted = await codeToHtml(code, {
          lang: language,
          theme: "github-dark",
        });
        if (active) {
          setHtml(highlighted);
        }
      } catch (err) {
        console.warn("Shiki highlighter fallback:", err);
      }
    }
    highlight();
    return () => {
      active = false;
    };
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#060e20] text-zinc-200 font-mono text-xs overflow-hidden shadow-md my-4">
      <div className="flex items-center justify-between bg-zinc-950/80 px-4 py-2 border-b border-zinc-850">
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-sans">
          {filename || language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer select-none text-[10px]"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 overflow-x-auto whitespace-pre">
        {html ? (
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            className="shiki-container"
          />
        ) : (
          <pre className="text-zinc-300">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
export default CodeBlock;
