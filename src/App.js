import React, { useState, useRef } from 'react';
import { Printer, Download, Sparkles, RefreshCw, Palette, Image, Wand2 } from 'lucide-react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [error, setError] = useState(null);
  const [recentPages, setRecentPages] = useState([]);
  const [processingStatus, setProcessingStatus] = useState('');
  const imageRef = useRef(null);

  // Post-process image to create clean coloring page
  const processImageForColoring = (imageSrc) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Process each pixel - convert to pure black and white
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Calculate luminance
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
          
          // Use threshold to convert to pure black or white
          // Threshold of 180 keeps more line detail while removing light grays
          const threshold = 180;
          const newValue = luminance > threshold ? 255 : 0;
          
          data[i] = newValue;     // R
          data[i + 1] = newValue; // G
          data[i + 2] = newValue; // B
          // Keep alpha as is
        }
        
        // Put processed image back
        ctx.putImageData(imageData, 0, 0);
        
        // Convert to data URL
        const processedUrl = canvas.toDataURL('image/png');
        resolve(processedUrl);
      };
      
      img.onerror = () => reject(new Error('Failed to load image for processing'));
      img.src = imageSrc;
    });
  };

  const suggestionCategories = [
    { emoji: '🦕', label: 'Dinosaur', prompt: 'friendly t-rex dinosaur' },
    { emoji: '🚗', label: 'Race Car', prompt: 'cool sports race car' },
    { emoji: '🦄', label: 'Unicorn', prompt: 'magical unicorn with rainbow mane' },
    { emoji: '🚀', label: 'Rocket', prompt: 'space rocket ship flying to moon' },
    { emoji: '🏰', label: 'Castle', prompt: 'fairy tale princess castle' },
    { emoji: '🐱', label: 'Kitten', prompt: 'cute fluffy kitten playing with yarn' },
    { emoji: '🦋', label: 'Butterfly', prompt: 'beautiful butterfly with detailed wings' },
    { emoji: '🤖', label: 'Robot', prompt: 'friendly cartoon robot' },
    { emoji: '🧜‍♀️', label: 'Mermaid', prompt: 'beautiful mermaid swimming underwater' },
    { emoji: '🐉', label: 'Dragon', prompt: 'cute baby dragon breathing fire' },
    { emoji: '🌸', label: 'Flowers', prompt: 'garden of sunflowers and roses' },
    { emoji: '🦁', label: 'Lion', prompt: 'majestic lion with big mane' },
    { emoji: '🐕', label: 'Puppy', prompt: 'happy puppy dog playing' },
    { emoji: '🦖', label: 'Triceratops', prompt: 'triceratops dinosaur eating plants' },
    { emoji: '🧚', label: 'Fairy', prompt: 'magical fairy with sparkly wings' },
    { emoji: '🏴‍☠️', label: 'Pirate', prompt: 'pirate ship on the ocean' },
    { emoji: '🦸', label: 'Superhero', prompt: 'superhero flying through clouds' },
    { emoji: '🎠', label: 'Carousel', prompt: 'carousel horse at carnival' },
    { emoji: '🐘', label: 'Elephant', prompt: 'baby elephant spraying water' },
    { emoji: '🦉', label: 'Owl', prompt: 'wise owl sitting on tree branch' },
  ];

  const generateColoringPage = async (inputPrompt) => {
    const searchPrompt = inputPrompt || prompt;
    if (!searchPrompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setCurrentPrompt(searchPrompt);
    setProcessingStatus('Generating image...');

    // IMPROVED prompt for better coloring page results
    const enhancedPrompt = `simple children's coloring book page of ${searchPrompt}, black and white, thick clean outlines, no shading, no gradients, no gray, no filled areas, pure white background, cartoon style, vector art style, crisp lines, minimalist, easy to color, isolated subject, no texture, high contrast black lines on white`;

    // Pollinations.ai endpoint - completely free, no API key needed!
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1024&height=1024&seed=${Date.now()}&nologo=true&model=flux`;

    try {
      // Pre-load the image to check if it works
      setProcessingStatus('Waiting for AI...');
      
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      // Process the image to clean it up
      setProcessingStatus('Cleaning up lines...');
      const processedImage = await processImageForColoring(imageUrl);
      
      setGeneratedImage(processedImage);
      setProcessingStatus('');
      
      // Add to recent pages
      setRecentPages(prev => {
        const newPage = { prompt: searchPrompt, url: processedImage };
        const filtered = prev.filter(p => p.prompt !== searchPrompt);
        return [newPage, ...filtered].slice(0, 6);
      });

    } catch (err) {
      console.error('Generation error:', err);
      setError('Failed to generate image. Please try again!');
      setProcessingStatus('');
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerate = () => {
    if (currentPrompt) {
      generateColoringPage(currentPrompt);
    }
  };

  const handlePrint = () => {
    if (!generatedImage) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Coloring Page - ${currentPrompt}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh;
              padding: 0.5in;
            }
            img { 
              max-width: 100%; 
              max-height: 9in;
              border: 2px solid #eee;
            }
            @media print {
              body { padding: 0; }
              img { 
                max-width: 7.5in; 
                max-height: 10in;
                border: none;
              }
            }
          </style>
        </head>
        <body>
          <img src="${generatedImage}" crossorigin="anonymous" onload="setTimeout(() => { window.print(); window.close(); }, 500);" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `coloring-page-${currentPrompt.replace(/\s+/g, '-').toLowerCase().slice(0, 30)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      // Fallback: open in new tab
      window.open(generatedImage, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-pink-50 to-cyan-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-pink-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Palette className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                Coloring Page Magic ✨
              </h1>
              <p className="text-sm text-gray-500">Create custom coloring pages instantly!</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-gray-100">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            🎨 What would you like to color today?
          </label>
          
          <div className="flex gap-3 mb-5">
            <div className="flex-1 relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && generateColoringPage()}
                placeholder="Type anything... (e.g., 'a dragon reading a book')"
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-violet-400 focus:outline-none transition-all focus:shadow-lg focus:shadow-violet-100"
                disabled={isGenerating}
              />
              <Wand2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            </div>
            <button
              onClick={() => generateColoringPage()}
              disabled={isGenerating || !prompt.trim()}
              className="px-8 py-4 bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400 text-white font-bold rounded-2xl hover:from-violet-600 hover:via-pink-600 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span className="hidden sm:inline">Creating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span className="hidden sm:inline">Generate!</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Suggestions */}
          <div>
            <p className="text-sm text-gray-500 mb-3 font-medium">⚡ Quick ideas (click to generate!):</p>
            <div className="flex flex-wrap gap-2">
              {suggestionCategories.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setPrompt(item.prompt);
                    generateColoringPage(item.prompt);
                  }}
                  disabled={isGenerating}
                  className="px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-violet-50 hover:to-pink-50 rounded-xl text-sm font-medium transition-all disabled:opacity-50 flex items-center gap-1.5 border border-gray-200 hover:border-violet-300 hover:shadow-md active:scale-95"
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mb-8 text-red-700">
            <p className="font-semibold">😕 Oops! Something went wrong</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={regenerate}
              className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="bg-white rounded-3xl shadow-xl p-12 mb-8 text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-violet-100 to-pink-100 rounded-full mb-6">
              <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-500 rounded-full animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Creating your coloring page...</h3>
            <p className="text-gray-500">"{currentPrompt}"</p>
            {processingStatus && (
              <p className="mt-3 text-violet-600 font-medium">{processingStatus}</p>
            )}
            <div className="mt-6 flex justify-center gap-2">
              {[0, 1, 2, 3, 4].map(i => (
                <div 
                  key={i}
                  className="w-3 h-3 rounded-full bg-violet-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Generated Image */}
        {generatedImage && !isGenerating && (
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-xl font-bold text-gray-700">🖼️ Your Coloring Page</h3>
                <p className="text-sm text-gray-500 mt-1">"{currentPrompt}"</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={regenerate}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  New Version
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
            
            <div className="border-4 border-gray-100 rounded-2xl overflow-hidden bg-white shadow-inner">
              <img
                ref={imageRef}
                src={generatedImage}
                alt={`Coloring page: ${currentPrompt}`}
                className="w-full h-auto"
                crossOrigin="anonymous"
              />
            </div>
            
            <div className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-pink-50 rounded-xl">
              <p className="text-center text-sm text-gray-600">
                💡 <strong>Tip:</strong> Click "Print" to print directly, or "Save" to download. 
                Not quite right? Click "New Version" for a different design!
              </p>
            </div>
          </div>
        )}

        {/* Recent Pages Gallery */}
        {recentPages.length > 1 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 mb-8">
            <p className="text-sm font-semibold text-gray-600 mb-3">📚 Recent creations:</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {recentPages.map((page, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setGeneratedImage(page.url);
                    setCurrentPrompt(page.prompt);
                  }}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                    generatedImage === page.url ? 'border-violet-500 shadow-lg' : 'border-gray-200 hover:border-violet-300'
                  }`}
                >
                  <img 
                    src={page.url} 
                    alt={page.prompt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Welcome/Instructions */}
        {!generatedImage && !isGenerating && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-100 via-pink-100 to-orange-100 rounded-full mb-5">
              <Image className="w-10 h-10 text-violet-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-4">How it works</h3>
            <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-violet-500 text-white rounded-full flex items-center justify-center text-lg font-bold mb-3">1</div>
                <p className="text-gray-600">Type what you want to color (be creative!)</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center text-lg font-bold mb-3">2</div>
                <p className="text-gray-600">Click Generate and wait a few seconds</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center text-lg font-bold mb-3">3</div>
                <p className="text-gray-600">Print or save your coloring page!</p>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl inline-block">
              <p className="text-green-700 text-sm font-medium">
                ✅ 100% Free • No account needed • Unlimited pages
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>Made with ❤️ for creative kids everywhere</p>
        <p className="mt-1 text-xs text-gray-400">Powered by Pollinations.ai</p>
      </footer>
    </div>
  );
}

export default App;
