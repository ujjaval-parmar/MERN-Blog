import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

const PostPage = () => {

    const { postSlug } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [recentPosts, setRecentPosts] = useState([]);

    useEffect(() => {

        const getPost = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`/api/post/get-posts?slug=${postSlug}`, {
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
                setPost(data.posts[0]);




            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }


        getPost();



    }, [postSlug]);

    useEffect(()=>{
        const getRecentPosts = async()=>{
            try{
                const response = await fetch(`/api/post/get-posts?sortDirection=dsc&limit=3`, {
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


                setRecentPosts(data.posts);

            }catch(err){
                console.log(err.message);
            }
        }   

        getRecentPosts();
    }, []);


    if (loading) return (
        <div className='flex justify-center items-center min-h-screen'>
            <Spinner size='xl' />
        </div>

    )

    return (
        <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>

            <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post?.title}</h1>

            <NavLink to={`/search?category=${post?.category}`} className='self-center mt-5'>
                <Button className='' color='gray' pill size='xs'>
                    {post?.category}
                </Button>
            </NavLink>

            <img src={post?.image} alt={post?.title} className='mt-10 p-3 max-h-[600px] object-cover w-full' />

            <div className="flex justify-between p-3 border-b border-s-lime-500 mx-auto w-full max-w-2xl text-xs">
                <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
                <span className='italic'>{(post?.content.length / 1000).toFixed(0)} mins read</span>
            </div>

            <div className="post-content p-3 max-w-2xl mx-auto w-full "
                dangerouslySetInnerHTML={{
                    __html: post?.content
                }}

            ></div>

            <CommentSection postId={post?._id} />

            <div className='flex flex-col justify-center items-center mb-5 '>
                <h1 className='text-xl mt-5'>Recent Articles</h1>

                <div className='my-5 grid grid-cols-1 justify-center gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-4'>
                    {recentPosts.length>0 && recentPosts.map(post=>{
                        return <PostCard key={post._id} post={post} />
                    })}
                </div>


            </div>


        </main>
    )
}

export default PostPage