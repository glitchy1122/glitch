# Safe Browser

A modern, secure Electron-based web browser with built-in content filtering and sleek design.

## Features

- 🛡️ **Content Filtering**: Block unwanted websites using a customizable blocklist
- 🔍 **Omnibox**: Smart address bar with search functionality
- 📜 **History**: Browse your browsing history
- 🎨 **Modern UI**: Sleek, gradient-based design with smooth animations
- ⚙️ **Settings**: Configure default browser settings
- 🔒 **Privacy**: Secure browsing with context isolation and sandboxing

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/glitchy1122/safe-browser.git
cd safe-browser
```

2. Install dependencies:
```bash
npm install
```

3. Run the application:
```bash
npm start
```

## Configuration

### Blocklist URL

Update the `BLOCKLIST_URL` in `main.js` to point to your blocklist JSON file:

```javascript
const BLOCKLIST_URL = 'https://glitchy1122.github.io/my-browser-blocklist/json';
```

The blocklist should be a JSON array of domain names:
```json
[
  "example.com",
  "blocked-site.org"
]
```

## Development

### Project Structure

```
Browser/
├── main.js              # Main Electron process
├── preload.js           # Preload script for main window
├── index.html           # Main UI navigation bar
├── settings.html        # Settings window
├── history.html         # History window
├── blocked.html         # Blocked page template
└── package.json         # Project dependencies
```

### Building for Production

Currently configured for development. To build for production, consider using:

- [electron-builder](https://www.electron.build/)
- [electron-forge](https://www.electronforge.io/)

## Continuous Integration

This project uses GitHub Actions for CI/CD. The workflow:

- Runs on push and pull requests
- Tests the application build
- Validates code quality

See `.github/workflows/ci.yml` for details.

## License

ISC

## Author

glitchy1122

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

