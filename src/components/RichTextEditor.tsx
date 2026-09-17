import { useState, useRef, useEffect, type MouseEvent, type KeyboardEvent, type ClipboardEvent } from 'react';
import {
  List,
  ListOrdered,
  Table as TableIcon,
  Eraser,
  X
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Provide detailed technical scope of work, structural mounting specifications, electrical schematics summary, and milestone schedules...',
  minHeight = '160px'
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Table customization state (Max 4x4)
  const [isTablePopoverOpen, setIsTablePopoverOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3); // 1..4 (default 3 matching reference)
  const [tableCols, setTableCols] = useState(3); // 1..4 (default 3 matching reference)
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  // Sync external value to contentEditable div when mounting or when value changes externally
  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      if (savedRangeRef.current) {
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(savedRangeRef.current);
        }
      } else {
        ensureSelection();
      }
    }
  };

  // Close table popover on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (
        tableContainerRef.current &&
        !tableContainerRef.current.contains(e.target as Node)
      ) {
        setIsTablePopoverOpen(false);
      }
    };

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && isTablePopoverOpen) {
        setIsTablePopoverOpen(false);
      }
    };

    if (isTablePopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTablePopoverOpen]);

  const ensureSelection = () => {
    if (!editorRef.current) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !editorRef.current.contains(sel.anchorNode)) {
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  // Execute formatting commands while maintaining focus and selection
  const executeCommand = (e: MouseEvent, command: string, arg: string | undefined = undefined) => {
    e.preventDefault(); // Prevent button from stealing focus from contentEditable

    if (editorRef.current) {
      editorRef.current.focus();
      ensureSelection();
    }

    try {
      document.execCommand(command, false, arg);
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    } catch (err) {
      console.warn('Rich text command failed:', err);
    }
  };

  // Handle smart auto-formatting when typing "1. " or "- "
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
      const sel = window.getSelection();
      if (sel && sel.anchorNode && editorRef.current?.contains(sel.anchorNode)) {
        const nodeText = sel.anchorNode.textContent || '';
        // If user typed "1." or "1)" at the start of a block
        if (/^1[\.\)]$/.test(nodeText.trim())) {
          e.preventDefault();
          sel.anchorNode.textContent = '';
          document.execCommand('insertOrderedList', false);
          if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
          return;
        }
        // If user typed "-" or "*" at the start of a block
        if (/^[-*]$/.test(nodeText.trim())) {
          e.preventDefault();
          sel.anchorNode.textContent = '';
          document.execCommand('insertUnorderedList', false);
          if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
          return;
        }
      }
    }
  };

  // Handle clean paste so browser clipboard formatting doesn't shrink headings or pollute typography
  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    const pastedHtml = clipboardData.getData('text/html');
    const pastedText = clipboardData.getData('text/plain');

    if (pastedHtml) {
      // Clean up pasted HTML:
      // Remove inline font-size, font-family, line-height, and margin/padding overrides that cause shrunk headings
      let cleanHtml = pastedHtml
        .replace(/<!--[\s\S]*?-->/g, '') // remove HTML comments
        .replace(/style="[^"]*"/gi, (styleAttr) => {
          const cleaned = styleAttr
            .replace(/font-size\s*:\s*[^;"]*;?/gi, '')
            .replace(/font-family\s*:\s*[^;"]*;?/gi, '')
            .replace(/line-height\s*:\s*[^;"]*;?/gi, '')
            .replace(/margin\s*:\s*[^;"]*;?/gi, '')
            .replace(/padding\s*:\s*[^;"]*;?/gi, '');
          return cleaned === 'style=""' ? '' : cleaned;
        })
        .replace(/<font\b[^>]*>/gi, '')
        .replace(/<\/font>/gi, '');

      try {
        document.execCommand('insertHTML', false, cleanHtml);
      } catch {
        document.execCommand('insertText', false, pastedText);
      }
    } else if (pastedText) {
      document.execCommand('insertText', false, pastedText);
    }

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Insert a customizable table with maximum 4 rows and 4 columns (empty cells)
  const insertCustomTable = (numRows: number, numCols: number, withHeader: boolean) => {
    // Strict clamp: minimum 1x1, maximum 4x4
    const rows = Math.min(4, Math.max(1, numRows));
    const cols = Math.min(4, Math.max(1, numCols));

    restoreSelection();

    let theadHtml = '';
    let tbodyHtml = '';

    if (withHeader) {
      let ths = '';
      for (let c = 0; c < cols; c++) {
        ths += `<th style="border:1px solid #cbd5e1;padding:8px 10px;text-align:left;font-weight:700;background:#f1f5f9;color:#0f172a;min-height:28px;"><br></th>`;
      }
      theadHtml = `<thead><tr style="background:#f1f5f9;">${ths}</tr></thead>`;

      // Data rows: if rows > 1, create rows - 1 data rows. If rows === 1, only the header row exists
      const dataRowCount = Math.max(0, rows - 1);
      if (dataRowCount > 0) {
        let trs = '';
        for (let r = 0; r < dataRowCount; r++) {
          let tds = '';
          for (let c = 0; c < cols; c++) {
            tds += `<td style="border:1px solid #cbd5e1;padding:8px 10px;color:#334155;min-height:28px;"><br></td>`;
          }
          trs += `<tr>${tds}</tr>`;
        }
        tbodyHtml = `<tbody>${trs}</tbody>`;
      }
    } else {
      let trs = '';
      for (let r = 0; r < rows; r++) {
        let tds = '';
        for (let c = 0; c < cols; c++) {
          tds += `<td style="border:1px solid #cbd5e1;padding:8px 10px;color:#334155;min-height:28px;"><br></td>`;
        }
        trs += `<tr>${tds}</tr>`;
      }
      tbodyHtml = `<tbody>${trs}</tbody>`;
    }

    const tableHtml = `
      <table style="width:100%;border-collapse:collapse;margin:12px 0;">
        ${theadHtml}
        ${tbodyHtml}
      </table>
      <p><br></p>
    `;

    try {
      document.execCommand('insertHTML', false, tableHtml);
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    } catch {
      // Fallback
      if (editorRef.current) {
        editorRef.current.innerHTML += tableHtml;
        onChange(editorRef.current.innerHTML);
      }
    }

    setIsTablePopoverOpen(false);
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const isEmpty = !value || value === '<p><br></p>' || value === '<br>' || value.trim() === '';

  return (
    <div
      className={`relative rounded-2xl border ${isTablePopoverOpen ? 'overflow-visible' : 'overflow-hidden'} transition-all duration-150 ${
        isFocused
          ? 'border-[#0F5A29] ring-2 ring-[#0F5A29]/15 shadow-sm'
          : 'border-slate-200 shadow-2xs'
      }`}
    >
      {/* Top Toolbar matching dark theme */}
      <div className="bg-[#18181B] text-slate-200 px-3 py-2 flex items-center justify-between gap-1 flex-wrap border-b border-zinc-800 select-none rounded-t-2xl">
        <div className="flex items-center gap-1 flex-wrap">
          {/* BOLD (B) */}
          <button
            type="button"
            onMouseDown={(e) => executeCommand(e, 'bold')}
            className="w-7 h-7 rounded-md text-xs font-black flex items-center justify-center transition-colors cursor-pointer hover:bg-zinc-800 text-slate-100 active:bg-zinc-700"
            title="Bold (Ctrl+B)"
            aria-label="Bold"
          >
            B
          </button>

          {/* UNDERLINE (U) - Directly underlines visually */}
          <button
            type="button"
            onMouseDown={(e) => executeCommand(e, 'underline')}
            className="w-7 h-7 rounded-md text-xs font-bold underline flex items-center justify-center transition-colors cursor-pointer hover:bg-zinc-800 text-slate-100 active:bg-zinc-700 decoration-white decoration-2"
            title="Underline (Ctrl+U)"
            aria-label="Underline"
          >
            U
          </button>

          {/* ITALIC (I) */}
          <button
            type="button"
            onMouseDown={(e) => executeCommand(e, 'italic')}
            className="w-7 h-7 rounded-md text-xs italic font-serif flex items-center justify-center transition-colors cursor-pointer hover:bg-zinc-800 text-slate-100 active:bg-zinc-700"
            title="Italic (Ctrl+I)"
            aria-label="Italic"
          >
            I
          </button>

          {/* DIVIDER */}
          <span className="w-px h-4 bg-zinc-700 mx-1" />

          {/* H2 */}
          <button
            type="button"
            onMouseDown={(e) => executeCommand(e, 'formatBlock', '<h2>')}
            className="px-1.5 h-7 rounded-md text-xs font-black text-amber-400 flex items-center justify-center transition-colors cursor-pointer font-mono hover:bg-zinc-800 active:bg-zinc-700"
            title="Heading 2"
            aria-label="Heading 2"
          >
            H2
          </button>

          {/* H3 */}
          <button
            type="button"
            onMouseDown={(e) => executeCommand(e, 'formatBlock', '<h3>')}
            className="px-1.5 h-7 rounded-md text-xs font-black text-amber-400 flex items-center justify-center transition-colors cursor-pointer font-mono hover:bg-zinc-800 active:bg-zinc-700"
            title="Heading 3"
            aria-label="Heading 3"
          >
            H3
          </button>

          {/* DIVIDER */}
          <span className="w-px h-4 bg-zinc-700 mx-1" />

          {/* BULLET LIST */}
          <button
            type="button"
            onMouseDown={(e) => executeCommand(e, 'insertUnorderedList')}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors cursor-pointer text-slate-300 hover:bg-zinc-800 active:bg-zinc-700"
            title="Bullet List"
            aria-label="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>

          {/* ORDERED LIST */}
          <button
            type="button"
            onMouseDown={(e) => executeCommand(e, 'insertOrderedList')}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors cursor-pointer text-slate-300 hover:bg-zinc-800 active:bg-zinc-700"
            title="Numbered List"
            aria-label="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          {/* DIVIDER */}
          <span className="w-px h-4 bg-zinc-700 mx-1" />

          {/* INSERT TABLE (CUSTOMIZABLE UP TO 4X4) */}
          <div className="relative" ref={tableContainerRef}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                saveSelection();
                setIsTablePopoverOpen((prev) => !prev);
              }}
              className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                isTablePopoverOpen
                  ? 'bg-[#0F5A29] text-white ring-1 ring-emerald-400'
                  : 'text-slate-300 hover:bg-zinc-800 active:bg-zinc-700'
              }`}
              title="Insert Customizable Specification Table (Max 4x4)"
              aria-label="Insert Specification Table"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>

            {/* Custom 4x4 Table Builder Popover matching reference image layout with 15% reduced size */}
            {isTablePopoverOpen && (
              <div
                className="absolute left-0 top-full mt-1.5 z-50 w-[204px] sm:w-[218px] bg-[#18181B] border border-zinc-700/80 rounded-xl shadow-2xl p-3.5 text-slate-200 animate-in fade-in zoom-in-95 duration-100 select-none"
                onMouseDown={(e) => e.stopPropagation()}
              >
                {/* SECTION 1: TITLE (MAX 4X4) */}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[10.5px] font-mono font-bold tracking-wider text-slate-200 uppercase">
                    INSERT TABLE (MAX 4X4)
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsTablePopoverOpen(false)}
                    className="w-4 h-4 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {/* SECTION 2: COLS ROW */}
                <div className="flex items-center justify-between gap-2.5 mb-2.5">
                  <label className="text-[10.5px] font-mono font-bold text-slate-200 tracking-wide">
                    Cols:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={4}
                    value={tableCols}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) {
                        setTableCols(Math.min(4, Math.max(1, val)));
                      }
                    }}
                    onBlur={() => {
                      if (!tableCols || tableCols < 1) setTableCols(1);
                      if (tableCols > 4) setTableCols(4);
                    }}
                    className="w-[68px] h-[31px] bg-zinc-800/90 border border-zinc-700 rounded-lg text-center font-mono text-xs sm:text-sm font-bold text-slate-100 focus:outline-none focus:border-[#0F5A29] focus:ring-1 focus:ring-[#0F5A29] transition-all cursor-pointer"
                  />
                </div>

                {/* SECTION 3: ROWS ROW */}
                <div className="flex items-center justify-between gap-2.5 mb-3">
                  <label className="text-[10.5px] font-mono font-bold text-slate-200 tracking-wide">
                    Rows:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={4}
                    value={tableRows}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) {
                        setTableRows(Math.min(4, Math.max(1, val)));
                      }
                    }}
                    onBlur={() => {
                      if (!tableRows || tableRows < 1) setTableRows(1);
                      if (tableRows > 4) setTableRows(4);
                    }}
                    className="w-[68px] h-[31px] bg-zinc-800/90 border border-zinc-700 rounded-lg text-center font-mono text-xs sm:text-sm font-bold text-slate-100 focus:outline-none focus:border-[#0F5A29] focus:ring-1 focus:ring-[#0F5A29] transition-all cursor-pointer"
                  />
                </div>

                {/* SECTION 4: INSERT TABLE BUTTON */}
                <button
                  type="button"
                  onClick={() => insertCustomTable(tableRows, tableCols, true)}
                  className="w-full py-2 px-3.5 rounded-lg bg-[#0F5A29] hover:bg-[#157a38] active:bg-[#0c4720] text-white font-mono font-bold text-[10.5px] uppercase tracking-wider flex items-center justify-center transition-all cursor-pointer shadow-md border border-emerald-500/30"
                >
                  INSERT TABLE
                </button>
              </div>
            )}
          </div>

          {/* CLEAR FORMATTING */}
          <button
            type="button"
            onMouseDown={(e) => executeCommand(e, 'removeFormat')}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors cursor-pointer text-slate-400 hover:bg-zinc-800 hover:text-slate-200 active:bg-zinc-700"
            title="Clear Formatting"
            aria-label="Clear Formatting"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative bg-white">
        <div className="relative">
          {/* Real Visual contentEditable Editor */}
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{ minHeight }}
            className="w-full p-4 text-xs sm:text-sm text-slate-900 focus:outline-none overflow-y-auto leading-relaxed
              rich-text-editor
              [&_u]:underline [&_u]:decoration-[#0F5A29] [&_u]:decoration-2 [&_u]:underline-offset-2
              [&_strong]:font-bold [&_strong]:text-slate-900
              [&_b]:font-bold [&_b]:text-slate-900
              [&_em]:italic [&_em]:text-slate-800
              [&_i]:italic [&_i]:text-slate-800
              [&_h2]:text-base sm:[&_h2]:text-lg [&_h2]:font-black [&_h2]:text-slate-900 [&_h2]:uppercase [&_h2]:mt-[7.80px] [&_h2]:mb-[2.89px] [&_h2]:pt-[7.80px] [&_h2]:pb-[2.89px] [&_h2]:leading-snug
              [&_h2_*]:text-inherit [&_h2_*]:font-inherit
              [&_h3]:text-sm sm:[&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:uppercase [&_h3]:mt-[8.67px] [&_h3]:mb-[2.89px] [&_h3]:pt-[8.67px] [&_h3]:pb-[2.89px] [&_h3]:leading-snug
              [&_h3_*]:text-inherit [&_h3_*]:font-inherit
              [&_h2+h3]:mt-[5.78px] [&_h2+h3]:pt-[5.78px]
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ul]:space-y-1.5 [&_ul]:list-outside
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_ol]:space-y-1.5 [&_ol]:list-outside
              [&_li]:text-slate-800 [&_li]:pl-1
              [&_ol>li]:marker:font-bold [&_ol>li]:marker:text-slate-800
              [&_ul>li]:marker:text-slate-700
              [&_table]:w-full [&_table]:border-collapse [&_table]:my-3
              [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2 [&_th]:font-bold [&_th]:text-left
              [&_td]:border [&_td]:border-slate-300 [&_td]:p-2"
          />

          {/* Placeholder overlay when empty */}
          {isEmpty && !isFocused && (
            <div
              onClick={() => {
                editorRef.current?.focus();
                setIsFocused(true);
              }}
              className="absolute inset-0 p-4 text-xs text-slate-400 pointer-events-none select-none"
            >
              {placeholder}
            </div>
          )}
        </div>
      </div>

      {/* Editor Status Bar */}
      <div className="bg-slate-50 px-3 py-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Rich Text Editor Active
        </span>
        <span>
          {value.replace(/<[^>]*>/g, '').trim().length} characters
        </span>
      </div>
    </div>
  );
}
