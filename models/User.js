const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define user schema
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  child:{
    childname:{
        type:String,
        default:""
    },
    childage:{
        type:Number,
        default:0
    },
    childgender:{
        type:String,
        default:""
    },
    familyautism:{
        type:Boolean,
        default:false
    },
    prematurity:{
        type:Boolean,
        default:false
    },
    result:{
        type:String,
        default:""
    }
    
  },
  
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
