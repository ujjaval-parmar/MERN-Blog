import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';




const UpdatePost = () => {

    const navigate = useNavigate();

    const { postId } = useParams();

    const { currentUser } = useSelector(state => state.user)


    const [file, setFile] = useState(null);


    const [formData, setFormData] = useState({
        category: "",
        content: "",
        createdAt: "",
        image: "",
        slug: "",
        title: "",
        updatedAt: "",
        userId: "",
        __v: '',
        _id: "",
    });

    const [content, setContent] = useState(null);


    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(0);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);

    const [imageFileUploading, setImageFileUplodaing] = useState(false);

    const [publishError, setPublishError] = useState(null);

    const handleChange = e => {
        // console.dir(e)
        setFormData(() => ({ ...formData, [e.target.id]: e.target.value }));
    }

    useEffect(() => {
        const getPost = async () => {
            try {
                setPublishError(null);
                const response = await fetch(`/api/post/get-posts?postId=${postId}`, {
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
                setFormData(data.posts[0]);
                setContent(data.posts[0].content);


            } catch (err) {
                setPublishError(err.message);
            }
        }

        getPost();

    }, [postId]);

    // console.log(formData);

    const handleUploadImage = async (e) => {
        try {


            setImageFileUploadError(null);

            if (!file) {
                setImageFileUploadError('Please select an Image!');
                return;
            }

            const storage = getStorage(app);

            const fileName = new Date().getTime() + file.name;

            const storageRef = ref(storage, fileName);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageFileUploadingProgress(progress.toFixed(0));
                },
                error => {
                    setImageFileUploadError(error);
                    setImageFileUploadingProgress(null);
                    // setImageFile(null);
                    // setImageFileUrl(null);
                    setImageFileUplodaing(false);

                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then(downloadURL => {
                            // setImageFileUrl(downloadURL);
                            setImageFileUplodaing(false);
                            setFormData({ ...formData, image: downloadURL })
                        })
                }
            )


        } catch (err) {
            setImageFileUploadError(err);
            setImageFileUploadingProgress(null);
            //    console.log(err)

        }
    }

    // console.log(file, imageFileUploadError, imageFileUploadingProgress)
    // console.log(formData);


    const submitHandler = async (e) => {
        e.preventDefault();

        const body = { ...formData, content };

        // console.log(body);

        try {
            setPublishError(null);

            const response = await fetch(`/api/post/update-post/${postId}/${currentUser._id}`, {
                method: "PUT",
                credentials: 'include',
                "Access-Control-Allow-Origin": "*",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message);
            }

            // console.log(data);

            navigate('/post/' + data.data.slug)

        } catch (err) {
            setPublishError(err.message);
        }

    }


    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>

            <h1 className='text-center text-3xl my-7 font-semibold'>Update A Post</h1>

            <form onSubmit={submitHandler} className='flex flex-col gap-4'>

                <div className="flex flex-col gap-4 sm:flex-row justify-between">

                    <TextInput type='text' placeholder='Title' id='title' className='flex-1' required onChange={handleChange} value={formData?.title} />

                    <Select id='category' onChange={handleChange} value={formData?.category}>

                        <option value="uncategorized"> Select a Category</option>
                        <option value="javascript"> Javascript</option>
                        <option value="reactjs"> React.js</option>
                        <option value="nextjs">Next.js </option>

                    </Select>

                </div>

                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                    <FileInput tpe='file' accept='image/*' onChange={e => setFile(e.target.files[0])} />
                    <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline onClick={handleUploadImage} disabled={imageFileUploadingProgress}>
                        {imageFileUploadingProgress ? (<div className='w-6 h-6'>
                            <CircularProgressbar value={imageFileUploadingProgress} text={`${imageFileUploadingProgress || 0}%`} />
                        </div>) : 'Upload'}
                    </Button>
                </div>
                {imageFileUploadError && (
                    <Alert color='failure'>
                        {imageFileUploadError}
                    </Alert>
                )}

                {formData?.image && (
                    <img src={formData.image} alt="img" className='w-full object-cover' />
                )}


                <ReactQuill id='content' theme='snow' placeholder='Write something....' className='h-72 mb-12' required onChange={setContent} value={content} />

                {publishError && (
                    <Alert color='failure' className='my-5'>
                        {publishError}
                    </Alert>
                )}

                <Button type='submit' gradientDuoTone='purpleToPink'>
                    Update Post
                </Button>

            </form>

        </div>
    )
}

export default UpdatePost