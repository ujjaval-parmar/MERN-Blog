import PostModel from "../model/postModel.js";
import { errorHandler } from "../utils/error.js"

export const createPost = async (req, res, next) => {

    try {

        if (!req.isAdmin) {
            const error = errorHandler(403, 'You are not allowed to create a post!');
            return next(error);
        }

        if (!req.body.title || !req.body.content) {
            const error = errorHandler(400, 'Please provide all required fields!');
            return next(error);
        }

        const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

        const newPost = await PostModel.create({
            ...req.body, slug, userId: req.userId
        });

        newPost.userId = undefined;

        // console.log(newPost)

        res.status(201).json({
            status: 'success',
            message: 'Create Post Success!',
            data: newPost,
        });


    } catch (err) {
        const error = errorHandler(500, 'Create Post Failed!', err.message);
        next(error);
    }

}


export const getPosts = async (req, res, next) => {

    try {

        const startIndex = parseInt(req.query.startIndex || 0);

        const limit = parseInt(req.query.limit || 9);

        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        req.query.category = req.query.category === 'uncategorized' ? undefined : req.query.category;

        // console.log(req.query);

        const posts = await PostModel.find({
            ...(req.query.userId) && { userId: req.query.userId },
            ...(req.query.category) && { category: req.query.category },
            ...(req.query.slug) && { slug: req.query.slug },
            ...(req.query.postId) && { _id: req.query.postId },
            ...(req.query.searchTerm) && {
                $or: [
                    {
                        title: { $regex: req.query.searchTerm, $options: 'i' }
                    },
                    {
                        content: { $regex: req.query.searchTerm, $options: 'i'}
                    }
                ]
            },

        }).sort({ updatedAt: sortDirection}).skip(startIndex).limit(limit);

        const totalPosts = await PostModel.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthsPosts = await PostModel.countDocuments({
            createdAt: { $gte: oneMonthAgo}
        })

        // console.log(posts, posts.length);

        res.status(201).json({
            status: 'success',
            message: 'Get Posts Success!',
            posts,
            totalPosts,
            lastMonthsPosts
        });


    } catch (err) {
        const error = errorHandler(500, 'Get Posts Failed!', err.message);
        next(error);
    }



}

export const updatePost = async(req, res, next)=>{
    if(!req.isAdmin || req.userId !== req.params.userId){
        const error = errorHandler(403, 'You are not allowed to update this post!');
        next(error);
    }

    try{

        // console.log('Params:', req.params)

        const updatedPost = await PostModel.findByIdAndUpdate(req.params.postId, {
            $set:{
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                image: req.body.image
            }
        }, { $new: true });

        res.status(203).json({
            message: 'Post updated success!',
            data: updatedPost
        })


    }catch(err){
        const error = errorHandler(500, 'Update Post Failed!', err.message);
        next(error);
    }


}

export const deletePost = async(req, res, next)=>{
    if(!req.isAdmin || req.userId !== req.params.userId){
        const error = errorHandler(403, 'You are not allowed to delete this post!');
        next(error);
    }

    try{

        // console.log('Params:', req.params)

        await PostModel.findByIdAndDelete(req.params.postId);

        res.status(203).json({
            message: 'Post deleted success!'
        })


    }catch(err){
        const error = errorHandler(500, 'Delete Post Failed!', err.message);
        next(error);
    }



}