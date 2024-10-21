import React, { useState, useEffect } from 'react';

function TradeCalculator() {
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [team1Value, setTeam1Value] = useState(0);
  const [team2Value, setTeam2Value] = useState(0);

  useEffect(() => {
    // Fetch available players from your API
    fetchPlayers().then(data => setAvailablePlayers(data));
  }, []);

  useEffect(() => {
    // Calculate team values whenever players change
    setTeam1Value(calculateTeamValue(team1Players));
    setTeam2Value(calculateTeamValue(team2Players));
  }, [team1Players, team2Players]);

  const addPlayerToTeam = (player, team) => {
    if (team === 1) {
      setTeam1Players([...team1Players, player]);
    } else {
      setTeam2Players([...team2Players, player]);
    }
    setAvailablePlayers(availablePlayers.filter(p => p.id !== player.id));
  };

  const removePlayerFromTeam = (player, team) => {
    if (team === 1) {
      setTeam1Players(team1Players.filter(p => p.id !== player.id));
    } else {
      setTeam2Players(team2Players.filter(p => p.id !== player.id));
    }
    setAvailablePlayers([...availablePlayers, player]);
  };

  const calculateTeamValue = (players) => {
    return players.reduce((total, player) => total + player.value, 0);
  };

  return (
    <div className="trade-calculator">
      <h2>Dynasty Football Trade Calculator</h2>
      <div className="teams-container">
        <div className="team">
          <h3>Team 1</h3>
          <ul>
            {team1Players.map(player => (
              <li key={player.id}>
                {player.name} ({player.value})
                <button onClick={() => removePlayerFromTeam(player, 1)}>Remove</button>
              </li>
            ))}
          </ul>
          <p>Total Value: {team1Value}</p>
        </div>
        <div className="team">
          <h3>Team 2</h3>
          <ul>
            {team2Players.map(player => (
              <li key={player.id}>
                {player.name} ({player.value})
                <button onClick={() => removePlayerFromTeam(player, 2)}>Remove</button>
              </li>
            ))}
          </ul>
          <p>Total Value: {team2Value}</p>
        </div>
      </div>
      <div className="available-players">
        <h3>Available Players</h3>
        <ul>
          {availablePlayers.map(player => (
            <li key={player.id}>
              {player.name} ({player.value})
              <button onClick={() => addPlayerToTeam(player, 1)}>Add to Team 1</button>
              <button onClick={() => addPlayerToTeam(player, 2)}>Add to Team 2</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TradeCalculator;

// Placeholder function - replace with actual API call
function fetchPlayers() {
  return Promise.resolve([
    { id: 1, name: "Nikola Jokic", value: 10000 },
    { id: 2, name: "Giannis Antetokounmpo", value: 9500 },
    { id: 3, name: "Luka Doncic", value: 9000 },
    // ... more players
  ]);
}
