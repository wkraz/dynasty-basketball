import requests
from bs4 import BeautifulSoup
import json
import time

url = "https://basketball.realgm.com/nba/players"
print(f"Fetching data from {url}")

response = requests.get(url)
print(f"Response status code: {response.status_code}")

# Save the full HTML content to a file for inspection
with open('page_content.html', 'w', encoding='utf-8') as f:
    f.write(response.text)
print("Full HTML content saved to 'page_content.html'")

soup = BeautifulSoup(response.text, 'html.parser')

players_data = []

# Try different methods to find the table
table = soup.find('table', {'class': 'basketball statistics'})
if table is None:
    print("Trying to find table by ID...")
    table = soup.find('table', {'id': 'nba-players'})  # Adjust this ID if needed
if table is None:
    print("Trying to find any table...")
    table = soup.find('table')

if table is None:
    print("Could not find any table")
    print("Page title:", soup.title.string if soup.title else "No title found")
    print("First 1000 characters of body:", soup.body.text[:1000] if soup.body else "No body found")
else:
    print("Table found. Processing rows...")
    # Find all rows in the table
    rows = table.find_all('tr')
    
    print(f"Found {len(rows)} rows in the table")
    
    if len(rows) <= 1:
        print("Table found, but it contains no data rows")
        print("Table content:", table.prettify())
    else:
        # Iterate through rows, skipping the header
        for row in rows[1:]:
            cols = row.find_all('td')
            if len(cols) > 7:  # Ensure we have all required columns
                try:
                    player = {
                        "name": cols[1].text.strip(),
                        "position": cols[2].text.strip(),
                        "height": cols[3].text.strip(),
                        "weight": int(cols[4].text.strip()),
                        "age": int(cols[5].text.strip()),
                        "current_team": cols[6].text.strip(),
                        "years_of_service": int(cols[7].text.strip())
                    }
                    players_data.append(player)
                except ValueError as e:
                    print(f"Error processing row: {e}")
                    print(f"Row content: {[col.text.strip() for col in cols]}")
            else:
                print(f"Row has unexpected number of columns: {len(cols)}")
                print(f"Row content: {[col.text.strip() for col in cols]}")

        # Write the data to a JSON file
        with open('nba_players.json', 'w') as json_file:
            json.dump(players_data, json_file, indent=2)

        print(f"JSON file 'nba_players.json' has been created with {len(players_data)} player records.")

print("Script execution completed.")
