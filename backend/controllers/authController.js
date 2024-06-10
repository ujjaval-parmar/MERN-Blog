import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import UserModel from "../model/userModel.js"
import { errorHandler } from "../utils/error.js"

export const signup = async (req, res, next) => {

    try {


        const response = await UserModel.find({
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        })

        if (response.length > 0) {

            const error = errorHandler(500, 'Username or Email already in Use!');
            return next(error);

        }

        const hasedPassword = await bcrypt.hash(req.body.password, 12);

        // console.log(hasedPassword);
        // console.log({...req.body, paasword: hasedPassword})

        const newUser = await UserModel.create({ ...req.body, password: hasedPassword });

        // console.log(newUser)

        newUser.password = undefined;

        res.status(201).json({
            message: 'Auth: User Register Success!',
            data: newUser
        })


    } catch (err) {
        const error = errorHandler(500, 'Auth: Register User Failed!', err.message);

        return next(error);

    }


}

export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;


        const findUser = await UserModel.findOne({ email });

        // console.log(req.body)


        if (!findUser) {
            const error = errorHandler(401, 'Invalid Email!');
            return next(error);
        }

        // console.log(findUser)

        const checkPassword = await bcrypt.compare(req.body.password, findUser.password);


        if (!checkPassword) {
            const error = errorHandler(401, 'Invalid Password!');
            return next(error);
        }


        // console.log(token)

        // res.setHeader('Set-Cookie', 'test=myValue');

        const age = 1000 * 60 * 60 * 24 * 7;

        const token = jwt.sign({
            id: findUser._id,
            isAdmin: findUser.isAdmin
        }, process.env.JWT_SECRET, { expiresIn: age });


        res.cookie('token', token, {
            httpOnly: true,
            maxAge: age,
            SameSite: 'lax',
            // domain: "localhost",
            // secure: true
        });


        const user = { ...findUser._doc, password: undefined }

        res.status(200).json({
            message: 'Login User Success!',
            user

        })
    } catch (err) {


        const error = errorHandler(500, 'Login User Failed!', err.message);
        return next(error);
    }
}

export const google = async (req, res, next) => {
    const { name, email, password, googlePhotoUrl } = req.body;

  

    try {

        const findUser = await UserModel.findOne({ email });

        if (findUser) {
           
        const age = 1000 * 60 * 60 * 24 * 7;

        const token = jwt.sign({
            id: findUser._id,
            isAdmin: findUser.isAdmin
        }, process.env.JWT_SECRET, { expiresIn: age });


        res.cookie('token', token, {
            httpOnly: true,
            maxAge: age,
            SameSite: 'lax',
            // domain: "localhost",
            // secure: true
        });

        const user = { ...findUser._doc, password: undefined }

        return res.status(200).json({
            message: 'Google User Success!',
            user

        })

    }else{
        const generatedPassword = Math.random().toString(36).slice(-8);

        const hashedPassword = await bcrypt.hash(generatedPassword, 12);

        const newUser = await UserModel.create({
            username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
            email,
            password: hashedPassword,
            profilePicture: googlePhotoUrl

        })

        
        const age = 1000 * 60 * 60 * 24 * 7;
        
        const token = jwt.sign({
            id: newUser._id,
            isAdmin: newUser.isAdmin
        }, process.env.JWT_SECRET, { expiresIn: age });
        
        
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: age,
            SameSite: 'lax',
            // domain: "localhost",
            // secure: true
        });

        const user = { ...newUser._doc, password: undefined }

        return res.status(200).json({
            message: 'Google User Success!',
            user

        })

    }


    } catch (err) {
        const error = errorHandler(500, 'Google User Failed!', err.message);
        next(error);
    }

}