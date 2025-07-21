// ============================================
// 🔧 Element Selectors
// ============================================
const sidebarToggleButtons = document.querySelectorAll(".sidebar-toggle");
const sidebar = document.querySelector(".sidebar");
const searchForm = document.querySelector(".search-form");
const themeToggleButton = document.querySelector(".theme-toggle");
const themeIcon = themeToggleButton?.querySelector(".theme-icon");
const menuLinks = document.querySelectorAll(".menu-link");
const contentSections = document.querySelectorAll(".content-section");
const canvas = document.querySelector("canvas");

if (!sidebar || !themeToggleButton || !canvas) {
  console.error("Essential elements are missing from the DOM.");
}

// ============================================
// 🌙 Theme Management
// ============================================
function updateThemeIcon() {
  const isDark = document.body.classList.contains("dark-theme");
  if (sidebar.classList.contains("collapsed")) {
    themeIcon.textContent = isDark ? "light_mode" : "dark_mode";
  } else {
    themeIcon.textContent = "dark_mode";
  }
}

function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const useDark = savedTheme === "dark" || (!savedTheme && prefersDark);
  document.body.classList.toggle("dark-theme", useDark);
  updateThemeIcon();
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcon();
}

// ============================================
// 📁 Sidebar and Menu Logic
// ============================================
function toggleSidebar() {
  sidebar.classList.toggle("collapsed");
  updateThemeIcon();
}

function expandSidebarOnSearch() {
  if (sidebar.classList.contains("collapsed")) {
    sidebar.classList.remove("collapsed");
    searchForm.querySelector("input")?.focus();
  }
}

function handleMenuClick(event, link) {
  event.preventDefault();

  menuLinks.forEach(l => l.classList.remove("active"));
  link.classList.add("active");

  const targetId = link.getAttribute("data-section");
  contentSections.forEach(section => section.style.display = "none");

  const targetSection = document.getElementById(targetId);
  if (targetSection) targetSection.style.display = "block";

  if (window.innerWidth <= 768) {
    sidebar.classList.add("collapsed");
  }
}

// ============================================
// 🎴 Memory Card Game
// ============================================
function initializeMemoryGame() {
  const cards = document.querySelectorAll(".card");
  let flipped = false;
  let firstCard, secondCard;
  let locked = false;
  let matches = 0;
  const totalPairs = cards.length / 2;

  function shuffle() {
    const arr = Array.from(cards);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      arr[i].parentNode.insertBefore(arr[j], arr[i]);
    }
  }

  function flipCard() {
    if (locked || this === firstCard) return;
    this.classList.add("flip");

    if (!flipped) {
      flipped = true;
      firstCard = this;
      return;
    }

    flipped = false;
    secondCard = this;

    checkMatch();
  }

  function checkMatch() {
    if (firstCard.dataset.id === secondCard.dataset.id) {
      matches++;
      disableCards();
      if (matches === totalPairs) setTimeout(resetGame, 1000);
    } else {
      applyShakeEffect();
    }
  }

  function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    resetState();
  }

  function applyShakeEffect() {
    firstCard.classList.add("shake");
    secondCard.classList.add("shake");

    setTimeout(() => {
      firstCard.classList.remove("flip", "shake");
      secondCard.classList.remove("flip", "shake");
      resetState();
    }, 1000);
  }

  function resetState() {
    [flipped, locked] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  function resetGame() {
    cards.forEach(card => {
      card.classList.remove("flip");
      card.addEventListener("click", flipCard);
    });
    matches = 0;
    shuffle();
  }

  shuffle();
  cards.forEach(card => card.addEventListener("click", flipCard));
  document.getElementById("memory").style.display = "block";
}

// ============================================
// 🎨 Canvas Drawing App
// ============================================
function initializeCanvasDrawing() {
  const ctx = canvas.getContext("2d");

  const toolButtons = document.querySelectorAll(".tool");
  const fillCheckbox = document.querySelector("#fill-color");
  const sizeSlider = document.querySelector("#size-slider");
  const colorOptions = document.querySelectorAll(".colors .option");
  const colorPicker = document.querySelector("#color-picker");
  const clearButton = document.querySelector(".clear-canvas");
  const saveButton = document.querySelector(".save-img");9

  let drawing = false;
  let brushSize = 5;
  let selectedTool = "brush";
  let selectedColor = "#000";
  let prevX, prevY, snapshot;

  function setCanvasBackground() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
  }

  function startDraw(event) {
    drawing = true;
    [prevX, prevY] = [event.offsetX, event.offsetY];
    ctx.beginPath();
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  function draw(event) {
    if (!drawing) return;
    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === "brush" || selectedTool === "eraser") {
      ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();
    } else if (selectedTool === "rectangle") {
      drawRectangle(event);
    } else if (selectedTool === "circle") {
      drawCircle(event);
    } else if (selectedTool === "triangle") {
      drawTriangle(event);
    }
  }

  function drawRectangle(e) {
    const [x, y] = [e.offsetX, e.offsetY];
    const width = prevX - x;
    const height = prevY - y;
    fillCheckbox.checked ? ctx.fillRect(x, y, width, height) : ctx.strokeRect(x, y, width, height);
  }

  function drawCircle(e) {
    const radius = Math.hypot(prevX - e.offsetX, prevY - e.offsetY);
    ctx.beginPath();
    ctx.arc(prevX, prevY, radius, 0, 2 * Math.PI);
    fillCheckbox.checked ? ctx.fill() : ctx.stroke();
  }

  function drawTriangle(e) {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillCheckbox.checked ? ctx.fill() : ctx.stroke();
  }

  function clearCanvasArea() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
  }

  function saveImage() {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
  }

  // Events
  toolButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".options .active").classList.remove("active");
      btn.classList.add("active");
      selectedTool = btn.id;
    });
  });

  colorOptions.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".options .selected").classList.remove("selected");
      btn.classList.add("selected");
      selectedColor = getComputedStyle(btn).backgroundColor;
    });
  });

  colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
  });

  sizeSlider.addEventListener("change", () => brushSize = sizeSlider.value);
  clearButton.addEventListener("click", clearCanvasArea);
  saveButton.addEventListener("click", saveImage);

  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", () => (drawing = false));

  window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
  });
}

// ============================================
// 🚀 Initialization
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();

  themeToggleButton.addEventListener("click", toggleTheme);
  sidebarToggleButtons.forEach(btn => btn.addEventListener("click", toggleSidebar));
  searchForm.addEventListener("click", expandSidebarOnSearch);

  if (window.innerWidth > 768) {
    sidebar.classList.remove("collapsed");
  }

  menuLinks.forEach(link =>
    link.addEventListener("click", (e) => handleMenuClick(e, link))
  );

  initializeMemoryGame();
  initializeCanvasDrawing();

  // Init Swiper
  new Swiper(".card-wrapper", {
    loop: true,
    spaceBetween: 30,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });
});

// ============================================
// 📱 Responsive Adjustments
const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue = document.querySelector(".filter-info .value"),
filterSlider = document.querySelector(".slider input"),
rotateOptions = document.querySelectorAll(".rotate button"),
previewImg = document.querySelector(".preview-img img"),
resetFilterBtn = document.querySelector(".reset-filter"),
chooseImgBtn = document.querySelector(".choose-img"),
saveImgBtn = document.querySelector(".save-img");

let brightness = "100", saturation = "100", inversion = "0", grayscale = "0";
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const loadImage = () => {
    let file = fileInput.files[0];
    if(!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click();
        document.querySelector(".container").classList.remove("disable");
    });
}

const applyFilter = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if(option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if(option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`
        } else if(option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");

    if(selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if(selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if(selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    applyFilter();
}

rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if(option.id === "left") {
            rotate -= 90;
        } else if(option.id === "right") {
            rotate += 90;
        } else if(option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilter();
    });
});

const resetFilter = () => {
    brightness = "100"; saturation = "100"; inversion = "0"; grayscale = "0";
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click();
    applyFilter();
}

const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if(rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());