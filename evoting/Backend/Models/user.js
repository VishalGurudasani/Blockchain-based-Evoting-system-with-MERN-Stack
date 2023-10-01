const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    voterid:{
        type: String,
        required: true
    },
    adharno:{
        type: String,
        required: true
    },
      isEmailVerified: {
        type: Boolean,
      },
      isAdmin:{
        type :Boolean ,  default:false
      },
      walletAddress:{
        type:String,
      },
    date:{
        type: Date,
        default: Date.now
    },
  });
  const User = mongoose.model('user', UserSchema);
  module.exports = User;
