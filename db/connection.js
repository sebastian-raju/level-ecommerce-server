const mongoose = require("mongoose");


// mongoose.connect(process.env.MONGO_URI)
//                 .then(result => console.log("-------connected to mongodb-------"))
//                 .catch(error => console.log(`-------error connecting mongodb :: error :: ${error}-------`));

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("-------connected to mongodb-------");
  } catch (error) {
    console.log(`-------error connecting mongodb :: error :: ${error}-------`);
    process.exit(1);
  }
}

module.exports = connectDB;

