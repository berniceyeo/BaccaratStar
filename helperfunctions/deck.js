const getRandomIndex = (num) => {
  return Math.floor(Math.random() * num);
};

export const createDeck = () => {
  const deck = [];
  const suits = ["hearts", "diamonds", "spades", "clubs"];

  suits.forEach((suit) => {
    for (let rank = 1; rank <= 13; rank++) {
      let cardName = rank;
      let points = rank;

      if (cardName === 1) {
        cardName = "ace";
      } else if (cardName === 11) {
        cardName = "jack";
        points = 10;
      } else if (cardName === 12) {
        cardName = "queen";
        points = 10;
      } else if (cardName === 13) {
        cardName = "king";
        points = 10;
      }

      const card = {
        name: cardName,
        suit: suit,
        rank,
        points,
        pic: `/images/${cardName}_of_${suit}.png`,
      };

      deck.push(card);
    }
  });

  return deck;
};

export const shuffleDeck = (deck) => {
  for (let currentIndex = 0; currentIndex < deck.length; currentIndex++) {
    const randomIndex = getRandomIndex(deck.length);

    const currentItem = deck[currentIndex];
    const randomItem = deck[randomIndex];

    deck[currentIndex] = randomItem;
    deck[randomIndex] = currentItem;
  }

  return deck;
};
