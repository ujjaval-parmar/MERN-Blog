import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createPost, deletePost, getPosts, updatePost } from '../controllers/postController.js';

const postRouter = express.Router();

postRouter.post('/create-post', verifyToken, createPost);
postRouter.get('/get-posts', getPosts);
postRouter.put('/update-post/:postId/:userId', verifyToken, updatePost);

postRouter.delete('/delete-post/:postId/:userId' ,verifyToken, deletePost);


export default postRouter;