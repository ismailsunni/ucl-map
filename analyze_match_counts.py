#!/usr/bin/env python3
"""
Script to analyze match counts per team to identify teams with fewer than 8 matches.
Each team should have exactly 8 matches (4 home, 4 away) in the UEFA Champions League league phase.
"""

import json

def analyze_match_counts():
    """Analyze match counts for all teams."""

    # Load matches data
    with open('data/matches.json', 'r') as f:
        matches_data = json.load(f)

    print(f"Analyzing {len(matches_data)} teams...\n")

    teams_with_issues = []

    for team_data in matches_data:
        team_name = team_data['home_team']
        home_count = len(team_data['home_matches'])
        away_count = len(team_data['away_matches'])
        total_count = home_count + away_count

        if total_count != 8:
            teams_with_issues.append({
                'team': team_name,
                'home': home_count,
                'away': away_count,
                'total': total_count,
                'missing': 8 - total_count
            })

        print(f"{team_name}: {home_count} home + {away_count} away = {total_count} total")

    print(f"\n--- SUMMARY ---")
    print(f"Total teams: {len(matches_data)}")
    print(f"Teams with issues: {len(teams_with_issues)}")

    if teams_with_issues:
        print(f"\nTeams with fewer than 8 matches:")
        for team in teams_with_issues:
            print(f"  {team['team']}: {team['total']} matches (missing {team['missing']})")
            print(f"    Home: {team['home']}, Away: {team['away']}")
    else:
        print("All teams have exactly 8 matches!")

    return teams_with_issues

def find_missing_matches():
    """Find what matches are missing by comparing with expected fixtures."""

    # Load matches data
    with open('data/matches.json', 'r') as f:
        matches_data = json.load(f)

    # Create a set of all existing matches (both directions)
    existing_matches = set()
    team_names = set()

    for team_data in matches_data:
        team_name = team_data['home_team']
        team_names.add(team_name)

        # Add home matches
        for match in team_data['home_matches']:
            existing_matches.add((team_name, match['team']))

        # Add away matches (as reverse pairs)
        for match in team_data['away_matches']:
            existing_matches.add((match['team'], team_name))

    print(f"\nTotal teams found: {len(team_names)}")
    print(f"Total matches found: {len(existing_matches)}")
    print(f"Expected matches for {len(team_names)} teams: {len(team_names) * 4}")  # Each team plays 4 home matches

    # In UEFA Champions League league phase, each team should play 8 different opponents
    # Let's check if all teams are represented correctly
    sorted_teams = sorted(team_names)
    print(f"\nAll teams in dataset:")
    for i, team in enumerate(sorted_teams, 1):
        print(f"  {i:2d}. {team}")

if __name__ == "__main__":
    print("=== ANALYZING MATCH COUNTS ===")
    teams_with_issues = analyze_match_counts()

    print("\n=== FINDING MISSING MATCHES ===")
    find_missing_matches()