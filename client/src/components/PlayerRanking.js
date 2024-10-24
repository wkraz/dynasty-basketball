import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlayerRanking.css';

const positions = ['PG', 'SG', 'SF', 'PF', 'C'];

function PlayerRanking() {
  const [players, setPlayers] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState(new Set(positions));

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('/api/players');
        setPlayers(response.data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    fetchPlayers();
  }, []);

  const handlePositionChange = (position) => {
    setSelectedPositions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(position)) {
        newSet.delete(position);
      } else {
        newSet.add(position);
      }
      return newSet;
    });
  };

  const filteredPlayers = players.filter(player => selectedPositions.has(player.position));

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
        {filteredPlayers.sort((a, b) => b.value - a.value).map((player, index) => (
          <div key={player._id} className="player-item">
            <span className="player-rank">{index + 1}</span>
            <div className="player-info">
              <div className="player-name">{player.name}</div>
              <div className="player-details">
                Value: {player.value} | Position: {player.position} | Team: {player.current_team}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerRanking;
