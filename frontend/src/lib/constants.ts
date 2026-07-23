// Shared frontend constants

export const MAX_PLAYERS = 4;
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 10;

// Movement budget per turn - NOT dice-based, fixed and constant across all
// classes/levels. Budget can be split across multiple directions in the
// same turn (e.g. right 2 + down 2 = 4 for a player character).
// See docs/WORK_BREAKDOWN.md Bagian A.2.
export const PLAYER_MOVEMENT_RANGE = 4;
export const ENEMY_MOVEMENT_RANGE = 6;
