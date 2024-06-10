import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { deleteFailure, deleteStart, deleteSuccess, signoutSuccess, updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const DashProfile = () => {

    const navigate = useNavigate();
    const { currentUser, loading, error } = useSelector(state => state.user);
    const dispatch = useDispatch();

    // console.log(currentUser, loading, error);


    const [formData, setFormData] = useState({
        username: currentUser.username || null,
        email: currentUser.email || null,

    });
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);

    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);

    const [imageFileUploading, setImageFileUplodaing] = useState(false);

    const [updateUserSuccess, setupdateUserSuccess] = useState(null);
    const [updateUserError, setupdateUserError] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const filePickerRef = useRef();


    const handleChange = e => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    // console.log(formData);

    const handleImageChnage = e => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(e.target.files[0]);
            setImageFileUrl(URL.createObjectURL(file));
        }
    }

    useEffect(() => {

        if (imageFile) {
            uploadImage();
        }


    }, [imageFile]);


    const uploadImage = async () => {

        setImageFileUplodaing(true);
        setImageFileUploadError(null);

        const storage = getStorage(app);

        const fileName = new Date().getTime() + imageFile.name;

        const storageRef = ref(storage, fileName);

        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadingProgress(progress.toFixed(0));
            },
            error => {
                setImageFileUploadError('Could not uplodad image (File mustbe less than 2MB');
                setImageFileUploadingProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUplodaing(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(downloadURL => {
                        setImageFileUrl(downloadURL);
                        setImageFileUplodaing(false);
                    })
            }
        )

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (imageFileUploading) {
            setupdateUserError('Please wait for iamge to Upload!');
            return;
        }
        setupdateUserSuccess(null);
        setupdateUserError(null);
        try {
            dispatch(updateStart());
            const response = await fetch('/api/user/update/' + currentUser._id, {
                method: 'PUT',
                credentials: 'include',
                "Access-Control-Allow-Origin": "*",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username || undefined,
                    email: formData.email || undefined,
                    password: formData.password || undefined,
                    profilePicture: imageFileUrl || undefined
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // setupdateUserError(data.error || data.message);
                throw new Error(data.error || data.message);
            }

            // console.log(data);
            dispatch(updateSuccess(data.data));
            setupdateUserSuccess("User's profile updated successfully!");

        } catch (err) {
            setupdateUserError(err.message);
            dispatch(updateFailure(err.message));
        }

    }

    const handleDeleteUser = async () => {
        setShowModal(false);
        dispatch(deleteStart());
        try {

            const response = await fetch('/api/user/delete/' + currentUser._id, {
                method: 'DELETE',

            });
            // const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || data.messgae);
            }

            dispatch(deleteSuccess());
            navigate('/sign-in');

        } catch (err) {
            dispatch(deleteFailure(err.message));
        }
    }

    const handleSignout = async () => {
        try {
            const response = await fetch('/api/user/signout', { method: 'POST' });

            const data = await response.json();

            if (!response.ok) {
                console.log(data.message);
                return;
            }

            console.log(data);

            dispatch(signoutSuccess());

            navigate('/sign-in');

        } catch (err) {
            console.log(err);
        }
    }

    // console.log(imageFileUploadingProgress, imageFileUploadError, imageFileUrl);
    // console.log(updateUserError);
    return (
        <div className='max-w-lg mx-auto p-4 w-full'>

            <h1 className='my-7 text-3xl font-semibold text-center'>Profile</h1>

            <input type="file" accept='image/*' onChange={handleImageChnage} ref={filePickerRef} hidden />


            <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full relative" onClick={() => filePickerRef.current.click()}>
                    {imageFileUploadingProgress && (
                        <CircularProgressbar value={imageFileUploadingProgress || 0} text={`${imageFileUploadingProgress}%`} strokeWidth={5}
                            styles={{
                                root: {
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                },
                                path: {
                                    stroke: `rgba(62, 152, 199, ${imageFileUploadingProgress / 100})`,
                                }

                            }} />
                    )}
                    <img src={imageFileUrl || currentUser.profilePicture} alt="user-profile-pic" className={`inline-block rounded-full w-full h-full border-8 border-[lightgray] object-cover ${imageFileUploadingProgress && imageFileUploadingProgress < 100 && 'opacity-60'}`} />
                </div>

                {imageFileUploadError && <Alert color='failure'>
                    {imageFileUploadError}
                </Alert>
                }

                <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username}
                    onChange={handleChange} />

                <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email}
                    onChange={handleChange} />

                <TextInput type='password' id='password' placeholder='Password'
                    onChange={handleChange} />

                <Button type='submit' gradientDuoTone='purpleToBlue' outline disabled={loading || imageFileUploading}>
                    {loading ? 'Loading...' : 'Update'}
                </Button>



                {updateUserSuccess && (
                    <Alert color='success' className='mt-5'>
                        {updateUserSuccess}
                    </Alert>
                )}

                {updateUserError && (
                    <Alert color='failure' className='mt-5'>
                        {updateUserError}
                    </Alert>
                )}

                {/* {error && (
                    <Alert color='failure' className='mt-5'>
                        {error}
                    </Alert>
                )} */}

                {
                    currentUser.isAdmin && (
                        <NavLink to='/create-post'>
                            <Button type='button'
                                gradientDuoTone='purpleToPink'
                                className='w-full '>
                                Create a post
                            </Button>
                        </NavLink>
                    )
                }

            </form>

            <div className="text-red-500 flex justify-between mt-4">
                <span className='cursor-pointer' onClick={() => setShowModal(true)}>Delete Account</span>
                <span className='cursor-pointer' onClick={handleSignout}>Sign Out </span>
            </div>

            {
                <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>

                    <Modal.Header />

                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto' />
                            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>

                            <div className='flex items-center justify-center gap-5'>
                                <Button color='failure'
                                    onClick={handleDeleteUser}
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

export default DashProfile