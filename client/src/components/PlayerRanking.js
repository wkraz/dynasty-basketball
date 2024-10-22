import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlayerRanking.css';

const positions = ['PG', 'SG', 'SF', 'PF', 'C'];

function PlayerRanking() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPositions, setSelectedPositions] = useState(new Set(positions));

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

  const handlePositionChange = (position) => {
    setSelectedPositions(prevPositions => {
      const newPositions = new Set(prevPositions);
      if (newPositions.has(position)) {
        newPositions.delete(position);
      } else {
        newPositions.add(position);
      }
      return newPositions;
    });
  };

  const filteredPlayers = players.filter(player => 
    selectedPositions.has(player.position)
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="player-ranking">
      <h2>Player Rankings</h2>
      <div className="position-filters">
        {positions.map(position => (
          <label key={position}>
            <input
              type="checkbox"
              checked={selectedPositions.has(position)}
              onChange={() => handlePositionChange(position)}
            />
            {position}
          </label>
        ))}
      </div>
      <div className="player-list">
        {filteredPlayers.sort((a, b) => b.value - a.value).map(player => (
          <div key={player._id} className="player-item">
            <div className="player-name">{player.name}</div>
            <div className="player-details">
              Value: {player.value} | Position: {player.position} | Team: {player.current_team}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerRanking;
