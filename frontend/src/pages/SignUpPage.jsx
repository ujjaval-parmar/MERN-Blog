import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';

const SignUpPage = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = e => {
        setError('');
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            setError('');

            const response = await fetch('/api/auth/signup', {
                method: "POST",
                body: JSON.stringify(formData),
                "Access-Control-Allow-Origin": "*",
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            // console.log(data);

            navigate('/sign-in');

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
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
                        Welcome to MERN-BLOG. YOu can sign up with your email and password or with Google.
                    </p>
                </div>


                <div className="right flex-1">
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

                        <div className="">
                            <Label value='Your Username' />
                            <TextInput
                                type='text'
                                placeholder='Username'
                                id='username' required
                                onChange={handleChange}
                            />
                        </div>

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
                            {isLoading ? (
                                <>
                                    <Spinner size='sm' />
                                    <span className='pl-3'>Loading....</span>
                                </>
                            ) : 'Sign Up'}
                        </Button>

                        <OAuth />

                    </form>

                    <div className="flex gap-2 text-sm mt-5">
                        <span>Have an Account?</span>
                        <NavLink to='/sign-in' className='text-blue-500'>
                            Sign In
                        </NavLink>
                    </div>


                </div>


            </div>


        </div>
    )
}

export default SignUpPage