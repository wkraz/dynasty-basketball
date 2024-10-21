// Utility functions shared between client and server
function calculateExperienceForLevel(level) {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

function formatCurrency(amount) {
  return `${amount.toFixed(2)} gold`;
}

module.exports = {
  calculateExperienceForLevel,
  formatCurrency
};
