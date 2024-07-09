const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const users = require('../model/userModel');


exports. protect = asyncHandler(async(req,res,next) => {
  let token;
  token = req.cookies.jwt;

  if(token){

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await users.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }

  } else{
    res.status(401);
    throw new Error('Not authorized, no token');
  }

});


// admin middleware
exports.admin = (req,res,next) => {
  if(req.user && req.user.isAdmin){
    next();
  }else{
    res.status(401);
    throw new Error('Not authorized as admin');
  }
}


