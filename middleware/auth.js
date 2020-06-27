const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'})

module.exports = async (req,res, next) => {
    const authHeader = req.get("Authorization");

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
        const user = await jwt.verify(token, process.env.SECRET);
        req.user = user;
    } catch(err) {
        console.log(err);
    }
  }
    return next();
}