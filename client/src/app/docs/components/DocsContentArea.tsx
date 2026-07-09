"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "./CodeBlock";
import {
  DataLifeCycleDiagram,
  SdkInitLifecycleDiagram,
  ClickInterceptorDiagram,
} from "./Diagrams";
import { gettingStartedContent } from "../content/getting-started";
import { reactSdkContent } from "../content/react-sdk";
import { apiReferenceContent } from "../content/api-reference";

type TabType = "intro" | "setup" | "api";

interface DocsContentAreaProps {
  activeTab: TabType;
  activeKey: string;
  trackingEndpoint: string;
  searchQuery: string;
}

const CONTENT_MAP: Record<TabType, string> = {
  intro: gettingStartedContent,
  setup: reactSdkContent,
  api: apiReferenceContent,
};

export function DocsContentArea({
  activeTab,
  activeKey,
  trackingEndpoint,
  searchQuery,
}: DocsContentAreaProps) {
  const rawContent = CONTENT_MAP[activeTab] || "";

  // Replace placeholders in markdown content
  const processedContent = rawContent
    .replaceAll("{{PROJECT_KEY}}", activeKey)
    .replaceAll("{{API_ENDPOINT}}", trackingEndpoint);

  // Custom components for ReactMarkdown rendering
  const markdownComponents = {
    h1: ({ children, ...props }: any) => {
      // Slugify text to create matching element IDs for TOC scroll
      const textContent = React.Children.toArray(children).join("");
      const id = textContent
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return (
        <h1 id={id} className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 mt-8 mb-4 first:mt-0" {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ children, ...props }: any) => {
      const textContent = React.Children.toArray(children).join("");
      const id = textContent
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return (
        <h2 id={id} className="text-lg font-bold tracking-tight text-zinc-900 mt-6 mb-3 border-b border-zinc-100 pb-1.5" {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }: any) => {
      const textContent = React.Children.toArray(children).join("");
      const id = textContent
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return (
        <h3 id={id} className="text-sm font-bold text-zinc-850 mt-5 mb-2.5" {...props}>
          {children}
        </h3>
      );
    },
    p: ({ children, ...props }: any) => (
      <p className="text-sm text-zinc-650 leading-relaxed my-3.5" {...props}>
        {children}
      </p>
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      const isInline = !match;

      if (isInline) {
        return (
          <code className="bg-zinc-100 border border-zinc-200/80 text-rose-600 px-1.5 py-0.5 rounded font-mono text-2xs font-semibold" {...props}>
            {children}
          </code>
        );
      }

      // Code block rendering
      const codeString = String(children).replace(/\n$/, "");
      const language = match[1] || "typescript";
      const filename = language === "bash" ? "terminal" : `index.${language}`;

      return (
        <CodeBlock
          code={codeString}
          language={language}
          filename={filename}
        />
      );
    },
    table: ({ children, ...props }: any) => (
      <div className="overflow-x-auto my-6 border border-zinc-200 rounded-xl shadow-2xs">
        <table className="min-w-full divide-y divide-zinc-200/80 text-xs" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: any) => (
      <thead className="bg-zinc-50" {...props}>
        {children}
      </thead>
    ),
    th: ({ children, ...props }: any) => (
      <th className="px-4 py-2.5 text-left font-bold text-zinc-700 uppercase tracking-wider text-[10px]" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td className="px-4 py-3 border-t border-zinc-200 text-zinc-600 leading-normal" {...props}>
        {children}
      </td>
    ),
    ul: ({ children, ...props }: any) => (
      <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-650 my-4" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="list-decimal pl-5 space-y-2 text-xs text-zinc-650 my-4" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="leading-relaxed" {...props}>
        {children}
      </li>
    ),
    hr: ({ ...props }: any) => (
      <hr className="border-zinc-200 my-8" {...props} />
    ),
    strong: ({ children, ...props }: any) => (
      <strong className="font-extrabold text-zinc-950" {...props}>
        {children}
      </strong>
    ),
  };

  // Split content by diagram placeholders and render inline React SVG components
  const renderMarkdownWithDiagrams = (text: string) => {
    // If a search query is typed, highlight matches in the text
    let contentToRender = text;
    if (searchQuery.trim()) {
      // Basic check: if active page doesn't contain query, show filtered notice
      const searchMatch = text.toLowerCase().includes(searchQuery.toLowerCase());
      if (!searchMatch) {
        return (
          <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-450 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
            <span className="text-sm font-bold text-zinc-700">No results found on this page</span>
            <span className="text-xxs mt-1">Try switching tabs or searching for another term.</span>
          </div>
        );
      }
    }

    const parts = contentToRender.split(/(\{\{DIAGRAM:[A-Z_]+\}\})/g);
    return parts.map((part, index) => {
      if (part === "{{DIAGRAM:DATA_LIFE_CYCLE}}") {
        return <DataLifeCycleDiagram key={index} />;
      }
      if (part === "{{DIAGRAM:SDK_INIT_LIFECYCLE}}") {
        return <SdkInitLifecycleDiagram key={index} />;
      }
      if (part === "{{DIAGRAM:CLICK_INTERCEPTOR}}") {
        return <ClickInterceptorDiagram key={index} />;
      }
      return (
        <ReactMarkdown key={index} components={markdownComponents as any}>
          {part}
        </ReactMarkdown>
      );
    });
  };

  return (
    <div className="prose prose-zinc max-w-none">
      {renderMarkdownWithDiagrams(processedContent)}
    </div>
  );
}
export default DocsContentArea;
