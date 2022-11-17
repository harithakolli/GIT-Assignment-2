const mongoose = require('mongoose');

const PostSchema  = new mongoose.Schema({
    title:{
        type:String,
        unique:true,
        required: true
       
    },
    body:{
        type: String,
        required:true
       
    },
    image:{
        type: String,
        required:true
     
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
});


const Post = mongoose.model('Post', PostSchema);

module.exports = Post