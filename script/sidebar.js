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
