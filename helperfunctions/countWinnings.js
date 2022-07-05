const calculateWinnings = (playerBet, playerChips, bankerChips, value) => {
  let newPlayerChips = playerChips;
  let newBankerChips = bankerChips;

  if (value === "Win") {
    newBankerChips -= playerBet;
    newPlayerChips += playerBet;
  } else if (value === "Win-Double") {
    newBankerChips -= playerBet * 2;
    newPlayerChips += playerBet * 2;
  } else if (value === "Win-Triple") {
    newBankerChips -= playerBet * 3;
    newPlayerChips += playerBet * 3;
  } else if (value === "Win-Five Times") {
    newBankerChips -= playerBet * 5;
    newPlayerChips += playerBet * 5;
  } else if (value === "Lose") {
    newBankerChips += playerBet;
    newPlayerChips -= playerBet;
  } else if (value === "Lose-Double") {
    newBankerChips += playerBet * 2;
    newPlayerChips -= playerBet * 2;
  } else if (value === "Lose-Triple") {
    newBankerChips += playerBet * 3;
    newPlayerChips -= playerBet * 3;
  } else if (value === "Lose-Five Times") {
    newBankerChips += playerBet * 5;
    newPlayerChips -= playerBet * 5;
  }

  const chips = [newPlayerChips, newBankerChips];

  return chips;
};

export default calculateWinnings;
