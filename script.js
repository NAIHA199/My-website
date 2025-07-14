/* Select DOM elements for sidebar, search, theme toggle, and menu links */
const sidebarToggleBtns = document.querySelectorAll(".sidebar-toggle");
const sidebar = document.querySelector(".sidebar");
const searchForm = document.querySelector(".search-form");
const themeToggleBtn = document.querySelector(".theme-toggle");
const themeIcon = themeToggleBtn.querySelector(".theme-icon");
const menuLinks = document.querySelectorAll(".menu-link");
const contentSections = document.querySelectorAll(".content-section");

// Updates the theme icon based on current theme and sidebar state
const updateThemeIcon = () => {
  const isDark = document.body.classList.contains("dark-theme");
  themeIcon.textContent = sidebar.classList.contains("collapsed") ? (isDark ? "light_mode" : "dark_mode") : "dark_mode";
};

// Apply dark theme if saved or system prefers, then update icon
const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const shouldUseDarkTheme = savedTheme === "dark" || (!savedTheme && systemPrefersDark);

document.body.classList.toggle("dark-theme", shouldUseDarkTheme);
updateThemeIcon();

// Toggle between themes on theme button click
themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcon();
});

// Toggle sidebar collapsed state on buttons click
sidebarToggleBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    updateThemeIcon();
  });
});

// Expand the sidebar when the search form is clicked
searchForm.addEventListener("click", () => {
  if (sidebar.classList.contains("collapsed")) {
    sidebar.classList.remove("collapsed");
    searchForm.querySelector("input").focus();
  }
});

// Expand sidebar by default on large screens
if (window.innerWidth > 768) sidebar.classList.remove("collapsed");

// Toggle content sections based on menu link clicks
menuLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    // Remove active class from all links
    menuLinks.forEach(l => l.classList.remove("active"));
    // Add active class to clicked link
    link.classList.add("active");
    // Hide all sections
    contentSections.forEach(section => section.style.display = "none");
    // Show the selected section
    const sectionId = link.getAttribute("data-section");
    document.getElementById(sectionId).style.display = "block";
    // Close sidebar on mobile after selection
    if (window.innerWidth <= 768) {
      sidebar.classList.add("collapsed");
    }
  });
});

// Swiper Initialization for Card Slider
new Swiper('.card-wrapper', {
  loop: true,
  spaceBetween: 30,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  let hasFlippedCard = false;
  let firstCard, secondCard;
  let lockBoard = false;
  let matchedPairs = 0;
  const totalPairs = cards.length / 2;

  // Hàm xáo trộn thẻ
  function shuffleCards() {
    const cardsArray = Array.from(cards);
    for (let i = cardsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      cardsArray[i].parentNode.insertBefore(cardsArray[j], cardsArray[i]);
    }
  }

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    hasFlippedCard = false;
    secondCard = this;
    checkForMatch();
  }

  function checkForMatch() {
    if (firstCard.dataset.id === secondCard.dataset.id) {
      matchedPairs++;
      disableCards();
      if (matchedPairs === totalPairs) {
        setTimeout(resetGame, 1000); // Chờ 1 giây trước khi reset
      }
      return;
    }
    shakeCards(); // Thêm hiệu ứng rung khi chọn sai
  }

  function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
  }

  function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');
      resetBoard();
    }, 1000);
  }

  function shakeCards() {
    firstCard.classList.add('shake');
    secondCard.classList.add('shake');
    unflipCards();
    setTimeout(() => {
      firstCard.classList.remove('shake');
      secondCard.classList.remove('shake');
    }, 1000); // Loại bỏ hiệu ứng rung sau 1 giây
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  function resetGame() {
    cards.forEach(card => {
      card.classList.remove('flip');
      card.addEventListener('click', flipCard);
    });
    matchedPairs = 0;
    shuffleCards();
  }

  // Xáo trộn thẻ khi tải và thêm sự kiện click
  shuffleCards();
  cards.forEach(card => card.addEventListener('click', flipCard));

  // Hiển thị section Memory Game
  document.getElementById('memory').style.display = 'block';
});

const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector("#size-slider");
const colorBtns = document.querySelectorAll(".colors .option");
const colorPicker = document.querySelector("#color-picker");
const clearCanvas = document.querySelector(".clear-canvas");
const saveImg = document.querySelector(".save-img");
const ctx = canvas ? canvas.getContext("2d") : null;

// Global variables with default values
let prevMouseX, prevMouseY, snapshot,
    isDrawing = false,
    selectedTool = "brush",
    brushWidth = 5,
    selectedColor = "#000";

// Set canvas background to white
const setCanvasBackground = () => {
    if (!ctx) return;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // Reset fill style to selected color
};

// Initialize canvas on load
window.addEventListener("load", () => {
    if (!canvas || !ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

// Draw rectangle
const drawRect = (e) => {
    if (!ctx) return;
    const width = prevMouseX - e.offsetX;
    const height = prevMouseY - e.offsetY;
    if (!fillColor.checked) {
        ctx.strokeRect(e.offsetX, e.offsetY, width, height);
    } else {
        ctx.fillRect(e.offsetX, e.offsetY, width, height);
    }
};

// Draw circle
const drawCircle = (e) => {
    if (!ctx) return;
    ctx.beginPath();
    const radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
};

// Draw triangle
const drawTriangle = (e) => {
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
};

// Start drawing
const startDraw = (e) => {
    if (!ctx) return;
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

// Draw on canvas
const drawing = (e) => {
    if (!isDrawing || !ctx) return;
    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    } else if (selectedTool === "circle") {
        drawCircle(e);
    } else if (selectedTool === "triangle") {
        drawTriangle(e);
    }
};

// Stop drawing
const stopDraw = () => {
    isDrawing = false;
    if (ctx) ctx.beginPath();
};

// Tool selection
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active")?.classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

// Brush size adjustment
sizeSlider.addEventListener("change", () => {
    brushWidth = sizeSlider.value;
});

// Color selection
colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected")?.classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

// Custom color picker
colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

// Clear canvas
clearCanvas.addEventListener("click", () => {
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setCanvasBackground();
    }
});

// Save canvas as image
saveImg.addEventListener("click", () => {
    if (canvas) {
        const link = document.createElement("a");
        link.download = `${Date.now()}.jpg`;
        link.href = canvas.toDataURL();
        link.click();
    }
});

// Canvas event listeners
if (canvas) {
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", drawing);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mouseout", stopDraw); // Thêm event khi chuột ra khỏi canvas
}