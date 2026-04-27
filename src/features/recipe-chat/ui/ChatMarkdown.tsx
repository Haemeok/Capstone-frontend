import ReactMarkdown from "react-markdown";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

const ALLOWED_TAGS = [
  "p",
  "strong",
  "em",
  "br",
  "ul",
  "ol",
  "li",
  "code",
  "pre",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
];

const SCHEMA = {
  ...defaultSchema,
  tagNames: ALLOWED_TAGS,
};

type ChatMarkdownProps = {
  text: string;
};

const ChatMarkdown = ({ text }: ChatMarkdownProps) => (
  <div className="prose prose-sm max-w-none text-gray-900 [&_code]:rounded [&_code]:bg-gray-200 [&_code]:px-1 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-200 [&_pre]:p-3 [&_table]:overflow-x-auto">
    <ReactMarkdown rehypePlugins={[[rehypeSanitize, SCHEMA]]}>
      {text}
    </ReactMarkdown>
  </div>
);

export default ChatMarkdown;
