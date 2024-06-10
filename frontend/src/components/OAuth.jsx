import { Button } from 'flowbite-react'
import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { AiFillGoogleCircle } from 'react-icons/ai'
import { app } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';

const OAuth = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const auth = getAuth(app);

    const handleGoogleClick = async()=>{
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account'});

        try{

            const resultFromGoogle = await signInWithPopup(auth, provider);

            // console.log(resultFromGoogle.user)

            const response = await fetch('/api/auth/google',{
                method: 'POST',
                body: JSON.stringify({
                    name: resultFromGoogle.user.displayName,
                    email: resultFromGoogle.user.email,
                    googlePhotoUrl: resultFromGoogle.user.photoURL
                }),
                "Access-Control-Allow-Origin": "*",
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || data.message);
            }

            dispatch(signInSuccess(data.user));

            navigate('/');

        }catch(error){
            console.log(error);
        }
    }


    return (
        <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
            <AiFillGoogleCircle className='w-6 h-6 mr-2' />
            Continue with Google
        </Button>
    )
}

export default OAuth