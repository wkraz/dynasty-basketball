import csv
import json

# Read the CSV file
with open('nba_players.csv', 'r') as csv_file:
    csv_reader = csv.reader(csv_file)
    players = []
    for row in csv_reader:
        player = {
            "name": row[1],
            "position": row[2],
            "height": row[3],
            "weight": int(row[4]),
            "age": int(row[5]),
            "current_team": row[6],
            "years_of_service": int(row[7])
        }
        players.append(player)

# Write to JSON file
with open('nba_players.json', 'w') as json_file:
    json.dump(players, json_file, indent=2)

print(f"JSON file 'nba_players.json' has been created with {len(players)} player records.")
