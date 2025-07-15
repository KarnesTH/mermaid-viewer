import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import svgPanZoom from "svg-pan-zoom";
import Toolbar from "./Toolbar";
import Editor from "./Editor";

/**
* DiagramView component
* 
* @returns A component that displays a diagram view of the Mermaid code.
 */
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
					const bbox = svgElem.getBBox();
					const bboxWidth = bbox.width;
					const bboxHeight = bbox.height;
          const vb = `0 0 ${bboxWidth} ${bboxHeight}`;
          svgElem.setAttribute('viewBox', vb);
        }
        svgElem.style.display = 'block';
        svgElem.style.margin = 'auto';
        svgElem.style.maxWidth = '100%';
        svgElem.style.maxHeight = '100%';
        svgElem.setAttribute('role', 'img');
        svgElem.setAttribute('aria-label', 'Diagramm-Vorschau');

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

  /**
   * Handles the code change event.
	 * 
   * @param e The code change event.
   * @returns void
   */
  const handleCodeChange = (value: string) => {
    setDiagramCode(value);
    setSvg('');
    setError('');
  }

  return (
    <div className="flex w-full h-[80vh] min-h-[400px] overflow-hidden gap-6 p-6 bg-bg text-text">
			<Toolbar code={diagramCode} setCode={setDiagramCode} />
      {/* Linker Bereich: Editor */}
      <div className="w-1/4 min-w-[200px] max-w-[500px] bg-card shadow-lg flex flex-col rounded-2xl p-4 border border-border">
        <Editor value={diagramCode} onChange={handleCodeChange} />
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
					error ? (
						<div className="bg-alert-bg text-alert-text p-2 rounded text-xs mt-2 border border-alert-text">
							Fehler: {error}
						</div>
					) : (
						<div className="flex flex-col opacity-40 items-center justify-center w-full h-full">
              <img src="/logo.svg" alt="Mermaid Viewer Logo" className="w-1/2 h-1/2" />
							<span className="text-text-muted">Keine Vorschau verfügbar</span>
						</div>
					)
        )}
      </div>
    </div>
  );
}

export default DiagramView;