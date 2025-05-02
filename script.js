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
  { id: 10, icon: "🎉", matched: false },
  { id: 11, icon: "🎉", matched: false },
  { id: 12, icon: "🧠", matched: false },
  { id: 13, icon: "🧠", matched: false },
  { id: 14, icon: "⚡", matched: false },
  { id: 15, icon: "⚡", matched: false },
  { id: 16, icon: "🧩", matched: false },
  { id: 17, icon: "🧩", matched: false },
];

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

let stack = [];

function handleCardClick(id) {
  flipCard(id);
  const card = cards.find((card) => card.id === id);
  stack.push(card);

  if (stack.length > 2) {
    if (stack[0].icon === stack[1].icon) {
      stack[0].matched = true;
      stack[1].matched = true;
    }
    setTimeout(() => {
      flipCard(stack[0].id);
      flipCard(stack[1].id);
      stack.splice(0, 2);
    }, 200);
  }

  console.log(stack);
}
function flipCard(id) {
  const cardObj = cards.find((card) => card.id === id);
    if (cardObj.matched) return;
  const card = document.querySelector(`#card-${id}`);
  card.classList.toggle("flipped");
}

renderCards(cards);
