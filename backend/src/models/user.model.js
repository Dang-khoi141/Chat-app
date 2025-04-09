const mongoose = require('mongoose');

const userShema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true  
    },
    fullName:{
        type: String,
        required:true,
    },
    phone:{
        type: String,
        required:true,
    },
    password:{  
        type:String,
        required:true,  
        minlength:6,    
    },
    profilePic:{
        type:String,
        default:'',
    },

},
    {timestamps:true}
);
const User = mongoose.model('user',userShema);

module.exports = User
