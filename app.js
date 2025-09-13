// Stadium and match data from corrected JSON
const stadiumData = [
  {"team": "Kairat", "stadium": "Almaty Ortalyk Stadion", "city": "Almaty", "country": "Kazakhstan", "latitude": 43.2381, "longitude": 76.8512, "pot": 4, "total_travel": 22383, "total_guest_travel": 20166, "travel_difference": 2217, "shortest_trip": {"distance": 4661, "opponent": "Copenhagen"}, "longest_trip": {"distance": 6902, "opponent": "Sporting CP"}},
  {"team": "Qarabağ", "stadium": "Baku Olympic Stadium", "city": "Baku", "country": "Azerbaijan", "latitude": 40.4297, "longitude": 49.9186, "pot": 4, "total_travel": 16439, "total_guest_travel": 14154, "travel_difference": 2285, "shortest_trip": {"distance": 2994, "opponent": "Napoli"}, "longest_trip": {"distance": 4971, "opponent": "Benfica"}},
  {"team": "Olympiacos", "stadium": "Stadio Georgios Karaiskakis", "city": "Piraeus", "country": "Greece", "latitude": 37.9474, "longitude": 23.6644, "pot": 3, "total_travel": 10878, "total_guest_travel": 7251, "travel_difference": 3627, "shortest_trip": {"distance": 1875, "opponent": "Barcelona"}, "longest_trip": {"distance": 4453, "opponent": "Kairat"}},
  {"team": "Real Madrid", "stadium": "Santiago Bernabéu", "city": "Madrid", "country": "Spain", "latitude": 40.453053, "longitude": -3.688344, "pot": 1, "total_travel": 10722, "total_guest_travel": 5399, "travel_difference": 5323, "shortest_trip": {"distance": 507, "opponent": "Benfica"}, "longest_trip": {"distance": 6407, "opponent": "Kairat"}},
  {"team": "Pafos", "stadium": "Limassol Stadium", "city": "Paphos", "country": "Cyprus", "latitude": 34.6844, "longitude": 32.4131, "pot": 4, "total_travel": 10367, "total_guest_travel": 9810, "travel_difference": 557, "shortest_trip": {"distance": 863, "opponent": "Olympiacos"}, "longest_trip": {"distance": 4453, "opponent": "Kairat"}},
  {"team": "Bodø/Glimt", "stadium": "Aspmyra Stadion", "city": "Bodø", "country": "Norway", "latitude": 67.2903, "longitude": 14.4051, "pot": 3, "total_travel": 9940, "total_guest_travel": 8839, "travel_difference": 1101, "shortest_trip": {"distance": 1798, "opponent": "Borussia Dortmund"}, "longest_trip": {"distance": 3519, "opponent": "Galatasaray"}},
  {"team": "Club Brugge", "stadium": "Jan Breydel Stadium", "city": "Bruges", "country": "Belgium", "latitude": 51.1969, "longitude": 3.1816, "pot": 2, "total_travel": 8547, "total_guest_travel": 3114, "travel_difference": 5433, "shortest_trip": {"distance": 691, "opponent": "Bayern Munich"}, "longest_trip": {"distance": 5396, "opponent": "Kairat"}},
  {"team": "Galatasaray", "stadium": "Ali Sami Yen Spor Kompleksi", "city": "Istanbul", "country": "Turkey", "latitude": 41.1039, "longitude": 28.9922, "pot": 4, "total_travel": 8546, "total_guest_travel": 10689, "travel_difference": -2143, "shortest_trip": {"distance": 1790, "opponent": "Monaco"}, "longest_trip": {"distance": 3519, "opponent": "Bodø/Glimt"}},
  {"team": "Copenhagen", "stadium": "Parken Stadium", "city": "Copenhagen", "country": "Denmark", "latitude": 55.702724, "longitude": 12.571566, "pot": 4, "total_travel": 7893, "total_guest_travel": 6477, "travel_difference": 1416, "shortest_trip": {"distance": 947, "opponent": "Tottenham Hotspur"}, "longest_trip": {"distance": 4453, "opponent": "Qarabağ"}},
  {"team": "Chelsea", "stadium": "Stamford Bridge", "city": "London", "country": "England", "latitude": 51.4816, "longitude": -0.1911, "pot": 1, "total_travel": 7481, "total_guest_travel": 6279, "travel_difference": 1202, "shortest_trip": {"distance": 920, "opponent": "Bayern Munich"}, "longest_trip": {"distance": 3519, "opponent": "Qarabağ"}},
  {"team": "Sporting CP", "stadium": "Estádio José Alvalade", "city": "Lisbon", "country": "Portugal", "latitude": 38.7613, "longitude": -9.1608, "pot": 3, "total_travel": 7430, "total_guest_travel": 11349, "travel_difference": -3919, "shortest_trip": {"distance": 691, "opponent": "Bayern Munich"}, "longest_trip": {"distance": 2994, "opponent": "Napoli"}},
  {"team": "Monaco", "stadium": "Stade Louis II", "city": "Monaco", "country": "Monaco", "latitude": 43.7278, "longitude": 7.4147, "pot": 4, "total_travel": 7186, "total_guest_travel": 6489, "travel_difference": 697, "shortest_trip": {"distance": 232, "opponent": "Club Brugge"}, "longest_trip": {"distance": 3180, "opponent": "Pafos"}},
  {"team": "Athletic Bilbao", "stadium": "San Mamés", "city": "Bilbao", "country": "Spain", "latitude": 43.264183, "longitude": -2.949421, "pot": 4, "total_travel": 6818, "total_guest_travel": 5099, "travel_difference": 1719, "shortest_trip": {"distance": 491, "opponent": "Atalanta"}, "longest_trip": {"distance": 4317, "opponent": "Qarabağ"}},
  {"team": "Ajax", "stadium": "Johan Cruijff ArenA", "city": "Amsterdam", "country": "Netherlands", "latitude": 52.3144, "longitude": 4.9419, "pot": 3, "total_travel": 6881, "total_guest_travel": 7062, "travel_difference": -181, "shortest_trip": {"distance": 364, "opponent": "Chelsea"}, "longest_trip": {"distance": 3270, "opponent": "Qarabağ"}},
  {"team": "Slavia Prague", "stadium": "Eden Arena", "city": "Prague", "country": "Czech Republic", "latitude": 50.0669, "longitude": 14.472, "pot": 3, "total_travel": 6534, "total_guest_travel": 7062, "travel_difference": -528, "shortest_trip": {"distance": 491, "opponent": "Atalanta"}, "longest_trip": {"distance": 3180, "opponent": "Pafos"}},
  {"team": "Liverpool", "stadium": "Anfield", "city": "Liverpool", "country": "England", "latitude": 53.430759, "longitude": -2.961425, "pot": 1, "total_travel": 6380, "total_guest_travel": 6893, "travel_difference": -513, "shortest_trip": {"distance": 873, "opponent": "Inter Milan"}, "longest_trip": {"distance": 2473, "opponent": "Galatasaray"}},
  {"team": "Juventus", "stadium": "Allianz Stadium", "city": "Turin", "country": "Italy", "latitude": 45.1097, "longitude": 7.6411, "pot": 2, "total_travel": 6262, "total_guest_travel": 6841, "travel_difference": -579, "shortest_trip": {"distance": 155, "opponent": "Monaco"}, "longest_trip": {"distance": 2331, "opponent": "Bodø/Glimt"}},
  {"team": "Eintracht Frankfurt", "stadium": "Deutsche Bank Park", "city": "Frankfurt", "country": "Germany", "latitude": 50.068572, "longitude": 8.645458, "pot": 2, "total_travel": 6265, "total_guest_travel": 3868, "travel_difference": 2397, "shortest_trip": {"distance": 831, "opponent": "Barcelona"}, "longest_trip": {"distance": 3270, "opponent": "Qarabağ"}},
  {"team": "Manchester City", "stadium": "Etihad Stadium", "city": "Manchester", "country": "England", "latitude": 53.4831, "longitude": -2.2004, "pot": 1, "total_travel": 6032, "total_guest_travel": 6001, "travel_difference": 31, "shortest_trip": {"distance": 1292, "opponent": "Monaco"}, "longest_trip": {"distance": 1773, "opponent": "Bodø/Glimt"}},
  {"team": "Napoli", "stadium": "Stadio Diego Armando Maradona", "city": "Naples", "country": "Italy", "latitude": 40.8279, "longitude": 14.1931, "pot": 3, "total_travel": 6079, "total_guest_travel": 7727, "travel_difference": -1648, "shortest_trip": {"distance": 516, "opponent": "Benfica"}, "longest_trip": {"distance": 2977, "opponent": "Copenhagen"}},
  {"team": "Barcelona", "stadium": "Estadi Olímpic Lluís Companys", "city": "Barcelona", "country": "Spain", "latitude": 41.364746, "longitude": 2.155569, "pot": 1, "total_travel": 5945, "total_guest_travel": 5511, "travel_difference": 434, "shortest_trip": {"distance": 232, "opponent": "Club Brugge"}, "longest_trip": {"distance": 2974, "opponent": "Newcastle United"}},
  {"team": "Bayer Leverkusen", "stadium": "BayArena", "city": "Leverkusen", "country": "Germany", "latitude": 51.038256, "longitude": 7.002206, "pot": 2, "total_travel": 5859, "total_guest_travel": 2608, "travel_difference": 3251, "shortest_trip": {"distance": 516, "opponent": "Benfica"}, "longest_trip": {"distance": 2977, "opponent": "Copenhagen"}},
  {"team": "Bayern Munich", "stadium": "Allianz Arena", "city": "Munich", "country": "Germany", "latitude": 48.218775, "longitude": 11.624753, "pot": 1, "total_travel": 5782, "total_guest_travel": 4180, "travel_difference": 1602, "shortest_trip": {"distance": 418, "opponent": "Paris Saint-Germain"}, "longest_trip": {"distance": 3764, "opponent": "Pafos"}},
  {"team": "Benfica", "stadium": "Estádio da Luz", "city": "Lisbon", "country": "Portugal", "latitude": 38.7526, "longitude": -9.1847, "pot": 2, "total_travel": 5780, "total_guest_travel": 9343, "travel_difference": -3563, "shortest_trip": {"distance": 246, "opponent": "Ajax"}, "longest_trip": {"distance": 2974, "opponent": "Newcastle United"}},
  {"team": "Atlético Madrid", "stadium": "Cívitas Metropolitano", "city": "Madrid", "country": "Spain", "latitude": 40.4362, "longitude": -3.5995, "pot": 2, "total_travel": 5596, "total_guest_travel": 6477, "travel_difference": -881, "shortest_trip": {"distance": 360, "opponent": "PSV Eindhoven"}, "longest_trip": {"distance": 2473, "opponent": "Galatasaray"}},
  {"team": "Villarreal", "stadium": "Estadio de la Cerámica", "city": "Villarreal", "country": "Spain", "latitude": 39.944167, "longitude": -0.103611, "pot": 2, "total_travel": 5512, "total_guest_travel": 5588, "travel_difference": -76, "shortest_trip": {"distance": 116, "opponent": "Bayer Leverkusen"}, "longest_trip": {"distance": 3180, "opponent": "Pafos"}},
  {"team": "Union Saint-Gilloise", "stadium": "Stade Joseph Marien", "city": "Brussels", "country": "Belgium", "latitude": 50.8205, "longitude": 4.352, "pot": 4, "total_travel": 4186, "total_guest_travel": 2837, "travel_difference": 1349, "shortest_trip": {"distance": 104, "opponent": "PSV Eindhoven"}, "longest_trip": {"distance": 2473, "opponent": "Galatasaray"}},
  {"team": "Tottenham Hotspur", "stadium": "Tottenham Hotspur Stadium", "city": "London", "country": "England", "latitude": 51.604252, "longitude": -0.067007, "pot": 3, "total_travel": 3937, "total_guest_travel": 3797, "travel_difference": 140, "shortest_trip": {"distance": 349, "opponent": "Paris Saint-Germain"}, "longest_trip": {"distance": 2892, "opponent": "Bodø/Glimt"}},
  {"team": "Marseille", "stadium": "Stade Vélodrome", "city": "Marseille", "country": "France", "latitude": 43.2697, "longitude": 5.3958, "pot": 3, "total_travel": 3873, "total_guest_travel": 4123, "travel_difference": -250, "shortest_trip": {"distance": 232, "opponent": "Club Brugge"}, "longest_trip": {"distance": 1609, "opponent": "Union Saint-Gilloise"}},
  {"team": "Newcastle United", "stadium": "St. James' Park", "city": "Newcastle", "country": "England", "latitude": 54.9756, "longitude": -1.6219, "pot": 4, "total_travel": 3463, "total_guest_travel": 6893, "travel_difference": -3430, "shortest_trip": {"distance": 104, "opponent": "Union Saint-Gilloise"}, "longest_trip": {"distance": 1636, "opponent": "Marseille"}},
  {"team": "Paris Saint-Germain", "stadium": "Parc des Princes", "city": "Paris", "country": "France", "latitude": 48.8414, "longitude": 2.253, "pot": 1, "total_travel": 3432, "total_guest_travel": 2433, "travel_difference": 999, "shortest_trip": {"distance": 418, "opponent": "Bayer Leverkusen"}, "longest_trip": {"distance": 1444, "opponent": "Sporting CP"}},
  {"team": "PSV Eindhoven", "stadium": "Philips Stadion", "city": "Eindhoven", "country": "Netherlands", "latitude": 51.4416, "longitude": 5.4697, "pot": 3, "total_travel": 3409, "total_guest_travel": 3436, "travel_difference": -27, "shortest_trip": {"distance": 116, "opponent": "Bayer Leverkusen"}, "longest_trip": {"distance": 1636, "opponent": "Newcastle United"}},
  {"team": "Inter Milan", "stadium": "San Siro", "city": "Milan", "country": "Italy", "latitude": 45.4781, "longitude": 9.124, "pot": 1, "total_travel": 3366, "total_guest_travel": 8071, "travel_difference": -4705, "shortest_trip": {"distance": 246, "opponent": "Ajax"}, "longest_trip": {"distance": 1636, "opponent": "Union Saint-Gilloise"}},
  {"team": "Arsenal", "stadium": "Emirates Stadium", "city": "London", "country": "England", "latitude": 51.5549, "longitude": -0.1084, "pot": 2, "total_travel": 3171, "total_guest_travel": 10168, "travel_difference": -6997, "shortest_trip": {"distance": 232, "opponent": "Club Brugge"}, "longest_trip": {"distance": 1806, "opponent": "Athletic Bilbao"}},
  {"team": "Borussia Dortmund", "stadium": "Signal Iduna Park", "city": "Dortmund", "country": "Germany", "latitude": 51.492569, "longitude": 7.451842, "pot": 1, "total_travel": 2496, "total_guest_travel": 5638, "travel_difference": -3142, "shortest_trip": {"distance": 520, "opponent": "Tottenham Hotspur"}, "longest_trip": {"distance": 710, "opponent": "Juventus"}},
  {"team": "Atalanta", "stadium": "Gewiss Stadium", "city": "Bergamo", "country": "Italy", "latitude": 45.7089, "longitude": 9.6804, "pot": 2, "total_travel": 2276, "total_guest_travel": 3382, "travel_difference": -1106, "shortest_trip": {"distance": 435, "opponent": "Marseille"}, "longest_trip": {"distance": 1636, "opponent": "Union Saint-Gilloise"}}
];

const matchData = [
  {"home_team": "Paris Saint-Germain", "away_teams": ["Barcelona", "Bayer Leverkusen", "Sporting CP", "Athletic Bilbao"], "home_hosts": ["Bayern Munich", "Atalanta", "Tottenham Hotspur", "Newcastle United"]},
  {"home_team": "Real Madrid", "away_teams": ["Liverpool", "Benfica", "Olympiacos", "Kairat"], "home_hosts": ["Manchester City", "Juventus", "Marseille", "Monaco"]},
  {"home_team": "Manchester City", "away_teams": ["Real Madrid", "Villarreal", "Bodø/Glimt", "Monaco"], "home_hosts": ["Borussia Dortmund", "Bayer Leverkusen", "Napoli", "Galatasaray"]},
  {"home_team": "Bayern Munich", "away_teams": ["Paris Saint-Germain", "Arsenal", "PSV Eindhoven", "Pafos"], "home_hosts": ["Chelsea", "Club Brugge", "Sporting CP", "Union Saint-Gilloise"]},
  {"home_team": "Liverpool", "away_teams": ["Inter Milan", "Eintracht Frankfurt", "Marseille", "Galatasaray"], "home_hosts": ["Real Madrid", "Atlético Madrid", "PSV Eindhoven", "Qarabağ"]},
  {"home_team": "Inter Milan", "away_teams": ["Borussia Dortmund", "Atlético Madrid", "Ajax", "Union Saint-Gilloise"], "home_hosts": ["Liverpool", "Arsenal", "Slavia Prague", "Kairat"]},
  {"home_team": "Chelsea", "away_teams": ["Bayern Munich", "Atalanta", "Napoli", "Qarabağ"], "home_hosts": ["Barcelona", "Benfica", "Ajax", "Pafos"]},
  {"home_team": "Borussia Dortmund", "away_teams": ["Manchester City", "Juventus", "Tottenham Hotspur", "Copenhagen"], "home_hosts": ["Inter Milan", "Villarreal", "Bodø/Glimt", "Athletic Bilbao"]},
  {"home_team": "Barcelona", "away_teams": ["Chelsea", "Club Brugge", "Slavia Prague", "Newcastle United"], "home_hosts": ["Paris Saint-Germain", "Eintracht Frankfurt", "Olympiacos", "Copenhagen"]},
  {"home_team": "Arsenal", "away_teams": ["Inter Milan", "Club Brugge", "Slavia Prague", "Athletic Bilbao"], "home_hosts": ["Bayern Munich", "Atlético Madrid", "Olympiacos", "Kairat"]},
  {"home_team": "Bayer Leverkusen", "away_teams": ["Manchester City", "Benfica", "Olympiacos", "Copenhagen"], "home_hosts": ["Paris Saint-Germain", "Villarreal", "PSV Eindhoven", "Newcastle United"]},
  {"home_team": "Atlético Madrid", "away_teams": ["Liverpool", "Arsenal", "PSV Eindhoven", "Galatasaray"], "home_hosts": ["Inter Milan", "Eintracht Frankfurt", "Bodø/Glimt", "Union Saint-Gilloise"]},
  {"home_team": "Benfica", "away_teams": ["Chelsea", "Juventus", "Ajax", "Newcastle United"], "home_hosts": ["Real Madrid", "Bayer Leverkusen", "Napoli", "Qarabağ"]},
  {"home_team": "Atalanta", "away_teams": ["Paris Saint-Germain", "Eintracht Frankfurt", "Marseille", "Union Saint-Gilloise"], "home_hosts": ["Chelsea", "Club Brugge", "Slavia Prague", "Athletic Bilbao"]},
  {"home_team": "Villarreal", "away_teams": ["Borussia Dortmund", "Bayer Leverkusen", "Tottenham Hotspur", "Pafos"], "home_hosts": ["Manchester City", "Juventus", "Ajax", "Copenhagen"]},
  {"home_team": "Juventus", "away_teams": ["Real Madrid", "Villarreal", "Bodø/Glimt", "Monaco"], "home_hosts": ["Borussia Dortmund", "Benfica", "Sporting CP", "Pafos"]},
  {"home_team": "Eintracht Frankfurt", "away_teams": ["Barcelona", "Atlético Madrid", "Napoli", "Qarabağ"], "home_hosts": ["Liverpool", "Atalanta", "Tottenham Hotspur", "Galatasaray"]},
  {"home_team": "Club Brugge", "away_teams": ["Bayern Munich", "Atalanta", "Sporting CP", "Kairat"], "home_hosts": ["Barcelona", "Arsenal", "Marseille", "Monaco"]},
  {"home_team": "Tottenham Hotspur", "away_teams": ["Paris Saint-Germain", "Eintracht Frankfurt", "Bodø/Glimt", "Monaco"], "home_hosts": ["Borussia Dortmund", "Villarreal", "Slavia Prague", "Copenhagen"]},
  {"home_team": "PSV Eindhoven", "away_teams": ["Liverpool", "Bayer Leverkusen", "Olympiacos", "Newcastle United"], "home_hosts": ["Bayern Munich", "Atlético Madrid", "Napoli", "Union Saint-Gilloise"]},
  {"home_team": "Ajax", "away_teams": ["Chelsea", "Villarreal", "Marseille", "Qarabağ"], "home_hosts": ["Inter Milan", "Benfica", "Olympiacos", "Galatasaray"]},
  {"home_team": "Napoli", "away_teams": ["Manchester City", "Benfica", "PSV Eindhoven", "Copenhagen"], "home_hosts": ["Chelsea", "Eintracht Frankfurt", "Sporting CP", "Qarabağ"]},
  {"home_team": "Sporting CP", "away_teams": ["Bayern Munich", "Juventus", "Napoli", "Athletic Bilbao"], "home_hosts": ["Paris Saint-Germain", "Club Brugge", "Marseille", "Kairat"]},
  {"home_team": "Olympiacos", "away_teams": ["Barcelona", "Arsenal", "Ajax", "Kairat"], "home_hosts": ["Real Madrid", "Bayer Leverkusen", "PSV Eindhoven", "Pafos"]},
  {"home_team": "Slavia Prague", "away_teams": ["Inter Milan", "Atalanta", "Tottenham Hotspur", "Pafos"], "home_hosts": ["Barcelona", "Arsenal", "Bodø/Glimt", "Athletic Bilbao"]},
  {"home_team": "Bodø/Glimt", "away_teams": ["Borussia Dortmund", "Atlético Madrid", "Slavia Prague", "Galatasaray"], "home_hosts": ["Manchester City", "Juventus", "Tottenham Hotspur", "Monaco"]},
  {"home_team": "Marseille", "away_teams": ["Real Madrid", "Club Brugge", "Sporting CP", "Union Saint-Gilloise"], "home_hosts": ["Liverpool", "Atalanta", "Ajax", "Newcastle United"]},
  {"home_team": "Copenhagen", "away_teams": ["Barcelona", "Villarreal", "Tottenham Hotspur", "Qarabağ"], "home_hosts": ["Borussia Dortmund", "Bayer Leverkusen", "Napoli", "Kairat"]},
  {"home_team": "Monaco", "away_teams": ["Real Madrid", "Club Brugge", "Bodø/Glimt", "Pafos"], "home_hosts": ["Manchester City", "Juventus", "Tottenham Hotspur", "Galatasaray"]},
  {"home_team": "Galatasaray", "away_teams": ["Manchester City", "Eintracht Frankfurt", "Ajax", "Monaco"], "home_hosts": ["Liverpool", "Atlético Madrid", "Bodø/Glimt", "Union Saint-Gilloise"]},
  {"home_team": "Union Saint-Gilloise", "away_teams": ["Bayern Munich", "Atlético Madrid", "PSV Eindhoven", "Galatasaray"], "home_hosts": ["Inter Milan", "Atalanta", "Marseille", "Newcastle United"]},
  {"home_team": "Qarabağ", "away_teams": ["Liverpool", "Benfica", "Napoli", "Athletic Bilbao"], "home_hosts": ["Chelsea", "Eintracht Frankfurt", "Ajax", "Copenhagen"]},
  {"home_team": "Athletic Bilbao", "away_teams": ["Borussia Dortmund", "Atalanta", "Slavia Prague", "Newcastle United"], "home_hosts": ["Paris Saint-Germain", "Arsenal", "Sporting CP", "Qarabağ"]},
  {"home_team": "Newcastle United", "away_teams": ["Paris Saint-Germain", "Bayer Leverkusen", "Marseille", "Union Saint-Gilloise"], "home_hosts": ["Barcelona", "Benfica", "PSV Eindhoven", "Athletic Bilbao"]},
  {"home_team": "Pafos", "away_teams": ["Chelsea", "Juventus", "Olympiacos", "Kairat"], "home_hosts": ["Bayern Munich", "Villarreal", "Slavia Prague", "Monaco"]},
  {"home_team": "Kairat", "away_teams": ["Inter Milan", "Arsenal", "Sporting CP", "Copenhagen"], "home_hosts": ["Real Madrid", "Club Brugge", "Olympiacos", "Pafos"]}
];

// Global variables
let matchesMap, interactiveMap;
let currentHoveredTeam = null;
let hoverLines = [];
let matchesMarkers = new Map();
let interactiveMarkers = new Map();
let allMatchLines = [];
let tableData = [...stadiumData];
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
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing application...');
    
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