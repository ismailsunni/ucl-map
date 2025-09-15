#!/usr/bin/env python3
"""
Script to add matchday information to the matches.json file based on Wikipedia fixture data.
"""

import json
import os

# Wikipedia fixtures data with matchdays
matchday_fixtures = {
    1: [
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
    ],
    2: [
        ("Atalanta", "Club Brugge"),
        ("Kairat", "Real Madrid"),
        ("Atlético Madrid", "Eintracht Frankfurt"),
        ("Chelsea", "Benfica"),
        ("Inter Milan", "Slavia Prague"),
        ("Bodø/Glimt", "Tottenham Hotspur"),
        ("Galatasaray", "Liverpool"),
        ("Marseille", "Ajax"),
        ("Pafos", "Bayern Munich"),
        ("Qarabağ", "Copenhagen"),
        ("Union Saint-Gilloise", "Newcastle United"),
        ("Arsenal", "Olympiacos"),
        ("Monaco", "Manchester City"),
        ("Bayer Leverkusen", "PSV Eindhoven"),
        ("Borussia Dortmund", "Athletic Bilbao"),
        ("Barcelona", "Paris Saint-Germain"),
        ("Napoli", "Sporting CP"),
        ("Villarreal", "Juventus")
    ]
}

def load_matches_data():
    """Load the current matches data."""
    with open('data/matches.json', 'r') as f:
        return json.load(f)

def create_fixture_to_matchday_mapping():
    """Create a mapping from (home, away) fixture tuples to matchday numbers."""
    fixture_map = {}

    for matchday, fixtures in matchday_fixtures.items():
        for home, away in fixtures:
            fixture_map[(home, away)] = matchday

    return fixture_map

def add_matchday_to_matches(matches_data, fixture_map):
    """Add matchday information to the matches data."""
    updated_matches = []

    for team_data in matches_data:
        home_team = team_data['home_team']

        # Process home matches (other teams visiting this team)
        updated_home_matches = []
        for match in team_data['home_matches']:
            visiting_team = match['team']
            # Look for this fixture in our matchday mapping
            matchday = fixture_map.get((home_team, visiting_team))

            updated_match = {
                "team": visiting_team,
                "distance": match['distance']
            }

            if matchday:
                updated_match["matchday"] = matchday

            updated_home_matches.append(updated_match)

        # Process away matches (this team visiting others)
        updated_away_matches = []
        for match in team_data['away_matches']:
            host_team = match['team']
            # Look for this fixture in our matchday mapping
            matchday = fixture_map.get((host_team, home_team))

            updated_match = {
                "team": host_team,
                "distance": match['distance']
            }

            if matchday:
                updated_match["matchday"] = matchday

            updated_away_matches.append(updated_match)

        updated_team_data = {
            "home_team": home_team,
            "home_matches": updated_home_matches,
            "away_matches": updated_away_matches
        }

        updated_matches.append(updated_team_data)

    return updated_matches

def main():
    print("Adding matchday information to matches.json...")

    # Load current matches data
    matches_data = load_matches_data()
    print(f"Loaded {len(matches_data)} teams")

    # Create fixture to matchday mapping
    fixture_map = create_fixture_to_matchday_mapping()
    print(f"Created mapping for {len(fixture_map)} fixtures across {len(matchday_fixtures)} matchdays")

    # Add matchday info to matches
    updated_matches = add_matchday_to_matches(matches_data, fixture_map)

    # Save updated data
    with open('data/matches_with_matchdays.json', 'w') as f:
        json.dump(updated_matches, f, indent=2)

    print("Matchday information added successfully!")
    print("Updated data saved to 'data/matches_with_matchdays.json'")

    # Show sample of added data
    print("\nSample of updated data:")
    sample_team = updated_matches[0]
    print(f"Team: {sample_team['home_team']}")
    if sample_team['home_matches']:
        match = sample_team['home_matches'][0]
        print(f"  Home match sample: {match}")
    if sample_team['away_matches']:
        match = sample_team['away_matches'][0]
        print(f"  Away match sample: {match}")

if __name__ == "__main__":
    main()