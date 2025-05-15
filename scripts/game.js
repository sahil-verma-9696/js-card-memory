import { createCards } from "./card.js";
import { flipSound, matchSound, winSound } from "./sound.js";

// Game starting variables
let cards = [];
let queue = [];
let isProcessing = false;
let totalMoves = 0;
let timerInterval;
let gameStarted = false;
let streak = 0;

// Game logic
function renderCards(cards) {
  const cardList = document.querySelector(".card-list");
  cardList.innerHTML = "";

  cards.forEach((card) => {
    const cardElement = document.createElement("li");
    cardElement.id = `card-${card.id}`;
    cardElement.className = "card group cursor-pointer [perspective:1000px]";
    cardElement.innerHTML = `
  <div class="card-inner relative w-[100px] h-[100px] transition-transform duration-500 ease-in-out [transform-style:preserve-3d] group-[.flipped]:[transform:rotateY(180deg)]">
    <div class="card-front absolute w-full h-full bg-slate-200 rounded-lg flex items-center justify-center text-2xl shadow-md [backface-visibility:hidden]">❓</div>
    <div class="card-back absolute w-full h-full bg-teal-500 text-white rounded-lg flex items-center justify-center text-2xl shadow-md [transform:rotateY(180deg)] [backface-visibility:hidden]">${card.icon}</div>
  </div>
`;

    cardElement.addEventListener("click", () => handleCardClick(card.id));
    cardList.appendChild(cardElement);
  });
}

function flipCard(id) {
  const card = document.querySelector(`#card-${id}`);
  card.classList.toggle("flipped");

  // Play flip sound
  flipSound.currentTime = 0;
  flipSound.play();
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

      // Play match sound
      matchSound.currentTime = 0;
      matchSound.play();
      streak++;
      document.querySelector(".Streak-meter").textContent = streak;

      queue = [];

      // Check for victory
      setTimeout(() => {
        if (cards.every((card) => card.matched)) {
          clearInterval(timerInterval); // Stop the timer
          document.querySelector(".win-screen").style.zIndex = "1";

          // Play win sound
          winSound.currentTime = 0;
          winSound.play();
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
      // Reset streak
      streak = 0;
      document.querySelector(".Streak-meter").textContent = streak;
    }
  }

  if (cards.every((card) => card.matched)) {
    clearInterval(timerInterval);
    winSound.currentTime = 0;
    winSound.play();
    showWinnerAnimation(); // NEW function
  }

  function showWinnerAnimation() {
    const winner = document.getElementById("winner");
    winner.style.visibility = "visible";

    // Fade in winner screen
    gsap.to(winner, {
      opacity: 1,
      duration: 1,
      ease: "power2.out",
      onComplete: launchConfetti,
    });

    // Animate text
    gsap.from(".winner-text", {
      scale: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.4)",
      delay: 0.2,
    });
  }

  function launchConfetti() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 3000,
    };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
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

function initializeGame(pairCount = 2) {
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
