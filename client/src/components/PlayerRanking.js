import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PlayerRanking() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('/api/players');
        setPlayers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching players:', error);
        setError('Failed to fetch players. Please try again later.');
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <ul>
        {players.sort((a, b) => b.value - a.value).map(player => (
          <li key={player._id}>
            {player.name} - Value: {player.value}, Position: {player.position}, Team: {player.current_team}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlayerRanking;
