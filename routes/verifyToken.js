const jwt = require("jsonwebtoken");

// a middleware function( will be added to private routes)
module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("ACCESS DENIED!"); // check if header has any token or not

  // Verify Token
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET); // returns decoded token (contains id)
    req.user = verified;
    next();
  } catch (err) {
    // if not verified
    res.status(400).send("INVALID TOKEN");
  }
};
