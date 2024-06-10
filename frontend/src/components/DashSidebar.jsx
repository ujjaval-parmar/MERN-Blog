import { Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const DashSidebar = () => {

    const location = useLocation();


    const { currentUser } = useSelector(state => state.user);

    const dispatch = useDispatch();

    const navigate = useNavigate()

    const [tab, setTab] = useState('');


    useEffect(() => {

        const urlParams = new URLSearchParams(location.search);

        const tabFromUrl = urlParams.get('tab');

        // console.log(tabFromUrl);

        if (tabFromUrl) {
            setTab(tabFromUrl);
        }

    }, [location.search])

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


    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-2'>

                    {currentUser.isAdmin && <NavLink to='/dashboard?tab=dashboard'>
                        <Sidebar.Item active={tab === 'dashboard'} icon={HiChartPie} labelColor='dark' as={'div'} >
                            Dashboard
                        </Sidebar.Item>
                    </NavLink>}

                    <NavLink to='/dashboard?tab=profile'>
                        <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark' as={'div'} >
                            Profile
                        </Sidebar.Item>
                    </NavLink>

                    {currentUser.isAdmin && <NavLink to='/dashboard?tab=posts'>
                        <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} as={'div'}>
                            Posts
                        </Sidebar.Item>
                    </NavLink>}

                    {currentUser.isAdmin && <NavLink to='/dashboard?tab=users'>
                        <Sidebar.Item active={tab === 'users'} icon={HiOutlineUserGroup} as={'div'}>
                            Users
                        </Sidebar.Item>
                    </NavLink>}


                    {currentUser.isAdmin && <NavLink to='/dashboard?tab=comments'>
                        <Sidebar.Item active={tab === 'comments'} icon={HiAnnotation} as={'div'}>
                            Comments
                        </Sidebar.Item>
                    </NavLink>}

                    <Sidebar.Item active icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignout}
                    >
                        Sign Out
                    </Sidebar.Item>



                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar >
    )
}

export default DashSidebar