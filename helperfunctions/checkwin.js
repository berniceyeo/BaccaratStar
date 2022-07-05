//global variables
const WIN = "Win";
const LOSE = "Lose";
const DRAW = "Draw";
const DOUBLEWIN = "Win-Double";
const DOUBLELOSE = "Lose-Double";
const TRIPWIN = "Win-Triple";
const TRIPLOSE = "Lose-Triple";

const checkSameSuit = (hand) => {
  let sameSuit = true;
  const suit = hand[0].suit;
  console.log(suit);
  for (let i = 1; i < hand.length; i++) {
    if (hand[i].suit !== suit) {
      sameSuit = false;
      break;
    }
  }
  console.log(sameSuit);
  return sameSuit;
};

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

const checkThreeKind = (hand) => {
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

const checkSame = (hand) => {
  let checkSame = true;
  if (hand.length !== 2) {
    checkSame = false;
    return checkSame;
  } else {
    if (hand[0].rank !== hand[1].rank) {
      checkSame = false;
    }
  }

  return checkSame;
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

const check = (playerStatus, bankerStatus, wintype) => {
  if (playerStatus === bankerStatus) {
    return DRAW + wintype;
  } else if (playerStatus === true && bankerStatus == false) {
    return WIN + wintype;
  } else if (playerStatus === false && bankerStatus == true) {
    return LOSE + wintype;
  }
};

//checks the win lose relative to the hand
const checkWin = (hand, banker) => {
  console.log(hand, banker);

  //checking the player hand
  const playerHand = checkPoints(hand);
  const playerPicture = checkPictures(hand);
  const playerTriple = checkThreeKind(hand);
  const playerSameSuit = checkSameSuit(hand);
  const playerSameRank = checkSame(hand);

  //checking hte banker hand
  const bankerHand = checkPoints(banker);
  const bankerPicture = checkPictures(banker);
  const bankerTriple = checkThreeKind(banker);
  const bankerSameSuit = checkSameSuit(banker);
  const bankerSameRank = checkSame(banker);

  //check for any specials
  check(bankerTriple, playerTriple, "-Five Times");
  check(playerPicture, bankerPicture, "-Triple");
  if (bankerHand > playerHand) {
    if (bankerSameSuit === true && banker.length === 3) {
      return TRIPLOSE;
    } else if (
      (bankerSameSuit === true && banker.length === 2) ||
      (bankerSameRank === true && banker.length === 2)
    ) {
      return DOUBLELOSE;
    } else {
      return LOSE;
    }
  } else if (bankerHand < playerHand) {
    if (playerSameSuit === true && hand.length === 3) {
      return TRIPWIN;
    } else if (
      (playerSameSuit === true && hand.length === 2) ||
      (playerSameRank === true && hand.length === 2)
    ) {
      return DOUBLEWIN;
    } else {
      return WIN;
    }
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
      console.log("checkignWin", status);
      winstatus[seatId] = status;
    }
  }

  return winstatus;
};
