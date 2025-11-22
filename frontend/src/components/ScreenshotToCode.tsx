import React, { useState } from 'react';
import { Upload, Wand2, Code2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function ScreenshotToCode({ onCodeGenerated }: { onCodeGenerated: (code: string) => void }) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [framework, setFramework] = useState<'react' | 'vue' | 'html'>('react');
  const [style, setStyle] = useState<'tailwind' | 'css'>('tailwind');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generateCode = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const base64Data = image.split(',')[1];

      const response = await axios.post(`${API_URL}/api/vision/screenshot-to-code`, {
        imageBase64: base64Data,
        framework,
        style,
      });

      if (response.data.success) {
        onCodeGenerated(response.data.data.code);
      }
    } catch (error) {
      console.error('Screenshot to code error:', error);
      alert('Failed to generate code. Make sure AI provider is configured.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Wand2 className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Screenshot to Code</h3>
      </div>

      <div className="space-y-4">
        {/* Image Upload */}
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
          {image ? (
            <div className="relative">
              <img src={image} alt="Upload" className="max-h-64 mx-auto rounded" />
              <button
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-300">Click to upload screenshot</p>
              <p className="text-sm text-slate-500">PNG, JPG up to 10MB</p>
            </label>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Framework</label>
            <select
              value={framework}
              onChange={(e) => setFramework(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded"
            >
              <option value="react">React</option>
              <option value="vue">Vue</option>
              <option value="html">HTML</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Styling</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded"
            >
              <option value="tailwind">Tailwind CSS</option>
              <option value="css">Plain CSS</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateCode}
          disabled={!image || loading}
          className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded font-medium transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Code2 className="w-5 h-5" />
              Generate Code
            </>
          )}
        </button>
      </div>
    </div>
  );
}
