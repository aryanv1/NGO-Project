const jwt = require("jsonwebtoken");

const createAuthMiddleware = (secret) => {
  return async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Not authorised to access this route" });
    }

    try {
      const decode = jwt.verify(token, secret);
      req.user = decode;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorised to access this route" });
    }
  };
};

const authenticateMiddleWare = createAuthMiddleware(process.env.JWT_SECRET);
const authenticateMiddleWare_for_ngo = createAuthMiddleware(process.env.JWT_SECRET_NGO);
const authenticateMiddleWare_for_restaurant = createAuthMiddleware(process.env.JWT_SECRET_Rest);
const authenticateMiddleWare_for_volunteer = createAuthMiddleware(process.env.JWT_SECRET_Vol);

module.exports = {
  authenticateMiddleWare,
  authenticateMiddleWare_for_ngo,
  authenticateMiddleWare_for_restaurant,
  authenticateMiddleWare_for_volunteer,
};
