// Card class definition
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

// Card utility functions
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

// Here is the export to use in other files
export { Card, createCards, shuffleCards };
