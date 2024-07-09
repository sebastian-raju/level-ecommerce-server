const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
  const token = jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: '30d' });

  // set JWT as HTTP only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'None',
    maxAge: 30 * 24 * 60 * 60 * 1000  // 30 days
  })
}


// secure: process.env.NODE_ENV !== 'development'


module.exports = generateToken;