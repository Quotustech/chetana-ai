'use client'
import React from 'react'
import Sidebar from '../Sidebar/Sidebar'
import ChatFeed from '../ChatFeed/ChatFeed'

const Home = () => {
  return (
    <div className='flex bg-white w-full h-svh dark:bg-[#0e1525] dark:text-white relative'>
        <Sidebar/>
        <ChatFeed/>
    </div>
  )
}

export default Home