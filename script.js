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

// Memory Game Logic
const cards = document.querySelectorAll(".card");
let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;

function flipCard({target: clickedCard}) {
  if(cardOne !== clickedCard && !disableDeck) {
    clickedCard.classList.add("flip");
    if(!cardOne) {
      return cardOne = clickedCard;
    }
    cardTwo = clickedCard;
    disableDeck = true;
    let cardOneImg = cardOne.querySelector(".back-view img").src,
        cardTwoImg = cardTwo.querySelector(".back-view img").src;
    matchCards(cardOneImg, cardTwoImg);
  }
}

function matchCards(img1, img2) {
  if(img1 === img2) {
    matched++;
    if(matched == 8) {
      setTimeout(() => {
        return shuffleCard();
      }, 1000);
    }
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    cardOne = cardTwo = "";
    return disableDeck = false;
  }
  setTimeout(() => {
    cardOne.classList.add("shake");
    cardTwo.classList.add("shake");
  }, 400);

  setTimeout(() => {
    cardOne.classList.remove("shake", "flip");
    cardTwo.classList.remove("shake", "flip");
    cardOne = cardTwo = "";
    disableDeck = false;
  }, 1200);
}

function shuffleCard() {
  matched = 0;
  disableDeck = false;
  cardOne = cardTwo = "";
  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  arr.sort(() => Math.random() > 0.5 ? 1 : -1);
  cards.forEach((card, i) => {
    card.classList.remove("flip");
    let imgTag = card.querySelector(".back-view img");
    imgTag.src = `https://via.placeholder.com/45?text=img-${arr[i]}`;
    card.addEventListener("click", flipCard);
  });
}

shuffleCard();
cards.forEach(card => {
  card.addEventListener("click", flipCard);
});

// Drawing Canvas Logic
const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector("#size-slider");
const colorBtns = document.querySelectorAll(".colors .option");
const colorPicker = document.querySelector("#color-picker");
const clearCanvas = document.querySelector(".clear-canvas");
const saveImg = document.querySelector(".save-img");
const ctx = canvas ? canvas.getContext("2d") : null;

let prevMouseX, prevMouseY, snapshot,
    isDrawing = false,
    selectedTool = "brush",
    brushWidth = 5,
    selectedColor = "#000";

// Set canvas background to white
const setCanvasBackground = () => {
  if (ctx) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
  }
};

// Resize canvas dynamically
const resizeCanvas = () => {
  if (canvas && ctx) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
  }
};

// Initialize canvas on load and resize
window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

// Draw rectangle
const drawRect = (e) => {
  if (!ctx) return;
  const x = Math.min(e.offsetX, prevMouseX);
  const y = Math.min(e.offsetY, prevMouseY);
  const width = Math.abs(prevMouseX - e.offsetX);
  const height = Math.abs(prevMouseY - e.offsetY);
  if (!fillColor.checked) {
    ctx.strokeRect(x, y, width, height);
  } else {
    ctx.fillRect(x, y, width, height);
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

// Get mouse or touch coordinates
const getEventCoordinates = (e) => {
  if (e.type.includes("touch")) {
    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: e.touches[0].clientX - rect.left,
      offsetY: e.touches[0].clientY - rect.top
    };
  }
  return { offsetX: e.offsetX, offsetY: e.offsetY };
};

// Start drawing
const startDraw = (e) => {
  if (!ctx) return;
  e.preventDefault();
  isDrawing = true;
  const { offsetX, offsetY } = getEventCoordinates(e);
  prevMouseX = offsetX;
  prevMouseY = offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
  ctx.fillStyle = selectedColor;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

// Draw on canvas
const drawing = (e) => {
  if (!isDrawing || !ctx) return;
  e.preventDefault();
  ctx.putImageData(snapshot, 0, 0);
  const { offsetX, offsetY } = getEventCoordinates(e);

  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  } else if (selectedTool === "rectangle") {
    drawRect({ offsetX, offsetY });
  } else if (selectedTool === "circle") {
    drawCircle({ offsetX, offsetY });
  } else if (selectedTool === "triangle") {
    drawTriangle({ offsetX, offsetY });
  }
};

// Stop drawing
const stopDraw = (e) => {
  e.preventDefault();
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
sizeSlider.addEventListener("input", () => {
  brushWidth = sizeSlider.value;
});

// Color selection
colorBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".colors .option.selected")?.classList.remove("selected");
    btn.classList.add("selected");
    selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
  });
});

// Custom color picker
colorPicker.addEventListener("input", () => {
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
    link.href = canvas.toDataURL("image/jpeg");
    link.click();
  }
});

// Canvas event listeners for mouse and touch
if (canvas) {
  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", drawing);
  canvas.addEventListener("mouseup", stopDraw);
  canvas.addEventListener("mouseleave", stopDraw);
  canvas.addEventListener("touchstart", startDraw);
  canvas.addEventListener("touchmove", drawing);
  canvas.addEventListener("touchend", stopDraw);
}