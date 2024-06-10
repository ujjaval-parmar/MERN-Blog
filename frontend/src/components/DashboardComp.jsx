import { Button, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const DashboardComp = () => {

    const { currentUser } = useSelector(state => state.user);

    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {

            try {
                const response = await fetch(`/api/user?sortDirection=dec&limit=5`, {
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

                setLastMonthUsers(data.lastMonthsUsers);
                setUsers(data.data);
                setTotalUsers(data.totalUsers);

            } catch (err) {
                console.log(err);
            }


        }
        const fetchPosts = async () => {
            try {

                const response = await fetch(`/api/post/get-posts?sortDirection=dec&limit=5`, {
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
                setLastMonthPosts(data.lastMonthsPosts);
                setPosts(data.posts);
                setTotalPosts(data.lastMonthsPosts);



            } catch (err) {
                console.log(err);
            }

        }
        const fetchComments = async () => {
            try {

                const response = await fetch(`/api/comment/getAllComments?sortDirection=dec&limit=5`, {
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
                setComments(data.data);
                setLastMonthComments(data.lastMonthsComments);
                setTotalComments(data.totalComments);



            } catch (err) {
                console.log(err);
            }
        }


        if (currentUser?.isAdmin) {
            fetchUsers();
            fetchPosts();
            fetchComments();
        }

    }, [currentUser]);


    return (
        <div className='p-3 md:mx-auto' >

            {/* Stats Starts */}
            <div className='flex flex-wrap gap-3 justify-stretch items-center '>
                <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>

                        <div>
                            <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
                            <p className='text-2xl'>{totalUsers}</p>

                        </div>

                        <HiOutlineUserGroup className='bg-teal-500 text-white rounded-full text-5xl p-3 shadow-lg' />

                    </div>



                    <div className='flex gap-2 text-sm'>
                        <span className='text-gray-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthUsers}
                        </span>
                        <span className='text-gray-500'>Last month</span>
                    </div>

                </div>

                <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>

                        <div>
                            <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
                            <p className='text-2xl'>{totalPosts}</p>

                        </div>

                        <HiDocumentText className='bg-lime-500 text-white rounded-full text-5xl p-3 shadow-lg' />

                    </div>



                    <div className='flex gap-2 text-sm'>
                        <span className='text-gray-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthPosts}
                        </span>
                        <span className='text-gray-500'>Last month</span>
                    </div>

                </div>

                <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>

                        <div>
                            <h3 className='text-gray-500 text-md uppercase'>Total Comments</h3>
                            <p className='text-2xl'>{totalComments}</p>

                        </div>

                        <HiAnnotation className='bg-indigo-500 text-white rounded-full text-5xl p-3 shadow-lg' />

                    </div>



                    <div className='flex gap-2 text-sm'>
                        <span className='text-gray-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthComments}
                        </span>
                        <span className='text-gray-500'>Last month</span>
                    </div>

                </div>

            </div>
            {/* Stats Ends */}


            <div className='grid grid-rows-1 grid-cols-1  lg:grid-cols-2 gap-4   mt-4'>

                {/* User Table Starts */}
                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>

                    <div className='flex justify-between items-center p-3 text-sm font-semibold'>
                        <h2 className='text-center p-2'>Recent User</h2>
                        <NavLink to='/dashboard?tab=users'>
                            <Button
                                outline gradientDuoTone='purpleToPink'>
                                See all
                            </Button>
                        </NavLink>
                    </div>

                    <Table hoverable>

                        <Table.Head>


                            <Table.HeadCell>
                                User image
                            </Table.HeadCell>

                            <Table.HeadCell>
                                Username
                            </Table.HeadCell>


                        </Table.Head>

                        {users.length > 0 && users.map(user => {
                            return (
                                <Table.Body key={user._id} className='divide-y'>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>

                                        <Table.Cell>
                                            <img src={user.profilePicture} alt={user.username}
                                                className='w-10 h-10 rounded-full bg-gray-500'
                                            />
                                        </Table.Cell>

                                        <Table.Cell>
                                            {user.username}
                                        </Table.Cell>

                                    </Table.Row>
                                </Table.Body>
                            )
                        })}



                    </Table>


                </div>
                {/* User Table Ends */}

                {/* Comments Table Starts */}
                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>

                    <div className='flex justify-between items-center p-3 text-sm font-semibold'>
                        <h2 className='text-center p-2'>Recent Comments</h2>
                        <NavLink to='/dashboard?tab=comments'>
                            <Button
                                outline gradientDuoTone='purpleToPink'>
                                See all
                            </Button>
                        </NavLink>
                    </div>

                    <Table hoverable>

                        <Table.Head>


                            <Table.HeadCell>
                               Comment Content
                            </Table.HeadCell>

                            <Table.HeadCell>
                                Likes
                            </Table.HeadCell>


                        </Table.Head>

                        {comments.length > 0 && comments.map(comment => {
                            return (
                                <Table.Body key={comment._id} className='divide-y'>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>

                                        <Table.Cell className='line-clamp-2 '>
                                            {comment.content}
                                        </Table.Cell>

                                        <Table.Cell>
                                            {comment.numberOfLikes}
                                        </Table.Cell>

                                    </Table.Row>
                                </Table.Body>
                            )
                        })}



                    </Table>


                </div>
                {/* Comments Table Ends */}


                {/* Posts Table Starts */}
                <div className='flex flex-col  md:w-full shadow-md p-2 rounded-md dark:bg-gray-800 lg:col-span-2'>

                    <div className='flex justify-between items-center p-3 text-sm font-semibold'>
                        <h2 className='text-center p-2'>Recent Posts</h2>
                        <NavLink to='/dashboard?tab=posts'>
                            <Button
                                outline gradientDuoTone='purpleToPink'>
                                See all
                            </Button>
                        </NavLink>
                    </div>

                    <Table hoverable>

                        <Table.Head>


                            <Table.HeadCell>
                                Post image
                            </Table.HeadCell>

                            <Table.HeadCell>
                                Title
                            </Table.HeadCell>

                            <Table.HeadCell>
                                Category
                            </Table.HeadCell>


                        </Table.Head>

                        {posts.length > 0 && posts.map(post => {
                            return (
                                <Table.Body key={post._id} className='divide-y'>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>

                                        <Table.Cell>
                                            <img src={post.image} alt={post.title}
                                                className='w-14 h-10 rounded-md bg-gray-500 object-cover'
                                            />
                                        </Table.Cell>

                                        <Table.Cell className=''>
                                            {post.title}
                                        </Table.Cell>

                                        <Table.Cell className='w-5'>
                                            {post.category}
                                        </Table.Cell>

                                    </Table.Row>
                                </Table.Body>
                            )
                        })}



                    </Table>


                </div>
                {/* Posts Table Ends */}





            </div>




        </div>
    )
}

export default DashboardComp