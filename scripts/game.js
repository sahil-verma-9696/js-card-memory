import { createCards } from "./card.js";

// Game starting variables
let cards = [];
let queue = [];
let isProcessing = false;
let totalMoves = 0;
let timerInterval;
let gameStarted = false;

// Game logic
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

function flipCard(id) {
  const card = document.querySelector(`#card-${id}`);
  card.classList.toggle("flipped");
}

function handleCardClick(id) {
  const card = cards.find((card) => card.id === id);

  // Start the timer on first card click
  if (!gameStarted) {
    gameStarted = true;
    startTimer();
  }

  // Ignore clicks on matched cards or already flipped cards
  if (isProcessing || card.matched || queue.includes(card)) return;

  flipCard(id);
  queue.push(card);

  if (queue.length === 2) {
    isProcessing = true;
    totalMoves++;
    document.querySelector(".total-moves").textContent = totalMoves;

    if (queue[0].icon === queue[1].icon) {
      // Mark cards as matched
      queue[0].match();
      queue[1].match();
      queue = [];

      // Check for victory
      setTimeout(() => {
        if (cards.every((card) => card.matched)) {
          clearInterval(timerInterval); // Stop the timer
          document.querySelector(".win-screen").style.zIndex = "1";
        }
        isProcessing = false;
      }, 300);
    } else {
      // Flip cards back if they don't match
      setTimeout(() => {
        flipCard(queue[0].id);
        flipCard(queue[1].id);
        queue = [];
        isProcessing = false;
      }, 800);
    }
  }
}

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

function initializeGame(pairCount = 6) {
  // Reset game state
  cards = [];
  queue = [];
  isProcessing = false;
  totalMoves = 0;
  gameStarted = false;
  if (timerInterval) clearInterval(timerInterval);

  // Reset UI
  document.querySelector(".timer").textContent = "00 : 00";
  document.querySelector(".total-moves").textContent = "0";
  document.querySelector(".win-screen").style.zIndex = "-1";

  // Create and render cards
  cards = createCards(pairCount);
  renderCards(cards);
}

export { initializeGame };
