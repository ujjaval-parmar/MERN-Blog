import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createComment, editComment, getPostComments, likeComment, deleteComment, getAllComments  } from '../controllers/commentController.js';


const commentRouter = express.Router();

commentRouter.post('/', verifyToken, createComment);
commentRouter.get('/getPostComments/:postId', getPostComments);
commentRouter.get('/getAllComments', verifyToken, getAllComments); 
commentRouter.put('/likeComment/:commentId', verifyToken, likeComment);
commentRouter.put('/editComment/:commentId', verifyToken, editComment);
commentRouter.delete('/:commentId', verifyToken, deleteComment);




export default commentRouter;
