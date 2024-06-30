import { Button, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import PostCard from '../components/PostCard';

const Search = () => {

    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized'
    });

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);

    const loaction = useLocation();


    useEffect(() => {

        const urlParams = new URLSearchParams(loaction.search);
        const searchTermFromURL = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');

        if (searchTermFromURL || sortFromUrl || categoryFromUrl) {
            setSidebarData(() => {
                return {
                    ...sidebarData,
                    searchTerm: searchTermFromURL ,
                    sort: sortFromUrl || 'desc',
                    category: categoryFromUrl || 'uncategorized'
                }
            });

        }


        // console.log('in: ', sidebarData);
        // console.log(searchTermFromURL, sortFromUrl, categoryFromUrl);

        const getSearchPosts = async () => {
            try {
                setLoading(true);
                const searchQuery = urlParams.toString();
                const response = await fetch(`/api/post/get-posts?${searchQuery}`, {
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

                setPosts(data.posts);

                if (data.posts.length === 9) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }

            } catch (err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        }

        getSearchPosts();


    }, [location.search]);

    // console.log(sidebarData, posts);

    const handleChange = e => {
        if (e.target.id === 'searchTerm') {
            setSidebarData({ ...sidebarData, searchTerm: e.target.value });
            return;
        }

        if (e.target.id === 'sort') {
            setSidebarData({ ...sidebarData, sort: e.target.value || 'desc' });
            return;
        }

        if (e.target.id === 'category') {
            setSidebarData({ ...sidebarData, category: e.target.value || 'uncategorized' });
            return;
        }

    }

    // console.log(sidebarData, posts); 
    const handleSubmit = (e) => {

        e.preventDefault();


        const getSearchPosts = async () => {
            try {
                setLoading(true);
                
                const response = await fetch(`/api/post/get-posts?searchTerm=${sidebarData.searchTerm}&order=${sidebarData.sort}&category=${sidebarData.category}`, {
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

                setPosts(data.posts);

                if (data.posts.length === 9) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }

            } catch (err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        }

        getSearchPosts();
    }

    

    const handleShowMore = async () => {
        const startIndex = posts.length;
        try {

            const response = await fetch(`/api/post/get-posts?startIndex=${startIndex}&searchTerm=${sidebarData.searchTerm}&order=${sidebarData.sort}&category=${sidebarData.category}`, {
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
        <div className='flex flex-col md:flex-row'>

            <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'    >

                    <div className=" flex items-center gap-2">
                        <label className='whitespace-nowrap font-semibold' htmlFor='searchTerm'>Search Term:</label>
                        <TextInput
                            type='text'
                            placeholder='Search Term...'
                            id='searchTerm'
                            value={sidebarData.searchTerm}
                            onChange={(e) => handleChange(e)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className='whitespace-nowrap font-semibold' htmlFor='sort'>Sort:</label>
                        <Select onChange={handleChange}
                            value={sidebarData.sort}
                            id='sort'
                            className=''>
                            <option value="desc" >Latest</option>
                            <option value="asc" >Oldest</option>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className='whitespace-nowrap font-semibold' htmlFor='category'>Category:</label>
                        <Select onChange={handleChange}
                            value={sidebarData.category || 'uncategorized'}
                            id='category'
                            className=''>
                            <option value="uncategorized" >uncategorized</option>
                            <option value="reactjs" >React js</option>
                            <option value="javascript" >Javascript</option>
                            <option value="nextjs" >Next js</option>

                        </Select>
                    </div>


                    <Button type='submit' outline>
                        Search
                    </Button>

                </form>
            </div>


            <div className='max-w-6xl mx-auto'>
                <div className=" p-3 grid grid-cols-1  lg:grid-cols-3 gap-6 place-items-center my-5">



                    {posts.length > 0 && posts.map(post => {
                        return <PostCard key={post._id} post={post} />
                    })}
                </div>

                {showMore && <button className='w-full text-teal-500 self-center text-sm py-7' onClick={handleShowMore} >Show More</button>}
            </div>


        </div>
    )
}

export default Search