// Global variables for data
let stadiumData = [];
let matchData = [];

// Function to load JSON data
async function loadData() {
    try {
        const [stadiumResponse, matchResponse] = await Promise.all([
            fetch('./data/stadiums.json'),
            fetch('./data/matches.json')
        ]);

        if (!stadiumResponse.ok || !matchResponse.ok) {
            throw new Error('Failed to load data files');
        }

        stadiumData = await stadiumResponse.json();
        matchData = await matchResponse.json();

        // Initialize table data after loading
        tableData = [...stadiumData];

        console.log('Data loaded successfully:', { stadiums: stadiumData.length, matches: matchData.length });
        return true;
    } catch (error) {
        console.error('Error loading data:', error);
        return false;
    }
}

// Global variables
let matchesMap, interactiveMap;
let currentHoveredTeam = null;
let hoverLines = [];
let teamLabels = new Map();
let highlightedLabels = [];
let matchesMarkers = new Map();
let interactiveMarkers = new Map();
let allMatchLines = [];
let tableData = [];
let currentSort = { column: null, direction: 'asc' };
let mapsInitialized = false;
let tableInitialized = false;

// Utility functions
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
}

// Travel statistics calculation functions
function calculateTravelStats(teamName) {
    const teamMatches = matchData.find(m => m.home_team === teamName);
    if (!teamMatches) {
        return {
            total_travel: 0,
            total_guest_travel: 0,
            travel_difference: 0,
            shortest_trip: { distance: 0, opponent: '' },
            longest_trip: { distance: 0, opponent: '' }
        };
    }

    // Calculate team's own travel distances (when they travel away from home)
    const ownTravelDistances = teamMatches.home_matches.map(m => m.distance);
    const total_travel = ownTravelDistances.reduce((sum, dist) => sum + dist, 0);

    // Calculate guest travel (when other teams come to this team's stadium)
    const guestTravelDistances = teamMatches.away_matches.map(m => m.distance);
    const total_guest_travel = guestTravelDistances.reduce((sum, dist) => sum + dist, 0);

    const travel_difference = total_travel - total_guest_travel;

    // Find shortest and longest trips from the team's own travels only
    const validMatches = teamMatches.home_matches.filter(m => m.distance > 0);

    let shortest_trip = { distance: Infinity, opponent: '' };
    let longest_trip = { distance: 0, opponent: '' };

    validMatches.forEach(match => {
        if (match.distance < shortest_trip.distance) {
            shortest_trip = { distance: match.distance, opponent: match.team };
        }
        if (match.distance > longest_trip.distance) {
            longest_trip = { distance: match.distance, opponent: match.team };
        }
    });

    return {
        total_travel,
        total_guest_travel,
        travel_difference,
        shortest_trip: shortest_trip.distance === Infinity ? { distance: 0, opponent: '' } : shortest_trip,
        longest_trip
    };
}

function getTeamTravelStats(teamName) {
    return calculateTravelStats(teamName);
}

function getPotColor(pot) {
    const colors = {
        1: '#dc2626', // red - elite teams
        2: '#2563eb', // blue - strong teams
        3: '#16a34a', // green - mid-tier teams
        4: '#6b7280'  // gray - underdogs
    };
    return colors[pot] || '#6b7280';
}

function getStadiumByTeam(teamName) {
    return stadiumData.find(stadium => stadium.team === teamName);
}

function createPopupContent(stadium) {
    const stats = getTeamTravelStats(stadium.team);
    return `
        <div class="popup-content">
            <h4>${stadium.team}</h4>
            <div class="stadium-info">
                <p><strong>Stadium:</strong> ${stadium.stadium}</p>
                <p><strong>City:</strong> ${stadium.city}, ${stadium.country}</p>
                <p><strong>Pot:</strong> ${stadium.pot}</p>
                <div class="travel-distance">
                    <strong>Total Travel:</strong> ${stats.total_travel.toLocaleString()} km
                </div>
                <div class="travel-distance">
                    <strong>Shortest Trip:</strong> ${stats.shortest_trip.distance} km to ${stats.shortest_trip.opponent}
                </div>
                <div class="travel-distance">
                    <strong>Longest Trip:</strong> ${stats.longest_trip.distance} km to ${stats.longest_trip.opponent}
                </div>
            </div>
        </div>
    `;
}

function getMarkerSize(totalTravel) {
    // Scale marker size based on total travel (min: 8, max: 20)
    const allTravelDistances = stadiumData.map(s => getTeamTravelStats(s.team).total_travel);
    const minTravel = Math.min(...allTravelDistances);
    const maxTravel = Math.max(...allTravelDistances);
    const normalizedSize = (totalTravel - minTravel) / (maxTravel - minTravel);
    return 8 + (normalizedSize * 12);
}

// Initialize maps
function initializeMaps() {
    if (mapsInitialized) return;
    
    showLoading();
    
    setTimeout(() => {
        try {
            // Initialize matches map
            const matchesMapEl = document.getElementById('matchesMap');
            if (matchesMapEl) {
                matchesMap = L.map('matchesMap', {
                    zoomControl: true,
                    scrollWheelZoom: true
                }).setView([50.0, 10.0], 4);
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 18
                }).addTo(matchesMap);

                loadMatchesMap();
            }

            // Initialize interactive map
            const interactiveMapEl = document.getElementById('interactiveMap');
            if (interactiveMapEl) {
                interactiveMap = L.map('interactiveMap', {
                    zoomControl: true,
                    scrollWheelZoom: true
                }).setView([50.0, 10.0], 4);
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 18
                }).addTo(interactiveMap);

                loadInteractiveMap();
            }
            
            mapsInitialized = true;
            hideLoading();
        } catch (error) {
            console.error('Error initializing maps:', error);
            hideLoading();
        }
    }, 300);
}

// Matches map (Tab 1)
function loadMatchesMap() {
    if (!matchesMap) return;
    
    // Clear existing markers and lines
    matchesMarkers.clear();
    allMatchLines.forEach(line => {
        if (matchesMap.hasLayer(line)) {
            matchesMap.removeLayer(line);
        }
    });
    allMatchLines = [];

    // Add all stadium markers
    stadiumData.forEach(stadium => {
        const marker = L.circleMarker([stadium.latitude, stadium.longitude], {
            radius: 8,
            fillColor: getPotColor(stadium.pot),
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(matchesMap);

        marker.bindPopup(createPopupContent(stadium), {
            maxWidth: 300,
            className: 'custom-popup'
        });
        matchesMarkers.set(stadium.team, marker);
    });

    // Draw all match connections
    drawAllMatches();
}

function drawAllMatches() {
    if (!matchesMap) return;
    
    matchData.forEach(match => {
        const homeStadium = getStadiumByTeam(match.home_team);
        if (!homeStadium) return;

        // Draw lines for this team's away matches (this team travels to others)
        match.home_matches.forEach(awayTeamData => {
            const awayStadium = getStadiumByTeam(awayTeamData.team);
            if (awayStadium) {
                const line = drawMatchLine(homeStadium, awayStadium, matchesMap, false);
                if (line) allMatchLines.push(line);
            }
        });
    });
}

function drawMatchLine(fromStadium, toStadium, map, showDistance = false) {
    if (!map || !fromStadium || !toStadium) return null;
    
    const from = [fromStadium.latitude, fromStadium.longitude];
    const to = [toStadium.latitude, toStadium.longitude];
    
    const line = L.polyline([from, to], {
        color: getPotColor(fromStadium.pot),
        weight: 2,
        opacity: 0.6
    }).addTo(map);

    if (showDistance) {
        const distance = haversineDistance(from[0], from[1], to[0], to[1]);
        const midLat = (from[0] + to[0]) / 2;
        const midLng = (from[1] + to[1]) / 2;
        
        const distanceLabel = L.divIcon({
            className: 'distance-label',
            html: `${distance} km`,
            iconSize: [60, 20],
            iconAnchor: [30, 10]
        });

        L.marker([midLat, midLng], { icon: distanceLabel }).addTo(map);
    }

    return line;
}

// Smart label positioning to avoid overlaps
function getSmartLabelPosition(stadium, markerSize, allStadiums, index) {
    const positions = [
        [60, -markerSize - 8],    // top (default)
        [60, markerSize + 20],    // bottom
        [-10, -markerSize/2],     // left
        [130, -markerSize/2],     // right
        [95, -markerSize - 8],    // top-right
        [25, -markerSize - 8],    // top-left
        [95, markerSize + 20],    // bottom-right
        [25, markerSize + 20]     // bottom-left
    ];

    // Use index to cycle through positions for nearby stadiums
    const positionIndex = index % positions.length;
    return positions[positionIndex];
}

// Interactive map (Tab 2)
function loadInteractiveMap() {
    if (!interactiveMap) return;

    // Clear existing markers and labels
    interactiveMarkers.clear();
    teamLabels.clear();

    stadiumData.forEach((stadium, index) => {
        const stats = getTeamTravelStats(stadium.team);
        const markerSize = getMarkerSize(stats.total_travel);
        const potColor = getPotColor(stadium.pot);

        const marker = L.circleMarker([stadium.latitude, stadium.longitude], {
            radius: markerSize,
            fillColor: potColor,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.7
        }).addTo(interactiveMap);

        marker.bindPopup(createPopupContent(stadium), {
            maxWidth: 300,
            className: 'custom-popup'
        });

        // Create team label with pot color and smart positioning
        const labelPosition = getSmartLabelPosition(stadium, markerSize, stadiumData, index);
        const labelIcon = L.divIcon({
            className: 'team-label',
            html: `<span data-pot="${stadium.pot}" style="background-color: ${potColor}; border-color: ${potColor};">${stadium.team}</span>`,
            iconSize: [120, 16],
            iconAnchor: labelPosition
        });

        const labelMarker = L.marker([stadium.latitude, stadium.longitude], {
            icon: labelIcon
        });

        // Add hover events
        marker.on('mouseover', function() {
            showTravelLines(stadium.team);
        });

        marker.on('mouseout', function() {
            hideTravelLines();
        });

        interactiveMarkers.set(stadium.team, marker);
        teamLabels.set(stadium.team, labelMarker);
    });
}

function showTravelLines(teamName) {
    if (currentHoveredTeam === teamName || !interactiveMap) return;

    hideTravelLines();
    currentHoveredTeam = teamName;

    const teamData = matchData.find(match => match.home_team === teamName);
    const homeStadium = getStadiumByTeam(teamName);

    if (!teamData || !homeStadium) return;

    // Show and highlight the hovered team's label
    const hoveredLabel = teamLabels.get(teamName);
    if (hoveredLabel) {
        hoveredLabel.addTo(interactiveMap);
        setTimeout(() => {
            if (hoveredLabel.getElement()) {
                hoveredLabel.getElement().querySelector('.team-label span').classList.add('team-label--hovered');
            }
        }, 10);
    }

    const opponentTeams = [];

    // Draw green lines for home matches (teams coming to this stadium)
    teamData.away_matches.forEach(visitingTeamData => {
        const visitingStadium = getStadiumByTeam(visitingTeamData.team);
        if (visitingStadium) {
            const lineData = drawTravelLine(visitingStadium, homeStadium, '#16a34a', 'home', visitingTeamData.team);
            if (lineData) hoverLines.push(lineData);
            opponentTeams.push(visitingTeamData.team);
        }
    });

    // Draw red lines for away matches (this team traveling)
    teamData.home_matches.forEach(hostTeamData => {
        const hostStadium = getStadiumByTeam(hostTeamData.team);
        if (hostStadium) {
            const lineData = drawTravelLine(homeStadium, hostStadium, '#dc2626', 'away', hostTeamData.team);
            if (lineData) hoverLines.push(lineData);
            opponentTeams.push(hostTeamData.team);
        }
    });

    // Show and highlight opponent team labels
    opponentTeams.forEach(opponentTeam => {
        const opponentLabel = teamLabels.get(opponentTeam);
        if (opponentLabel) {
            opponentLabel.addTo(interactiveMap);
            setTimeout(() => {
                if (opponentLabel.getElement()) {
                    opponentLabel.getElement().querySelector('.team-label span').classList.add('team-label--opponent');
                }
            }, 10);
            highlightedLabels.push(opponentLabel);
        }
    });
}

function drawTravelLine(fromStadium, toStadium, color, type, opponentTeam) {
    if (!interactiveMap || !fromStadium || !toStadium) return null;

    const from = [fromStadium.latitude, fromStadium.longitude];
    const to = [toStadium.latitude, toStadium.longitude];
    const distance = haversineDistance(from[0], from[1], to[0], to[1]);

    const line = L.polyline([from, to], {
        color: color,
        weight: 3,
        opacity: 0.8
    }).addTo(interactiveMap);

    // Add distance label with opponent's pot color
    const midLat = (from[0] + to[0]) / 2;
    const midLng = (from[1] + to[1]) / 2;

    // Get opponent's pot color
    const opponentStadium = getStadiumByTeam(opponentTeam);
    const opponentPotColor = opponentStadium ? getPotColor(opponentStadium.pot) : color;

    const distanceLabel = L.divIcon({
        className: 'distance-label',
        html: `<span style="background-color: ${opponentPotColor}; border-color: ${opponentPotColor};">${distance} km</span>`,
        iconSize: [60, 20],
        iconAnchor: [30, 10]
    });

    const labelMarker = L.marker([midLat, midLng], { icon: distanceLabel }).addTo(interactiveMap);

    return { line, label: labelMarker };
}

function hideTravelLines() {
    if (!interactiveMap) return;

    // Clear travel lines and distance labels
    hoverLines.forEach(item => {
        if (item.line && interactiveMap.hasLayer(item.line)) {
            interactiveMap.removeLayer(item.line);
        }
        if (item.label && interactiveMap.hasLayer(item.label)) {
            interactiveMap.removeLayer(item.label);
        }
    });
    hoverLines = [];

    // Hide and clear label highlights
    if (currentHoveredTeam) {
        const hoveredLabel = teamLabels.get(currentHoveredTeam);
        if (hoveredLabel) {
            if (hoveredLabel.getElement()) {
                const span = hoveredLabel.getElement().querySelector('.team-label span');
                if (span) span.classList.remove('team-label--hovered');
            }
            if (interactiveMap.hasLayer(hoveredLabel)) {
                interactiveMap.removeLayer(hoveredLabel);
            }
        }
    }

    highlightedLabels.forEach(label => {
        if (label) {
            if (label.getElement()) {
                const span = label.getElement().querySelector('.team-label span');
                if (span) span.classList.remove('team-label--opponent');
            }
            if (interactiveMap.hasLayer(label)) {
                interactiveMap.removeLayer(label);
            }
        }
    });
    highlightedLabels = [];

    currentHoveredTeam = null;
}

// Table functionality (Tab 3)
function initializeTable() {
    if (tableInitialized) return;
    
    loadTable();
    initializeTableSorting();
    initializeCSVExport();
    tableInitialized = true;
}

function loadTable() {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    tableData.forEach((stadium, index) => {
        const row = document.createElement('tr');
        const stats = getTeamTravelStats(stadium.team);

        const travelDiffClass = stats.travel_difference > 0 ? 'travel-positive' :
                              stats.travel_difference < 0 ? 'travel-negative' : 'travel-neutral';

        row.innerHTML = `
            <td class="no-cell">${index + 1}</td>
            <td>
                <span class="pot-indicator" style="background-color: ${getPotColor(stadium.pot)};"></span>
                ${stadium.team}
            </td>
            <td>${stadium.city}</td>
            <td>${stadium.country}</td>
            <td>${stadium.pot}</td>
            <td>${stats.total_travel.toLocaleString()}</td>
            <td>${stats.total_guest_travel.toLocaleString()}</td>
            <td class="${travelDiffClass}">
                ${stats.travel_difference > 0 ? '+' : ''}${stats.travel_difference.toLocaleString()}
            </td>
            <td>${stats.shortest_trip.distance} km vs ${stats.shortest_trip.opponent}</td>
            <td>${stats.longest_trip.distance} km vs ${stats.longest_trip.opponent}</td>
        `;
        
        tbody.appendChild(row);
    });
}

function initializeTableSorting() {
    const sortableHeaders = document.querySelectorAll('.sortable');
    
    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-column');
            sortTable(column);
        });
    });
}

function sortTable(column) {
    const direction = currentSort.column === column && currentSort.direction === 'asc' ? 'desc' : 'asc';
    
    // Update sort state
    currentSort = { column, direction };
    
    // Update header indicators
    document.querySelectorAll('.sortable').forEach(header => {
        header.classList.remove('active', 'asc', 'desc');
    });
    
    const activeHeader = document.querySelector(`[data-column="${column}"]`);
    if (activeHeader) {
        activeHeader.classList.add('active', direction);
    }
    
    // Sort data
    tableData.sort((a, b) => {
        let aVal, bVal;

        switch(column) {
            case 'team':
            case 'city':
            case 'country':
                aVal = a[column].toLowerCase();
                bVal = b[column].toLowerCase();
                break;
            case 'pot':
                aVal = a[column];
                bVal = b[column];
                break;
            case 'total_travel':
            case 'total_guest_travel':
            case 'travel_difference':
                const aStats = getTeamTravelStats(a.team);
                const bStats = getTeamTravelStats(b.team);
                aVal = aStats[column];
                bVal = bStats[column];
                break;
            case 'shortest_trip':
                const aStatsShort = getTeamTravelStats(a.team);
                const bStatsShort = getTeamTravelStats(b.team);
                aVal = aStatsShort.shortest_trip.distance;
                bVal = bStatsShort.shortest_trip.distance;
                break;
            case 'longest_trip':
                const aStatsLong = getTeamTravelStats(a.team);
                const bStatsLong = getTeamTravelStats(b.team);
                aVal = aStatsLong.longest_trip.distance;
                bVal = bStatsLong.longest_trip.distance;
                break;
            default:
                return 0;
        }
        
        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
    });
    
    // Reload table with sorted data
    loadTable();
}

function initializeCSVExport() {
    const exportBtn = document.getElementById('exportCSV');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToCSV);
    }
}

function exportToCSV() {
    const headers = [
        'No.', 'Team', 'City', 'Country', 'Pot', 'Total Travel (km)', 'Guest Travel (km)',
        'Travel Difference', 'Shortest Trip Distance', 'Shortest Trip Opponent',
        'Longest Trip Distance', 'Longest Trip Opponent'
    ];

    const csvContent = [
        headers.join(','),
        ...tableData.map((stadium, index) => {
            const stats = getTeamTravelStats(stadium.team);
            return [
                index + 1,
                `"${stadium.team}"`,
                `"${stadium.city}"`,
                `"${stadium.country}"`,
                stadium.pot,
                stats.total_travel,
                stats.total_guest_travel,
                stats.travel_difference,
                stats.shortest_trip.distance,
                `"${stats.shortest_trip.opponent}"`,
                stats.longest_trip.distance,
                `"${stats.longest_trip.opponent}"`
            ];
        }).map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'champions_league_travel_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Matches table functionality (Tab 4)
let matchesTableInitialized = false;
let matchesTableData = [];

function initializeMatchesTable() {
    if (matchesTableInitialized) return;

    loadMatchesTable();
    initializeMatchesTableSorting();
    initializeMatchesCSVExport();
    matchesTableInitialized = true;
}

function loadMatchesTable() {
    matchesTableData = [];

    // Generate all matches from matchData
    matchData.forEach(teamData => {
        const homeTeam = teamData.home_team;
        const homeStadium = getStadiumByTeam(homeTeam);

        if (!homeStadium) return;

        // Add away matches (this team is hosting)
        teamData.away_matches.forEach(match => {
            const awayTeam = match.team;
            const awayStadium = getStadiumByTeam(awayTeam);

            if (awayStadium) {
                matchesTableData.push({
                    home_team: homeTeam,
                    home_country: homeStadium.country,
                    home_pot: homeStadium.pot,
                    away_team: awayTeam,
                    away_country: awayStadium.country,
                    away_pot: awayStadium.pot,
                    distance: match.distance
                });
            }
        });
    });

    renderMatchesTable();
}

function renderMatchesTable() {
    const tbody = document.getElementById('matchesTableBody');
    if (!tbody) return;

    tbody.innerHTML = matchesTableData.map((match, index) => `
        <tr>
            <td class="no-cell">${index + 1}</td>
            <td>
                <span class="pot-indicator" style="background-color: ${getPotColor(match.home_pot)};"></span>
                ${match.home_team}
            </td>
            <td>${match.home_country}</td>
            <td>
                <span class="pot-indicator" style="background-color: ${getPotColor(match.away_pot)};"></span>
                ${match.away_team}
            </td>
            <td>${match.away_country}</td>
            <td class="distance-cell">${match.distance.toLocaleString()} km</td>
        </tr>
    `).join('');
}

function initializeMatchesTableSorting() {
    const headers = document.querySelectorAll('#matchesTable .sortable');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.column;
            sortMatchesTable(column);
        });
    });
}

function sortMatchesTable(column) {
    const currentSort = document.querySelector('#matchesTable .sortable.sorted');
    const isAscending = currentSort && currentSort.dataset.column === column &&
                       currentSort.classList.contains('asc');

    // Clear previous sort indicators
    document.querySelectorAll('#matchesTable .sortable').forEach(header => {
        header.classList.remove('sorted', 'asc', 'desc');
    });

    // Sort data
    matchesTableData.sort((a, b) => {
        let valueA = a[column];
        let valueB = b[column];

        // Handle different data types
        if (typeof valueA === 'string') {
            valueA = valueA.toLowerCase();
            valueB = valueB.toLowerCase();
        }

        let comparison = 0;
        if (valueA < valueB) comparison = -1;
        else if (valueA > valueB) comparison = 1;

        return isAscending ? -comparison : comparison;
    });

    // Update sort indicator
    const header = document.querySelector(`#matchesTable .sortable[data-column="${column}"]`);
    header.classList.add('sorted', isAscending ? 'desc' : 'asc');

    renderMatchesTable();
}

function initializeMatchesCSVExport() {
    const exportBtn = document.getElementById('exportMatchesCSV');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportMatchesToCSV);
    }
}

function exportMatchesToCSV() {
    const headers = ['No.', 'Home Team', 'Home Country', 'Away Team', 'Away Country', 'Distance (km)'];

    const csvContent = [
        headers.join(','),
        ...matchesTableData.map((match, index) => [
            index + 1,
            `"${match.home_team}"`,
            `"${match.home_country}"`,
            `"${match.away_team}"`,
            `"${match.away_country}"`,
            match.distance
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'champions_league_matches.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = button.getAttribute('data-tab');
            
            console.log('Tab clicked:', targetTab); // Debug log
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('tab-btn--active'));
            button.classList.add('tab-btn--active');
            
            // Update active tab panel
            tabPanels.forEach(panel => panel.classList.remove('tab-panel--active'));
            const targetPanel = document.getElementById(`${targetTab}-tab`);
            if (targetPanel) {
                targetPanel.classList.add('tab-panel--active');
                console.log('Activated panel:', targetPanel.id); // Debug log
            }
            
            // Initialize content based on tab
            setTimeout(() => {
                if (targetTab === 'table') {
                    initializeTable();
                } else if (targetTab === 'fixtures') {
                    initializeMatchesTable();
                } else if ((targetTab === 'matches' || targetTab === 'interactive') && !mapsInitialized) {
                    initializeMaps();
                }
                
                // Trigger map resize
                if (targetTab === 'matches' && matchesMap) {
                    matchesMap.invalidateSize();
                } else if (targetTab === 'interactive' && interactiveMap) {
                    interactiveMap.invalidateSize();
                }
            }, 50);
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('teamSearch');
    const clearButton = document.getElementById('clearSearch');

    if (searchInput) {
        // Remove any existing event listeners and add new ones
        searchInput.value = '';
        searchInput.removeAttribute('readonly');
        searchInput.removeAttribute('disabled');
        
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            console.log('Search term:', searchTerm); // Debug log
            if (searchTerm.length > 0) {
                searchTeam(searchTerm);
            } else {
                clearSearch();
            }
        });
    }

    if (clearButton) {
        clearButton.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }
            clearSearch();
        });
    }
}

function searchTeam(searchTerm) {
    // Guard clause: ensure data is loaded
    if (!stadiumData || stadiumData.length === 0) {
        console.log('Stadium data not yet loaded');
        return;
    }

    const matchedTeams = stadiumData.filter(stadium =>
        stadium.team.toLowerCase().includes(searchTerm) ||
        stadium.city.toLowerCase().includes(searchTerm) ||
        stadium.country.toLowerCase().includes(searchTerm)
    );

    if (matchedTeams.length > 0) {
        const team = matchedTeams[0];
        const activeTab = document.querySelector('.tab-panel--active');
        
        console.log('Active tab:', activeTab ? activeTab.id : 'none'); // Debug log
        
        if (activeTab && activeTab.id === 'matches-tab' && matchesMap) {
            matchesMap.setView([team.latitude, team.longitude], 8);
            const marker = matchesMarkers.get(team.team);
            if (marker) {
                setTimeout(() => marker.openPopup(), 300);
            }
        } else if (activeTab && activeTab.id === 'interactive-tab' && interactiveMap) {
            interactiveMap.setView([team.latitude, team.longitude], 8);
            const marker = interactiveMarkers.get(team.team);
            if (marker) {
                setTimeout(() => marker.openPopup(), 300);
            }
        } else if (activeTab && activeTab.id === 'table-tab') {
            // Filter table data for search
            tableData = stadiumData.filter(stadium =>
                stadium.team.toLowerCase().includes(searchTerm) ||
                stadium.city.toLowerCase().includes(searchTerm) ||
                stadium.country.toLowerCase().includes(searchTerm)
            );
            loadTable();
        } else if (activeTab && activeTab.id === 'fixtures-tab') {
            // Filter matches data for search
            const originalData = [];
            matchData.forEach(teamData => {
                const homeTeam = teamData.home_team;
                const homeStadium = getStadiumByTeam(homeTeam);
                if (!homeStadium) return;

                teamData.away_matches.forEach(match => {
                    const awayTeam = match.team;
                    const awayStadium = getStadiumByTeam(awayTeam);
                    if (awayStadium) {
                        originalData.push({
                            home_team: homeTeam,
                            home_country: homeStadium.country,
                            home_pot: homeStadium.pot,
                            away_team: awayTeam,
                            away_country: awayStadium.country,
                            away_pot: awayStadium.pot,
                            distance: match.distance
                        });
                    }
                });
            });

            matchesTableData = originalData.filter(match =>
                match.home_team.toLowerCase().includes(searchTerm) ||
                match.away_team.toLowerCase().includes(searchTerm) ||
                match.home_country.toLowerCase().includes(searchTerm) ||
                match.away_country.toLowerCase().includes(searchTerm)
            );
            renderMatchesTable();
        }
    }
}

function clearSearch() {
    const activeTab = document.querySelector('.tab-panel--active');

    if (activeTab && activeTab.id === 'matches-tab' && matchesMap) {
        matchesMap.setView([50.0, 10.0], 4);
    } else if (activeTab && activeTab.id === 'interactive-tab' && interactiveMap) {
        interactiveMap.setView([50.0, 10.0], 4);
    } else if (activeTab && activeTab.id === 'table-tab') {
        // Guard clause: ensure data is loaded
        if (!stadiumData || stadiumData.length === 0) {
            console.log('Stadium data not yet loaded');
            return;
        }
        // Reset table data
        tableData = [...stadiumData];
        loadTable();
    } else if (activeTab && activeTab.id === 'fixtures-tab') {
        // Reset matches table data
        if (matchData && matchData.length > 0) {
            loadMatchesTable(); // This will regenerate the full matches data
        }
    }
}

// Loading indicator
function showLoading() {
    const loader = document.getElementById('loadingIndicator');
    if (loader) {
        loader.classList.add('show');
    }
}

function hideLoading() {
    const loader = document.getElementById('loadingIndicator');
    if (loader) {
        loader.classList.remove('show');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded, initializing application...');

    // Force light theme
    document.documentElement.setAttribute('data-color-scheme', 'light');
    document.body.setAttribute('data-color-scheme', 'light');

    // Load data first
    const dataLoaded = await loadData();
    if (!dataLoaded) {
        console.error('Failed to load application data');
        return;
    }

    // Initialize tabs first
    initializeTabs();

    // Initialize search
    initializeSearch();

    // Initialize content based on default active tab
    const activeTab = document.querySelector('.tab-panel--active');
    console.log('Initial active tab:', activeTab ? activeTab.id : 'none');
    
    if (activeTab && activeTab.id === 'matches-tab') {
        initializeMaps();
    } else if (activeTab && activeTab.id === 'table-tab') {
        initializeTable();
    }
});