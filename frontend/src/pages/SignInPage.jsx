import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

const SignInPage = () => {

    const  {currentUser, error, loading}  = useSelector(state=> state.user);

    const dispatch = useDispatch();

    // console.log(currentUser, error, loading);
    
    const navigate = useNavigate();

    const [formData, setFormData] = useState({});
    

    const handleChange = e => {
        
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();

        try {
            dispatch(signInStart());

            const response = await fetch('/api/auth/signin', {
                method: "POST",
                body: JSON.stringify(formData),
                "Access-Control-Allow-Origin": "*",
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message);
            }

            // console.log(data);
            dispatch(signInSuccess(data.user));

            navigate('/');

        } catch (err) {
            dispatch(signInFailure(err.message))
        }
    }

  return (
    <div className='min-h-screen mt-20'>

            <div className="p-3 max-w-3xl mx-auto flex flex-col md:flex-row md:items-center md:gap-5">

                <div className="left flex-1">
                    <NavLink to='/' className=" font-bold dark:text-white text-4xl">
                        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Ujjaval's</span>
                        Blog
                    </NavLink>
                    <p className='text-sm mt-5'>
                        Welcome to MERN-BLOG. YOu can sign in with your email and password or with Google.
                    </p>
                </div>


                <div className="right flex-1">
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

                        <div className="">
                            <Label value='Your Email' />
                            <TextInput
                                type='email'
                                placeholder='Email'
                                id='email' required
                                onChange={handleChange}
                            />
                        </div>

                        <div className="">
                            <Label value='Your Password' />
                            <TextInput
                                type='password'
                                placeholder='Password'
                                id='password' required
                                onChange={handleChange}
                            />
                        </div>


                        {error && (
                            <Alert className='mt-5' color='failure'>
                                {error}
                            </Alert>
                        )}

                        <Button gradientDuoTone='purpleToPink' type='submit'

                        // isProcessing={isLoading}
                        >
                            {loading ? (
                                <>
                                    <Spinner size='sm' />
                                    <span className='pl-3'>Loading....</span>
                                </>
                            ) : 'Sign In'}
                        </Button>

                        <OAuth />

                    </form>

                    <div className="flex gap-2 text-sm mt-5">
                        <span>Don't Have an Account?</span>
                        <NavLink to='/sign-up' className='text-blue-500'>
                            Sign Up
                        </NavLink>
                    </div>


                </div>


            </div>


        </div>
  )
}

export default SignInPage