#!/usr/bin/env python3
"""
Check for the specific missing matches identified.
"""

import json

def check_missing_matches():
    """Check for the specific missing matches."""

    # Load matches data
    with open('data/matches.json', 'r') as f:
        matches_data = json.load(f)

    # Create dictionaries for easy lookup
    teams_dict = {}
    for team_data in matches_data:
        teams_dict[team_data['home_team']] = team_data

    print("=== CHECKING SPECIFIC MISSING MATCHES ===")

    # Check Inter Milan vs Kairat
    print("\n1. Inter Milan vs Kairat:")

    inter_data = teams_dict['Inter Milan']
    kairat_in_inter_home = any(match['team'] == 'Kairat' for match in inter_data['home_matches'])
    kairat_in_inter_away = any(match['team'] == 'Kairat' for match in inter_data['away_matches'])

    if kairat_in_inter_home:
        print("   ✓ Found: Inter Milan hosts Kairat")
    elif kairat_in_inter_away:
        print("   ✓ Found: Inter Milan visits Kairat")
    else:
        print("   ✗ MISSING: Inter Milan vs Kairat")

    kairat_data = teams_dict['Kairat']
    inter_in_kairat_home = any(match['team'] == 'Inter Milan' for match in kairat_data['home_matches'])
    inter_in_kairat_away = any(match['team'] == 'Inter Milan' for match in kairat_data['away_matches'])

    if inter_in_kairat_home:
        print("   ✓ Found: Kairat hosts Inter Milan")
    elif inter_in_kairat_away:
        print("   ✓ Found: Kairat visits Inter Milan")
    else:
        print("   ✗ MISSING: Kairat vs Inter Milan")

    # Check Inter Milan vs Bodø/Glimt
    print("\n2. Inter Milan vs Bodø/Glimt:")

    bodo_in_inter_home = any(match['team'] == 'Bodø/Glimt' for match in inter_data['home_matches'])
    bodo_in_inter_away = any(match['team'] == 'Bodø/Glimt' for match in inter_data['away_matches'])

    if bodo_in_inter_home:
        print("   ✓ Found: Inter Milan hosts Bodø/Glimt")
    elif bodo_in_inter_away:
        print("   ✓ Found: Inter Milan visits Bodø/Glimt")
    else:
        print("   ✗ MISSING: Inter Milan vs Bodø/Glimt")

    bodo_data = teams_dict['Bodø/Glimt']
    inter_in_bodo_home = any(match['team'] == 'Inter Milan' for match in bodo_data['home_matches'])
    inter_in_bodo_away = any(match['team'] == 'Inter Milan' for match in bodo_data['away_matches'])

    if inter_in_bodo_home:
        print("   ✓ Found: Bodø/Glimt hosts Inter Milan")
    elif inter_in_bodo_away:
        print("   ✓ Found: Bodø/Glimt visits Inter Milan")
    else:
        print("   ✗ MISSING: Bodø/Glimt vs Inter Milan")

    # Check what Bodø/Glimt's current schedule looks like
    print(f"\nBodø/Glimt's current opponents ({len(bodo_data['home_matches']) + len(bodo_data['away_matches'])}):")
    print("Home matches:")
    for match in bodo_data['home_matches']:
        print(f"  Bodø/Glimt vs {match['team']}")
    print("Away matches:")
    for match in bodo_data['away_matches']:
        print(f"  {match['team']} vs Bodø/Glimt")

if __name__ == "__main__":
    check_missing_matches()