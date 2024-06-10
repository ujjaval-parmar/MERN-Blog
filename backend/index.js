import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import { errorHandler } from './utils/error.js';
import postRouter from './routes/postRoutes.js';
import commentRouter from './routes/commentRoutes.js';


dotenv.config();


const app = express();

app.use(express.json());


app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    // 'Access-Control-Allow-Credentials': true

}));


app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    
    next();
});

app.use(cookieParser());


app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);

app.use('*', (req, res, next)=>{

    const error = errorHandler(404, 'Not Found '+req.originalUrl+' on this server!')

    next(error);

})


app.use((err, req, res, next)=>{
    // console.log(err)
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error!';
    const error = err.error || undefined;

    console.log(err)

    res.status(statusCode).json({
        status: false,
        message,
        error
    })

})


mongoose.connect(process.env.DATABASE)
    .then(() => console.log('DB connected!'))
    .catch(err => console.log('DB connect Failed!: ', err));



app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
})