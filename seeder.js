require('dotenv').config();
const mongoose = require("mongoose");
const colors = require('colors');
const userList = require('./data/usersList');
const productsList = require('./data/productsList');
const users = require('./model/userModel');
const products = require('./model/productModel');
const orders = require('./model/orderModel');
const connectDB = require('./db/connection');


connectDB();


const importData = async() => {
  try {
    await orders.deleteMany();
    await users.deleteMany();
    await products.deleteMany();

    const createdUsers = await users.insertMany(userList);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = productsList.map((product)=>{
      return { ...product, user:adminUser }
    })

    await products.insertMany(sampleProducts);

    console.log("Data Imported".green.inverse);
    process.exit();

  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
}


const destroyData = async () => {
  try {
    await orders.deleteMany();
    await users.deleteMany();
    await products.deleteMany();

    console.log(`Data destroyed!`.red.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
}

if(process.argv[2] === "-d") {
  destroyData();
}
else{
  importData();
}



// node ./seeder.js -d   - destroy data;
// node ./seeder.js      - import data;

