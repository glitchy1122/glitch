# Glitch Browser

A modern, secure Electron-based web browser with built-in content filtering, sleek design, and comprehensive browsing features.

> **"Heavenly browser for safe haven"**

## ✨ Features

### 🛡️ Content Filtering
- **Customizable Blocklist**: Block unwanted websites using a remote blocklist
- **Real-time Filtering**: Websites are blocked before they load
- **Visual Feedback**: Custom blocked page with clear messaging

### 🔍 Smart Omnibox
- **URL Navigation**: Direct URL entry with automatic protocol detection
- **Search Integration**: Enter search terms to query Google
- **Domain Detection**: Automatically adds `https://` for domains
- **Real-time Updates**: Address bar updates as you navigate

### 🧭 Navigation Controls
- **Back/Forward**: Navigate through browsing history
- **Home Button**: Quick return to homepage (Google)
- **Reload**: Refresh current page with smooth rotation animation
- **History**: View and manage browsing history in a beautiful modal window

### ⚙️ Settings & Configuration
- **Default Browser Setup**: Set Glitch as your system default browser
- **Cross-platform Support**: Works on Windows, macOS, and Linux
- **Settings Window**: Easy access to browser configuration

### 🔒 Privacy & Security
- **Context Isolation**: Secure communication between processes
- **Sandboxing**: Enhanced security for web content
- **No Tracking**: Your browsing history stays local

### 🎨 Modern UI/UX
- **Gradient Design**: Beautiful purple gradient navigation bar
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Icon-based Navigation**: Intuitive circular buttons with custom icons
- **Glassmorphism**: Modern frosted glass effects
- **Responsive Layout**: Adapts to window resizing

### 📜 History Management
- **Automatic Tracking**: Saves browsing history automatically
- **Local Storage**: History stored locally on your device
- **Easy Access**: Quick history view in modal window
- **Search & Browse**: View URLs and page titles

## 🚀 Installation

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/glitchy1122/glitch.git
cd glitch
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run the application:**
```bash
npm start
```

## ⚙️ Configuration

### Blocklist Setup

The browser uses a remote blocklist for content filtering. Update the `BLOCKLIST_URL` in `main.js`:

```javascript
const BLOCKLIST_URL = 'https://glitchy1122.github.io/my-browser-blocklist/json';
```

**Blocklist Format:**
The blocklist should be a JSON array of domain names (without protocols):

```json
[
  "example.com",
  "blocked-site.org",
  "another-domain.com"
]
```

**Blocklist Repository:**
The blocklist is hosted at: [https://github.com/glitchy1122/my-browser-blocklist](https://github.com/glitchy1122/my-browser-blocklist)

### Setting as Default Browser

1. Click the **Settings** button (⚙) in the navigation bar
2. Click **"Set as Default Browser"**
3. Follow the platform-specific instructions:
   - **Windows**: May require administrator privileges or opening Windows Settings
   - **macOS**: Opens System Preferences
   - **Linux**: Instructions provided in dialog

## 📁 Project Structure

```
glitch/
├── main.js                     # Main Electron process
├── preload.js                  # Preload script for main window
├── settings-preload.js         # Preload script for settings window
├── history-preload.js          # Preload script for history window
├── history-render.js           # History window renderer script
├── index.html                  # Main navigation UI
├── settings.html               # Settings window UI
├── history.html                # History window UI
├── blocked.html                # Blocked page template
├── blocklist.json              # Local blocklist example
├── package.json                # Project dependencies
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🛠️ Development

### Tech Stack

- **Electron** ^39.0.0 - Cross-platform desktop framework
- **Node.js** - JavaScript runtime
- **HTML/CSS/JavaScript** - UI and rendering

### Key Components

- **Main Process** (`main.js`): Handles window management, IPC, and system integration
- **Renderer Process** (`index.html`): UI navigation bar
- **BrowserView**: Web content rendering
- **Preload Scripts**: Secure bridge between main and renderer processes

### Building for Production

To create distributable packages, consider using:

- **[electron-builder](https://www.electron.build/)** - Popular choice for packaging
- **[electron-forge](https://www.electronforge.io/)** - Complete tooling solution

Example with electron-builder:
```bash
npm install --save-dev electron-builder
npm run build
```

## 📝 Usage Tips

### Navigation
- **Type URLs**: Enter full URLs like `https://example.com` or just `example.com`
- **Search**: Type any text without a domain to search Google
- **Keyboard**: Press Enter in the omnibox to navigate

### History
- Click the **History** button (📜) to view browsing history
- History is automatically saved for the last 1000 entries
- History is stored locally and never shared

### Blocked Sites
- When a site is blocked, a custom page is displayed
- The blocklist is loaded from the configured URL on startup
- Blocked sites are logged to the console

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the **GPL-3.0 License** - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**glitchy1122**

- GitHub: [@glitchy1122](https://github.com/glitchy1122)
- Repository: [https://github.com/glitchy1122/glitch](https://github.com/glitchy1122/glitch)

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- Inspired by modern browser design principles
- Uses system fonts for native look and feel

## 📊 Status

![License](https://img.shields.io/badge/license-GPL--3.0-blue)

---

**Made with ❤️ for a safer browsing experience**