import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";



const DashboardPage = () => {

  const location = useLocation();

  const [tab, setTab] = useState('');

  useEffect(()=>{

    const urlParams = new URLSearchParams(location.search);

    const tabFromUrl = urlParams.get('tab');

    // console.log(tabFromUrl);

    if(tabFromUrl){
      setTab(tabFromUrl);
    }

  }, [location.search])

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      

      <div className="sidebar md:w-56">
          <DashSidebar />
      </div>

      {/* Tab */}
      {tab === 'profile' && <DashProfile />}
      {tab === 'posts' && <DashPosts />}
      {tab === 'users' && <DashUsers />}
      {tab === 'comments' && <DashComments />}
      {tab === 'dashboard' && <DashboardComp />}

    </div>
  )
}

export default DashboardPage