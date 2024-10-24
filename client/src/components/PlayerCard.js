import React from 'react';
import './PlayerCard.css';

const PlayerCard = ({ player, onChoiceChange, selectedChoice }) => {
  return (
    <div className="player-card">
      <div className="player-info">
        <h3>{player.name}</h3>
        <p><strong>Position:</strong> {player.position}</p>
        <p><strong>Team:</strong> {player.current_team}</p>
        <p><strong>Value:</strong> {player.value}</p>
      </div>
      <div className="choice-buttons">
        <button
          className={selectedChoice === 'keep' ? 'selected' : ''}
          onClick={() => onChoiceChange(player._id, 'keep')}
        >
          Keep
        </button>
        <button
          className={selectedChoice === 'trade' ? 'selected' : ''}
          onClick={() => onChoiceChange(player._id, 'trade')}
        >
          Trade
        </button>
        <button
          className={selectedChoice === 'cut' ? 'selected' : ''}
          onClick={() => onChoiceChange(player._id, 'cut')}
        >
          Cut
        </button>
      </div>
    </div>
  );
};

export default PlayerCard;
