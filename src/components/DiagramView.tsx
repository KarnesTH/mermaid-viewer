import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import svgPanZoom from "svg-pan-zoom";

const DiagramView = () => {
  const [diagramCode, setDiagramCode] = useState('');
  const [svg, setSvg] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const panZoomInstance = useRef<ReturnType<typeof svgPanZoom> | null>(null);
	const [error, setError] = useState('');

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: false,
			theme: 'dark',
    });
    if (diagramCode) {
      mermaid.render('graphDiv', diagramCode).then(({ svg }) => {
        setSvg(svg);
      }).catch((err) => {
        setError(err.message);
      });
    }
  }, [diagramCode]);

  useEffect(() => {
    if (!svg) return;
    setTimeout(() => {
      const svgElem = previewRef.current?.querySelector('svg');
      if (svgElem) {
        svgElem.removeAttribute('width');
        svgElem.removeAttribute('height');
        svgElem.setAttribute('width', '100%');
        svgElem.setAttribute('height', '100%');
        if (!svgElem.getAttribute('viewBox')) {
          const vb = `0 0 800 600`;
          svgElem.setAttribute('viewBox', vb);
        }
        svgElem.style.display = 'block';
        svgElem.style.margin = 'auto';
        svgElem.style.maxWidth = '100%';
        svgElem.style.maxHeight = '100%';

        panZoomInstance.current?.destroy();
        panZoomInstance.current = svgPanZoom(svgElem, {
          zoomEnabled: true,
          controlIconsEnabled: true,
          panEnabled: true,
          fit: true,
          center: true,
        });
      }
    }, 0);
    return () => {
      panZoomInstance.current?.destroy();
      panZoomInstance.current = null;
    };
  }, [svg]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const title = `---\ntitle: ${file.name.split('.')[0]}\n---\n`;
    setDiagramCode(title + text);
		setError('');
  }

	const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDiagramCode(e.target.value);
		setSvg('');
		setError('');
	}

  return (
    <div className="flex w-full h-[80vh] min-h-[400px] overflow-hidden gap-6 p-6 bg-bg text-text">
      {/* Linker Bereich: Editor */}
      <div className="w-1/4 min-w-[200px] max-w-[500px] bg-card shadow-lg flex flex-col rounded-2xl p-4 border border-border">
        <label className="p-2 text-xs text-text-muted">Mermaid-Code</label>
        <textarea
          className="flex-1 w-full p-2 font-mono text-sm border border-input-border outline-none bg-input-bg text-input-text resize-none"
          value={diagramCode}
          onChange={handleCodeChange}
          spellCheck={false}
        />
        <div className="flex items-center gap-2 mb-4 mt-4">
          <label className="text-xs text-text-muted">Datei öffnen:</label>
          <input
            type="file"
            accept=".mmd,.mermaid,text/mermaid"
            className="text-xs border-2 border-divider rounded-md p-2 bg-input-bg text-input-text"
            onChange={handleFileChange}
          />
        </div>
        {error && <div className="text-red-500 text-xs">{error}</div>}
      </div>
      {/* Rechter Bereich: Vorschau */}
      <div
        ref={previewRef}
        className="flex-1 bg-card flex items-center justify-center overflow-hidden relative rounded-2xl p-4 shadow-lg border border-border"
        style={{ minWidth: 0, minHeight: 0 }}
      >
        {svg ? (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ minWidth: 0, minHeight: 0 }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <span className="text-text-muted">Keine Vorschau verfügbar</span>
        )}
      </div>
    </div>
  );
}

export default DiagramView;