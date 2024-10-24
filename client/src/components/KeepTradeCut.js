import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlayerCard from './PlayerCard'; // Add this import
import './KeepTradeCut.css';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

const KeepTradeCut = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [choices, setChoices] = useState({});
  const [recentlyUsedPlayers, setRecentlyUsedPlayers] = useState(new Set());

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (players.length > 0) {
      selectRandomPlayers();
    }
  }, [players]);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('/api/players');
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const selectRandomPlayers = () => {
    const weightedRandom = () => {
      const x = Math.random();
      return Math.floor(10000 * Math.pow(x, 0.3)); // This gives a more balanced distribution
    };

    const targetValue = weightedRandom();
    const sortedPlayers = [...players].sort((a, b) => 
      Math.abs(a.value - targetValue) - Math.abs(b.value - targetValue)
    );

    const availablePlayers = sortedPlayers.filter(player => !recentlyUsedPlayers.has(player._id));
    const selectedThree = availablePlayers.slice(0, 3);

    if (selectedThree.length === 3 && selectedThree.every((player, index, arr) => 
      index === 0 || Math.abs(player.value - arr[index-1].value) <= 1000
    )) {
      setSelectedPlayers(selectedThree);
      setRecentlyUsedPlayers(prev => {
        const newSet = new Set(prev);
        selectedThree.forEach(player => newSet.add(player._id));
        return newSet;
      });
      
      // Clear recently used players after a certain number of selections
      if (recentlyUsedPlayers.size > players.length / 2) {
        setRecentlyUsedPlayers(new Set());
      }
    } else {
      selectRandomPlayers(); // Recursively try again if condition not met
    }
  };

  const handleChoiceChange = (playerId, choice) => {
    setChoices(prevChoices => {
      const newChoices = { ...prevChoices };
      
      // Remove the previous choice for this player
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
    if (Object.keys(choices).length !== 3) {
      alert('Please make a choice for all three players.');
      return;
    }

    try {
      console.log('Submitting choices:', { choices, players: selectedPlayers });
      const response = await api.post('/api/update-player-values', {
        choices,
        players: selectedPlayers
      });
      console.log('Response:', response.data);
      alert('Choices submitted successfully!');
      selectRandomPlayers();
      setChoices({});
    } catch (error) {
      console.error('Error submitting choices:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      alert('Error submitting choices. Please try again.');
    }
  };

  return (
    <div className="keep-trade-cut-container">
      <h2>Keep, Trade, Cut</h2>
      <div className="player-cards">
        {selectedPlayers.map((player) => (
          <PlayerCard
            key={player._id}
            player={player}
            onChoiceChange={handleChoiceChange}
            selectedChoice={choices[player._id]}
          />
        ))}
      </div>
      <div className="submit-button-container">
        <button className="submit-button" onClick={submitChoices}>Submit Choices</button>
      </div>
    </div>
  );
};

export default KeepTradeCut;
