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

function getPotColor(pot) {
    const colors = {
        1: '#dc2626', // red
        2: '#2563eb', // blue
        3: '#16a34a', // green
        4: '#ea580c'  // orange
    };
    return colors[pot] || '#6b7280';
}

function getStadiumByTeam(teamName) {
    return stadiumData.find(stadium => stadium.team === teamName);
}

function createPopupContent(stadium) {
    return `
        <div class="popup-content">
            <h4>${stadium.team}</h4>
            <div class="stadium-info">
                <p><strong>Stadium:</strong> ${stadium.stadium}</p>
                <p><strong>City:</strong> ${stadium.city}, ${stadium.country}</p>
                <p><strong>Pot:</strong> ${stadium.pot}</p>
                <div class="travel-distance">
                    <strong>Total Travel:</strong> ${stadium.total_travel.toLocaleString()} km
                </div>
                <div class="travel-distance">
                    <strong>Shortest Trip:</strong> ${stadium.shortest_trip.distance} km to ${stadium.shortest_trip.opponent}
                </div>
                <div class="travel-distance">
                    <strong>Longest Trip:</strong> ${stadium.longest_trip.distance} km to ${stadium.longest_trip.opponent}
                </div>
            </div>
        </div>
    `;
}

function getMarkerSize(totalTravel) {
    // Scale marker size based on total travel (min: 8, max: 20)
    const minTravel = Math.min(...stadiumData.map(s => s.total_travel));
    const maxTravel = Math.max(...stadiumData.map(s => s.total_travel));
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

        // Draw lines to away teams (this team travels to others)
        match.away_teams.forEach(awayTeam => {
            const awayStadium = getStadiumByTeam(awayTeam);
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

// Interactive map (Tab 2)
function loadInteractiveMap() {
    if (!interactiveMap) return;
    
    // Clear existing markers
    interactiveMarkers.clear();
    
    stadiumData.forEach(stadium => {
        const markerSize = getMarkerSize(stadium.total_travel);
        
        const marker = L.circleMarker([stadium.latitude, stadium.longitude], {
            radius: markerSize,
            fillColor: getPotColor(stadium.pot),
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.7
        }).addTo(interactiveMap);

        marker.bindPopup(createPopupContent(stadium), {
            maxWidth: 300,
            className: 'custom-popup'
        });
        
        // Add hover events
        marker.on('mouseover', function() {
            showTravelLines(stadium.team);
        });

        marker.on('mouseout', function() {
            hideTravelLines();
        });

        interactiveMarkers.set(stadium.team, marker);
    });
}

function showTravelLines(teamName) {
    if (currentHoveredTeam === teamName || !interactiveMap) return;
    
    hideTravelLines();
    currentHoveredTeam = teamName;
    
    const teamData = matchData.find(match => match.home_team === teamName);
    const homeStadium = getStadiumByTeam(teamName);
    
    if (!teamData || !homeStadium) return;

    // Draw green lines for home matches (teams coming to this stadium)
    teamData.home_hosts.forEach(visitingTeam => {
        const visitingStadium = getStadiumByTeam(visitingTeam);
        if (visitingStadium) {
            const lineData = drawTravelLine(visitingStadium, homeStadium, '#16a34a', 'home');
            if (lineData) hoverLines.push(lineData);
        }
    });

    // Draw red lines for away matches (this team traveling)
    teamData.away_teams.forEach(hostTeam => {
        const hostStadium = getStadiumByTeam(hostTeam);
        if (hostStadium) {
            const lineData = drawTravelLine(homeStadium, hostStadium, '#dc2626', 'away');
            if (lineData) hoverLines.push(lineData);
        }
    });
}

function drawTravelLine(fromStadium, toStadium, color, type) {
    if (!interactiveMap || !fromStadium || !toStadium) return null;
    
    const from = [fromStadium.latitude, fromStadium.longitude];
    const to = [toStadium.latitude, toStadium.longitude];
    const distance = haversineDistance(from[0], from[1], to[0], to[1]);
    
    const line = L.polyline([from, to], {
        color: color,
        weight: 3,
        opacity: 0.8
    }).addTo(interactiveMap);

    // Add distance label
    const midLat = (from[0] + to[0]) / 2;
    const midLng = (from[1] + to[1]) / 2;
    
    const distanceLabel = L.divIcon({
        className: 'distance-label',
        html: `${distance} km`,
        iconSize: [60, 20],
        iconAnchor: [30, 10]
    });

    const labelMarker = L.marker([midLat, midLng], { icon: distanceLabel }).addTo(interactiveMap);
    
    return { line, label: labelMarker };
}

function hideTravelLines() {
    if (!interactiveMap) return;
    
    hoverLines.forEach(item => {
        if (item.line && interactiveMap.hasLayer(item.line)) {
            interactiveMap.removeLayer(item.line);
        }
        if (item.label && interactiveMap.hasLayer(item.label)) {
            interactiveMap.removeLayer(item.label);
        }
    });
    hoverLines = [];
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
    
    tableData.forEach(stadium => {
        const row = document.createElement('tr');
        
        const travelDiffClass = stadium.travel_difference > 0 ? 'travel-positive' : 
                              stadium.travel_difference < 0 ? 'travel-negative' : 'travel-neutral';
        
        row.innerHTML = `
            <td>
                <span class="pot-indicator pot-${stadium.pot}"></span>
                ${stadium.team}
            </td>
            <td>${stadium.city}</td>
            <td>${stadium.country}</td>
            <td>${stadium.pot}</td>
            <td>${stadium.total_travel.toLocaleString()}</td>
            <td>${stadium.total_guest_travel.toLocaleString()}</td>
            <td class="${travelDiffClass}">
                ${stadium.travel_difference > 0 ? '+' : ''}${stadium.travel_difference.toLocaleString()}
            </td>
            <td>${stadium.shortest_trip.distance} km vs ${stadium.shortest_trip.opponent}</td>
            <td>${stadium.longest_trip.distance} km vs ${stadium.longest_trip.opponent}</td>
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
            case 'total_travel':
            case 'total_guest_travel':
            case 'travel_difference':
                aVal = a[column];
                bVal = b[column];
                break;
            case 'shortest_trip':
                aVal = a.shortest_trip.distance;
                bVal = b.shortest_trip.distance;
                break;
            case 'longest_trip':
                aVal = a.longest_trip.distance;
                bVal = b.longest_trip.distance;
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
        'Team', 'City', 'Country', 'Pot', 'Total Travel (km)', 'Guest Travel (km)', 
        'Travel Difference', 'Shortest Trip Distance', 'Shortest Trip Opponent',
        'Longest Trip Distance', 'Longest Trip Opponent'
    ];
    
    const csvContent = [
        headers.join(','),
        ...tableData.map(stadium => [
            `"${stadium.team}"`,
            `"${stadium.city}"`,
            `"${stadium.country}"`,
            stadium.pot,
            stadium.total_travel,
            stadium.total_guest_travel,
            stadium.travel_difference,
            stadium.shortest_trip.distance,
            `"${stadium.shortest_trip.opponent}"`,
            stadium.longest_trip.distance,
            `"${stadium.longest_trip.opponent}"`
        ].join(','))
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