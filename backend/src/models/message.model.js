const mongoose = require('mongoose');

const messageShema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    text:{
        type:String,
    },
    image:{
        type:String,
    },
},
    {timestamps:true}
);
const Message = mongoose.model('Message',messageShema);

module.exports = Message
