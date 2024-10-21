// Function to randomly select three players for the Keep/Trade/Cut game
export function selectPlayersForGame(players) {
  if (players.length < 3) {
    throw new Error('Not enough players to select from');
  }

  let selectedPlayers = [];
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loop

  while (selectedPlayers.length < 3 && attempts < maxAttempts) {
    const randomIndex = Math.floor(Math.random() * players.length);
    const player = players[randomIndex];

    // Check if the player is already selected
    if (!selectedPlayers.includes(player)) {
      // Ensure we don't select all players from the same position group
      if (selectedPlayers.length < 2 || !allSamePositionGroup(selectedPlayers, player)) {
        selectedPlayers.push(player);
      }
    }

    attempts++;
  }

  if (selectedPlayers.length < 3) {
    throw new Error('Could not select 3 valid players');
  }

  return selectedPlayers;
}

// Helper function to check if all players are from the same position group
function allSamePositionGroup(selectedPlayers, newPlayer) {
  const positionGroups = [
    ['PG', 'SG', 'G'],
    ['SF', 'PF', 'F'],
    ['C']
  ];

  const getGroup = (pos) => positionGroups.findIndex(group => group.includes(pos));

  const selectedGroups = selectedPlayers.map(p => getGroup(p.position));
  const newGroup = getGroup(newPlayer.position);

  return selectedGroups.every(group => group === newGroup);
}

// Function to get a new set of players, excluding previously selected ones
export function getNewPlayerSet(allPlayers, previouslySelected) {
  return allPlayers.filter(player => !previouslySelected.includes(player));
}

// Function to select players with a good mix of values
export function selectBalancedPlayerSet(players, count = 3) {
  if (players.length < count) {
    throw new Error('Not enough players to select from');
  }

  // Sort players by value
  const sortedPlayers = [...players].sort((a, b) => b.value - a.value);

  const selectedPlayers = [];
  const segments = 3; // Top, middle, and bottom tier

  for (let i = 0; i < count; i++) {
    const segmentSize = Math.ceil(sortedPlayers.length / segments);
    const segmentIndex = i % segments;
    const startIndex = segmentIndex * segmentSize;
    const endIndex = Math.min(startIndex + segmentSize, sortedPlayers.length);

    const segmentPlayers = sortedPlayers.slice(startIndex, endIndex);
    const randomIndex = Math.floor(Math.random() * segmentPlayers.length);
    const selectedPlayer = segmentPlayers[randomIndex];

    selectedPlayers.push(selectedPlayer);
    sortedPlayers.splice(sortedPlayers.indexOf(selectedPlayer), 1);
  }

  return selectedPlayers;
}
