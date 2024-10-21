import React, { useState, useEffect } from 'react';

const positions = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'];

function PlayerRanking() {
  const [players, setPlayers] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState('UTIL');

  useEffect(() => {
    // Fetch players from your API
    fetchPlayers().then(data => setPlayers(data));
  }, []);

  const filterPlayersByPosition = (players, position) => {
    switch (position) {
      case 'G':
        return players.filter(p => p.positions.includes('PG') || p.positions.includes('SG'));
      case 'F':
        return players.filter(p => p.positions.includes('SF') || p.positions.includes('PF'));
      case 'UTIL':
        return players; // All players are UTIL
      default:
        return players.filter(p => p.positions.includes(position));
    }
  };

  const filteredPlayers = filterPlayersByPosition(players, selectedPosition);

  return (
    <div className="player-ranking">
      <h2>Player Rankings</h2>
      <div className="position-filters">
        {positions.map(pos => (
          <button
            key={pos}
            onClick={() => setSelectedPosition(pos)}
            className={selectedPosition === pos ? 'active' : ''}
          >
            {pos}
          </button>
        ))}
      </div>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Position(s)</th>
            <th>Team</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.map((player, index) => (
            <tr key={player.id}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.positions.join(', ')}</td>
              <td>{player.team}</td>
              <td>{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlayerRanking;

// Placeholder function - replace with actual API call
function fetchPlayers() {
  // This should be replaced with an actual API call
  return Promise.resolve([
    { id: 1, name: "LeBron James", positions: ["SF", "PF"], team: "LAL", score: 95 },
    { id: 2, name: "Stephen Curry", positions: ["PG", "SG"], team: "GSW", score: 94 },
    // ... more players
  ]);
}
