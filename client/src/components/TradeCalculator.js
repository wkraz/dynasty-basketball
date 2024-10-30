import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import './TradeCalculator.css';

const POSITIONS = ['C', 'F', 'G', 'GF', 'PF', 'PG', 'SF', 'SG'];

function TradeCalculator() {
  const [allPlayers, setAllPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);
  const [team1Value, setTeam1Value] = useState(0);
  const [team2Value, setTeam2Value] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [team1Input, setTeam1Input] = useState('');
  const [team2Input, setTeam2Input] = useState('');
  const [suggestedPlayers, setSuggestedPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize filters with all positions
  const [positionFilters, setPositionFilters] = useState({
    ALL: true,
    ...POSITIONS.reduce((acc, pos) => ({ ...acc, [pos]: true }), {})
  });

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/players`);
      const data = await response.json();
      setAllPlayers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching players:', error);
      setLoading(false);
    }
  };

  const filterPlayersByPosition = (players) => {
    if (positionFilters.ALL) return players;
    return players.filter(player => positionFilters[player.position]);
  };

  const filteredPlayers = filterPlayersByPosition(allPlayers)
    .filter(player => 
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !team1Players.includes(player) &&
      !team2Players.includes(player)
    );

  useEffect(() => {
    const { value: value1, adjustedValue: adjustedValue1 } = calculateTeamValue(team1Players, team2Players);
    const { value: value2, adjustedValue: adjustedValue2 } = calculateTeamValue(team2Players, team1Players);
    setTeam1Value(adjustedValue1);
    setTeam2Value(adjustedValue2);

    // Suggest players for balancing the trade
    const difference = Math.abs(adjustedValue1 - adjustedValue2);
    if (difference > 0) {
      const suggestedPlayers = allPlayers
        .filter(player => !team1Players.includes(player) && !team2Players.includes(player))
        .sort((a, b) => Math.abs(a.value - difference) - Math.abs(b.value - difference))
        .slice(0, 5);
      setSuggestedPlayers(suggestedPlayers);
    } else {
      setSuggestedPlayers([]);
    }
  }, [team1Players, team2Players, allPlayers]);

  const calculateTeamValue = (teamPlayers, otherTeamPlayers) => {
    const baseValue = teamPlayers.reduce((sum, player) => sum + player.value, 0);
    const adjustment = calculateValueAdjustment(teamPlayers.length, otherTeamPlayers.length);
    return {
      value: baseValue,
      adjustedValue: baseValue + adjustment
    };
  };

  const calculateValueAdjustment = (total, opposingTotal) => {
    if (total === 0) return 0;
    
    const difference = Math.abs(total - opposingTotal);
    const higherValue = Math.max(total, opposingTotal);
    
    // Base the adjustment on the difference with the opposing side
    if (total < opposingTotal) {
      // If this side is losing, add value based on the difference
      return Math.min(difference * 0.1, 800); // Cap at 800
    }
    
    return 0; // No adjustment if winning
  };

  const getSuggestions = (inputValue) => {
    const inputValueLower = inputValue.trim().toLowerCase();
    return filteredPlayers.filter(player =>
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
