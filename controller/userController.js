const asyncHandler = require("../middleware/asyncHandler");
const users = require("../model/userModel");
const generateToken = require("../utils/generateToken");


// @desc  Authenticate user & get token
// @route POST/api/users/login
// @access Public
exports.authUser = asyncHandler(async(req,res) => {
  const { email, password } = req.body;

  const user = await users.findOne({ email });
  if(user && (await user.matchPassword(password))){
   
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    });
  } else {
    res.status(401);
    throw new Error('invalid email or password');
  }

});



// @desc  Register user
// @route POST/api/users
// @access Public
exports.registerUser = asyncHandler(async(req,res) => {
  const { name, email, password } = req.body;
  const userExists = await users.findOne({email});
  if(userExists){
    res.status(400);
    throw new Error('User already exists');
  } else {
    const user = await users.create({
      name,
      email,
      password
    })
    if(user){

      generateToken(res, user._id);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      })
    }else{
      res.status(400);
      throw new Error('Invalid user data');
    }
  }
});



// @desc  Logout user / clear cookie
// @route POST/api/users/logout
// @access Private
exports.logoutUser = asyncHandler(async(req,res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    sameSite: 'None', 
    expires: new Date(0),
  })

  res.status(200).json({ message: 'Logged out successfully' });
});



// @desc  Get user profile
// @route GET/api/users/profile
// @access Private
exports.getUserProfile = asyncHandler(async(req,res) => {
  const user = await users.findById(req.user._id);

  if(user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404);
    throw new Error('user not found');
  }
});




// @desc  Update user profile
// @route PUT/api/users/profile
// @access Private
exports.updateUserProfile = asyncHandler(async(req,res) => {
  const user = await users.findById(req.user._id);

  if(user){
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if(req.body.password){
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })

  }else{
    res.status(404);
    throw new Error('user not found');
  }
});



// @desc  Get users
// @route GET/api/users
// @access Private/Admin
exports.getUsers = asyncHandler(async(req,res) => {
  const userList = await users.find({});
  res.status(200).json(userList);
});



// @desc  Get user by ID
// @route GET/api/users/:id
// @access Private/admin
exports.getUserById = asyncHandler(async(req,res) => {
  const user = await users.findById(req.params.id).select('-password');

  if(user) {
    res.status(200).json(user);
  }
  else{
    res.status(404);
    throw new Error('User not found');
  }
});



// @desc  Delete users
// @route DELETE/api/users/:id
// @access Private/admin
exports.deleteUser = asyncHandler(async(req,res) => {
  const user = await users.findById(req.params.id);

  if(user){
    if(user.isAdmin) {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }
    await users.deleteOne({ _id: user._id });
    res.status(200).json({ message: 'User deleted successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});



// @desc  Update user 
// @route PUT /api/users/:id
// @access Private/admin
exports.updateUser = asyncHandler(async(req,res) => {
  const user = await users.findById(req.params.id);

  if(user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404);
    throw new Error('User not found');
  }

});