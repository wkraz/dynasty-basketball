import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlayerRanking.css';

const POSITIONS = ['C', 'F', 'G', 'GF', 'PF', 'PG', 'SF', 'SG'];

const POSITION_LABELS = {
  'C': 'Center',
  'F': 'Forward',
  'G': 'Guard',
  'GF': 'Guard/Forward',
  'PF': 'Power Forward',
  'PG': 'Point Guard',
  'SF': 'Small Forward',
  'SG': 'Shooting Guard'
};

function PlayerRanking() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPositions, setSelectedPositions] = useState(
    POSITIONS.reduce((acc, pos) => ({ ...acc, [pos]: true }), {})
  );

  console.log('Current API URL:', {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    nodeEnv: process.env.NODE_ENV
  });

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/players`);
      const data = await response.json();
      console.log('Total players fetched:', data.length);
      console.log('Sample player:', data.find(p => p.name.includes('LaMelo')));
      setPlayers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching players:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlayers = players.filter(player => {
    const positionMatch = selectedPositions[player.position];
    const searchMatch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
    return positionMatch && searchMatch;
  }).sort((a, b) => b.value - a.value);

  console.log('Filtered players count:', filteredPlayers.length);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="player-ranking">
      <h2>Player Rankings</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search players..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="position-filters">
        {POSITIONS.map(position => (
          <label key={position} className="position-filter">
            <input
              type="checkbox"
              checked={selectedPositions[position]}
              onChange={() => setSelectedPositions(prev => ({
                ...prev,
                [position]: !prev[position]
              }))}
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
                <span className="player-position">{player.position}</span>
                <span className="player-team">{player.current_team}</span>
                <span className="player-value">Value: {player.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerRanking;
