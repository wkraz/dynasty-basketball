import React, { useState, useEffect } from 'react';

const PlayerSearch = ({ onSelect }) => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/players`);
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    fetchPlayers();
  }, []);

  const searchPlayers = (query) => {
    return players.filter(player => 
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
