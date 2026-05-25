import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Strip the `node` prop that react-markdown passes — it should never reach the DOM.
const strip = (Component) => ({ node, ...rest }) => <Component {...rest} />;

const COMPONENTS = {
  h1: strip((p) => <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-900 dark:text-ink-50 mt-6 mb-3 first:mt-0" {...p} />),
  h2: strip((p) => <h2 className="font-display text-xl font-semibold tracking-tight text-ink-900 dark:text-ink-50 mt-6 mb-2 first:mt-0" {...p} />),
  h3: strip((p) => <h3 className="font-display text-base font-semibold tracking-tight text-ink-900 dark:text-ink-50 mt-5 mb-2 first:mt-0" {...p} />),
  p:  strip((p) => <p className="text-[15px] leading-relaxed text-ink-700 dark:text-ink-300 my-3" {...p} />),
  ul: strip((p) => <ul className="list-disc list-outside ml-5 my-3 space-y-1.5 text-[15px] text-ink-700 dark:text-ink-300" {...p} />),
  ol: strip((p) => <ol className="list-decimal list-outside ml-5 my-3 space-y-1.5 text-[15px] text-ink-700 dark:text-ink-300" {...p} />),
  li: strip((p) => <li className="leading-relaxed" {...p} />),
  strong: strip((p) => <strong className="font-semibold text-ink-900 dark:text-ink-50" {...p} />),
  em: strip((p) => <em className="italic" {...p} />),
  code: ({ node, inline, className, children, ...props }) => {
    if (inline) {
      return <code className="font-mono text-[13px] px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-900 dark:text-ink-100" {...props}>{children}</code>;
    }
    return <pre className="my-3 p-3 rounded-lg bg-ink-50 dark:bg-ink-900 text-[13px] font-mono overflow-x-auto"><code {...props}>{children}</code></pre>;
  },
  blockquote: strip((p) => <blockquote className="border-l-2 border-accent-500 pl-4 italic my-4 text-ink-600 dark:text-ink-400" {...p} />),
  a: strip((p) => <a className="text-accent-600 dark:text-accent-400 hover:underline underline-offset-2" target="_blank" rel="noreferrer" {...p} />),
  hr: () => <hr className="my-6 border-ink-200 dark:border-ink-800" />,
  table: strip((p) => <div className="overflow-x-auto my-4"><table className="min-w-full text-sm border border-ink-200 dark:border-ink-800 rounded-lg overflow-hidden" {...p} /></div>),
  th: strip((p) => <th className="text-left px-3 py-2 border-b border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-900 font-semibold text-ink-700 dark:text-ink-200" {...p} />),
  td: strip((p) => <td className="px-3 py-2 border-b border-ink-100 dark:border-ink-900" {...p} />),
};

export default function MarkdownView({ children }) {
  return (
    <div className="markdown-view">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[[rehypeKatex, { strict: false }]]}
        components={COMPONENTS}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
