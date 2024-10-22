import json

def fix_height(height):
    # Reverse the order
    parts = height.split('-')
    parts.reverse()
    
    # Replace month abbreviations with feet
    if parts[0] == 'Jun':
        parts[0] = "6'"
    elif parts[0] == 'Jul':
        parts[0] = "7'"
    
    # Add inches and quotation mark
    parts[1] = parts[1] + '"'
    
    return ''.join(parts)

# Read the JSON file
with open('nba_players.json', 'r') as file:
    data = json.load(file)

# Fix heights
for player in data:
    player['height'] = fix_height(player['height'])

# Write the updated JSON back to the file
with open('nba_players.json', 'w') as file:
    json.dump(data, file, indent=2)

print("Heights have been fixed successfully!")

