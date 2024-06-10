import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) =>{
    // console.log(req.cookies.token);

    const token = req.cookies.token;

    if (!token) {
        const error = errorHandler(403, 'Auth Error: No Token')
        return next(error);
    };

    // console.log(process.env.JWT_SECRET)

    jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
        if (err) {
            const error = (403, 'Auth Error: Token is not valid!', err.message);
            return next(error);
        }

        // console.log(data);
        req.userId = data.id;
        req.isAdmin = data.isAdmin;

        next();
    })

    
}
