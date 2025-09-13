# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a standalone web application for analyzing UEFA Champions League 2025-26 travel patterns. It's a client-side only application with no build process, dependencies, or package manager - just static HTML, CSS, and JavaScript files that can be opened directly in a browser.

## Running the Application

To run the application:
```bash
# Option 1: Open directly in browser
open index.html

# Option 2: Serve with Python (for CORS-free local development)
python3 -m http.server 8000
# Then visit http://localhost:8000

# Option 3: Serve with Node.js
npx http-server .
```

## Architecture

### Core Files
- `index.html` - Main HTML structure with three tabs: All Matches Overview, Interactive Travel Analysis, and Travel Data Table
- `app.js` - Main JavaScript logic containing:
  - `stadiumData` array with team information, coordinates, and travel statistics
  - `matchData` array defining home/away match relationships
  - Map initialization using Leaflet.js for interactive visualization
  - Tab switching functionality and search capabilities
  - Travel distance calculations and data export features
- `style.css` - Complete styling with CSS custom properties and responsive design

### Key Functionality
- **Interactive Maps**: Two Leaflet.js maps showing stadium locations and travel patterns
- **Travel Analysis**: Calculates distances using Haversine formula between stadium coordinates
- **Search & Filter**: Team search functionality across all tabs
- **Data Export**: CSV export functionality for travel data table
- **Responsive Design**: Mobile-friendly layout with tab navigation

### Data Structure
- Teams are organized by UEFA coefficient pots (1-4) with color-coded markers
- Each team has travel statistics including total distance, shortest/longest trips
- Match relationships define home and away fixtures for visualization

### External Dependencies
- Leaflet.js (1.9.4) - loaded via CDN for interactive maps
- OpenStreetMap tiles - for map visualization

## Development Notes

- No build process, linting, or testing setup required
- All code is vanilla JavaScript with no frameworks
- Coordinate data is embedded in `app.js` as static arrays
- Maps initialize lazily when tabs are switched for better performance