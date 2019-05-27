const jwt = require('jsonwebtoken');

/**
 * Attaches "isAuth" meta data for all requests in the server.
 *
 * NOTE: This does not deny unauthenticated requests, that is handled in the resolvers.
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 * @param {Function} next Next middleware in the chain
 */
const isAuth = (req, res, next) => {
  // Checks for the appropriate header in the request.
  // If they don't have the header, attach a custome one
  // and move them to the next middleware.
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};

module.exports = isAuth;
