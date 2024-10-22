import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlayerSearch from './PlayerSearch';

const TradeCalculator = () => {
  const [allPlayers, setAllPlayers] = useState([]);
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('/api/players');
        setAllPlayers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching players:', error);
        setError('Failed to fetch players. Please try again later.');
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const calculateValueAdjustments = () => {
    const difference = Math.abs(team1.length - team2.length);
    if (difference === 0) return { team1: [], team2: [] };

    const team1Value = team1.reduce((sum, player) => sum + player.value, 0);
    const team2Value = team2.reduce((sum, player) => sum + player.value, 0);
    const totalValue = team1Value + team2Value;
    const averageValue = Math.round(totalValue / (team1.length + team2.length));
    
    // Adjust this calculation based on your specific requirements
    const adjustmentValue = Math.round(averageValue * 0.3); // 30% of average player value

    if (team1.length < team2.length) {
      return {
        team1: Array(difference).fill(adjustmentValue),
        team2: []
      };
    } else {
      return {
        team1: [],
        team2: Array(difference).fill(adjustmentValue)
      };
    }
  };

  const addPlayer = (player, team) => {
    if (team === 1) {
      setTeam1([...team1, player]);
    } else {
      setTeam2([...team2, player]);
    }
  };

  const removePlayer = (index, team) => {
    if (team === 1) {
      setTeam1(team1.filter((_, i) => i !== index));
    } else {
      setTeam2(team2.filter((_, i) => i !== index));
    }
  };

  const valueAdjustments = calculateValueAdjustments();

  const calculateTotalValue = (players, adjustments) => {
    return players.reduce((sum, player) => sum + player.value, 0) + 
           adjustments.reduce((sum, adj) => sum + adj, 0);
  };

  const generateTradeSummary = () => {
    const team1TotalValue = calculateTotalValue(team1, valueAdjustments.team1);
    const team2TotalValue = calculateTotalValue(team2, valueAdjustments.team2);
    const difference = Math.abs(team1TotalValue - team2TotalValue);

    if (team1.length === 0 || team2.length === 0) {
      return "Add players to both teams to see a trade summary.";
    }

    if (difference <= 500) {
      return `This trade is fair. Team 1 total: ${team1TotalValue}, Team 2 total: ${team2TotalValue}. Difference: ${difference}`;
    } else if (team1TotalValue > team2TotalValue) {
      return `Fleece. Team 1 is favored by ${difference}. Team 1 total: ${team1TotalValue}, Team 2 total: ${team2TotalValue}`;
    } else {
      return `Fleece. Team 2 is favored by ${difference}. Team 1 total: ${team1TotalValue}, Team 2 total: ${team2TotalValue}`;
    }
  };

  const renderPlayerList = (teamNumber) => (
    <div>
      <h3>Available Players</h3>
      <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
        {allPlayers.map((player) => (
          <div key={player._id}>
            {player.name} ({player.value})
            <button onClick={() => addPlayer(player, teamNumber)}>Add</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTeam = (team, teamPlayers, adjustments) => (
    <div>
      <h2>Team {team}</h2>
      {renderPlayerList(team)}
      <h3>Selected Players</h3>
      {teamPlayers.map((player, index) => (
        <div key={index}>
          {player.name} ({player.value})
          <button onClick={() => removePlayer(index, team)}>Remove</button>
        </div>
      ))}
      {adjustments.map((adjustment, index) => (
        <div key={`adjustment-${index}`}>Value Adjustment: {adjustment}</div>
      ))}
      <div>
        Total: {calculateTotalValue(teamPlayers, adjustments)}
      </div>
    </div>
  );

  if (loading) return <div>Loading players...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {renderTeam(1, team1, valueAdjustments.team1)}
      {renderTeam(2, team2, valueAdjustments.team2)}
      <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
        Trade Summary: {generateTradeSummary()}
      </div>
    </div>
  );
};

export default TradeCalculator;
