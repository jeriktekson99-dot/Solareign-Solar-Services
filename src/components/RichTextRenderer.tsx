import { useMemo } from 'react';

interface RichTextRendererProps {
  content?: string;
  className?: string;
}

// Converts markdown syntax to HTML if mixed with markdown
function parseRichContentToHtml(raw: string): string {
  if (!raw) return '';

  let text = raw;

  // If text doesn't already contain block HTML tags, process newlines and markdown
  const hasHtmlBlockTags = /<\/?(p|div|h[1-6]|ul|ol|li|table|blockquote)[^>]*>/i.test(text);

  // Convert markdown headings
  text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  text = text.replace(/^# (.*$)/gim, '<h2>$1</h2>');

  // Convert markdown bold and italic
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  text = text.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Convert markdown numbered lists (e.g. "1. Item" or "1) Item")
  text = text.replace(/(?:(?:^|\n)\s*\d+[\.\)]\s+[^\n]+)+/g, (match) => {
    if (/<[a-z]+/i.test(match) && /<\/[a-z]+>/i.test(match)) {
      return match;
    }
    const lines = match.trim().split('\n');
    const items = lines
      .map((line) => {
        const clean = line.replace(/^\s*\d+[\.\)]\s+/, '').trim();
        return clean ? `<li>${clean}</li>` : '';
      })
      .filter(Boolean)
      .join('');
    return `\n<ol>${items}</ol>\n`;
  });

  // Convert markdown bullet list items (e.g. "- Item", "* Item", "• Item")
  text = text.replace(/(?:(?:^|\n)\s*[-*•]\s+[^\n]+)+/g, (match) => {
    if (/<[a-z]+/i.test(match) && /<\/[a-z]+>/i.test(match)) {
      return match;
    }
    const lines = match.trim().split('\n');
    const items = lines
      .map((line) => {
        const clean = line.replace(/^\s*[-*•]\s+/, '').trim();
        return clean ? `<li>${clean}</li>` : '';
      })
      .filter(Boolean)
      .join('');
    return `\n<ul>${items}</ul>\n`;
  });

  if (!hasHtmlBlockTags) {
    // Split by double newline into paragraphs
    const paragraphs = text.split(/\n\s*\n/);
    text = paragraphs
      .map((p) => {
        const trimmed = p.trim();
        if (!trimmed) return '';
        if (/^<(h[1-6]|ul|ol|table|blockquote)/i.test(trimmed)) {
          return trimmed;
        }
        return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
      })
      .filter(Boolean)
      .join('');
  }

  // Strip inline font-size, font-family, and line-height that may corrupt typography when copy-pasting
  text = text.replace(/style="[^"]*"/gi, (styleAttr) => {
    const cleaned = styleAttr
      .replace(/font-size\s*:\s*[^;"]*;?/gi, '')
      .replace(/font-family\s*:\s*[^;"]*;?/gi, '')
      .replace(/line-height\s*:\s*[^;"]*;?/gi, '')
      .replace(/margin\s*:\s*[^;"]*;?/gi, '')
      .replace(/padding\s*:\s*[^;"]*;?/gi, '');
    return cleaned === 'style=""' ? '' : cleaned;
  });

  // Basic security sanitization: strip script, iframe, and inline JS handlers
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  text = text.replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '');
  text = text.replace(/\son\w+\s*=\s*[^>\s]+/gi, '');
  text = text.replace(/javascript:/gi, '');

  return text;
}

export default function RichTextRenderer({ content = '', className = '' }: RichTextRendererProps) {
  const formattedHtml = useMemo(() => {
    return parseRichContentToHtml(content);
  }, [content]);

  if (!content || !content.trim()) {
    return null;
  }

  return (
    <div
      className={`rich-text-content text-slate-700 leading-relaxed text-sm sm:text-base space-y-4 min-w-0 max-w-full overflow-hidden
        break-words [overflow-wrap:anywhere] [word-break:break-word]
        [&_*]:break-words [&_*]:[overflow-wrap:anywhere] [&_*]:[word-break:break-word]
        [&_u]:underline [&_u]:underline-offset-3 [&_u]:decoration-2 [&_u]:decoration-[#0F5A29]
        [&_ins]:underline [&_ins]:underline-offset-3 [&_ins]:decoration-2 [&_ins]:decoration-[#0F5A29]
        [&_strong]:font-bold [&_strong]:text-[#0F172A]
        [&_b]:font-bold [&_b]:text-[#0F172A]
        [&_em]:italic [&_em]:text-slate-700
        [&_i]:italic [&_i]:text-slate-700
        [&_h2]:text-lg [&_h2]:sm:text-xl [&_h2]:font-black [&_h2]:text-[#0F172A] [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:mt-[7.80px] [&_h2]:mb-[2.89px] [&_h2]:pt-[10.40px] [&_h2]:pb-[4.34px] [&_h2]:leading-snug [&_h2]:no-underline [&_h2]:border-none [&_h2]:border-b-0 [&_h2_u]:no-underline [&_h2_ins]:no-underline
        [&_h2_*]:text-inherit [&_h2_*]:font-inherit
        [&_h3]:text-base [&_h3]:sm:text-lg [&_h3]:font-bold [&_h3]:text-[#1E293B] [&_h3]:uppercase [&_h3]:tracking-wide [&_h3]:mt-[8.67px] [&_h3]:mb-[2.89px] [&_h3]:pt-[11.56px] [&_h3]:pb-[4.34px] [&_h3]:leading-snug [&_h3]:no-underline [&_h3]:border-none [&_h3]:border-b-0 [&_h3_u]:no-underline [&_h3_ins]:no-underline
        [&_h3_*]:text-inherit [&_h3_*]:font-inherit
        [&_h2+h3]:mt-[5.78px] [&_h2+h3]:pt-[5.78px]
        [&_p]:text-slate-700 [&_p]:leading-relaxed [&_p]:break-words [&_p]:[overflow-wrap:anywhere] [&_p]:[word-break:break-word]
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:my-3 [&_ul]:list-outside
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:my-3 [&_ol]:list-outside
        [&_li]:text-slate-700 [&_li]:leading-relaxed [&_li]:pl-1 [&_li]:break-words [&_li]:[overflow-wrap:anywhere]
        [&_ol>li]:marker:font-bold [&_ol>li]:marker:text-slate-800
        [&_ul>li]:marker:text-slate-700
        [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-xs [&_table]:sm:text-sm
        [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2.5 [&_th]:font-bold [&_th]:text-[#0F172A] [&_th]:text-left
        [&_td]:border [&_td]:border-slate-200 [&_td]:p-2.5 [&_td]:text-slate-700
        [&_blockquote]:border-l-4 [&_blockquote]:border-[#0F5A29] [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_blockquote]:my-3
        [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:bg-slate-100 [&_code]:text-emerald-800 [&_code]:rounded [&_code]:font-mono [&_code]:text-xs [&_code]:break-all
        ${className}`}
      style={{ overflowWrap: 'anywhere', wordBreak: 'break-word', maxWidth: '100%' }}
      dangerouslySetInnerHTML={{ __html: formattedHtml }}
    />
  );
}
