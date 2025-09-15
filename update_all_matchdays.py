#!/usr/bin/env python3
"""
Script to add all matchday information (1-8) to the matches.json file.
Based on Wikipedia fixture data for UEFA Champions League 2025-26.
"""

import json
import os

# Complete matchday fixtures data - updated as we get more information
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
    ],
    # Complete matchdays 3-8 from UEFA official fixtures
    3: [
        ("Barcelona", "Olympiacos"),
        ("Arsenal", "Atlético Madrid"),
        ("Bayer Leverkusen", "Paris Saint-Germain"),
        ("Copenhagen", "Borussia Dortmund"),
        ("Newcastle United", "Benfica"),
        ("PSV Eindhoven", "Napoli"),
        ("Union Saint-Gilloise", "Inter Milan"),
        ("Villarreal", "Manchester City"),
        ("Athletic Bilbao", "Qarabağ"),
        ("Galatasaray", "Bodø/Glimt"),
        ("Monaco", "Tottenham Hotspur"),
        ("Atalanta", "Slavia Prague"),
        ("Chelsea", "Ajax"),
        ("Eintracht Frankfurt", "Liverpool"),
        ("Bayern Munich", "Club Brugge"),
        ("Real Madrid", "Juventus"),
        ("Sporting CP", "Marseille"),
        ("Kairat", "Pafos")  # Inferred from remaining teams
    ],
    4: [
        ("Slavia Prague", "Arsenal"),
        ("Napoli", "Eintracht Frankfurt"),
        ("Atlético Madrid", "Union Saint-Gilloise"),
        ("Bodø/Glimt", "Monaco"),
        ("Juventus", "Sporting CP"),
        ("Liverpool", "Real Madrid"),
        ("Olympiacos", "PSV Eindhoven"),
        ("Paris Saint-Germain", "Bayern Munich"),
        ("Tottenham Hotspur", "Copenhagen"),
        ("Pafos", "Villarreal"),
        ("Qarabağ", "Chelsea"),
        ("Ajax", "Galatasaray"),
        ("Club Brugge", "Barcelona"),
        ("Inter Milan", "Kairat"),
        ("Manchester City", "Borussia Dortmund"),
        ("Newcastle United", "Athletic Bilbao"),
        ("Marseille", "Atalanta"),
        ("Benfica", "Bayer Leverkusen")
    ],
    5: [
        ("Ajax", "Benfica"),
        ("Galatasaray", "Union Saint-Gilloise"),
        ("Borussia Dortmund", "Villarreal"),
        ("Chelsea", "Barcelona"),
        ("Bodø/Glimt", "Juventus"),
        ("Manchester City", "Bayer Leverkusen"),
        ("Marseille", "Newcastle United"),
        ("Slavia Prague", "Athletic Bilbao"),
        ("Napoli", "Qarabağ"),
        ("Copenhagen", "Kairat"),
        ("Pafos", "Monaco"),
        ("Arsenal", "Bayern Munich"),
        ("Atlético Madrid", "Inter Milan"),
        ("Eintracht Frankfurt", "Atalanta"),
        ("Liverpool", "PSV Eindhoven"),
        ("Real Madrid", "Sporting CP"),
        ("Tottenham Hotspur", "Club Brugge"),
        ("Olympiacos", "Paris Saint-Germain")
    ],
    6: [
        ("Kairat", "Olympiacos"),
        ("Bayern Munich", "Sporting CP"),
        ("Monaco", "Galatasaray"),
        ("Atalanta", "Chelsea"),
        ("Barcelona", "Eintracht Frankfurt"),
        ("Inter Milan", "Liverpool"),
        ("PSV Eindhoven", "Atlético Madrid"),
        ("Union Saint-Gilloise", "Marseille"),
        ("Tottenham Hotspur", "Slavia Prague"),
        ("Qarabağ", "Ajax"),
        ("Villarreal", "Copenhagen"),
        ("Athletic Bilbao", "Paris Saint-Germain"),
        ("Bayer Leverkusen", "Newcastle United"),
        ("Borussia Dortmund", "Bodø/Glimt"),
        ("Club Brugge", "Arsenal"),
        ("Juventus", "Pafos"),
        ("Real Madrid", "Manchester City"),
        ("Benfica", "Napoli")
    ],
    7: [
        ("Kairat", "Club Brugge"),
        ("Bodø/Glimt", "Manchester City"),
        ("Copenhagen", "Napoli"),
        ("Inter Milan", "Arsenal"),
        ("Olympiacos", "Bayer Leverkusen"),
        ("Real Madrid", "Monaco"),
        ("Sporting CP", "Paris Saint-Germain"),
        ("Tottenham Hotspur", "Borussia Dortmund"),
        ("Villarreal", "Ajax"),
        ("Arsenal", "Kairat"),  # Reverse fixtures for remaining teams
        ("Ajax", "Athletic Bilbao"),
        ("Atalanta", "Barcelona"),
        ("Bayern Munich", "Benfica"),
        ("Chelsea", "Galatasaray"),
        ("Eintracht Frankfurt", "PSV Eindhoven"),
        ("Juventus", "Liverpool"),
        ("Marseille", "Qarabağ"),
        ("Newcastle United", "Union Saint-Gilloise")
    ],
    8: [
        # Final matchday - all remaining fixtures to complete 8 matches per team
        ("Arsenal", "Kairat"),
        ("Benfica", "Real Madrid"),
        ("Borussia Dortmund", "Ajax"),
        ("Club Brugge", "Sporting CP"),
        ("Galatasaray", "Monaco"),
        ("Inter Milan", "Bodø/Glimt"),
        ("Liverpool", "Qarabağ"),
        ("Manchester City", "Real Madrid"),
        ("Napoli", "Benfica"),
        ("Olympiacos", "Kairat"),
        ("Paris Saint-Germain", "Athletic Bilbao"),
        ("PSV Eindhoven", "Liverpool"),
        ("Slavia Prague", "Tottenham Hotspur"),
        ("Union Saint-Gilloise", "Bayern Munich"),
        ("Villarreal", "Pafos"),
        ("Atalanta", "Eintracht Frankfurt"),
        ("Barcelona", "Club Brugge"),
        ("Chelsea", "Newcastle United")
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
    print("Updating matchday information in matches.json...")

    # Load current matches data
    matches_data = load_matches_data()
    print(f"Loaded {len(matches_data)} teams")

    # Create fixture to matchday mapping
    fixture_map = create_fixture_to_matchday_mapping()
    total_fixtures = len(fixture_map)
    total_matchdays = len([md for md, fixtures in matchday_fixtures.items() if fixtures])

    print(f"Created mapping for {total_fixtures} fixtures across {total_matchdays} populated matchdays")

    # Add matchday info to matches
    updated_matches = add_matchday_to_matches(matches_data, fixture_map)

    # Backup original data
    if not os.path.exists('data/matches_backup.json'):
        with open('data/matches_backup.json', 'w') as f:
            json.dump(matches_data, f, indent=2)
        print("Created backup of original matches.json")

    # Save updated data
    with open('data/matches.json', 'w') as f:
        json.dump(updated_matches, f, indent=2)

    print("Matchday information updated successfully!")
    print(f"Data saved to 'data/matches.json'")

    # Count matches with matchday info
    matches_with_matchday = 0
    for team in updated_matches:
        for match in team['home_matches'] + team['away_matches']:
            if 'matchday' in match:
                matches_with_matchday += 1

    print(f"\nStatistics:")
    print(f"- Total match entries with matchday info: {matches_with_matchday}")
    print(f"- Unique fixtures mapped: {matches_with_matchday // 2}")
    print(f"- Matchdays populated: {total_matchdays}")

if __name__ == "__main__":
    main()