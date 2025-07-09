import React from 'react'
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'

const HomePage = () => {
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      {/* Container chính */}
      <div className="flex flex-col md:flex-row w-full sm:w-[95%] md:w-[90%] xl:w-[70%] h-[70vh] rounded-lg overflow-hidden bg-gray-100 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-60 shadow-2xl">
        <Sidebar />
        <MessageContainer />
      </div>
    </div>
  )
}

export default HomePage
