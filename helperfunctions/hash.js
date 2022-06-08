import jsSha from "jssha";

const { SALT } = process.env;

const getHash = (input) => {
  //create new SHA object
  const shaObj = new jsSha("SHA-512", "TEXT", { encoding: "UTF8" });

  const unhashedString = `${input}-${SALT}`;

  shaObj.update(unhashedString);

  const hash = shaObj.getHash("HEX");

  return hash;
};

export default getHash;
