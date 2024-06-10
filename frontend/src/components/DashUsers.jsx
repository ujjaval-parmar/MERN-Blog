import { Button, Modal, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';

import { FaCheck, FaTimes } from 'react-icons/fa'

const DashUsers = () => {

    const { currentUser } = useSelector(state => state.user);

    const [userData, setUserData] = useState([]);

    const [showMore, setShowMore] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    useEffect(() => {

        const getUsers = async () => {
            try {

                const response = await fetch(`/api/user`, {
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
                setUserData(data.data);

                if (data.data.length < 9) {
                    setShowMore(false);
                }


            } catch (err) {
                console.log(err);
            }
        }

        if (currentUser.isAdmin) {
            getUsers();
        }


    }, []);

    // console.log(userPosts);
    // console.log("postIdToDelete: ",postIdToDelete)

    const handleShowMore = async () => {
        const startIndex = userData.length;
        try {

            const response = await fetch(`/api/user?startIndex=${startIndex}&limit=9`, {
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

            console.log(data);

            setUserData(prev => [...prev, ...data.data]);

            if (data.data.length < 9) {
                setShowMore(false);
            }

        } catch (err) {
            console.log(err);
        }
    }

    // console.log(userData)

    const handleDeleteUser = async () => {
        try {

            const response = await fetch(`/api/user/admin-delete/${userIdToDelete}`, {
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

            setUserData(prev => prev.filter(user => user._id !== userIdToDelete));


        } catch (err) {
            console.log(err.message);
        }
    }


    return (
        <div className='table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && userData.length > 0 ? (
                <>

                    <Table hoverable className='shadow-md'>

                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>User Image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>

                        {userData.map(user => {
                            return (
                                <Table.Body key={user._id} className='divide-y'>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>

                                        <Table.Cell>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </Table.Cell>

                                        <Table.Cell>

                                            <img src={user.profilePicture} alt="user-img"
                                                className='w-10 h-10   object-cover bg-gray-500 rounded-full' />

                                        </Table.Cell>

                                        <Table.Cell>
                                            {user.username}
                                        </Table.Cell>

                                        <Table.Cell>
                                            {user.email}
                                        </Table.Cell>

                                        <Table.Cell>
                                            {user.isAdmin ? <FaCheck className='text-green-500'/> : <FaTimes className='text-red-500'/>}
                                        </Table.Cell>

                                        <Table.Cell>
                                            <span className='font-medium text-rose-500 hover:underline cursor-pointer' onClick={() => {
                                                setShowModal(true);
                                                setUserIdToDelete(user._id);

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
                    <p>You have no Users Yet! </p>
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
                                        handleDeleteUser();
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

export default DashUsers