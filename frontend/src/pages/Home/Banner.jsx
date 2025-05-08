import React from 'react'
import bannerImg from "../../assets/banner.png"
const Banner = () => {
  return (
    <div className='mx-auto max-w-6xl flex flex-col md:flex-row py-16 px-6 justify-evenly items-center gap-12'>

        <div className='md:w-1/2 w-full'>
            <h1 className='text-4xl md:text-5xl font-extrabold text-indigo-900 leading-tight tracking-tight mb-7'>Discover Your Next Great Read</h1>
            <p className='mb-10 text-gray-600 leading-relaxed '>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
            </p>

            <button className='bg-indigo-600 hover:bg-indigo-700 px-12 py-2 shadow-md hover:shadow-lg rounded-full text-base font-bold  hover:text-white transition-all duration-200 cursor-pointer'>
            Browse Books
            </button>
            <button className='ml-4 border-2 border-indigo-600 hover:bg-indigo-50 px-12 py-2 shadow-md hover:shadow-lg rounded-full text-base font-bold text-indigo-600 hover:text-indigo-800 transition-all duration-200 cursor-pointer'>
           New Releases
            </button>
            
        </div>


        <div className='md:w-1/2 w-full flex px-15 items-center md:justify-end'>
            <img 
  src={bannerImg} 
  alt="Library Book Collection" 
  className='rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300'
 />
        </div>
    </div>
  )
}

export default Banner
