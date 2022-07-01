//global variables
const WIN = "Win";
const LOSE = "Lose";
const DRAW = "Draw";

const checkPoints = (hand) => {
  let total = 0;

  for (let i = 0; i < hand.length; i++) {
    total += hand[i].points;
  }

  // to get the last points
  const stringPoints = String(total).slice(-1);
  //converting the score to number
  const playerScore = Number(stringPoints);

  return playerScore;
};

const checkSame = (hand) => {
  let threeKind = true;

  if (hand.length !== 3) {
    threeKind = false;
    return threeKind;
  } else {
    let currentCard = hand[0].rank;
    for (let i = 1; i < hand.length; i++) {
      if (currentCard !== hand[i].rank) {
        threeKind = false;
        break;
      }
    }
  }

  return threeKind;
};

const checkPictures = (hand) => {
  let threePictures = true;
  if (hand.length === 3) {
    threePictures = false;
    return threePictures;
  } else {
    for (let i = 0; i < hand.length; i++) {
      if (hand[i].rank < 11) {
        threePictures = false;
        break;
      }
    }
  }
  return threePictures;
};

const check = (playerStatus, bankerStatus) => {
  if (playerStatus === bankerStatus) {
    return DRAW;
  } else if (playerStatus === true && bankerStatus == false) {
    return WIN;
  } else if (playerStatus === false && bankerStatus == true) {
    return LOSE;
  }
};

//checks the win lose relative to the hand
const checkWin = (hand, banker) => {
  //checking the player hand
  const playerHand = checkPoints(hand);
  const playerPicture = checkPictures(hand);
  const playerSame = checkSame(hand);

  //checking hte banker hand
  const bankerHand = checkPoints(banker);
  const bankerPicture = checkPictures(banker);
  const bankerSame = checkSame(banker);

  //check for any specials
  check(playerPicture, bankerPicture);
  check(playerSame, bankerSame);
  if (bankerHand > playerHand) {
    return LOSE;
  } else if (bankerHand < playerHand) {
    return WIN;
  } else if (bankerHand === playerHand) {
    return DRAW;
  }
};

export const generateWinStatus = (game) => {
  delete game.deck;
  delete game.turn;

  const bankerHand = game["1"];
  const winstatus = {};
  for (const [key, value] of Object.entries(game)) {
    if (key !== "1") {
      const playerCards = value;
      const seatId = key;
      const status = checkWin(playerCards, bankerHand);
      winstatus[seatId] = status;
    }
  }

  return winstatus;
};
