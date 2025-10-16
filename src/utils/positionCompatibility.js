/**
 * Position Compatibility Utility
 * Determines which players can play in which positions
 */

export const POSITION_COMPATIBILITY = {
  // Goalkeepers
  'GK': ['GK'],
  
  // Defenders
  'LB': ['LB', 'LWB'],
  'CB': ['CB', 'LCB', 'RCB'],
  'CB1': ['CB', 'LCB', 'RCB'],
  'CB2': ['CB', 'LCB', 'RCB'],
  'RB': ['RB', 'RWB'],
  'LCB': ['CB', 'LCB'],
  'RCB': ['CB', 'RCB'],
  'LWB': ['LB', 'LWB', 'LM'],
  'RWB': ['RB', 'RWB', 'RM'],
  
  // Midfielders
  'CDM': ['CDM', 'CM'],
  'CM': ['CM', 'CDM', 'CAM'],
  'LCM': ['CM', 'CDM', 'LM', 'CAM'],
  'RCM': ['CM', 'CDM', 'RM', 'CAM'],
  'LCDM': ['CDM', 'CM', 'LCM'],
  'RCDM': ['CDM', 'CM', 'RCM'],
  'CAM': ['CAM', 'CM'],
  'LAM': ['CAM', 'LM', 'LW'],
  'RAM': ['CAM', 'RM', 'RW'],
  'LM': ['LM', 'LW', 'LCM'],
  'RM': ['RM', 'RW', 'RCM'],
  
  // Forwards
  'LW': ['LW', 'LM', 'ST'],
  'RW': ['RW', 'RM', 'ST'],
  'ST': ['ST', 'CF'],
  'LST': ['ST', 'LW', 'CF'],
  'RST': ['ST', 'RW', 'CF'],
  'CF': ['CF', 'ST', 'CAM']
};

/**
 * Check if a player can play in a specific slot
 * @param {string} playerPosition - Player's natural position (e.g., 'CM')
 * @param {string} slotPosition - The position slot (e.g., 'LCM')
 * @returns {boolean} - Whether the player can play in that slot
 */
export const canPlayInPosition = (playerPosition, slotPosition) => {
  if (!playerPosition || !slotPosition) return false;
  
  const compatiblePositions = POSITION_COMPATIBILITY[slotPosition];
  if (!compatiblePositions) return false;
  
  return compatiblePositions.includes(playerPosition);
};

/**
 * Get all players that can play in a specific position
 * @param {Array} allPlayers - Array of all available players
 * @param {string} slotPosition - The position slot
 * @param {Object} currentSquad - Currently selected players {slotId: player}
 * @returns {Array} - Filtered players who can play in that position and aren't already selected
 */
export const getAvailablePlayersForPosition = (allPlayers, slotPosition, currentSquad = {}) => {
  // Get IDs of players already in the squad
  const selectedPlayerIds = Object.values(currentSquad)
    .filter(player => player !== null && player !== undefined)
    .map(player => player.id);
  
  return allPlayers.filter(player => {
    // Check if player is not already selected
    const isNotSelected = !selectedPlayerIds.includes(player.id);
    
    // Check if player can play in this position
    const canPlay = canPlayInPosition(player.position, slotPosition);
    
    return isNotSelected && canPlay;
  });
};

/**
 * Get position category for grouping
 * @param {string} position - Position code
 * @returns {string} - Category ('GK', 'DEF', 'MID', 'FWD')
 */
export const getPositionCategory = (position) => {
  if (position === 'GK') return 'GK';
  
  const defenders = ['LB', 'CB', 'RB', 'LCB', 'RCB', 'LWB', 'RWB', 'CB1', 'CB2'];
  const midfielders = ['CDM', 'CM', 'CAM', 'LM', 'RM', 'LCM', 'RCM', 'LCDM', 'RCDM', 'LAM', 'RAM'];
  const forwards = ['LW', 'RW', 'ST', 'CF', 'LST', 'RST'];
  
  if (defenders.includes(position)) return 'DEF';
  if (midfielders.includes(position)) return 'MID';
  if (forwards.includes(position)) return 'FWD';
  
  return 'UNKNOWN';
};

export default {
  POSITION_COMPATIBILITY,
  canPlayInPosition,
  getAvailablePlayersForPosition,
  getPositionCategory
};

