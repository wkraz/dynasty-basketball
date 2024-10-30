import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlayerRanking.css';

const positions = ['PG', 'SG', 'SF', 'PF', 'C'];

function PlayerRanking() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPositions, setSelectedPositions] = useState({
    PG: true,
    SG: true,
    SF: true,
    PF: true,
    C: true
  });

  console.log('Current API URL:', {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    nodeEnv: process.env.NODE_ENV
  });

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const apiUrl = 'https://dynasty-basketball.onrender.com';
        console.log('Using API URL:', apiUrl);
        
        const response = await fetch(`${apiUrl}/api/players`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPlayers(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error('Fetch error details:', {
          message: error.message,
          stack: error.stack
        });
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) return <div>Loading players...</div>;
  if (error) return <div>Error: {error}</div>;

  const handlePositionChange = (position) => {
    setSelectedPositions(prev => ({
      ...prev,
      [position]: !prev[position]
    }));
  };

  const filteredPlayers = players.filter(player => 
    selectedPositions[player.position]
  ).sort((a, b) => b.value - a.value);

  return (
    <div className="player-ranking">
      <h2>Player Rankings</h2>
      <div className="position-filters">
        {positions.map(position => (
          <label key={position}>
            <input
              type="checkbox"
              checked={selectedPositions[position]}
              onChange={() => handlePositionChange(position)}
            />
            {position}
          </label>
        ))}
      </div>
      <div className="player-list">
        {filteredPlayers.map((player, index) => (
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
