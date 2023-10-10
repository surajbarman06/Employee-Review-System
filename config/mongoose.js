const mongoose = require("mongoose");

const uri =
  "mongodb+srv://surajbarman989:nv7LnhrFXhbmeGum@cluster0.6ng2pjh.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to Database: MongoDB Atlas");
  })
  .catch((err) => console.log("no connection " + err));

const db = mongoose.connection;

module.exports = db;
