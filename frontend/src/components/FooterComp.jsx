import { Footer } from 'flowbite-react'
import React from 'react'
import { NavLink } from 'react-router-dom'

import { BsFacebook, BsInstagram, BsTwitter, BsGithub } from 'react-icons/bs';

const FooterComp = () => {
  return (
    <Footer container className='border border-t-8 border-teal-500'>

      <div className="w-full max-w-7xl mx-auto">
        <div className=" w-full grid justify-between items-center sm:flex md:grid-cols-1 ">

          <div className="">
            <NavLink to='/' className=" font-bold dark:text-white text-lg sm:text-xl">
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Ujjaval's</span>
              Blog
            </NavLink>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">

            <div className="">
              <Footer.Title title='About' />
              <Footer.LinkGroup title='About' col>
                <Footer.Link href='#'>MERN-BLOG</Footer.Link>
                <Footer.Link href='#'>About Us</Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div className="">
              <Footer.Title title='Follow Us' />
              <Footer.LinkGroup title='About' col>
                <Footer.Link href='#'>Github</Footer.Link>
                <Footer.Link href='#'>Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div className="">
              <Footer.Title title='Legal' />
              <Footer.LinkGroup title='About' col>
                <Footer.Link href='#'>Privacy Policy</Footer.Link>
                <Footer.Link href='#'>Terms & Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>


          </div>


        </div>

        <Footer.Divider />

        <div className="sm:flex sm:justify-between sm:items-center">

          <Footer.Copyright className='text-center' href='#' by="Ujjaval's bolg" year={new Date().getFullYear()} />

          <div className="flex gap-4 justify-center mt-5 sm:mt-0 ">
            <Footer.Icon href='#' icon={BsFacebook} />
            <Footer.Icon href='#' icon={BsGithub} />
            <Footer.Icon href='#' icon={BsInstagram} />
            <Footer.Icon href='#' icon={BsTwitter} />
          </div>

        </div>

      </div>



    </Footer>
  )
}

export default FooterComp