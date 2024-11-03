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

  const calculateTeamValue = (teamPlayers, otherTeamPlayers) => {
    const baseValue = teamPlayers.reduce((sum, player) => sum + player.value, 0);
    const adjustment = calculateValueAdjustment(teamPlayers, otherTeamPlayers);
    return {
      value: baseValue,
      adjustedValue: baseValue + adjustment
    };
  };

  const calculateValueAdjustment = (teamPlayers, otherTeamPlayers) => {
    // No adjustment if either side is empty or if teams have equal number of players
    if (teamPlayers.length === 0 || otherTeamPlayers.length === 0 || 
        teamPlayers.length === otherTeamPlayers.length) {
      return 0;
    }
    
    // Find the highest value player in the trade
    const allPlayers = [...teamPlayers, ...otherTeamPlayers];
    const highestValuePlayer = Math.max(...allPlayers.map(p => p.value));
    
    // If this team has the highest value player AND fewer players
    if (teamPlayers.length < otherTeamPlayers.length && 
        teamPlayers.some(p => p.value === highestValuePlayer)) {
        const difference = Math.abs(teamPlayers.length - otherTeamPlayers.length);
        
        // Diminishing returns for each additional player difference
        let totalAdjustment = 0;
        for (let i = 0; i < difference; i++) {
            // Start at 40% and decrease by 7% for each additional player
            const adjustmentPercent = Math.max(0.40 - (i * 0.07), 0.15);
            totalAdjustment += highestValuePlayer * adjustmentPercent;
        }
        
        return Math.round(totalAdjustment);
    }
    
    return 0;
  };

  useEffect(() => {
    const { value: value1, adjustedValue: adjustedValue1 } = calculateTeamValue(team1Players, team2Players);
    const { value: value2, adjustedValue: adjustedValue2 } = calculateTeamValue(team2Players, team1Players);
    setTeam1Value(adjustedValue1);
    setTeam2Value(adjustedValue2);

    // Suggest players for balancing the trade
    const difference = Math.abs(adjustedValue1 - adjustedValue2);
    if (difference > 500) {  // Only suggest players if difference is significant
      const targetValue = difference;
      const suggestedPlayers = allPlayers
        .filter(player => {
          // Don't suggest players already in the trade
          if (team1Players.includes(player) || team2Players.includes(player)) return false;
          
          // Consider the value adjustment when suggesting players
          const hypotheticalTeam = adjustedValue1 > adjustedValue2 
            ? [...team2Players, player]
            : [...team1Players, player];
          const otherTeam = adjustedValue1 > adjustedValue2 
            ? team1Players 
            : team2Players;
          
          const { adjustedValue } = calculateTeamValue(hypotheticalTeam, otherTeam);
          const newDifference = Math.abs(adjustedValue - (adjustedValue1 > adjustedValue2 ? adjustedValue1 : adjustedValue2));
          
          // Look for players that would make the trade roughly fair
          return newDifference < 1000; // Increased threshold for better suggestions
        })
        .sort((a, b) => {
          // Sort by how well they balance the trade
          const diffA = Math.abs(a.value - targetValue);
          const diffB = Math.abs(b.value - targetValue);
          return diffA - diffB;
        })
        .slice(0, 5);
      setSuggestedPlayers(suggestedPlayers);
    } else {
      setSuggestedPlayers([]);
    }
  }, [team1Players, team2Players, allPlayers]);

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
            {team1Players.length > 0 && team2Players.length > 0 && 
             team1Value > team1Players.reduce((sum, p) => sum + p.value, 0) && (
              <li className="value-adjustment">
                Value Adjustment: +{team1Value - team1Players.reduce((sum, p) => sum + p.value, 0)}
              </li>
            )}
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
            {team1Players.length > 0 && team2Players.length > 0 && 
             team2Value > team2Players.reduce((sum, p) => sum + p.value, 0) && (
              <li className="value-adjustment">
                Value Adjustment: +{team2Value - team2Players.reduce((sum, p) => sum + p.value, 0)}
              </li>
            )}
          </ul>
          <p>Total Value: {team2Value}</p>
        </div>
      </div>
      <div className="trade-result">
        <h3>Trade Difference</h3>
        <p>{Math.abs(team1Value - team2Value)}</p>
        {team1Players.length > 0 && team2Players.length > 0 && (
          <>
            {Math.abs(team1Value - team2Value) <= 500 ? (
              <p className="fair-trade">This is a fair trade!</p>
            ) : (
              <p>{team1Value > team2Value ? "Team 1 wins the trade" : "Team 2 wins the trade"}</p>
            )}
          </>
        )}
        {suggestedPlayers.length > 0 && (
          <div>
            <h4>Suggested players to balance the trade:</h4>
            <ul>
              {suggestedPlayers.map((player, index) => (
                <li key={index}>
                  {player.name} - Value: {player.value}
                  <span className="suggestion-note">
                    (Including value adjustments)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default TradeCalculator;
