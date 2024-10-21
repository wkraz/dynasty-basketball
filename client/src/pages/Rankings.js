import React from 'react';
import PlayerRanking from '../components/PlayerRanking';

function Rankings() {
  return (
    <div className="rankings-page">
      <h1>Player Rankings</h1>
      <p>View and filter player rankings by position.</p>
      <PlayerRanking />
    </div>
  );
}

export default Rankings;

