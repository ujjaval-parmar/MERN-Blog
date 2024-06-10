import { Button, Modal, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const DashPosts = () => {

    const { currentUser } = useSelector(state => state.user);

    const [userPosts, setUserPosts] = useState([]);

    const [showMore, setShowMore] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);

    useEffect(() => {

        const getPosts = async () => {
            try {

                const response = await fetch(`/api/post/get-posts`, {
                    // method: "POST",
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
                setUserPosts(data.posts);

                if (data.posts.length < 9) {
                    setShowMore(false);
                }


            } catch (err) {
                console.log(err);
            }
        }

        if (currentUser.isAdmin) {
            getPosts();
        }


    }, [currentUser._id]);

    // console.log(userPosts);
    // console.log("postIdToDelete: ",postIdToDelete)

    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {

            const response = await fetch(`/api/post/get-posts?userId=${currentUser._id}&startIndex=${startIndex}`, {
                // method: "POST",
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

            setUserPosts(prev => [...prev, ...data.posts]);

            if (data.posts.length < 9) {
                setShowMore(false);
            }

        } catch (err) {
            console.log(err);
        }
    }

    const handleDeletePost = async() =>{
        try{
            console.log(postIdToDelete);
            const response = await fetch(`/api/post/delete-post/${postIdToDelete}/${currentUser._id}`, {
                method: "DELETE",
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

            setUserPosts(prev=> prev.filter(post=> post._id !== postIdToDelete));


        }catch(err){
            console.log(err.message);
        }
    }


    return (
        <div className='table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <>

                    <Table hoverable className='shadow-md'>

                        <Table.Head>
                            <Table.HeadCell>Date Updated</Table.HeadCell>
                            <Table.HeadCell>Post Image</Table.HeadCell>
                            <Table.HeadCell>Post Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell><span>Edit</span></Table.HeadCell>
                        </Table.Head>

                        {userPosts.map(post => {
                            return (
                                <Table.Body key={post._id} className='divide-y'>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>

                                        <Table.Cell>
                                            {new Date(post.updatedAt).toLocaleDateString()}
                                        </Table.Cell>

                                        <Table.Cell>
                                            <NavLink to={`/post/${post.slug}`}>
                                                <img src={post.image} alt="post-img"
                                                    className='w-20 h-10   object-cover bg-gray-500' />
                                            </NavLink>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <NavLink to={`/post/${post.slug}`}
                                                className='font-medium text-gray-900 dark:text-white'>
                                                {post.title}
                                            </NavLink>
                                        </Table.Cell>

                                        <Table.Cell>
                                            {post.category}
                                        </Table.Cell>

                                        <Table.Cell>
                                            <span className='font-medium text-rose-500 hover:underline cursor-pointer' onClick={() => {
                                                // console.log(post._id)
                                                setShowModal(true);
                                                setPostIdToDelete(post._id);

                                            }}>
                                                Delete
                                            </span>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <NavLink to={`/update-post/${post._id}`} >
                                                <span className='text-teal-500 hover:underline cursor-pointer'>Edit</span>
                                            </NavLink>
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
                    <p>You have no Posts Yet! </p>
                )}

            {
                <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>

                    <Modal.Header />

                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto' />
                            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this post?</h3>

                            <div className='flex items-center justify-center gap-5'>
                                <Button color='failure'
                                    onClick={()=>{
                                        handleDeletePost();
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

export default DashPosts