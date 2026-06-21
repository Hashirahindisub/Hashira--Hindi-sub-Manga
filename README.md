# ⚔️ Hashira Hindi Sub Manga - PDF Viewer

एक advanced PDF viewer website जिसमें search, menu, theme support, और Arollinks shortener integration है।

## 🌟 Features

- ✅ **PDF Viewer** - High-quality PDF rendering with zoom controls
- ✅ **Chapter Management** - Easy chapter navigation and listing
- ✅ **Search Functionality** - Quick chapter search by name
- ✅ **Dark/Light Theme** - Theme toggle with local storage
- ✅ **Responsive Design** - Mobile-friendly interface
- ✅ **Shortlink Paywall** - After 10 chapters, users must shorten a link to continue
- ✅ **Keyboard Shortcuts** - Arrow keys for navigation, Esc to close menu
- ✅ **Mobile Optimized** - Full responsive sidebar menu
- ✅ **Page Navigation** - Jump to specific pages with page input
- ✅ **Local Storage** - Remembers reading progress and theme preference

## 🛠️ Setup Instructions

### 1. **Clone or Download**
```bash
git clone https://github.com/Hashirahindisub/Hashira--Hindi-sub-Manga.git
cd Hashira--Hindi-sub-Manga
git checkout pdf-viewer-feature
```

### 2. **Google Drive Setup**
- Upload your manga PDFs to Google Drive
- Get the **file IDs** from the shareable links
- Open `script.js` and update the `chapters` array:

```javascript
state.chapters = [
    { id: 1, title: 'Chapter 1: शुरुआत', url: 'https://drive.google.com/uc?export=download&id=YOUR_PDF_ID_1' },
    { id: 2, title: 'Chapter 2: प्रशिक्षण', url: 'https://drive.google.com/uc?export=download&id=YOUR_PDF_ID_2' },
    // Add more chapters...
];
```

### 3. **Configure Arollinks API**
- Your API key is already added in `config.js`: `7f3db1cbf6409f49ac615f382d4c8260dc354812`
- Update the `SITE_URL` in `config.js`:

```javascript
SITE_URL: 'https://your-domain.com'
```

### 4. **Deploy**
- Upload files to your hosting (GitHub Pages, Netlify, Vercel, etc.)
- Or run locally with a simple HTTP server:

```bash
python -m http.server 8000
# or
npx http-server
```

Visit `http://localhost:8000`

## 📱 Usage

### **Desktop**
- **← / →** - Previous/Next page (or use buttons)
- **Arrow Keys** - Page navigation
- **Esc** - Close sidebar
- **Search Box** - Filter chapters

### **Mobile**
- **☰ Menu** - Open chapter sidebar
- **✕** - Close sidebar
- **Navigation Buttons** - Page controls

## 🎯 Paywall System

- Users can read **10 chapters** freely
- After 10 chapters, a modal appears
- They must:
  1. Copy the shortened link
  2. Click the link and visit it
  3. Click "Verify" button
  4. After verification, reading counter resets for next 10 chapters

## 🎨 Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #1a1a2e;
    --accent-color: #e94560;
    --text-color: #eaeaea;
}
```

### Chapter Paywall Limit
In `config.js`:
```javascript
CHAPTERS_PER_PAYWALL: 10, // Change this number
```

## 📊 File Structure
```
Hashira--Hindi-sub-Manga/
├── index.html       # Main HTML file
├── styles.css       # CSS styling
├── script.js        # Main JavaScript
├── config.js        # Configuration
└── README.md        # This file
```

## 🚀 Advanced Features

### Dark/Light Mode
- Automatically saves preference in localStorage
- Click the theme button in header

### Responsive Sidebar
- Automatically collapses on mobile
- Click menu button to toggle
- Click chapter to load and close sidebar

### Zoom Controls
- **🔍+** - Zoom in
- **🔍-** - Zoom out
- Range: 0.5x to 3x

### Search Filter
- Real-time chapter filtering
- Case-insensitive search

## ⚠️ Troubleshooting

### PDFs not loading?
- Check Google Drive file IDs are correct
- Make sure PDFs are publicly accessible
- Try downloading PDF directly from link

### Shortener not working?
- Verify Arollinks API key is correct
- Check API key has required permissions
- Ensure site URL is accessible

### Theme not saving?
- Check if localStorage is enabled
- Clear browser cache and try again

## 🔐 Security Notes

- Keep your Arollinks API key private
- Consider using environment variables for production
- Ensure Google Drive PDFs have appropriate sharing settings

## 📞 Support

For issues or suggestions:
1. Check troubleshooting section
2. Open an GitHub issue with details
3. Include browser console errors

## 📜 License

MIT License - Feel free to modify and use

---

**Made with ❤️ for Hashira Hindi Sub Manga Fans**

Powered by:
- [PDF.js](https://mozilla.github.io/pdf.js/)
- [Arollinks](https://arollinks.com/)
