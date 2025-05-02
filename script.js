const cards = [
  { id: 0, icon: "💡", matched: false },
  { id: 1, icon: "💡", matched: false },
  { id: 2, icon: "🔥", matched: false },
  { id: 3, icon: "🔥", matched: false },
  { id: 4, icon: "🌟", matched: false },
  { id: 5, icon: "🌟", matched: false },
  { id: 6, icon: "🎯", matched: false },
  { id: 7, icon: "🎯", matched: false },
  { id: 8, icon: "🚀", matched: false },
  { id: 9, icon: "🚀", matched: false },
  // { id: 10, icon: "🎉", matched: false },
  // { id: 11, icon: "🎉", matched: false },
  // { id: 12, icon: "🧠", matched: false },
  // { id: 13, icon: "🧠", matched: false },
  // { id: 14, icon: "⚡", matched: false },
  // { id: 15, icon: "⚡", matched: false },
  // { id: 16, icon: "🧩", matched: false },
  // { id: 17, icon: "🧩", matched: false },
];

let totalMoves = 0;
let queue = [];

function renderCards(cards) {
  const cardList = document.querySelector(".card-list");
  let sum = "";
  cards.forEach((card) => {
    sum += `<li class="card" id="card-${card.id}" onclick="handleCardClick(${card.id})">
                <div class="card-inner">
                  <div class="card-front">❓</div>
                  <div class="card-back">${card.icon}</div>
                </div>
              </li>`;
  });

  cardList.innerHTML = sum;
}

function handleCardClick(id) {
  const card = cards.find((card) => card.id === id);

  // Prevent clicking already matched or already flipped cards
  if (card.matched || queue.includes(card)) return;

  flipCard(id);
  queue.push(card);

  if (queue.length === 2) {
    totalMoves++;
    document.querySelector(".total-moves").textContent = totalMoves;

    if (queue[0].icon === queue[1].icon) {
      queue[0].matched = true;
      queue[1].matched = true;
      queue = [];

      // Delay evaluate slightly to allow flip animation to finish
      setTimeout(() => evaluate(), 300);
    } else {
      setTimeout(() => {
        flipCard(queue[0].id);
        flipCard(queue[1].id);
        queue = [];
      }, 500);
    }
  }
}

function flipCard(id) {
  const cardObj = cards.find((card) => card.id === id);
  if (cardObj.matched) return;
  totalMoves++;
  document.querySelector(".total-moves").textContent = totalMoves;
  const card = document.querySelector(`#card-${id}`);
  card.classList.toggle("flipped");
}

function evaluate() {
  const matchedCards = cards.filter((card) => card.matched);
  if (matchedCards.length === cards.length) {
    document.querySelector(".win-screen").style.zIndex = "1";
  }
}

renderCards(cards);
