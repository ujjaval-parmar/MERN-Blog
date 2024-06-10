import bcrypt from 'bcryptjs';

import UserModel from "../model/userModel.js";
import { errorHandler } from "../utils/error.js";

export const getUsers = async (req, res) => {

    if(!req.isAdmin){
        const error = errorHandler(403, 'You are not allowed to Get All Users!');
        next(error);
    }

    try {

        // console.log(req.query.startIndex);

        const startIndex = parseInt(req.query.startIndex) || 0;

        const limit = parseInt(req.query.limit) || 9;

        const sortDirection = req.query.order === 'asc' ? 1 : -1;


        const response = await UserModel.find().sort({ createdAt: sortDirection}).skip(startIndex).limit(limit);

        // console.log(response);
        const withoutPassword = response.map(user=>{
            return {...user._doc, password: undefined};
        })

        // console.log(withoutPassword);

        const totalUsers = await UserModel.countDocuments();


        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthsUsers = await UserModel.countDocuments({
            createdAt: { $gte: oneMonthAgo}
        })



        res.status(200).json({
            message: 'Get All Users Success!',
            data: withoutPassword,
            totalUsers,
            lastMonthsUsers
        })
    } catch (err) {
        const error = errorHandler(500, 'Get All Users Failed!', err.message);
        next(error);
    }

}

export const getUser = async (req, res, next) => {

    try {

        // console.log(req.params)        

        const response = await UserModel.findById(req.params.id);

        const withoutPassword = { ...response._doc, password: undefined };

        res.status(200).json({
            message: 'Get  User Success!',
            data: withoutPassword
        })
    } catch (err) {
        
        const error = errorHandler(500, 'Get User Failed!', err.message);
        return next(error);
    }

}

export const updateUser = async (req, res, next) => {

    // console.log(req.userId, req.params.id)

    if(req.params.userId !== req.userId){
        const error = errorHandler(403, ' Not authorize : You are not allowed to upadte this User!');
        return next(error);
    }

    if(req.body.password){

        req.body.password = await bcrypt.hash(req.body.password, 12);
    }

    if(req.body.username){
        if(req.body.username.includes(' ')){
            return next(errorHandler(400, 'Username cannot contain spaces!'));
        };
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(errorHandler(400, 'Username must be lowercase'));
        }
        if(req.body.username.match(/^a-zA-Z-0-9+$/)){
            return next(errorHandler(400, 'Username can only contain lettrs and numbers!'));
        }
    }



    try {

        //   console.log(req.body) 

        const response = await UserModel.findByIdAndUpdate(req.params.userId, {
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture
            }
        }, {new: true});

        
        const updatedUser = { ...response._doc, password: undefined }

        res.status(200).json({
            message: 'Update User Success!',
            data: updatedUser 
        })
    } catch (err) {
        console.log(err.message)
        const error = errorHandler(500, 'Update User Failed!', err.message);
        return next(error);
    }

}

export const deleteUser = async (req, res, next) => {

    // console.log(req.isAdmin)
  

    if(req.params.userId !== req.userId ){
        const error = errorHandler(403, ' Not authorize : You are not allowed to Delete this User!');
        return next(error);
    }

    try {


         await UserModel.findByIdAndDelete(req.params.userId);

        res.status(204).json({
            message: 'Deleting User Success!',
           
        })
    } catch (err) {
        
        const error = errorHandler(500, 'Deleting User Failed!', err.message);
        return next(error);
    }

}

export const adminDeleteUser = async(req, res, next)=>{
    if(!req.isAdmin ){
        const error = errorHandler(403, ' Not authorize : You are not allowed to Delete this User!');
        return next(error);
    }

    try {


         await UserModel.findByIdAndDelete(req.params.userId);

        res.status(204).json({
            message: 'Deleting User Success!',
           
        })
    } catch (err) {
        
        const error = errorHandler(500, 'Deleting User Failed!', err.message);
        return next(error);
    }
}

export const signOut = async(req, res, next)=>{
    try{
        res.clearCookie('token');

        res.status(200).json({
            message: 'User has been signed out!',
        })
    }catch(err){
        const error = errorHandler(500, "Error: can not sign out User!", err.message);
        next(error);
    }
   

}