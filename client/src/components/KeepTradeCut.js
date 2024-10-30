import React, { useState, useEffect } from 'react';
import './KeepTradeCut.css';

function KeepTradeCut() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [choices, setChoices] = useState({});
  const [recentlyUsedPlayers, setRecentlyUsedPlayers] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const POSITIONS = ['C', 'F', 'G', 'GF', 'PF', 'PG', 'SF', 'SG'];

  useEffect(() => {
    fetchPlayers();
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

  const handleChoiceChange = (playerId, choice) => {
    setChoices(prev => {
      const newChoices = { ...prev };
      // If this choice is already selected for another player, remove it
      Object.keys(newChoices).forEach(key => {
        if (newChoices[key] === choice && key !== playerId) {
          delete newChoices[key];
        }
      });
      // Set the new choice
      newChoices[playerId] = choice;
      return newChoices;
    });
  };

  const submitChoices = async () => {
    if (Object.keys(choices).length !== 3) {
      console.error('Please make a choice for all three players.');
      return;
    }

    setIsLoading(true);
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/update-player-values`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          choices,
          players: selectedPlayers
        })
      });
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        selectRandomPlayers();
        setChoices({});
      }, 1500);
    } catch (error) {
      console.error('Error submitting choices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const PlayerCard = ({ player }) => {
    const currentChoice = choices[player._id];
    
    return (
      <div className="player-card">
        <h3>{player.name}</h3>
        <p className="position">{player.position}</p>
        <div className="choice-buttons">
          <button
            className={`choice-button keep-button ${currentChoice === 'keep' ? 'selected' : ''}`}
            onClick={() => handleChoiceChange(player._id, 'keep')}
            disabled={currentChoice !== 'keep' && Object.values(choices).includes('keep')}
          >
            Keep
          </button>
          <button
            className={`choice-button trade-button ${currentChoice === 'trade' ? 'selected' : ''}`}
            onClick={() => handleChoiceChange(player._id, 'trade')}
            disabled={currentChoice !== 'trade' && Object.values(choices).includes('trade')}
          >
            Trade
          </button>
          <button
            className={`choice-button cut-button ${currentChoice === 'cut' ? 'selected' : ''}`}
            onClick={() => handleChoiceChange(player._id, 'cut')}
            disabled={currentChoice !== 'cut' && Object.values(choices).includes('cut')}
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
