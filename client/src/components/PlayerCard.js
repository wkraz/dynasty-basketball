import React from 'react';
import './PlayerCard.css';

const PlayerCard = ({ player, onChoiceChange, selectedChoice, disabled }) => {
  const getButtonClass = (choice) => {
    return `choice-button ${choice} ${selectedChoice === choice ? 'selected' : ''}`;
  };

  return (
    <div className="player-card">
      <div className="player-info">
        <h3 className="player-name">{player.name}</h3>
        <div className="player-details">
          <span className="detail-item">
            <i className="fas fa-basketball-ball"></i> {player.position}
          </span>
          <span className="detail-item">
            <i className="fas fa-jersey"></i> {player.current_team}
          </span>
          <span className="detail-item">
            <i className="fas fa-chart-line"></i> Value: {player.value}
          </span>
        </div>
      </div>
      <div className="choice-buttons">
        <button
          className={getButtonClass('keep')}
          onClick={() => onChoiceChange(player._id, 'keep')}
          disabled={disabled}
        >
          Keep
        </button>
        <button
          className={getButtonClass('trade')}
          onClick={() => onChoiceChange(player._id, 'trade')}
          disabled={disabled}
        >
          Trade
        </button>
        <button
          className={getButtonClass('cut')}
          onClick={() => onChoiceChange(player._id, 'cut')}
          disabled={disabled}
        >
          Cut
        </button>
      </div>
    </div>
  );
};

export default PlayerCard;
