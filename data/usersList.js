const bcrypt = require('bcryptjs');


const userList = [
  {
    name:"Admin User",
    email:"admin@gmail.com",
    password:bcrypt.hashSync("admin123", 10),
    isAdmin: true
  },
  {
    name:"John Doe",
    email:"john@gmail.com",
    password:bcrypt.hashSync("john123", 10),
    isAdmin: false
  },
  {
    name:"Akhil Sabu",
    email:"akhil@gmail.com",
    password:bcrypt.hashSync("akhil123", 10),
    isAdmin: false
  },

]


module.exports = userList;