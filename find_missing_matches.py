#!/usr/bin/env python3
"""
Script to find the specific missing matches for Inter Milan and Kairat.
"""

import json

def find_specific_missing_matches():
    """Find exactly which matches are missing."""

    # Load matches data
    with open('data/matches.json', 'r') as f:
        matches_data = json.load(f)

    # Create dictionaries for easy lookup
    teams_dict = {}
    for team_data in matches_data:
        teams_dict[team_data['home_team']] = team_data

    print("=== INTER MILAN ANALYSIS ===")
    inter_data = teams_dict['Inter Milan']

    print("Inter Milan's current matches:")
    print("Home matches:")
    for match in inter_data['home_matches']:
        print(f"  Inter Milan vs {match['team']}")

    print("Away matches:")
    for match in inter_data['away_matches']:
        print(f"  {match['team']} vs Inter Milan")

    # Find who Inter Milan should be playing but isn't
    inter_opponents = set()
    for match in inter_data['home_matches']:
        inter_opponents.add(match['team'])
    for match in inter_data['away_matches']:
        inter_opponents.add(match['team'])

    print(f"\nInter Milan's current opponents ({len(inter_opponents)}):")
    for opponent in sorted(inter_opponents):
        print(f"  {opponent}")

    print("\n=== KAIRAT ANALYSIS ===")
    kairat_data = teams_dict['Kairat']

    print("Kairat's current matches:")
    print("Home matches:")
    for match in kairat_data['home_matches']:
        print(f"  Kairat vs {match['team']}")

    print("Away matches:")
    for match in kairat_data['away_matches']:
        print(f"  {match['team']} vs Kairat")

    # Find who Kairat should be playing but isn't
    kairat_opponents = set()
    for match in kairat_data['home_matches']:
        kairat_opponents.add(match['team'])
    for match in kairat_data['away_matches']:
        kairat_opponents.add(match['team'])

    print(f"\nKairat's current opponents ({len(kairat_opponents)}):")
    for opponent in sorted(kairat_opponents):
        print(f"  {opponent}")

    # Check reciprocal relationships
    print("\n=== CHECKING RECIPROCAL MATCHES ===")

    # Check if teams that play against Inter Milan also have Inter Milan in their schedule
    print("\nChecking Inter Milan's opponents:")
    for opponent_name in sorted(inter_opponents):
        opponent_data = teams_dict[opponent_name]

        # Check if opponent has Inter Milan as home opponent
        inter_in_opponent_home = any(match['team'] == 'Inter Milan' for match in opponent_data['home_matches'])
        # Check if opponent has Inter Milan as away opponent
        inter_in_opponent_away = any(match['team'] == 'Inter Milan' for match in opponent_data['away_matches'])

        if inter_in_opponent_home:
            print(f"  ✓ {opponent_name} hosts Inter Milan")
        elif inter_in_opponent_away:
            print(f"  ✓ {opponent_name} visits Inter Milan")
        else:
            print(f"  ✗ {opponent_name} - NO RECIPROCAL MATCH FOUND!")

    print("\nChecking Kairat's opponents:")
    for opponent_name in sorted(kairat_opponents):
        opponent_data = teams_dict[opponent_name]

        # Check if opponent has Kairat as home opponent
        kairat_in_opponent_home = any(match['team'] == 'Kairat' for match in opponent_data['home_matches'])
        # Check if opponent has Kairat as away opponent
        kairat_in_opponent_away = any(match['team'] == 'Kairat' for match in opponent_data['away_matches'])

        if kairat_in_opponent_home:
            print(f"  ✓ {opponent_name} hosts Kairat")
        elif kairat_in_opponent_away:
            print(f"  ✓ {opponent_name} visits Kairat")
        else:
            print(f"  ✗ {opponent_name} - NO RECIPROCAL MATCH FOUND!")

if __name__ == "__main__":
    find_specific_missing_matches()