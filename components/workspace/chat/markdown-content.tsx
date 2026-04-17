"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
  isUser?: boolean;
}

export function MarkdownContent({
  content,
  className,
  isUser = false,
}: MarkdownContentProps) {
  return (
    <div className={cn("markdown-content break-words", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          h1: ({ children }) => (
            <h1 className="text-base font-bold mb-2 mt-3 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-bold mb-1.5 mt-2.5 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold mb-1 mt-2 first:mt-0">
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc ml-4 mb-2 space-y-0.5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal ml-4 mb-2 space-y-0.5">{children}</ol>
          ),
          li: ({ children }) => <li className="text-sm">{children}</li>,
          code: ({ className: codeClassName, children, ...props }) => {
            const isInline = !codeClassName;
            if (isInline) {
              return (
                <code
                  className={cn(
                    "px-1 py-0.5 rounded text-xs font-mono",
                    isUser
                      ? "bg-white/20"
                      : "bg-white/[0.08] text-text-primary"
                  )}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={cn("text-xs font-mono", codeClassName)} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre
              className={cn(
                "rounded-lg p-3 mb-2 overflow-x-auto text-xs font-mono",
                isUser
                  ? "bg-white/10"
                  : "bg-gray-800 text-gray-100"
              )}
            >
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className={cn(
                "border-l-2 pl-3 mb-2 italic",
                isUser ? "border-white/40 text-white/80" : "border-white/[0.12] text-text-muted"
              )}
            >
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "underline",
                isUser ? "text-white/90" : "text-accent hover:text-accent/80"
              )}
            >
              {children}
            </a>
          ),
          hr: () => (
            <hr
              className={cn(
                "my-2",
                isUser ? "border-white/20" : "border-white/[0.08]"
              )}
            />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-2">
              <table className="text-xs border-collapse w-full">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th
              className={cn(
                "border px-2 py-1 text-left font-semibold",
                isUser ? "border-white/20" : "border-white/[0.08] bg-white/[0.03]"
              )}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              className={cn(
                "border px-2 py-1",
                isUser ? "border-white/20" : "border-white/[0.08]"
              )}
            >
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
