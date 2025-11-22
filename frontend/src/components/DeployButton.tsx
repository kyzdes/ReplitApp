import React, { useState } from 'react';
import { Rocket, ExternalLink, Copy, Check } from 'lucide-react';

export function DeployButton({ projectId }: { projectId?: string }) {
  const [showDialog, setShowDialog] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const deploy = async (platform: 'vercel' | 'netlify' | 'railway') => {
    setDeploying(true);

    // Simulate deployment
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const url = `https://my-app-${Math.random().toString(36).slice(2, 8)}.${platform}.app`;
    setDeployUrl(url);
    setDeploying(false);
  };

  const copyUrl = () => {
    if (deployUrl) {
      navigator.clipboard.writeText(deployUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
      >
        <Rocket className="w-4 h-4" />
        Deploy
      </button>

      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold text-white mb-4">Deploy Your App</h2>

            {!deployUrl ? (
              <>
                <p className="text-slate-300 mb-6">
                  Choose a platform to deploy your application instantly
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => deploy('vercel')}
                    disabled={deploying}
                    className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white mb-1">▲ Vercel</div>
                        <div className="text-sm text-slate-400">
                          Best for Next.js and React apps
                        </div>
                      </div>
                      {deploying && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    </div>
                  </button>

                  <button
                    onClick={() => deploy('netlify')}
                    disabled={deploying}
                    className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white mb-1">🌐 Netlify</div>
                        <div className="text-sm text-slate-400">
                          Great for static sites and SPAs
                        </div>
                      </div>
                      {deploying && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    </div>
                  </button>

                  <button
                    onClick={() => deploy('railway')}
                    disabled={deploying}
                    className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white mb-1">🚂 Railway</div>
                        <div className="text-sm text-slate-400">
                          Perfect for fullstack apps
                        </div>
                      </div>
                      {deploying && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-green-500 mb-4">
                    <Check className="w-6 h-6" />
                    <span className="font-semibold">Deployed Successfully!</span>
                  </div>

                  <p className="text-slate-300 mb-4">Your app is now live at:</p>

                  <div className="flex items-center gap-2 p-3 bg-slate-900 rounded border border-slate-700">
                    <input
                      type="text"
                      value={deployUrl}
                      readOnly
                      className="flex-1 bg-transparent text-white outline-none text-sm"
                    />
                    <button
                      onClick={copyUrl}
                      className="p-2 hover:bg-slate-700 rounded transition-colors"
                      title="Copy URL"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <a
                      href={deployUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-slate-700 rounded transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded text-sm text-blue-300">
                  💡 Tip: Share your deployment URL on social media or with your team!
                </div>
              </>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowDialog(false);
                  setDeployUrl(null);
                }}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
              >
                {deployUrl ? 'Done' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
