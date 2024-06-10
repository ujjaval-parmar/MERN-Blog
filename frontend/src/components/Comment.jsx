import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { Button, Modal, Textarea } from 'flowbite-react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const Comment = ({ comment, onLike, handleEdit, handleDelete }) => {

    const { currentUser } = useSelector(state => state.user);

    const [userData, setUserData] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(comment?.content);

    const [showModal, setShowModal] = useState(false);



    useEffect(() => {

        const getUser = async () => {

            try {
                const response = await fetch(`/api/user/${comment.userId}`, {
                    method: "GET",
                    credentials: 'include',
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
                setUserData(data.data);

            } catch (err) {
                console.log(err.message);
            }


        }

        getUser();


    }, [comment]);




    return (
        <div className=' flex p-4 border-b dark:border-gray-500 text-sm '>

            <div className='flex-shrink-0 mr-3'>
                <img src={userData?.profilePicture} alt={userData?.username} className='w-10 h-10 rounded-full bg-gray-200' />
            </div>

            <div className='flex-1'>

                <div className='flex items-center mb-1'>
                    <span className='font-bold mr-1 text-xs truncate'>{userData ? `@${userData.username}` : 'anonymous user'}</span>
                    <span className='text-gray-500 text-xs'>
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>

                {isEditing ? (
                    <>
                        <Textarea
                            className='mb-2'
                            placeholder='Add Comment....'
                            maxLength='200'
                            onChange={(e) => setContent(e.target.value)}
                            value={content}
                        />
                        <div className='flex gap-2 items-center justify-end text-xs'>
                            <Button type='button' size='sm' gradientDuoTone='purpleToBlue'
                                onClick={() => {
                                    setIsEditing(false);
                                    handleEdit(comment._id, content)
                                }}>
                                Save
                            </Button>
                            <Button type='button' size='sm' gradientDuoTone='purpleToBlue' outline onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                        </div>

                    </>
                )
                    :
                    (
                        <>
                            <p className='text-gray-500 mb-2'>{comment.content}</p>
                            <div className='flex gap-2 items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit'>
                                <button type='button' onClick={() => onLike(comment._id)} className={`text-gray-500 hover:text-blue-500`}>
                                    <FaThumbsUp className={`text-sm  
                                ${currentUser && comment.likes.includes(currentUser._id) && 'text-blue-500 hover:text-gray-500'}`} />
                                </button>
                                <p className='text-gray-400'>{comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? 'like' : 'likes')}</p>

                                {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                    <div className='flex items-center gap-3'>
                                        <button type='button'
                                            onClick={() => {
                                                setIsEditing(true);
                                            }} className='text-gray-400 hover:text-blue-500' >
                                            Edit
                                        </button>
                                        <button type='button' className='text-gray-400 hover:text-red-500'
                                            onClick={() => {
                                               setShowModal(true)
                                            }}>
                                            Delete
                                        </button>
                                    </div>

                                )}

                            </div>
                        </>
                    )}

                <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>

                    <Modal.Header />

                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto' />
                            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this comment?</h3>

                            <div className='flex items-center justify-center gap-5'>
                                <Button color='failure'
                                    onClick={() => {
                                        handleDelete(comment._id);
                                        setShowModal(false);
                                    }}
                                >
                                    Yes, I'm Sure!
                                </Button>
                                <Button onClick={() => setShowModal(false)} color='gray'>
                                    No, Cancel
                                </Button>
                            </div>


                        </div>
                    </Modal.Body>


                </Modal>




            </div>


        </div>
    )
}

export default Comment