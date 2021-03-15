const mongoose = require('mongoose')
const Populate = require("../util/autopopulate");

const postSchema =new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    owner:{
       type:mongoose.Schema.Types.ObjectId,
       required:true,
       ref:'User' 
    },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }]
})

postSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author'))
    
const Post = mongoose.model('Post', postSchema)

module.exports = Post
