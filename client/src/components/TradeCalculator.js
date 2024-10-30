import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import './TradeCalculator.css';

function TradeCalculator() {
  const [players, setPlayers] = useState([]);
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);
  const [team1Value, setTeam1Value] = useState(0);
  const [team2Value, setTeam2Value] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [team1Input, setTeam1Input] = useState('');
  const [team2Input, setTeam2Input] = useState('');
  const [suggestedPlayers, setSuggestedPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/players`);
        setPlayers(response.data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    fetchPlayers();
  }, []);

  useEffect(() => {
    const { value: value1, adjustedValue: adjustedValue1 } = calculateTeamValue(team1Players, team2Players);
    const { value: value2, adjustedValue: adjustedValue2 } = calculateTeamValue(team2Players, team1Players);
    setTeam1Value(adjustedValue1);
    setTeam2Value(adjustedValue2);

    // Suggest players for balancing the trade
    const difference = Math.abs(adjustedValue1 - adjustedValue2);
    if (difference > 0) {
      const suggestedPlayers = players
        .filter(player => !team1Players.includes(player) && !team2Players.includes(player))
        .sort((a, b) => Math.abs(a.value - difference) - Math.abs(b.value - difference))
        .slice(0, 5);
      setSuggestedPlayers(suggestedPlayers);
    } else {
      setSuggestedPlayers([]);
    }
  }, [team1Players, team2Players, players]);

  const calculateTeamValue = (teamPlayers, otherTeamPlayers) => {
    const baseValue = teamPlayers.reduce((sum, player) => sum + player.value, 0);
    const adjustment = calculateValueAdjustment(teamPlayers.length, otherTeamPlayers.length);
    return {
      value: baseValue,
      adjustedValue: baseValue + adjustment
    };
  };

  const calculateValueAdjustment = (teamSize, otherTeamSize) => {
    if (teamSize === 0 || otherTeamSize === 0) return 0;
    const difference = otherTeamSize - teamSize;
    if (difference <= 0) return 0;
    
    const adjustmentPerPlayer = 3000 * (9000 / 6000);
    return difference * adjustmentPerPlayer;
  };

  const getSuggestions = (inputValue) => {
    const inputValueLower = inputValue.trim().toLowerCase();
    return players.filter(player =>
      player.name.toLowerCase().includes(inputValueLower) &&
      !team1Players.includes(player) &&
      !team2Players.includes(player)
    );
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const addPlayerToTeam = (team, player) => {
    if (team === 1) {
      setTeam1Players([...team1Players, player]);
      setTeam1Input('');
    } else {
      setTeam2Players([...team2Players, player]);
      setTeam2Input('');
    }
  };

  const removePlayer = (team, playerToRemove) => {
    if (team === 1) {
      setTeam1Players(team1Players.filter(player => player !== playerToRemove));
    } else {
      setTeam2Players(team2Players.filter(player => player !== playerToRemove));
    }
  };

  const renderSuggestion = (suggestion) => (
    <div>
      {suggestion.name} - {suggestion.position} - {suggestion.current_team}
    </div>
  );

  return (
    <div className="trade-calculator">
      <h2>Trade Calculator</h2>
      <div className="teams-container">
        <div className="team">
          <h3>Team 1</h3>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={(player) => player.name}
            renderSuggestion={renderSuggestion}
            inputProps={{
              placeholder: 'Type a player name',
              value: team1Input,
              onChange: (_, { newValue }) => setTeam1Input(newValue)
            }}
            onSuggestionSelected={(_, { suggestion }) => addPlayerToTeam(1, suggestion)}
          />
          <ul>
            {team1Players.map((player, index) => (
              <li key={index}>
                {player.name} - Value: {player.value}
                <button onClick={() => removePlayer(1, player)}>Remove</button>
              </li>
            ))}
          </ul>
          <p>Total Value: {team1Value}</p>
        </div>
        <div className="team">
          <h3>Team 2</h3>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={(player) => player.name}
            renderSuggestion={renderSuggestion}
            inputProps={{
              placeholder: 'Type a player name',
              value: team2Input,
              onChange: (_, { newValue }) => setTeam2Input(newValue)
            }}
            onSuggestionSelected={(_, { suggestion }) => addPlayerToTeam(2, suggestion)}
          />
          <ul>
            {team2Players.map((player, index) => (
              <li key={index}>
                {player.name} - Value: {player.value}
                <button onClick={() => removePlayer(2, player)}>Remove</button>
              </li>
            ))}
          </ul>
          <p>Total Value: {team2Value}</p>
        </div>
      </div>
      <div className="trade-result">
        <h3>Trade Difference</h3>
        <p>{Math.abs(team1Value - team2Value)}</p>
        {team1Players.length > 0 && team2Players.length > 0 && (
          <p>{team1Value > team2Value ? "Team 1 wins the trade" : "Team 2 wins the trade"}</p>
        )}
        {suggestedPlayers.length > 0 && (
          <div>
            <h4>Suggested players to balance the trade:</h4>
            <ul>
              {suggestedPlayers.map((player, index) => (
                <li key={index}>{player.name} - Value: {player.value}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default TradeCalculator;
