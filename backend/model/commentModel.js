import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({

    userId:{
        type: String,
        required: true
    },

    postId:{
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    likes: {
        type: Array,
        default: []
    },

    numberOfLikes:{
        type: Number,
        default: 0
    }

}, { timestamps: true});

const CommentModel =   mongoose.model('comment', CommentSchema);

export default CommentModel;