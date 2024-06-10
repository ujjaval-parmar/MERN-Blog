import { Button, Modal, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';

import { FaCheck, FaTimes } from 'react-icons/fa'

const DashComments = () => {

    const { currentUser } = useSelector(state => state.user);

    const [commentData, setCommentData] = useState([]);

    const [showMore, setShowMore] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState(null);

    useEffect(() => {

        const getComments = async () => {
            try {

                const response = await fetch(`/api/comment/getAllComments`, {
                    // method: "POST",
                    credentials: 'include',
                    "Access-Control-Allow-Origin": "*",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                const data = await response.json();

                // console.log(data)

                if (!response.ok) {
                    throw new Error(data.error || data.message);
                }

                // console.log(data);
                setCommentData(data.data);

                if (data.data.length < 9) {
                    setShowMore(false);
                }


            } catch (err) {
                console.log(err);
            }
        }

        if (currentUser.isAdmin) {
            getComments();
        }


    }, []);

//   console.log(commentData);

    const handleShowMore = async () => {
        const startIndex = commentData.length;
        try {

            const response = await fetch(`/api/comment/getAllComments?startIndex=${startIndex}&limit=9`, {
                // method: "POST",
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

            setCommentData(prev => [...prev, ...data.data]);

            if (data.data.length < 9) {
                setShowMore(false);
            }

        } catch (err) {
            console.log(err);
        }
    }

    // console.log(userData)

    const handleDeleteComment = async () => {
        try {

            const response = await fetch(`/api/comment/${commentIdToDelete}`, {
                method: "DELETE",
                credentials: 'include',
                "Access-Control-Allow-Origin": "*",
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            // const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message);
            }

            setCommentData(prev => prev.filter(user => user._id !== commentIdToDelete));


        } catch (err) {
            console.log(err.message);
        }
    }


    return (
        <div className='table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && commentData.length > 0 ? (
                <>

                    <Table hoverable className='shadow-md'>

                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>Comment Content</Table.HeadCell>
                            <Table.HeadCell>Number of Likes</Table.HeadCell>
                            <Table.HeadCell>PostId</Table.HeadCell>
                            <Table.HeadCell>UserId</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>

                        {commentData.map(comment => {
                            return (
                                <Table.Body key={comment._id} className='divide-y'>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>

                                        <Table.Cell>
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </Table.Cell>

                                        

                                        <Table.Cell>
                                            {comment.content}
                                        </Table.Cell>

                                        <Table.Cell>
                                            {comment.numberOfLikes}
                                        </Table.Cell>

                                        <Table.Cell>
                                            {comment.postId}
                                        </Table.Cell>

                                        <Table.Cell>
                                            {comment.userId}
                                        </Table.Cell>

                                        {/* <Table.Cell>
                                            {comment.isAdmin ? <FaCheck className='text-green-500' /> : <FaTimes className='text-red-500' />}
                                        </Table.Cell> */}

                                        <Table.Cell>
                                            <span className='font-medium text-rose-500 hover:underline cursor-pointer' onClick={() => {
                                                setShowModal(true);
                                                setCommentIdToDelete(comment._id);

                                            }}>
                                                Delete
                                            </span>
                                        </Table.Cell>



                                    </Table.Row>
                                </Table.Body>
                            )
                        })}

                    </Table>

                    {showMore && (
                        <button className='w-full text-teal-500 self-center text-sm py-7' onClick={handleShowMore}>Show More</button>
                    )}

                </>
            ) :
                (
                    <p>You have no Comments Yet! </p>
                )}

            {
                <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>

                    <Modal.Header />

                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto' />
                            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this user?</h3>

                            <div className='flex items-center justify-center gap-5'>
                                <Button color='failure'
                                    onClick={() => {
                                        handleDeleteComment(commentIdToDelete);
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
            }
        </div>
    )
}

export default DashComments