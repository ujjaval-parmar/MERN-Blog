import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';

const Header = () => {

    const { currentUser } = useSelector(state => state.user);

    const { theme } = useSelector(state=> state.theme);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');



    const loacation = useLocation();
    const path = location.pathname;
    // console.log(path)

    useEffect(()=>{

        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl);
        }



    }, [ location.search]);

    // console.log(searchTerm);

    const handleSignout = async() =>{
        try{
            const response = await fetch('/api/user/signout', {method: 'POST'});

            const data = await response.json();

            if(!response.ok){
                console.log(data.message);
                return;
            }

            console.log(data);

            dispatch(signoutSuccess());

            navigate('/sign-in');

        }catch(err){
            console.log(err);
        }
    }

    // console.log(searchTerm);

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        // console.log(urlParams.toString());
        const searchQuery = urlParams.toString();
        navigate('/search?'+searchQuery);
    }

    return (
        <Navbar className='border-b-2'>

            <NavLink to='/' className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
                <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Ujjaval's</span>
                Blog
            </NavLink>


            <form onSubmit={handleSubmit}>
                <TextInput
                    type='text'
                    placeholder='Search...'
                    rightIcon={AiOutlineSearch}
                    className='hidden lg:inline'
                    value={searchTerm}
                    onChange={(e)=> setSearchTerm(e.target.value)}
                />
            </form>

            <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                <AiOutlineSearch />
            </Button>

            <div className="flex items-center gap-2 md:order-2">

                <Button className='w-12 h-10  inline' color='gray' pill onClick={()=> dispatch(toggleTheme())}>
                   {theme === 'light' ? <FaMoon /> : <FaSun />} 
                </Button>

                {currentUser ?

                    (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={<Avatar img={currentUser.profilePicture} rounded bordered />}
                        >

                            <Dropdown.Header>
                                <span className='block text-sm'>@{currentUser.username}</span>
                                <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                            </Dropdown.Header>

                            <NavLink to='/dashboard?tab=profile'>
                                <Dropdown.Item>
                                    Profile
                                </Dropdown.Item>
                            </NavLink>

                            <Dropdown.Divider />

                            <Dropdown.Item onClick={handleSignout}>
                                Sign Out
                            </Dropdown.Item>


                        </Dropdown >
                    )

                    : (<NavLink to='/sign-in'>
                        <Button gradientDuoTone='purpleToBlue' outline>
                            Sign In
                        </Button>
                    </NavLink>)}


                <Navbar.Toggle />

            </div >

            <Navbar.Collapse>

                <Navbar.Link active={path === '/'} as={'div'}>
                    <NavLink to='/' >Home</NavLink>
                </Navbar.Link>

                <Navbar.Link active={path === '/about'} as={'div'}>

                    <NavLink to='/about'>About</NavLink>
                </Navbar.Link>

                <Navbar.Link active={path === '/projects'} as={'div'}>
                    <NavLink to='/projects'>Projects</NavLink>
                </Navbar.Link>

            </Navbar.Collapse >


        </Navbar >
    )
}

export default Header