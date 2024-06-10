import { Alert, Button, TextInput, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom';
import Comment from './Comment';


const CommentSection = ({ postId }) => {

    const navigate = useNavigate();

    const { currentUser } = useSelector(state => state.user);

    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        const getPostComments = async () => {

            try {
                setError('');
                setLoading(true);

                const response = await fetch('/api/comment/getPostComments/' + postId, {
                    method: 'GET',
                    // credentials: 'include',
                    "Access-Control-Allow-Origin": "*",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || data.message);
                }

                // console.log(data);
                setComments(data.data);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        getPostComments();

    }, [postId])


    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            setError('');
            setLoading(true)

            if (!comment) {
                throw new Error('Please Add Comment!')
            }

            const body = {
                postId,
                content: comment,
                userId: currentUser._id
            }


            const response = await fetch('/api/comment', {
                method: 'POST',
                credentials: 'include',
                "Access-Control-Allow-Origin": "*",
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message);
            }

            setComment('');

            setComments([data.data, ...comments]);

            // console.log(data);


        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false)
        }
    }


    const handleLike = async (commentId) => {

        try {

            if (!currentUser) {
                navigate('/sign-in');
                return;
            }

            const response = await fetch('/api/comment/likeComment/' + commentId, {
                method: 'PUT',
                credentials: 'include',
                "Access-Control-Allow-Origin": "*",
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.meaasge);
            };

            setComments(comments.map(comment => {
                if (comment._id === commentId) {
                    return data.data;
                };
                return comment;
            }))



        } catch (err) {
            console.log(err);
        }

    }

    const handleEdit = async (commentId, content) => {
        try {

            if (!currentUser) {
                navigate('/sign-in');
                return;
            }

            const response = await fetch('/api/comment/editComment/' + commentId, {
                method: 'PUT',
                credentials: 'include',
                "Access-Control-Allow-Origin": "*",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.meaasge);
            };

            // console.log(data.data);

            setComments(comments.map(comment => {
                if (comment._id === commentId) {
                    return data.data;
                };
                return comment;
            }))



        } catch (err) {
            console.log(err.message);
        }
    }

    const handleDelete = async (commentId) => {
        try {

            if (!currentUser) {
                navigate('/sign-in');
                return;
            }

            const response = await fetch('/api/comment/' + commentId, {
                method: 'DELETE',
                credentials: 'include',
                "Access-Control-Allow-Origin": "*",
                headers: {
                    'Content-Type': 'application/json'
                },
                
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.meaasge);
            };

            // console.log(data.data);

            setComments(() => comments.filter((comment) => comment._id !== commentId));

       

            



        } catch (err) {
            console.log(err.message);
        }
    }







    return (
        <div className='max-w-2xl mx-auto w-full p-3'>

            {currentUser ?

                (
                    <div className='flex items-center gap-1 my-3 text-gray-500 text-sm'>
                        <p>Signed in as: {currentUser.email}</p>
                        <img src={currentUser.profilePicture} alt={currentUser.username} className='h-5 w-5 object-cover rounded-full' />
                        <NavLink to='/dashboard?tab=profile' className='text-xs text-cyan-500 hover:underline cursor-pointer'>
                            @{currentUser.username}
                        </NavLink>
                    </div>
                )
                :
                (
                    <div className='text-sm text-teal-500 my-5'>
                        You must be sign in to comment!
                        <NavLink to='/sign-in' className='font-bold hover:underline ml-3 text-blue-500'>
                            Sign In
                        </NavLink>
                    </div>
                )
            }

            {currentUser && (
                <form className='border border-x-teal-500 rounded-md p-3' onSubmit={handleSubmit}>
                    <Textarea
                        placeholder='Add Comment....'
                        rows={3}
                        maxLength='200'
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}

                    />

                    {error && <Alert color='failure' className='my-2'>
                        {error}
                    </Alert>}

                    <div className='flex justify-between items-center mt-5'>
                        <p className='text-gray-500 text-xs'>{200 - comment?.length} characters remaining</p>
                        <Button outline gradientDuoTone='purpleToBlue' type='submit' disabled={loading}>
                            Submit
                        </Button>
                    </div>

                </form>
            )}

            {comments.length === 0 ?
                (
                    <p className='text-sm my-5'>No Comments Yet!</p>
                )
                :
                (
                    <>
                        <div className='text-sm my-5 flex items-center gap-1'>
                            <p>Comments</p>

                            <div className='border border-gray-400  py-1 px-2 rounded-sm'>
                                <p>{comments.length}</p>
                            </div>


                        </div>

                        <div>
                            {comments.map(comment => {
                                return <Comment key={comment._id} comment={comment} onLike={handleLike} handleEdit={handleEdit} handleDelete={handleDelete} />
                            })}
                        </div>

                    </>
                )
            }



        </div>
    )
}

export default CommentSection