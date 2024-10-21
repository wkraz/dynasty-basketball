// Function to calculate a player's ranking score
export function calculatePlayerScore(player) {
  // This is a simplified scoring algorithm
  // You should adjust the weights and factors based on your specific needs
  let score = 0;

  // Base score from player's value
  score += player.value;

  // Adjust score based on recent performance
  score += player.recentPerformance * 0.3;

  // Adjust score based on projected future performance
  score += player.projectedPerformance * 0.2;

  // Adjust score based on player's age (younger players might be valued higher in dynasty)
  score += (28 - player.age) * 10; // Assuming 28 is the peak age for basketball

  // Adjust score based on position scarcity
  score *= getPositionScarcityMultiplier(player.position);

  return Math.round(score);
}

// Function to get position scarcity multiplier
function getPositionScarcityMultiplier(position) {
  // This is a simplified version. You might want to adjust these values
  // based on actual position scarcity in your league format
  switch (position) {
    case 'PG': return 1.1;
    case 'SG': return 1.05;
    case 'SF': return 1.1;
    case 'PF': return 1.15;
    case 'C': return 1.2;
    case 'G': return 1.05;  // Slightly lower as it's more flexible
    case 'F': return 1.1;   // Slightly lower as it's more flexible
    case 'UTIL': return 1;  // No scarcity bonus for UTIL
    default: return 1;
  }
}

// Function to rank players
export function rankPlayers(players) {
  return players
    .map(player => ({
      ...player,
      score: calculatePlayerScore(player)
    }))
    .sort((a, b) => b.score - a.score);
}

