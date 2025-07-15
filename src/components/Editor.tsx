import { useState, useRef, useEffect } from 'react';

const KEYWORDS = ['graph', 'subgraph', 'end', 'classDiagram', 'sequenceDiagram', 'stateDiagram', 'flowchart', 'erDiagram'];

/**
 * Tokenizes a line of code into parts.
 * 
 * @param line The line of code to tokenize.
 * @returns The tokenized parts.
 */
const tokenize = (line: string) => {
  const regex = new RegExp(`\\b(${KEYWORDS.join('|')})\\b`, 'g');
  const parts: { text: string; isKeyword: boolean }[] = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: line.slice(lastIndex, match.index), isKeyword: false });
    }
    parts.push({ text: match[0], isKeyword: true });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < line.length) {
    parts.push({ text: line.slice(lastIndex), isKeyword: false });
  }
  return parts;
}

type Cursor = { line: number; ch: number };

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Editor component.
 * 
 * @param value The value of the editor.
 * @param onChange The function to call when the value changes.
 * @param className The class name of the editor.
 * @returns The editor component.
 */
const Editor = ({ value, onChange, className = '' }: EditorProps) => {
  const lines = value.split('\n');
  const [cursor, setCursor] = useState<Cursor>({ line: 0, ch: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

	/**
	 * Handles the key down event.
	 * 
	 * @param e The key down event.
	 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let newLines = [...lines];
    let { line, ch } = cursor;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor({ line: Math.max(0, line - 1), ch: Math.min(ch, (lines[line - 1] || '').length) });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor({ line: Math.min(lines.length - 1, line + 1), ch: Math.min(ch, (lines[line + 1] || '').length) });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (ch > 0) setCursor({ line, ch: ch - 1 });
      else if (line > 0) setCursor({ line: line - 1, ch: lines[line - 1].length });
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (ch < lines[line].length) setCursor({ line, ch: ch + 1 });
      else if (line < lines.length - 1) setCursor({ line: line + 1, ch: 0 });
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      if (ch > 0) {
        newLines[line] = lines[line].slice(0, ch - 1) + lines[line].slice(ch);
        onChange(newLines.join('\n'));
        setCursor({ line, ch: ch - 1 });
      } else if (line > 0) {
        const prevLen = lines[line - 1].length;
        newLines[line - 1] += lines[line];
        newLines.splice(line, 1);
        onChange(newLines.join('\n'));
        setCursor({ line: line - 1, ch: prevLen });
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      newLines.splice(line + 1, 0, lines[line].slice(ch));
      newLines[line] = lines[line].slice(0, ch);
      onChange(newLines.join('\n'));
      setCursor({ line: line + 1, ch: 0 });
    } else if (e.key === 'Tab') {
      e.preventDefault();
      newLines[line] = lines[line].slice(0, ch) + '    ' + lines[line].slice(ch);
      onChange(newLines.join('\n'));
      setCursor({ line, ch: ch + 4 });
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      newLines[line] = lines[line].slice(0, ch) + e.key + lines[line].slice(ch);
      onChange(newLines.join('\n'));
      setCursor({ line, ch: ch + 1 });
    }
  };

	/**
	 * Handles the line click event.
	 * 
	 * @param lineIdx The index of the line that was clicked.
	 * @param _e The mouse event.
	 */
  const handleLineClick = (lineIdx: number, _e: React.MouseEvent<HTMLDivElement>) => {
    setCursor({ line: lineIdx, ch: lines[lineIdx].length });
  };

  useEffect(() => {
    if (cursor.line >= lines.length) {
      setCursor({ line: lines.length - 1, ch: lines[lines.length - 1]?.length || 0 });
    } else if (cursor.ch > lines[cursor.line]?.length) {
      setCursor({ line: cursor.line, ch: lines[cursor.line]?.length || 0 });
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={`bg-input-bg text-input-text font-mono text-sm rounded p-2 outline-none h-full w-full overflow-auto ${className}`}
      style={{ minHeight: '10rem', whiteSpace: 'pre' }}
      onKeyDown={handleKeyDown}
    >
      {lines.map((line, idx) => (
        <div
          key={idx}
          className={`flex items-center ${idx === cursor.line ? 'bg-accent/20' : ''}`}
          onClick={e => handleLineClick(idx, e)}
        >
          {tokenize(line).map((part, i) =>
            <span
              key={i}
              style={{
                color: part.isKeyword ? '#AF13F2' : undefined,
                fontWeight: part.isKeyword ? 900 : undefined,
                background: idx === cursor.line && cursor.ch === i ? '#F984FC22' : undefined,
              }}
            >
              {part.text}
            </span>
          )}
          {/* Cursor */}
          {idx === cursor.line && (
            <span
              style={{
                display: 'inline-block',
                width: '1px',
                height: '1.2em',
                background: '#AF13F2',
                verticalAlign: 'middle',
                marginLeft: cursor.ch === line.length ? 0 : -1,
                animation: 'blink 1s steps(1) infinite'
              }}
            >
              {cursor.ch === line.length ? '\u200B' : ''}
            </span>
          )}
        </div>
      ))}
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
};

export default Editor;