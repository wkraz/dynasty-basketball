import React, { useState } from 'react';

function AddPlayer() {
  const [playerName, setPlayerName] = useState('');
  const [position, setPosition] = useState('');
  const [team, setTeam] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to add player
    // comment out for prod - console.log('Adding player:', { playerName, position, team, value });
    // Reset form
    setPlayerName('');
    setPosition('');
    setTeam('');
    setValue('');
  };

  return (
    <div className="add-player-page">
      <h1>Add New Player</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="playerName">Player Name:</label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="position">Position:</label>
          <input
            type="text"
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="team">Team:</label>
          <input
            type="text"
            id="team"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="value">Value:</label>
          <input
            type="number"
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Player</button>
      </form>
    </div>
  );
}

export default AddPlayer;

