import initSidebar from './sidebar.js';
import initTheme from './theme.js';
import initLayout from './layout.js';
import initDrawing from './components/drawing.js';
import initMemoryGame from './components/memoryGame.js';
import initProfileCard from './components/profileCard.js';

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initTheme();
  initLayout();
  initDrawing();
  initMemoryGame();
  initProfileCard();
});
