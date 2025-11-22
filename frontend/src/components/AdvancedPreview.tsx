import React, { useState, useRef, useEffect } from 'react';
import { useEditorStore } from '../stores/useEditorStore';
import { RefreshCw, Smartphone, Tablet, Monitor, RotateCw, Camera, Download } from 'lucide-react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

const DEVICES = {
  mobile: { width: 375, height: 667, name: 'iPhone SE' },
  tablet: { width: 768, height: 1024, name: 'iPad' },
  desktop: { width: 1920, height: 1080, name: 'Desktop' },
};

export function AdvancedPreview() {
  const { files } = useEditorStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [rotated, setRotated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    updatePreview();
  }, [files]);

  useEffect(() => {
    calculateScale();
  }, [device, rotated]);

  const calculateScale = () => {
    const container = document.getElementById('preview-container');
    if (!container) return;

    const deviceConfig = DEVICES[device];
    const width = rotated ? deviceConfig.height : deviceConfig.width;
    const height = rotated ? deviceConfig.width : deviceConfig.height;

    const containerWidth = container.clientWidth - 40;
    const containerHeight = container.clientHeight - 40;

    const scaleX = containerWidth / width;
    const scaleY = containerHeight / height;

    setScale(Math.min(scaleX, scaleY, 1));
  };

  const updatePreview = () => {
    try {
      setError(null);

      const htmlFile = files.find((f) => f.name.endsWith('.html'));
      const cssFile = files.find((f) => f.name.endsWith('.css'));
      const jsFile = files.find((f) => f.name.endsWith('.js') || f.name.endsWith('.jsx'));

      let html = htmlFile?.content || '<div id="root"></div>';
      const css = cssFile?.content || '';
      const js = jsFile?.content || '';

      const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            ${css}
            body { margin: 0; padding: 16px; font-family: system-ui, -apple-system, sans-serif; }
          </style>
        </head>
        <body>
          ${html}
          <script type="module">
            try {
              ${js}
            } catch (error) {
              console.error('Runtime error:', error);
              document.body.innerHTML = '<div style="color: red; padding: 20px;"><h3>Error:</h3><pre>' + error.message + '</pre></div>';
            }
          </script>
        </body>
        </html>
      `;

      if (iframeRef.current) {
        iframeRef.current.srcdoc = fullHtml;
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const takeScreenshot = () => {
    // In a real implementation, use html2canvas or similar
    alert('Screenshot feature coming soon!');
  };

  const downloadCode = () => {
    const htmlFile = files.find((f) => f.name.endsWith('.html'));
    if (!htmlFile) return;

    const blob = new Blob([htmlFile.content || ''], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const deviceConfig = DEVICES[device];
  const width = rotated ? deviceConfig.height : deviceConfig.width;
  const height = rotated ? deviceConfig.width : deviceConfig.height;

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white">Preview</h3>
          <span className="text-xs text-slate-400">
            {deviceConfig.name} ({width}×{height})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Selector */}
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded transition-colors ${
              device === 'mobile'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:bg-slate-700'
            }`}
            title="Mobile"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          <button
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded transition-colors ${
              device === 'tablet'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:bg-slate-700'
            }`}
            title="Tablet"
          >
            <Tablet className="w-4 h-4" />
          </button>

          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded transition-colors ${
              device === 'desktop'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:bg-slate-700'
            }`}
            title="Desktop"
          >
            <Monitor className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-slate-700" />

          {/* Actions */}
          <button
            onClick={() => setRotated(!rotated)}
            className="p-1.5 text-slate-400 hover:bg-slate-700 rounded transition-colors"
            title="Rotate"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={takeScreenshot}
            className="p-1.5 text-slate-400 hover:bg-slate-700 rounded transition-colors"
            title="Screenshot"
          >
            <Camera className="w-4 h-4" />
          </button>

          <button
            onClick={downloadCode}
            className="p-1.5 text-slate-400 hover:bg-slate-700 rounded transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={updatePreview}
            className="p-1.5 text-slate-400 hover:bg-slate-700 rounded transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div id="preview-container" className="flex-1 flex items-center justify-center p-5 overflow-auto">
        {error ? (
          <div className="p-4 text-red-400">
            <h4 className="font-semibold mb-2">Preview Error:</h4>
            <pre className="text-sm">{error}</pre>
          </div>
        ) : (
          <div
            className="bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'center',
            }}
          >
            <iframe
              ref={iframeRef}
              className="w-full h-full"
              sandbox="allow-scripts allow-modals"
              title="Preview"
            />
          </div>
        )}
      </div>
    </div>
  );
}
