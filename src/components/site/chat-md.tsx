"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// The markdown of the chat answers. It lives in its own file so that react-markdown + remark (~43 KB gzip) are downloaded only when an answer
// has to be shown (ask-panda.tsx and ai-chat.tsx load this file with next/dynamic), not when the page or the menu loads.
export function AskMd({ text }: { text: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: (p) => <a {...p} target="_blank" rel="noopener noreferrer" /> }}>
      {text}
    </ReactMarkdown>
  );
}

export function MenuMd({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className="pd-msg-a" />,
        h1: ({ ...props }) => <h1 {...props} className="pd-msg-h1" />,
        h2: ({ ...props }) => <h2 {...props} className="pd-msg-h2" />,
        h3: ({ ...props }) => <h3 {...props} className="pd-msg-h3" />,
        h4: ({ ...props }) => <h4 {...props} className="pd-msg-h4" />,
        p: ({ ...props }) => <p {...props} className="pd-msg-p" />,
        ul: ({ ...props }) => <ul {...props} className="pd-msg-ul" />,
        ol: ({ ...props }) => <ol {...props} className="pd-msg-ol" />,
        li: ({ ...props }) => <li {...props} className="pd-msg-li" />,
        strong: ({ ...props }) => <strong {...props} className="pd-msg-strong" />,
        hr: () => <hr className="pd-msg-divider" />,
        pre: ({ ...props }) => <pre {...props} className="pd-msg-pre" />,
        code: ({ ...props }) => <code {...props} className="pd-msg-code" />,
        table: ({ ...props }) => <div className="pd-msg-table-wrap"><table {...props} className="pd-msg-table" /></div>,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
