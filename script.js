// Since all cards are the same it's better to use a map
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

// Create cards with function so it's easier to produce more
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

// Render the cards on the game board
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

// Flip the card visually
function flipCard(id) {
  const card = document.querySelector(`#card-${id}`);
  card.classList.toggle("flipped");
}

// Handle card click logic
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

// Initialize the game
function initializeGame() {
  cards = createCards(6); // 6 pairs of cards
  // Could be an input so the player can choose
  renderCards(cards);
}

let cards = [];
let queue = [];
let isProcessing = false;
let totalMoves = 0;
let timerInterval;
let gameStarted = false;

initializeGame();
