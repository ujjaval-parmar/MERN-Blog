import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profilePicture:{
        type: String,
        default:"https://avatars.githubusercontent.com/u/154329143?v=4"
        
    },
    password:{
        type: String,
        required: true,
        
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: new Date()
    }
    

}, { timestamps: true });

const UserModel =   mongoose.model('User', UserSchema);

export default UserModel;


