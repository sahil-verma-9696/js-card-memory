// Sound Effects
const flipSound = new Audio("flip.mp3");
const matchSound = new Audio("match.mp3");
const winSound = new Audio("win.mp3");

flipSound.load();
matchSound.load();
winSound.load();

// Card class
class Card {
  constructor(id, icon) {
    this.id = id;
    this.icon = icon;
    this.matched = false;
  }

  match() {
    this.matched = true;
  }

  reset() {
    this.matched = false;
  }
}

// Theme Toggle
const toggleBtn = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme") || "light";

// Set initial theme
document.body.classList.add(`${savedTheme}-mode`);
toggleBtn.innerText = savedTheme === "dark" ? "Light Mode" : "Dark Mode";

// Toggle Theme
toggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark-mode");

  document.body.classList.toggle("dark-mode", !isDark);
  document.body.classList.toggle("light-mode", isDark);

  const newTheme = isDark ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  toggleBtn.innerText = newTheme === "dark" ? "Light Mode" : "Dark Mode";
});

// Create cards
function createCards(number) {
  const icons = ["💡", "🔥", "🌟", "🎯", "🚀", "🎉", "🧠", "⚡", "🧩"];
  const cards = [];
  let id = 0;

  if (number > icons.length) {
    console.error("Not enough icons available. Maximum pairs: " + icons.length);
    return [];
  }

  const gameIcons = icons.slice(0, number);
  gameIcons.forEach((icon) => {
    cards.push(new Card(id++, icon));
    cards.push(new Card(id++, icon));
  });

  return shuffleCards(cards);
}

function shuffleCards(cards) {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

// Render cards
function renderCards(cards) {
  const cardList = document.querySelector(".card-list");
  cardList.innerHTML = "";

  cards.forEach((card) => {
    const cardElement = document.createElement("li");
    cardElement.className = "card";
    cardElement.id = `card-${card.id}`;

    cardElement.innerHTML = `
      <div class="card-inner">
        <div class="card-front">❓</div>
        <div class="card-back">${card.icon}</div>
      </div>
    `;

    cardElement.addEventListener("click", () => handleCardClick(card.id));
    cardList.appendChild(cardElement);
  });
}

// Flip card
function flipCard(id) {
  const card = document.querySelector(`#card-${id}`);
  card.classList.toggle("flipped");

  // Play flip sound
  flipSound.currentTime = 0;
  flipSound.play();
}

// Handle click logic
function handleCardClick(id) {
  const card = cards.find((card) => card.id === id);

  if (!gameStarted) {
    gameStarted = true;
    startTimer();
  }

  if (isProcessing || card.matched || queue.includes(card)) return;

  flipCard(id);
  queue.push(card);

  if (queue.length === 2) {
    isProcessing = true;
    totalMoves++;
    document.querySelector(".total-moves").textContent = totalMoves;

    if (queue[0].icon === queue[1].icon) {
      queue[0].match();
      queue[1].match();

      // Play match sound
      matchSound.currentTime = 0;
      matchSound.play();

      queue = [];

      setTimeout(() => {
        if (cards.every((card) => card.matched)) {
          clearInterval(timerInterval);
          document.querySelector(".win-screen").style.zIndex = "1";

          // Play win sound
          winSound.currentTime = 0;
          winSound.play();
        }
        isProcessing = false;
      }, 300);
    } else {
      setTimeout(() => {
        flipCard(queue[0].id);
        flipCard(queue[1].id);
        queue = [];
        isProcessing = false;
      }, 800);
    }
  }
}

// Timer logic
function startTimer() {
  let seconds = 0;
  const timerElement = document.querySelector(".timer");

  timerInterval = setInterval(() => {
    seconds++;
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    timerElement.textContent = `${mins} : ${secs}`;
  }, 1000);
}

// Initialize game
function initializeGame() {
  cards = createCards(6);
  renderCards(cards);
}

let cards = [];
let queue = [];
let isProcessing = false;
let totalMoves = 0;
let timerInterval;
let gameStarted = false;

initializeGame();
