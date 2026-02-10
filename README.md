# 🎨 Coloring Page Magic

An AI-powered coloring page generator for kids! Type any subject and get a printable coloring page in seconds.

![Coloring Page Generator](https://img.shields.io/badge/React-18.2.0-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Free API](https://img.shields.io/badge/API-Free-brightgreen)

## ✨ Features

- **AI-Powered Generation** - Uses Pollinations.ai (100% free, no API key needed!)
- **20+ Quick Suggestions** - One-click generation for popular themes
- **Print Ready** - Direct print button opens a print-optimized view
- **Download** - Save coloring pages as PNG files
- **Mobile Friendly** - Works great on tablets and phones
- **Recent Gallery** - Keep track of your generated pages
- **Regenerate** - Don't like the result? Generate a new version instantly

## 🚀 Quick Start

### Option 1: Run Locally

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/coloring-page-generator.git

# Navigate to project directory
cd coloring-page-generator

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Option 2: Deploy to GitHub Pages

1. Fork this repository
2. Go to Settings → Pages
3. Select "GitHub Actions" as the source
4. Push any change to trigger deployment

### Option 3: Deploy to Vercel/Netlify

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/coloring-page-generator)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/coloring-page-generator)

## 🎯 How It Works

1. **Enter a prompt** - Type what you want to color (e.g., "a dragon reading a book")
2. **Click Generate** - Wait a few seconds for the AI to create your page
3. **Print or Download** - Get your coloring page ready for crayons!

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Tailwind CSS** (via CDN) - Styling
- **Lucide React** - Icons
- **Pollinations.ai** - Free AI image generation

## 📁 Project Structure

```
coloring-page-generator/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## 🎨 Customization

### Adding More Suggestions

Edit the `suggestionCategories` array in `src/App.js`:

```javascript
const suggestionCategories = [
  { emoji: '🦕', label: 'Dinosaur', prompt: 'friendly t-rex dinosaur' },
  // Add your own here!
  { emoji: '🎸', label: 'Guitar', prompt: 'electric guitar with flames' },
];
```

### Changing the Art Style

Modify the `enhancedPrompt` in the `generateColoringPage` function:

```javascript
const enhancedPrompt = `Children's coloring book page, black and white line art, ${searchPrompt}, your custom style here`;
```

## 📝 License

MIT License - feel free to use this for personal or commercial projects!

## 🙏 Credits

- Image generation powered by [Pollinations.ai](https://pollinations.ai/)
- Icons by [Lucide](https://lucide.dev/)

## 💡 Tips for Best Results

- **Be specific** - "cute baby dragon with big eyes" works better than just "dragon"
- **Add details** - "princess castle with towers and a moat" gives better results
- **Try variations** - Click "New Version" to get different interpretations

---

Made with ❤️ for creative kids everywhere
