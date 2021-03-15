const mongoose = require("mongoose");
const Populate = require("../util/autopopulate");

const commentSchema = new mongoose.Schema(
    {
        content: { type: String, required: true },
        author : { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}] 
    })

    commentSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author'))
    .pre('findOne', Populate('comments'))
    .pre('find', Populate('comments'))

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment




