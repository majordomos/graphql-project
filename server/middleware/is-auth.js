const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    // console.log(`authHeader - ${authHeader}`);
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    // console.log(`token - ${token}`);
    if (!token || token === '') {
        req.isAuth = flase;
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    // console.log(`decoedeToken - ${decodedToken}`);
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;

    // console.log(`isAuth - ${req.isAuth}`);
    // console.log(`userId - ${req.userId}`);
    next();
};