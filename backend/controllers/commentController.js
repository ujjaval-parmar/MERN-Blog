import CommentModel from "../model/commentModel.js";
import { errorHandler } from "../utils/error.js"

export const createComment = async (req, res, next) => {

    try {

        const { content, userId, postId } = req.body;

        if (userId !== req.userId) {
            const error = errorHandler(500, 'Your are not allowed!');
            return next(error);
        };

        const newComment = await CommentModel.create({
            content,
            postId,
            userId
        });

        res.status(201).json({
            message: 'New Comment Created Success!',
            data: newComment
        });


    } catch (err) {
        const error = errorHandler(500, 'Create Comment Failed', err.message);
        next(error);
    }


}

export const getPostComments = async (req, res, next) => {

    try {

        const comments = await CommentModel.find({ postId: req.params.postId }).sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Get Comments Success',
            data: comments
        })



    } catch (err) {
        const error = errorHandler(500, 'Get Comments Failed', err.message);
        next(error);
    }


}

export const getAllComments = async (req, res, next) => {

    if (!req.isAdmin) {
        const error = errorHandler(403, 'Your are not allowed!');
        return next(error);
    };


    try {

        const startIndex = parseInt(req.query.startIndex) || 0;

        const limit = parseInt(req.query.limit) || 9;

        const comments = await CommentModel.find().sort({ createdAt: -1}).skip(startIndex).limit(limit);

        const totalComments = await CommentModel.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthsComments = await CommentModel.countDocuments({
            createdAt: { $gte: oneMonthAgo}
        })



        res.status(200).json({
            message: 'Get All Comments Success',
            data: comments,
            totalComments,
            lastMonthsComments
        })



    } catch (err) {
        const error = errorHandler(500, 'Get All Comments Failed', err.message);
        next(error);
    }


}


export const likeComment = async (req, res, next) => {


    try {

        const comment = await CommentModel.findById(req.params.commentId);

        const userIndex = comment.likes.indexOf(req.userId);

        if (userIndex === -1) {
            comment.likes.push(req.userId);
            comment.numberOfLikes++;
        } else {
            comment.likes.splice(userIndex, 1);
            comment.numberOfLikes--;
        }

        const response = await CommentModel.create(comment);


        res.status(201).json({
            message: 'Like Poste success!',
            data: response
        })



    } catch (err) {
        const error = errorHandler(500, 'Posting Like Failed', err.message);
        next(error);
    }



}

export const editComment = async (req, res, next) => {

    try {

        const comment = await CommentModel.findById(req.params.commentId);

        if (!comment) {
            const error = errorHandler(404, 'No Comment found by Id!');
            return next(error);
        }

        if (!req.isAdmin && comment.userId !== req.userId) {
            const error = errorHandler(401, 'You are not allowed to edit this comment!');
            return next(error);
        }

        // console.log({...comment});

        const response = await CommentModel.findByIdAndUpdate(req.params.commentId, { content: req.body.content }, { new: true });

        res.status(201).json({
            message: 'Edit comment success!',
            data: response
        })



    } catch (err) {
        const error = errorHandler(500, 'Edit Like Failed', err.message);
        next(error);
    }


}


export const deleteComment = async (req, res, next) => {
    try {

        const comment = await CommentModel.findById(req.params.commentId);

        if (!comment) {
            const error = errorHandler(404, 'No Comment found by Id!');
            return next(error);
        }

        if (!req.isAdmin && comment.userId !== req.userId) {
            const error = errorHandler(401, 'You are not allowed to delete this comment!');
            return next(error);
        }

        // console.log({...comment});

        const response = await CommentModel.findByIdAndDelete(req.params.commentId);

        res.status(203).json({
            message: 'Delete comment success!',
            data: response
        })



    } catch (err) {
        const error = errorHandler(500, 'Delete Like Failed', err.message);
        next(error);
    }
}