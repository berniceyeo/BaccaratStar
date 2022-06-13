const checkPoints = (hand) => {
  let points = 0;
  //check if the user has taken a card
  if (hand.length === 2) {
    const sum = hand[0] + hand[1];
    const stringPoints = String(sum).slice[-1];
    points = Number(stringPoints);
  }
};
