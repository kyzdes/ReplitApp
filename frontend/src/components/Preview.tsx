import React, { useEffect, useRef, useState } from 'react';
import { useEditorStore } from '../stores/useEditorStore';
import { RefreshCw } from 'lucide-react';

export function Preview() {
  const { files } = useEditorStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    updatePreview();
  }, [files]);

  const updatePreview = () => {
    try {
      setError(null);

      const htmlFile = files.find(f => f.name.endsWith('.html'));
      const cssFile = files.find(f => f.name.endsWith('.css'));
      const jsFile = files.find(f => f.name.endsWith('.js') || f.name.endsWith('.jsx'));

      let html = htmlFile?.content || '<div id="root"></div>';
      const css = cssFile?.content || '';
      const js = jsFile?.content || '';

      // Inject CSS and JS into HTML
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
        const iframe = iframeRef.current;
        iframe.srcdoc = fullHtml;
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-900">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <h3 className="text-sm font-semibold text-white">Preview</h3>
        <button
          onClick={updatePreview}
          className="p-1 hover:bg-slate-700 rounded transition-colors"
          title="Refresh preview"
        >
          <RefreshCw className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {error ? (
        <div className="p-4 text-red-400">
          <h4 className="font-semibold mb-2">Preview Error:</h4>
          <pre className="text-sm">{error}</pre>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          className="w-full flex-1 bg-white"
          sandbox="allow-scripts allow-modals"
          title="Preview"
        />
      )}
    </div>
  );
}
