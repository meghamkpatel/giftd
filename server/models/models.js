const mongoose = require("mongoose");

if (!process.env.MONGODB_URI) {
  console.log("Error: MONGODB_URI is not set. Did you run source env.sh ?");
  process.exit(1);
}

const connect = process.env.MONGODB_URI;
mongoose.connect(connect);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  // registries: [
  //   event: {
  //     type: String
  //   },
  //   items: {
  //     type: Array
  //   }
  // ]
});

var User = mongoose.model("User", userSchema);

const giftSchema = new mongoose.Schema({
  recipient: {
    type: String,
    required: true
  },
  item: {
    type: String,
    required: true
  },
  imageUri: {
    type: String,
    required: true
  },
  redirectLink: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }
});

var Gift = mongoose.model("Gift", giftSchema);

module.exports = {
  User,
  Gift
};
