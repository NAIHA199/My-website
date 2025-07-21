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
