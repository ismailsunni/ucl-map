#!/usr/bin/env python3
"""
Fix the missing matches for Inter Milan and Kairat based on the fixture data.
"""

import json

def calculate_distance(team1_coords, team2_coords):
    """Calculate distance between two coordinates using Haversine formula."""
    import math

    lat1, lon1 = team1_coords
    lat2, lon2 = team2_coords

    # Convert to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    r = 6371  # Earth's radius in kilometers

    return round(c * r)

def get_team_coordinates():
    """Get coordinates for distance calculation."""
    # These coordinates should match your existing stadium data
    coordinates = {
        'Inter Milan': (45.4781, 9.1240),  # San Siro, Milan
        'Kairat': (43.2220, 76.8512),      # Almaty, Kazakhstan
        'Bodø/Glimt': (67.2804, 14.4049),   # Bodø, Norway
    }
    return coordinates

def fix_missing_matches():
    """Fix the missing matches for Inter Milan and Kairat."""

    # Load matches data
    with open('data/matches.json', 'r') as f:
        matches_data = json.load(f)

    # Get coordinates for distance calculation
    coords = get_team_coordinates()

    # Create dictionaries for easy lookup
    teams_dict = {}
    for team_data in matches_data:
        teams_dict[team_data['home_team']] = team_data

    print("=== FIXING MISSING MATCHES ===")

    # According to the fixture data from update_all_matchdays.py:
    # Matchday 4: ("Inter Milan", "Kairat")
    # Matchday 8: ("Inter Milan", "Bodø/Glimt")

    # But first, let me check if Bodø/Glimt really has 8 matches or if there's an error
    print("\nAnalyzing current match counts:")

    bodo_data = teams_dict['Bodø/Glimt']
    print(f"Bodø/Glimt: {len(bodo_data['home_matches'])} home + {len(bodo_data['away_matches'])} away = {len(bodo_data['home_matches']) + len(bodo_data['away_matches'])} total")

    inter_data = teams_dict['Inter Milan']
    print(f"Inter Milan: {len(inter_data['home_matches'])} home + {len(inter_data['away_matches'])} away = {len(inter_data['home_matches']) + len(inter_data['away_matches'])} total")

    kairat_data = teams_dict['Kairat']
    print(f"Kairat: {len(kairat_data['home_matches'])} home + {len(kairat_data['away_matches'])} away = {len(kairat_data['home_matches']) + len(kairat_data['away_matches'])} total")

    # The issue might be that we need to replace one of Bodø/Glimt's matches with Inter Milan
    # Let's check what should happen according to the fixture data

    # Calculate distances
    inter_kairat_distance = calculate_distance(coords['Inter Milan'], coords['Kairat'])
    inter_bodo_distance = calculate_distance(coords['Inter Milan'], coords['Bodø/Glimt'])

    print(f"\nCalculated distances:")
    print(f"Inter Milan - Kairat: {inter_kairat_distance} km")
    print(f"Inter Milan - Bodø/Glimt: {inter_bodo_distance} km")

    # Fix 1: Add Inter Milan vs Kairat (matchday 4)
    print(f"\n1. Adding Inter Milan vs Kairat (matchday 4)")

    # Add to Inter Milan's home matches
    inter_data['home_matches'].append({
        'team': 'Kairat',
        'distance': inter_kairat_distance,
        'matchday': 4
    })

    # Add to Kairat's away matches
    kairat_data['away_matches'].append({
        'team': 'Inter Milan',
        'distance': inter_kairat_distance,
        'matchday': 4
    })

    print(f"   Added Inter Milan vs Kairat ({inter_kairat_distance} km, matchday 4)")

    # Check the current counts after first fix
    print(f"\nAfter first fix:")
    print(f"Inter Milan: {len(inter_data['home_matches'])} home + {len(inter_data['away_matches'])} away = {len(inter_data['home_matches']) + len(inter_data['away_matches'])} total")
    print(f"Kairat: {len(kairat_data['home_matches'])} home + {len(kairat_data['away_matches'])} away = {len(kairat_data['home_matches']) + len(kairat_data['away_matches'])} total")

    # Save the updated data
    with open('data/matches.json', 'w') as f:
        json.dump(matches_data, f, indent=2)

    print(f"\n✅ Fixed missing matches!")
    print(f"✅ Updated data/matches.json")

    # Verify the fix
    print(f"\n=== VERIFICATION ===")
    final_inter_count = len(inter_data['home_matches']) + len(inter_data['away_matches'])
    final_kairat_count = len(kairat_data['home_matches']) + len(kairat_data['away_matches'])

    print(f"Final counts:")
    print(f"Inter Milan: {final_inter_count} total matches {'✅' if final_inter_count == 8 else '❌'}")
    print(f"Kairat: {final_kairat_count} total matches {'✅' if final_kairat_count == 8 else '❌'}")

if __name__ == "__main__":
    fix_missing_matches()