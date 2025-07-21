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
export default function initSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const toggleBtns = document.querySelectorAll(".sidebar-toggle");
  const SIDEBAR_KEY = "sidebar-collapsed";

  if (localStorage.getItem(SIDEBAR_KEY) === "true") {
    sidebar.classList.add("collapsed");
  }

  toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      localStorage.setItem(SIDEBAR_KEY, sidebar.classList.contains("collapsed"));
    });
  });
}
export default function initTheme() {
  const body = document.body;
  const themeToggle = document.querySelector(".theme-toggle");
  const THEME_KEY = "preferred-theme";

  if (localStorage.getItem(THEME_KEY) === "dark") {
    body.classList.add("dark-theme");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-theme");
      const newTheme = body.classList.contains("dark-theme") ? "dark" : "light";
      localStorage.setItem(THEME_KEY, newTheme);
    });
  }
}
