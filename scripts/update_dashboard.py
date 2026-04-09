import json
import os
from datetime import datetime

# Paths
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
TOUR_DATA_PATH = os.path.join(DATA_DIR, 'tour_data.json')
TRAVEL_DATA_PATH = os.path.join(DATA_DIR, 'travel_data.json')

def load_json(path):
    with open(path, 'r') as f:
        return json.load(f)

def save_json(path, data):
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)

def update_daily_sheet(tour_schedule, travel_data, current_date_str):
    """
    Updates the tour_data.json for the specific date.
    tour_schedule: List of all tour days from Master Tour.
    current_date_str: YYYY-MM-DD format.
    """
    # 1. Find today's show in the schedule
    todays_show = None
    next_show = None
    
    for i, show in enumerate(tour_schedule):
        if show['date'] == current_date_str:
            todays_show = show
            if i + 1 < len(tour_schedule):
                next_show = tour_schedule[i + 1]
            break

    if not todays_show:
        print(f"No show found for {current_date_str}")
        return

    # 2. Build the new JSON structure
    new_data = {
        "tour_name": "The Lady in Red Tour",
        "artist": "VANA",
        "last_updated": datetime.now().isoformat(),
        "current_day": todays_show,
        "crew": [
            {"name": "Phil Mauro", "role": "Tour Manager / Lighting"},
            {"name": "Sarah Jenkins", "role": "FOH Engineer"},
            {"name": "Mike Ross", "role": "Monitor Engineer"}
        ],
        "upcoming_venues": [next_show] if next_show else []
    }

    # 3. Add travel stats if next show exists
    if next_show:
        next_city = next_show['venue']['city']
        # Try to match city in travel_data (simplified matching)
        travel_info = None
        for city_key, info in travel_data.items():
            if city_key.split(',')[0].strip() == next_city.split(',')[0].strip():
                travel_info = info
                break
        
        if travel_info:
            new_data['upcoming_venues'][0]['travel'] = travel_info
        else:
            new_data['upcoming_venues'][0]['travel'] = {"miles": "TBD", "time": "TBD"}

    # 4. Save to file
    save_json(TOUR_DATA_PATH, new_data)
    print(f"Successfully updated Day Sheet for {current_date_str}")

# Example Usage (Mock Data based on your screenshots)
if __name__ == "__main__":
    # This is a sample of what the Master Tour data will look like once parsed
    mock_schedule = [
        {
            "date": "2026-04-17",
            "venue": {"name": "Hell at The Masquerade", "city": "Atlanta, GA"},
            "itinerary": [
                {"time": "02:00 PM", "event": "Load-In"},
                {"time": "04:00 PM", "event": "Soundcheck"},
                {"time": "07:00 PM", "event": "Doors"},
                {"time": "08:00 PM", "event": "Showtime"}
            ],
            "hotel": {"name": "Hyatt Regency", "checkout": "11:00 AM"}
        },
        {
            "date": "2026-04-18",
            "venue": {"name": "Conduit", "city": "Orlando, FL"},
            "itinerary": [],
            "hotel": {}
        }
    ]
    
    travel_data = load_json(TRAVEL_DATA_PATH)
    update_daily_sheet(mock_schedule, travel_data, "2026-04-17")
