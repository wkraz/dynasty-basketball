import React, { useState } from 'react';

const PlayerSearch = ({ onSelect }) => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // This is a mock function. In a real app, you'd fetch this data from an API or database
  const searchPlayers = (query) => {
    // Mock NBA player data
    const allPlayers = [
      { name: 'LeBron James', value: 9000 },
      { name: 'Stephen Curry', value: 8500 },
      { name: 'Kevin Durant', value: 8700 },
      { name: 'Giannis Antetokounmpo', value: 9200 },
      { name: 'Luka Doncic', value: 9100 },
      { name: 'Nikola Jokic', value: 9300 },
      { name: 'Joel Embiid', value: 9000 },
      { name: 'Kawhi Leonard', value: 8300 },
      { name: 'Anthony Davis', value: 8200 },
      { name: 'Damian Lillard', value: 8000 },
      // Add more NBA players...
    ];

    return allPlayers.filter(player => 
      player.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearch(query);
    setSuggestions(searchPlayers(query));
  };

  const handleSelect = (player) => {
    onSelect(player);
    setSearch('');
    setSuggestions([]);
  };

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search for an NBA player"
      />
      <ul>
        {suggestions.map((player, index) => (
          <li key={index} onClick={() => handleSelect(player)}>
            {player.name} ({player.value})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerSearch;
