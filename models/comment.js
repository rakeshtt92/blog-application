const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');


const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'blog',
    },
}, { timestamps: true });

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;