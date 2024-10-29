const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const NBA_API_URL = 'https://stats.nba.com/stats/commonallplayers?LeagueID=00&Season=2023-24&IsOnlyCurrentSeason=1';

const fetchNBAPlayers = async () => {
  try {
    const response = await axios.get(NBA_API_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.nba.com/',
      }
    });

    const players = response.data.resultSets[0].rowSet.map(player => {
      const fullName = player[2].split(' '); // Split the name
      const firstName = fullName[0];
      const lastName = fullName.slice(1).join(' '); // Join the rest of the name parts

      return {
        name: `${firstName} ${lastName}`,
        team: player[11] || 'Free Agent',
        position: player[5] || 'Unknown', // This should be the correct position
        height: player[10] || 'Unknown', // This was previously in the weight field
        weight: 'Unknown', // We don't have accurate weight data
        birthday: 'Unknown' // We don't have accurate birthday data
      };
    });

    const filePath = path.join(__dirname, 'nba_players.json');
    await fs.writeFile(filePath, JSON.stringify(players, null, 2));

    // og(`Successfully fetched and saved data for ${players.length} players.`);
  } catch (error) {
    console.error('Error fetching NBA players:', error);
  }
};

fetchNBAPlayers();
