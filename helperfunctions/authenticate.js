import getHash from "./hash.js";

export default function authenticate(req, res, next) {
  try {
    const userId = req.cookies.userId;
    const hashedSession = req.cookies.hashedSession;

    if (userId && hashedSession) {
      const hashedID = getHash(userId);

      if (hashedID === hashedSession) {
        req.userId = Number(userId);
        next();
      } else {
        throw new Error("authentication failed");
      }
    } else {
      throw new Error("user has not logged in");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/login");
  }
}
