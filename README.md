# UEFA Champions League 2025-26 Travel Analysis

An interactive web application analyzing travel patterns for UEFA Champions League 2025-26 teams. Visualize stadium locations, travel distances, and match connections across Europe.

## 🌍 Live Demo

Visit the live application: [GitHub Pages URL will be here after deployment]

## ✨ Features

- **Interactive Maps**: Two dynamic maps powered by Leaflet.js
  - All Matches Overview with directional travel arrows
  - Interactive Travel Analysis with hover effects
- **Travel Statistics**: Comprehensive distance calculations using real stadium coordinates
- **Search & Filter**: Find teams quickly across all views
- **Data Export**: Download travel data as CSV
- **Responsive Design**: Works on desktop and mobile devices

## 🗺️ Map Views

### 1. All Matches Overview
- Shows all stadium locations color-coded by UEFA coefficient pots
- Displays directional arrows showing travel patterns between teams
- Interactive markers with detailed team and travel information

### 2. Interactive Travel Analysis
- Hover over stadiums to see travel patterns
- Green lines indicate home matches, red lines show away matches
- Marker sizes represent total travel distance

### 3. Travel Data Table
- Sortable table with comprehensive travel statistics
- Export functionality for data analysis
- Shows shortest and longest trips for each team

## 🚀 Running Locally

This is a static web application with no build process required.

### Option 1: Direct Browser
```bash
open index.html
```

### Option 2: Local Server (Recommended)
```bash
# Python
python3 -m http.server 8000

# Node.js
npx http-server .
```

Then visit `http://localhost:8000`

## 📊 Data

The application includes:
- 38 UEFA Champions League teams with accurate stadium coordinates
- Travel distance calculations using the Haversine formula
- Match fixtures based on the 2025-26 tournament format
- Team information including pots, cities, and countries

## 🛠️ Technical Details

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Mapping**: Leaflet.js 1.9.4
- **Tiles**: OpenStreetMap
- **No Dependencies**: Runs entirely in the browser

## 📱 Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).

## 📧 Contact

If you have any questions or suggestions, please open an issue or reach out!

---

⭐ **Star this repository if you find it useful!**