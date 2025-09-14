#!/usr/bin/env python3
"""
Script to fix the reversed match data in matches.json based on Wikipedia fixture data.
"""

import json
import math

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate the great circle distance between two points on earth."""
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))

    # Earth's radius in kilometers
    r = 6371
    return r * c

# Wikipedia Matchday 1 fixtures (Home vs Away)
wikipedia_fixtures = [
    ("Athletic Bilbao", "Arsenal"),
    ("PSV Eindhoven", "Union Saint-Gilloise"),
    ("Juventus", "Borussia Dortmund"),
    ("Real Madrid", "Marseille"),
    ("Benfica", "Qarabağ"),
    ("Tottenham Hotspur", "Villarreal"),
    ("Olympiacos", "Pafos"),
    ("Slavia Prague", "Bodø/Glimt"),
    ("Ajax", "Inter Milan"),
    ("Bayern Munich", "Chelsea"),
    ("Liverpool", "Atlético Madrid"),
    ("Paris Saint-Germain", "Atalanta"),
    ("Club Brugge", "Monaco"),
    ("Copenhagen", "Bayer Leverkusen"),
    ("Eintracht Frankfurt", "Galatasaray"),
    ("Manchester City", "Napoli"),
    ("Newcastle United", "Barcelona"),
    ("Sporting CP", "Kairat")
]

def load_stadium_data():
    """Load stadium coordinates."""
    with open('data/stadiums.json', 'r') as f:
        stadiums = json.load(f)

    stadium_dict = {}
    for stadium in stadiums:
        stadium_dict[stadium['team']] = {
            'latitude': stadium['latitude'],
            'longitude': stadium['longitude']
        }
    return stadium_dict

def calculate_distance(team1, team2, stadium_dict):
    """Calculate distance between two teams' stadiums."""
    lat1, lon1 = stadium_dict[team1]['latitude'], stadium_dict[team1]['longitude']
    lat2, lon2 = stadium_dict[team2]['latitude'], stadium_dict[team2]['longitude']
    return round(haversine_distance(lat1, lon1, lat2, lon2))

def generate_all_fixtures():
    """
    Generate all possible fixtures for each team (8 matches total per team).
    This is based on the UEFA Champions League format where each team plays 8 matches.
    """

    # Load current matches to understand the fixture pattern
    with open('data/matches.json', 'r') as f:
        current_matches = json.load(f)

    # Extract all unique fixture pairs from current data
    all_fixtures = set()

    for team_data in current_matches:
        home_team = team_data['home_team']

        # Add away fixtures (this team travels)
        for match in team_data['away_matches']:
            away_team = match['team']
            # Create a fixture pair (host, visitor)
            all_fixtures.add((away_team, home_team))

        # Add home fixtures (this team hosts)
        for match in team_data['home_matches']:
            visitor = match['team']
            all_fixtures.add((home_team, visitor))

    return list(all_fixtures)

def create_corrected_matches():
    """Create corrected matches.json with proper host/away assignments."""

    stadium_dict = load_stadium_data()
    all_fixtures = generate_all_fixtures()

    print(f"Found {len(all_fixtures)} total fixtures")

    # Group fixtures by team
    teams = set()
    for home, away in all_fixtures:
        teams.add(home)
        teams.add(away)

    corrected_data = []

    for team in sorted(teams):
        team_data = {
            "home_team": team,
            "away_matches": [],  # Teams this team visits
            "home_matches": []   # Teams that visit this team
        }

        for home, away in all_fixtures:
            if home == team:
                # This team is hosting
                distance = calculate_distance(away, home, stadium_dict)
                team_data["home_matches"].append({
                    "team": away,
                    "distance": distance
                })
            elif away == team:
                # This team is visiting
                distance = calculate_distance(team, home, stadium_dict)
                team_data["away_matches"].append({
                    "team": home,
                    "distance": distance
                })

        # Sort by team name for consistency
        team_data["away_matches"].sort(key=lambda x: x["team"])
        team_data["home_matches"].sort(key=lambda x: x["team"])

        corrected_data.append(team_data)

    return corrected_data

def verify_fixtures(corrected_data):
    """Verify that key Wikipedia fixtures are correctly assigned."""

    print("\nVerifying key Wikipedia fixtures:")

    for home_team, away_team in wikipedia_fixtures:
        # Find home team's entry
        home_entry = None
        for team_data in corrected_data:
            if team_data['home_team'] == home_team:
                home_entry = team_data
                break

        if home_entry:
            # Check if away_team is in home_matches (meaning home_team hosts away_team)
            visitors = [match['team'] for match in home_entry['home_matches']]
            if away_team in visitors:
                print(f"✅ {home_team} hosts {away_team}")
            else:
                print(f"❌ {home_team} should host {away_team} but doesn't")
        else:
            print(f"❌ {home_team} not found in data")

def main():
    print("Fixing matches.json with correct host/away assignments...")

    corrected_data = create_corrected_matches()

    # Save corrected data
    with open('data/matches_corrected.json', 'w') as f:
        json.dump(corrected_data, f, indent=2)

    print(f"Created corrected data with {len(corrected_data)} teams")

    # Verify key fixtures
    verify_fixtures(corrected_data)

    print("\nCorrected matches saved to data/matches_corrected.json")
    print("Review the verification results above, then replace matches.json if correct.")

if __name__ == "__main__":
    main()