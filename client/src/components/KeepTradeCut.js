import React, { useState, useEffect } from 'react';
import './KeepTradeCut.css';

function KeepTradeCut() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [choices, setChoices] = useState({});
  const [recentlyUsedPlayers, setRecentlyUsedPlayers] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const POSITIONS = ['C', 'F', 'G', 'GF', 'PF', 'PG', 'SF', 'SG'];

  const selectRandomPlayers = () => {
    const availablePlayers = players.filter(player => !recentlyUsedPlayers.has(player._id));
    
    if (availablePlayers.length < 3) {
      setRecentlyUsedPlayers(new Set());
      return selectRandomPlayers();
    }

    // Add weighting based on player value
    const weightedPlayers = availablePlayers.map(player => ({
      ...player,
      weight: calculateWeight(player)
    }));

    // Select first player using weighted random selection
    const firstPlayer = selectWeightedRandom(weightedPlayers);
    const baseValue = firstPlayer.value;

    // Find similar valued players within a range, also considering weights
    const similarValuePlayers = weightedPlayers
      .filter(player => 
        player._id !== firstPlayer._id && 
        Math.abs(player.value - baseValue) <= 1000
      );

    if (similarValuePlayers.length >= 2) {
      // Select two more players using weighted random selection
      const secondPlayer = selectWeightedRandom(similarValuePlayers);
      const remainingPlayers = similarValuePlayers.filter(p => p._id !== secondPlayer._id);
      const thirdPlayer = selectWeightedRandom(remainingPlayers);

      const selected = [firstPlayer, secondPlayer, thirdPlayer];
      setSelectedPlayers(selected);
      setRecentlyUsedPlayers(prev => {
        const newSet = new Set(prev);
        selected.forEach(player => newSet.add(player._id));
        return newSet;
      });
    } else {
      // Try again if we couldn't find enough similar value players
      selectRandomPlayers();
    }
  };

  // Helper function to calculate weight based on player value
  const calculateWeight = (player) => {
    let weight = 1;
    
    if (player.value >= 9000) weight += 4;
    else if (player.value >= 8500) weight += 3;
    else if (player.value >= 8000) weight += 2;
    else if (player.value >= 7500) weight += 1;
    
    // Reduce weight for very low value players and picks
    if (player.value < 5000) weight *= 0.5;
    if (player.position === 'PICK') weight *= 0.7;
    
    return weight;
  };

  // Helper function to select a random player based on weights
  const selectWeightedRandom = (weightedPlayers) => {
    const totalWeight = weightedPlayers.reduce((sum, p) => sum + p.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let player of weightedPlayers) {
      random -= player.weight;
      if (random <= 0) return player;
    }
    return weightedPlayers[0]; // Fallback
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchPlayers(),
          fetchStats()
        ]);
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (players.length > 0) {
      selectRandomPlayers();
    }
  }, [players]);

  const fetchPlayers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/players`);
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setSubmissionCount(data.submissions || 0);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleChoiceChange = (playerId, choice) => {
    setChoices(prev => {
      const newChoices = { ...prev };
      
      // If clicking the same choice for the same player, unselect it
      if (newChoices[playerId] === choice) {
        delete newChoices[playerId];
        return newChoices;
      }
      
      // If this choice is already selected for another player, remove it
      Object.keys(newChoices).forEach(key => {
        if (newChoices[key] === choice) {
          delete newChoices[key];
        }
      });
      
      // Set the new choice
      newChoices[playerId] = choice;
      return newChoices;
    });
  };

  const submitChoices = async () => {
    if (Object.keys(choices).length !== 3) return;

    setIsLoading(true);
    try {
      // First submit choices
      const choicesResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/update-player-values`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choices, players: selectedPlayers })
      });

      if (!choicesResponse.ok) throw new Error('Failed to submit choices');

      // Then increment counter
      console.log('Incrementing submissions...');
      const incrementResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/stats/increment-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!incrementResponse.ok) {
        console.error('Increment response:', await incrementResponse.text());
        throw new Error('Failed to increment counter');
      }

      const data = await incrementResponse.json();
      console.log('Increment successful:', data);
      setSubmissionCount(data.submissions);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        selectRandomPlayers();
        setChoices({});
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const PlayerCard = ({ player }) => {
    const currentChoice = choices[player._id];
    
    return (
      <div className="player-card">
        <h3>{player.name}</h3>
        <div className="player-details">
          <span className="position">{player.position}</span>
          <span className="team">{player.current_team}</span>
        </div>
        <div className="choice-buttons">
          <button
            className={`choice-button keep-button ${currentChoice === 'keep' ? 'selected' : ''}`}
            onClick={() => handleChoiceChange(player._id, 'keep')}
          >
            Keep
          </button>
          <button
            className={`choice-button trade-button ${currentChoice === 'trade' ? 'selected' : ''}`}
            onClick={() => handleChoiceChange(player._id, 'trade')}
          >
            Trade
          </button>
          <button
            className={`choice-button cut-button ${currentChoice === 'cut' ? 'selected' : ''}`}
            onClick={() => handleChoiceChange(player._id, 'cut')}
          >
            Cut
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="keep-trade-cut-container">
      <h2>Keep, Trade, Cut</h2>
      <div className="submission-counter">
        Total Submissions: {submissionCount}
      </div>
      {isLoading ? (
        <div className="loading">Loading players...</div>
      ) : (
        <>
          <div className="player-cards">
            {selectedPlayers.map((player) => (
              <PlayerCard key={player._id} player={player} />
            ))}
          </div>
          <div className="submit-button-container">
            <button 
              className="submit-button"
              onClick={submitChoices}
              disabled={Object.keys(choices).length !== 3}
            >
              Submit Choices
            </button>
          </div>
          {showSuccess && (
            <div className="success-message">
              Choices submitted successfully!
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default KeepTradeCut;
