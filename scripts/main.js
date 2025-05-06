import { initializeTheme } from "./theme.js";
import { initializeGame } from "./game.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();

  // Initialize game by default 6 pairs
  initializeGame(6);
});
