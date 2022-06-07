const getRandomIndex = (num) => {
  return Math.floor(Math.random() * (num + 1));
};

const createDeck = () => {
  const deck = [];
  const suits = ["hearts", "diamonds", "spades", "clubs"];

  suits.forEach((suit) => {
    for (let rank = 0; rank <= 13; rank++) {
      let cardName = rank;
      if (cardName === 1) {
        cardName = "ace";
      } else if (cardName === 11) {
        cardName = "jack";
      } else if (cardName === 12) {
        cardName = "queen";
      } else if (cardName === 13) {
        cardName = "king";
      }

      const card = {
        name: cardName,
        suit: suit,
        rank,
      };

      deck.push(card);
    }
  });

  return deck;
};

const shuffleDeck = (deck) => {
  for (let currentIndex = 0; currentIndex < deck.length; currentIndex++) {
    const randomIndex = getRandomIndex(deck.length);
    const currentItem = deck[currentIndex];
    const randomItem = deck[randomIndex];

    deck[currentIndex] = randomItem;
    deck[randomIndex] = currentItem;
  }

  return deck;
};
