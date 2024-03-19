const mongoose = require("mongoose");
const seed = require("./seed");

const conn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // seed preconfigured data into the database
    await seed();
    
  } catch (error) {
    
  }
};

module.exports = conn;
