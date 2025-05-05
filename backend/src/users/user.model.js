const bcrypt = require('bcryptjs');

const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum: ['user','admin'],
        required:true
    }
})
    
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});


const User = mongoose.model("User",userSchema);
    
module.exports = User;
    

    