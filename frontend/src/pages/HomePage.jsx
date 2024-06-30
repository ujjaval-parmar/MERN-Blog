import { Button } from "flowbite-react";
import { useEffect, useState } from "react";

import { NavLink } from 'react-router-dom'
import PostCard from "../components/PostCard";

const HomePage = () => {

  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {

    const getRecentPosts = async () => {
      try {
        const response = await fetch(`/api/post/get-posts?order=desc&limit=9`, {
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


        setPosts(data.posts);

      } catch (err) {
        console.log(err.message);
      }
    }

    getRecentPosts();



  }, []);

  // console.log(posts);

  const handleShowMore = async () => {
    const startIndex = posts.length;
    try {

      const response = await fetch(`/api/post/get-posts?startIndex=${startIndex}`, {
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

      setPosts(prev => [...prev, ...data.posts]);

      if (data.posts.length < 9) {
        setShowMore(false);
      }

    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div>

      <div className="flex flex-col gap-6 px-3 p-28 max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to Ujjaval's Blog</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <NavLink to='/search' className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'>
          View all Posts
        </NavLink>

      </div>


      <div>
        <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>

        <div className="max-w-6xl mx-auto p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center my-5">



          {posts.length > 0 && posts.map(post => {
            return <PostCard key={post._id} post={post} />
          })}
        </div>

        {showMore && <button className='w-full text-teal-500 self-center text-sm py-7' onClick={handleShowMore} >Show More</button>}
        
      </div>



    </div>
  )
}

export default HomePage